import { Flex } from "~/components/layout/Flex"
import { H4 } from "~/components/typography/H4"
import { ReactChildren } from "~/types/generic"
import { HomeCardContentSectionItem } from "./HomeCardContentSectionItem"

export function HomeCardContentSection(props: {
    sectionTitle: string
    children: ReactChildren<typeof HomeCardContentSectionItem>
}) {
    return (
        <div>
            <H4>{props.sectionTitle}</H4>
            <Flex $direction="column" $crossAxis="flex-start" $gap={0} $padding={0}>
                {props.children}
            </Flex>
        </div>
    )
}
