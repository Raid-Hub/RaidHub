import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { LocalizedStrings, SupportedLanguage } from "../../util/presentation/localized-strings"
import Head from "next/head"
import { useRouter } from "next/router"

const LanguageContext = createContext({
    language: SupportedLanguage.ENGLISH,
    locale: "en-US",
    strings: LocalizedStrings[SupportedLanguage.ENGLISH]
})

type LanguageProviderProps = {
    children: ReactNode
}

const LocaleManager = ({ children }: LanguageProviderProps) => {
    const [locale, setLocale] = useState<string>("en-US")
    const { locale: language } = useRouter()

    useEffect(() => {
        setLocale(navigator.language)
    }, [])

    const value = {
        language: (language as SupportedLanguage) ?? SupportedLanguage.ENGLISH,
        locale,
        get strings() {
            return LocalizedStrings[this.language]
        }
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
            <Head>
                <meta httpEquiv="Content-Language" content={value.language} />
            </Head>
        </LanguageContext.Provider>
    )
}

export const useLocale = () => useContext(LanguageContext)

export default LocaleManager
