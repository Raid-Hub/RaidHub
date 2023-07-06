import { RaidHubProfile } from "../../types/profile"
import { Socials } from "../../util/profile/socials"
import { wait } from "../../util/wait"

export async function getRaidHubProfile(membershipId: string): Promise<RaidHubProfile> {
    await wait(250)
    if (membershipId === "4611686018488107374")
        return {
            pinnedActivity: "4129239230",
            socials: [
                {
                    id: Socials.YouTube,
                    displayName: "Newo1",
                    url: "https://youtube.com/@Newo1"
                },
                {
                    id: Socials.Discord,
                    displayName: "Newo#0001",
                    url: "https://discord.gg/aXuN3qwDRK"
                },
                {
                    id: Socials.Twitter,
                    displayName: "@kneewoah",
                    url: "https://twitter.com/kneewoah"
                },
                {
                    id: Socials.Twitch,
                    displayName: "newoX",
                    url: "https://twitch.tv/newox"
                },
                {
                    id: Socials.Bungie,
                    displayName: "Newo#9010",
                    url: "https://www.bungie.net/7/en/User/Profile/3/4611686018488107374"
                }
            ],
            background: "linear-gradient(25deg, #220333, #c688e6, #220333 70%);"
        }
    else
        return {
            pinnedActivity: null,
            socials: [],
            background: null
        }
}
