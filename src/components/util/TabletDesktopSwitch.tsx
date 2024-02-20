"use client"

import styled from "styled-components"
import { $media } from "~/layout/media"

export const TabletDesktopSwitch = (props: { sm: JSX.Element; lg: JSX.Element }) => {
    return (
        <Parent>
            <div className="sm">{props.sm}</div>
            <div className="lg">{props.lg}</div>
        </Parent>
    )
}

const Parent = styled.div`
    & .sm {
        display: none;
        ${$media.max.tablet`
            display: block;
        `}
    }

    & .lg {
        display: block;
        ${$media.max.tablet`
            display: none;
        `}
    }
`
