export function includedIn<T>(arr: readonly T[], element: any): element is T {
    return arr.includes(element)
}

export async function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}
