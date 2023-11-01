import config from '../config/config.js';

export let ProductDAO;
export let CartDAO;
export let UserDAO;
export let TicketDAO;

switch (config.persistence) {
    case 'mongo':
        const {ProductManager} = await import('./db/managers/products.js')
        const {CartManager} = await import('./db/managers/carts.js')
        const {UserManager} = await import('./db/managers/users.js')
        const {TicketManager} = await import('./db/managers/tickets.js')
        ProductDAO = ProductManager
        CartDAO = CartManager
        UserDAO = UserManager
        TicketDAO = TicketManager
        break
    case 'fs':
        ProductManager = await import('./fs/managers/products.js')
        CartManager = await import('./fs/managers/carts.js')
        UserManager = await import('./fs/managers/users.js')
        ProductDAO = new ProductManager('/products.json')
        CartDAO = new CartManager('/carts.json')
        UserDAO = new UserManager('/users.json')
        break
    default:
        throw Error('Specified persistence mode not configured.')
}
