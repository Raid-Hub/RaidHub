import React, { useEffect } from "react"
import styles from "../../styles/errors.module.css"
import Head from "next/head"
import CustomError from "../../models/errors/CustomError"

type ErrorProps = {
    error: CustomError
    title?: string
}

const ErrorComponent = ({ error, title }: ErrorProps) => {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className={styles["modal"]}>
            <Head>{title && <title>title</title>}</Head>
            <div className={styles["modal-content"]}>
                <p>{"Error: " + error.message}</p>
                <p>{"Code: " + error.code}</p>
            </div>
        </div>
    )
}

export default ErrorComponent
