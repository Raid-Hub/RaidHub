import styles from "~/styles/pages/home.module.css"
import { ListedRaids } from "~/types/raids"
import { useLocale } from "../app/LocaleManager"
import HomeRaidCard from "./HomeRaidCard"
import HomeLogo from "./HomeLogo"
import HomeSearch from "~/components/home/HomeSearch"
import HomeToolButtons from "~/components/home/HomeToolButtons"
import { useRaidHubManifest } from "../app/RaidHubManifestManager"
import { HomeGlobal } from "./HomeGlobal"

const Home = () => {
    const { strings } = useLocale()
    const manifest = useRaidHubManifest()
    return (
        <main>
            <HomeLogo />
            <HomeSearch />
            <HomeToolButtons />
            <section className={styles["raids"]}>
                <HomeGlobal />
                {ListedRaids.map(raid => (
                    <HomeRaidCard
                        raid={raid}
                        strings={strings}
                        key={raid}
                        worldFirstLeaderboards={manifest?.leaderboards.worldFirst[raid] ?? []}
                        individualLeaderboards={manifest?.leaderboards.individual[raid] ?? null}
                    />
                ))}
            </section>
        </main>
    )
}

export default Home
