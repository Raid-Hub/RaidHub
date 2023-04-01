import Sidebar from '../../../components/profile/Sidebar';
import RaidCards from '../../../components/profile/RaidCards';
import ProfileHeader from '../../../components/profile/ProfileHeader';
import styles from '../../../styles/profile.module.css';
import { shared as bungieClient } from '../../../util/bungie-client';
import { BungieMembershipType, DestinyProfileComponent } from 'oodestiny/schemas';

interface ProfileProps {
  profile: DestinyProfileComponent | string
}

const Profile = ({ profile }: ProfileProps) => {
  return (
    <main className={styles["main"]}>
      <Sidebar />
      <div className={styles["content"]}>
        <div className={styles["card"]}>
          <ProfileHeader />
          <RaidCards />
        </div>
      </div>
    </main>
  );
}
export async function getServerSideProps({ params }: { params: { platform: string, membershipId: string } }) {
  const { platform: membershipType, membershipId } = params;
  const profile = await bungieClient.getProfile(membershipId, membershipType as unknown as BungieMembershipType)
  return { props: { profile: profile.success ?? profile.error!.message } }
}

export default Profile;