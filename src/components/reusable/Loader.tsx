import styles from "~/styles/reusable-components/loader.module.css"

export default function Loader({ stroke }: { stroke: number }) {
    return <div className={styles["loader"]} style={{ "--stroke": `${stroke}px` } as {}} />
}
