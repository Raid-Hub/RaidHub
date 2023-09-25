import { router } from "."
import { getProfileByDestinyMembershipId } from "./procedures/profile/getProfileByDestinyMembershipId"
import { getVanityByMembership } from "./procedures/profile/getVanityByMembership"
import { deleteUser } from "./procedures/user/delete"
import { getAuthenticatedProfile } from "./procedures/user/getAuthenticatedProfile"
import { getConnections } from "./procedures/user/getConnections"
import { removeProvider } from "./procedures/account/removeProvider"
import { updateProfile } from "./procedures/user/updateProfile"
import { addByAPIKey } from "./procedures/account/speedrun-com/addByAPIKey"
import { removeSrcName } from "./procedures/account/speedrun-com/removeSrcName"
import { createPresignedProfilePicURL } from "./procedures/account/createPresignedProfilePicURL"
import { createVanity } from "./procedures/admin/vanity/createVanity"

export const appRouter = router({
    // protected router for a user logged in with a session
    user: router({
        connections: getConnections,
        delete: deleteUser,
        profile: router({
            update: updateProfile,
            get: getAuthenticatedProfile
        }),
        account: router({
            presignedIconURL: createPresignedProfilePicURL,
            removeById: removeProvider,
            speedrunCom: router({
                addByAPIKey: addByAPIKey,
                remove: removeSrcName
            })
        })
    }),
    // public router for finding and loading profiles
    profile: router({
        byDestinyMembershipId: getProfileByDestinyMembershipId
    }),
    // resolving vanities
    vanity: router({
        byMember: getVanityByMembership
    }),
    // admin tools
    admin: router({
        vanity: router({
            create: createVanity
        })
    })
})
