import React from "react"
import styles from "../styles/errors.module.css"

type ErrorProps = {
    error: Error
}

const ErrorComponent = ({ error }: ErrorProps) => (
    <div className={styles["modal"]}>
        <div className={styles["modal-content"]}>
            {error.message ? <p>{"Error: " + error.message}</p> : <p>{error.toString()}</p>}
        </div>
    </div>
)

export default ErrorComponent
