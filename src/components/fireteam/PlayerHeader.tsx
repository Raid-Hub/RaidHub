import styles from "~/styles/pages/fireteam.module.css"
import { DestinyCharacterComponent, DestinyProfileComponent } from "bungie-net-core/models"
import UserName from "../profile/user/UserName"
import Image from "next/image"
import Link from "next/link"

export default function PlayerHeader({
    profile,
    characters
}: {
    profile: DestinyProfileComponent
    characters: Record<string, DestinyCharacterComponent>
}) {
    return (
        <div className={styles["player-header"]}>
            <Link
                href={`/profile/${profile.userInfo.membershipType}/${profile.userInfo.membershipId}`}>
                <h3>
                    <UserName {...profile.userInfo} />
                </h3>
            </Link>
            <Image
                src={`https://www.bungie.net${Object.values(characters)[0].emblemBackgroundPath}`}
                alt={""}
                unoptimized
                fill
            />
        </div>
    )
}
