import mongoose from 'mongoose';
import { productCollection } from './products.js';

export const cartCollection = 'carts';

// El subschema no era la única manera de hacerlo pero dado lo que vimos en la última clase
// queda listo para un populate en cuanto lo necesite.
const cartSchema = new mongoose.Schema({
    products: {
        type: [
            { product: 
                {
                    type: mongoose.ObjectId,
                    ref: productCollection
                }, 
                quantity: Number 
            }
        ]
    }
})

cartSchema.pre('findOne', function() {
    this.populate('products.product')
})

export const cartModel = mongoose.model(cartCollection, cartSchema)