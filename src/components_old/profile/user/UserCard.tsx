"use client"

import Image from "next/image"
import { useMemo, useRef } from "react"
import type { ProfileProps, ProfileSocialData } from "~/app/(profile)/types"
import { trpc } from "~/app/trpc"
import { Loading } from "~/components/Loading"
import DiscordIcon from "~/components/icons/DiscordIcon"
import Edit from "~/components/icons/Edit"
import SpeedrunIcon from "~/components/icons/SpeedrunIcon"
import TwitchIcon from "~/components/icons/TwitchIcon"
import TwitterIcon from "~/components/icons/TwitterIcon"
import YoutubeIcon from "~/components/icons/YoutubeIcon"
import { usePageProps } from "~/components/layout/PageWrapper"
import { useProfileDecoration } from "~/hooks/app/useProfileDecoration"
import { useSession } from "~/hooks/app/useSession"
import { useProfile } from "~/services/bungie/useProfile"
import { bungieIconUrl, emblemUrl } from "~/util/destiny/bungie-icons"
import { Socials } from "~/util/profile/socials"
import SocialTag from "./SocialTag"
import UserName from "./UserName"
import styles from "./user.module.css"

/** @deprecated */
export function UserCard() {
    const session = useSession()

    const props = usePageProps<ProfileProps>()

    const appProfileQuery = trpc.profile.getUnique.useQuery(
        {
            destinyMembershipId: props.destinyMembershipId
        },
        {
            // Required to prevent the query from running before the page is ready
            enabled: props.ready,
            placeholderData: props.ssrAppProfile ?? undefined
        }
    )

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

    const socials = useMemo(() => {
        if (!appProfileQuery.data) return null
        const socials = new Array<ProfileSocialData>()
        const { connections } = appProfileQuery.data
        const discord = connections.find(c => c.provider === "discord")
        if (discord?.displayName) {
            socials.push({
                id: Socials.Discord,
                Icon: DiscordIcon,
                url: discord.url,
                displayName: discord.displayName
            })
        }
        const twitter = connections.find(c => c.provider === "twitter")
        if (twitter?.displayName) {
            socials.push({
                id: Socials.Twitter,
                Icon: TwitterIcon,
                url: twitter.url,
                displayName: twitter.displayName
            })
        }

        const google = connections.find(c => c.provider === "google")
        if (google?.displayName) {
            socials.push({
                id: Socials.YouTube,
                Icon: YoutubeIcon,
                url: google.url,
                displayName: google.displayName
            })
        }

        const twitch = connections.find(c => c.provider === "twitch")
        if (twitch?.displayName) {
            socials.push({
                id: Socials.Twitch,
                Icon: TwitchIcon,
                url: twitch.url,
                displayName: twitch.displayName
            })
        }

        const speedrun = connections.find(c => c.provider === "speedrun")
        if (speedrun?.displayName) {
            socials.push({
                id: Socials.Speedrun,
                Icon: SpeedrunIcon,
                url: speedrun.url,
                displayName: speedrun.displayName
            })
        }

        return socials
    }, [appProfileQuery.data])

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

    const emblem = useMemo(
        () =>
            emblemUrl(
                destinyProfileQuery?.data?.characters?.data
                    ? Object.values(destinyProfileQuery.data.characters.data)[0]
                          ?.emblemBackgroundPath
                    : undefined
            ),
        [destinyProfileQuery]
    )

    const userInfo = destinyProfileQuery?.data?.profile.data?.userInfo

    return (
        <>
            {isEditing && (
                <div className={styles["edit-background-modal"]}>
                    <div className={styles["edit-background-btns"]}>
                        <button onClick={handleCancel}>Cancel</button>
                        <button onClick={handleEditorInputSave}>Save</button>
                        <button onClick={handleReset}>Reset</button>
                    </div>
                    <label htmlFor="colorpicker" style={{ display: "block", margin: "0.7em" }}>
                        Pick a color from the menu below:
                    </label>
                    <input
                        className={styles["custom-color-picker"]}
                        type="color"
                        id="colorpicker"
                        value={color}
                        onChange={e => setColor(e.target.value)}
                    />
                    <label htmlFor="opacityslider" style={{ display: "block", margin: "0.7em" }}>
                        Adjust opacity:
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="255"
                        step="1"
                        id="opacityslider"
                        value={opacity}
                        onChange={e => setOpacity(parseInt(e.target.value, 10))}
                    />
                </div>
            )}
            <div ref={ref} className={styles.card}>
                {appProfileQuery.isLoading ? (
                    <Loading className={styles["card-loading"]} />
                ) : (
                    <>
                        <div className={styles.banner}>
                            <Image
                                unoptimized
                                className={styles["image-background"]}
                                src={emblem}
                                width={474}
                                height={96}
                                priority
                                alt="profile banner"
                            />

                            <div className={styles.details}>
                                <Image
                                    src={
                                        appProfileQuery.data?.image ??
                                        bungieIconUrl(userInfo?.iconPath)
                                    }
                                    unoptimized
                                    width={80}
                                    height={80}
                                    alt="profile picture"
                                />

                                <div className={styles["profile-username"]}>
                                    {userInfo && <UserName {...userInfo} />}
                                </div>
                            </div>
                            {userInfo &&
                                userInfo.membershipId === session.data?.user.destinyMembershipId &&
                                !isEditing && (
                                    <>
                                        <div
                                            className={styles["edit-btn"]}
                                            onClick={handleStartEditing}>
                                            <Edit />
                                        </div>
                                    </>
                                )}
                        </div>

                        <div className={styles.icons}>
                            {socials?.map((social, key) => (
                                <SocialTag {...social} key={key} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
