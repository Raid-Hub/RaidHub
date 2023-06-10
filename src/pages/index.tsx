import { NextPage } from "next"
import styles from "../styles/home.module.css"
import { AllRaids } from "../util/raid"
import HomeRaidCard from "../components/home/HomeRaidCard"

export const Home: NextPage<{}> = () => {
    return (
        <main>
            <div className={styles["raids"]}>
                {AllRaids.map((raid, idx) => (
                    <HomeRaidCard raid={raid} key={idx} />
                ))}
            </div>
        </main>
    )
}

export default Home
