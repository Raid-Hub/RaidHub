type Encoder<A> = (array: A) => string
type Decoder<A> = (key: string) => A

export function encoders<A extends readonly number[]>(
    symbol: string = "+"
): [Encoder<A>, Decoder<A>] {
    return [
        array => array.join(symbol),
        key => key.split(symbol).map(p => parseInt(p)) as unknown as A
    ]
}
