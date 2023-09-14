import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
                <link
                    href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro"
                    rel="stylesheet"
                />
                <meta name="color-scheme" content="dark" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
