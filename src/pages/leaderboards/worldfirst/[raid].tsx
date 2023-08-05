import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Leaderboard from "../../../components/leaderboards/Leaderboard"
import Head from "next/head"
import { AvailableRaid, UrlPathsToRaid } from "../../../types/raids"
import { ReleaseDate } from "../../../util/destiny/raid"
import { useLocale } from "../../../components/app/LocaleManager"
import { toCustomDateString } from "../../../util/presentation/formatting"

type WorldsFirstLeaderboadProps = {
    raid: AvailableRaid
}

const WorldsFirstLeaderboad: NextPage<WorldsFirstLeaderboadProps> = ({ raid }) => {
    const { strings, locale } = useLocale()
    return (
        <>
            <Head>
                <title>World First Leaderboards</title>
            </Head>
            <Leaderboard
                title={"World First " + strings.raidNames[raid]}
                subtitle={toCustomDateString(ReleaseDate[raid], locale)}
                params={{ category: "worldsfirst", raid }}
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
        return {
            props: {
                raid: UrlPathsToRaid[params.raid as keyof typeof UrlPathsToRaid]
            }
        }
    } else {
        return { notFound: true }
    }
}
