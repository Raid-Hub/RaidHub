import { BungieMembershipType } from "bungie-net-core/lib/models"

export const Founders: { [id: string]: string } = {
    "4611686018488107374": "Newo",
    "4611686018493378282": "Bruce",
    "4611686018474149055": "Theos"
}

export const Vanity: {
    [id: string]: { membershipType: BungieMembershipType; destinyMembershipId: string }
} = {
    ["newo"]: {
        membershipType: BungieMembershipType.TigerSteam,
        destinyMembershipId: "4611686018488107374"
    },
    ["bruce"]: {
        membershipType: BungieMembershipType.TigerSteam,
        destinyMembershipId: "4611686018493378282"
    },
    ["theos"]: {
        membershipType: BungieMembershipType.TigerSteam,
        destinyMembershipId: "4611686018474149055"
    },
    ["mj"]: {
        membershipType: BungieMembershipType.TigerPsn,
        destinyMembershipId: "4611686018478899141"
    }
}
