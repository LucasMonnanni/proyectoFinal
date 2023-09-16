import { Router } from "express";

const router = Router();

router.use('/', async (req, res, next)=> {
    let cid = req.signedCookies.cartId
    if (!cid) {
        cid = await req.cm.addCart()
        req.signedCookies.cartId = cid
        console.log('creating cart '+ cid)
    }
    res.cookie('cartId', cid, {maxAge: 3600000, signed: true })
    next()
})

router.get('/chat', (req, res) => {
    res.render('chat', {title: 'Chat'});
})

router.get('/products', (req, res) => {
    res.render('products', {title: 'Productos', cartId: req.signedCookies.cartId});
})

router.get('/carts/:cid', (req, res) => {
    res.render('cart', {title: 'Carrito', cartId: req.params.cid});
})

export default router