import { BungieMembershipType } from "bungie-net-core/lib/models"

export const Founders: { [id: string]: string } = {
    "4611686018488107374": "Newo",
    "4611686018493378282": "Bruce"
}

export const Vanity: {
    [id: string]: { membershipType: BungieMembershipType; membershipId: string }
} = {
    ["newo"]: {
        membershipType: BungieMembershipType.TigerSteam,
        membershipId: "4611686018488107374"
    },
    ["bruce"]: {
        membershipType: BungieMembershipType.TigerSteam,
        membershipId: "4611686018493378282"
    },
    ["theos"]: {
        membershipType: BungieMembershipType.TigerSteam,
        membershipId: "4611686018474149055"
    },
    ["mj"]: {
        membershipType: BungieMembershipType.TigerPsn,
        membershipId: "4611686018478899141"
    }
}
