"use client"

import { match } from "@formatjs/intl-localematcher"
import { DestinyManifestLanguage } from "bungie-net-core/manifest"
import { ManifestLanguage } from "bungie-net-core/manifest/types"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"

const d2ManifestLocales = [
    "en",
    "fr",
    "de",
    "es",
    "es-mx",
    "it",
    "ja",
    "ko",
    "pl",
    "pt-br",
    "ru",
    "zh-chs",
    "zh-cht"
] as const satisfies ManifestLanguage[]

const LanguageContext = createContext<
    | {
          locale: string
          manifestLanguage: DestinyManifestLanguage
      }
    | undefined
>(undefined)

export function LocaleManager({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<string>("en-US")
    const [manifestLanguage, setManifestLanguage] = useState<DestinyManifestLanguage>("en")

    useEffect(() => {
        setLocale(navigator.language)
        const matchedLanguage = match(
            navigator.languages,
            d2ManifestLocales.map(locale => {
                const transformedLocale = locale
                    .replace(/-chs$/i, "-Hans")
                    .replace(/-cht$/i, "-Hant")

                return transformedLocale
            }),
            "en"
        )
        setManifestLanguage(
            matchedLanguage
                .toLowerCase()
                .replace(/-hans$/i, "-chs")
                .replace(/-hant$/i, "-cht") as ManifestLanguage
        )
        document.documentElement.setAttribute("lang", matchedLanguage)
    }, [])

    return (
        <LanguageContext.Provider
            value={{
                locale,
                manifestLanguage
            }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLocale = () => {
    const context = useContext(LanguageContext)
    if (!context) throw new Error("useLocale must be used within a LocaleManager")
    return context
}
