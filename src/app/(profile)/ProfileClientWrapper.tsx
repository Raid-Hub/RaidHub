"use client"

import { usePathname } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { ProfileStateManager } from "./ProfileStateManager"
import { type ProfileProps } from "./types"

export function ProfileClientWrapper({
    children,
    pageProps
}: { children: ReactNode } & { pageProps: ProfileProps }) {
    const pathname = usePathname()
    const vanity = pageProps.ssrAppProfile?.vanity

    useEffect(() => {
        if (vanity && pathname.startsWith("/profile")) {
            window.history.replaceState(
                {
                    vanity
                },
                "",
                `/${vanity}`
            )
        }
    }, [vanity, pathname])

    return (
        <PageWrapper pageProps={pageProps}>
            <ProfileStateManager>{children}</ProfileStateManager>
        </PageWrapper>
    )
}
