import { NextPage } from "next"

type Custom404Props = { error: string }
const Custom404: NextPage<Custom404Props> = ({ error }) => {
    return (
        <main>
            <h1>
                <span>404 Page not Found</span>
                {error && <span>{` - ${error}`}</span>}
            </h1>
        </main>
    )
}

export default Custom404
