import { DiscordColors, sendDiscordWebhook } from "~/services/discord/webhook"

export const fetchWithLog: typeof fetch = (...args) =>
    fetch(...args).catch(async (err: Error) => {
        if (process.env.FETCH_FAILED_WEBHOOK_URL) {
            await sendDiscordWebhook(process.env.FETCH_FAILED_WEBHOOK_URL, {
                embeds: [
                    {
                        color: DiscordColors.RED,
                        fields: [
                            {
                                name: "Input",
                                value: `\`\`\`json\n${JSON.stringify(args ?? [], null, 2).slice(
                                    0,
                                    1006
                                )}\`\`\``,
                                inline: false
                            },
                            {
                                name: err.cause?.constructor.name ?? err.name,
                                value: err.message,
                                inline: false
                            },
                            {
                                name: "Stack Trace",
                                value:
                                    err.stack
                                        ?.split("\n")
                                        .slice(1, 5)
                                        .map(
                                            line =>
                                                `\`\`\`${line.trim().replaceAll("at ", "")}\`\`\``
                                        )
                                        .join("") ?? "",
                                inline: false
                            },
                            {
                                name: "Error",
                                value: `\`\`\`json\n${JSON.stringify(err ?? [], null, 2).slice(
                                    0,
                                    1006
                                )}\`\`\``,
                                inline: false
                            }
                        ]
                    }
                ]
            }).catch(console.error)
        }
        throw err
    })
