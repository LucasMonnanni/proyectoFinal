import { Router } from 'express';
import { ProductManager, ProductError } from '../managers/products.js';
import { resolve } from 'path';
import { uploader } from '../utils.js';

const router = Router();

const path = resolve('./products.json')
const pm = new ProductManager(path)

router.get('/', async (req, res) => {
    let products = await pm.getProducts()
    const start = req.query.start ?? 0
    const limit = req.query.limit
    if (limit) {
        products = products.splice(start, limit)
    }
    res.send(products)
})

router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const product = await pm.getProductById(id)
        res.send(product)
    } catch (error) {
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            res.status(500).send()
        }
    }
})

router.post('/', uploader.array('thumbnails'), async (req, res) => {
    try {
        const thumbnails = req.files.map((f) => `${f.destination}/${f.filename}`)
        const { title, description, price, code, stock, category, status } = req.body

        const product = await pm.addProduct(title, description, price, thumbnails, code, stock, category, status)

        res.send({ status: 'success' })
    } catch (error) {
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            res.status(500).send()
        }
    }
})

router.put('/:pid', uploader.array('thumbnails'), async (req, res) => {
    try {
        const pid = req.params.pid
        const productData = req.body

        if (req.files) { productData.thumbnails = req.files.map((f) => `${f.destination}/${f.filename}`) }

        const product = await pm.updateProduct(pid, productData)
        res.send({ status: 'success' })
    } catch (error) {
        console.log(error.stack)
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            res.status(500).send()
        }
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        await pm.deleteProduct(pid)
        res.send({ status: 'success' })
    } catch(error) {
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            res.status(500).send()
        }
    }
})

export default router;