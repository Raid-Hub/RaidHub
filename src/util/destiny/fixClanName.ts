/**
 * Destiny clan names are unique, so players often include blank characters in their name,
 * so let's just remove them using left and right pointers
 * @param name the name of the clan
 * @returns the fixed clan name
 */
export function fixClanName(name: string): string {
    const blanks = ["ㅤ", " "]
    let r = name.length
    while (r > 0) {
        if (blanks.includes(name[r - 1])) r--
        else break
    }

    let l = 0
    while (l < name.length) {
        if (blanks.includes(name[l])) l++
        else break
    }
    return name.substring(l, r)
}
