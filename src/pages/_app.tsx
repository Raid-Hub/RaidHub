import type { AppProps } from "next/app"
import Header from "../components/Header"
import Footer from "../components/Footer"
import "../styles/globals.css"
import Head from "next/head"

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <Header />
            <Component {...pageProps} />
            <Footer />
        </>
    )
}

export default MyApp
