import { DestinyClass } from "bungie-net-core/models"
import { SVGComponent } from "~/components/reusable/SVG"
import QuestionMark from "./QuestionMark"

export const CharacterLogos: { [key in DestinyClass]: SVGComponent } = {
    0: QuestionMark /**Titan*/,
    1: QuestionMark /**Hunter*/,
    2: QuestionMark /**Warlock*/,
    3: QuestionMark /**Question_Mark*/
}
