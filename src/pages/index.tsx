import { NextPage } from "next"
import styles from "../styles/pages/home.module.css"
import { AllRaids } from "../types/raids"
import HomeRaidCard from "../components/home/HomeRaidCard"
import { useLocale } from "../components/app/LanguageProvider"

export const Home: NextPage<{}> = () => {
    const { strings } = useLocale()
    return (
        <main>
            <section className={styles["raids"]}>
                {AllRaids.map((raid, idx) => (
                    <HomeRaidCard raid={raid} strings={strings} key={idx} />
                ))}
            </section>
        </main>
    )
}

export default Home
