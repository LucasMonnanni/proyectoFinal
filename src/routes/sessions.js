import { Router } from "express";
import passport from 'passport';
import controller from '../controllers/sessions.js'

const router = Router();

router.post('/login', passport.authenticate('login'), controller.login)

router.post('/register', passport.authenticate('register'), controller.register)

router.delete('/logout', controller.logout)

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {})

router.get('/githubCallback', passport.authenticate('github'), controller.githubCallback)

router.get('/current', controller.getCurrent)

export default router;