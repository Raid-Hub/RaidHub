import { Flex } from "~/components/layout/Flex"
import { CurrentActivity } from "./CurrentActivity"
import { ProfileStateManager } from "./ProfileStateManager"
import { RecentRaid } from "./RecentRaid"
import { UserCard } from "./UserCard"
import { Raids } from "./raids/RaidsLayout"

export const ProfilePage = () => (
    <ProfileStateManager>
        <Flex $direction="column" $padding={0} $crossAxis="flex-start">
            <UserCard />
            <Flex $padding={0} $direction="row" $wrap $fullWidth $crossAxis="stretch">
                <CurrentActivity />
                <RecentRaid />
            </Flex>
            <Raids />
        </Flex>
    </ProfileStateManager>
)
