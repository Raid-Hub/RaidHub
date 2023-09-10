import { router } from "."
import { getProfile } from "./procedures/profile/getProfile"
import { getVanity } from "./procedures/profile/getVanity"
import { deleteUser } from "./procedures/user/delete"
import { getAuthenticatedProfile } from "./procedures/user/getAuthenticatedProfile"
import { getSocial } from "./procedures/user/getSocial"
import { removeProvider } from "./procedures/user/removeProvider"
import { updateProfile } from "./procedures/user/updateProfile"

export const appRouter = router({
    // protected router for a user logged in with a session
    user: router({
        getSocial: getSocial,
        removeProvider: removeProvider,
        updateProfile: updateProfile,
        deleteUser: deleteUser,
        getProfile: getAuthenticatedProfile
    }),
    // public router for finding and loading profiles
    profile: router({
        getProfile: getProfile,
        getVanity: getVanity
    })
})
