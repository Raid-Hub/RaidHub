import { Suspense, type ReactNode } from "react"
import { Loading } from "~/components/Loading"
import { Flex } from "~/components/layout/Flex"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { MobileDesktopSwitch } from "~/components/util/MobileDesktopSwitch"

export const Leaderboard = (props: {
    heading: ReactNode
    children: ReactNode
    pageProps?: object & { format?: "number" | "time" }
}) => {
    return (
        <PageWrapper pageProps={props.pageProps}>
            {props.heading}
            <Suspense
                fallback={
                    <Flex $fullWidth $padding={0}>
                        <Flex $direction="column" style={{ maxWidth: "900px" }} $padding={0}>
                            {Array.from({ length: 10 }, (_, idx) => (
                                <MobileDesktopSwitch
                                    key={idx}
                                    sm={
                                        <Loading $minHeight="350px" $minWidth="100%" $alpha={0.8} />
                                    }
                                    lg={
                                        <Loading
                                            $minHeight="150px"
                                            $minWidth="800px"
                                            $alpha={0.8}
                                        />
                                    }
                                />
                            ))}
                        </Flex>
                    </Flex>
                }>
                {props.children}
            </Suspense>
        </PageWrapper>
    )
}
