import { DestinyManifestLanguage as DestinyManifestLanguageType } from "bungie-net-core/manifest"
import Head from "next/head"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"

const supportedLanguages = [
    { regex: /^de/i, lang: "de" },
    { regex: /^es(?:-MX)?/i, lang: "es-mx" },
    { regex: /^fr/i, lang: "fr" },
    { regex: /^it/i, lang: "it" },
    { regex: /^ja/i, lang: "ja" },
    { regex: /^ko/i, lang: "ko" },
    { regex: /^pl/i, lang: "pl" },
    { regex: /^pt(?:-BR)?/i, lang: "pt-br" },
    { regex: /^ru/i, lang: "ru" },
    { regex: /^zh(?:-CN)?/i, lang: "zh-chs" },
    { regex: /^zh-TW/i, lang: "zh-cht" },
    { regex: /^en(?:-)?/i, lang: "en" }
    // Add more patterns as needed
] as const

const LanguageContext = createContext<{
    locale: string
    manifestLanguage: DestinyManifestLanguageType
} | null>(null)

type LanguageProviderProps = {
    children: ReactNode
}

const LocaleManager = ({ children }: LanguageProviderProps) => {
    const [locale, setLocale] = useState<string>("en-US")

    useEffect(() => {
        setLocale(navigator.language)
    }, [])

    function getDestinyManifestLanguage(locale: string): DestinyManifestLanguageType {
        const matchedLanguage = supportedLanguages.find(({ regex }) => regex.test(locale))

        return matchedLanguage ? matchedLanguage.lang : "en"
    }

    return (
        <LanguageContext.Provider
            value={{
                locale,
                manifestLanguage: getDestinyManifestLanguage(locale)
            }}>
            {children}
            <Head>
                <meta httpEquiv="Content-Language" content={locale} />
            </Head>
        </LanguageContext.Provider>
    )
}

export const useLocale = () => {
    const context = useContext(LanguageContext)
    if (!context) throw new Error("useLocale must be used within a LanguageProvider")
    return context
}

export default LocaleManager
