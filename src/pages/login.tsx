import { NextPage } from "next"
import { signIn } from "next-auth/react"
import { useLocale } from "../components/app/LocaleManager"
import { useRouter } from "next/router"

const Login: NextPage = () => {
    const { query } = useRouter()
    const { strings } = useLocale()

    const _callbackUrl = query["callbackUrl"]
    const __callbackUrl = Array.isArray(_callbackUrl) ? _callbackUrl[0] : _callbackUrl
    const callbackUrl =
        __callbackUrl === "/login" || __callbackUrl === undefined ? "" : __callbackUrl

    return (
        <main>
            <button
                onClick={() =>
                    signIn("bungie", {
                        callbackUrl
                    })
                }>
                {strings.logIn}
            </button>
        </main>
    )
}

export default Login
