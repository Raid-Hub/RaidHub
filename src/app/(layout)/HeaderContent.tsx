import Link from "next/link"
import { Flex } from "~/components/layout/Flex"
import { AccountIconWrapper } from "./AccountIconWrapper"
import { HeaderLogo } from "./HeaderLogo"
import { SearchBar } from "./SearchBar"

export function HeaderContent() {
    return (
        <Flex $align="space-between" $padding={0.3}>
            <Link href="/">
                <HeaderLogo />
            </Link>
            <Flex $padding={0.2}>
                <SearchBar />
                <AccountIconWrapper />
            </Flex>
        </Flex>
    )
}
