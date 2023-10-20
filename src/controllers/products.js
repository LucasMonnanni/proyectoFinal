import { ProductError } from '../dao/errors.js';
import { stringify } from 'querystring'


const getProducts = async (req, res) => {
    const { limit, page, query, sort } = req.query
    const params = {
        limit: limit || 10,
        page: page || 1,
        query: JSON.parse(query || '{}')
    }
    if (['asc', 'desc'].includes(sort)) {
        params.sort = { price: sort }
    } else {
        params.sort = {}
    }

    let data = await req.pm.getProducts(params)

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
        const product = await req.pm.getProductById(id)
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

        const product = await req.pm.addProduct(title, description, price, thumbnails, code, stock, category, status)
        res.send({ status: 'success', payload: product })
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
}

const deleteProduct = async (req, res) => {
    try {
        const pid = req.params.pid
        await req.pm.deleteProduct(pid)
        res.send({ status: 'success' })
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