import React from 'react';
import styles from "../styles/header.module.css"

export class Header extends React.Component {
  render() {
    return (
      <header>
        <nav id={styles.nav}>
            <div id={styles.logo}>
                <img id={styles["logo-img"]} src="/logo.png" alt="logo"/>
                <p id={styles["logo-text"]}>raid hub</p>
            </div>
            <div id={styles["right-content"]}>
                <img id={styles["search-img"]} src="/icons/search.png" alt="search"/>
                <input id={styles["search-bar"]} type="text" placeholder="Search for a Guardian"/>
                <img id={styles["profile-img"]} src="/icons/profile-icon.png" alt="profile"/>
            </div>
        </nav>
      </header>
    )
  }
}
