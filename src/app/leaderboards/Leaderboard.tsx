import { type ReactNode } from "react"
import { PageWrapper } from "~/components/layout/PageWrapper"

export const Leaderboard = (props: {
    heading: ReactNode
    children: ReactNode
    pageProps?: object
}) => {
    return (
        <PageWrapper pageProps={props.pageProps}>
            {props.heading}
            {props.children}
        </PageWrapper>
    )
}
