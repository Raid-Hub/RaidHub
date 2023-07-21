import { NextPage } from "next"
import { signIn } from "next-auth/react"
import { useLocale } from "../components/app/LanguageProvider"
import { useProviders } from "../hooks/app/useProviders"

const Login: NextPage = () => {
    const { strings } = useLocale()

    const { providers } = useProviders()
    return (
        <main>
            <div style={{ display: "flex", gap: "1em" }}>
                {providers?.map((provider, id) => (
                    <button key={id} onClick={() => signIn(id)}>
                        {strings.logInWith + " " + provider.name}
                    </button>
                ))}
            </div>
        </main>
    )
}

export default Login
