import { BungieMembershipType, DestinyComponentType } from "bungie-net-core/lib/models"

export default class PrivateProfileError extends Error {
    membershipId: string
    membershipType: BungieMembershipType
    components: DestinyComponentType[]
    constructor({
        destinyMembershipId,
        membershipType,
        components
    }: {
        destinyMembershipId: string
        membershipType: BungieMembershipType
        components: DestinyComponentType[]
    }) {
        super()
        this.membershipId = destinyMembershipId
        this.membershipType = membershipType
        this.components = components
    }
}
