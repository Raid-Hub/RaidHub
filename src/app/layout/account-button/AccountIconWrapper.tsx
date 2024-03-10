import Image from "next/image"
import { Suspense } from "react"
import QuestionMark from "~/components/icons/QuestionMark"
import UserIcon from "~/components/icons/UserIcon"
import { getServerSession } from "~/server/api/auth"
import { AccountIcon } from "./AccountIcon"

const ICON_SIZE = 32

export const AccountIconWrapper = () => (
    <AccountIcon>
        <Suspense fallback={<QuestionMark color="white" sx={ICON_SIZE} />}>
            <AccountIconContent />
        </Suspense>
    </AccountIcon>
)

async function AccountIconContent() {
    const session = await getServerSession()

    return (
        <>
            {session?.user.image ? (
                <Image
                    src={session.user.image}
                    alt="profile"
                    unoptimized
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                />
            ) : (
                <UserIcon color="white" sx={ICON_SIZE} />
            )}
        </>
    )
}
