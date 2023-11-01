import { Router } from 'express';
import controller from '../controllers/carts.js'

const ownerAccess = (req, res, next) => {
    if (req.session.user.cart == req.params.cid) {
        next();
    } else {
        res.status(403).send()
    }
}

const router = Router();

router.post('/', controller.addCart)

router.get('/:cid', controller.getCartById)

router.post('/:cid/product/:pid', ownerAccess, controller.addProductToCart)

router.delete('/:cid/product/:pid', controller.deleteProductFromCart)

router.put('/:cid', controller.updateProducts)

router.put('/:cid/product/:pid', controller.updateProductQuantity)

router.delete('/:cid', controller.clearProducts)

router.post('/:cid/purchase', controller.purchaseCart)

export default router;