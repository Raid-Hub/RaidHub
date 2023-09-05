import styles from "../../../styles/pages/profile/user.module.css"
import { UserInfoCard } from "bungie-net-core/models"
import SocialTag from "./SocialTag"
import UserName from "./UserName"
import Loading from "../../global/Loading"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLocale } from "../../app/LocaleManager"
import { useRaidHubProfileMutation } from "../../../hooks/raidhub/useRaidHubProfileMutation"
import { Profile } from "../../../types/api"
import { Socials } from "../../../util/profile/socials"
import { ProfileSocialData } from "../../../types/profile"

const defaultEditInput = "black"

type UserCardProps = {
    isLoading: boolean
    userInfo: UserInfoCard | undefined
    raidHubProfile: Profile | null
    destinyMembershipId: string
    emblemBackgroundPathSrc: string
}

const UserCard = ({
    isLoading,
    userInfo,
    raidHubProfile,
    destinyMembershipId,
    emblemBackgroundPathSrc
}: UserCardProps) => {
    const { data } = useSession()
    const { strings } = useLocale()
    const ref = useRef<HTMLDivElement>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [inputStyling, setInputStyling] = useState<string>("")
    const { mutate: mutateProfile } = useRaidHubProfileMutation(destinyMembershipId)

    useEffect(() => {
        if (ref.current) {
            ref.current.style.cssText =
                "background: " +
                inputStyling
                    .split(";")
                    .filter(Boolean)
                    .map(
                        line =>
                            line.replace("background-image: ", "").replace("background: ", "") ??
                            "".replace("\n: ", "").replace(/;$/, "")
                    )[0]
        }
    }, [inputStyling, isLoading])

    useEffect(() => {
        setInputStyling(raidHubProfile?.profile?.profileDecoration ?? defaultEditInput)
    }, [raidHubProfile?.profile?.profileDecoration])

    const handleEditorInputSave = useCallback(() => {
        mutateProfile({
            profileDecoration: inputStyling
        })
        setIsEditing(false)
    }, [inputStyling, mutateProfile])

    const socials = useMemo(() => {
        if (!raidHubProfile) return null
        const socials = new Array<ProfileSocialData>()
        if (raidHubProfile.bungieUsername) {
            socials.push({
                id: Socials.Bungie,
                displayName: raidHubProfile.bungieUsername,
                url: `https://www.bungie.net/7/en/User/Profile/${raidHubProfile.destinyMembershipType}/${raidHubProfile.destinyMembershipId}`
            })
        }
        if (raidHubProfile.discordUsername) {
            socials.push({
                id: Socials.Discord,
                displayName: raidHubProfile.discordUsername
            })
        }
        if (raidHubProfile.twitterUsername) {
            socials.push({
                id: Socials.Twitter,
                displayName: raidHubProfile.twitterUsername,
                url: `https://twitter.com/${raidHubProfile.twitterUsername}`
            })
        }
        if (raidHubProfile.twitchUsername) {
            socials.push({
                id: Socials.Twitch,
                displayName: raidHubProfile.twitchUsername,
                url: `https://twitch.tv/${raidHubProfile.twitchUsername}`
            })
        }
        return socials
    }, [raidHubProfile])

    return isLoading ? (
        <Loading wrapperClass={styles["card-loading"]} />
    ) : (
        <div ref={ref} className={styles["card"]}>
            <div className={styles["banner"]}>
                <Image
                    unoptimized
                    className={styles["image-background"]}
                    src={emblemBackgroundPathSrc}
                    width={474}
                    height={96}
                    priority
                    alt="profile banner"
                />

                <div className={styles["details"]}>
                    <Image
                        unoptimized={!raidHubProfile?.image}
                        src={
                            raidHubProfile?.image ??
                            "https://bungie.net" +
                                (userInfo?.iconPath ?? "/img/profile/avatars/default_avatar.gif")
                        }
                        width={80}
                        height={80}
                        alt="profile picture"
                    />

                    <div className={styles["username"]}>
                        {userInfo && <UserName {...userInfo} />}
                    </div>
                </div>
                {userInfo &&
                    userInfo.membershipId === data?.user.destinyMembershipId &&
                    !isEditing && (
                        <button className={styles["edit-btn"]} onClick={() => setIsEditing(true)}>
                            {strings.edit}
                        </button>
                    )}
            </div>

            <div className={styles["icons"]}>
                {socials && socials.map((social, key) => <SocialTag {...social} key={key} />)}
            </div>

            {isEditing && (
                <div className={styles["edit-background-modal"]}>
                    <div className={styles["edit-background-btns"]}>
                        <button onClick={() => setIsEditing(false)}>{strings.cancel}</button>
                        <button onClick={handleEditorInputSave}>{strings.save}</button>
                        <button
                            onClick={() => {
                                setInputStyling(
                                    raidHubProfile?.profile?.profileDecoration ?? defaultEditInput
                                )
                            }}>
                            {strings.reset}
                        </button>
                    </div>
                    <p className={styles["edit-background-info-text"]}>
                        Paste a valid value for the css <code>background</code> property here.{" "}
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
        </div>
    )
}

export default UserCard
