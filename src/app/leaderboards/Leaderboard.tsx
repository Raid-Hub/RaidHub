import { type ReactNode } from "react"
import { PageWrapper } from "~/components/layout/PageWrapper"

export type PageProps = {
    format?: "number" | "time"
    type: "player" | "team"
    count: number
}

export const Leaderboard = (props: {
    heading: ReactNode
    entries: ReactNode
    pageProps: PageProps
}) => {
    return (
        <PageWrapper pageProps={props.pageProps}>
            {props.heading}
            {props.entries}
        </PageWrapper>
    )
}
