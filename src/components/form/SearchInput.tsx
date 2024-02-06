import { InputHTMLAttributes } from "react"
import { AtLeast } from "~/types/generic"
import { Input, type InputProps } from "./Input"

export type SearchInputProps = AtLeast<
    Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "name" | "autoComplete">,
    "value" | "onChange"
> &
    InputProps

export const SearchInput = (props: SearchInputProps) => {
    return <Input type="text" name="search" autoComplete="off" {...props} />
}
