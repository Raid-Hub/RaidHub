import { notFound } from "next/navigation"
import { RaidHubError } from "~/services/raidhub/RaidHubError"
import { getRaidHubApi } from "~/services/raidhub/common"
import {
    type PathParamsForLeaderboardURL,
    type RaidHubLeaderboardURL
} from "~/services/raidhub/types"
import { LeaderboardProvider } from "./LeaderboardProvider"

export const LeaderboardSSR = async <T extends RaidHubLeaderboardURL>(props: {
    entriesPerPage: number
    page: string
    apiUrl: T
    params: PathParamsForLeaderboardURL<T>
}) => {
    const isFirstpage = props.page === "1"
    const ssrData = isFirstpage
        ? await getRaidHubApi(
              props.apiUrl,
              // @ts-expect-error generic hell
              props.params,
              {
                  page: 1,
                  count: props.entriesPerPage
              }
          ).catch(e => {
              if (
                  e instanceof RaidHubError &&
                  (e.errorCode === "LeaderboardNotFoundError" ||
                      e.errorCode === "PathValidationError")
              ) {
                  notFound()
              } else {
                  console.error(e)
              }
              return null
          })
        : null

    return (
        <LeaderboardProvider
            ssrData={ssrData?.response ?? null}
            ssrUpdatedAt={isFirstpage ? new Date(ssrData?.minted ?? Date.now()).getTime() : null}
            ssrPage={props.page}
        />
    )
}
