"use client"

import Link from "next/link"
import { Card } from "~/components/Card"
import { TooltipContainer, TooltipData } from "~/components/Tooltip"
import { Flex } from "~/components/layout/Flex"
import { useSocialConnections } from "./useSocialConnections"

export const UserCardSocials = (props: { size: "sm" | "lg"; bottom?: boolean }) => {
    const socials = useSocialConnections()

    return (
        <Card
            $borderRadius={6}
            $opacity={60}
            $color="dark"
            style={props.size == "sm" ? { width: "min-content" } : {}}>
            {!!socials?.length && (
                <Flex
                    $paddingY={0.5}
                    $paddingX={1.2}
                    $align="space-between"
                    $gap={4}
                    $wrap={props.size === "lg"}>
                    {socials.map(({ Icon, id, displayName, url }) => (
                        <TooltipContainer
                            key={id}
                            tooltipId={`tooltip-${id}-username`}
                            $bottom={props.bottom}
                            tooltipBody={
                                <TooltipData
                                    $mb={props.bottom ? 0 : 0.75}
                                    $mt={props.bottom ? 0.75 : 0}>
                                    {displayName}
                                </TooltipData>
                            }>
                            {url ? (
                                <Link href={url} style={{ height: "100%", color: "unset" }}>
                                    <Flex $padding={0} $gap={0.7}>
                                        <Icon color="white" sx={24} />
                                        {props.size === "sm" && displayName}
                                    </Flex>
                                </Link>
                            ) : (
                                <Flex $padding={0} $gap={0.7}>
                                    <Icon color="white" sx={24} />
                                    {props.size === "sm" && displayName}
                                </Flex>
                            )}
                        </TooltipContainer>
                    ))}
                </Flex>
            )}
        </Card>
    )
}
