"use client"

import { useFormStatus } from "react-dom"

export function SubmitButton(props: { title: string }) {
    const { pending } = useFormStatus()

    return (
        <button type="submit" disabled={pending}>
            {props.title}
        </button>
    )
}
