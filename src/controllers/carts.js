import { ProductError, CartError } from '../dao/errors.js';
import { ProductDAO } from '../dao/factory.js';
import Carts from '../services/carts.js';
import Products from '../services/products.js';
import Tickets from '../services/tickets.js';

const addCart = async (req, res) => {
    try {
        const id = await Carts.addCart()
        res.send({ status: 'Success', 'cartId': id })
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}

const getCartById = async (req, res) => {
    try {
        const cid = req.params.cid
        const products = await Carts.getCartById(cid)
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
        await Carts.addProductToCart(cid, pid)
        res.send({status: 'Success'})
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
        if (error instanceof CartError || error instanceof ProductError) {
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

const purchaseCart = async (req, res) => {
    try {
        const cid = req.params.cid
        const { purchased, amount } = await Carts.purchaseCart(cid)
        if (purchased.length) {
            await Products.deductStock(purchased)
            await Tickets.create(cid, amount, req.user)
        }
        res.send({status: 'Success'})
    } catch(error) {
        console.log(error)
        res.status(500).send()
    }
}

export default { addCart, getCartById, addProductToCart, deleteProductFromCart, updateProducts, updateProductQuantity, clearProducts, purchaseCart }