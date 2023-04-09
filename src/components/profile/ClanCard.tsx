
import { UserInfoCard } from 'oodestiny/schemas';
import { useClan } from '../../hooks/clan';
import styles from '../../styles/profile.module.css';
import Loading from '../Loading';
import ClanBanner from './ClanBanner';

type ClanCardProps = {
    info: UserInfoCard
}

const ClanCard = ({ info }: ClanCardProps) => {
    const { clan, isLoading: isClanLoading } = useClan(info)
    return (
        <div className={styles["clan"]}>
            {isClanLoading
                ? <div className={styles["clan-img"]}><Loading /></div>
                : <ClanBanner data={clan!.clanBanner} />
            }

            <div className={styles["clan-desc"]}>
                <span className={styles["desc-title"]}>{clan?.name.replace(/[ㅤ ㅤ]/g, "").trim() + ` [${clan?.clanInfo.clanCallsign}]`}</span>
                <span className={styles["desc-subtitle"]}>{clan?.motto}</span>
                <p className={styles["desc-text"]}>{clan?.about}</p>

                <div className={styles["description-list"]}>

                    <div className={styles["description-list-item"]}>
                        <img src="/icons/diamond.png" alt="" />
                        <p>Raid Clears <span>x999</span></p>
                    </div>

                    <div className={styles["description-list-item"]}>
                        <img src="/icons/diamond.png" alt="" />
                        <p>Solos <span>x999</span></p>
                    </div>

                    <div className={styles["description-list-item"]}>
                        <img src="/icons/diamond.png" alt="" />
                        <p>Flawless Masters <span>x999</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClanCard;
