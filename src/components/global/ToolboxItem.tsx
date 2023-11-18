import Link from "next/link";
import styles from "../../styles/toolbox.module.css"

const ToolboxItem = (props : {path : string, text : string}) => {
    return (
        <Link href={props.path} className={styles["toolbox-item"]}>
            {props.text}
        </Link>
    )
}

export default ToolboxItem