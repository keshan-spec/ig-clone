// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { uuid } from 'uuidv4';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBBChKTzzSPELPSkZ4_CZKR4w1WNx5BdYk",
    authDomain: "igclone-fba86.firebaseapp.com",
    projectId: "igclone-fba86",
    storageBucket: "igclone-fba86.appspot.com",
    messagingSenderId: "985711452625",
    appId: "1:985711452625:web:223b3793d93efe2fcb40f0",
    measurementId: "G-37DN84N0C6"
};


// Initialize Firebase - You should already have this part in your code
const app = initializeApp(firebaseConfig);
export const storageBucket = getStorage(app);

export const uploadImage = async (buffer: Buffer, originalname: string) => {
    // create unique filename
    const filename = `${uuid()}-${originalname}`;

    // Get a reference to the storage bucket and specify the path where the image should be stored
    const storageRef = ref(storageBucket, `images/${filename}`);

    // Upload the image bytes to the specified path
    await uploadBytes(storageRef, buffer);

    // Get the download URL of the uploaded image
    const url = await getDownloadURL(storageRef);
    return url;
}
