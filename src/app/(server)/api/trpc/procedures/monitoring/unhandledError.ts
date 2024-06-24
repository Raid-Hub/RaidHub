import { z } from "zod"
import { publicProcedure } from "../.."

const staticChunkRegex =
    /https:\/\/[a-zA-Z0-9.-]+\/_next\/static\/chunks\/([a-zA-Z0-9_-]+)\.js\?dpl=[a-zA-Z0-9_]+:(\d+):(\d+)/

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
        if (process.env.CLIENT_ALERTS_WEBHOOK_URL) {
            const stackTraceLines =
                input.error.stack
                    ?.split("\n")
                    .slice(1)
                    .map(line => line.trim())
                    .map(line => (line.startsWith("at ") ? line.substring(3) : line))
                    .map(line => line.replace(staticChunkRegex, "chunks/$1.js:$2:$3"))
                    .map(line => `- \`${line}\``) ?? []

            const getBody = (end?: number) => ({
                embeds: [
                    {
                        color: 0xef0c09,
                        fields: [
                            {
                                name: "Error",
                                value: `__${input.error.name}__: ${input.error.message}`,
                                inline: false
                            },
                            {
                                name: "Stack Trace",
                                value: stackTraceLines.slice(0, end).join("\n"),
                                inline: false
                            },
                            {
                                name: "URL",
                                value: headers.get("referer"),
                                inline: false
                            },
                            {
                                name: "Params",
                                value: Object.entries(input.next.params)
                                    .map(
                                        ([key, value]) =>
                                            `- \`${key}: ${
                                                Array.isArray(value) ? value.join(",") : value
                                            }\``
                                    )
                                    .join("\n"),
                                inline: false
                            },
                            {
                                name: "Search Params",
                                value: Array.from(input.next.searchParams.entries())
                                    .map(([key, value]) => `- \`${key}: ${value}\``)
                                    .sort()
                                    .join("\n"),
                                inline: false
                            },
                            {
                                name: "App Version",
                                value: process.env.APP_VERSION ?? "N/A"
                            },
                            {
                                name: "Country",
                                value: headers.get("cf-ipcountry") ?? "N/A",
                                inline: false
                            },
                            {
                                name: "User Agent",
                                value: `\`${headers.get("user-agent") ?? "N/A"}\``,
                                inline: false
                            }
                        ]
                    }
                ]
            })

            let i = 1
            let body = JSON.stringify(getBody())
            while (body.length > 1600 && i < stackTraceLines.length) {
                body = JSON.stringify(getBody(-i))
                i++
            }

            const webhookResponse = await fetch(process.env.CLIENT_ALERTS_WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body
            })
            if (!webhookResponse.ok) {
                throw new Error(`[${webhookResponse.status}] ${await webhookResponse.text()}`)
            }
        }
    })
