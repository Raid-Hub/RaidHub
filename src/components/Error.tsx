import React from 'react';
import styles from '../styles/errors.module.css'

interface ErrorProps {
  message: string
}

const Error = ({ message }: ErrorProps) => (
    <div className={styles["modal"]}>
      <div className={styles["modal-content"]}>
        <p>{"Error: " + message}</p>
      </div>
    </div>
);

export default Error