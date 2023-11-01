import { Router } from 'express';
import { uploader } from '../utils.js'
import controller from '../controllers/products.js';

const router = Router();

const adminAccess = (req, res, next) => {
    if (req.session.user.role) {
        next();
    } else {
        res.status(403).send()
    }
}

router.get('/', controller.getProducts)

router.get('/:pid', controller.getProductById)

router.post('/', adminAccess, uploader.array('thumbnails'), controller.addProduct)

router.put('/:pid', adminAccess, uploader.array('thumbnails'), controller.updateProduct)

router.delete('/:pid', adminAccess, controller.deleteProduct)

export default router;
