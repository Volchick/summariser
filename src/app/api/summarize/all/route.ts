const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

export async function GET(request: Request) {
    try {
        const response = await fetch(`${FASTAPI_URL}/get-all-items`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return Response.json(
                { error: 'Failed to fetch summaries' },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        // Форматируем данные для фронтенда
        const formattedData = data.map((item: any) => ({
            id: item.id.toString(),
            url: item.url,
            summary: item.summary,
            createdAt: item.created_at,
        }));

        return Response.json(formattedData);
    } catch (error) {
        console.error('Error fetching summaries:', error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
