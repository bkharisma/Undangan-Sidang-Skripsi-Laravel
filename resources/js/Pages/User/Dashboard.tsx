import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { FileText, CalendarCheck, Mail } from 'lucide-react';

interface Props {
    stats: {
        total_sidang: number;
        total_berjadwal: number;
        total_undangan: number;
    };
}

export default function UserDashboard({ stats }: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Total Sidang
                                </h3>
                                <p className="text-3xl font-bold">{stats.total_sidang}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2">
                                <CalendarCheck className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Sudah Berjadwal
                                </h3>
                                <p className="text-3xl font-bold">{stats.total_berjadwal}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <Mail className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Total Undangan
                                </h3>
                                <p className="text-3xl font-bold">{stats.total_undangan}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
