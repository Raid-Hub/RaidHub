import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import Header from "../components/app/Header"
import Footer from "../components/app/Footer"
import "../styles/globals.css"
import Head from "next/head"
import { useLanguage } from "../hooks/util/useLanguage"
import TokenManager from "../components/app/TokenManager"
import { useState } from "react"
import { Session } from "next-auth"

type PageProps = {
    session: Session
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps<PageProps>) {
    const { language } = useLanguage()
    const [refetchInterval, setRefetchInterval] = useState(0)

    return (
        <SessionProvider
            session={session}
            refetchInterval={refetchInterval}
            refetchOnWindowFocus={false}>
            <TokenManager setRefetchInterval={setRefetchInterval} />
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta httpEquiv="Content-Language" content={language} />
                <link rel="manifest" href="/manifest.json" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
            <Header />
            <Component {...pageProps} />
            <Footer />
        </SessionProvider>
    )
}

export default MyApp
