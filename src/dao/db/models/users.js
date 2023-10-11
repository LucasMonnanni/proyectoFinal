import mongoose from 'mongoose';
import { cartCollection } from './carts.js';

export const userCollection = 'users';

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    passwordHash: String,
    cart: {
        type: mongoose.ObjectId,
        ref: cartCollection
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    }
})

export const userModel = mongoose.model(userCollection, userSchema)