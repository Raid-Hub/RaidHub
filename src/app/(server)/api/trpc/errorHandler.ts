import type { inferRouterContext, ProcedureType, TRPCError } from "@trpc/server"
import { DiscordColors, sendDiscordWebhook } from "~/services/discord/webhook"
import { type AppRouter } from "."

export const trpcErrorHandler = async <TRouter extends AppRouter>({
    error,
    path,
    input,
    source,
    ctx
}: {
    error: TRPCError
    type: ProcedureType | "unknown"
    path?: string
    input: unknown
    source: "rpc" | "http"
    ctx?: inferRouterContext<TRouter>
}) => {
    console.error(`❌ tRPC failed on ${path ?? "<no-path>"}:`, error)

    if (process.env.NODE_ENV === "production" && process.env.TRPC_ALERTS_WEBHOOK_URL) {
        await sendDiscordWebhook(process.env.TRPC_ALERTS_WEBHOOK_URL, {
            embeds: [
                {
                    color: DiscordColors.RED,
                    fields: [
                        {
                            name: error.cause?.constructor.name ?? error.name,
                            value: error.cause?.message ?? error.message,
                            inline: false
                        },
                        {
                            name: "Path",
                            value: `\`${path}\``,
                            inline: false
                        },
                        {
                            name: "Input",
                            value: `\`\`\`json\n${JSON.stringify(input ?? {}, null, 2).slice(
                                0,
                                1006
                            )}\`\`\``,
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
                            name: "Source",
                            value: source,
                            inline: false
                        },
                        {
                            name: "App Version",
                            value: `\`${process.env.APP_VERSION ?? "N/A"}\``,
                            inline: false
                        },
                        {
                            name: "Country",
                            value: `\`${ctx?.headers.get("cf-ipcountry") ?? "N/A"}\``,
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
    }
}
