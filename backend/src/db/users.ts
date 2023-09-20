import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: false},
    passwordHash: {type: String, required: true}
})

export const UserModel = mongoose.model('User', UserSchema);