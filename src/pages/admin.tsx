import { Role } from "@prisma/client"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { auth } from "~/app/api/auth"
import AdminPanel from "~/components/admin/AdminPanel"

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
