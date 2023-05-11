import React from "react"
import styles from "../styles/errors.module.css"
import Head from "next/head"
import CustomError from "../models/errors/CustomError"

type ErrorProps = {
    error: CustomError
    title: string
}

const ErrorComponent = ({ error, title }: ErrorProps) => {
    console.error(error)

    const code = error.code
    return (
        <div className={styles["modal"]}>
            <Head>
                <title>{title}</title>
            </Head>
            <div className={styles["modal-content"]}>
                <p>{error.toString()}</p>
                {code && <p className={styles["stack-trace"]}>{`Code: ${code}`}</p>}
            </div>
        </div>
    )
}

export default ErrorComponent
