import mongoose from 'mongoose';

export const ticketCollection = 'tickets';

// El subschema no era la única manera de hacerlo pero dado lo que vimos en la última clase
// queda listo para un populate en cuanto lo necesite.
const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: 'El campo {PATH} es obligatorio.',
        unique: true,
    },
    purchaseDatetime: {
        type: Date,
        default: Date.now
    },
    amount:  {
        type: Number,
        required: 'El campo {PATH} es obligatorio.'
    },
    purchaser: {
        type: String,
        required: 'El campo {PATH} es obligatorio.'
    }
})

export const ticketModel = mongoose.model(ticketCollection, ticketSchema)