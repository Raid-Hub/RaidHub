import styles from "~/styles/pages/query.module.css"
import { Role } from "@prisma/client"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { FormEvent, MouseEventHandler, useState } from "react"
import RaidHubTable from "~/components/reusable/RaidHubTable"
import { auth } from "~/server/next-auth"
import { trpc } from "~/util/trpc"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"

export default function AdminQuery({}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const ac = new AbortController()

    const { mutate, data, isSuccess, isLoading, isError, error } =
        trpc.admin.rawSqlQuery.useMutation({
            onError: err => console.error(err),
            trpc: {
                abortOnUnmount: true
            }
        })

    const { value: queryText, save: setQueryText } = useLocalStorage("admin-query-text", "SELECT 1")
    const { value: queryTitle, save: setQueryTitle } = useLocalStorage(
        "admin-query-title",
        "My Table"
    )

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        mutate({ query: queryText })
    }

    const handleExplain: MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault()
        mutate({ query: `EXPLAIN ${queryText}` })
    }

    function DataView() {
        if (isLoading) {
            return <div>Loading...</div>
        }
        if (isError) {
            return (
                <div style={{ color: "red" }}>
                    {error.message === "Query timed out"
                        ? "Please run longer queries resolving in more than 5 seconds locally, thanks!"
                        : error.shape?.message}
                </div>
            )
        }
        if (isSuccess) {
            if (!data.length) {
                return <div>{"No rows :("}</div>
            } else {
                return (
                    <RaidHubTable
                        title={queryTitle}
                        columnLabels={Object.keys(data[0])}
                        rows={data}
                    />
                )
            }
        }
        return null
    }

    return (
        <>
            <Head>
                <title key="title">Admin Query Tool</title>
            </Head>
            <main>
                <form onSubmit={handleSubmit} className={styles["sql-textarea-container"]}>
                    <input
                        value={queryTitle}
                        onChange={e => setQueryTitle(e.target.value)}
                        placeholder="Set a table name"
                    />
                </form>
                <form onSubmit={handleSubmit} className={styles["sql-textarea-container"]}>
                    <textarea
                        placeholder="Enter SQL query here"
                        className={styles["sql-textarea"]}
                        rows={10}
                        cols={50}
                        value={queryText}
                        onChange={e => setQueryText(e.target.value)}
                    />
                    <div>
                        <button type="submit">Submit</button>
                        <button onClick={handleExplain}>Explain</button>
                    </div>
                </form>
                <DataView />
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<{}> = async ctx => {
    const session = await auth(ctx)

    if (session?.user.role !== Role.ADMIN) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    } else {
        return {
            props: {}
        }
    }
}
