import { BungieMembershipType } from "oodestiny/schemas"

export const Founders: { [id: string]: string } = {
    "4611686018488107374": "Newo",
    "4611686018493378282": "Bruce",
}

export const Vanity: {
    [id: string]: { membershipType: BungieMembershipType; membershipId: string }
} = {
    newo: {
        membershipType: 3,
        membershipId: "4611686018488107374",
    },
}
