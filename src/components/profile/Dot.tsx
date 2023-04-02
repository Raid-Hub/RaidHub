import styles from '../../styles/profile.module.css';

interface DotProps {
    cx: number
}

const Dot = ({ cx }: DotProps) => {
    const cy = 50
    return (
        <a className={styles["dot dot-hover"]} aria-describedby="dot-hover-tooltip">
            <circle fill="#F44336" fill-opacity="0.9783869573466908" r={5.5} cx={cx}
                cy={cy} />
        </a>
    )
}

export default Dot;