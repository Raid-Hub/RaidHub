"use client"

import { useRaidHubPlayerPopulation } from "~/services/raidhub/useRaidHubPlayerPopulation"
import { PopulationGraph } from "./PopulationGraph"

export default function Page() {
    const query = useRaidHubPlayerPopulation()

    const now = new Date()
    now.setMinutes(0, 0, 0)

    if (query.isSuccess) {
        return <PopulationGraph data={query.data} now={now} />
    }

    return <div>{}</div>
}
