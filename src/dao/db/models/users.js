import mongoose from 'mongoose';

export const userCollection = 'users';

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    passwordHash: String,
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    }
})

export const userModel = mongoose.model(userCollection, userSchema)