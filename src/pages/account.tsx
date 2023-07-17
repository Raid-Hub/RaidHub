import { NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "../styles/pages/account.module.css"
import { deleteCurrentUser } from "../services/app/deleteCurrentUser"

const Account: NextPage = () => {
    const { status, data: sessionData } = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        }
    })

    if (status !== "authenticated" || !sessionData?.user) {
        return <main>Loading...</main>
    }

    return (
        <main>
            <h1>You are authenticated</h1>
            <div className={styles["buttons"]}>
                <button onClick={() => signOut({ callbackUrl: "/" })}>Log Out</button>
                <button onClick={() => console.log(sessionData)}>Print Session Data</button>
                <button onClick={() => signIn("bungie", {}, "reauth=true")}>
                    Sign in with different account
                </button>
                <button onClick={() => deleteCurrentUser({ callbackUrl: "/" })}>
                    Delete Account
                </button>
                {sessionData.user.destinyMembershipType && sessionData.user.destinyMembershipId && (
                    <a
                        href={`/profile/${sessionData.user.destinyMembershipType}/${sessionData.user.destinyMembershipId}`}>
                        <button>Take me home</button>
                    </a>
                )}
            </div>
        </main>
    )
}

export default Account
