import Sidebar from '../../../components/profile/Sidebar';
import RaidCards from '../../../components/profile/RaidCards';
import ProfileHeader from '../../../components/profile/ProfileHeader';
import styles from '../../../styles/profile.module.css';
import { shared as bungieClient } from '../../../util/bungie-client';
import { BungieMembershipType, DestinyProfileComponent } from 'oodestiny/schemas';
import Head from 'next/head'

interface ProfileProps {
  profile: DestinyProfileComponent | string
}

const Profile = ({ profile }: ProfileProps) => {
  if (typeof profile === "string") {
    // invalid profile
  } else {
    const name = profile.userInfo.bungieGlobalDisplayName ?? profile.userInfo.displayName
    return (
      <main className={styles["main"]}>
        <Head>
          <title>{name} | RaidHub</title>
        </Head>
        <Sidebar />
        <div className={styles["content"]}> 
          <ProfileHeader />
          <RaidCards />
        </div>
      </main>
    );
  }
}
export async function getServerSideProps({ params }: { params: { platform: string, membershipId: string } }) {
  const { platform: membershipType, membershipId } = params;
  const profile = await bungieClient.getProfile(membershipId, membershipType as unknown as BungieMembershipType)
  return { props: { profile: profile.success ?? profile.error!.message } }
}

export default Profile;