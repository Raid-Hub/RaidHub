import styles from "~/styles/pages/account.module.css"
import { signIn, signOut } from "next-auth/react"
import { Session } from "next-auth"
import Form from "./Form"
import { trpc } from "~/util/trpc"
import Connection from "./Connection"
import { useMemo, useRef, useState } from "react"
import { useLocale } from "../app/LocaleManager"
import Link from "next/link"
import { Socials } from "~/util/profile/socials"
import { useProviders } from "~/hooks/app/useProviders"
import SpeedrunAPIKeyModal from "./SpeedrunAPIKeyModal"

type AccountProps = {
    session: Session
    refreshSession(): void
}

const Account = ({ session, refreshSession }: AccountProps) => {
    const { providers } = useProviders()
    const { data: socialNames, refetch: refetchSocials } = trpc.user.connections.useQuery()
    const { mutate: unlinkAccountFromUser } = trpc.user.account.removeById.useMutation({
        onSuccess() {
            refetchSocials()
        }
    })
    const { mutate: unlinkSpeedrunUsername } = trpc.user.account.speedrunCom.remove.useMutation({
        onSuccess() {
            refetchSocials()
        }
    })
    const { mutate: deleteUserMutation } = trpc.user.delete.useMutation()
    const speedrunAPIKeyModalRef = useRef<HTMLDialogElement | null>(null)

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
            <SpeedrunAPIKeyModal refetchSocials={refetchSocials} ref={speedrunAPIKeyModalRef} />
            <h1>Welcome, {session.user.name}</h1>
            <section className={[styles["section"], styles["flex"]].join(" ")}>
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
            <section className={[styles["section"], styles["flex"]].join(" ")}>
                <h2>Manage Account</h2>
                <Form user={session.user} refreshSession={refreshSession} />
            </section>
            <section className={styles["section"]}>
                <h2>Manage Connections</h2>
                <div className={styles["connections"]}>
                    {discordProvider && (
                        <Connection
                            unlink={() => unlinkAccountFromUser({ providerId: "discord" })}
                            link={() => signIn(discordProvider.id, {}, { prompt: "consent" })}
                            serviceName={discordProvider.name}
                            username={socialNames?.discordUsername ?? null}
                            social={Socials.Discord}
                        />
                    )}
                    {twitterProvider && (
                        <Connection
                            unlink={() => unlinkAccountFromUser({ providerId: "twitter" })}
                            link={() => signIn(twitterProvider.id, {}, { force_login: "true" })}
                            serviceName={twitterProvider.name}
                            username={socialNames?.twitterUsername ?? null}
                            social={Socials.Twitter}
                        />
                    )}
                    {twitchProvider && (
                        <Connection
                            unlink={() => unlinkAccountFromUser({ providerId: "twitch" })}
                            link={() => signIn(twitchProvider.id, {}, { force_verify: "true" })}
                            serviceName={twitchProvider.name}
                            username={socialNames?.twitchUsername ?? null}
                            social={Socials.Twitch}
                        />
                    )}
                    <Connection
                        unlink={() => unlinkSpeedrunUsername()}
                        link={() => speedrunAPIKeyModalRef.current?.showModal()}
                        serviceName="Speedrun.com"
                        username={socialNames?.speedrunUsername ?? null}
                        social={Socials.Bungie}
                    />
                </div>
            </section>
        </main>
    )
}

export default Account
