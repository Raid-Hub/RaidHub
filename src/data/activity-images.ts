import { Raid } from "~/data/raid"
import { type ListedRaid } from "~/services/raidhub/types"

export const RaidSplash: {
    [key in ListedRaid]: keyof typeof R2RaidSplash
} = {
    [Raid.LEVIATHAN]: "leviathanSplash",
    [Raid.EATER_OF_WORLDS]: "eaterOfWorldsSplash",
    [Raid.SPIRE_OF_STARS]: "spireOfStarsSplash",
    [Raid.LAST_WISH]: "lastWishSplash",
    [Raid.SCOURGE_OF_THE_PAST]: "scourgeOfThePastSplash",
    [Raid.CROWN_OF_SORROW]: "crownOfSorrowSplash",
    [Raid.GARDEN_OF_SALVATION]: "gardenOfSalvationSplash",
    [Raid.DEEP_STONE_CRYPT]: "deepStoneCryptSplash",
    [Raid.VAULT_OF_GLASS]: "vaultOfGlassSplash",
    [Raid.VOW_OF_THE_DISCIPLE]: "vowOfTheDiscipleSplash",
    [Raid.KINGS_FALL]: "kingsFallSplash",
    [Raid.ROOT_OF_NIGHTMARES]: "rootOfNightmaresSplash",
    [Raid.CROTAS_END]: "crotasEndSplash"
}

export const R2RaidSplash = {
    leviathanSplash: {
        path: "splash/leviathan",
        variants: {
            tiny: "tiny.jpg",
            small: "small.jpg",
            medium: "medium.jpg"
        }
    },
    eaterOfWorldsSplash: {
        path: "splash/eow",
        variants: {
            tiny: "tiny.jpg",
            small: "small.jpg",
            medium: "medium.jpg",
            large: "large.jpg"
        }
    },
    spireOfStarsSplash: {
        path: "splash/spire",
        variants: {
            tiny: "tiny.jpg",
            small: "small.jpg",
            medium: "medium.jpg"
        }
    },
    lastWishSplash: {
        path: "splash/wish",
        variants: {
            tiny: "tiny.jpg",
            small: "small.jpg",
            medium: "medium.jpg"
        }
    },
    scourgeOfThePastSplash: {
        path: "splash/scourge",
        variants: {
            tiny: "tiny.jpg",
            small: "small.jpg",
            medium: "medium.jpg",
            large: "large.jpg"
        }
    },
    crownOfSorrowSplash: {
        path: "splash/crown",
        variants: {
            tiny: "tiny.jpg",
            small: "small.jpg",
            medium: "medium.jpg"
        }
    },
    gardenOfSalvationSplash: {
        path: "splash/gos",
        variants: {
            tiny: "tiny.jpg",
            small: "small.jpg",
            medium: "medium.jpg",
            large: "large.jpg",
            xlarge: "xlarge.jpg"
        }
    },
    deepStoneCryptSplash: {
        path: "splash/dsc",
        variants: {
            tiny: "tiny.jpg",
            small: "small.jpg",
            medium: "medium.jpg",
            large: "large.jpg"
        }
    },
    vaultOfGlassSplash: {
        path: "splash/vog",
        variants: {
            tiny: "tiny.jpg",
            small: "small.jpg",
            medium: "medium.jpg"
        }
    },
    vowOfTheDiscipleSplash: {
        path: "splash/vow",
        variants: {
            tiny: "tiny.jpg",
            small: "small.jpg",
            medium: "medium.jpg",
            large: "large.jpg",
            xlarge: "xlarge.jpg"
        }
    },
    kingsFallSplash: {
        path: "splash/kf",
        variants: {
            tiny: "tiny.jpg",
            small: "small.jpg",
            medium: "medium.jpg",
            large: "large.jpg"
        }
    },
    rootOfNightmaresSplash: {
        path: "splash/ron",
        variants: {
            tiny: "tiny.jpg",
            small: "small.jpg",
            medium: "medium.jpg"
        }
    },
    crotasEndSplash: {
        path: "splash/crota",
        variants: {
            tiny: "tiny.jpg",
            small: "small.jpg",
            medium: "medium.jpg"
        }
    }
}
