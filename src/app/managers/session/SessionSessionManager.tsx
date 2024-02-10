import { ReactNode, Suspense } from "react"
import { getServerAuthSession } from "../../api/auth"
import { ClientSessionManager } from "./ClientSessionManager"

/**
 * This component is responsible for managing the user's session.
 * While the server is rendering the page, it will fetch the user's session from the server.
 * Once the page is rendered on the client, the session will be managed by the `ClientSessionManager`.
 *
 * This means that useSession() will not work on the client until the session is fetched.
 * So any components that rely on useSession() should call getServerAuthSession() first
 */
export const SessionManager = (props: { children: ReactNode }) => (
    <Suspense fallback={props.children}>
        <AsyncSessionProvider>{props.children}</AsyncSessionProvider>
    </Suspense>
)

async function AsyncSessionProvider(props: { children: ReactNode }) {
    const session = await getServerAuthSession()

    return <ClientSessionManager serverSession={session}>{props.children}</ClientSessionManager>
}
