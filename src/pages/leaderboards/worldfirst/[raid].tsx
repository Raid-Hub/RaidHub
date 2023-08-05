import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Leaderboard from "../../../components/leaderboards/Leaderboard"
import Head from "next/head"
import {
    AvailableRaid,
    Difficulty,
    NoContestRaid,
    NoContestRaids,
    RaidToUrlPaths,
    ReprisedContestDifficultyDictionary,
    UrlPathsToRaid
} from "../../../types/raids"
import { ReleaseDate } from "../../../util/destiny/raid"
import { useLocale } from "../../../components/app/LocaleManager"
import { toCustomDateString } from "../../../util/presentation/formatting"

type WorldsFirstLeaderboadProps = {
    raid: AvailableRaid
    difficulty: Difficulty
}

const WorldsFirstLeaderboad: NextPage<WorldsFirstLeaderboadProps> = ({ raid, difficulty }) => {
    const { strings, locale } = useLocale()
    const raidName = strings.raidNames[raid]
    return (
        <>
            <Head>
                <title>{raidName} | World First Leaderboards</title>
            </Head>
            <Leaderboard
                title={"World First " + raidName}
                subtitle={toCustomDateString(ReleaseDate[raid], locale)}
                path={["worldsfirst", RaidToUrlPaths[raid]]}
                raid={raid}
            />
        </>
    )
}

export default WorldsFirstLeaderboad

export const getStaticPaths: GetStaticPaths<{ raid: string }> = async () => {
    return {
        paths: Object.keys(UrlPathsToRaid).map(path => ({
            params: {
                raid: path
            }
        })),
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<WorldsFirstLeaderboadProps, { raid: string }> = async ({
    params
}) => {
    if (params?.raid && UrlPathsToRaid[params.raid as keyof typeof UrlPathsToRaid]) {
        const raidValue = Number(params.raid)
        return {
            props: {
                raid: UrlPathsToRaid[params.raid as keyof typeof UrlPathsToRaid],
                difficulty:
                    ReprisedContestDifficultyDictionary[raidValue] ??
                    NoContestRaids.includes(raidValue as NoContestRaid)
                        ? Difficulty.NORMAL
                        : Difficulty.CONTEST
            }
        }
    } else {
        return { notFound: true }
    }
}
