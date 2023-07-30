import { Collection } from "@discordjs/collection"
import { NextComponentType, NextPageContext } from "next"
import { useRouter } from "next/router"
import React, {
    MemoExoticComponent,
    ReactElement,
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react"
import Profile from "../profile/Profile"

const MAX_CACHE_COUNT = 5

type ComponentCache = Collection<
    string,
    {
        created: Date
        expires: Date
        scrollPos: number
        component: JSX.Element
    }
>

const ComponentCacheManager = ({
    Component,
    componentProps
}: {
    Component: NextComponentType<NextPageContext, any, any>
    componentProps: Object
}) => {
    const router = useRouter()
    const { current: cachedComponents } = useRef<ComponentCache>(new Collection())

    const componentKey = router.asPath

    if (
        router.isReady &&
        (!cachedComponents.has(componentKey) ||
            cachedComponents.get(componentKey)!.expires.getTime() < Date.now())
    ) {
        const Memo = React.memo(Component)
        cachedComponents.set(componentKey, {
            created: new Date(),
            expires: new Date(Date.now() + 3 * 60000),
            scrollPos: 0,
            component: <Memo {...componentProps} />
        })

        console.log("adding to cache")

        if (cachedComponents.size >= MAX_CACHE_COUNT) {
            const toRemove = cachedComponents.reduce(
                (prevKey, current, currentKey) =>
                    current.expires < cachedComponents.get(prevKey)!.expires ? currentKey : prevKey,
                cachedComponents.firstKey()
            )
            cachedComponents.delete(toRemove)
        }
    } else {
        console.log("hitting cache")
    }

    // Save the scroll position of current page before leaving
    const handleRouteChangeStart = () => {
        if (cachedComponents.has(componentKey)) {
            cachedComponents.get(componentKey)!.scrollPos = window.scrollY
        }
    }

    // Save scroll position - requires an up-to-date router.asPath
    useEffect(() => {
        router.events.on("routeChangeStart", handleRouteChangeStart)
        return () => {
            router.events.off("routeChangeStart", handleRouteChangeStart)
        }
    }, [router.asPath])

    // Scroll to the saved position when we load a cached component
    useEffect(() => {
        if (cachedComponents.has(componentKey)) {
            window.scrollTo(0, cachedComponents.get(componentKey)!.scrollPos)
        }
    }, [Component, componentProps])

    return (
        <>
            {cachedComponents.get(componentKey)?.component ?? null}
            <div style={{ display: "none" }}>
                {cachedComponents.map((c, cacheKey) => (
                    <React.Fragment key={cacheKey}>{c.component}</React.Fragment>
                ))}
            </div>
        </>
    )
}

export default ComponentCacheManager
