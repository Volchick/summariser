const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        const response = await fetch(`${FASTAPI_URL}/items/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return Response.json(
                    { error: 'Summary not found' },
                    { status: 404 }
                );
            }
            return Response.json(
                { error: 'Failed to fetch summary' },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        // Форматируем данные для фронтенда
        return Response.json({
            id: data.id.toString(),
            title: data.url,
            url: data.url,
            summary: data.summary,
            createdAt: data.created_at || new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error fetching summary:', error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        const response = await fetch(`${FASTAPI_URL}/items/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return Response.json(
                    { error: 'Summary not found' },
                    { status: 404 }
                );
            }
            return Response.json(
                { error: 'Failed to delete summary' },
                { status: response.status }
            );
        }

        return Response.json({ message: 'Summary deleted successfully' });
    } catch (error) {
        console.error('Error deleting summary:', error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
