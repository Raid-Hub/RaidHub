import { NextPage } from "next"
import { signIn, useSession } from "next-auth/react"
import { useLocale } from "../components/app/LocaleManager"
import Account from "../components/account/Account"
import Head from "next/head"

const AccountPage: NextPage = () => {
    const { status, data: sessionData } = useSession({
        required: true,
        onUnauthenticated() {
            signIn("bungie", undefined, "reauth=false")
        }
    })
    const { strings } = useLocale()

    return (
        <>
            <Head>
                <title key="title">Account | RaidHub</title>
            </Head>
            {status === "loading" ? (
                <main>
                    <h2>{strings.loading}</h2>
                </main>
            ) : (
                <Account session={sessionData} />
            )}
        </>
    )
}

export default AccountPage
