"use client"

import { useParams } from "next/navigation"
import { PGCRPage } from "../PGCRPage"

export default function Loading() {
    const { instanceId } = useParams<{
        instanceId: string
    }>()

    return <PGCRPage instanceId={instanceId} isReady={false} />
}
