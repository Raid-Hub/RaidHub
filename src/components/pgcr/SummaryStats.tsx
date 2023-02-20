import { DestinyPostGameCarnageReportEntry } from 'oodestiny/schemas';
import React from 'react';
import { ActivityData } from '../../models/pgcr/ActivityData'
import { PGCRMember } from '../../models/pgcr/Entry';
import { PGCRComponentProps } from '../../pages/pgcr/[activityId]'
import styles from '../../styles/pgcr.module.css';


export class SummaryStats extends React.Component<PGCRComponentProps> {
  constructor(props: PGCRComponentProps) {
    super(props)
  }

  render() {
    let data: ActivityData | null = null
    if (this.props.pgcr) {
      data = new ActivityData(this.props.pgcr)
    }
    return (<>
      <div>MVP: {data?.mvp}</div>
      <div>TOTAL KILLS: {data?.totalKills}</div>
      <div>ABILITY RATIO: {data?.killsTypeRatio.ability}%</div>
      <div>TOTAL DEATHS: {data?.totalDeaths}</div>
    </>)
  }
}
