import express from 'express';
import session from 'express-session';

import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';
import sessionsRouter from './routes/sessions.js'
import passport from 'passport';
import { initializePassport } from './config/passport.js';

import { resolve } from 'path';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import { messageModel } from './dao/db/models/messages.js';

let store;
if (config.persistence=='mongo') {
    let urlMongo = config.mongoUrl
    mongoose.connect(urlMongo)
    store = MongoStore.create({
        mongoUrl: urlMongo,
        ttl: 3600
    })
} else {
    console.error('Specified persistence mode not configured.')
    process.exit(0)
}

const app = express();
app.use(cookieParser('secretisimo'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(resolve('./src/public')));

app.use(session({
    store: store,
    secret: "secretisisisimo",
    resave: false,
    saveUninitialized: false
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/api/sessions/', sessionsRouter);

app.engine('handlebars', handlebars.engine())
app.set('views', resolve('./src/views'))
app.set('view engine', 'handlebars')

app.use('/', viewsRouter);

app.use((error, req, res, next) => {
    console.log(error.stack)
    res.status(500).send()
    next()
})

const server = app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`)
})

const io = new Server(server)

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado');

    socket.on('authenticated', async data => {
        socket.broadcast.emit('newUserConnected', data);
        const messages = await messageModel.find()
        socket.emit('messageLogs', messages);
    })

    socket.on('message', async data => {
        await messageModel.create({ user: data.user, message: data.message })
        const messages = await messageModel.find()
        io.emit('messageLogs', messages);
    })
})