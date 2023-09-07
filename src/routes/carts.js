import { Router } from 'express';
import { ProductError, CartError } from '../dao/errors.js';
import { resolve } from 'path';

const router = Router();

const path = resolve('./carts.json')

router.post('/', async (req, res) => {
    try {
        const id = await req.cm.addCart()
        res.send({ status: 'success', 'cartId': id })
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const id = req.params.cid
        const products = await req.cm.getCartByID(id)
        res.send({ products })
    } catch (error) {
        if (error instanceof CartError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const product = await req.pm.getProductById(pid)
        if (product.stock <= 0) throw new ProductError(400, 'Producto sin stock')
        await req.cm.addProductToCart(cid, pid)
        res.send({status: 'success'})
    } catch (error) {
        if (error instanceof CartError || error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
})

export default router;