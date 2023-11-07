import { Router } from "express";
import Carts from '../services/carts.js'

const router = Router();

const publicAccess = (req, res, next) => {
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

router.get('/chat', (req, res) => {
    res.render('chat', {title: 'Chat'});
})

router.get('/products', privateAccess, (req, res) => {
    const user = req.session.user
    delete user.passwordHash
    res.render('products', {title: 'Productos'});
})

router.get('/carts/:cid', privateAccess, (req, res) => {
    res.render('cart', {title: 'Carrito', cartId: req.params.cid});
})

router.get('/purchase/:cid', privateAccess,  async (req, res) => {
    const items = await Carts.getCartById(req.params.cid)
    res.render('purchase', {title: 'Compra', cartId: req.params.cid, items: JSON.parse(JSON.stringify(items))});
})

router.get('/login', publicAccess, (req, res)=> {
    if (req.session.user) {res.status(301).redirect('/products/')}
    res.render('login');
})

router.get('/register', publicAccess, (req, res)=> {
    res.render('register')
})

export default router