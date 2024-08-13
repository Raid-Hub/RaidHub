import {
    DiscordColors,
    sendDiscordWebhook,
    type DiscordWebhookData
} from "~/services/discord/webhook"

export const fetchWithLog: typeof fetch = async (...args) => {
    // Clone the request object to avoid re-using a readable stream
    const clonedArgs = args.map(a => (a instanceof Request ? a.clone() : a)) as Parameters<
        typeof fetch
    >

    return await fetch(...args).catch(async (err: Error) => {
        // Retry if we timed out
        if ((err.name = "ConnectTimeoutError")) {
            return await fetch(...clonedArgs).catch((err2: Error) => {
                logFetchError(args, err2)
                throw err2
            })
        }

        logFetchError(args, err)
        throw err
    })
}

const logFetchError = (args: Parameters<typeof fetch>, err: Error) => {
    const webhookData: DiscordWebhookData = {
        embeds: [
            {
                color: DiscordColors.RED,
                fields: [
                    {
                        name: "Input",
                        value: `\`\`\`json\n${JSON.stringify(
                            args.map(a =>
                                a instanceof Request
                                    ? {
                                          url: a.url,
                                          method: a.method
                                      }
                                    : a
                            ),
                            null,
                            2
                        ).slice(0, 1006)}\`\`\``,
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
                                .map(line => `\`\`\`${line.trim().replaceAll("at ", "")}\`\`\``)
                                .join("") ?? "",
                        inline: false
                    },
                    {
                        name: "Error Details",
                        value: `\`\`\`json\n${JSON.stringify({ ...err } ?? [], null, 2).slice(
                            0,
                            1006
                        )}\`\`\``,
                        inline: false
                    }
                ]
            }
        ]
    }
    if (process.env.FETCH_FAILED_WEBHOOK_URL) {
        void sendDiscordWebhook(process.env.FETCH_FAILED_WEBHOOK_URL, webhookData).catch(
            console.error
        )
    } else {
        console.error(webhookData)
    }
}
