import { type ReadonlyCollection } from "@discordjs/collection"
import { useMemo, type HTMLProps } from "react"
import type { SVGWrapperProps } from "~/components/SVG"
import { Flex } from "~/components/layout/Flex"
import { useCharacterClass } from "../hooks/useCharacterClass"
import { useResolveCharacter } from "../hooks/useResolveCharacter"
import type DestinyPGCRCharacter from "../models/Character"

const sizes = [
    {
        desktop: 65,
        mobile: 45
    },
    [
        {
            desktop: 50,
            mobile: 40
        },
        {
            desktop: 35,
            mobile: 25
        }
    ],
    [
        {
            desktop: 40,
            mobile: 30
        },
        {
            desktop: 25,
            mobile: 20
        },
        {
            desktop: 25,
            mobile: 20
        }
    ]
] as const

export const CharacterLogoStack = ({
    characters,
    ...otherProps
}: {
    characters: ReadonlyCollection<string, DestinyPGCRCharacter>
} & Omit<HTMLProps<HTMLDivElement>, "ref">) => {
    const content = useMemo(() => {
        switch (characters.size) {
            case 1:
                return <CharacterLogo character={characters.first()!} sx={sizes[0]} />
            case 2:
                return (
                    <Flex $gap={0.4} $padding={0} $fullWidth $align="flex-start">
                        <CharacterLogo character={characters.first()!} sx={sizes[1][0]} />
                        <CharacterLogo
                            character={characters.last()!}
                            sx={sizes[1][1]}
                            color="lightGray"
                        />
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
                        <CharacterLogo character={first} sx={sizes[2][0]} />
                        <Flex $gap={0.2} $padding={0}>
                            <CharacterLogo character={second} sx={sizes[2][1]} color="lightGray" />
                            <CharacterLogo character={third} sx={sizes[2][2]} color="lightGray" />
                        </Flex>
                    </Flex>
                )
            default:
                return null
        }
    }, [characters])

    return (
        <Flex {...otherProps} $padding={0}>
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
