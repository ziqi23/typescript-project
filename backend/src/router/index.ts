import express from 'express';
import { UserModel } from '../db/users';
import bcrypt from 'bcrypt'

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({response: "return all users"});
})

router.post('/', async (req, res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        throw new Error("Missing fields");
    }
    if (UserModel.findOne({email})) {
        throw new Error("Email already taken")
    }

    const hashedPassword = bcrypt.hash(password, 10);
    UserModel.create({
        username,
        email,
        passwordHash: password
    })
})

export default router;