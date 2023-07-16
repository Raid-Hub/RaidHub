import { NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "../styles/pages/account.module.css"

const Account: NextPage = () => {
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
            <h1>You are authenticated</h1>
            <div className={styles["buttons"]}>
                <button onClick={() => signOut({ callbackUrl: "/" })}>Log Out</button>
                <button onClick={() => console.log(sesssionData)}>Print Session Data</button>
                <button onClick={() => signIn("bungie", {}, "reauth=true")}>
                    Sign in with different account
                </button>
                <a
                    href={`/profile/${sesssionData.user.destinyMembershipType}/${sesssionData.user.destinyMembershipId}`}>
                    <button>Take me home</button>
                </a>
            </div>
        </main>
    )
}

export default Account
