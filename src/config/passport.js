import passport from 'passport'
import local from 'passport-local'
import config from './config.js'
import gitHubStrategy from "passport-github2"
import { userModel } from '../dao/db/models/users.js'
import { cartModel } from '../dao/db/models/carts.js'
import { createHash, isValidPassword, isAdmin } from '../utils.js'

const LocalStrategy = local.Strategy;
const GitHubStrategy = gitHubStrategy.Strategy;

export const initializePassport = () => {
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        try {
            const { password, ...data } = req.body
            data.passwordHash = createHash(password)
            data.cart = await req.cm.addCart()
            const user = await userModel.create(data)
            return done(null, user)
        } catch (error) {
            console.log(error)
            if (/^E11000/.test(error.message)) {
                //El código de error misterioso no es de mongoose si no de Mongo en sí, es el 'duplicate key error' 
                return done(null, false, 'El usuario ya existe')
            } else {
                return done('Error al crear el usuario: ' + error)
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
            const user = await userModel.findOne({ email: username })
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
                user = await userModel.findOne({ email: profile._json.email})
            } else {
                user = await userModel.findOne({ userName: profile._json.login})
            }
            if (!user) {
                const cart = await cartModel.create({})
                let newUser = { firstName: profile._json.name, userName: profile._json.login, email: profile._json.email, cart: cart._id}
                let result = await userModel.create(newUser);
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
        let user = await userModel.findById(id);
        done(null, user);
    })
}