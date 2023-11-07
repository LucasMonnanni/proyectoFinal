import mongoose from 'mongoose'
import { ticketModel } from '../models/tickets.js'

export const TicketManager = {
    create: async (code, amount, purchaser) => {
        return await ticketModel.create({ code, amount, purchaser })
    }
}