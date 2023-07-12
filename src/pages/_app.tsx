import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import Header from "../components/global/Header"
import Footer from "../components/global/Footer"
import "../styles/globals.css"
import Head from "next/head"
import TokenManager from "../components/app/TokenManager"
import { useState } from "react"
import { Session } from "next-auth"
import LanguageProvider from "../components/app/LanguageProvider"

type PageProps = {
    session: Session
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps<PageProps>) {
    const [refetchInterval, setRefetchInterval] = useState(0)

    return (
        <LanguageProvider>
            <SessionProvider
                session={session}
                refetchInterval={refetchInterval}
                refetchOnWindowFocus={false}>
                <TokenManager setRefetchInterval={setRefetchInterval}>
                    <Header />
                    <Component {...pageProps} />
                    <Footer />
                </TokenManager>
            </SessionProvider>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
        </LanguageProvider>
    )
}

export default MyApp
