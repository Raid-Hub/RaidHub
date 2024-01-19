import Link from "next/link"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"

export function HeaderBanner() {
    const [dismissedBanner, setDismissedBanner] = useLocalStorage("dismissed-app-io-banner", false)
    return !dismissedBanner ? (
        <div
            style={{
                backgroundColor: "rgba(244, 128, 188, 0.38)",
                position: "relative",
                padding: "0 1em"
            }}>
            <p>
                <strong>Attention:</strong> We have changed domains from <b>.app</b> to <b>.io</b>.
                Our site can now be found at:{" "}
                <strong>
                    <u>
                        <Link href="https://alpha.raidhub.io" style={{ cursor: "pointer" }}>
                            alpha.raidhub.io
                        </Link>
                    </u>
                </strong>
                . Don&apos;t forget to update your bookmarks!
            </p>
            <button
                onClick={() => setDismissedBanner(true)}
                style={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    background: "#FFFFFF11",
                    border: "none"
                }}>
                X
            </button>
        </div>
    ) : null
}
