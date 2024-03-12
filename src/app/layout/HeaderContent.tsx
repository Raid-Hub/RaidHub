import Link from "next/link"
import { Suspense } from "react"
import QuestionMark from "~/components/icons/QuestionMark"
import { Flex } from "~/components/layout/Flex"
import { HeaderLogo } from "./HeaderLogo"
import { SearchBar } from "./SearchBar"
import { AccountIcon } from "./account-button/AccountIcon"
import { AccountIconContent } from "./account-button/AccountIconContent"
import { ICON_SIZE } from "./account-button/constants"

export function HeaderContent() {
    return (
        <Flex $align="space-between" $padding={0.3}>
            <Link href="/">
                <HeaderLogo />
            </Link>
            <Flex $padding={0.25}>
                <SearchBar />
                <AccountIcon>
                    <Suspense fallback={<QuestionMark color="white" sx={ICON_SIZE} />}>
                        <AccountIconContent />
                    </Suspense>
                </AccountIcon>
            </Flex>
        </Flex>
    )
}
