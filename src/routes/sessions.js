import { Router } from "express";
import { userModel } from "../dao/db/models/users.js";
import { createHash, isValidPassword, isAdmin } from "../utils.js";

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (isAdmin(email, password)) {
            req.session.user = {
                firstName: 'Coder',
                lastName: 'Admin',
                email,
                role: 'admin'
            }
        } else {
            const user = await userModel.findOne({email})
            if (!user) {
                console.log('Usuario no encontrado')
                res.status(400).send({status: 'Error', message: 'Usuario no encontrado'})
                return
            }
            if (!isValidPassword(user, password)) {
                console.log('Contraseña incorrecta')
                res.status(400).send({status: 'Error', message: 'Contraseña incorrecta'})
                return
            }
            req.session.user = user
        }
        res.redirect('/products/')
    } catch (error) {
        console.log(error)
        res.status(500).send({status: 'Error'})
    }
})

router.post('/register', async (req, res) => {
    try {
        const {password, ...data} = req.body
        data.passwordHash = createHash(password)
        const user = await userModel.create(data)
        req.session.user = user
        res.redirect('/products/')
    } catch (error) {
        console.log(error)
        res.status(500).send({status: 'Error'})
    }
})

router.delete('/logout', async (req, res) => {
    req.session.destroy( error => {
        if (error) {
            res.status(500).send({status: 'Error'})
            return
        }
        res.redirect('/login')
    })
})

export default router;