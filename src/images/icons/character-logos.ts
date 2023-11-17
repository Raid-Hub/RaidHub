import { DestinyClass } from "bungie-net-core/models"
import QuestionMark from "./QuestionMark"
import { SVGComponent } from "~/components/reusable/SVG"
import Warlock from "./destiny2/Warlock"
import Hunter from "./destiny2/Hunter"
import Titan from "./destiny2/Titan"

export const CharacterLogos: { [key in DestinyClass]: SVGComponent } = {
    0: Titan,
    1: Hunter,
    2: Warlock,
    3: props => QuestionMark({ ...props, width: "20%" }) /**Question_Mark*/
}
