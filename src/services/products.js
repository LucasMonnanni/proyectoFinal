import { ProductDAO } from '../dao/factory.js';

export default {
    getProducts: async (limit, page, query, sort) => {
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
        return await ProductDAO.getProducts(params)
    },
    getProductById: async (id) => {
        return await ProductDAO.getProductById(id)
    },
    addProduct: async (title, description, price, thumbnails, code, stock, category, status) => {
        return await ProductDAO.addProduct(title, description, price, thumbnails, code, stock, category, status)
    },
    updateProduct: async (id, data) => {
        if (data.files) { 
            data.thumbnails = data.files.map((f) => `${f.destination}/${f.filename}`) 
            delete data.files
        }
        return await ProductDAO.updateProduct(id, data)
    },
    deleteProduct: async (id) => {
        await ProductDAO.deleteProduct(id)
    }
}
