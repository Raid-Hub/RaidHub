import styles from '../../styles/profile.module.css';
import Dot from './Dot';

interface RaidCardsProps {

}

// 

const RaidCards = ({ }: RaidCardsProps) => {
  const cards = new Array(10).fill(undefined)
  return (
    <div className={styles["cards"]}>
      {cards.map(card => <RaidCard

      />)}
    </div>
  )
}

interface RaidCardProps {

}

const RaidCard = ({ }: RaidCardProps) => {
  const dots = new Array(200).fill(undefined)
  return (
    <div className={styles["raid-card"]}>
      <div className={styles["raid-card-img-container"]}>
        <img className={styles["top-image"]} src="https://www.bungie.net/img/destiny_content/pgcr/raid_kings_fall.jpg" alt="" />
        <div className={styles["img-overlay"]}>
          <span className={styles["raid-card-title"]}>kings fall</span>
          <div className={styles["card-diamonds"]}>
            <div className={styles["diamond"]}>
              <img src="/icons/flawless_diamond.png" alt="" />
              <p>Trio Flawless</p>
            </div>
            <div className={styles["diamond"]}>
              <img src="/icons/flawless_diamond.png" alt="" />
              <p>Duo Master</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["raid-card-content"]}>
        <div className={styles["graph-content"]}>
          <div className={styles["dots-container"]}>
            <svg style={{ width: 20 * dots.length + "px", minWidth: "100%;" }}>
              <line x1="0%" y1="50" x2="100%" y2="50"
                style={{ stroke: "rgb(92, 92, 92)", strokeWidth: "2" }} />
              {dots.map((dot, idx) => <Dot cx={20 * idx + 10} />)}
            </svg>
          </div>
          <div className={styles["graph-count"]}>
            <div className={styles["graph-number-img"]}>
              <p className={styles["graph-number"]}>193</p>
            </div>

            <p className={styles["graph-count-text"]}>total clears</p>
          </div>
        </div>


        <div className={styles["timings"]}>
          <div className={styles["timing"]}>
            <p className={styles["timings-number"]}>14m 41s</p>
            <p className={styles["timings-subtitle"]}>fastest</p>
          </div>

          <div className={styles["timing"]}>
            <p className={styles["timings-number"]}>14m 41s</p>
            <p className={styles["timings-subtitle"]}>Average</p>
          </div>

          <div className={styles["timing"]}>
            <p className={styles["timings-number"]}>56</p>
            <p className={styles["timings-subtitle"]}>Sherpas</p>
          </div>
        </div>
      </div>
    </div>
  )
}



export default RaidCards;