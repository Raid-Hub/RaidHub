import styles from "~/styles/pages/account.module.css"
import { signIn, signOut } from "next-auth/react"
import { Session } from "next-auth"
import Form from "./Form"
import { useProviders } from "~/hooks/app/useProviders"
import { trpc } from "~/util/trpc"
import Connection from "./Connection"
import { useMemo, useState } from "react"
import { useLocale } from "../app/LocaleManager"
import Link from "next/link"
import { Socials } from "~/util/profile/socials"

type AccountProps = {
    session: Session
    refreshSession(): void
}

const Account = ({ session, refreshSession }: AccountProps) => {
    const { providers } = useProviders()
    const { data: socialNames, refetch: refetchSocials } = trpc.user.getSocial.useQuery()
    const { mutate: unlinkAccountFromUser } = trpc.user.removeProvider.useMutation({
        onSuccess() {
            refetchSocials()
        }
    })
    const { mutate: deleteUserMutation } = trpc.user.deleteUser.useMutation()

    const [deleteOnClick, setDeleteOnClick] = useState(false)
    const deleteUser = () => {
        deleteUserMutation()
        signOut({ callbackUrl: "/" })
    }

    const { discordProvider, twitchProvider, twitterProvider } = useMemo(
        () => ({
            discordProvider: providers?.get("discord"),
            twitchProvider: providers?.get("twitch"),
            twitterProvider: providers?.get("twitter")
        }),
        [providers]
    )

    const { strings } = useLocale()
    return (
        <main>
            <h1>Welcome, {session.user.name}</h1>
            <section className={styles["section"]}>
                <div className={[styles["buttons"], styles["glossy-bg"]].join(" ")}>
                    <Link
                        href={`/profile/${session.user.destinyMembershipType}/${session.user.destinyMembershipId}`}>
                        <button>View Profile</button>
                    </Link>
                    <button onClick={() => signIn("bungie", {}, "reauth=true")}>
                        Sign in with a different bungie account
                    </button>
                    <button onClick={() => signOut({ callbackUrl: "/" })}>Log Out</button>
                    {deleteOnClick && (
                        <button onClick={() => setDeleteOnClick(false)}>{strings.cancel}</button>
                    )}
                    <button
                        onClick={deleteOnClick ? deleteUser : () => setDeleteOnClick(true)}
                        className={styles["destructive"]}>
                        {deleteOnClick ? strings.confirmDelete : strings.deleteAccount}
                    </button>
                </div>
            </section>
            <section className={styles["section"]}>
                <h2>Manage Account</h2>
                <Form user={session.user} refreshSession={refreshSession} />
            </section>
            <section className={styles["section"]}>
                <h2>Manage Connections</h2>
                <div className={styles["connections"]}>
                    {discordProvider && (
                        <Connection
                            provider={discordProvider}
                            authorizationParams={{ prompt: "consent" }}
                            unlink={() => unlinkAccountFromUser({ providerId: "discord" })}
                            username={socialNames?.discordUsername ?? null}
                            social={Socials.Discord}
                        />
                    )}
                    {twitterProvider && (
                        <Connection
                            provider={twitterProvider}
                            authorizationParams={{ force_login: "true" }}
                            unlink={() => unlinkAccountFromUser({ providerId: "twitter" })}
                            username={socialNames?.twitterUsername ?? null}
                            social={Socials.Twitter}
                        />
                    )}
                    {twitchProvider && (
                        <Connection
                            provider={twitchProvider}
                            authorizationParams={{ force_verify: "true" }}
                            unlink={() => unlinkAccountFromUser({ providerId: "twitch" })}
                            username={socialNames?.twitchUsername ?? null}
                            social={Socials.Twitch}
                        />
                    )}
                </div>
            </section>
        </main>
    )
}

export default Account
