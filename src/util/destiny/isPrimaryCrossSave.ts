import { UserInfoCard } from "bungie-net-core/models"

export function isPrimaryCrossSave({ crossSaveOverride, membershipType }: UserInfoCard) {
    return !crossSaveOverride || membershipType === crossSaveOverride
}
