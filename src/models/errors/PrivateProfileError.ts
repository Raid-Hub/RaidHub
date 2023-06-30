import { BungieMembershipType, DestinyComponentType } from "bungie-net-core/models"
import CustomError, { ErrorCode } from "./CustomError"

export default class PrivateProfileError extends CustomError {
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
        super("Private Profile", ErrorCode.PrivateProfile)
        this.membershipId = destinyMembershipId
        this.membershipType = membershipType
        this.components = components
    }
}
