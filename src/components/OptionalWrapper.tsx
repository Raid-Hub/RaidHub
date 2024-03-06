import { type ReactNode } from "react"

export const OptionalWrapper = <T, C extends ReactNode>(props: {
    condition: T
    children: T extends NonNullable<T> ? never : C // forces the children to be never if the condition is non-nullable
    wrapper: (props: { children: C; value: NonNullable<T> }) => ReactNode
}) =>
    !props.condition ? (
        props.children
    ) : (
        <props.wrapper value={props.condition}>{props.children}</props.wrapper>
    )
