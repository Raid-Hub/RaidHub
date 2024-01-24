import Link from "next/link"
import CloudflareImage from "~/images/CloudflareImage"
import RightArrow from "~/images/icons/RightArrow"
import styles from "~/styles/pages/home.module.css"

export function HomeGlobal() {
    return (
        <div className={styles["home-raid-card"]}>
            <div className={styles["card-image-header"]}>
                <CloudflareImage
                    priority
                    width={640}
                    height={360}
                    cloudflareId={"5e4dc4de-9417-4aef-2a48-aea495ae3500"}
                    alt={"RaidHub banner"}
                />

                <h2 className={styles["card-title"]}>All Raids</h2>
            </div>
            <div className={styles["card-content"]}>
                <div className={`${styles["card-section"]} ${styles["card-section-top"]}`}>
                    <div className={styles["section-title"]}>
                        <span>{"Individual Leaderboards"}</span>
                    </div>
                    <div className={styles["content-section-inner"]}>
                        <Link
                            href={`/leaderboards/all/full-clears`}
                            className={styles["content-section"]}>
                            <div>
                                <h4>Full Clears</h4>
                            </div>
                            <div className={styles["content-section-arrow"]}>
                                <RightArrow />
                            </div>
                        </Link>
                        <Link
                            href={`/leaderboards/all/clears`}
                            className={styles["content-section"]}>
                            <div>
                                <h4>Clears</h4>
                            </div>
                            <div className={styles["content-section-arrow"]}>
                                <RightArrow />
                            </div>
                        </Link>
                        <Link
                            href={`/leaderboards/all/speed`}
                            className={styles["content-section"]}>
                            <div>
                                <h4>Cumulative Speedrun</h4>
                            </div>
                            <div className={styles["content-section-arrow"]}>
                                <RightArrow />
                            </div>
                        </Link>
                        <Link
                            href={`/leaderboards/all/sherpas`}
                            className={styles["content-section"]}>
                            <div>
                                <h4>Sherpas</h4>
                            </div>
                            <div className={styles["content-section-arrow"]}>
                                <RightArrow />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
