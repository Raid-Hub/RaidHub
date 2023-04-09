import RaidCards from '../../../components/profile/RaidCards';
import PinnedActivity from '../../../components/profile/PinnedActivity';
import styles from '../../../styles/profile.module.css';
import { shared as bungieClient } from '../../../util/http/bungie';
import { BungieMembershipType } from 'oodestiny/schemas';
import Head from 'next/head'
import { ProfileComponent } from '../../../util/types';
import UserCard from '../../../components/profile/UserCard';
import RankingBanner from '../../../components/profile/RankingBanner';
import ClanCard from '../../../components/profile/ClanCard';
import { Founders } from '../../../util/special';
import { useBungieNextMembership } from '../../../hooks/bungieNextMembership';

interface ProfileProps {
  bungieNetProfile: ProfileComponent | null
  error: string
}

const Profile = ({ bungieNetProfile, error }: ProfileProps) => {
  const { membership } = useBungieNextMembership(bungieNetProfile?.userInfo)
  if (error || !bungieNetProfile) return
  const name = bungieNetProfile.userInfo.bungieGlobalDisplayName ?? bungieNetProfile.userInfo.displayName
  return (
    <main className={styles["main"]}>
      <Head>
        <title>{name + " | RaidHub"}</title>
      </Head>
      <section className={styles["user-info"]}>
        <UserCard
          userInfo={{ ...membership, ...bungieNetProfile.userInfo }}
          emblemBackgroundPath={bungieNetProfile.emblemBackgroundPath} />

        <div className={styles["ranking-banners"]}>
          <RankingBanner
            icon={"/icons/skull.png"}
            backgroundColor={"#fa6b6b"}>
            <span>Clears Rank</span>
            <span className={styles["banner-bold"]}>Challenger #1</span>
            <span>9999</span>
          </RankingBanner>

          <RankingBanner
            icon={"/icons/speed.png"}
            backgroundColor={"#fa6b6b"}>
            <span>Speed Rank</span>
            <span className={styles["banner-bold"]}>Challenger #1</span>
            <span>9hr 99m 99s</span>
          </RankingBanner>

          <RankingBanner
            icon={"/icons/diamond.png"}
            backgroundColor={"#4ea2cc"}>
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
        <PinnedActivity activityId={"12685770593"} />
        <RaidCards
          membershipId={bungieNetProfile.userInfo.membershipId}
          membershipType={bungieNetProfile.userInfo.membershipType}
          characterIds={bungieNetProfile.characterIds} />
      </section>
    </main>
  );
}

export async function getServerSideProps({ params }: { params: { platform: string, membershipId: string } }): Promise<{ props: ProfileProps }> {
  const { platform: membershipType, membershipId } = params;
  const profile = await bungieClient.getProfile(membershipId, membershipType as unknown as BungieMembershipType)
  return { props: { bungieNetProfile: profile.success ?? null, error: profile.error?.message ?? "" } }
}

export default Profile;