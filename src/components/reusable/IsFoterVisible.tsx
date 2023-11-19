import {useEffect, useState} from "react";

export function useIsVisible(ref: any) {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) =>
            setIntersecting(entry.isIntersecting)
        );

        try{
            observer.observe(ref.current);
        } catch(ex) {
            console.error('couldnt observe, reference is: ', ref.current, ' | failed with: ', ex)
        }
        return () => {
            observer.disconnect();
        };
    }, [ref]);

    return isIntersecting;
}