import { type ReadonlyCollection } from "@discordjs/collection"
import { useMemo, type HTMLProps } from "react"
import type { SVGWrapperProps } from "~/components/SVG"
import { Flex } from "~/components/layout/Flex"
import { useCharacterClass } from "../hooks/useCharacterClass"
import { useResolveCharacter } from "../hooks/useResolveCharacter"
import type DestinyPGCRCharacter from "../models/Character"

export const CharacterLogoStack = ({
    characters,
    ...otherProps
}: {
    characters: ReadonlyCollection<string, DestinyPGCRCharacter>
} & HTMLProps<HTMLDivElement>) => {
    const content = useMemo(() => {
        switch (characters.size) {
            case 1:
                return <CharacterLogo character={characters.first()!} sx={65} />
            case 2:
                return (
                    <Flex $gap={0.4} $padding={0} $fullWidth $align="flex-start">
                        <CharacterLogo character={characters.first()!} sx={60} />
                        <CharacterLogo character={characters.last()!} sx={30} color="lightGray" />
                    </Flex>
                )
            case 3:
                const [first, second, third] = Array.from(characters.values())
                return (
                    <Flex
                        $direction="column"
                        $gap={0}
                        $padding={0}
                        style={{ paddingBottom: "0.4rem" }}>
                        <CharacterLogo character={first} sx={40} />
                        <Flex $gap={0.2} $padding={0}>
                            <CharacterLogo character={second} sx={20} color="lightGray" />
                            <CharacterLogo character={third} sx={20} color="lightGray" />
                        </Flex>
                    </Flex>
                )
            default:
                return null
        }
    }, [characters])

    return (
        <Flex $padding={0} {...otherProps}>
            {content}
        </Flex>
    )
}

const CharacterLogo = ({
    character,
    ...styleProps
}: { character: DestinyPGCRCharacter } & SVGWrapperProps) => {
    const { data: classHash } = useResolveCharacter(character, {
        select: data => data.character.data?.classHash ?? null
    })

    const Icon = useCharacterClass(classHash ?? 0)
    return <Icon {...styleProps} />
}
