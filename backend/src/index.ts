import express from 'express';
import mongoose from 'mongoose';
import userRouter from './router/userRouter';
import alertRouter from './router/alertRouter';
import eventRouter from './router/eventRouter';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';

const app = express();

app.listen(5000, () => {
    console.log("Server running on port 5000");
})

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use('/api/users', userRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/events', eventRouter);

dotenv.config();
const MONGO_PASSWORD = process.env.SECRET;
const MONGO_URL = `mongodb+srv://brianzou1:${MONGO_PASSWORD}@cluster0.5dp8qt5.mongodb.net/?retryWrites=true&w=majority`

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on(`error`, (error : Error) => console.log(error));