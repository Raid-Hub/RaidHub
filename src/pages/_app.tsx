import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import Header from "../components/global/Header"
import Footer from "../components/global/Footer"
import "../styles/globals.css"
import Head from "next/head"
import TokenManager from "../components/app/TokenManager"
import { useState } from "react"
import { Session } from "next-auth"
import LocaleManager from "../components/app/LocaleManager"
import DestinyManifestManager from "../components/app/DestinyManifestManager"
import ComponentCacheManager from "../components/app/ComponentCacheManager"

type PageProps = {
    session: Session
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps<PageProps>) {
    const [refetchInterval, setRefetchInterval] = useState(0)

    return (
        <LocaleManager>
            <SessionProvider
                session={session}
                refetchInterval={refetchInterval}
                refetchOnWindowFocus={false}>
                <TokenManager setRefetchInterval={setRefetchInterval}>
                    <DestinyManifestManager>
                        <Header />
                        <ComponentCacheManager Component={Component} componentProps={pageProps} />
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
        </LocaleManager>
    )
}

export default MyApp
