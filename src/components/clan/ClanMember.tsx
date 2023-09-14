import styles from "~/styles/pages/clan.module.css"
import { GroupMember } from "bungie-net-core/models"
import Image from "next/image"
import Link from "next/link"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"

export default function ClanMember({ member }: { member: GroupMember }) {
    console.log(member)
    return (
        <Link
            href={`/profile/${member.destinyUserInfo.membershipType}/${member.destinyUserInfo.membershipId}`}
            className={styles["member"]}>
            <div className={styles["member-icon-container"]}>
                <Image
                    src={bungieIconUrl(member.bungieNetUserInfo.iconPath)}
                    alt="icon"
                    unoptimized
                    fill
                />
            </div>
            <span>{member.destinyUserInfo.bungieGlobalDisplayName}</span>
        </Link>
    )
}
