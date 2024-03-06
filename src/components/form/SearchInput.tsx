import React, { type InputHTMLAttributes } from "react"
import { type AtLeast } from "~/types/generic"
import { Input, type InputProps } from "./Input"

export type SearchInputProps = AtLeast<
    Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "name" | "autoComplete">,
    "value" | "onChange"
> &
    InputProps

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
    return <Input type="text" name="search" autoComplete="off" {...props} ref={ref} />
})

SearchInput.displayName = "SearchInput"
