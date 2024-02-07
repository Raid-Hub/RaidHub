import { redirect } from "next/navigation"
import { getServerAuthSession } from "~/app/api/auth"
import { SignOut } from "./SignOut"

export async function Page() {
    const session = await getServerAuthSession()
    if (!session) {
        redirect("/")
    } else {
        return <SignOut />
    }
}
