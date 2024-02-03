import { GetStaticPropsResult, NextPage } from "next"
import { getSession, signOut } from "next-auth/react"
import { useLocale } from "../app/managers/LocaleManager"

export async function getServerSideProps(): Promise<GetStaticPropsResult<{}>> {
    const session = getSession()
    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: "/"
            }
        }
    } else {
        return { props: {} }
    }
}

const Logout: NextPage = () => {
    const { strings } = useLocale()

    return (
        <main>
            <button onClick={() => signOut({ callbackUrl: "/" })}>{strings.logOut}</button>
        </main>
    )
}

export default Logout
