import { useMemo, type HTMLProps } from "react"
import type { SVGWrapperProps } from "~/components/SVG"
import { Flex } from "~/components/layout/Flex"
import { type RaidHubInstanceCharacter } from "~/services/raidhub/types"
import { useCharacterClass } from "../hooks/useCharacterClass"
import { useResolveCharacter } from "../hooks/useResolveCharacter"

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
    characters: readonly RaidHubInstanceCharacter[]
} & Omit<HTMLProps<HTMLDivElement>, "ref">) => {
    const content = useMemo(() => {
        switch (characters.length) {
            case 1:
                return <CharacterLogo character={characters[0]} sx={sizes[0]} />
            case 2:
                return (
                    <Flex $gap={0.4} $padding={0} $fullWidth $align="flex-start">
                        <CharacterLogo character={characters[0]} sx={sizes[1][0]} />
                        <CharacterLogo
                            character={characters[1]}
                            sx={sizes[1][1]}
                            color="lightGray"
                        />
                    </Flex>
                )
            case 3:
                const [first, second, third] = characters
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
}: { character: RaidHubInstanceCharacter } & SVGWrapperProps) => {
    const { data: classHash } = useResolveCharacter(character, {
        select: data => data.character.data?.classHash ?? null
    })

    const Icon = useCharacterClass(classHash ?? 0)
    return <Icon {...styleProps} />
}
