import { Collection } from "@discordjs/collection"
import { NextComponentType, NextPageContext } from "next"
import { useRouter } from "next/router"
import React, { useEffect, useRef } from "react"

const MAX_CACHE_COUNT = 3

type ComponentCache = Collection<
    string,
    {
        created: number
        expires: number
        scrollPos: number
        component: JSX.Element
    }
>

const ROUTES_TO_RETAIN = ["/pgcr/[activityId]", "/[vanity]", "/profile/[platform]/[membershipId]"]

const ComponentCacheManager = ({
    Component,
    componentProps
}: {
    Component: NextComponentType<NextPageContext, any, any>
    componentProps: Object
}) => {
    const router = useRouter()
    const { current: retainedComponents } = useRef<ComponentCache>(new Collection())

    const key = router.asPath
    const isRetainableRoute = ROUTES_TO_RETAIN.includes(router.route)

    // Add Component to retainedComponents if we haven't got it already

    if (!retainedComponents.has(key) || retainedComponents.get(key)!.expires < Date.now()) {
        if (isRetainableRoute) {
            const MemoComponent = React.memo(Component)
            retainedComponents.set(key, {
                component: <MemoComponent {...componentProps} />,
                created: Date.now(),
                expires: Date.now() + 3 * 60 * 1000, // 3 minutes
                scrollPos: 0
            })
        }

        if (retainedComponents.size + (isRetainableRoute ? 0 : 1) > MAX_CACHE_COUNT) {
            retainedComponents.delete(
                retainedComponents.sorted((a, b) => b.expires - a.expires).lastKey()!
            )
        }
    }

    // Save scroll position - requires an up-to-date router.asPath
    useEffect(() => {
        // Save the scroll position of current page before leaving
        const handleRouteChangeStart = () => {
            if (isRetainableRoute) {
                if (retainedComponents.has(key)) {
                    retainedComponents.get(key)!.scrollPos = window.scrollY
                }
            }
        }
        router.events.on("routeChangeStart", handleRouteChangeStart)
        return () => {
            router.events.off("routeChangeStart", handleRouteChangeStart)
        }
    }, [key, router.events, isRetainableRoute, retainedComponents])

    // Scroll to the saved position when we load a retained component
    useEffect(() => {
        if (isRetainableRoute && retainedComponents.has(key)) {
            window.scrollTo(0, retainedComponents.get(key)!.scrollPos)
        }
    }, [Component, componentProps, key, retainedComponents, isRetainableRoute])

    return (
        <article>
            {!isRetainableRoute && (
                <div key={key} id="content">
                    <Component {...componentProps} />
                </div>
            )}
            {retainedComponents.map((c, path) => (
                <div
                    key={path}
                    {...(key !== path
                        ? { style: { display: "none" }, "data-component-cache": path }
                        : { id: "content" })}>
                    {c.component}
                </div>
            ))}
        </article>
    )
}

export default ComponentCacheManager
