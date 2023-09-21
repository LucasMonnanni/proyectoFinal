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

const publicAccess = (req, res, next) => {
    // if (req.session.user) return res.redirect('/profile');
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
    res.render('products', {title: 'Productos', cartId: req.signedCookies.cartId, user});
})

router.get('/carts/:cid', privateAccess, (req, res) => {
    res.render('cart', {title: 'Carrito', cartId: req.params.cid});
})

router.get('/login', publicAccess, (req, res)=> {
    if (req.session.user) {res.status(301).redirect('/products/')}
    res.render('login');
})

router.get('/register', publicAccess, (req, res)=> {
    res.render('register')
})

router.get('/profile', privateAccess, (req, res)=> {
    res.render('profile', {
        
    })
})

export default router