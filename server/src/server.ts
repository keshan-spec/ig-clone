import cors from 'cors'
import express from 'express';
import { corsOptionsDelegate, createJWToken, hash, verifyJWToken } from "./auth";
import { config } from 'dotenv';
import cookieParser from 'cookie-parser'
import { connect, getPosts } from './mongo';
import { PostData } from './types';
import multer from 'multer';
import { uploadImage } from './firebase';
import { ObjectId } from 'mongodb';

const upload = multer({ storage: multer.memoryStorage() });

config()
const app = express(); // create express app
app.use(cookieParser()) // use cookie parser middleware
app.use(cors(corsOptionsDelegate))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (_req, res) => { res.send("Hello Insta") })

// register route
app.post("/register", async (req, res) => {
    const { username, password } = req.body

    if (!username) return res.status(400).send({ error: "MissingUsername", message: "Missing username" })
    if (!password) return res.status(400).send({ error: "MissingPassword", message: "Missing password" })

    const db = await connect();
    const usersCollection = db.collection("users");

    try {
        // check if the username is already taken
        const user = await usersCollection.findOne({ username })
        if (user) return res.status(400).send({ error: "UsernameTaken", message: "Username already taken" })

        // Hash the password
        const hashedPassword = hash(password);

        // Insert the new user document into the collection
        const result = await usersCollection.insertOne({ username, hashedPassword, isPrivate: false, followers: [], following: [] });
        console.log("User created:", result.insertedId);
        return res.send(result)
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).send(error)
    }
})

// Auth route
app.post("/auth", async (req, res) => {
    const { username, password } = req.body

    if (!username) return res.status(400).send({ error: "MissingUsername", message: "Missing username" })
    if (!password) return res.status(400).send({ error: "MissingPassword", message: "Missing password" })

    const db = await connect();
    const usersCollection = db.collection("users");

    try {
        // Find the user with the provided username
        const user = await usersCollection.findOne({ username })

        // If the user is not found
        if (!user) return res.status(400).send({ error: "UserNotFound", message: "User not found" })

        // If the password is incorrect
        if (user.hashedPassword !== hash(password)) return res.status(400).send({ error: "IncorrectPassword", message: "Incorrect password" })

        const token = createJWToken({ authData: { userId: user._id } }) // create a new token

        return res.send(token)
    } catch (error) {
        console.error("Error finding user:", error);
        return res.status(400).send(error)
    }

})

// get user route
app.get("/user/:id", async (req, res) => {
    let token = req.header('Authorization')

    token = token?.split(' ')[1]

    const { id } = req.params

    if (!token) return res.status(401).send({ error: "MissingToken", message: "Missing token" })

    const decodedToken = verifyJWToken(token)
    if (!decodedToken) return res.status(401).send({ error: "Invalid token" })

    const { userId } = decodedToken.authData
    if (!userId) return res.status(500).send({ error: "Unable to get user from token" })

    try {
        // get the user from the database
        const db = await connect();
        const usersCollection = db.collection("users");

        // Convert the id parameter to ObjectId type
        const objectId = new ObjectId(id);

        const user = await usersCollection.findOne({ _id: objectId })
        if (!user) return res.status(404).send({ error: "UserNotFound", message: "User not found" })

        // get the posts of the user
        const posts = await getPosts("1", "5", id)

        // add the posts to the user object
        user.posts = posts

        // check if the user is the owner of the profile
        const isOwner = user._id.toString() === userId.toString()
        const isFollowing = user.followers && user.followers.includes(userId)

        if (!isOwner && user.isPrivate && !isFollowing) return res.status(401).send({ error: "UserPrivacySetting", message: "Unauthorized to view user profile" })

        // remove the hashed password from the user object
        delete user.hashedPassword

        // return the user
        return res.send({
            user: {
                isOwner,
                ...user
            }
        })
    } catch (error) {
        return res.status(500).send({ error: "InternalServer", message: "Internal server error" })
    }
})


// Logout route
app.post("/logout", async (req, res) => {
    const token = req.header('Authorization')
    if (!token) return res.status(401).send({ error: "MissingToken", message: "Missing token" })

    // TODO: Add the token to the blacklist

    return res.send({ message: "Logged out" })
})

// create post route
app.post('/posts', upload.single("image"), async (req, res) => {
    let token = req.header('Authorization')
    token = token?.split(' ')[1]
    // if no token, return error
    if (!token) return res.status(401).send({ error: "Missing token" })

    const decodedToken = verifyJWToken(token)
    if (!decodedToken) return res.status(401).send({ error: "Invalid token" })

    const { userId } = decodedToken.authData
    if (!userId) return res.status(500).send({ error: "Unable to get user from token" })

    // Post Data
    const { description } = req.body as PostData
    const file = req.file

    if (!description) return res.status(400).send({ error: "MissingDescription", message: "Missing description" })
    if (!file) return res.status(400).send({ error: "FileNotFound", message: "File not found" })

    try {
        // push the image to the storage bucket firebase
        const { buffer, originalname } = file

        const downloadURL = await uploadImage(buffer, originalname)
        // save the post data to the database
        const db = await connect();
        const postsCollection = db.collection("posts");

        const result = await postsCollection.insertOne({ description, imageUrl: downloadURL, ownerId: userId, likes: [] });
        return res.status(201).send({
            id: result.insertedId,
            description,
            imageUrl: downloadURL
        })
    } catch (error) {
        return res.status(400).send(error)
    }
})

