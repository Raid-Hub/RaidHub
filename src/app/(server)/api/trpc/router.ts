import { createTRPCRouter } from "."
import { unhandledClientError } from "./procedures/monitoring/unhandledError"
import { getProfile } from "./procedures/profile/getProfile"
import { createPresignedProfilePicURL } from "./procedures/user/account/createPresignedProfilePicURL"
import { removeProvider } from "./procedures/user/account/removeProvider"
import { addByAPIKey } from "./procedures/user/account/speedrun-com/addByAPIKey"
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
    }),
    // public router for monitoring and debugging
    monitoring: createTRPCRouter({
        unhandledClientError: unhandledClientError
    })
})
