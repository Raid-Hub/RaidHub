"use client"

import { Session } from "next-auth"
import { signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useMemo, useRef, useState } from "react"
import { trpc } from "~/app/(layout)/managers/QueryManager"
import DiscordIcon from "~/components/icons/DiscordIcon"
import SpeedrunIcon from "~/components/icons/SpeedrunIcon"
import TwitchIcon from "~/components/icons/TwitchIcon"
import TwitterIcon from "~/components/icons/TwitterIcon"
import YoutubeIcon from "~/components/icons/YoutubeIcon"
import { useProviders } from "~/hooks/app/useProviders"
import styles from ".//account.module.css"
import Connection from "./Connection"
import IconUploadForm from "./IconUploadForm"
import SpeedrunAPIKeyModal from "./SpeedrunAPIKeyModal"

type AccountProps = {
    session: Session
}

const Account = ({ session }: AccountProps) => {
    const { providers } = useProviders()
    const { data: socialNames, refetch: refetchSocials } = trpc.user.connections.useQuery()
    const { mutate: unlinkAccountFromUser } = trpc.user.account.removeById.useMutation({
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

    const { discordProvider, twitchProvider, twitterProvider, googleProvider } = useMemo(
        () => ({
            discordProvider: providers?.get("discord"),
            twitchProvider: providers?.get("twitch"),
            twitterProvider: providers?.get("twitter"),
            googleProvider: providers?.get("google")
        }),
        [providers]
    )

    return (
        <>
            <SpeedrunAPIKeyModal refetchSocials={refetchSocials} ref={speedrunAPIKeyModalRef} />
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
                        <button onClick={() => setDeleteOnClick(false)}>Cancel</button>
                    )}
                    <button
                        onClick={deleteOnClick ? deleteUser : () => setDeleteOnClick(true)}
                        className={styles["destructive"]}>
                        {deleteOnClick ? "Confirm Deletion" : "Delete Account"}
                    </button>
                </div>
            </section>
            <section className={[styles["section"], styles["flex"]].join(" ")}>
                <h2>Manage Account</h2>
                <IconUploadForm user={session.user} />
            </section>
            <section className={styles["section"]}>
                <h2>Manage Connections</h2>
                <div className={styles["connections"]}>
                    {discordProvider && (
                        <Connection
                            unlink={() => unlinkAccountFromUser({ providerId: "discord" })}
                            link={() => signIn("discord", {}, { prompt: "consent" })}
                            serviceName={discordProvider.name}
                            username={socialNames?.get("discord") ?? null}
                            Icon={DiscordIcon}
                        />
                    )}
                    {twitterProvider && (
                        <Connection
                            unlink={() => unlinkAccountFromUser({ providerId: "twitter" })}
                            link={() => signIn("twitter", {}, { force_login: "true" })}
                            serviceName={twitterProvider.name}
                            username={socialNames?.get("twitter") ?? null}
                            Icon={TwitterIcon}
                        />
                    )}
                    {twitchProvider && (
                        <Connection
                            unlink={() => unlinkAccountFromUser({ providerId: "twitch" })}
                            link={() => signIn("twitch", {}, { force_verify: "true" })}
                            serviceName={twitchProvider.name}
                            username={socialNames?.get("twitch") ?? null}
                            Icon={TwitchIcon}
                        />
                    )}
                    {googleProvider && (
                        <Connection
                            unlink={() => unlinkAccountFromUser({ providerId: "google" })}
                            link={() => signIn("google", {}, { prompt: "select_account" })}
                            serviceName={googleProvider.name}
                            username={socialNames?.get("google") ?? null}
                            Icon={YoutubeIcon}
                        />
                    )}
                    <Connection
                        unlink={() => unlinkAccountFromUser({ providerId: "speedrun" })}
                        link={() => speedrunAPIKeyModalRef.current?.showModal()}
                        serviceName="Speedrun.com"
                        username={socialNames?.get("speedrun") ?? null}
                        Icon={props => <SpeedrunIcon {...props} deepFill="white" />}
                    />
                </div>
            </section>
        </>
    )
}

export default Account
