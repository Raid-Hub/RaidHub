import { NextPage } from "next"
import { signIn, useSession } from "next-auth/react"
import { useLocale } from "../components/app/LocaleManager"
import Account from "../components/account/Account"

const AccountPage: NextPage = () => {
    const {
        status,
        data: sessionData,
        update: updateSession
    } = useSession({
        required: true,
        onUnauthenticated() {
            signIn("bungie", { callbackUrl: "/account" }, "reauth=false")
        }
    })
    const { strings } = useLocale()

    if (status === "loading") {
        return (
            <main>
                <h2>{strings.loading}</h2>
            </main>
        )
    }

    return <Account session={sessionData} refreshSession={updateSession} />
}

export default AccountPage
