import multer from 'multer';
import { resolve } from 'path';
import bcrypt from 'bcrypt'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${resolve('./src/public/images')}`)
    },
    filename: (req,file,cb) => {
        console.log(file);
        cb(null, `${Date.now()}---${file.originalname}`)
    }
})

export const uploader = multer({storage})

export const createHash = (password) => bcrypt.hashSync(password,bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.passwordHash)

export const isAdmin = (email, password) => email === 'adminCoder@coder.com' && password === 'adminCod3r123'