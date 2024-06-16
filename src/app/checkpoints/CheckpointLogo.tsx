"use client"

import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"
import { Flex } from "~/components/layout/Flex"
import { $media } from "../layout/media"

export const CheckpointLogo = () => {
    return (
        <Flex $direction="column" $padding={0} $paddingY={2} $crossAxis="flex-start" $fullWidth>
            <BackgroundLogo src="/ORANGE.png" alt="d2checkpoint" width={70} height={70} />
            <h1>Checkpoints</h1>
            <span style={{ marginTop: "-2em" }}>
                All checkpoints provided by{" "}
                <Link href="https://d2checkpoint.com/" style={{ fontWeight: 600 }}>
                    d2checkpoint.com
                </Link>
            </span>
            <span style={{ marginTop: "-1em" }}>
                Visit their site for more information and{" "}
                <Link href="https://d2checkpoint.com/faqs" style={{ fontWeight: 600 }}>
                    FAQ
                </Link>
                s
            </span>
        </Flex>
    )
}

const BackgroundLogo = styled(Image)`
    position: absolute;
    z-index: -1;
    opacity: 0.1;
    width: 12rem;
    height: 12rem;

    ${$media.max.tablet`
        width: 8rem;
        height: 8rem;
    `}

    ${$media.max.mobile`
        width: 6rem;
        height: 6rem;
    `}

    ${$media.max.tiny`
        width: 4.5rem;
        height: 4.5rem;
    `}
`
