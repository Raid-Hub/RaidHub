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
import DestinyManifestManager from "../components/app/DestinyManifestManager"

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
                    <DestinyManifestManager>
                        <Header />
                        <Component {...pageProps} />
                        <Footer />
                    </DestinyManifestManager>
                </TokenManager>
            </SessionProvider>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title key="title">RaidHub</title>
                <link
                    rel="manifest"
                    href="/manifest.json"
                    {...(process.env.APP_ENV === "preview"
                        ? {
                              crossOrigin: "use-credentials"
                          }
                        : {})}
                />
            </Head>
        </LanguageProvider>
    )
}

export default MyApp
