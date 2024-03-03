import { headers } from "next/headers"
import { userAgent } from "next/server"
import { Suspense, type ReactNode } from "react"
import { getServerAuthSession } from "~/server/api/auth"
import { ClientSessionManager } from "./ClientSessionManager"

/**
 * This component is responsible for managing the user's session.
 * While the server is rendering the page, it will fetch the user's session from the server.
 * Once the page is rendered on the client, the session will be managed by the `ClientSessionManager`.
 *
 * This means that useSession() will not work on the client until the session is fetched.
 * So any components that rely on useSession() should call getServerAuthSession() first
 *
 * Additionally, some pages are rendered statically, meaning the session will be null. We can
 * force the session to be fetched client-side by setting the session to undefined, basically tricking
 * the provider into thinking the session was not fetched on the server. We use the `isStatic` prop to
 * determine this based on the existence of the user agent.
 */
export const SessionManager = (props: { children: ReactNode }) => (
    <Suspense fallback={props.children}>
        <AsyncSessionProvider>{props.children}</AsyncSessionProvider>
    </Suspense>
)

async function AsyncSessionProvider(props: { children: ReactNode }) {
    const session = await getServerAuthSession()

    const ua = userAgent({
        headers: headers()
    }).ua

    return (
        <ClientSessionManager serverSession={session} isStatic={!ua}>
            {props.children}
        </ClientSessionManager>
    )
}
