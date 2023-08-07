import styles from "../../../styles/pages/profile/user.module.css"
import { UserInfoCard } from "bungie-net-core/lib/models"
import SocialTag from "./SocialTag"
import UserName from "./UserName"
import Loading from "../../global/Loading"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
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
    emblemBackgroundPath: string | undefined
}

const UserCard = ({
    isLoading,
    userInfo,
    raidHubProfile,
    destinyMembershipId,
    emblemBackgroundPath
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
        setInputStyling(raidHubProfile?.profile_decoration ?? defaultEditInput)
    }, [raidHubProfile?.profile_decoration])

    const handleEditorInputSave = useCallback(() => {
        mutateProfile({
            profile_decoration: inputStyling
        })
        setIsEditing(false)
    }, [inputStyling, mutateProfile])

    const socials = useMemo(() => {
        if (!raidHubProfile) return null
        const socials = new Array<ProfileSocialData>()
        if (raidHubProfile.bungie_username) {
            socials.push({
                id: Socials.Bungie,
                displayName: raidHubProfile.bungie_username,
                url: `https://www.bungie.net/7/en/User/Profile/${raidHubProfile.destiny_membership_type}/${raidHubProfile.destiny_membership_id}`
            })
        }
        if (raidHubProfile.discord_username) {
            socials.push({
                id: Socials.Discord,
                displayName: raidHubProfile.discord_username
            })
        }
        if (raidHubProfile.twitter_username) {
            socials.push({
                id: Socials.Twitter,
                displayName: raidHubProfile.twitter_username,
                url: `https://twitter.com/${raidHubProfile.twitter_username}`
            })
        }
        if (raidHubProfile.twitch_username) {
            socials.push({
                id: Socials.Twitch,
                displayName: raidHubProfile.twitch_username,
                url: `https://twitch.tv/${raidHubProfile.twitch_username}`
            })
        }
        return socials
    }, [raidHubProfile])

    return isLoading ? (
        <Loading wrapperClass={styles["card-loading"]} />
    ) : (
        <div ref={ref} className={styles["card"]}>
            <div className={styles["banner"]}>
                {emblemBackgroundPath && (
                    <Image
                        className={styles["image-background"]}
                        src={`https://bungie.net${emblemBackgroundPath}`}
                        width={474}
                        height={96}
                        priority
                        alt="profile banner"
                    />
                )}
                <div className={styles["details"]}>
                    <Image
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
                                    raidHubProfile?.profile_decoration ?? defaultEditInput
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
