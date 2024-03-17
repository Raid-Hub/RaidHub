import { Suspense } from "react"
import { Loading } from "~/components/Loading"
import { Flex } from "~/components/layout/Flex"
import { UserCard } from "./UserCard"
import { Raids } from "./raids/RaidsLayout"
import { CurrentActivity } from "./transitory/CurrentActivity"
import { LatestRaid } from "./transitory/LatestRaid"

export const ProfilePage = ({ destinyMembershipId }: { destinyMembershipId: string }) => (
    <Flex $direction="column" $padding={0} $crossAxis="flex-start">
        <Flex
            $direction="row"
            $padding={0}
            $align="flex-start"
            $crossAxis="stretch"
            $fullWidth
            $wrap
            style={{ columnGap: "4rem" }}>
            <UserCard />
            <Suspense
                key={destinyMembershipId}
                fallback={
                    <Loading
                        $fill
                        $minHeight="250px"
                        $alpha={0.5}
                        $minWidth="200px"
                        style={{ width: "calc(min(100%, 800px))" }}
                    />
                }>
                <Flex
                    $padding={0}
                    $direction="row"
                    $wrap
                    $align="flex-start"
                    $crossAxis="stretch"
                    style={{
                        flexGrow: 1
                    }}>
                    <CurrentActivity />
                    <LatestRaid />
                </Flex>
            </Suspense>
        </Flex>
        <Raids />
    </Flex>
)
