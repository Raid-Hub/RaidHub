import { UserInfoCard } from "bungie-net-core/lib/models"

export function isPrimaryCrossSave({ crossSaveOverride, membershipType }: UserInfoCard) {
    return !crossSaveOverride || membershipType === crossSaveOverride
}
