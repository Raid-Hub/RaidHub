import { NextPage } from "next"

type Custom404Props = { error: string }

export const Custom404: NextPage<Custom404Props> = ({ error }) => {
    return <h1>{`404 - ${error}`}</h1>
}

export default Custom404
