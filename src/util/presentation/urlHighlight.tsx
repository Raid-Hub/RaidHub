const urlRegex =
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim

export function urlHighlight(str: string, anchor = true): JSX.Element[] {
    const elements: JSX.Element[] = []
    let match
    let lastIndex = 0
    let key = 0
    while ((match = urlRegex.exec(str))) {
        // Capture the non-matching substring before the matched URL
        if (match.index > lastIndex) {
            elements.push(<span key={key++}>{str.substring(lastIndex, match.index)}</span>)
        }
        // Capture the matched URL
        const url = match[0]
        if (anchor) {
            elements.push(
                <a key={key++} href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                </a>
            )
        } else {
            elements.push(
                <span data-url={url} key={key++}>
                    {url}
                </span>
            )
        }
        lastIndex = urlRegex.lastIndex
    }
    // Capture the final non-matching substring after the last matched URL
    if (lastIndex < str.length) {
        elements.push(<span key={lastIndex}>{str.substring(lastIndex)}</span>)
    }
    return elements
}
