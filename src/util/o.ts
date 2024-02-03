type TemplatableKey = string | number | bigint | boolean

export const o = {
    entries: function <
        T extends object,
        K extends keyof T & TemplatableKey = keyof T & TemplatableKey
    >(obj: T) {
        return Object.entries(obj) as [`${K}`, T[keyof T]][]
    },
    keys: function <
        T extends object,
        K extends keyof T & TemplatableKey = keyof T & TemplatableKey
    >(obj: T) {
        return Object.keys(obj) as `${K}`[]
    },
    fromEntries: function <T, K extends string | number | symbol>(
        entries: Iterable<readonly [K, T]>
    ) {
        return Object.fromEntries(entries) as Record<K, T>
    },
    mapKeys: function <
        T extends object,
        N,
        K extends keyof T & TemplatableKey = keyof T & TemplatableKey
    >(obj: T, fn: (key: `${K}`) => N) {
        return this.keys<T, K>(obj).map(key => [key, fn(key)])
    },
    mapValues: function <
        T extends object,
        N,
        V extends T[keyof T],
        K extends keyof T & TemplatableKey = keyof T & TemplatableKey
    >(obj: T, fn: (key: V) => N) {
        const rv = {}
        this.entries<T, K>(obj).forEach(([k, v]) => {
            // @ts-ignore
            rv[k] = fn(v)
        })
        return rv as Record<K, N>
    },
    map: function <T extends object, N, K extends keyof T & TemplatableKey>(
        obj: T,
        fn: (key: `${K}`, value: T[keyof T]) => N
    ) {
        return o.entries<T>(obj).map(([k, v]) => fn(k as `${K}`, v))
    }
}
