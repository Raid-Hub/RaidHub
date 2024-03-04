import { type Metadata } from "next"
import { type ReactNode } from "react"

// The file exists for metadata
export const metadata: Metadata = {
    title: "Admin Query"
}

export default function Layout(params: { children: ReactNode }) {
    return params.children
}
