/** A name which can be safely parsed */
export default class BungieName {
    name: string
    code: number

    constructor(name: string, code: number) {
        if (name && code < 10000) {
            this.name = name
            this.code = code
        } else {
            throw new Error("invalid bungie name string")
        }
    }

    static parse(str: string): BungieName {
        if (str.includes("#")) {
            const [name, code] = str.split("#")
            const codeNum = parseInt(code)
            if (name && code.length == 4 && !isNaN(codeNum)) {
                return new BungieName(name, codeNum)
            } else {
                throw new Error("invalid bungie name string")
            }
        } else {
            throw new Error("invalid bungie name string")
        }
    }

    /**
     * Since Bungie decided to make the code a number, leading zeroes get truncated (lol)
     * @param code the potentially bad code
     * @returns a 4 digit string with zeroes added
     */
    get fixedBungieCode(): string {
        const str = this.code.toString()
        const missingZeroes = 4 - str.length
        return `${"0".repeat(missingZeroes)}${str}`
    }

    toString() {
        return `${this.name}#${this.fixedBungieCode}`
    }
}
