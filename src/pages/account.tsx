import { NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"

const Account: NextPage = () => {
    const { status, data: sesssionData } = useSession()

    // Force authentication
    if (status == "loading") {
        return <></>
    } else if (status == "unauthenticated" || !sesssionData) {
        void signIn("bungie", { callbackUrl: "/account" })
        return <></>
    }

    return (
        <div>
            <h1>Profile</h1>
            <p>Welcome, {sesssionData.user.displayName}</p>
            <button onClick={() => void signOut({ callbackUrl: "/" })}>Log Out</button>
        </div>
    )
}

export default Account
