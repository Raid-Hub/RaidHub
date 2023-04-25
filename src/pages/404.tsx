type Custom404Props = { error: string }
export const Custom404 = ({ error }: Custom404Props) => {
    return <h1>{`404 - ${error}`}</h1>
}

export default Custom404
