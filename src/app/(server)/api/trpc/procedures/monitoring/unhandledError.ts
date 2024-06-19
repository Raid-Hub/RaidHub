import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { publicProcedure } from "../.."

export const unhandledClientError = publicProcedure
    .input(
        z.object({
            next: z.object({
                pathname: z.string(),
                params: z.record(z.union([z.string(), z.array(z.string())])),
                searchParams: z.string().transform(s => new URLSearchParams(s))
            }),
            error: z.object({
                name: z.string(),
                message: z.string(),
                stack: z.string().optional()
            })
        })
    )
    .mutation(async ({ ctx: { headers }, input }) => {
        try {
            if (process.env.CLIENT_ALERTS_WEBHOOK_URL) {
                const stackTraceLines =
                    input.error.stack
                        ?.split("\n")
                        .map(line => line.trim())
                        .map(line => (line.startsWith("at ") ? line.substring(3) : line))
                        .map(line => `- \`${line}\``) ?? []

                const body = (countLines: number) => ({
                    embeds: [
                        {
                            color: 0xef0c09,
                            fields: [
                                {
                                    name: "Error",
                                    value: `**${input.error.name}**: ${input.error.message}`,
                                    inline: false
                                },
                                {
                                    name: "Stack Trace",
                                    value: stackTraceLines.slice(1, countLines + 1).join("\n"),
                                    inline: false
                                },
                                {
                                    name: "Host",
                                    value: headers.get("host") ?? "",
                                    inline: true
                                },
                                {
                                    name: "Origin",
                                    value: headers.get("origin"),
                                    inline: true
                                },
                                {
                                    name: "Referer",
                                    value: headers.get("referer"),
                                    inline: true
                                },
                                {
                                    name: "Pathname",
                                    value: input.next.pathname,
                                    inline: true
                                },
                                {
                                    name: "Params",
                                    value: Object.entries(input.next.params)
                                        .map(
                                            ([key, value]) =>
                                                `- \`${key}\`: \`${
                                                    Array.isArray(value) ? value.join(",") : value
                                                }\``
                                        )
                                        .join("\n"),
                                    inline: true
                                },
                                {
                                    name: "Search Params",
                                    value: Object.entries(input.next.searchParams).toString(),
                                    inline: true
                                },
                                {
                                    name: "Country",
                                    value: headers.get("cf-ipcountry") ?? "",
                                    inline: true
                                },
                                {
                                    name: "User Agent",
                                    value: `\`${headers.get("user-agent") ?? ""}\``,
                                    inline: false
                                }
                            ]
                        }
                    ]
                })

                let i = 0
                while (JSON.stringify(body(i)).length < 1600) {
                    i++
                }
                i--

                const webhookResponse = await fetch(process.env.CLIENT_ALERTS_WEBHOOK_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body(i))
                })
                if (!webhookResponse.ok) {
                    throw new Error(`[${webhookResponse.status}] ${await webhookResponse.text()}`)
                }
            }
        } catch (err) {
            console.error(err)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR"
            })
        }
    })
