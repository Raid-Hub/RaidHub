import React from "react"
import styles from "../../styles/errors.module.css"
import Head from "next/head"

type ErrorProps = {
    error: Error
    title?: string
}

const ErrorComponent = ({ error, title }: ErrorProps) => (
    <div className={styles["modal"]}>
        <Head>{title && <title>title</title>}</Head>
        <div className={styles["modal-content"]}>
            {error.message ? <p>{"Error: " + error.message}</p> : <p>{error.toString()}</p>}
        </div>
    </div>
)

export default ErrorComponent
