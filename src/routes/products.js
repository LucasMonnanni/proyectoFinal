import { Router } from 'express';
import { uploader } from '../utils.js'
import controller from '../controllers/products.js';

const router = Router();

router.get('/', controller.getProducts)

router.get('/:pid', controller.getProductById)

router.post('/', uploader.array('thumbnails'), controller.addProduct)

router.put('/:pid', uploader.array('thumbnails'), controller.updateProduct)

router.delete('/:pid', controller.deleteProduct)

export default router;
