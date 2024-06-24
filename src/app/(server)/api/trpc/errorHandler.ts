import { type OnErrorFunction } from "@trpc/server/dist/internals/types"
import { type Session } from "next-auth"
import { type AppRouter } from "."

export const trpcErrorHandler: OnErrorFunction<AppRouter, Request> = async ({
    path,
    error,
    input,
    ctx
}) => {
    console.error(`❌ tRPC failed on ${path ?? "<no-path>"}:`, error)

    if (process.env.NODE_ENV === "production" && process.env.TRPC_ALERTS_WEBHOOK_URL) {
        const body = JSON.stringify({
            embeds: [
                {
                    color: 0xef0c09,
                    fields: [
                        {
                            name: "Error",
                            value: error.cause?.constructor.name ?? error.name,
                            inline: false
                        },
                        {
                            name: "Path",
                            value: `\`${path}\``,
                            inline: false
                        },
                        {
                            name: "Input",
                            value: input ?? "",
                            inline: false
                        },
                        {
                            name: "User",
                            value:
                                (ctx as unknown as { session?: Session } | undefined)?.session?.user
                                    .id ?? "",
                            inline: false
                        },
                        {
                            name: "Stack Trace",
                            value:
                                error.stack
                                    ?.split("\n")
                                    .slice(1, 5)
                                    .map(line => `\`\`\`${line.trim().replaceAll("at ", "")}\`\`\``)
                                    .join("") ?? "",
                            inline: false
                        },
                        {
                            name: "App Version",
                            value: process.env.APP_VERSION ?? "N/A",
                            inline: false
                        },
                        {
                            name: "Country",
                            value: ctx?.headers.get("cf-ipcountry") ?? "N/A",
                            inline: false
                        },
                        {
                            name: "User Agent",
                            value: `\`${ctx?.headers.get("user-agent") ?? "N/A"}\``,
                            inline: false
                        }
                    ]
                }
            ]
        })
        const webhookResponse = await fetch(process.env.TRPC_ALERTS_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })
        if (!webhookResponse.ok) {
            console.error(new Error(`[${webhookResponse.status}] ${await webhookResponse.text()}`))
        }
    }
}
