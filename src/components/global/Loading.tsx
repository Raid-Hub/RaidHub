const Loading = ({ className }: { className: string }) => (
    <div className={["loading-pulse", className].join(" ")} />
)

export default Loading
