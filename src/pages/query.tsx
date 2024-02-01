import { Role } from "@prisma/client"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { MouseEventHandler, useState } from "react"
import { RaidHubTable } from "~/components/reusable/RaidHubTable"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { auth } from "~/server/next-auth"
import styles from "~/styles/pages/query.module.css"
import { trpc } from "~/util/trpc"

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

export default function AdminQuery({}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [isExplaining, setIsExplaining] = useState(false)

    const { mutate, data, isSuccess, isLoading, isError, error } =
        trpc.admin.rawSqlQuery.useMutation({
            onError: err => console.error(err),
            trpc: {
                abortOnUnmount: true
            }
        })
    const handleQuery = (queryText: string) => {
        setIsExplaining(false)
        mutate({ query: queryText })
    }

    const handleExplain = (queryText: string) => {
        setIsExplaining(true)
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
            if (isExplaining) {
                return (
                    <div>
                        <pre>{data.map(d => d["QUERY PLAN"]).join("\n")}</pre>
                    </div>
                )
            }

            if (!data.length) {
                return <div>{"No rows :("}</div>
            } else {
                return <RaidHubTable columnLabels={Object.keys(data[0])} rows={data} />
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
                <SqlInputBoxArea handleQuery={handleQuery} handleExplain={handleExplain} />
                <DataView />
            </main>
        </>
    )
}

function SqlInputBoxArea(props: {
    handleQuery: (query: string) => void
    handleExplain: (query: string) => void
}) {
    const [queryText, setQueryText] = useLocalStorage("admin-query-text", "SELECT 1")

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault()
        props.handleQuery(queryText)
    }

    const handleExplainSubmit: MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault()
        props.handleExplain(queryText)
    }

    return (
        <form className={styles["sql-textarea-container"]}>
            <textarea
                placeholder="Enter SQL query here"
                className={styles["sql-textarea"]}
                rows={10}
                cols={50}
                spellCheck="false"
                value={queryText}
                onChange={e => setQueryText(e.target.value)}
            />
            <div className={styles["submit-btns"]}>
                <button onClick={handleSubmit} type="submit">
                    Submit
                </button>
                <button onClick={handleExplainSubmit} type="submit">
                    Explain
                </button>
            </div>
        </form>
    )
}
