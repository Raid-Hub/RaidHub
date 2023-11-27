import { router } from "."
import { getProfileByDestinyMembershipId } from "./procedures/profile/getProfileByDestinyMembershipId"
import { deleteUser } from "./procedures/user/delete"
import { getAuthenticatedProfile } from "./procedures/user/getAuthenticatedProfile"
import { getConnections } from "./procedures/user/getConnections"
import { removeProvider } from "./procedures/account/removeProvider"
import { updateProfile } from "./procedures/user/updateProfile"
import { addByAPIKey } from "./procedures/account/speedrun-com/addByAPIKey"
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
                addByAPIKey: addByAPIKey
            })
        })
    }),
    // public router for finding and loading profiles
    profile: router({
        byDestinyMembershipId: getProfileByDestinyMembershipId
    }),
    // admin tools
    admin: router({
        vanity: router({
            create: createVanity
        })
    })
})
