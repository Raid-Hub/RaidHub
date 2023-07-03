import { NextPage } from "next"
import styles from "../styles/home.module.css"
import { AllRaids } from "../util/destiny/raid"
import HomeRaidCard from "../components/home/HomeRaidCard"
import { LocalizedStrings } from "../util/presentation/localized-strings"
import { useLocale } from "../components/app/LanguageProvider"

export const Home: NextPage<{}> = () => {
    const { strings } = useLocale()
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
