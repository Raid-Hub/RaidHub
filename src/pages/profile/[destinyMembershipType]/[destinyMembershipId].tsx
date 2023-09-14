import { GetStaticProps, NextPage } from "next"
import { InitialProfileProps } from "~/types/profile"
import { zUniqueDestinyProfile } from "~/util/zod"
import prisma from "~/server/prisma"
import Profile from "~/components/profile/Profile"
import { prefetchRaidHubProfile } from "~/server/serverQueryClient"

const ProfilePage: NextPage<InitialProfileProps> = props => {
    return <Profile {...props} />
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps<InitialProfileProps> = async ({ params }) => {
    try {
        const props = zUniqueDestinyProfile.parse(params)
        const vanity = await prisma.vanity
            .findUnique({
                where: {
                    destinyMembershipId_destinyMembershipType: props
                }
            })
            .catch(console.error)

        if (vanity?.string) {
            return {
                redirect: {
                    permanent: true,
                    destination: `/${vanity.string.toLowerCase()}`
                }
            }
        } else {
            const prefetchedState = await prefetchRaidHubProfile(props.destinyMembershipId)

            return {
                revalidate: 3600 * 24,
                props: {
                    ...props,
                    trpcState: prefetchedState
                }
            }
        }
    } catch (e) {
        console.error(e)
        return { notFound: true }
    }
}

export default ProfilePage
