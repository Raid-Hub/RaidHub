import { Collection } from '@discordjs/collection';
import Link from 'next/link';
import { BungieMembershipType } from 'oodestiny/schemas';
import { useActivityHistory } from '../../hooks/activityHistory';
import { useLanguage } from '../../hooks/language';
import styles from '../../styles/profile.module.css';
import { LocalizedStrings } from '../../util/localized-strings';
import { secondsToHMS } from '../../util/math';
import { AllRaids, Raid, RaidCardBackground } from '../../util/raid';
import { ActivityCollection } from '../../util/types';
import DotGraph from './DotGraph';
import Loading from '../Loading';

type RaidCardsProps = {
  membershipId: string
  membershipType: BungieMembershipType
  characterIds: string[]
}

const RaidCards = ({ membershipId, membershipType, characterIds }: RaidCardsProps) => {
  const language = useLanguage()
  const { activities, isLoading: isLoadingDots } = useActivityHistory({ membershipId, membershipType, characterIds })

  const strings = LocalizedStrings[language]
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
}

type RaidStats = {
  totalClears: number
  fastestClear: number
  averageClear: number
  sherpas: number
}

type RaidCardProps = {
  raid: Raid
  raidName: string
  activities: ActivityCollection
  stats: RaidStats
  isLoadingDots: boolean
}

const RaidCard = ({ raid, raidName, activities, stats, isLoadingDots }: RaidCardProps) => {


  return (
    <div className={styles["raid-card"]}>
      <div className={styles["raid-card-img-container"]}>
        <img className={styles["top-image"]} src={RaidCardBackground[raid]} alt="" />
        <div className={styles["img-overlay"]}>
          <div className={styles["tag-row"]}>
            <Link href="/" className={styles["clickable-tag"]}>
              <span>Day One #1</span>
            </Link>
          </div>
          <div className={styles["img-overlay-bottom"]}>
            <span className={styles["raid-card-title"]}>{raidName}</span>
            <div className={styles["card-diamonds"]}>
              <Link href="/" className={styles["clickable-tag"]}>
                <img src="/icons/flawless_diamond.png" alt="" />
                <span>Trio Flawless</span>
              </Link>
              <Link href="/" className={styles["clickable-tag"]}>
                <span>Duo Master</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["raid-card-content"]}>
        <div className={styles["graph-content"]}>
          
            <DotGraph
              activities={activities}
              isLoading={isLoadingDots}
              filter={() => true /** (dot) => dot.values.completed.basic.value */} />
          <div className={styles["graph-count"]}>
            <div className={styles["graph-number-img"]}>
              <p className={styles["graph-number"]}>{stats.totalClears}</p>
            </div>

            <p className={styles["graph-count-text"]}>total clears</p>
          </div>
        </div>


        <div className={styles["timings"]}>
          <div className={styles["timing"]}>
            <p className={styles["timings-number"]}>{secondsToHMS(stats.fastestClear)}</p>
            <p className={styles["timings-subtitle"]}>fastest</p>
          </div>

          <div className={styles["timing"]}>
            <p className={styles["timings-number"]}>{secondsToHMS(stats.averageClear)}</p>
            <p className={styles["timings-subtitle"]}>Average</p>
          </div>

          <div className={styles["timing"]}>
            <p className={styles["timings-number"]}>{stats.sherpas}</p>
            <p className={styles["timings-subtitle"]}>Sherpas</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RaidCards;


