// Path: src\controller\UserController\index.ts
console.log(__dirname)

import express from 'express';
import { ObjectId } from 'mongodb';
import { verifyJWToken } from 'src/auth';
import { connect, getPosts } from 'src/mongo';

export const userController = express.Router();

// get user route
userController.get("/user/:id", async (req, res) => {
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

// follow/unfollow user
userController.put('/users/:id/follow', async (req, res) => {
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
