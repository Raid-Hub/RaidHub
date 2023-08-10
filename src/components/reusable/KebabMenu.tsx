import { ReactNode, useState } from "react"
import styles from "../../styles/reusable-components.module.css"
import { AnimatePresence, motion } from "framer-motion"

const KebabMenu = ({
    size,
    alignmentSide,
    children
}: {
    size: number
    alignmentSide: "left" | "right"
    children: ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const handleClick = (event: React.MouseEvent<SVGElement>) => {
        setIsOpen(old => !old)
    }

    const radius = `${size / 8}px`
    const height = `${size / 2}px`
    const width = `${size}px`
    const padding = `${size / 10}px`
    return (
        <div className={styles["kebab-menu"]} style={{ padding }}>
            <svg
                height={height}
                width={width}
                xmlns="http://www.w3.org/2000/svg"
                onClick={handleClick}>
                <g>
                    <circle r={radius} cx="18%" cy="50%" />
                    <circle r={radius} cx="50%" cy="50%" />
                    <circle r={radius} cx="82%" cy="50%" />
                </g>
            </svg>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles["kebab-menu-dropdown"]}
                        style={{ [alignmentSide]: 0, top: `${size * 0.5}px` }}
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, spring: 0.2 }}>
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default KebabMenu
