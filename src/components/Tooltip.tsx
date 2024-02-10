"use client"

import { Children, HTMLAttributes, cloneElement, forwardRef, isValidElement, useState } from "react"
import styled from "styled-components"
import { $media } from "~/app/layout/media"

export const TooltipContainer = forwardRef<
    HTMLDivElement,
    Omit<HTMLAttributes<HTMLDivElement>, "onMouseEnter" | "onMouseLeave" | "onFocus" | "onBlur"> & {
        children: JSX.Element
    } & {
        tooltipId: string
        tooltipBody: JSX.Element
    }
>(({ children, tooltipId, tooltipBody, ...props }, ref) => {
    const [$show, setShow] = useState(false)
    return (
        <StyledTooltipContainer
            ref={ref}
            {...props}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            onFocus={() => setShow(true)}
            onBlur={() => setShow(false)}>
            {Children.map(children, child =>
                isValidElement(child)
                    ? cloneElement(child, ($show ? { "aria-described-by": tooltipId } : {}) as {})
                    : child
            )}
            {$show && <StyledTooltip role="tooltip">{tooltipBody}</StyledTooltip>}
        </StyledTooltipContainer>
    )
})
TooltipContainer.displayName = "TooltipContainer"

const StyledTooltipContainer = styled.div`
    position: relative;
`

const StyledTooltip = styled.div`
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);

    width: max-content;
    max-width: 20em;

    ${$media.max.mobile`
        max-width: 8em;
    `}
`
