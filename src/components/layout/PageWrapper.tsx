"use client"

import { createContext, forwardRef, useContext, type ForwardedRef, type ReactNode } from "react"
import styled from "styled-components"
import { $media } from "~/layout/media"

const PropsContext = createContext<object | null>(null)

export const PageWrapper = forwardRef(
    <T extends object = never>(
        props: {
            children: ReactNode
            pageProps?: T
        },
        ref: ForwardedRef<HTMLElement>
    ) => (
        <PropsContext.Provider value={props.pageProps ?? {}}>
            <PageWrapperStyled ref={ref}>{props.children}</PageWrapperStyled>
        </PropsContext.Provider>
    )
)
PageWrapper.displayName = "PageWrapper"

/**
 * Custom hook that retrieves the page props from the PropsContext.
 * @template T - The type of the page props.
 * @returns The page props of type T.
 * @throws {Error} If used outside of a PageWrapper.
 */
export const usePageProps = <T extends object>() => {
    const pageProps = useContext(PropsContext)
    if (pageProps === null) throw new Error("usePageProps must be used within a PageWrapper")
    return pageProps as T
}

const PageWrapperStyled = styled.main`
    margin: 0 auto;
    margin-top: 0.5em;
    margin-bottom: 1.5em;

    ${$media.max.desktop`
        width: 85%;
    `}
    ${$media.max.laptop`
        width: 90%;
    `}
    ${$media.max.tablet`
        width: 95%;
    `}
`
