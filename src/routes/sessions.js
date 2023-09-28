import { Router } from "express";
import passport from 'passport';
import { userModel } from "../dao/db/models/users.js";
import { createHash, isValidPassword, isAdmin } from "../utils.js";

const router = Router();


router.post('/login', passport.authenticate('login', { failureRedirect: '/loginFailed' }), async (req, res) => {
    delete req.user.password;
    req.session.user = req.user;
    console.log()
    res.redirect('/products')
})

router.post('/register', passport.authenticate('register', { failureRedirect: '/registerFailed' }), async (req, res) => {
    delete req.user.password;
    req.session.user = req.user;
    console.log()
    res.redirect('/products')
})

router.delete('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.status(500).send({ status: 'Error' })
            return
        }
        res.redirect('/login')
    })
})

router.get('/github', passport.authenticate('github', { scope: ['user:login'] }), async (req, res) => { })

router.get('/githubCallback', passport.authenticate('github', { failureRedirect: '/loginFailed' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products/')
})

router.get('/loginFailed', (req, res) => {
    res.send({ status: 'Error', error: "Login failed" })
})

router.get('/registerFailed', async (req, res) => {
    console.log("Fallo la estrategia");
    res.send({ status: 'Error', error: "Failed register" });
})

export default router;