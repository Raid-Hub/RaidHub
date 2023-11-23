import styles from "../../styles/toolbox.module.css"
import ToolboxItem from "~/components/toolbox/ToolboxItem"
import ToolBoxIcon from "~/images/icons/ToolBoxIcon"
import { useEffect, useState } from "react"
import XSymbol from "~/images/icons/xSymbol"
import { m, AnimatePresence } from "framer-motion"

const Toolbox = (props: { isFooterVisible: boolean }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (!screen.orientation.type.includes("portrait")) {
            setIsVisible(true)
        }
    }, [])

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    return isVisible ? (
        <div
            className={
                props.isFooterVisible
                    ? [styles["toolbox"], styles["footer-spacing"]].join(" ")
                    : styles["toolbox"]
            }>
            <AnimatePresence>
                {isOpen && (
                    <m.div
                        className={styles["toolbox-item-container"]}
                        initial={{ x: 20, opacity: 0 }}
                        exit={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}>
                        <ToolboxItem
                            path={"/find"}
                            text={"Activity finder"}
                            onClick={handleClick}
                        />
                        <ToolboxItem
                            path={"/guardians"}
                            text={"Guardian Inspector"}
                            onClick={handleClick}
                        />
                    </m.div>
                )}
            </AnimatePresence>
            <button className={styles["toolbox-button"]} onClick={handleClick}>
                {!isOpen && <ToolBoxIcon className={styles["toolbox-icon"]} />}
                {isOpen && <XSymbol className={styles["toolbox-closed-icon"]} />}
            </button>
        </div>
    ) : null
}
export default Toolbox
