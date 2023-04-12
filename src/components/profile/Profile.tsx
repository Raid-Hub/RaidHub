import styles from '../../styles/profile.module.css';
import { useBungieNextMembership } from "../../hooks/bungieNextMembership"
import { ProfileComponent } from "../../util/types"
import Head from "next/head";
import UserCard from "./UserCard";
import RankingBanner from "./RankingBanner";
import { Founders } from "../../util/special";
import ClanCard from "./ClanCard";
import PinnedActivity from "./PinnedActivity";
import RaidCards, { Layout } from "./RaidCards";
import ToggleSwitch from "../ToggleSwitch";
import { useState } from "react";
import { useRouter } from 'next/router';

export interface ProfileProps {
  bungieNetProfile: ProfileComponent
}

const Profile = ({ bungieNetProfile }: ProfileProps) => {
  const { membership } = useBungieNextMembership(bungieNetProfile.userInfo)
  const [layout, setLayout] = useState<Layout>(Layout.DotCharts)

  const handleToggle = (buttonState: boolean) => {
    const newState = buttonState ? Layout.RecentActivities : Layout.DotCharts
    setLayout(newState)
  };

  const name = bungieNetProfile.userInfo.bungieGlobalDisplayName ?? bungieNetProfile.userInfo.displayName
  return (
    <main className={styles["main"]}>
      <Head>
        <title>{`${name} | RaidHub`}</title>
      </Head>
      <section className={styles["user-info"]}>
        <UserCard
          userInfo={{ ...membership, ...bungieNetProfile.userInfo }}
          emblemBackgroundPath={bungieNetProfile.emblemBackgroundPath} />

        <div className={styles["ranking-banners"]}>
          <RankingBanner
            icon={"/icons/skull.png"}
            backgroundColor={"#fa6b6bA9"}>
            <span>Clears Rank</span>
            <span className={styles["banner-bold"]}>Challenger #1</span>
            <span>9999</span>
          </RankingBanner>

          <RankingBanner
            icon={"/icons/speed.png"}
            backgroundColor={"#fa6b6bA9"}>
            <span>Speed Rank</span>
            <span className={styles["banner-bold"]}>Challenger #1</span>
            <span>9hr 99m 99s</span>
          </RankingBanner>

          <RankingBanner
            icon={"/icons/diamond.png"}
            backgroundColor={"#4ea2ccA9"}>
            <span>Low-Mans</span>
            <span className={styles["banner-bold"]}>Diamond IV</span>
            <span>69</span>
          </RankingBanner>

          {Object.keys(Founders).includes(bungieNetProfile.userInfo.membershipId) && <div className={styles["ranking-banner"]}>
            <img src="/logo.png" alt="" />

            <div className={styles["banners-text"]}>
              <span className={styles["banner-bold"]}>RaidHub Founder</span>
              <span className={styles["banner-subtext"]}>The user contributed to creating RaidHub</span>
            </div>
          </div>}
        </div>

        <ClanCard info={bungieNetProfile.userInfo} />
      </section>
      <section className={styles["content"]}>
        <div className={styles["mid"]}>
          <PinnedActivity activityId={"4129239230"} />
          <div className={styles["layout-toggle"]}>
            <span>X</span>
            <ToggleSwitch defaultState={!!layout} onToggle={handleToggle} />
            <span>O</span>
          </div>
        </div>
        <RaidCards
          membershipId={bungieNetProfile.userInfo.membershipId}
          membershipType={bungieNetProfile.userInfo.membershipType}
          characterIds={bungieNetProfile.characterIds}
          layout={layout} />
      </section>
    </main>
  );
}

export default Profile;