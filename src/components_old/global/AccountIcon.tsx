import Image from "next/image"
import styles from "../../styles/header.module.css"
import { useSession } from "next-auth/react"
import { useEffect, useRef } from "react"
import QuestionMark from "~/images/icons/QuestionMark"
import UserIcon from "~/images/icons/UserIcon"

type AccountIconProps = {
    isDropdownOpen: boolean
    setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AccountIcon = ({ isDropdownOpen, setIsDropdownOpen }: AccountIconProps) => {
    const { data: sessionData, status } = useSession()
    const ref = useRef<HTMLDivElement>(null)

    const handleIconClick = () => {
        setIsDropdownOpen(old => !old)
    }

    const handleItemClick = () => {
        setIsDropdownOpen(false)
    }

    useEffect(() => {
        if (isDropdownOpen) {
            const handler = (e: MouseEvent) => {
                // detecth if we've clicked into the component or not
                if (ref.current && !ref.current.contains(e.target as Node)) {
                    setIsDropdownOpen(false)
                }
            }
            document.addEventListener("click", handler)
            return () => {
                document.removeEventListener("click", handler)
            }
        }
    }, [isDropdownOpen, setIsDropdownOpen])

    return (
        <div className={styles["account-dropdown"]}>
            <div
                ref={ref}
                className={styles["account-button"]}
                role="button"
                onClick={handleIconClick}>
                {status === "authenticated" ? (
                    <Image src={sessionData.user.image} alt="profile" fill unoptimized />
                ) : status === "loading" ? (
                    <QuestionMark color="white" />
                ) : (
                    <UserIcon color="white" />
                )}
            </div>
        </div>
    )
}

export default AccountIcon
