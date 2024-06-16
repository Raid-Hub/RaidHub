"use client"

import { useState } from "react"
import styled from "styled-components"
import { TooltipContainer, TooltipData } from "~/components/Tooltip"

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
            <CopyDiv onClick={handleCopy}>
                <p>Copy</p>
            </CopyDiv>
        </TooltipContainer>
    )
}

export const CopyDiv = styled.div.attrs<{
    onClick: () => void
}>(attrs => ({
    ...attrs
}))`
    display: flex;
    align-items: center;
    justify-content: center;

    color: ${({ theme }) => theme.colors.text.orange};
    background-color: ${({ theme }) => theme.colors.background.brandDim};

    height: 2.5em;

    cursor: pointer;

    padding: 0em 1em 0em 1em;

    border-radius: 25px;
    transition: background-color 0.2s;
    &:hover {
        background-color: ${({ theme }) => theme.colors.border.dark};
    }
`
