import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { config } from 'dotenv';
config()

const USER = process.env.MONGO_DB_USERNAME;
const PASSWORD = process.env.MONGO_DB_PWD;
const CLUSTER_URL = process.env.MONGO_CLUSTER_URL;

const uri = `mongodb+srv://${USER}:${PASSWORD}@${CLUSTER_URL}?retryWrites=true&w=majority`;

export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export const connect = async () => {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        const db = client.db('instagram-clone');
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

export const getPosts = async (page: string, limit: string, ownerId?: string | number) => {
    // get all posts from the database
    const db = await connect();
    const postsCollection = db.collection("posts");

    // pagination
    const total = await postsCollection.countDocuments(
        ownerId ? { ownerId } : {}
    )
    const posts = await postsCollection
        .find(ownerId ? { ownerId } : {})
        .sort({ createdAt: -1 })
        .skip((parseInt(page as string) - 1) * parseInt(limit as string))
        .limit(parseInt(limit as string))
        .toArray()

    // get the username of the owner
    const usersCollection = db.collection("users");
    for (let i = 0; i < posts.length; i++) {
        const data = await usersCollection.findOne({ _id: new ObjectId(posts[i].ownerId) })
        posts[i].username = data?.username
    }


    return {
        data: posts,
        count: posts.length,
        limit: parseInt(limit as string),
        total,
        page: parseInt(page as string),
    }
}