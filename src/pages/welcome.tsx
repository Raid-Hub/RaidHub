import { NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "../styles/pages/account.module.css"

const Welcome: NextPage = () => {
    const { status, data: sesssionData } = useSession({
        required: true,
        onUnauthenticated() {
            signIn("bungie")
        }
    })

    if (status !== "authenticated" || !sesssionData?.user) {
        return <main>Loading...</main>
    }

    return (
        <main>
            <h1>Welcome!</h1>
        </main>
    )
}

export default Welcome
