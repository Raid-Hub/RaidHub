import HomeSearch from "~/components/home/HomeSearch"
import HomeToolButtons from "~/components/home/HomeToolButtons"
import styles from "~/styles/pages/home.module.css"
import { useRaidHubManifest } from "../../app/managers/RaidHubManifestManager"
import { HomeGlobal } from "./HomeGlobal"
import HomeLogo from "./HomeLogo"
import HomeRaidCard from "./HomeRaidCard"

const Home = () => {
    const { listedRaids, leaderboards } = useRaidHubManifest()
    return (
        <main>
            <HomeLogo />
            <HomeSearch />
            <HomeToolButtons />
            <section className={styles["raids"]}>
                <HomeGlobal />
                {listedRaids.map(raid => (
                    <HomeRaidCard
                        raid={raid}
                        key={raid}
                        worldFirstLeaderboards={leaderboards.worldFirst[raid] ?? []}
                        individualLeaderboards={leaderboards.individual[raid] ?? {}}
                    />
                ))}
            </section>
        </main>
    )
}

export default Home
