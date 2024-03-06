import { Suspense } from "react"
import { Loading } from "~/components/Loading"
import { Flex } from "~/components/layout/Flex"
import { UserCard } from "./UserCard"
import { Raids } from "./raids/RaidsLayout"
import { CurrentActivity } from "./transitory/CurrentActivity"
import { LatestRaid } from "./transitory/LatestRaid"

export const ProfilePage = () => (
    <Flex $direction="column" $padding={0} $crossAxis="flex-start">
        <UserCard />
        <Suspense fallback={<Loading $fill $minHeight="250px" $borderRadius="10px" $alpha={0.5} />}>
            <Flex $padding={0} $direction="row" $wrap $fullWidth $crossAxis="stretch">
                <CurrentActivity />
                <LatestRaid />
            </Flex>
        </Suspense>
        <Raids />
    </Flex>
)
