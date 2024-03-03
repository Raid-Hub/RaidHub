"use client"

import { createContext, forwardRef, useContext, type ForwardedRef, type ReactNode } from "react"
import styled from "styled-components"
import { $media } from "~/app/layout/media"

const PropsContext = createContext<object | null>(null)

export const PageWrapper = forwardRef<
    HTMLElement,
    {
        children: ReactNode
        pageProps?: object
    } & PageWrapperStyleProps
>(({ children, pageProps, ...props }, ref: ForwardedRef<HTMLElement>) => (
    <PropsContext.Provider value={pageProps ?? {}}>
        <PageWrapperStyled ref={ref} {...props}>
            {children}
        </PageWrapperStyled>
    </PropsContext.Provider>
))
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
type PageWrapperStyleProps = {
    $maxWidth?: number
}
const PageWrapperStyled = styled.main<PageWrapperStyleProps>`
    margin: 0 auto;
    margin-top: 0.5em;
    margin-bottom: 1.5em;

    ${props => $media.max.desktop`
        width: ${props.$maxWidth ? `calc(min(${props.$maxWidth}px, 85%))` : "85%"};
    `}
    ${props => $media.max.laptop`
        width: ${props.$maxWidth ? `calc(min(${props.$maxWidth}px, 90%))` : "90%"};
    `}
    ${props => $media.max.tablet`
        width: ${props.$maxWidth ? `calc(min(${props.$maxWidth}px, 95%))` : "95%"};
    `}
`

PageWrapperStyled.defaultProps = {
    $maxWidth: undefined
}
