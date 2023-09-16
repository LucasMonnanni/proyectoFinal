import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

export const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: { type: String, required: 'El campo {PATH} es obligatorio.' },
    description: { type: String, required: 'El campo {PATH} es obligatorio.' },
    price: {
        type: Number,
        required: 'El campo {PATH} es obligatorio.',
        cast: 'El campo {PATH} debe ser un número'
    },
    code: {
        type: String,
        required: 'El campo {PATH} es obligatorio.',
        unique: true
    },
    stock: {
        type: Number,
        required: 'El campo {PATH} es obligatorio.',
        cast: 'El campo {PATH} debe ser un número'
    },
    category: { type: String, required: 'El campo {PATH} es obligatorio.' },
    status: { 
        type: Boolean,
        default: true,
        cast: "El campo {PATH} debe ser 'true' o 'false'"
    },
    thumbnails: [String],
})

productSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, productSchema)