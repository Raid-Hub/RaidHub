"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import QuestionMark from "~/components/icons/QuestionMark"
import UserIcon from "~/components/icons/UserIcon"
import { AccountIcon } from "./AccountIcon"

const ICON_SIZE = 32

export function AccountIconWrapper() {
    const session = useSession()

    if (session.status === "loading") return <QuestionMark color="white" sx={ICON_SIZE} />
    return (
        <AccountIcon>
            {session.data?.user.image ? (
                <Image
                    src={session.data.user.image}
                    alt="profile"
                    unoptimized
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                />
            ) : (
                <UserIcon color="white" sx={ICON_SIZE} />
            )}
        </AccountIcon>
    )
}
