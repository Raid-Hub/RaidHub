import styles from '../../styles/profile.module.css';

interface RaidCardsProps {

}

// 

const RaidCards = ({ }: RaidCardsProps) => {
  return (
    <div className={styles["cards"]}>
      <div className={styles["card-boxes cardone"]}>
        <img className={styles["top-image"]} src="https://www.bungie.net/img/destiny_content/pgcr/raid_kings_fall.jpg" alt="" />

        <div className={styles["card-boxes-content"]}>
          <p className={styles["card-boxes-title"]}>kings fall</p>

          <div className={styles["card-diamonds"]}>
            <div className={styles["diamond diamond1"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Trio Flawless</p>
            </div>

            <div className={styles["diamond"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Duo Master</p>
            </div>
          </div>

          <div className={styles["graph-content"]}>
            <div className={styles["dots-left"]}>
              <div className={styles["dots-container"]}>
                <svg style={{ width: "1000px", minWidth: "100%;" }}>
                  <line x1="0%" y1="50" x2="100%" y2="50"
                    style={{ stroke: "rgb(92, 92, 92)", strokeWidth: "2" }} />
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="10"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="30"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="50"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="70"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="90"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="110"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="130"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="150"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="170"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="190"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="210"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="230"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="250"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="270"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="290"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="310"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="330"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="350"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="370"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="390"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="410"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="430"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="450"
                      cy="60" />
                  </a>
                </svg>
              </div>
            </div>
            <div className={styles["graph-count"]}>
              <div className={styles["graph-number-img"]}>
                <img src="images/Better Diamond.png" alt="" />
                <p className={styles["graph-number"]}>193</p>
              </div>

              <p className={styles["graph-count-text"]}>total clears</p>
            </div>
          </div>


          <div className={styles["timings"]}>
            <div className={styles["fastest timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>fastest</p>
            </div>

            <div className={styles["average timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>Average</p>
            </div>

            <div className={styles["shepas timings-content"]}>
              <p className={styles["timings-number"]}>56</p>
              <p className={styles["timings-subtitle"]}>Sherpa(s)</p>
            </div>
          </div>

          <img className={styles["down-button"]} src="images/Arrow.png" alt="" />
        </div>
      </div>

      <div className={styles["card-boxes cardone"]}>
        <img className={styles["top-image"]} src="images/IMG_8781.jpg" alt="" />

        <div className={styles["card-boxes-content"]}>
          <p className={styles["card-boxes-title"]}>vow of the disciple</p>

          <div className={styles["card-diamonds"]}>
            <div className={styles["diamond diamond1"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Trio Flawless</p>
            </div>

            <div className={styles["diamond"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Duo Master</p>
            </div>
          </div>

          <div className={styles["graph-content"]}>
            <div className={styles["dots-left"]}>
              <div className={styles["dots-container"]}>
                <svg style={{ width: "100px", minWidth: "100%" }}>
                  <line x1="0%" y1="50" x2="100%" y2="50"
                    style={{ stroke: "rgb(92, 92, 92)", strokeWidth: "2" }} />
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="10"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="30"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="50"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="70"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="90"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="110"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="130"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="150"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="170"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="190"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="210"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="230"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="250"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="270"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="290"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="310"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="330"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="350"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="370"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="390"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="410"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="430"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="450"
                      cy="60" />
                  </a>
                </svg>
              </div>
            </div>
            <div className={styles["graph-count"]}>
              <div className={styles["graph-number-img"]}>
                <img src="images/Better Diamond.png" alt="" />
                <p className={styles["graph-number"]}>193</p>
              </div>

              <p className={styles["graph-count-text"]}>total clears</p>
            </div>
          </div>


          <div className={styles["timings"]}>
            <div className={styles["fastest timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>fastest</p>
            </div>

            <div className={styles["average timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>Average</p>
            </div>

            <div className={styles["shepas timings-content"]}>
              <p className={styles["timings-number"]}>56</p>
              <p className={styles["timings-subtitle"]}>Sherpa(s)</p>
            </div>
          </div>

          <img className={styles["down-button"]} src="images/Arrow.png" alt="" />
        </div>
      </div>

      <div className={styles["card-boxes cardone"]}>
        <img className={styles["top-image"]} src="https://www.bungie.net/img/destiny_content/pgcr/vault_of_glass.jpg" alt="" />

        <div className={styles["card-boxes-content"]}>
          <p className={styles["card-boxes-title"]}>vault of glass</p>

          <div className={styles["card-diamonds"]}>
            <div className={styles["diamond diamond1"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Trio Flawless</p>
            </div>

            <div className={styles["diamond"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Duo Master</p>
            </div>
          </div>

          <div className={styles["graph-content"]}>
            <div className={styles["dots-left"]}>
              <div className={styles["dots-container"]}>
                <svg style={{ width: "1000px", minWidth: "100%;" }}>
                  <line x1="0%" y1="50" x2="100%" y2="50"
                    style={{ stroke: "rgb(92, 92, 92)", strokeWidth: "2" }} />
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="10"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="30"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="50"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="70"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="90"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="110"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="130"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="150"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="170"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="190"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="210"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="230"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="250"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="270"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="290"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="310"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="330"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="350"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="370"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="390"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="410"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="430"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="450"
                      cy="60" />
                  </a>
                </svg>
              </div>
            </div>
            <div className={styles["graph-count"]}>
              <div className={styles["graph-number-img"]}>
                <img src="images/Better Diamond.png" alt="" />
                <p className={styles["graph-number"]}>193</p>
              </div>

              <p className={styles["graph-count-text"]}>total clears</p>
            </div>
          </div>

          <div className={styles["timings"]}>
            <div className={styles["fastest timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>fastest</p>
            </div>

            <div className={styles["average timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>Average</p>
            </div>

            <div className={styles["shepas timings-content"]}>
              <p className={styles["timings-number"]}>56</p>
              <p className={styles["timings-subtitle"]}>Sherpa(s)</p>
            </div>
          </div>

          <img className={styles["down-button"]} src="images/Arrow.png" alt="" />
        </div>
      </div>

      <div className={styles["card-boxes cardone"]}>
        <img className={styles["top-image"]}
          src="https://www.bungie.net/img/destiny_content/pgcr/europa-raid-deep-stone-crypt.jpg" alt="" />

        <div className={styles["card-boxes-content"]}>
          <p className={styles["card-boxes-title"]}>deep stone crypt</p>

          <div className={styles["card-diamonds"]}>
            <div className={styles["diamond diamond1"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Trio Flawless</p>
            </div>

            <div className={styles["diamond"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Duo Master</p>
            </div>
          </div>

          <div className={styles["graph-content"]}>
            <div className={styles["dots-left"]}>
              <div className={styles["dots-container"]}>
                <svg style={{ width: "1000px", minWidth: "100%;" }}>
                  <line x1="0%" y1="50" x2="100%" y2="50"
                    style={{ stroke: "rgb(92, 92, 92)", strokeWidth: "2" }} />
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="10"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="30"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="50"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="70"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="90"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="110"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="130"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="150"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="170"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="190"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="210"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="230"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="250"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="270"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="290"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="310"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="330"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="350"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="370"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="390"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="410"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="430"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="450"
                      cy="60" />
                  </a>
                </svg>
              </div>
            </div>
            <div className={styles["graph-count"]}>
              <div className={styles["graph-number-img"]}>
                <img src="images/Better Diamond.png" alt="" />
                <p className={styles["graph-number"]}>193</p>
              </div>

              <p className={styles["graph-count-text"]}>total clears</p>
            </div>
          </div>


          <div className={styles["timings"]}>
            <div className={styles["fastest timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>fastest</p>
            </div>

            <div className={styles["average timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>Average</p>
            </div>

            <div className={styles["shepas timings-content"]}>
              <p className={styles["timings-number"]}>56</p>
              <p className={styles["timings-subtitle"]}>Sherpa(s)</p>
            </div>
          </div>

          <img className={styles["down-button"]} src="images/Arrow.png" alt="" />
        </div>
      </div>

      <div className={styles["card-boxes cardone"]}>
        <img className={styles["top-image"]}
          src="https://www.bungie.net/img/destiny_content/pgcr/raid_garden_of_salvation.jpg" alt="" />

        <div className={styles["card-boxes-content"]}>
          <p className={styles["card-boxes-title"]}>garden of salvation</p>

          <div className={styles["card-diamonds"]}>
            <div className={styles["diamond diamond1"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Trio Flawless</p>
            </div>

            <div className={styles["diamond"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Duo Master</p>
            </div>
          </div>

          <div className={styles["graph-content"]}>
            <div className={styles["dots-left"]}>
              <div className={styles["dots-container"]}>

                <svg style={{ width: "1000px", minWidth: "100%;" }}>
                  <line x1="0%" y1="50" x2="100%" y2="50"
                    style={{ stroke: "rgb(92, 92, 92)", strokeWidth: "2" }} />
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="10"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="30"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="50"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="70"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="90"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="110"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="130"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="150"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="170"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="190"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="210"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="230"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="250"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="270"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="290"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="310"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="330"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="350"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="370"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="390"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="410"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="430"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="450"
                      cy="60" />
                  </a>
                </svg>
              </div>
            </div>
            <div className={styles["graph-count"]}>
              <div className={styles["graph-number-img"]}>
                <img src="images/Better Diamond.png" alt="" />
                <p className={styles["graph-number"]}>193</p>
              </div>

              <p className={styles["graph-count-text"]}>total clears</p>
            </div>
          </div>


          <div className={styles["timings"]}>
            <div className={styles["fastest timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>fastest</p>
            </div>

            <div className={styles["average timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>Average</p>
            </div>

            <div className={styles["shepas timings-content"]}>
              <p className={styles["timings-number"]}>56</p>
              <p className={styles["timings-subtitle"]}>Sherpa(s)</p>
            </div>
          </div>

          <img className={styles["down-button"]} src="images/Arrow.png" alt="" />
        </div>
      </div>

      <div className={styles["card-boxes cardone"]}>
        <img className={styles["top-image"]} src="https://www.bungie.net/img/destiny_content/pgcr/raid_beanstalk.jpg" alt="" />

        <div className={styles["card-boxes-content"]}>
          <p className={styles["card-boxes-title"]}>last wish</p>

          <div className={styles["card-diamonds"]}>
            <div className={styles["diamond diamond1"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Trio Flawless</p>
            </div>

            <div className={styles["diamond"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Duo Master</p>
            </div>
          </div>

          <div className={styles["graph-content"]}>
            <div className={styles["dots-left"]}>
              <div className={styles["dots-container"]}>
                <svg style={{ width: "1000px", minWidth: "100%;" }}>
                  <line x1="0%" y1="50" x2="100%" y2="50"
                    style={{ stroke: "rgb(92, 92, 92)", strokeWidth: "2" }} />
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="10"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="30"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="50"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="70"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="90"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="110"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="130"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="150"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="170"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="190"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="210"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="230"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="250"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="270"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="290"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="310"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="330"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="350"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="370"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="390"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="410"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="430"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="450"
                      cy="60" />
                  </a>
                </svg>
              </div>
            </div>
            <div className={styles["graph-count"]}>
              <div className={styles["graph-number-img"]}>
                <img src="images/Better Diamond.png" alt="" />
                <p className={styles["graph-number"]}>193</p>
              </div>

              <p className={styles["graph-count-text"]}>total clears</p>
            </div>
          </div>


          <div className={styles["timings"]}>
            <div className={styles["fastest timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>fastest</p>
            </div>

            <div className={styles["average timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>Average</p>
            </div>

            <div className={styles["shepas timings-content"]}>
              <p className={styles["timings-number"]}>56</p>
              <p className={styles["timings-subtitle"]}>Sherpa(s)</p>
            </div>
          </div>

          <img className={styles["down-button"]} src="images/Arrow.png" alt="" />
        </div>
      </div>

      <div className={styles["card-boxes cardone"]}>
        <img className={styles["top-image"]} src="https://www.bungie.net/img/destiny_content/pgcr/raid_eclipse.jpg" alt="" />

        <div className={styles["card-boxes-content"]}>
          <p className={styles["card-boxes-title"]}>crown of sorrow</p>

          <div className={styles["card-diamonds"]}>
            <div className={styles["diamond diamond1"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Trio Flawless</p>
            </div>

            <div className={styles["diamond"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Duo Master</p>
            </div>
          </div>

          <div className={styles["graph-content"]}>
            <div className={styles["dots-left"]}>
              <div className={styles["dots-container"]}>
                <svg style={{ width: "1000px", minWidth: "100%;" }}>
                  <line x1="0%" y1="50" x2="100%" y2="50"
                    style={{ stroke: "rgb(92, 92, 92)", strokeWidth: "2" }} />
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="10"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="30"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="50"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="70"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="90"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="110"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="130"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="150"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="170"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="190"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="210"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="230"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="250"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="270"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="290"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="310"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="330"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="350"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="370"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="390"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="410"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="430"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="450"
                      cy="60" />
                  </a>
                </svg>
              </div>
            </div>
            <div className={styles["graph-count"]}>
              <div className={styles["graph-number-img"]}>
                <img src="images/Better Diamond.png" alt="" />
                <p className={styles["graph-number"]}>193</p>
              </div>

              <p className={styles["graph-count-text"]}>total clears</p>
            </div>
          </div>


          <div className={styles["timings"]}>
            <div className={styles["fastest timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>fastest</p>
            </div>

            <div className={styles["average timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>Average</p>
            </div>

            <div className={styles["shepas timings-content"]}>
              <p className={styles["timings-number"]}>56</p>
              <p className={styles["timings-subtitle"]}>Sherpa(s)</p>
            </div>
          </div>
          <img className={styles["down-button"]} src="images/Arrow.png" alt="" />
        </div>
      </div>

      <div className={styles["card-boxes cardone"]}>
        <img className={styles["top-image"]}
          src="https://www.bungie.net/img/destiny_content/pgcr/raids.1305rh0093145r13t5hn10tnz.raid_sunset.jpg"
          alt="" />

        <div className={styles["card-boxes-content"]}>
          <p className={styles["card-boxes-title"]}>scourge of the past</p>

          <div className={styles["card-diamonds"]}>
            <div className={styles["diamond diamond1"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Trio Flawless</p>
            </div>

            <div className={styles["diamond"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Duo Master</p>
            </div>
          </div>

          <div className={styles["graph-content"]}>
            <div className={styles["dots-left"]}>
              <div className={styles["dots-container"]}>
                <svg style={{ width: "1000px", minWidth: "100%;" }}>
                  <line x1="0%" y1="50" x2="100%" y2="50"
                    style={{ stroke: "rgb(92, 92, 92)", strokeWidth: "2" }} />
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="10"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="30"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="50"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="70"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="90"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="110"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="130"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="150"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="170"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="190"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="210"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="230"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="250"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="270"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="290"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="310"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="330"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="350"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="370"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="390"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="410"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="430"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="450"
                      cy="60" />
                  </a>
                </svg>
              </div>
            </div>
            <div className={styles["graph-count"]}>
              <div className={styles["graph-number-img"]}>
                <img src="images/Better Diamond.png" alt="" />
                <p className={styles["graph-number"]}>193</p>
              </div>

              <p className={styles["graph-count-text"]}>total clears</p>
            </div>
          </div>


          <div className={styles["timings"]}>
            <div className={styles["fastest timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>fastest</p>
            </div>

            <div className={styles["average timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>Average</p>
            </div>

            <div className={styles["shepas timings-content"]}>
              <p className={styles["timings-number"]}>56</p>
              <p className={styles["timings-subtitle"]}>Sherpa(s)</p>
            </div>
          </div>
          <img className={styles["down-button"]} src="images/Arrow.png" alt="" />
        </div>
      </div>

      <div className={styles["card-boxes cardone"]}>
        <img className={styles["top-image"]} src="https://www.bungie.net/img/destiny_content/pgcr/raid_greed.jpg" alt="" />

        <div className={styles["card-boxes-content"]}>
          <p className={styles["card-boxes-title"]}>Spire of Stars</p>

          <div className={styles["card-diamonds"]}>
            <div className={styles["diamond diamond1"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Trio Flawless</p>
            </div>

            <div className={styles["diamond"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Duo Master</p>
            </div>
          </div>

          <div className={styles["graph-content"]}>
            <div className={styles["dots-left"]}>
              <div className={styles["dots-container"]}>
                <svg style={{ width: "1000px", minWidth: "100%;" }}>
                  <line x1="0%" y1="50" x2="100%" y2="50"
                    style={{ stroke: "rgb(92, 92, 92)", strokeWidth: "2" }} />
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="10"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="30"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="50"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="70"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="90"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="110"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="130"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="150"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="170"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="190"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="210"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="230"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="250"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="270"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="290"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="310"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="330"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="350"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="370"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="390"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="410"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="430"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="450"
                      cy="60" />
                  </a>
                </svg>
              </div>
            </div>
            <div className={styles["graph-count"]}>
              <div className={styles["graph-number-img"]}>
                <img src="images/Better Diamond.png" alt="" />
                <p className={styles["graph-number"]}>193</p>
              </div>

              <p className={styles["graph-count-text"]}>total clears</p>
            </div>
          </div>


          <div className={styles["timings"]}>
            <div className={styles["fastest timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>fastest</p>
            </div>

            <div className={styles["average timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>Average</p>
            </div>

            <div className={styles["shepas timings-content"]}>
              <p className={styles["timings-number"]}>56</p>
              <p className={styles["timings-subtitle"]}>Sherpa(s)</p>
            </div>
          </div>
          <img className={styles["down-button"]} src="images/Arrow.png" alt="" />
        </div>
      </div>

      <div className={styles["card-boxes cardone"]}>
        <img className={styles["top-image"]}
          src="https://www.bungie.net/img/destiny_content/pgcr/raids_leviathan_eater_of_worlds.jpg" alt="" />

        <div className={styles["card-boxes-content"]}>
          <p className={styles["card-boxes-title"]}>eater of worlds</p>

          <div className={styles["card-diamonds"]}>
            <div className={styles["diamond diamond1"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Trio Flawless</p>
            </div>

            <div className={styles["diamond"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Duo Master</p>
            </div>
          </div>

          <div className={styles["graph-content"]}>
            <div className={styles["dots-left"]}>
              <div className={styles["dots-container"]}>
                <svg style={{ width: "1000px", minWidth: "100%;" }}>
                  <line x1="0%" y1="50" x2="100%" y2="50"
                    style={{ stroke: "rgb(92, 92, 92)", strokeWidth: "2" }} />
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="10"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="30"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="50"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="70"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="90"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="110"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="130"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="150"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="170"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="190"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="210"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="230"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="250"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="270"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="290"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="310"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="330"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="350"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="370"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="390"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="410"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="430"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="450"
                      cy="60" />
                  </a>
                </svg>
              </div>
            </div>
            <div className={styles["graph-count"]}>
              <div className={styles["graph-number-img"]}>
                <img src="images/Better Diamond.png" alt="" />
                <p className={styles["graph-number"]}>193</p>
              </div>

              <p className={styles["graph-count-text"]}>total clears</p>
            </div>
          </div>


          <div className={styles["timings"]}>
            <div className={styles["fastest timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>fastest</p>
            </div>

            <div className={styles["average timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>Average</p>
            </div>

            <div className={styles["shepas timings-content"]}>
              <p className={styles["timings-number"]}>56</p>
              <p className={styles["timings-subtitle"]}>Sherpa(s)</p>
            </div>
          </div>
          <img className={styles["down-button"]} src="images/Arrow.png" alt="" />
        </div>
      </div>

      <div className={styles["card-boxes cardone"]}>
        <img className={styles["top-image"]} src="https://www.bungie.net/img/destiny_content/pgcr/raid_gluttony.jpg" alt="" />

        <div className={styles["card-boxes-content"]}>
          <p className={styles["card-boxes-title"]}>leviathan</p>

          <div className={styles["card-diamonds"]}>
            <div className={styles["diamond diamond1"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Trio Flawless</p>
            </div>

            <div className={styles["diamond"]}>
              <img src="images/Diamond.png" alt="" />
              <p>Duo Master</p>
            </div>
          </div>

          <div className={styles["graph-content"]}>
            <div className={styles["dots-left"]}>
              <div className={styles["dots-container"]}>
                <svg style={{ width: "1000px", minWidth: "100%;" }}>
                  <line x1="0%" y1="50" x2="100%" y2="50"
                    style={{ stroke: "rgb(92, 92, 92)", strokeWidth: "2" }} />
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="10"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="30"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="50"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="70"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="90"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="110"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="130"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="150"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="170"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="190"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="210"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="230"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="250"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="270"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="290"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="310"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="330"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="350"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="370"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="390"
                      cy="60" />
                  </a>

                  <a className={styles["dot dot-hover"]} aria-describedby="tooltip1">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="410"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#F44336" fill-opacity="0.9783869573466908" r="5.5" cx="430"
                      cy="50" />
                  </a>
                  <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
                    <circle fill="#4CAF50" fill-opacity="0.9783869573466908" r="5.5" cx="450"
                      cy="60" />
                  </a>
                </svg>
              </div>
            </div>
            <div className={styles["graph-count"]}>
              <div className={styles["graph-number-img"]}>
                <img src="images/Better Diamond.png" alt="" />
                <p className={styles["graph-number"]}>193</p>
              </div>

              <p className={styles["graph-count-text"]}>total clears</p>
            </div>
          </div>


          <div className={styles["timings"]}>
            <div className={styles["fastest timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>fastest</p>
            </div>

            <div className={styles["average timings-content"]}>
              <p className={styles["timings-number"]}>14m 41s</p>
              <p className={styles["timings-subtitle"]}>Average</p>
            </div>

            <div className={styles["shepas timings-content"]}>
              <p className={styles["timings-number"]}>56</p>
              <p className={styles["timings-subtitle"]}>Sherpa(s)</p>
            </div>
          </div>
          <img className={styles["down-button"]} src="images/Arrow.png" alt="" />
        </div>
      </div>
    </div>
  )
}

export default RaidCards;