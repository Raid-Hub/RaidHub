import { RaidHubBannerId } from "~/data/image-ids"
import type { RaidHubGlobalLeaderboardCategory } from "~/services/raidhub/types"
import { Splash } from "../../SplashBannerComponents"

export const GlobalEntriesBanner = (props: {
    category: RaidHubGlobalLeaderboardCategory
    title: string
}) => (
    <Splash
        title={props.title}
        tertiaryTitle="Global Leaderboards"
        cloudflareImageId={RaidHubBannerId}
    />
)
