"use client"

import { useCallback, useRef, useState } from "react"
import styled from "styled-components"
import { Loader } from "~/components/Loader"
import { SearchInput } from "~/components/form/SearchInput"
import Search from "~/components/icons/Search"
import { Flex } from "~/components/layout/Flex"
import { useSearch } from "~/hooks/useSearch"
import { useClickOutside } from "~/hooks/util/useClickOutside"
import { useUserAgent } from "~/hooks/util/useUserAgent"
import { $media } from "../managers/StyledComponentsManager"
import { HeaderSearchResults } from "./HeaderSearchResults"

const HIDE_AFTER_CLICK = 100

type SearchBarProps = {}

export const SearchBar = () => {
    const userAgent = useUserAgent()
    const OSKey = userAgent?.toLowerCase().includes("mac") ? "⌘" : "ctrl"

    const hideResults = useCallback(() => setIsShowingResults(false), [])

    const { enteredText, isLoading, results, handleInputChange, handleFormSubmit, clearQuery } =
        useSearch({
            onRedirect: hideResults
        })
    const [isShowingResults, setIsShowingResults] = useState(false)
    const searchContainerRef = useRef<HTMLFormElement>(null)

    const handleSelect = (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        clearQuery()
        setTimeout(hideResults, HIDE_AFTER_CLICK)
    }

    useClickOutside(
        { ref: searchContainerRef, enabled: isShowingResults, lockout: 150 },
        hideResults
    )

    return (
        <Container onSubmit={handleFormSubmit} ref={searchContainerRef}>
            <LeftIcon>{isLoading ? <Loader $stroke={2} /> : <Search color="white" />}</LeftIcon>
            <SearchInput
                $size={5}
                $pl={1.5}
                $insetRight={6}
                placeholder="Search for a Guardian..."
                value={enteredText}
                onClick={() => setIsShowingResults(true)}
                onChange={e => {
                    handleInputChange(e)
                    setIsShowingResults(true)
                }}
            />
            {userAgent && (
                <Keys $padding={0} $gap={0.2}>
                    <kbd>{OSKey}</kbd>
                    <kbd>k</kbd>
                </Keys>
            )}
            {isShowingResults && (
                <HeaderSearchResults results={results} handleSelect={handleSelect} />
            )}
            {/* {isShowingResults && (
                    <ul className={styles["search-results"]}>
                        {results.map((user, idx) => (
                            <li key={idx}>
                                <Link
                                    className={styles["search-result"]}
                                    href={`/profile/${user.membershipType ?? 0}/${
                                        user.membershipId
                                    }`}
                                    onClick={handleSelect}
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "0.5em"
                                    }}>
                                    <div
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            position: "relative"
                                        }}>
                                        <Image
                                            src={bungieIconUrl(user.iconPath)}
                                            unoptimized
                                            fill
                                            alt={""}
                                        />
                                    </div>
                                    <p style={{ flex: 1 }}>{getUserName(user)}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )} */}
        </Container>
    )
}

const Container = styled.form`
    position: relative;

    ${$media.max.tablet`
        min-width: 50vw;
    `}

    ${$media.max.mobile`
        min-width: 60vw;
    `}
`

const LeftIcon = styled.div`
    position: absolute;
    left: 0.5em;
    top: 50%;
    transform: translateY(-50%);

    min-height: 50%;
    aspect-ratio: 1/1;
`

const Keys = styled(Flex)`
    position: absolute;
    right: 0.3em;
    top: 50%;
    transform: translateY(-50%);

    font-size: 1rem;
    user-select: none;
    color: ${({ theme }) => theme.colors.text.secondary};

    & * {
        display: inline-block;
        font-weight: 500;
        line-height: 1;
    }

    & kbd {
        background-color: color-mix(
            in srgb,
            ${({ theme }) => theme.colors.background.medium},
            #0000 65%
        );
        padding: 0.12em 0.3em;
        border-radius: 0.2em;
    }

    ${$media.max.tablet`
        display: none;
    `}
`
