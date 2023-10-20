import { Router } from 'express';
import controller from '../controllers/carts.js'

const router = Router();

router.post('/', controller.addCart)

router.get('/:cid', controller.getCartByID)

router.post('/:cid/product/:pid', controller.addProductToCart)

router.delete('/:cid/product/:pid', controller.deleteProductFromCart)

router.put('/:cid', controller.updateProducts)

router.put('/:cid/product/:pid', controller.updateProductQuantity)

router.delete('/:cid', controller.clearProducts)

export default router;