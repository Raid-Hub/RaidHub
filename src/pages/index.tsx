import { NextPage } from "next"
import Head from "next/head"
import Home from "../components/home/Home"

export const HomePage: NextPage<{}> = () => (
    <>
        <Head>
            <title key="title">Raid Hub</title>
        </Head>
        <Home />
    </>
)

export default HomePage
