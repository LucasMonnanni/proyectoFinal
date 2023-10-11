import { Router } from "express";
import passport from 'passport';
import { userModel } from "../dao/db/models/users.js";
import { createHash, isValidPassword, isAdmin } from "../utils.js";
import res from "express/lib/response.js";

const router = Router();


router.post('/login', passport.authenticate('login'), async (req, res) => { 
    delete req.user.password;
    req.session.user = req.user;
    res.redirect('/products')
})

router.post('/register', passport.authenticate('register'), async (req, res) => {
    delete req.user.password;
    req.session.user = req.user;
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

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

router.get('/githubCallback', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products/')
})

router.get('/current',  async (req, res) => {
    try{
        if (!req.session.user) {
            res.status(401).send({ status: 'Error', error: "Not logged in" })
            return
        }
        delete req.session.user.passwordHash
        res.send({ status: 'Success', payload: req.session.user });
    } catch(error){
        console.log(error)
        res.status(500).send({ status: 'Error'});
    }
})

export default router;