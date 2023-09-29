import styles from "~/styles/pages/profile/user.module.css"
import SocialTag from "./SocialTag"
import UserName from "./UserName"
import Loading from "../../global/Loading"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useMemo, useRef } from "react"
import { useLocale } from "../../app/LocaleManager"
import { Socials } from "../../../util/profile/socials"
import { ProfileSocialData } from "../../../types/profile"
import { useBungieClient } from "~/components/app/TokenManager"
import { emblemUrl, bungieIconUrl } from "~/util/destiny/bungie-icons"
import { trpc } from "~/util/trpc"
import { useProfileDecoration } from "~/hooks/raidhub/useProfileDecoration"
import { useProfileProps } from "../Profile"
import BungieShield from "~/images/icons/connections/BungieShield"
import DiscordIcon from "~/images/icons/connections/DiscordIcon"
import TwitterIcon from "~/images/icons/connections/TwitterIcon"
import TwitchIcon from "~/images/icons/connections/TwitchIcon"
import SpeedrunIcon from "~/images/icons/connections/SpeedrunIcon"
import YoutubeIcon from "~/images/icons/connections/YoutubeIcon"

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
        if (raidHubProfile.bungieUsername) {
            socials.push({
                id: Socials.Bungie,
                Icon: BungieShield,
                displayName: raidHubProfile.bungieUsername,
                url: `https://www.bungie.net/7/en/User/Profile/${raidHubProfile.destinyMembershipType}/${raidHubProfile.destinyMembershipId}`
            })
        }
        if (raidHubProfile.discordUsername) {
            socials.push({
                id: Socials.Discord,
                Icon: DiscordIcon,
                displayName: raidHubProfile.discordUsername
            })
        }
        if (raidHubProfile.twitterUsername) {
            socials.push({
                id: Socials.Twitter,
                Icon: TwitterIcon,
                displayName: raidHubProfile.twitterUsername,
                url: `https://twitter.com/${raidHubProfile.twitterUsername}`
            })
        }
        if (raidHubProfile.youtubeUsername) {
            socials.push({
                id: Socials.YouTube,
                Icon: YoutubeIcon,
                displayName: raidHubProfile.youtubeUsername,
                url: `https://youtube.com/${raidHubProfile.youtubeUsername}`
            })
        }
        if (raidHubProfile.twitchUsername) {
            socials.push({
                id: Socials.Twitch,
                Icon: TwitchIcon,
                displayName: raidHubProfile.twitchUsername,
                url: `https://twitch.tv/${raidHubProfile.twitchUsername}`
            })
        }

        if (raidHubProfile.speedrunUsername) {
            socials.push({
                id: Socials.Speedrun,
                Icon: SpeedrunIcon,
                displayName: raidHubProfile.speedrunUsername,
                url: `https://www.speedrun.com/users/${raidHubProfile.speedrunUsername}`
            })
        }
        return socials
    }, [raidHubProfile])

    const ref = useRef<HTMLDivElement>(null)
    const {
        isEditing,
        handleCancel,
        handleStartEditing,
        handleEditorInputSave,
        handleReset,
        inputStyling,
        setInputStyling
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
                                <button className={styles["edit-btn"]} onClick={handleStartEditing}>
                                    {strings.edit}
                                </button>
                            )}
                    </div>

                    <div className={styles["icons"]}>
                        {socials &&
                            socials.map((social, key) => <SocialTag {...social} key={key} />)}
                    </div>

                    {isEditing && (
                        <div className={styles["edit-background-modal"]}>
                            <div className={styles["edit-background-btns"]}>
                                <button onClick={handleCancel}>{strings.cancel}</button>
                                <button onClick={handleEditorInputSave}>{strings.save}</button>
                                <button onClick={handleReset}>{strings.reset}</button>
                            </div>
                            <p className={styles["edit-background-info-text"]}>
                                Paste a valid value for the css <code>background</code> property
                                here.{" "}
                                <a
                                    href="https://www.joshwcomeau.com/gradient-generator/"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    Online generator
                                </a>
                            </p>
                            <textarea
                                className={styles["edit-background-input"]}
                                name={"background-editor"}
                                onChange={e => setInputStyling(e.target.value)}
                                value={inputStyling}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
