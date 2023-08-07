import styles from "../styles/legal.module.css"
import { NextPage } from "next"
import Head from "next/head"

const TosPage: NextPage = () => {
    return (
        <>
            <Head>
                <title key="title">Terms and Conditions | RaidHub</title>
            </Head>
            <main className={styles["main"]}>
                <h1>Terms and Conditions</h1>
                <h4>
                    Effective date:{" "}
                    <span className={styles["effective-date"]}>
                        {new Date("August 5, 2023 6:50:00 AM EDT").toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}
                    </span>
                </h4>
                <section className={styles["section"]}>
                    <p>
                        These terms and conditions (the &quot;Terms and Conditions&quot;) govern the
                        use of raidhub.app (the &quot;Site&quot;). This Site is owned and operated
                        by RaidHub. This Site is a data compilation service.
                    </p>
                    <p>
                        By using this Site, you indicate that you have read and understand these
                        Terms and Conditions and agree to abide by them at all times.
                    </p>
                    <p>
                        THESE TERMS AND CONDITIONS CONTAIN A DISPUTE RESOLUTION CLAUSE THAT IMPACTS
                        YOUR RIGHTS ABOUT HOW TO RESOLVE DISPUTES. PLEASE READ IT CAREFULLY.
                    </p>
                    <h2>Intellectual Property</h2>
                    <p>
                        All content published and made available on our Site is the property of
                        RaidHub and the Site&apos;s creators. This includes, but is not limited to
                        images, text, logos, documents, downloadable files and anything that
                        contributes to the composition of our Site.
                    </p>
                    <h2>Accounts</h2>
                    <p>TBD</p>
                    <h2>Links to Other Websites </h2>
                    <p>
                        Our Site contains links to third party websites or services that we do not
                        own or control. We are not responsible for the content, policies, or
                        practices of any third party website or service linked to on our Site. It is
                        your responsibility to read the terms and conditions and privacy policies of
                        these third party websites before using these sites.
                    </p>
                    <h2>Limitation of Liability</h2>
                    <p>
                        RaidHub directors, officers, agents, employees, subsidiaries, and affiliates
                        will not be liable for any actions, claims, losses, damages, liabilities and
                        expenses including legal fees from your use of the Site.
                    </p>
                    <h2>Indemnity</h2>
                    <p>
                        Except where prohibited by law, by using this Site you indemnify and hold
                        harmless RaidHub directors, officers, agents, employees, subsidiaries, and
                        affiliates from any actions, claims, losses, damages, liabilities and
                        expenses including legal fees arising out of your use of our Site or your
                        violation of these Terms and Conditions.
                    </p>
                    <h2>Applicable Law</h2>
                    <p>
                        These Terms and Conditions are governed by the laws of the State of
                        Victoria, Australia.
                    </p>
                    <h2>Dispute Resolution</h2>
                    <p>
                        Subject to any exceptions specified in these Terms and Conditions, if you
                        and RaidHub are unable to resolve any dispute through informal discussion,
                        then you and RaidHub agree to submit the issue before an arbitrator. The
                        decision of the arbitrator will be final and binding. Any arbitrator must be
                        a neutral party acceptable to both you and RaidHub.
                    </p>
                    <p>
                        Notwithstanding any other provision in these Terms and Conditions, you and
                        RaidHub agree that you both retain the right to bring an action in small
                        claims court and to bring an action for injunctive relief or intellectual
                        property infringement.
                    </p>
                    <h2>Severability </h2>
                    <p>
                        If at any time any of the provisions set forth in these Terms and Conditions
                        are found to be inconsistent or invalid under applicable laws, those
                        provisions will be deemed void and will be removed from these Terms and
                        Conditions. All other provisions will not be affected by the removal and the
                        rest of these Terms and Conditions will still be considered valid.
                    </p>
                    <h2>Changes</h2>
                    <p>
                        These Terms and Conditions may be amended from time to time in order to
                        maintain compliance with the law and to reflect any changes to the way we
                        operate our Site and the way we expect users to behave on our Site. We will
                        notify users by email of changes to these Terms and Conditions or post a
                        notice on our Site.
                    </p>
                    <h2>Contact Details</h2>
                    Please contact us if you have any questions or concerns. Our contact details are
                    as follows: admin@raidhub.app
                </section>
            </main>
        </>
    )
}

export default TosPage
