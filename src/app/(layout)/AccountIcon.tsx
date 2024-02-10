"use client"

import { ReactNode, useCallback, useRef, useState } from "react"
import styled from "styled-components"
import { Flex } from "~/components/layout/Flex"
import { useClickOutside } from "~/hooks/util/useClickOutside"
import { usePageChange } from "~/hooks/util/usePageChange"
import { AccountDropdown } from "./AccountDropdown"

export const AccountIcon = (props: { children: ReactNode }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const closeDropdown = useCallback(() => setIsDropdownOpen(false), [])

    useClickOutside(
        {
            ref: ref,
            enabled: isDropdownOpen,
            lockout: 50
        },
        closeDropdown
    )

    const pageChangeCallback = useRef(() => {})
    pageChangeCallback.current = closeDropdown
    usePageChange(pageChangeCallback)

    return (
        <Container>
            <IconContainer $padding={0} onClick={() => setIsDropdownOpen(v => !v)}>
                {props.children}
            </IconContainer>
            <AccountDropdown isDropdownOpen={isDropdownOpen} />
        </Container>
    )
}

const Container = styled.div`
    position: relative;
`

const IconContainer = styled(Flex)`
    position: relative;
    aspect-ratio: 1/1;
    cursor: pointer;
`
