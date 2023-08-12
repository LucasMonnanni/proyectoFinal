import { Router } from 'express';
import { CartError, CartManager } from '../managers/carts.js';
import { resolve } from 'path';

const router = Router();

const path = resolve('./carts.json')
const cm = new CartManager(path)

router.post('/', async (req, res) => {
    try {
        const id = await cm.addCart()
        res.send({ status: 'success', 'cartId': id })
    } catch (error) {
        if (error instanceof CartError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            res.status(500).send()
        }
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const id = req.params.cid
        const products = await cm.getCartByID(id)
        res.send({ products })
    } catch (error) {
        if (error instanceof CartError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            res.status(500).send()
        }
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        await cm.addProductToCart(cid, pid)
        res.send({ status: 'success' })
    } catch (error) {
        if (error instanceof CartError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            res.status(500).send()
        }
    }
})

export default router;