import { NextPage } from "next"
import { signIn } from "next-auth/react"
import { useLocale } from "../components/app/LanguageProvider"
import { useProviders } from "../hooks/app/useProviders"
import { useRouter } from "next/router"

const Login: NextPage = () => {
    const { providers } = useProviders()
    const { query } = useRouter()
    const { strings } = useLocale()

    const callbackUrl = query["callbackUrl"]
    return (
        <main>
            <div style={{ display: "flex", gap: "1em" }}>
                {providers?.map((provider, id) => (
                    <button
                        key={id}
                        onClick={() =>
                            signIn(id, {
                                callbackUrl: Array.isArray(callbackUrl)
                                    ? callbackUrl[0]
                                    : callbackUrl
                            })
                        }>
                        {strings.logInWith + " " + provider.name}
                    </button>
                ))}
            </div>
        </main>
    )
}

export default Login
