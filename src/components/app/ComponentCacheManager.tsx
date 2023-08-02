import { Collection } from "@discordjs/collection"
import { NextComponentType, NextPageContext } from "next"
import { useRouter } from "next/router"
import React from "react"

const MAX_CACHE_COUNT = 3

type ComponentCache = Collection<
    string,
    {
        lastAccessed: number
        expires: number
        component: JSX.Element
    }
>

const ROUTES_TO_RETAIN = ["/pgcr/[activityId]", "/[vanity]", "/profile/[platform]/[membershipId]"]

const ComponentCacheManager = ({
    Component,
    componentProps,
    children
}: {
    Component: NextComponentType<NextPageContext, any, any>
    componentProps: Object
    children: React.ReactNode
}) => {
    const router = useRouter()
    const { current: retainedComponents } = React.useRef<ComponentCache>(new Collection())

    const key = new URL(router.asPath, "https://base.url").pathname
    const isRetainableRoute = ROUTES_TO_RETAIN.includes(router.route)

    // Add Component to retainedComponents if we haven't got it already
    if (!retainedComponents.has(key) || retainedComponents.get(key)!.expires < Date.now()) {
        if (isRetainableRoute) {
            const MemoComponent = React.memo(Component)
            retainedComponents.set(key, {
                component: <MemoComponent {...componentProps} />,
                lastAccessed: Date.now(),
                expires: Date.now() + 3 * 60 * 1000 // 3 minutes
            })
        }

        if (retainedComponents.size + (isRetainableRoute ? 0 : 1) > MAX_CACHE_COUNT) {
            retainedComponents.delete(
                retainedComponents.findKey(c => c.expires <= Date.now()) ??
                    retainedComponents.sorted((a, b) => b.lastAccessed - a.lastAccessed).lastKey()!
            )
        }
    } else {
        retainedComponents.get(key)!.lastAccessed = Date.now()
    }

    return (
        <>
            {!isRetainableRoute && (
                <div key={key} id="content">
                    {children}
                    <Component {...componentProps} />
                </div>
            )}
            {retainedComponents.map((c, path) => (
                <div
                    key={path}
                    {...(key !== path
                        ? { style: { display: "none" }, "data-component-cache": path }
                        : { id: "content" })}>
                    {key === path && children}
                    {c.component}
                </div>
            ))}
        </>
    )
}

export default ComponentCacheManager
