"use client"

import { Variants, m } from "framer-motion"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import styled from "styled-components"
import RightChevron from "~/components/icons/RightChevron"
import { Flex } from "~/components/layout/Flex"

const variants = {
    open: {
        scaleY: 1,
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    },
    closed: {
        scaleY: 0,
        opacity: 0,
        transition: {
            when: "afterChildren"
        }
    }
} satisfies Variants

export const AccountDropdown = (props: { isDropdownOpen: boolean }) => {
    const { data: sessionData, status } = useSession()

    const animate: keyof typeof variants = props.isDropdownOpen ? "open" : "closed"

    return (
        <Container initial={"closed"} animate={animate} variants={variants}>
            <Content $direction="column" $crossAxis="flex-start" $gap={0.25} $padding={0.85}>
                {status === "authenticated" ? (
                    <>
                        <div>
                            <Username>{sessionData.user.name}</Username>
                            <MembershipId>{sessionData.user.destinyMembershipId}</MembershipId>
                        </div>
                        <hr />
                        {sessionData.user.destinyMembershipType &&
                            sessionData.user.destinyMembershipId && (
                                <DropdownLink
                                    title="View Profile"
                                    href={`/profile/${sessionData.user.destinyMembershipType}/${sessionData.user.destinyMembershipId}`}
                                />
                            )}
                        <DropdownLink title="Manage Account" href="/account" />
                        {sessionData.user.role === "ADMIN" && (
                            <DropdownLink title="Admin Panel" href="/admin" />
                        )}
                        {sessionData.user.role === "ADMIN" && (
                            <DropdownLink title="Query Tool" href="/admin/query" />
                        )}
                        <DropdownButton
                            title="Log Out"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        />
                    </>
                ) : (
                    <DropdownButton title="Log In" onClick={() => signIn("bungie")} />
                )}
            </Content>
        </Container>
    )
}

const Container = styled(m.div)`
    position: fixed;
    z-index: 101;

    top: 4em;

    right: 0.5em;
    width: 250px;

    border-radius: 6px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    background-color: color-mix(
        in srgb,
        ${({ theme }) => theme.colors.background.medium},
        #0000 55%
    );

    backdrop-filter: blur(10px);

    transform-origin: top;
`

const Content = styled(Flex)`
    overflow: hidden;
    border-radius: inherit;

    width: 100%;
    border: 1px solid color-mix(in srgb, ${({ theme }) => theme.colors.border.dark}, #0000 60%);

    & hr {
        border-width: 2px;
        width: 100%;
        border-color: color-mix(in srgb, ${({ theme }) => theme.colors.border.dark}, #0000 60%);
    }
`

const Username = styled.div`
    font-size: 1.2rem;
    font-weight: 600;
`

const MembershipId = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text.secondary};
`

const DropDownTitle = styled.div`
    margin: 0.3em 0;
`

const FullWidthLink = styled(Link)`
    width: 100%;
`

const DropdownItemContainer = styled(Flex)`
    cursor: pointer;
    &:hover {
        background-color: color-mix(
            in srgb,
            ${({ theme }) => theme.colors.highlight.orange},
            #0000 60%
        );
    }
`

const DropdownLink = (props: { href: string; title: string }) => (
    <FullWidthLink href={props.href}>
        <DropdownItemContainer $padding={0.2} $align="space-between" $fullWidth>
            <DropDownTitle>{props.title}</DropDownTitle>
            <RightChevron color="orange" />
        </DropdownItemContainer>
    </FullWidthLink>
)

const DropdownButton = (props: { onClick: () => void; title: string }) => (
    <DropdownItemContainer onClick={props.onClick} $padding={0.2} $align="space-between" $fullWidth>
        <DropDownTitle>{props.title}</DropDownTitle>
        <RightChevron color="orange" />
    </DropdownItemContainer>
)
