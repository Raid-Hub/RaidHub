import { useEffect, useState } from "react"
import { wait } from "../util/math"
import { X } from "../util/types"
import { Socials } from "../util/socials"
import { Raid } from "../util/raid"

type UseRaidHubProfile = {
    profile: X | null
    isLoading: boolean
}

export function useRaidHubProfile(membershipId: string): UseRaidHubProfile {
    const [profile, setProfile] = useState<X | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        setLoading(true)
        // TODO
        const getRaidHubProfile = async () => {
            await wait(250)
            if (membershipId === "4611686018488107374")
                setProfile({
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
                    background: "linear-gradient(25deg, #220333, #c688e6, #220333 70%);",
                    placements: {
                        [Raid.VOW_OF_THE_DISCIPLE]: {
                            number: 23,
                            activityId: "10333497701"
                        },
                        [Raid.KINGS_FALL]: {
                            number: 58,
                            activityId: "11397970999"
                        },
                        [Raid.ROOT_OF_NIGHTMARES]: {
                            number: 18,
                            activityId: "12685770593"
                        }
                    },
                    tags: {
                        [Raid.ROOT_OF_NIGHTMARES]: [
                            {
                                string: "Duo Flawless",
                                activityId: "12738438014",
                                flawless: true
                            }
                        ]
                    }
                })
            else
                setProfile({
                    pinnedActivity: null,
                    socials: [],
                    background: null,
                    placements: {},
                    tags: {}
                })
            setLoading(false)
        }
        getRaidHubProfile()
    }, [membershipId])
    return { profile, isLoading }
}
