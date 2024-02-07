"use client"

import styled from "styled-components"
import { $media } from "~/app/managers/StyledComponentsManager"

export const PageWrapper = styled.main`
    margin: 0.5em auto;
    margin-bottom: 1.5em;

    ${$media.max.desktop`
         min-width: ${dimensions => dimensions.min};
         max-width: 85%;
    `} ${$media.max.laptop`
         min-width: ${dimensions => dimensions.min};
         max-width: 88%;
    `} ${$media.max.tablet`
         min-width: ${dimensions => dimensions.min};
         max-width: 90%;
    `} ${$media.max.mobile`
         min-width: ${dimensions => dimensions.min};
         max-width: 93%;
    `} ${$media.max.tiny`
         min-width: ${dimensions => dimensions.min};
            max-width: 100%;
    `};
`
