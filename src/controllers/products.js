import { stringify } from 'querystring';
import Products from '../services/products.js';


const getProducts = async (req, res) => {
    const { limit, page, query, sort } = req.query

    let data = await Products.getProducts(limit, page, query, sort)

    const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = data
    const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl + '/?'

    let prevLink = null
    let nextLink = null
    const metaData = { limit }
    if (query) metaData.query = query
    if (sort) metaData.sort = sort
    if (data.hasPrevPage) {
        metaData.page = +page - 1
        prevLink = baseUrl + stringify(metaData)
    }
    if (data.hasNextPage) {
        metaData.page = +page + 1
        nextLink = baseUrl + stringify(metaData)
    }
    res.send({ status: 'Success', payload: docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage, prevLink, nextLink })
}

const getProductById = async (req, res) => {
    try {
        const id = req.params.pid
        const product = await Products.getProductById(id)
        res.send(product)
    } catch (error) {
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
}

const addProduct = async (req, res) => {
    try {
        const thumbnails = req.files.map((f) => `${f.destination}/${f.filename}`)
        const { title, description, price, code, stock, category, status } = req.body

        const product = await Products.addProduct(title, description, price, thumbnails, code, stock, category, status)
        res.send({ status: 'Success', payload: product })
    } catch (error) {
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
}

const updateProduct = async (req, res) => {
    try {
        const pid = req.params.pid
        const productData = { ...req.body, files: req.files}
        
        const product = await Products.updateProduct(pid, productData)
        res.send({ status: 'Success', payload: product })
    } catch (error) {
        console.log(error.stack)
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
}

const deleteProduct = async (req, res) => {
    try {
        const pid = req.params.pid
        await Products.deleteProduct(pid)
        res.send({ status: 'Success' })
    } catch (error) {
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
}

export default { getProducts, getProductById, addProduct, updateProduct, deleteProduct }