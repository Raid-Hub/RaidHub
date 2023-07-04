import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import {
    LocalStrings,
    LocalizedStrings,
    SupportedLanguage,
    isSupported
} from "../../util/presentation/localized-strings"
import Head from "next/head"

type UseLanguage = {
    language: SupportedLanguage
    locale: string
    strings: LocalStrings
}

const LanguageContext = createContext<UseLanguage>({
    language: SupportedLanguage.ENGLISH,
    locale: "en-US",
    strings: LocalizedStrings[SupportedLanguage.ENGLISH]
})

type LanguageProviderProps = {
    children: ReactNode
}

const LanguageProvider = ({ children }: LanguageProviderProps) => {
    const [language, setLanguage] = useState<SupportedLanguage | null>(null)
    const [locale, setLocale] = useState<string | null>(null)

    useEffect(() => {
        const navLocale = navigator.language
        const lang = new Intl.DisplayNames([navLocale], {
            type: "language"
        }).of(navLocale)
        if (lang && isSupported(lang)) {
            setLanguage(lang as SupportedLanguage)
        }
        setLocale(navLocale)
    }, [])

    const value = {
        language: language ?? SupportedLanguage.ENGLISH,
        locale: locale ?? "en-US",
        get strings() {
            return LocalizedStrings[this.language]
        }
    }

    return (
        <LanguageContext.Provider value={value}>
            <Head>
                <meta httpEquiv="Content-Language" content={value.language} />
            </Head>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLocale(): UseLanguage {
    return useContext(LanguageContext)
}

export default LanguageProvider
