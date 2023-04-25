import React from "react"
import styles from "../styles/errors.module.css"

type ErrorProps = {
    message: string
}

const ErrorComponent = ({ message }: ErrorProps) => (
    <div className={styles["modal"]}>
        <div className={styles["modal-content"]}>
            <p>{"Error: " + message}</p>
        </div>
    </div>
)

export default ErrorComponent
