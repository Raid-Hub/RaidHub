"use client"

import styled from "styled-components"
import { $media } from "~/app/theme"

export const PageWrapper = styled.main`
    min-width: 350px;
    width: 85vw;
    max-width: 1600px;
    margin: 0.5em auto 0.5em auto;
    padding: 0 0.5em;

    ${$media.max.mobile`
        width: 95vw;
    `}
`
