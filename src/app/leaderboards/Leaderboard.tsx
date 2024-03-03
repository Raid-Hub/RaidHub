import { Suspense, type ReactNode } from "react"
import { Flex } from "~/components/layout/Flex"
import { PageWrapper } from "~/components/layout/PageWrapper"
import type {
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
    } & (
        | {
              hasPages: true
              refreshQueryKey: readonly [...unknown[], page: number]
              category: RaidHubLeaderboardSearchQueryCategory
              type: RaidHubLeaderboardSearchQueryType
          }
        | {
              hasPages: false
              refreshQueryKey: readonly unknown[]
          }
    )
) => {
    return (
        <PageWrapper pageProps={props.pageProps}>
            <Flex $padding={0}>
                <Flex $direction="column" $padding={0} $gap={1.5}>
                    <div style={{ minWidth: "50%" }}>
                        {props.heading}
                        <Flex $padding={0} $relative>
                            {/* Required to suspend because of the useSearchParams() hook */}
                            <Suspense>
                                {props.extraControls}
                                <LeaderboardControls
                                    queryKey={props.refreshQueryKey}
                                    {...(props.hasPages
                                        ? {
                                              hasPages: true,
                                              category: props.category,
                                              type: props.type
                                          }
                                        : {
                                              hasPages: false
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
