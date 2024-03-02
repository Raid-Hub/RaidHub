import { Flex } from "~/components/layout/Flex"
import { RaidHubBannerId } from "~/data/image-ids"
import type { RaidHubGlobalLeaderboardCategory } from "~/types/raidhub-api"
import { Splash } from "../../SplashBannerComponents"

export const GlobalEntriesBanner = (props: {
    category: RaidHubGlobalLeaderboardCategory
    title: string
}) => (
    <Flex $direction="column" $padding={0} $gap={0}>
        <Splash
            title={props.title}
            tertiaryTitle="Global Leaderboards"
            cloudflareImageId={RaidHubBannerId}
        />
    </Flex>
)
