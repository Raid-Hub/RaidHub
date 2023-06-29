import { NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"

const Account: NextPage = () => {
    // Force authentication
    const { status, data: sesssionData } = useSession({
        required: true,
        onUnauthenticated() {
            void signIn("bungie")
        }
    })

    if (status !== "authenticated") {
        return <main>Loading...</main>
    }

    return (
        <main>
            <h1>You are authenticated</h1>
            <button onClick={() => void signOut({ callbackUrl: "/" })}>Log Out</button>
            <button onClick={() => console.log(sesssionData)}>Print Session Data</button>
            <button onClick={() => void signIn("bungie", {}, "reauth=true")}>
                Sign in with different account
            </button>
        </main>
    )
}

export default Account
