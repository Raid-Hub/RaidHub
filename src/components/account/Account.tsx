import styles from "../../styles/pages/account.module.css"
import { signIn, signOut } from "next-auth/react"
import { Session } from "next-auth"
import { deleteCurrentUser } from "../../services/app/deleteCurrentUser"
import UpdateUserInfo from "./UpdateUserInfo"
import ImageUploadForm from "./ImageUploadForm"

type AccountProps = {
    session: Session
    refreshSession(): void
}

const Account = ({ session, refreshSession }: AccountProps) => {
    return (
        <main>
            <h1>Welcome, {session.user.name}</h1>
            <section className={styles["content"]}>
                <div className={styles["buttons"]}>
                    <button onClick={() => signOut({ callbackUrl: "/" })}>Log Out</button>
                    <button onClick={() => console.log(session)}>Print Session Data</button>
                    <button onClick={() => signIn("bungie", {}, "reauth=true")}>
                        Sign in with different account
                    </button>
                    <button onClick={() => deleteCurrentUser({ callbackUrl: "/" })}>
                        Delete Account
                    </button>
                    {session.user.destinyMembershipType && session.user.destinyMembershipId && (
                        <a
                            href={`/profile/${session.user.destinyMembershipType}/${session.user.destinyMembershipId}`}>
                            <button>Take me home</button>
                        </a>
                    )}
                </div>
                <UpdateUserInfo user={session.user} refreshSession={refreshSession} />
                <ImageUploadForm user={session.user} refreshSession={refreshSession} />
            </section>
        </main>
    )
}

export default Account
