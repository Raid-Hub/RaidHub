import Link from "next/link"
import Loading from "../../../components/Loading"
import styles from "../../../styles/pages/profile/raids.module.css"

type BigNumberStatProps = {
    isLoading: boolean
    name: string
    displayValue: string | number
    extraLarge?: boolean
    href?: string
}

const BigNumberStatItem = ({
    isLoading,
    displayValue,
    name,
    extraLarge,
    href
}: BigNumberStatProps) => {
    return (
        <div className={styles["timing"]}>
            {isLoading ? (
                <Loading className={styles["number-loading"]} />
            ) : (
                <p
                    className={
                        extraLarge ? styles["timings-number-large"] : styles["timings-number"]
                    }>
                    {href ? <Link href={href}>{displayValue}</Link> : displayValue}
                </p>
            )}
            <p className={styles["timings-subtitle"]}>{name}</p>
        </div>
    )
}

export default BigNumberStatItem
