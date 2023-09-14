import { router } from "."
import { getProfileByDestinyMembershipId } from "./procedures/profile/getProfileByDestinyMembershipId"
import { getVanityByMembership } from "./procedures/profile/getVanityByMembership"
import { deleteUser } from "./procedures/user/delete"
import { getAuthenticatedProfile } from "./procedures/user/getAuthenticatedProfile"
import { getSocials } from "./procedures/user/getSocials"
import { removeProvider } from "./procedures/user/removeProvider"
import { updateProfile } from "./procedures/user/updateProfile"

export const appRouter = router({
    // protected router for a user logged in with a session
    user: router({
        socials: getSocials,
        delete: deleteUser,
        profile: router({
            update: updateProfile,
            get: getAuthenticatedProfile
        }),
        account: router({
            removeById: removeProvider
        })
    }),
    // public router for finding and loading profiles
    profile: router({
        byDestinyMembershipId: getProfileByDestinyMembershipId
    }),
    // resolving vanities
    vanity: router({
        byMember: getVanityByMembership
    })
})
