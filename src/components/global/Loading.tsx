type LoadingProps = {
    wrapperClass: string
}

const Loading = ({ wrapperClass }: LoadingProps) => (
    <div className={["loading-pulse", wrapperClass].join(" ")} />
)

export default Loading
