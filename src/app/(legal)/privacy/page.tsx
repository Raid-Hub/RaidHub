import { type Metadata } from "next"
import Link from "next/link"
import { metadata as rootMetaData } from "~/app/layout"
import { LegalPage } from "../LegalPage"

export const metadata: Metadata = {
    title: "Privacy Policy",
    openGraph: {
        ...rootMetaData.openGraph,
        title: "Privacy Policy"
    }
}

const effectiveDate = new Date("June 14, 2024 2:19 PM EST")

export default function Page() {
    return (
        <LegalPage title="Privacy Policy" effectiveDate={effectiveDate}>
            <p>
                This Privacy Policy governs the manner in which raidhub.io collects, uses, maintains
                and discloses information collected from users (each, a &quot;User&quot;) of the
                raidhub.io website (&quot;Site&quot;). This privacy policy applies to the Site and
                all products and services offered by RaidHub.
            </p>
            <h2>Third party websites</h2>
            <p>
                Users may find advertising or other content on our Site that link to the sites and
                services of our partners, suppliers, advertisers, sponsors, licensors and other
                third parties. We do not control the content or links that appear on these sites and
                are not responsible for the practices employed by websites linked to or from our
                Site. In addition, these sites or services, including their content and links, may
                be constantly changing. These sites and services may have their own privacy policies
                and customer service policies. Browsing and interaction on any other website,
                including websites which have a link to our Site, is subject to that website&apos;s
                own terms and policies.
            </p>
            {/* <h2>Advertising</h2>
            <p>
                Ads appearing on our site may be delivered to Users by advertising partners, who may
                set cookies. These cookies allow the ad server to recognize your computer each time
                they send you an online advertisement to compile non personal identification
                information about you or others who use your computer. This information allows ad
                networks to, among other things, deliver targeted advertisements that they believe
                will be of most interest to you. This privacy policy does not cover the use of
                cookies by any advertisers. In addition, NAI member companies serve cookies via this
                website as part of the opt-out process. To enable a consumer to opt out of IBA by a
                member company, the member company must set an &quot;opt-out cookie&quot; on the
                consumer&apos;s browser. Please note that if you delete any opt-out cookies obtained
                using the NAI opt-out page, such as by clearing all cookies in your browser, you
                will need to return to the opt-out page to renew your choices. However, the DAA
                offers a tool that helps to preserve your opt-out cookies and prevent them from
                being deleted. To learn more about how our opt-out process works, click here.
            </p> */}
            {/* <h2>Google Adsense</h2>
            <p>
                Some of the ads may be served by Google. Google may use cookies to serve ads based
                on a User&apos;s prior visits to the Site or other websites. Google&apos;s use of
                advertising cookies enables it and its partners to serve ads to a User based on
                their visit to your sites and/or other sites on the Internet. Users may opt out of
                personalized advertising by visiting adssettings.google.com. Some of the ads may be
                served by third-party vendors and ad networks. A User can opt out of a third-party
                vendor&apos;s use of cookies for personalized advertising by visiting{" "}
                <Link href={"https://www.aboutads.info"}>aboutads.info.</Link>
            </p> */}
            <h2>Cookie Policy</h2>
            <p>
                A cookie is a small file, stored on a user&apos;s hard drive by a website. Its
                purpose is to collect data relating to the user&apos;s browsing habits.
            </p>
            <p>
                You can choose to be notified each time a cookie is transmitted. You can also choose
                to disable cookies entirely in your internet browser, but this may decrease the
                quality of your user experience.
            </p>
            <p>We use the following types of cookies on our Site:</p>
            <ol type="1">
                <li>Functional cookies</li>
                <p>
                    Functional cookies are used to remember the selections you make on our Site so
                    that your selections are saved for your next visits; and
                </p>
                <li>Third-Party Cookies</li>
                <p>
                    Third-party cookies are created by a website other than ours. We may use
                    third-party cookies to achieve the following purposes:
                </p>
                <ol type="a">
                    <li>Monitoring user preferences for the online advertisement industry.</li>
                </ol>
            </ol>
            <h2>Modifications</h2>
            <p>
                This Privacy Policy may be amended from time to time in order to maintain compliance
                with the law and to reflect any changes to our data collection process. When we
                amend this Privacy Policy we will update the &quot;Effective Date&quot; at the top
                of this Privacy Policy. We recommend that our users periodically review our Privacy
                Policy to ensure that they are notified of any updates. If necessary, we may notify
                users by email of changes to this Privacy Policy.
            </p>
            <h2>Consent and Data Collection</h2>
            <p>
                We may collect non-personal identification information about Users whenever they
                interact with our Site. Non-personal identification information may include the
                browser name, the type of computer and technical information about Users means of
                connection to our Site, such as the operating system and the Internet service
                providers utilized and other similar information.
            </p>
            <p>This Privacy Policy applies in addition to the terms and conditions of our Site.</p>
            <p>
                Users who create an account consent to the collection of data for the purpose of
                statistics and online advertising.
            </p>
            <p>
                RaidHub&apos;s use and transfer to any other app of information received from Google
                APIs will adhere to{" "}
                <Link href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes">
                    Google API Services User Data Policy
                </Link>
                , including the Limited Use requirements.
            </p>
            <p>
                If you do not agree to this policy, please do not use our Site. Your continued use
                of the Site following the posting of changes to this policy will be deemed your
                acceptance of those changes.
            </p>
            <p>
                raidhub.io (the &quot;Site&quot;) is owned and operated by RaidHub. RaidHub can be
                contacted at: admin@raidhub.io
            </p>
        </LegalPage>
    )
}
