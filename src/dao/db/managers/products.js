import { productModel } from '../models/products.js'
import { ProductError } from '../../errors.js'
import mongoose from 'mongoose'

export const ProductManager = {
    addProduct: async (title, description, price, thumbnails, code, stock, category, status) => {
        try {
            return await productModel.create({
                title, 
                description,
                price,
                code,
                category,
                stock,
                status,
                thumbnails,
            })
        } catch (error) {
            handleMongoErrors(error)
        }
    },

    getProductById: async (id) => {
        let product
        try {
            product = await productModel.findById(id)
        } catch(error) {
            handleMongoErrors(error)
        }
        if (!product) throw new ProductError(404, 'Producto no encontrado')
        return product
    },

    getProducts: async (params) => {
        return await productModel.paginate(params.query, {limit: params.limit, page: params.page, sort: params.sort})
    },

    updateProduct: async (pid, productData) => {
        // Separo el posible campo thumbnails para agregar al array en vez de sobreescribirlo (no aclara nada la consigna pero me parece mas logico, usted dira)
        const { thumbnails, ...data } = productData
        let product
        if (Array.isArray(thumbnails)) {
            data['$push'] =  {thumbnails: {$each: thumbnails}}
        }
        try{
            product = await productModel.findByIdAndUpdate(
                pid,
                data,
                {new: true}
            )
        } catch(error) {
            handleMongoErrors(error)
        }
        if (!product) throw new ProductError(404, 'Producto no encontrado')
        return product
    },

    deleteProduct: async (id) => {
        let product
        try {
            product = await productModel.findByIdAndDelete(id)
        } catch(error) {
            handleMongoErrors(error)
        }
        if (!product) throw new ProductError(404, 'Producto no encontrado')
        return product
    },

    deductStock: async (items) => {
        return await productModel.bulkWrite(items.map(item => {
            return {
                updateOne: {
                    filter: {_id: item._id},
                    update: {
                        $inc: {
                            stock: -item.quantity
                        }
                    }
                }
            }
        }))
    }
}

function handleMongoErrors(error) {
    if (error instanceof mongoose.Error) {
        // esta rama es fea pero al validar muchos campos en simultáneo si falla mongoose devuelve un array de errores 
        // envuelto en otro error. No encontré otra manera de hacer llegar los mensajes definidos en el schema a la response.
        let message = ''
        if (error.errors) {
            for (const key in error.errors) {
                if (Object.hasOwnProperty.call(error.errors, key)) {
                    const element = error.errors[key]
                    message += `${key}: ${element.message} \n`
                }
            }
        } else if (error instanceof mongoose.CastError) {
            message = `El ID indicado no es correcto`
        }
        throw new ProductError(400, message)
    } else if (/^E11000/.test(error.message)) {
        //El código de error misterioso no es de mongoose si no de Mongo en sí, es el 'duplicate key error'
        const error = 'Código de producto ya utilizado'
        throw new ProductError(409, error)
    } else {
        throw new Error()
    }
}

