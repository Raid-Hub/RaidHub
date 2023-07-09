import { NextPage } from "next"
import styles from "../styles/pages/home.module.css"
import HomeRaidCard from "../components/home/HomeRaidCard"
import { useLocale } from "../components/app/LanguageProvider"
import { AvailableRaids } from "../types/raids"

export const Home: NextPage<{}> = () => {
    const { strings } = useLocale()
    return (
        <main>
            <section className={styles["raids"]}>
                {AvailableRaids.map((raid, idx) => (
                    <HomeRaidCard raid={raid} strings={strings} key={idx} />
                ))}
            </section>
        </main>
    )
}

export default Home
