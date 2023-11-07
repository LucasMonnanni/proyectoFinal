import { TicketDAO } from '../dao/factory.js';

export default {
    create: async (cid, amount, user) => {
        const code = cid + Date.now().toString()
        const purchaser = user.email?user.email:user.userName
        return await TicketDAO.create(code, amount, purchaser)
    }
}