import mongoose from 'mongoose';

const cartCollection = 'carts';

// El subschema no era la única manera de hacerlo pero dado lo que vimos en la última clase
// queda listo para un populate en cuanto lo necesite.
const productSchema = new mongoose.Schema({ id: mongoose.ObjectId, quantity: Number });
const cartSchema = new mongoose.Schema({
    products: {
        type: [productSchema]
    }
})

export const cartModel = mongoose.model(cartCollection, cartSchema)