import Link from "next/link"
import { Flex } from "~/components/layout/Flex"
import { HeaderLogo } from "./HeaderLogo"
import { SearchBar } from "./SearchBar"
import { AccountIconWrapper } from "./account-button/AccountIconWrapper"

export function HeaderContent() {
    return (
        <Flex $align="space-between" $padding={0.3}>
            <Link href="/">
                <HeaderLogo />
            </Link>
            <Flex $padding={0.25}>
                <SearchBar />
                <AccountIconWrapper />
            </Flex>
        </Flex>
    )
}
