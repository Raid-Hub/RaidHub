"use client"

import type { GlobalAlert, GlobalAlertLevel } from "bungie-net-core/models"
import Link from "next/link"
import styled from "styled-components"
import { Panel } from "~/components/Panel"
import { Container } from "~/components/layout/Container"
import { useCommonSettings, useGlobalAlerts } from "~/services/bungie/hooks"

const commonQueryOptions = {
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 60 * 60,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true
}

export const ServiceStatusBanner = () => {
    const { data: d2ServersOnline } = useCommonSettings({
        ...commonQueryOptions,
        select: settings => settings.systems.Destiny2?.enabled ?? null
    })
    const { data: alerts } = useGlobalAlerts(
        { includestreaming: true },
        {
            ...commonQueryOptions,
            select: alerts =>
                d2ServersOnline == false
                    ? alerts.filter(alert => alert.AlertKey !== "D2-OfflineSoonToday")
                    : alerts
        }
    )

    return (
        <Container $fullWidth>
            {d2ServersOnline === false && <Destiny2OfflineBanner />}
            {alerts?.map(alert => (
                <Destiny2AlertBanner key={alert.AlertKey} alert={alert} />
            ))}
        </Container>
    )
}

const Destiny2OfflineBanner = () => (
    <StyledDestiny2OfflineBanner>
        Destiny 2 game servers are currently offline.
    </StyledDestiny2OfflineBanner>
)

const Destiny2AlertBanner = (props: { alert: GlobalAlert }) => {
    const timestamp = new Date(props.alert.AlertTimestamp)
    return (
        <StyledDestiny2AlertBanner $alertLevel={props.alert.AlertLevel}>
            <Link target="_blank" href={props.alert.AlertLink} style={{ color: "unset" }}>
                <div>{props.alert.AlertHtml}</div>
                <div
                    style={{
                        fontSize: "0.875rem"
                    }}>
                    Posted at: {timestamp.toLocaleTimeString()}
                </div>
            </Link>
        </StyledDestiny2AlertBanner>
    )
}

const StyledDestiny2OfflineBanner = styled(Panel).attrs({ $fullWidth: true })`
    background-color: ${props => props.theme.colors.background.info};
`

const StyledDestiny2AlertBanner = styled(Panel).attrs({ $fullWidth: true })<{
    $alertLevel: GlobalAlertLevel
}>`
    background-color: ${props => {
        switch (props.$alertLevel) {
            case 1:
                return props.theme.colors.background.info
            case 2:
            case 3:
                return props.theme.colors.background.warning
            default:
                return props.theme.colors.background.medium
        }
    }};

    color: ${props => {
        switch (props.$alertLevel) {
            case 2:
            case 3:
                return "black"
            default:
                return props.theme.colors.text.white
        }
    }};
`
