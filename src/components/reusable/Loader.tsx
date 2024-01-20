import styles from "~/styles/reusable-components/loader.module.css"

export default function Loader({ stroke, size }: { stroke: number; size: string }) {
    return (
        <div
            style={{
                height: size,
                width: size,
                aspectRatio: "1/1",
                padding: `${stroke}px`,
                position: "relative"
            }}>
            <div className={styles["loader"]} style={{ "--stroke": `${stroke}px` } as {}} />
        </div>
    )
}
