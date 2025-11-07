export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const imageUrl = query.url as string

    if (!imageUrl) {
        throw createError({
            statusCode: 400,
            message: 'URL parameter is required'
        })
    }

    try {
        const response = await fetch(imageUrl)

        if (!response.ok) {
            throw createError({
                statusCode: response.status,
                message: 'Failed to fetch image'
            })
        }

        const contentType = response.headers.get('content-type')
        const buffer = await response.arrayBuffer()

        // Set appropriate headers
        setHeader(event, 'Content-Type', contentType || 'image/png')
        setHeader(event, 'Cache-Control', 'public, max-age=86400') // Cache for 1 day

        return buffer
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: error instanceof Error ? error.message : 'Failed to proxy image'
        })
    }
});
