"use client"

import styled, { keyframes } from "styled-components"
import { Flex } from "~/components/layout/Flex"

export const CardContent = styled(Flex)`
    padding: 0.5em 1em;
    & hr {
        border-color: ${({ theme }) => theme.colors.border.medium};
    }
`

export const pulse = keyframes`
    50% {
        opacity: 0.5;
    }
`

export const PulseAnimation = styled.div<{ color: string }>`
    width: 20px;
    height: 20px;
    background-color: ${props => props.color};
    border-radius: 100%;
    animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    border: 2px solid rgba(0, 0, 0, 0.2);
`

export const CheckpointDificulty = styled.p`
    color: ${({ theme }) => theme.colors.text.tertiary};
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);

    font-size: 1em;
    font-weight: 500;
    text-transform: uppercase;

    letter-spacing: 0.2em;

    white-space: nowrap;
`

export const CheckpointTitle = styled.h3`
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);

    font-size: 1em;
    font-weight: 800;
    text-transform: uppercase;

    white-space: nowrap;

    margin-bottom: -1em;
`
