import express from 'express';
import { UserModel } from '../db/users';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
const validateRegisterInput = require("./../validations/register");
const validateLoginInput = require("./../validations/login");

const router = express.Router();

router.post('/login', validateLoginInput, async (req, res) => {
    const {credential, password} = req.body;
    if (!credential || !password) {
        return res.status(400).send("Missing fields");
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
        res.status(200).json({user: user._id, token: accessToken})
    }
    else {
        return res.status(400).send("Email or password is not valid");
    }
})

router.post('/currentUser', async (req, res, next) => {
    const {token} = req.body;
    if (!token) {
        return res.status(400).send("Not logged in");
    }
    const user = jwt.decode(token);
    if (!user) {
        return res.status(400).send("Not logged in");
    }
    res.status(200).send({user})
})

router.post('/register', validateRegisterInput, async (req, res, next) => {
    const {username, email, password} = req.body;
    let errors = [];
    if (!username || !email || !password) {
        errors.push("Missing fields");
    }
    if (await UserModel.findOne({email})) {
        errors.push("Email already taken");
    }
    if (await UserModel.findOne({username})) {
        errors.push("Username already taken");
    }
    if (errors.length) {
        return res.status(400).send(errors);
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
        res.status(400).send("User data is not valid");
    }
})

export default router;