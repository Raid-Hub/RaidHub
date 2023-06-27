import { useEffect, useState } from "react"
import { isSupported, SupportedLanguage } from "../util/localized-strings"

type UseLanguage = {
    language: SupportedLanguage
    locale: string
}

export function useLanguage(): UseLanguage {
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

    return { language: language ?? SupportedLanguage.ENGLISH, locale: locale ?? "en-US" }
}
