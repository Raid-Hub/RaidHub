import { createTRPCRouter } from "."
import { createPresignedProfilePicURL } from "./procedures/account/createPresignedProfilePicURL"
import { removeProvider } from "./procedures/account/removeProvider"
import { addByAPIKey } from "./procedures/account/speedrun-com/addByAPIKey"
import { getProfile } from "./procedures/profile/getProfile"
import { deleteUser } from "./procedures/user/delete"
import { getAuthenticatedProfile } from "./procedures/user/getAuthenticatedProfile"
import { getConnections } from "./procedures/user/getConnections"
import { updateProfile } from "./procedures/user/updateProfile"

export const appRouter = createTRPCRouter({
    // protected router for a user logged in with a session
    user: createTRPCRouter({
        connections: getConnections,
        delete: deleteUser,
        profile: createTRPCRouter({
            update: updateProfile,
            get: getAuthenticatedProfile
        }),
        account: createTRPCRouter({
            presignedIconURL: createPresignedProfilePicURL,
            removeById: removeProvider,
            speedrunCom: createTRPCRouter({
                addByAPIKey: addByAPIKey
            })
        })
    }),
    // public router for finding and loading profiles
    profile: createTRPCRouter({
        getUnique: getProfile
    })
})
