"use client"

import { useState } from "react"
import { TooltipContainer, TooltipData } from "~/components/Tooltip"
import Copy from "~/components/icons/Copy"

export const CopyButton = ({ text }: { text: string }) => {
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
    }

    return (
        <TooltipContainer
            tooltipId={"bot-name-copy-" + text}
            tooltipBody={
                <TooltipData>{isCopied ? "Copied to clipboard" : "Copy to clipboard"}</TooltipData>
            }>
            <Copy
                sx={32}
                color={isCopied ? "gray" : "white"}
                onClick={handleCopy}
                cursor={isCopied ? "not-allowed" : "pointer"}
                style={{ padding: "4px" }}
            />
        </TooltipContainer>
    )
}
