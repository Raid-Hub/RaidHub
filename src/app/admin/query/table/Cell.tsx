import { ColumnFormats } from "./formats"

export const Cell = ({
    value,
    Formatter
}: {
    value: any
    Formatter: (typeof ColumnFormats)[keyof typeof ColumnFormats]
}) => {
    return <td>{value !== null ? <Formatter value={value as never} /> : null}</td>
}
