import { createTRPCRouter } from "."
import { createVanity } from "./procedures/admin/createVanity"
import { removeVanity } from "./procedures/admin/removeVanity"
import { unhandledClientError } from "./procedures/monitoring/unhandledClientError"
import { getProfile } from "./procedures/profile/getProfile"
import { createPresignedProfilePicURL } from "./procedures/user/account/createPresignedProfilePicURL"
import { removeProvider } from "./procedures/user/account/removeProvider"
import { addByAPIKey } from "./procedures/user/account/speedrun-com/addByAPIKey"
import { deleteUser } from "./procedures/user/delete"
import { getConnections } from "./procedures/user/getConnections"
import { getPrimaryAuthenticatedProfile } from "./procedures/user/getPrimaryAuthenticatedProfile"
import { updateProfile } from "./procedures/user/updateProfile"
import { updateUser } from "./procedures/user/updateUser"

export const appRouter = createTRPCRouter({
    // protected router for a user logged in with a session
    user: createTRPCRouter({
        createSpeedrunComAccount: addByAPIKey,

        getConnections: getConnections,
        getPrimaryProfile: getPrimaryAuthenticatedProfile,

        update: updateUser,
        updateProfile: updateProfile,
        generatePresignedIconURL: createPresignedProfilePicURL,

        delete: deleteUser,
        removeByAccount: removeProvider
    }),
    // public router for finding and loading profiles
    profile: createTRPCRouter({
        getUnique: getProfile
    }),
    // public router for monitoring and debugging
    monitoring: createTRPCRouter({
        unhandledClientError: unhandledClientError
    }),
    admin: createTRPCRouter({
        createVanity: createVanity,
        removeVanity: removeVanity
    })
})
