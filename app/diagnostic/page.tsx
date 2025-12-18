export const dynamic = 'force-dynamic';

export default function DiagnosticPage() {
    const dbUrl = process.env.DATABASE_URL;
    const authSecret = process.env.AUTH_SECRET;

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>Environment Diagnostic</h1>
            <div style={{ marginTop: '2rem' }}>
                <h2>DATABASE_URL:</h2>
                <p style={{ color: dbUrl ? 'green' : 'red' }}>
                    {dbUrl ? `✓ Set (${dbUrl.substring(0, 20)}...)` : '✗ NOT SET'}
                </p>

                <h2>AUTH_SECRET:</h2>
                <p style={{ color: authSecret ? 'green' : 'red' }}>
                    {authSecret ? `✓ Set (${authSecret.substring(0, 10)}...)` : '✗ NOT SET'}
                </p>

                <h2>Database Type:</h2>
                <p>
                    {dbUrl?.startsWith('postgresql') ? '✓ PostgreSQL' :
                        dbUrl?.startsWith('file:') ? '✗ SQLite (won\'t work in production!)' :
                            '✗ Unknown or missing'}
                </p>
            </div>
        </div>
    );
}
