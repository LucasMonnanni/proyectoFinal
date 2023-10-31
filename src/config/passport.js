import passport from 'passport'
import local from 'passport-local'
import config from './config.js'
import gitHubStrategy from "passport-github2"
import Carts from '../services/carts.js';
import { UserDAO as Users } from '../dao/factory.js';
import { UserError } from '../dao/errors.js';
import { createHash, isValidPassword, isAdmin } from '../utils.js'

const LocalStrategy = local.Strategy;
const GitHubStrategy = gitHubStrategy.Strategy;

export const initializePassport = () => {
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        try {
            const { password, ...data } = req.body
            data.passwordHash = createHash(password)
            data.cart = await Carts.addCart()
            const user = await Users.addUser(data)
            return done(null, user)
        } catch (error) {
            if (error instanceof UserError) {
                return done(null, false, error.message)
            } else {
                console.log(error)
                return done(error.message)
            }
        }
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            if (isAdmin(username, password)) {
                return done(null, {
                    firstName: 'Coder',
                    lastName: 'Admin',
                    email: username,
                    role: 'admin'
                })
            }
            const user = await Users.getUser({ email: username })
            if (!user) {
                console.log('Usuario no encontrado')
                return done(null, false, {message: 'Usuario no encontrado'})
            }
            if (!isValidPassword(user, password)) {
                console.log('Contraseña incorrecta')
                return done(null, false, {message: 'Contraseña incorrecta'})
            }
            return done(null, user)
        } catch (error) {
            console.log(error)
            return done(error)
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.3ce7021cf8e2b5e0",
        clientSecret: config.githubSecret,
        callBackURL: "http://localhost:8080/api/sessions/githubCallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = null
            if (profile._json.email) {
                user = await Users.getUser({ email: profile._json.email})
            } else {
                user = await Users.getUser({ userName: profile._json.login})
            }
            if (!user) {
                const cart = await Carts.addCart()
                let newUser = { firstName: profile._json.name, userName: profile._json.login, email: profile._json.email, cart: cart}
                let result = await Users.addUser(newUser);
                return done(null, result);
            }
            done(null, user)
        } catch (error) {
            return done(error)
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await Users.getUserById(id);
        done(null, user);
    })
}