import React, { FC } from 'react';
import styles from '../styles/errors.module.css'

const Error: FC<{ message: string }> = ({ message }) => (
    <div className={styles["modal"]}>
      <div className={styles["modal-content"]}>
        <p>{"Error: " + message}</p>
      </div>
    </div>
);

export default Error