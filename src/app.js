import express from 'express';
import { router as productsRouter } from './routes/products.js';
import cartsRouter from './routes/carts.js';
import { resolve } from 'path';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static',express.static(resolve('./src/public')));

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);

app.use((error, req, res, next)=>{
    console.log(error.stack)
    res.status(500).send()
})

const port = 8080
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
