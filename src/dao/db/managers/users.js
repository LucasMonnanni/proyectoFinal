import mongoose from 'mongoose'
import { userModel } from '../models/users.js'
import { UserError } from '../../errors.js';

export const UserManager = {
    addUser: async (data) => {
        try {
            const user = await userModel.create(data)
            return user
        } catch (error) {
            if (/^E11000/.test(error.message)) {
                //El código de error misterioso no es de mongoose si no de Mongo en sí, es el 'duplicate key error' 
                throw new UserError(400, 'El usuario ya existe')
            } else {
                throw new UserError(500, 'Error al crear el usuario: ' + error)
            }
        }
    },
    getUser: async (data) => {
        const user = userModel.findOne(data)
        return user
    },
    getUserById: async (id) => {
        const user = userModel.findById(id)
        return user
    }
}
