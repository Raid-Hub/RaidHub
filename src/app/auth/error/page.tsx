import { useSearchParams } from "next/navigation"
import { PageWrapper } from "~/components/layout/PageWrapper"

export default function Page() {
    const searchParams = useSearchParams()
    console.log(searchParams)
    return (
        <PageWrapper>
            <h1>Something went wrong</h1>
            <p>There was an error logging you in. Please try again later.</p>
        </PageWrapper>
    )
}
