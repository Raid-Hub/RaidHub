import styles from "../../styles/pages/home.module.css"
import { ListedRaids } from "../../types/raids"
import { useLocale } from "../app/LocaleManager"
import HomeRaidCard from "./HomeRaidCard"

const Home = () => {
    const { strings } = useLocale()
    return (
        <main>
            <section className={styles["raids"]}>
                {ListedRaids.map(raid => (
                    <HomeRaidCard raid={raid} strings={strings} key={raid} />
                ))}
            </section>
        </main>
    )
}

export default Home
