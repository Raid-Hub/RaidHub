export default class AppError extends Error {
    readonly data: any
    constructor(error: string, data: any) {
        super(error)
        this.data = data
    }
}
