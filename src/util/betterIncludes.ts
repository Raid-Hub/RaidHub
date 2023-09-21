export function includedIn<T>(arr: readonly T[], element: any): element is T {
    return arr.includes(element)
}
