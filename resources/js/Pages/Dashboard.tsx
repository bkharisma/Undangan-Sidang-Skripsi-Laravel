import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="rounded-lg border bg-card p-6">
                    <p className="text-muted-foreground">You're logged in!</p>
                </div>
            </div>
        </AppLayout>
    );
}
