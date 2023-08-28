import React, { useEffect } from "react"
import styles from "../../styles/errors.module.css"
import Head from "next/head"
import CustomError from "../../models/errors/CustomError"
import { useLocale } from "../app/LocaleManager"
import { signIn } from "next-auth/react"

type ErrorProps = {
    error: CustomError
    title?: string
}

const ErrorComponent = ({ error, title }: ErrorProps) => {
    const { strings } = useLocale()
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className={styles["modal"]}>
            <Head>{title && <title key="title">{title}</title>}</Head>
            <div className={styles["modal-content"]}>
                <p>{"Error: " + error.message}</p>
                <p>{"Code: " + error.code}</p>
                {error.bungieCode === 1665 /**PlatformErrorCodes.DestinyPrivacyRestriction*/ && (
                    <>
                        <p>{strings.loginToAccess}</p>
                        <button onClick={() => signIn("bungie")}>
                            {strings.logInWith + " Bungie"}
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default ErrorComponent
