import { z } from "zod"
import { DiscordColors, sendDiscordWebhook } from "~/services/discord/webhook"
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
                className: z.string(),
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
                    .map(line => `\`\`\`${line}\`\`\``) ?? []

            const stackTraces = stackTraceLines.reduce((acc, line) => {
                if (acc.length === 0) {
                    acc.push([line])
                } else {
                    const lastLines = acc[acc.length - 1]
                    if (lastLines.reduce((curr, l) => curr + l.length, 0) + line.length <= 1024) {
                        lastLines.push(line)
                    } else {
                        acc.push([line])
                    }
                }
                return acc
            }, new Array<string[]>())

            await sendDiscordWebhook(process.env.CLIENT_ALERTS_WEBHOOK_URL, {
                embeds: [
                    {
                        color: DiscordColors.RED,
                        fields: [
                            {
                                name: input.error.className,
                                value: input.error.message,
                                inline: false
                            },
                            ...stackTraces.map((lines, i) => ({
                                name: `Stack Trace (${i + 1}/${stackTraces.length})`,
                                value: lines.join(""),
                                inline: false
                            })),
                            {
                                name: "URL",
                                value: headers.get("referer") ?? "",
                                inline: false
                            },
                            {
                                name: "Params",
                                value: Object.entries(input.next.params)
                                    .map(
                                        ([key, value]) =>
                                            `\`${key}: ${
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
                                value: process.env.APP_VERSION ?? "N/A",
                                inline: false
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
        }
    })
