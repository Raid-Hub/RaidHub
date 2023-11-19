import styles from "../../styles/pages/home.module.css"
import { ListedRaids } from "../../types/raids"
import { useLocale } from "../app/LocaleManager"
import HomeRaidCard from "./HomeRaidCard"
import HomeLogo from "./HomeLogo"
import HomeSearch from "~/components/home/HomeSearch"
import Toolbox from "~/components/toolbox/Toolbox";
import HomeToolButtons from "~/components/home/HomeToolButtons";
const Home = () => {
    const { strings } = useLocale()
    return (
        <main>
            <section>
                <HomeLogo/>
            </section>
            <section>
                <HomeSearch/>
            </section>
            <section>
                <HomeToolButtons/>
            </section>
            <section className={styles["raids"]}>
                {ListedRaids.map(raid => (
                    <HomeRaidCard raid={raid} strings={strings} key={raid} />
                ))}
            </section>
            <Toolbox/>
        </main>
    )
}

export default Home
