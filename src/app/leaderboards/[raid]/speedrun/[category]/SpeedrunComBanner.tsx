"use client"

import Link from "next/link"
import Markdown from "react-markdown"
import styled, { css } from "styled-components"
import { BackgroundImage } from "~/components/BackgroundImage"
import { useDialog } from "~/components/Dialog"
import { Panel } from "~/components/Panel"
import { TooltipContainer, TooltipData } from "~/components/Tooltip"
import DiscordIcon from "~/components/icons/DiscordIcon"
import RulesIcon from "~/components/icons/Rules"
import SpeedrunIcon from "~/components/icons/SpeedrunIcon"
import UploadIcon from "~/components/icons/Upload"
import { Flex } from "~/components/layout/Flex"
import { H4 } from "~/components/typography/H4"
import RaidCardBackground from "~/data/raid-backgrounds"
import { SpeedrunVariables, type RTABoardCategory } from "~/data/speedrun-com-mappings"
import { useRaidHubManifest } from "~/layout/managers/RaidHubManifestManager"
import { useSpeedrunComRules } from "~/services/speedrun-com/useSpeedrunComRules"
import { type ListedRaid } from "~/types/raidhub-api"
import { includedIn } from "~/util/helpers"

export const SpeedrunComBanner = (props: {
    title: string
    subtitle?: string
    raid: ListedRaid
    category?: RTABoardCategory
}) => {
    const { sunsetRaids, getRaidString } = useRaidHubManifest()
    const { Dialog: RulesDialog, open: openRules } = useDialog()

    const getURL = () => {
        const url = new URL("https://www.speedrun.com/destiny2")

        const categoryId = SpeedrunVariables[props.raid].categoryId
        const variable = SpeedrunVariables[props.raid].variable
        const id = props.category ? variable?.values[props.category]?.id ?? null : null
        url.searchParams.set(
            "x",
            `${categoryId}${variable && id ? `-${variable.variableId}.${id}` : ""}`
        )

        return url
    }

    const getSubmitRunURL = () => {
        const url = getURL()
        url.pathname += "/runs/new"
        url.searchParams.set("rules", "game")
        return url
    }

    const { data: rules } = useSpeedrunComRules({
        categoryId: SpeedrunVariables[props.raid].categoryId
    })

    return (
        <Flex $direction="column" $padding={0} $gap={0}>
            <Panel>
                <Flex $direction="column" $gap={0}>
                    <H4 $mBlock={0.25}>Speedrun Leaderboards</H4>
                    <Title>{props.title}</Title>
                    <Subtitle>{props.subtitle}</Subtitle>
                </Flex>
                <BackgroundImage
                    cloudflareId={RaidCardBackground[props.raid]}
                    alt={getRaidString(props.raid)}
                />
            </Panel>
            <Flex $padding={0}>
                <Panel>
                    <Flex as="nav" $padding={0} $gap={0.75} style={{ alignSelf: "flex-end" }}>
                        <TooltipWrapper id="src-page" title="Speedrun.com Page">
                            <ExtLink href={getURL()}>
                                <SpeedrunIcon sx={25} />
                            </ExtLink>
                        </TooltipWrapper>
                        <TooltipWrapper id="src-rules" title="Category Rules">
                            <RulesIcon sx={25} onClick={openRules} pointer />
                        </TooltipWrapper>
                        {!includedIn(sunsetRaids, props.raid) && (
                            <TooltipWrapper id="src-submit" title="Submit Run">
                                <ExtLink href={getSubmitRunURL()}>
                                    <UploadIcon sx={25} />
                                </ExtLink>
                            </TooltipWrapper>
                        )}
                        <TooltipWrapper id="src-discord" title="Speedrun Community Discord">
                            <ExtLink href="https://discord.gg/d2speedrun">
                                <DiscordIcon sx={25} color="white" />
                            </ExtLink>
                        </TooltipWrapper>
                    </Flex>
                </Panel>
                <RulesDialog style={{ maxWidth: "800px" }}>
                    <h1> Submission Rules - {getRaidString(props.raid)}</h1>
                    <Markdown
                        components={{
                            h1: "h2",
                            h2: "h3",
                            h3: "h4"
                        }}>
                        {rules}
                    </Markdown>
                </RulesDialog>
            </Flex>
        </Flex>
    )
}

const shadow = css`
    text-shadow: 3px 0px 7px rgba(81, 67, 21, 0.8), -3px 0px 7px rgba(81, 67, 21, 0.8),
        0px 4px 7px rgba(81, 67, 21, 0.8);
`

const Title = styled.h1`
    ${shadow}
    font-size: 2rem;
    margin-block: 0;
`

const Subtitle = styled.div`
    ${shadow}
    font-size: 1.75rem;
`
const TooltipWrapper = ({
    id,
    title,
    children
}: {
    title: string
    id: string
    children: JSX.Element
}) => (
    <TooltipContainer tooltipId={id} tooltipBody={<TooltipData $mb={0.5}>{title}</TooltipData>}>
        {children}
    </TooltipContainer>
)

const ExtLink = styled(Link).attrs({ target: "_blank" })`
    display: flex;
`
