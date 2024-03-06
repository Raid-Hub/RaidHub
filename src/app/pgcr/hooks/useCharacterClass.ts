import { useMemo } from "react"
import Hunter from "~/components/icons/Hunter"
import QuestionMark from "~/components/icons/QuestionMark"
import Titan from "~/components/icons/Titan"
import Warlock from "~/components/icons/Warlock"
import { useClassDefinition } from "~/hooks/dexie"

export const useCharacterClass = (classHash: number | string) => {
    const characterClass = useClassDefinition(classHash)

    return useMemo(() => {
        switch (characterClass?.classType) {
            case 0:
                return Titan
            case 1:
                return Hunter
            case 2:
                return Warlock
            default:
                return QuestionMark
        }
    }, [characterClass])
}
