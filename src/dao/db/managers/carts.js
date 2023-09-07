import { cartModel } from '../models/carts.js';
import { CartError } from '../../errors.js'
import mongoose from 'mongoose'

export const CartManager = {
    addCart: async () => {
        const cart = await cartModel.create({})
        return cart._id
    },

    getCartByID: async (id) => {
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
        const cart = await CartManager.getCartByID(cid) //refiero a la otra función para no duplicar el manejo de errores
        const pIdx = cart.products.findIndex((v, i) => v.id == pid)
        if (pIdx == -1) {
            cart.products.push({
                id: pid,
                quantity: 1
            })
        } else {
            cart.products[pIdx].quantity += 1
        }
        cart.save()
    }
}