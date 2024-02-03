import { NextPage } from "next"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { z } from "zod"

const Login: NextPage = () => {
    const { query } = useRouter()

    const callbackUrl = z
        .string()
        .url()
        .transform(cb => (cb === "/login" ? "" : cb))
        .default("")
        .safeParse(query["callbackUrl"])

    const error = query["error"]

    return (
        <main>
            {error ? (
                <h2>{`Error: ${error}`}</h2>
            ) : (
                <button
                    onClick={() =>
                        signIn("bungie", {
                            callbackUrl: callbackUrl.success ? callbackUrl.data : ""
                        })
                    }>
                    Log In
                </button>
            )}
        </main>
    )
}

export default Login
