import AddVanityForm from "./AddVanityForm"
import RemoveVanityForm from "./RemoveVanityForm"

export default function AdminPanel() {
    return (
        <main>
            <h1>Admin Panel</h1>
            <AddVanityForm />
            <RemoveVanityForm />
        </main>
    )
}
