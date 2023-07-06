import styles from "../../../styles/profile.module.css"
import Loading from "../../global/Loading"

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
            {!isLoading ? (
                <p
                    className={
                        extraLarge ? styles["timings-number-large"] : styles["timings-number"]
                    }>
                    {href ? <a href={href}>{displayValue}</a> : displayValue}
                </p>
            ) : (
                <div className={styles["number-loading"]}>
                    <Loading />
                </div>
            )}
            <p className={styles["timings-subtitle"]}>{name}</p>
        </div>
    )
}

export default BigNumberStatItem
