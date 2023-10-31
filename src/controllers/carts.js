import { ProductError, CartError } from '../dao/errors.js';
import { Carts, Products } from '../dao/factory.js';

const addCart = async (req, res) => {
    try {
        const id = await Carts.addCart()
        res.send({ status: 'success', 'cartId': id })
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}

const getCartByID = async (req, res) => {
    try {
        const id = req.params.cid
        const { products } = await Carts.getCartByID(id)
        res.send({ products })
    } catch (error) {
        if (error instanceof CartError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
}

const addProductToCart = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const product = await Products.getProductById(pid)
        if (product.stock <= 0) throw new ProductError(400, 'Producto sin stock')
        await Carts.addProductToCart(cid, pid)
        res.send({status: 'success'})
    } catch (error) {
        if (error instanceof CartError || error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
}

const deleteProductFromCart = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        await Carts.deleteProductFromCart(cid, pid)
        res.send({status: 'success'})
    } catch (error) {
        if (error instanceof CartError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
}

const updateProducts = async (req, res) => {
    try {
        const cid = req.params.cid
        const products = req.body
        await Carts.updateProducts(cid, products)
        res.send({status: 'Success'})
    } catch (error) {
        if (error instanceof CartError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
}

const updateProductQuantity = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity
        await Carts.updateProductQuantity(cid, pid, quantity)
        res.send({status: 'Success'})
    } catch (error) {
        if (error instanceof CartError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
}

const clearProducts = async (req, res) => {
    try {
        const cid = req.params.cid
        await Carts.clearProducts(cid)
        res.send({status: 'Success'})
    } catch (error) {
        if (error instanceof CartError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
}

export default { addCart, getCartByID, addProductToCart, deleteProductFromCart, updateProducts, updateProductQuantity, clearProducts }