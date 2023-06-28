import { NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"

const Account: NextPage = () => {
    const { status, data: sesssionData } = useSession()

    // Force authentication
    if (status == "loading") {
        return <main>Loading...</main>
    } else if (status == "unauthenticated" || !sesssionData) {
        void signIn("bungie", { callbackUrl: "/account" })
        return <main>Redirecting to Bungie.net...</main>
    }

    return (
        <main>
            <h1>You are authenticated</h1>
            <button onClick={() => void signOut({ callbackUrl: "/" })}>Log Out</button>
            <button onClick={() => console.log(sesssionData)}>Print Session Data</button>
        </main>
    )
}

export default Account
