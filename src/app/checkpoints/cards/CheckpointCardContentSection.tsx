"use client"

import { type ReactNode } from "react"
import styled, { keyframes } from "styled-components"
import { Flex } from "~/components/layout/Flex"

export function CheckpointCardContentSection(props: {
    sectionTitle: string
    sectionDifficulty: string
    currentPlayers: number
    maxPlayers: number
    children: ReactNode
}) {
    return (
        <>
            <CheckpointSectionTitle
                currentPlayers={props.currentPlayers}
                maxPlayers={props.maxPlayers}
                sectionTitle={props.sectionTitle}
                sectionDifficulty={props.sectionDifficulty}>
                {props.children}
            </CheckpointSectionTitle>
            {props.children}
        </>
    )
}

const CheckpointSectionTitle = (props: {
    sectionTitle: string
    sectionDifficulty: string
    currentPlayers: number
    maxPlayers: number
    children: ReactNode
}) => {
    return (
        <Flex $direction="row" $crossAxis="center" $gap={0} $padding={0} $align="space-between">
            <Flex $direction="column" $crossAxis="flex-start" $gap={0} $padding={0}>
                <CheckpointTitle>{props.sectionTitle}</CheckpointTitle>
                <CheckpointDificulty>{props.sectionDifficulty}</CheckpointDificulty>
            </Flex>
            <Flex $direction="row" $crossAxis="center" $gap={0.5} $padding={0} $align="flex-start">
                {props.currentPlayers}/{props.maxPlayers}
                {props.currentPlayers <= 2 && props.maxPlayers >= 1 && (
                    <PulseAnimation backgroundColor="#61DC75" />
                )}
                {props.currentPlayers >= 3 && props.currentPlayers <= 5 && (
                    <PulseAnimation backgroundColor="#E5A830" />
                )}
                {props.currentPlayers >= 6 && <PulseAnimation backgroundColor="#E53030" />}
            </Flex>
        </Flex>
    )
}

const pulse = keyframes`
    50% {
        opacity: 0.5;
    }
`

const PulseAnimation = styled.div<{ backgroundColor: string }>`
    width: 20px;
    height: 20px;
    background-color: ${props => props.backgroundColor};
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
