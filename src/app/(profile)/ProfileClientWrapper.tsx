"use client"

import { useRef, type ReactNode } from "react"
import { PortalProvider } from "~/components/Portal"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { ProfileStateManager } from "./ProfileStateManager"
import { type ProfileProps } from "./types"

export function ProfileClientWrapper({
    children,
    pageProps
}: { children: ReactNode } & { pageProps: ProfileProps }) {
    const ref = useRef<HTMLElement>(null)

    return (
        <PortalProvider target={ref}>
            <PageWrapper ref={ref} pageProps={pageProps}>
                <ProfileStateManager>{children}</ProfileStateManager>
            </PageWrapper>
        </PortalProvider>
    )
}
