import fs from 'fs'
import { CartError } from '../../errors.js'

export class CartManager {
    constructor(path) {
        this.path = path
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path, 'utf8')
            const carts = JSON.parse(data)
            // No es bonito pero si el json es un array vacio el Math.max me devuelve -infinity
            if (carts.length) {
                this.nextCartID = Math.max(...carts.map((c)=> c.id)) + 1;
                return
            }
        }
        this.nextCartID = 0
    }

    getCarts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf8')
            return JSON.parse(data)
        } else {
            return []
        }
    }

    addCart = async () => {
        const carts = await this.getCarts()
        const id = this.nextCartID
        this.nextCartID += 1
        carts.push({id, products: []})
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
        return id
    }

    getCartIndexByID = (carts, id) => {
        const idx = carts.findIndex((v, i) => v.id == id)
        if (idx == -1) {
            const error = `Carrito con ID ${id} no encontrado`
            throw new CartError(404, error)
        }
        return idx
    }

    getCartByID = async (id) => {
        const carts = await this.getCarts()
        const idx = this.getCartIndexByID(carts, id)
        return carts[idx].products
    }

    addProductToCart = async (cid, pid) => {
        const carts = await this.getCarts()
        const cIdx = this.getCartIndexByID(carts, cid)
        const cart = carts[cIdx]
        const pIdx = cart.products.findIndex((v, i) => v.id == pid)
        if (pIdx == -1) {
            cart.products.push({
                id: pid,
                quantity: 1
            })
        } else {
            cart.products[pIdx].quantity += 1
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
    }
}