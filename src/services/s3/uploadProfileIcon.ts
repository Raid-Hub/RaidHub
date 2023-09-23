export const uploadProfileIcon = async ({ file, signedURL }: { file: File; signedURL: string }) => {
    const res = await fetch(signedURL, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type
        }
    })

    return res.ok
}
