import mongoose from 'mongoose';

const messageCollection = 'messages';

const messageSchema = new mongoose.Schema({
    //No agregué validación al mail porque ya está en del lado del socket del cliente.
    user: String,
    message: String,
})

export const messageModel = mongoose.model(messageCollection, messageSchema)