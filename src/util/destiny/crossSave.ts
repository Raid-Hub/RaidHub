import { BungieMembershipType, UserInfoCard } from "bungie-net-core/lib/models"

// Finds the original membershipType of a destiny account
export function findPrimaryCrossSave({
    crossSaveOverride,
    membershipType,
    applicableMembershipTypes
}: UserInfoCard): BungieMembershipType {
    if (applicableMembershipTypes.length === 1) {
        return membershipType
    } else if (applicableMembershipTypes.length) {
        return crossSaveOverride || membershipType
    } else {
        return crossSaveOverride
    }
}

// Finds the original membershipType of a destiny account
export function isPrimaryCrossSave({ crossSaveOverride, membershipType }: UserInfoCard): boolean {
    return crossSaveOverride === membershipType
}
