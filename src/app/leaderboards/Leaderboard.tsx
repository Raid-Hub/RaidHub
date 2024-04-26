import { Suspense, type ReactNode } from "react"
import { Flex } from "~/components/layout/Flex"
import { PageWrapper } from "~/components/layout/PageWrapper"
import type {
    ListedRaid,
    RaidHubLeaderboardSearchQueryCategory,
    RaidHubLeaderboardSearchQueryType
} from "~/services/raidhub/types"
import { LeaderboardControls } from "./LeaderboardControls"
import { LeaderboardEntriesSuspense } from "./LeaderboardEntriesSuspense"

export type PageProps = {
    format?: "number" | "time"
    type: "player" | "team"
    count: number
}

export const Leaderboard = (
    props: {
        heading: ReactNode
        entries: ReactNode
        extraControls?: ReactNode
        pageProps: PageProps
        hasPages: boolean
    } & (
        | {
              hasSearch: true
              refreshQueryKey: readonly [...unknown[], page: number]
              category: RaidHubLeaderboardSearchQueryCategory
              type: RaidHubLeaderboardSearchQueryType
              raid?: ListedRaid
          }
        | {
              hasSearch: false
              refreshQueryKey: readonly unknown[]
          }
    )
) => {
    return (
        <PageWrapper pageProps={props.pageProps} $maxWidth={2000}>
            <Flex $padding={0}>
                <Flex $direction="column" $padding={0} $gap={1.5}>
                    <div style={{ minWidth: "calc(max(100%, 500px))" }}>
                        {props.heading}
                        <Flex $padding={0} $relative>
                            {/* Required to suspend because of the useSearchParams() hook */}
                            <Suspense>
                                {props.extraControls}
                                <LeaderboardControls
                                    refreshQueryKey={props.refreshQueryKey}
                                    hasPages={props.hasPages}
                                    {...(props.hasSearch
                                        ? {
                                              hasSearch: true,
                                              category: props.category,
                                              type: props.type,
                                              raid: props.raid
                                          }
                                        : {
                                              hasSearch: false
                                          })}
                                />
                            </Suspense>
                        </Flex>
                    </div>
                    <LeaderboardEntriesSuspense>{props.entries}</LeaderboardEntriesSuspense>
                </Flex>
            </Flex>
        </PageWrapper>
    )
}
