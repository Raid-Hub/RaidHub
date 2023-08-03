import styles from "../../../styles/pages/profile/user.module.css"
import { UserInfoCard } from "bungie-net-core/lib/models"
import SocialTag from "./SocialTag"
import { ProfileSocialData } from "../../../types/profile"
import UserName from "./UserName"
import Loading from "../../global/Loading"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { updateProfileDecoration } from "../../../services/app/updateProfileDecoration"
import { useLocale } from "../../app/LocaleManager"

const defaultEditInput =
    "linear-gradient(130deg, rgba(2,0,36,1) 0%, rgba(48,6,6,1) 51%, rgba(126,60,0,1) 100%);"

type UserCardProps = {
    isLoading: boolean
    userInfo: UserInfoCard | undefined
    icon: string | null
    emblemBackgroundPath?: string
    background: string | null
    socials: ProfileSocialData[] | null
    revalidateRaidHubProfile(): void
}

const UserCard = ({
    isLoading,
    userInfo,
    icon,
    emblemBackgroundPath,
    background,
    socials,
    revalidateRaidHubProfile
}: UserCardProps) => {
    const { data } = useSession()
    const [isEditing, setIsEditing] = useState(false)
    const [inputStyling, setInputStyling] = useState<string>("")
    const customStyling = useMemo(() => {
        const styling = isEditing ? inputStyling || background : background
        const obj = styling
            ? {
                  style: {
                      backgroundImage: styling
                  }
              }
            : {}
        return obj
    }, [isEditing, inputStyling, background])
    const { strings } = useLocale()

    useEffect(() => {
        setInputStyling(background ?? defaultEditInput)
    }, [background])

    const handleEditorInputChange = useCallback((e: FormEvent<HTMLTextAreaElement>) => {
        setInputStyling(
            //@ts-ignore
            (e.target.value as string)
                .split(";")
                .filter(Boolean)
                .map(
                    line =>
                        line
                            .replace("\n: ", "")
                            .replace(/;$/, "")
                            .replace("background-image: ", "")
                            .replace("background: ", "") ?? ""
                )[0]
        )
    }, [])

    const handleEditorInputSave = useCallback(() => {
        setIsEditing(false)
        updateProfileDecoration({
            decoration: inputStyling
        }).then(revalidateRaidHubProfile)
    }, [inputStyling, revalidateRaidHubProfile])

    return isLoading || !userInfo ? (
        <Loading wrapperClass={styles["card-loading"]} />
    ) : (
        <div className={styles["card"]} {...customStyling}>
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
                            icon ??
                            "https://bungie.net" +
                                (userInfo?.iconPath ?? "/img/profile/avatars/default_avatar.gif")
                        }
                        width={80}
                        height={80}
                        alt="profile picture"
                    />

                    <div className={styles["username"]}>
                        <UserName {...userInfo} />
                    </div>
                </div>
                {userInfo.membershipId === data?.user.destinyMembershipId && !isEditing && (
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
                                setInputStyling(background ?? defaultEditInput)
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
                        onInput={handleEditorInputChange}
                        value={inputStyling}
                    />
                </div>
            )}
        </div>
    )
}

export default UserCard
