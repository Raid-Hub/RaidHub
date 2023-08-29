import styles from "../../styles/pages/account.module.css"
import { signIn, signOut } from "next-auth/react"
import { Session } from "next-auth"
import { deleteCurrentUser } from "../../services/app/deleteCurrentUser"
import UpdateUserInfo from "./UpdateUserInfo"
import ImageUploadForm from "./ImageUploadForm"
import { useProviders } from "../../hooks/app/useProviders"
import { unlinkAccountFromUser } from "../../services/app/deleteAccountFromUser"
import Link from "next/link"

type AccountProps = {
    session: Session
    refreshSession(): void
}

const Account = ({ session, refreshSession }: AccountProps) => {
    const { providers } = useProviders()
    return (
        <main>
            <h1>Welcome, {session.user.name}</h1>
            <section className={styles["content"]}>
                <div className={styles["buttons"]}>
                    <button onClick={() => signOut({ callbackUrl: "/" })}>Log Out</button>
                    <button onClick={() => console.log(session)}>Print Session Data</button>
                    <button onClick={() => signIn("bungie", {}, "reauth=true")}>
                        Sign in with a different bungie account
                    </button>
                    <button onClick={() => deleteCurrentUser({ callbackUrl: "/" })}>
                        Delete Account
                    </button>
                    {providers?.get("discord") && (
                        <button onClick={() => signIn("discord", {}, { prompt: "consent" })}>
                            Add discord account
                        </button>
                    )}
                    {providers?.get("twitch") && (
                        <button onClick={() => signIn("twitch", {}, { force_verify: "true" })}>
                            Add twitch account
                        </button>
                    )}
                    {providers?.get("twitter") && (
                        <button onClick={() => signIn("twitter", {}, { force_login: "true" })}>
                            Add twitter account
                        </button>
                    )}
                    <button onClick={() => unlinkAccountFromUser({ providerId: "discord" })}>
                        Unlink Discord
                    </button>
                    <button onClick={() => unlinkAccountFromUser({ providerId: "twitch" })}>
                        Unlink Twitch
                    </button>
                    <button onClick={() => unlinkAccountFromUser({ providerId: "twitter" })}>
                        Unlink Twitter
                    </button>
                    {session.user.destinyMembershipType && session.user.destinyMembershipId && (
                        <Link
                            href={`/profile/${session.user.destinyMembershipType}/${session.user.destinyMembershipId}`}>
                            <button>Take me home</button>
                        </Link>
                    )}
                </div>
                <UpdateUserInfo user={session.user} refreshSession={refreshSession} />
                <ImageUploadForm user={session.user} refreshSession={refreshSession} />
            </section>
        </main>
    )
}

export default Account
