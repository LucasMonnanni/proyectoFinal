import config from '../config/config.js';

export let Products;
export let Carts;
export let Users;

switch (config.persistence) {
    case 'mongo':
        const {ProductManager} = await import('./db/managers/products.js')
        const {CartManager} = await import('./db/managers/carts.js')
        const {UserManager} = await import('./db/managers/users.js')
        Products = ProductManager
        Carts = CartManager
        Users = UserManager
        break
    case 'fs':
        ProductManager = await import('./fs/managers/products.js')
        CartManager = await import('./fs/managers/carts.js')
        UserManager = await import('./fs/managers/users.js')
        Products = new ProductManager('/products.json')
        Carts = new CartManager('/carts.json')
        Users = new UserManager('/users.json')
        break
    default:
        throw Error('Specified persistence mode not configured.')
}
