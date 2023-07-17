import { NextPage } from "next"
import { signIn, useSession } from "next-auth/react"

const Welcome: NextPage = () => {
    const { status, data: sesssionData } = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        }
    })

    if (status !== "authenticated" || !sesssionData?.user) {
        return <main>Loading...</main>
    }

    return (
        <main>
            <h1>Welcome!</h1>
        </main>
    )
}

export default Welcome
