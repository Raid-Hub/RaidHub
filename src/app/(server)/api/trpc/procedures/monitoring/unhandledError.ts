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
                const webhookResponse = await fetch(process.env.CLIENT_ALERTS_WEBHOOK_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
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
                                        value: input.error.stack
                                            ?.split("\n")
                                            .slice(1, 5)
                                            .map(line => line.trim())
                                            .map(line =>
                                                line.startsWith("at ") ? line.substring(3) : line
                                            )
                                            .map(line => `- \`${line}\``)
                                            .join("\n"),
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
                                                        Array.isArray(value)
                                                            ? value.join(",")
                                                            : value
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
                })
                if (!webhookResponse.ok) {
                    throw new Error(await webhookResponse.text())
                }
            }
        } catch (err) {
            console.error(err)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR"
            })
        }
    })
