import { Collection } from '@discordjs/collection';
import { BungieMembershipType } from 'oodestiny/schemas';
import { useActivityHistory } from '../../hooks/activityHistory';
import { useLanguage } from '../../hooks/language';
import styles from '../../styles/profile.module.css';
import { LocalizedStrings } from '../../util/localized-strings';
import { AllRaids } from '../../util/raid';
import RaidCard from './RaidCard';
import ActivityCard from './ActivityCard';
import { useState } from 'react';

export enum Layout {
  DotCharts,
  RecentActivities
}

type RaidCardsProps = {
  membershipId: string
  membershipType: BungieMembershipType
  characterIds: string[]
  layout: Layout
}

const RaidCards = ({ membershipId, membershipType, characterIds, layout }: RaidCardsProps) => {
  const language = useLanguage()
  const { activities, isLoading: isLoadingDots } = useActivityHistory({ membershipId, membershipType, characterIds })
  const [pages, setPages] = useState<number>(1)
  const strings = LocalizedStrings[language]
  switch (layout) {
    case Layout.DotCharts:
      return (
        <div className={styles["cards"]}>
          {AllRaids.map((raid, idx) => (
            <RaidCard
              stats={{
                totalClears: 0,
                fastestClear: 0,
                averageClear: 0,
                sherpas: 0,
              }}
              key={idx}
              raidName={strings.raidNames[raid]}
              raid={raid}
              activities={activities ? activities[raid] : new Collection()}
              isLoadingDots={isLoadingDots}
            />
          ))}
        </div>
      )
    case Layout.RecentActivities:
      return (
        <div className={styles["recent"]}>
          {Object.values(activities ?? {})
            .flatMap((set) => set.toJSON())
            .sort((a, b) => new Date(b.period).getTime() - new Date(a.period).getTime())
            .slice(0, pages * 100)
            .map(activity => (
              <ActivityCard activity={activity} />
            ))}
          <button className={styles["load-more"]}
            onClick={() => setPages(pages + 1)}>
            <span>{strings.loadMore}</span>
          </button>
        </div>
      )
  }
}

export default RaidCards;


