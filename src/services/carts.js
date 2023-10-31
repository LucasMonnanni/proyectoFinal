import { CartDAO, ProductDAO } from '../dao/factory.js';
import { ProductError } from '../dao/errors.js';

export default {
    addCart: async () => {
        return await CartDAO.addCart()
    },
    getCartById: async (id) => {
        const { products } = await CartDAO.getCartById(id)
        return products
    },
    addProductToCart: async (cid, pid) => {
        const product = await ProductDAO.getProductById(pid)
        if (product.stock <= 0) throw new ProductError(400, 'Producto sin stock')
        await CartDAO.addProductToCart(cid, pid)
    },
    deleteProductFromCart: async(cid, pid) => {
        await CartDAO.deleteProductFromCart(cid, pid)
    },
    updateProducts: async (id, products) => {
        await CartDAO.updateProducts(id, products)
    },
    updateProductQuantity: async (cid, pid, quantity) => {
        const product = await ProductDAO.getProductById(pid)
        if (product.stock < quantity) throw new ProductError(400, 'Producto sin stock')
        await CartDAO.updateProductQuantity(cid, pid, quantity) 
    },
    clearProducts: async (id) => {
        await CartDAO.clearProducts(id)
    }
}