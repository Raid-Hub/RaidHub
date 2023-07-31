import { useLocale } from "../app/LocaleManager"

const PageLoading = () => {
    const { strings } = useLocale()
    return (
        <main>
            <h1>{strings.loading}</h1>
        </main>
    )
}

export default PageLoading
