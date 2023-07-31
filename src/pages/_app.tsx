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
import ProgressBar from "nextjs-progressbar"
import SearchDiv from "../components/global/SearchDiv"

type PageProps = {
    session: Session
}

function App({ Component, pageProps: { session, ...pageProps } }: AppProps<PageProps>) {
    const [refetchInterval, setRefetchInterval] = useState(0)

    return (
        <LocaleManager>
            <SessionProvider
                session={session}
                refetchInterval={refetchInterval}
                refetchOnWindowFocus={false}>
                <TokenManager setRefetchInterval={setRefetchInterval}>
                    <DestinyManifestManager>
                        <SearchDiv />
                        <Header />
                        <ProgressBar
                            options={{
                                showSpinner: false,
                                parent: "#content"
                            }}
                            height={4}
                            showOnShallow={false}
                            color={"orange"}
                        />
                        <ComponentCacheManager Component={Component} componentProps={pageProps} />
                        <Footer />
                    </DestinyManifestManager>
                </TokenManager>
            </SessionProvider>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1"
                />
                <title key="title">RaidHub</title>
                <link
                    rel="manifest"
                    href="/manifest.json"
                    {...(process.env.APP_ENV === "preview" || process.env.APP_ENV === "staging"
                        ? {
                              crossOrigin: "use-credentials"
                          }
                        : {})}
                />
            </Head>
        </LocaleManager>
    )
}

export default App
