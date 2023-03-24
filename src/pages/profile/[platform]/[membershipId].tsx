import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Sidebar from '../../../components/profile/Sidebar';
import RaidCards from '../../../components/profile/RaidCards';
import ProfileHeader from '../../../components/profile/ProfileHeader';
import styles from '../../../styles/profile.module.css';

interface ProfileProps {
  membershipType: string
  membershipId: string
}

const Profile = ({ membershipType, membershipId }: ProfileProps) => {
  return (
    <>
      <Header />
      <main className={styles["main"]}>
        <Sidebar />
        <div className={styles["content"]}>
          <div className={styles["card"]}>
            <ProfileHeader />
            <RaidCards />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
export async function getServerSideProps({ params }: { params: { platform: string, membershipId: string } }) {
  const { platform: membershipType, membershipId } = params;
  return { props: { membershipType, membershipId } }
}

export default Profile;