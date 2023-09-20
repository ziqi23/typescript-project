// console.log('hi tsx')
import express from 'express';
import mongoose from 'mongoose';
import router from './router';
import dotenv from 'dotenv'

const app = express();

app.listen(5000, () => {
    console.log("Server running on port 5000");
})

app.use('/api/users', router);

dotenv.config();
const MONGO_PASSWORD = process.env.SECRET;
const MONGO_URL = `mongodb+srv://brianzou1:${MONGO_PASSWORD}@cluster0.5dp8qt5.mongodb.net/?retryWrites=true&w=majority`

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on(`error`, (error : Error) => console.log(error));