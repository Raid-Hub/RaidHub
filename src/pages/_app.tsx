import type { AppProps } from "next/app"
import Header from "../components/Header"
import Footer from "../components/Footer"
import "../styles/globals.css"
import Head from "next/head"
import { useLanguage } from "../hooks/language"

function MyApp({ Component, pageProps }: AppProps) {
    const { language } = useLanguage()
    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta httpEquiv="Content-Language" content={language} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
            <Header />
            <Component {...pageProps} />
            <Footer />
        </>
    )
}

export default MyApp
