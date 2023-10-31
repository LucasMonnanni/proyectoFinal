import { cartModel } from '../models/carts.js';
import { CartError } from '../../errors.js'
import mongoose from 'mongoose'

export const CartManager = {
    addCart: async () => {
        const cart = await cartModel.create({})
        return cart._id
    },

    getCartById: async (id) => {
        let cart
        try {
            cart = await cartModel.findById(id)
        } catch (error) {
            console.log(error)
            if (error instanceof mongoose.CastError) { // Errores de tipos de dato, en este caso el ID no es legible como ObjectId
                throw new CartError(400, `El ID indicado no es correcto`)
            } else {
                throw new Error()
            }
        }
        if (!cart) throw new CartError(404, 'Carrito no encontrado')
        return cart
    },

    addProductToCart: async (cid, pid) => {
        let res
        try {
            res = await cartModel.updateOne(
                {
                    _id: cid,
                    'products.product': pid
                },
                {
                    $inc: {
                        'products.$.quantity': 1
                    }
                }
            )
            if (res.modifiedCount == 0) {
                res = await cartModel.findByIdAndUpdate(
                    cid,
                    {
                        $push: {
                            products: {
                                product: pid,
                                quantity: 1
                            }
                        }
                    },
                    {
                        new: true
                    }
                )
            }
        } catch(error) {
            console.log(error)
            if (error instanceof mongoose.CastError) { // Errores de tipos de dato, en este caso el ID no es legible como ObjectId
                throw new CartError(400, `El ID indicado no es correcto`)
            } else {
                throw new Error()
            }
        }
        
        if (!res) throw new CartError(404, 'Carrito no encontrado')
    },

    deleteProductFromCart: async (cid, pid) => {
        let res;
        try {
            res = await cartModel.findByIdAndUpdate(
                cid,
                {
                    $pull: {
                        products: {
                            product: pid
                        }
                    }
                }
            )
        } catch(error) {
            if (error instanceof mongoose.CastError) { // Errores de tipos de dato, en este caso el ID no es legible como ObjectId
                throw new CartError(400, `El ID indicado no es correcto`)
            } else {
                throw new Error()
            }
        }
        if (!res) throw new CartError(404, 'Carrito no encontrado')
    },

    updateProducts: async (cid, products) => {
        let cart;
        try {
            cart = await cartModel.findByIdAndUpdate(
                cid,
                {
                    products: products
                }
            )
        } catch(error) {
            if (error instanceof mongoose.CastError) { // Errores de tipos de dato, en este caso el ID no es legible como ObjectId
                throw new CartError(400, `El ID indicado no es correcto`)
            } else {
                throw new Error()
            }
        }

        if (!cart) throw new CartError(404, 'Carrito no encontrado')
    },

    updateProductQuantity: async (cid, pid, quantity) => {
        let res;
        try {
            res = await cartModel.updateOne(
                {
                    _id: cid,
                    'products.product': pid
                },
                {
                    $set: {
                        'products.$.quantity': quantity
                    }
                }
            )
        } catch(error) {
            if (error instanceof mongoose.CastError) { // Errores de tipos de dato, en este caso el ID no es legible como ObjectId
                throw new CartError(400, `El ID indicado no es correcto`)
            } else {
                throw new Error()
            }
        }
        if (res.modifiedCount == 0 ) new CartError(400, 'Producto no encontrado en el carrito')
        if (!res) throw new CartError(404, 'Carrito no encontrado')
    },

    clearProducts: async (cid) => {
        let cart;
        try {
            cart = await cartModel.findByIdAndUpdate(
                cid,
                {
                    products: []
                }
            )
        } catch(error) {
            if (error instanceof mongoose.CastError) { // Errores de tipos de dato, en este caso el ID no es legible como ObjectId
                throw new CartError(400, `El ID indicado no es correcto`)
            } else {
                throw new Error()
            }
        }
        if (!cart) throw new CartError(404, 'Carrito no encontrado')
    }
}