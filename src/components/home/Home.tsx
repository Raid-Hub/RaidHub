import styles from "../../styles/pages/home.module.css"
import { AvailableRaids } from "../../types/raids"
import { useLocale } from "../app/LanguageProvider"
import HomeRaidCard from "./HomeRaidCard"

const Home = () => {
    const { strings } = useLocale()
    return (
        <main>
            <section className={styles["raids"]}>
                {AvailableRaids.map(raid => (
                    <HomeRaidCard raid={raid} strings={strings} key={raid} />
                ))}
            </section>
        </main>
    )
}

export default Home
