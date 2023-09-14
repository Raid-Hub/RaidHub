import styles from "~/styles/pages/clan.module.css"
import { GroupMember } from "bungie-net-core/models"
import Image from "next/image"
import Link from "next/link"

function bungieIcon(src: string) {
    return "https://www.bungie.net" + src
}

export default function ClanMember({ member }: { member: GroupMember }) {
    console.log(member)
    return (
        <Link
            href={`/profile/${member.destinyUserInfo.membershipType}/${member.destinyUserInfo.membershipId}`}
            className={styles["member"]}>
            <div className={styles["member-icon-container"]}>
                <Image
                    src={bungieIcon(member.bungieNetUserInfo.iconPath)}
                    alt="icon"
                    unoptimized
                    fill
                />
            </div>
            {member.destinyUserInfo.bungieGlobalDisplayName}
        </Link>
    )
}
