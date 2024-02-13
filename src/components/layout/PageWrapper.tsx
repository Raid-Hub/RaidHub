"use client"

import { createContext, forwardRef, useContext, type ForwardedRef, type ReactNode } from "react"
import styled from "styled-components"
import { $media } from "~/app/(layout)/media"

const PropsContext = createContext<object | null>(null)

export const PageWrapper = forwardRef(
    <T extends object>(
        props: {
            children: ReactNode
            pageProps: T
        },
        ref: ForwardedRef<HTMLElement>
    ) => (
        <PropsContext.Provider value={props.pageProps}>
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
    margin: 0.5em auto;
    margin-bottom: 1.5em;

    ${$media.max.desktop`
        min-width: 50%;
        max-width: 85%;
    `} ${$media.max.laptop`
        min-width: 70%;
        max-width: 88%;
    `} ${$media.max.tablet`
        min-width: 85%;
        max-width: 90%;
    `} ${$media.max.mobile`
        min-width: 93%;
        max-width: 95%;
    `} ${$media.max.tiny`
        min-width: 98%;
        max-width: 98%;
    `};
`
