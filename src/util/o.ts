type TemplatableKey = string | number | bigint | boolean

export const o = {
    entries: function <
        T extends object,
        K extends keyof T & TemplatableKey = keyof T & TemplatableKey,
        R extends string = K extends string ? K : `${K}`
    >(obj: T) {
        return Object.entries(obj) as [R, T[keyof T]][]
    },
    keys: function <
        T extends object,
        K extends keyof T & TemplatableKey = keyof T & TemplatableKey,
        R extends string = K extends string ? K : `${K}`
    >(obj: T) {
        return Object.keys(obj) as R[]
    },
    fromEntries: function <K extends string | number | symbol, V>(
        entries: Iterable<readonly [K, V]>
    ) {
        return Object.fromEntries(entries) as Record<K, V>
    },
    mapValues: function <
        T extends object,
        N,
        V extends T[keyof T],
        K extends keyof T & TemplatableKey = keyof T & TemplatableKey,
        R extends string = K extends string ? K : `${K}`
    >(obj: T, fn: (key: R, value: V) => N) {
        const rv = {}
        this.entries<T, K>(obj).forEach(([k, v]) => {
            // @ts-expect-error This is the point of this helper
            rv[k] = fn(k, v)
        })
        return rv as Record<R, N>
    },
    map: function <
        T extends object,
        N,
        K extends keyof T & TemplatableKey,
        R extends string = K extends string ? K : `${K}`
    >(obj: T, fn: (key: R, value: T[keyof T]) => N) {
        return o.entries<T>(obj).map(([k, v]) => fn(k as R, v))
    }
}