// Get posts
app.get('/posts', async (req, res) => {
    let token = req.header('Authorization')
    token = token?.split(' ')[1]

    // get params for pagination
    const { page = 1, limit = 5 } = req.query

    if (!token) return res.status(401).send({ error: "TokenNotFound", message: "Token not found" })
    const decodedToken = verifyJWToken(token)
    if (!decodedToken) return res.status(401).send({ error: "Invalid token" })

    try {
        const posts = await getPosts(page as string, limit as string)
        return res.send(posts)
    } catch (error) {
        return res.status(500).send(error)
    }
})

// Get post by id
app.get('/posts/:id', async (req, res) => {
    let token = req.header('Authorization')
    token = token?.split(' ')[1]
    const { id } = req.params

    if (!token) return res.status(401).send({ error: "TokenNotFound", message: "Token not found" })
    const decodedToken = verifyJWToken(token)
    if (!decodedToken) return res.status(401).send({ error: "Invalid token" })

    const { userId } = decodedToken.authData
    if (!userId) return res.status(500).send({ error: "Unable to get user from token" })

    try {
        // get the post from the database
        const db = await connect();
        const postsCollection = db.collection("posts");

        // Convert the id parameter to ObjectId type
        const objectId = new ObjectId(id);

        const post = await postsCollection.findOne({ _id: objectId })
        if (!post) return res.status(404).send({ error: "PostNotFound", message: "Post not found" })
        return res.send(post)
    }
    catch (error) {
        return res.status(500).send({ error: "InternalServer", message: "Internal server error" })
    }
})

// delete post
app.delete('/posts/:id', async (req, res) => {
    let token = req.header('Authorization')

    token = token?.split(' ')[1]

    const { id } = req.params

    if (!token) return res.status(401).send({ error: "TokenNotFound", message: "Token not found" })

    const decodedToken = verifyJWToken(token)
    if (!decodedToken) return res.status(401).send({ error: "Invalid token" })

    const { userId } = decodedToken.authData

    if (!userId) return res.status(500).send({ error: "Unable to get user from token" })

    try {
        // get the post from the database
        const db = await connect();
        const postsCollection = db.collection("posts");

        // Convert the id parameter to ObjectId type
        const objectId = new ObjectId(id);

        const post = await postsCollection.findOne({ _id: objectId })
        if (!post) return res.status(404).send({ error: "PostNotFound", message: "Post not found" })

        // check if the user is the owner of the post
        if (post.ownerId !== userId) return res.status(401).send({ error: "Unauthorized", message: "Unauthorized" })

        // delete the post
        await postsCollection.deleteOne({ _id: objectId })

        return res.send({ message: "Post deleted" })
    } catch (error) {
        return res.status(500).send({ error: "InternalServer", message: "Internal server error" })
    }
})

// like/unlike post
app.put('/posts/:id/like', async (req, res) => {
    let token = req.header('Authorization')
    token = token?.split(' ')[1]

    const { id } = req.params

    if (!token) return res.status(401).send({ error: "TokenNotFound", message: "Token not found" })
    const decodedToken = verifyJWToken(token)
    if (!decodedToken) return res.status(401).send({ error: "Invalid token" })

    const { userId } = decodedToken.authData
    if (!userId) return res.status(500).send({ error: "Unable to get user from token" })

    try {
        // get the post from the database
        const db = await connect();
        const postsCollection = db.collection("posts");

        // Convert the id parameter to ObjectId type
        const objectId = new ObjectId(id);

        const post = await postsCollection.findOne({ _id: objectId })
        if (!post) return res.status(404).send({ error: "PostNotFound", message: "Post not found" })

        let result;
        if (post.likes && post.likes.includes(userId)) {
            // remove the user from the likes array
            await postsCollection.updateOne({ _id: objectId }, { $pull: { likes: userId } })
            result = { message: "Post unliked", currentLikes: post.likes.length - 1 }
        } else {
            // add the user to the likes array
            await postsCollection.updateOne({ _id: objectId }, { $push: { likes: userId } })
            result = { message: "Post liked", currentLikes: post.likes.length + 1 }
        }

        return res.send(result)
    } catch (error) {
        return res.status(500).send({ error: "InternalServer", message: "Internal server error" })
    }

})

// follow/unfollow user
app.put('/users/:id/follow', async (req, res) => {
    let token = req.header('Authorization')

    token = token?.split(' ')[1]

    const { id } = req.params

    if (!token) return res.status(401).send({ error: "TokenNotFound", message: "Token not found" })

    const decodedToken = verifyJWToken(token)
    if (!decodedToken) return res.status(401).send({ error: "Invalid token" })

    const { userId } = decodedToken.authData

    if (!userId) return res.status(500).send({ error: "Unable to get user from token" })


    try {
        // get the user from the database
        const db = await connect();

        const usersCollection = db.collection("users");

        // Convert the id parameter to ObjectId type
        const objectId = new ObjectId(id);

        const user = await usersCollection.findOne({ _id: objectId })
        if (!user) return res.status(404).send({ error: "UserNotFound", message: "User not found" })

        let result;
        if (user.followers && user.followers.includes(userId)) {
            // remove the user from the followers array
            await usersCollection.updateOne({ _id: objectId }, { $pull: { followers: userId } })

            // remove the user from the following array
            await usersCollection.updateOne({ _id: userId }, { $pull: { following: objectId } })

            result = { message: "User unfollowed", currentFollowers: user.followers.length - 1 }
        } else {
            // add the user to the followers array
            await usersCollection.updateOne({ _id: objectId }, { $push: { followers: userId } })

            // add the user to the following array
            await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $push: { following: objectId } })

            result = { message: "User followed", currentFollowers: user.followers.length + 1 }
        }

        return res.send(result)
    } catch (error) {
        return res.status(500).send({ error: "InternalServer", message: "Internal server error" })
    }
})


// start express server on port 5001
const port = 5001;

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))