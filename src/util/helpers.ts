export function includedIn<T>(arr: readonly T[], element: unknown): element is T {
    // @ts-expect-error - TS doesn't understand the type guard
    return arr.includes(element)
}

export async function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}
