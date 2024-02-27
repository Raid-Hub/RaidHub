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
        display: block;
        ${$media.min.tablet`
            display: none;
        `}
    }

    & .lg {
        display: none;
        ${$media.min.tablet`
            display: block;
        `}
    }
`
