import { useSession } from "next-auth/react"
import Image from "next/image"
import { useMemo, useRef } from "react"
import { useLocale } from "~/app/managers/LocaleManager"
import { useBungieClient } from "~/components/app/TokenManager"
import Loading from "~/components/global/Loading"
import { useProfileDecoration } from "~/hooks/app/useProfileDecoration"
import Edit from "~/images/icons/Edit"
import DiscordIcon from "~/images/icons/connections/DiscordIcon"
import SpeedrunIcon from "~/images/icons/connections/SpeedrunIcon"
import TwitchIcon from "~/images/icons/connections/TwitchIcon"
import TwitterIcon from "~/images/icons/connections/TwitterIcon"
import YoutubeIcon from "~/images/icons/connections/YoutubeIcon"
import styles from "~/styles/pages/profile/user.module.css"
import { ProfileSocialData } from "~/types/profile"
import { bungieIconUrl, emblemUrl } from "~/util/destiny/bungie-icons"
import { Socials } from "~/util/profile/socials"
import { trpc } from "~/util/trpc"
import { useProfileProps } from "../Profile"
import SocialTag from "./SocialTag"
import UserName from "./UserName"

export default function UserCard() {
    const { destinyMembershipId, destinyMembershipType } = useProfileProps()
    const bungie = useBungieClient()
    const { data: session } = useSession()
    const { data: bungieProfile, isLoading: isLoadingProfile } = bungie.profile.useQuery({
        destinyMembershipId,
        membershipType: destinyMembershipType
    })
    const { data: raidHubProfile } = trpc.profile.byDestinyMembershipId.useQuery({
        destinyMembershipId
    })

    const socials = useMemo(() => {
        if (!raidHubProfile) return null
        const socials = new Array<ProfileSocialData>()
        const { connections } = raidHubProfile
        if (connections.has("discord")) {
            socials.push({
                id: Socials.Discord,
                Icon: DiscordIcon,
                ...connections.get("discord")!
            })
        }
        if (connections.has("twitter")) {
            socials.push({
                id: Socials.Twitter,
                Icon: TwitterIcon,
                ...connections.get("twitter")!
            })
        }
        if (connections.has("google")) {
            socials.push({
                id: Socials.YouTube,
                Icon: YoutubeIcon,
                ...connections.get("google")!
            })
        }
        if (connections.has("twitch")) {
            socials.push({
                id: Socials.Twitch,
                Icon: TwitchIcon,
                ...connections.get("twitch")!
            })
        }

        if (connections.has("speedrun")) {
            socials.push({
                id: Socials.Speedrun,
                Icon: SpeedrunIcon,
                ...connections.get("speedrun")!
            })
        }
        return socials
    }, [raidHubProfile])

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

    const { strings } = useLocale()

    const emblem = useMemo(
        () =>
            emblemUrl(
                bungieProfile?.characters.data
                    ? Object.values(bungieProfile.characters.data)[0]?.emblemBackgroundPath
                    : undefined
            ),
        [bungieProfile?.characters?.data]
    )

    const userInfo = bungieProfile?.profile.data?.userInfo

    return (
        <>
            {isEditing && (
                <div className={styles["edit-background-modal"]}>
                    <div className={styles["edit-background-btns"]}>
                        <button onClick={handleCancel}>{strings.cancel}</button>
                        <button onClick={handleEditorInputSave}>{strings.save}</button>
                        <button onClick={handleReset}>{strings.reset}</button>
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
            <div ref={ref} className={styles["card"]}>
                {isLoadingProfile ? (
                    <Loading className={styles["card-loading"]} />
                ) : (
                    <>
                        <div className={styles["banner"]}>
                            <Image
                                unoptimized
                                className={styles["image-background"]}
                                src={emblem}
                                width={474}
                                height={96}
                                priority
                                alt="profile banner"
                            />

                            <div className={styles["details"]}>
                                <Image
                                    src={raidHubProfile?.image ?? bungieIconUrl(userInfo?.iconPath)}
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
                                userInfo.membershipId === session?.user.destinyMembershipId &&
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

                        <div className={styles["icons"]}>
                            {socials &&
                                socials.map((social, key) => <SocialTag {...social} key={key} />)}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
