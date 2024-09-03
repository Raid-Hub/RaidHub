import { useEffect, type RefObject } from "react"

// Scroll to anchor links smoothly
export const useSmoothAnchorScroll = <E extends HTMLElement>(ref: RefObject<E>) => {
    useEffect(() => {
        const parent = ref.current

        if (!parent) return

        const handleScroll: EventListener = e => {
            const target = (e as MouseEvent).target as E
            const anchor = target.getAttribute("href")
            if (anchor?.startsWith("#")) {
                e.preventDefault()
                const targetElement = document.querySelector(anchor)

                if (targetElement) {
                    const offsetPosition =
                        targetElement.getBoundingClientRect().top +
                        window.screenY -
                        window.innerHeight / 12
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    })
                }
            }
        }

        const anchorTags = parent.querySelectorAll('a[href^="#"]')

        anchorTags.forEach(anchor => {
            anchor.addEventListener("click", handleScroll)
        })
        return () => {
            anchorTags.forEach(anchor => {
                anchor.removeEventListener("click", handleScroll)
            })
        }
    }, [ref])
}
