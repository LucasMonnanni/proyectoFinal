import { Router } from 'express';
import { ProductError } from '../dao/errors.js';
import { uploader } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
    const { limit, page, query, sort } = req.query
    const params = {
        limit: limit || 10,
        page: page || 1,
        query: JSON.parse(query || {})
    }
    if (sort) params.sort = sort
    let products = await req.pm.getProducts(params)
    res.send(products)
})

router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const product = await req.pm.getProductById(id)
        console.log(product)
        res.send(product)
    } catch (error) {
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
})

router.post('/', uploader.array('thumbnails'), async (req, res) => {
    try {
        const thumbnails = req.files.map((f) => `${f.destination}/${f.filename}`)
        const { title, description, price, code, stock, category, status } = req.body

        const product = await req.pm.addProduct(title, description, price, thumbnails, code, stock, category, status)
        console.log(product)
        res.send({ status: 'success', payload: product })
    } catch (error) {
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
})

router.put('/:pid', uploader.array('thumbnails'), async (req, res) => {
    try {
        const pid = req.params.pid
        const productData = req.body

        if (req.files) { productData.thumbnails = req.files.map((f) => `${f.destination}/${f.filename}`) }

        const product = await req.pm.updateProduct(pid, productData)
        res.send({ status: 'success', payload: product })
    } catch (error) {
        console.log(error.stack)
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        await req.pm.deleteProduct(pid)
        res.send({ status: 'success' })
    } catch(error) {
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
})

export default router;
