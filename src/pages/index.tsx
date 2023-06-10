import { NextPage } from "next"
import styles from "../styles/home.module.css"
import { AllRaids } from "../util/raid"
import HomeRaidCard from "../components/home/HomeRaidCard"
import { useLanguage } from "../hooks/language"
import { LocalizedStrings } from "../util/localized-strings"

export const Home: NextPage<{}> = () => {
    const { language } = useLanguage()
    const strings = LocalizedStrings[language]
    return (
        <main>
            <div className={styles["raids"]}>
                {AllRaids.map((raid, idx) => (
                    <HomeRaidCard raid={raid} strings={strings} key={idx} />
                ))}
            </div>
        </main>
    )
}

export default Home
