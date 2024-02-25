"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import styled from "styled-components"
import type { ProfileProps } from "~/app/(profile)/types"
import { Card } from "~/components/Card"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { usePageProps } from "~/components/layout/PageWrapper"
import { TabletDesktopSwitch } from "~/components/util/TabletDesktopSwitch"
import { useItemDefinition } from "~/hooks/dexie"
import { useClansForMember } from "~/services/bungie/useClansForMember"
import { useLinkedProfiles } from "~/services/bungie/useLinkedProfiles"
import { useProfile } from "~/services/bungie/useProfile"
import { useRaidHubResolvePlayer } from "~/services/raidhub/useRaidHubResolvePlayers"
import { bungieBannerEmblemUrl, bungieEmblemUrl, bungieIconUrl } from "~/util/destiny/bungie-icons"
import { getUserName } from "~/util/destiny/bungieName"
import { fixClanName } from "~/util/destiny/fixClanName"
import { decodeHtmlEntities } from "~/util/presentation/formatting"
import { $media } from "../(layout)/media"
import { trpc } from "../trpc"
import { UserCardSocials } from "./UserCardSocials"

export function UserCard() {
    const props = usePageProps<ProfileProps>()

    const destinyProfileQuery = useProfile(
        {
            destinyMembershipId: props.destinyMembershipId,
            membershipType: props.destinyMembershipType
        },
        {
            staleTime: 1000 * 60 * 2,
            // Do not use initialData here, as it will cause hydration issues with RSC
            placeholderData: props.ssrDestinyProfile ?? undefined
        }
    )

    const bungieProfileQuery = useLinkedProfiles(
        {
            membershipId: props.destinyMembershipId
        },
        {
            select: res => res.bnetMembership
        }
    )

    const { data: appProfileImage } = trpc.profile.getUnique.useQuery(
        {
            destinyMembershipId: props.destinyMembershipId
        },
        {
            select: data => data?.image ?? null,
            // Required to prevent the query from running before the page is ready
            enabled: props.ready
        }
    )

    const { data: resolvedPlayer } = useRaidHubResolvePlayer(props.destinyMembershipId, {
        // We don't need to call this endpoint, but if we have the data, we can use it
        enabled: false
    })

    const { emblemMobileUrl, emblemHash } = useMemo(() => {
        const emblems = destinyProfileQuery?.data?.characters?.data
            ? Object.values(destinyProfileQuery.data.characters.data)[0]
            : undefined

        return {
            emblemMobileUrl: bungieEmblemUrl(emblems?.emblemBackgroundPath),
            emblemHash: emblems?.emblemHash
        }
    }, [destinyProfileQuery])

    const emblemBannerUrl = bungieBannerEmblemUrl(useItemDefinition(emblemHash ?? -1))

    const userInfo =
        destinyProfileQuery?.data?.profile.data?.userInfo ??
        bungieProfileQuery.data ??
        resolvedPlayer

    const icon =
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        appProfileImage ||
        (bungieProfileQuery.data?.iconPath ? bungieIconUrl(bungieProfileQuery.data.iconPath) : null)

    const { data: clan } = useClansForMember(
        { membershipId: props.destinyMembershipId, membershipType: props.destinyMembershipType },
        {
            staleTime: 10 * 60000,
            select: res => (res.results.length > 0 ? res.results[0].group : null)
        }
    )

    const clanTitle = useMemo(
        () =>
            clan
                ? decodeHtmlEntities(fixClanName(clan.name) + ` [${clan.clanInfo.clanCallsign}]`)
                : null,
        [clan]
    )

    return (
        <Card $overflowHidden $fullWidth>
            <TabletDesktopSwitch
                sm={
                    <>
                        <Container
                            $aspectRatio={{
                                width: 474,
                                height: 96
                            }}>
                            <Image
                                src={emblemMobileUrl}
                                unoptimized
                                fill
                                priority
                                alt="profile banner"
                            />
                        </Container>
                        <Flex $direction="column">
                            <Flex
                                $direction="column"
                                $crossAxis="flex-start"
                                $gap={0.25}
                                $padding={0}
                                $fullWidth>
                                <Nameplate>
                                    {userInfo ? getUserName(userInfo) : "Guardian#0000"}
                                </Nameplate>
                                {clanTitle && (
                                    <Subtitle>
                                        <Link href={`/clan/${clan!.groupId}`}>{clanTitle}</Link>
                                    </Subtitle>
                                )}
                            </Flex>
                            {/* Rankings */}
                            <UserCardSocials size="lg" />
                        </Flex>
                    </>
                }
                lg={
                    <>
                        <Container
                            $aspectRatio={{
                                width: 1958,
                                height: 146
                            }}>
                            <BannerOverlay>
                                <UserCardSocials size="sm" bottom />
                            </BannerOverlay>
                            <Image
                                src={emblemBannerUrl}
                                style={{ zIndex: -1 }}
                                unoptimized
                                fill
                                priority
                                alt="profile banner"
                            />
                        </Container>
                        <Flex
                            $direction="row"
                            $align="space-between"
                            $gap={0.25}
                            $padding={0.75}
                            $fullWidth>
                            <Flex $padding={0}>
                                <ProfilePicture
                                    src={icon ?? "https://raidhub.s3.amazonaws.com/d2-logo.jpg"}
                                    width={50}
                                    height={50}
                                    alt="profile picture"
                                    unoptimized
                                />
                                <Flex
                                    $direction="column"
                                    $crossAxis="flex-start"
                                    $gap={0.1}
                                    $padding={0.3}>
                                    <Nameplate>
                                        {userInfo ? getUserName(userInfo) : "Guardian#0000"}
                                    </Nameplate>
                                    {clanTitle && (
                                        <Subtitle>
                                            <Link href={`/clan/${clan!.groupId}`}>{clanTitle}</Link>
                                        </Subtitle>
                                    )}
                                </Flex>
                            </Flex>
                        </Flex>
                    </>
                }
            />
        </Card>
    )
}

const Nameplate = styled.h1`
    margin-block: 0.1em;
    font-size: 1.5rem;
    ${$media.max.mobile`
        font-size: 1.375rem;
    `}

    color: ${({ theme }) => theme.colors.text.primary};
`

const Subtitle = styled.div`
    margin-block: 0.1em;
    font-size: 1.125rem;
    ${$media.max.mobile`
        font-size: 1rem;
    `}

    & a {
        color: ${({ theme }) => theme.colors.text.secondary};
    }
`

const ProfilePicture = styled(Image)`
    aspect-ratio: 1 / 1;

    z-index: 1;
    margin: 0 0.25em;
    margin-top: -25%;

    height: 6em;
    width: unset;

    border-radius: 50%;
    border: 1px solid color-mix(in srgb, ${({ theme }) => theme.colors.border.medium}, #0000 60%);

    backdrop-filter: blur(6px);
    box-shadow: 0 0 0.5em
        color-mix(in srgb, ${({ theme }) => theme.colors.border.medium}, #0000 60%);
`

const BannerOverlay = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 8em;
`
