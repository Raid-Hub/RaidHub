import styled from "styled-components"
import { $media } from "~/app/layout/media"
import { Container } from "~/components/layout/Container"

export const Latest = styled(Container)<{
    $playerCount: number
}>`
    --w: calc(min(100%, ${({ $playerCount }) => Math.min($playerCount, 6) * 100}px));
    min-width: var(--w);
    flex-basis: var(--w);
    ${$media.max.tablet`
        flex: 1
    `};
`
