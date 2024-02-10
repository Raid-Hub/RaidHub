import { redirect } from "next/navigation"
import { getServerAuthSession } from "~/server/api/auth"
import { SignOut } from "./SignOut"

export default async function Page() {
    const session = await getServerAuthSession()
    if (!session) {
        redirect("/")
    } else {
        return <SignOut />
    }
}
