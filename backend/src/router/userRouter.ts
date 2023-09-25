import express from 'express';
import { UserModel } from '../db/users';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
    console.log("body is", req.body)
    const {credential, password} = req.body;
    if (!credential || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await UserModel.findOne({email: credential}) || await UserModel.findOne({username: credential});
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user._id
                }
            },
            process.env.ACCESS_TOKEN_SECRET
        )
        res.status(200).json({accessToken})
    }
    else {
        res.status(401);
        throw new Error("Email or password is not valid");
    }
})

router.post('/currentUser', async (req, res) => {
    const {token} = req.body;
    if (!token) {
        throw new Error("No valid token");
    }
    const user = jwt.decode(token);
    res.send({user})
})

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        throw new Error("Missing fields");
    }
    if (await UserModel.findOne({email})) {
        throw new Error("Email already taken")
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
        username,
        email,
        passwordHash: hashedPassword
    })
    if (user) {
        res.status(200).json({_id: user._id, email: user.email});
    }
    else {
        res.status(400);
        throw new Error("User data is not valid");
    }
})

export default router;