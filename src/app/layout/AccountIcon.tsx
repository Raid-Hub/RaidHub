import { useSession } from "next-auth/react"
import Image from "next/image"
import { useCallback, useRef, useState } from "react"
import styled from "styled-components"
import QuestionMark from "~/components/icons/QuestionMark"
import UserIcon from "~/components/icons/UserIcon"
import { Flex } from "~/components/layout/Flex"
import { useClickOutside } from "~/hooks/util/useClickOutside"
import { AccountDropdown } from "./AccountDropdown"

const ICON_SIZE = 32

export const AccountIcon = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const { data: sessionData, status } = useSession()
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

    return (
        <Container>
            <IconContainer $padding={0} onClick={() => setIsDropdownOpen(v => !v)}>
                {status === "authenticated" ? (
                    <Image
                        src={sessionData.user.image}
                        alt="profile"
                        unoptimized
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                    />
                ) : status === "loading" ? (
                    <QuestionMark color="white" sx={ICON_SIZE} />
                ) : (
                    <UserIcon color="white" sx={ICON_SIZE} />
                )}
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
