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
                <meta name="robots" content="index" />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
