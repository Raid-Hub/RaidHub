import "server-only"

import { headers } from "next/headers"
import { userAgent } from "next/server"

export const isStaticRequest = () => {
    const hdrs = headers()
    return (
        !userAgent({
            headers: hdrs
        }).ua && !Array.from(hdrs).length
    )
}
