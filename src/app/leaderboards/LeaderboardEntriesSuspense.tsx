import { Suspense, type ReactNode } from "react"
import { LeaderboardEntriesLoading } from "./LeaderboardEntriesLoading"

export const LeaderboardEntriesSuspense = ({ children }: { children: ReactNode }) => (
    <Suspense fallback={<LeaderboardEntriesLoading />}>{children}</Suspense>
)
