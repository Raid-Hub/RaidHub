"use client"

import Markdown from "react-markdown"
import { useRaidHubManifest } from "~/app/layout/managers"
import { useDialog } from "~/components/Dialog"
import { Panel } from "~/components/Panel"
import DiscordIcon from "~/components/icons/DiscordIcon"
import RulesIcon from "~/components/icons/Rules"
import SpeedrunIcon from "~/components/icons/SpeedrunIcon"
import UploadIcon from "~/components/icons/Upload"
import { Flex } from "~/components/layout/Flex"
import { SpeedrunVariables, type RTABoardCategory } from "~/data/speedrun-com-mappings"
import { type ListedRaid } from "~/services/raidhub/types"
import { useSpeedrunComRules } from "~/services/speedrun-com/useSpeedrunComRules"
import { includedIn } from "~/util/helpers"
import { ExtLink, TooltipWrapper } from "../../../LeaderboardSplashComponents"

export const SpeedrunComControls = (props: { raid: ListedRaid; category?: RTABoardCategory }) => {
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
        <Flex $padding={0}>
            <Panel $static>
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
    )
}
