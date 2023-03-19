import { useEffect, useState } from "react"
import { isSupported, SupportedLanguage } from "../util/localized-strings"

export function useLanguage(): SupportedLanguage {
    const [language, setLanguage] = useState<SupportedLanguage | null>(null)

    useEffect(() => { 
        if (isSupported(navigator.language)) setLanguage(navigator.language as SupportedLanguage)
    }, [])

    return language ?? SupportedLanguage.ENGLISH
  }