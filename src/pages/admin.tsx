import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth"
import { nextAuthOptions } from "~/server/next-auth"
import { Role } from "@prisma/client"
import AdminPanel from "~/components/admin/AdminPanel"
import Head from "next/head"

export default function Admin({}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <>
            <Head>
                <title key="title">Admin Panel | RaidHub</title>
            </Head>
            <AdminPanel />
        </>
    )
}

export const getServerSideProps: GetServerSideProps<{}> = async ({ req, res }) => {
    const session = await getServerSession(req, res, nextAuthOptions)

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
