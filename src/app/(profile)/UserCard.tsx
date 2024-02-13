"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useRef } from "react"
import styled from "styled-components"
import type { ProfileProps } from "~/app/(profile)/types"
import { Card } from "~/components/Card"
import { Container } from "~/components/layout/Container"
import { Flex } from "~/components/layout/Flex"
import { usePageProps } from "~/components/layout/PageWrapper"
import { TabletDesktopSwitch } from "~/components/util/TabletDesktopSwitch"
import { useProfileDecoration } from "~/hooks/app/useProfileDecoration"
import { useSession } from "~/hooks/app/useSession"
import { useItemDefinition } from "~/hooks/dexie/useItemDefinition"
import { useClanForMember } from "~/services/bungie/useClanForMember"
import { useLinkedProfiles } from "~/services/bungie/useLinkedProfiles"
import { useProfile } from "~/services/bungie/useProfile"
import { bannerEmblemUrl, bungieIconUrl, emblemUrl } from "~/util/destiny/bungie-icons"
import { getUserName } from "~/util/destiny/bungieName"
import { fixClanName } from "~/util/destiny/fixClanName"
import { decodeHtmlEntities } from "~/util/presentation/formatting"
import { trpc } from "../trpc"
import { UserCardSocials } from "./UserCardSocials"

/** @deprecated */
export function UserCard() {
    const session = useSession()
    const props = usePageProps<ProfileProps>()

    const destinyProfileQuery = useProfile(
        {
            destinyMembershipId: props.destinyMembershipId,
            membershipType: props.destinyMembershipType
        },
        {
            enabled: props.ready,
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

    const appProfileQuery = trpc.profile.getUnique.useQuery(
        {
            destinyMembershipId: props.destinyMembershipId
        },
        {
            // Required to prevent the query from running before the page is ready
            enabled: props.ready
        }
    )

    const ref = useRef<HTMLDivElement>(null)
    const {
        isEditing,
        opacity,
        color,
        handleCancel,
        handleStartEditing,
        handleEditorInputSave,
        handleReset,
        setOpacity,
        setColor
    } = useProfileDecoration(ref)

    const { emblemMobileUrl, emblemHash } = useMemo(() => {
        const emblems = destinyProfileQuery?.data?.characters?.data
            ? Object.values(destinyProfileQuery.data.characters.data)[0]
            : undefined

        return {
            emblemMobileUrl: emblemUrl(emblems?.emblemBackgroundPath),
            emblemHash: emblems?.emblemHash
        }
    }, [destinyProfileQuery])

    const emblemDefinition = useItemDefinition(emblemHash ?? 0)
    const emblemBannerUrl = bannerEmblemUrl(emblemDefinition)

    const userInfo = destinyProfileQuery?.data?.profile.data?.userInfo ?? bungieProfileQuery.data

    const icon =
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        appProfileQuery.data?.image ||
        (bungieProfileQuery.data?.iconPath ? bungieIconUrl(bungieProfileQuery.data.iconPath) : null)

    const { data: clan } = useClanForMember(
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
                default="desktop"
                tablet={
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
                desktop={
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

    color: ${({ theme }) => theme.colors.text.primary};
`

const Subtitle = styled.div`
    margin-block: 0.1em;
    font-size: 1.125rem;

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
`

const BannerOverlay = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 8em;
`

// return (
//     <>
//         {isEditing && (
//             <div className={styles["edit-background-modal"]}>
//                 <div className={styles["edit-background-btns"]}>
//                     <button onClick={handleCancel}>Cancel</button>
//                     <button onClick={handleEditorInputSave}>Save</button>
//                     <button onClick={handleReset}>Reset</button>
//                 </div>
//                 <label htmlFor="colorpicker" style={{ display: "block", margin: "0.7em" }}>
//                     Pick a color from the menu below:
//                 </label>
//                 <input
//                     className={styles["custom-color-picker"]}
//                     type="color"
//                     id="colorpicker"
//                     value={color}
//                     onChange={e => setColor(e.target.value)}
//                 />
//                 <label htmlFor="opacityslider" style={{ display: "block", margin: "0.7em" }}>
//                     Adjust opacity:
//                 </label>
//                 <input
//                     type="range"
//                     min="0"
//                     max="255"
//                     step="1"
//                     id="opacityslider"
//                     value={opacity}
//                     onChange={e => setOpacity(parseInt(e.target.value, 10))}
//                 />
//             </div>
//         )}
//         <div ref={ref} className={styles.card}>
//             {appProfileQuery.isLoading ? (
//                 <Loading className={styles["card-loading"]} />
//             ) : (
//                 <>
//                     <div className={styles.banner}>
//                         <Image
//                             unoptimized
//                             className={styles["image-background"]}
//                             src={emblem}
//                             width={474}
//                             height={96}
//                             priority
//                             alt="profile banner"
//                         />

//                         <div className={styles.details}>
//                             <Image
//                                 src={
//                                     appProfileQuery.data?.image ??
//                                     bungieIconUrl(userInfo?.iconPath)
//                                 }
//                                 unoptimized
//                                 width={80}
//                                 height={80}
//                                 alt="profile picture"
//                             />

//                             <div className={styles["profile-username"]}>
//                                 {userInfo && <UserName {...userInfo} />}
//                             </div>
//                         </div>
//                         {userInfo &&
//                             userInfo.membershipId === session.data?.user.destinyMembershipId &&
//                             !isEditing && (
//                                 <>
//                                     <div
//                                         className={styles["edit-btn"]}
//                                         onClick={handleStartEditing}>
//                                         <Edit />
//                                     </div>
//                                 </>
//                             )}
//                     </div>

//                     <div className={styles.icons}>
//                         {socials?.map((social, key) => (
//                             <SocialTag {...social} key={key} />
//                         ))}
//                     </div>
//                 </>
//             )}
//         </div>
//     </>
// )
