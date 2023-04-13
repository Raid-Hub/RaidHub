import { useEffect, useState } from "react"
import { isSupported, SupportedLanguage } from "../util/localized-strings"

export function useLanguage(): SupportedLanguage {
    const [language, setLanguage] = useState<SupportedLanguage | null>(null)

    useEffect(() => {
        const lang = new Intl.DisplayNames([navigator.language], {
            type: "language"
        }).of(navigator.language)
        if (lang && isSupported(lang)) {
            setLanguage(lang as SupportedLanguage)
        }
    }, [])

    return language ?? SupportedLanguage.ENGLISH
}
