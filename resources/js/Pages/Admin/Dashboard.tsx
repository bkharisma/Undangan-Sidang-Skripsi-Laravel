import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, GraduationCap, BookOpen, UserCog, FileText, Calendar } from 'lucide-react';

interface Stats {
    total_user: number;
    total_dosen: number;
    total_mahasiswa: number;
    total_pic: number;
    total_sidang: number;
    total_undangan: number;
}

const statCards = [
    { key: 'total_user', label: 'Total User', icon: Users, color: 'text-blue-600' },
    { key: 'total_dosen', label: 'Total Dosen', icon: GraduationCap, color: 'text-green-600' },
    { key: 'total_mahasiswa', label: 'Total Mahasiswa', icon: BookOpen, color: 'text-purple-600' },
    { key: 'total_pic', label: 'Total PIC', icon: UserCog, color: 'text-orange-600' },
    { key: 'total_sidang', label: 'Total Sidang', icon: Calendar, color: 'text-red-600' },
    { key: 'total_undangan', label: 'Total Undangan', icon: FileText, color: 'text-teal-600' },
];

export default function AdminDashboard({ stats }: PageProps<{ stats: Stats }>) {
    return (
        <AppLayout>
            <Head title="Dashboard Admin" />

            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Dashboard Admin</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.key}
                                className="flex items-center gap-4 rounded-lg border bg-card p-6"
                            >
                                <div className={`rounded-lg bg-muted p-3 ${card.color}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{card.label}</p>
                                    <p className="text-3xl font-bold">
                                        {stats[card.key as keyof Stats]}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
