import { NextPage } from "next"
import Home from "../components/home/Home"
import { useEffect } from "react"

export const HomePage: NextPage<{}> = () => {
    useEffect(() => {
        console.log("mount home")
        return () => console.log("unmount home")
    }, [])

    return <Home />
}

export default HomePage
