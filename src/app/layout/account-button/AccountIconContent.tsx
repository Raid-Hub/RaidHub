"use client"

import Image from "next/image"
import QuestionMark from "~/components/icons/QuestionMark"
import UserIcon from "~/components/icons/UserIcon"
import { useSession } from "~/hooks/app/useSession"
import { ICON_SIZE } from "./constants"

export const AccountIconContent = () => {
    const { data: session, status } = useSession()

    if (status === "loading") return <QuestionMark color="white" sx={ICON_SIZE} />
    else if (status === "unauthenticated") return <UserIcon color="white" sx={ICON_SIZE} />
    else if (status === "authenticated") {
        const primaryProfile = session.user.profiles.find(
            p => p.destinyMembershipId === session.primaryDestinyMembershipId
        )
        if (!primaryProfile) return <QuestionMark color="white" sx={ICON_SIZE} />

        return (
            <Image
                src={primaryProfile.image}
                alt="profile"
                unoptimized
                width={ICON_SIZE}
                height={ICON_SIZE}
            />
        )
    } else {
        throw new Error("Invalid status")
    }
}
