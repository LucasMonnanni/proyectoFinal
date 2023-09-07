export class CartError extends Error {
    constructor(code, message) {
        super()
        this.code = code
        this.message = message
    }
}

export class ProductError extends Error {
    constructor(code, message) {
        super()
        this.code = code
        this.message = message
    }
}