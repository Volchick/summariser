const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

export async function POST(request: Request) {
    try {
        const { url } = await request.json();
        
        if (!url) {
            return Response.json({ error: 'URL is required' }, { status: 400 });
        }

        // Отправляем запрос на FastAPI бэкенд
        const response = await fetch(`${FASTAPI_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return Response.json(
                { error: errorData.detail || 'Failed to summarize video' },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        // Форматируем ответ для фронтенда
        return Response.json({
            videoId: data.id.toString(),
            title: data.url,
            summary: data.summary,
        });
    } catch (error) {
        console.error('Error in summarize API:', error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    return Response.json({ data: "GET data" });
}

export async function DELETE(request: Request) {
    return Response.json({ data: "DELETE data" });
}

export async function PUT(request: Request) {
    return Response.json({ data: "PUT data" });
}