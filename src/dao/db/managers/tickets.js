import mongoose from 'mongoose'
import { ticketModel } from '../models/tickets.js'

export const TicketManager = {
    create: async (code, amount, purchaser) => {
        await ticketModel.create({ code, amount, purchaser })
    }
}