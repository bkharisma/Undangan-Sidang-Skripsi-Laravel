import { Link, usePage } from '@inertiajs/react';
import { HTMLAttributes } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    UserCheck,
    ClipboardList,
    FileText,
    Calendar,
    BookOpen,
    Library,
} from 'lucide-react';

interface SidebarItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    routeName: string;
}

function SidebarItem({ item }: { item: SidebarItem }) {
    const isActive = route().current(item.routeName);

    return (
        <Link
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
            {item.icon}
            {item.label}
        </Link>
    );
}

export default function Sidebar({
    className = '',
}: HTMLAttributes<HTMLDivElement>) {
    const user = usePage().props.auth.user;

    const adminItems: SidebarItem[] = [
        {
            label: 'Dashboard',
            href: route('admin.dashboard'),
            icon: <LayoutDashboard className="h-4 w-4" />,
            routeName: 'admin.dashboard',
        },
        {
            label: 'Kelola User',
            href: route('admin.users.index'),
            icon: <Users className="h-4 w-4" />,
            routeName: 'admin.users.*',
        },
        {
            label: 'Data Dosen',
            href: route('admin.dosen.index'),
            icon: <GraduationCap className="h-4 w-4" />,
            routeName: 'admin.dosen.*',
        },
        {
            label: 'Program Studi',
            href: route('admin.program-studi.index'),
            icon: <Library className="h-4 w-4" />,
            routeName: 'admin.program-studi.*',
        },
        {
            label: 'Data Mahasiswa',
            href: route('admin.mahasiswa.index'),
            icon: <UserCheck className="h-4 w-4" />,
            routeName: 'admin.mahasiswa.*',
        },
        {
            label: 'Data PIC',
            href: route('admin.pic.index'),
            icon: <ClipboardList className="h-4 w-4" />,
            routeName: 'admin.pic.*',
        },
        {
            label: 'Semua Sidang',
            href: route('admin.sidang.index'),
            icon: <BookOpen className="h-4 w-4" />,
            routeName: 'admin.sidang.*',
        },
    ];

    const userItems: SidebarItem[] = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
            icon: <LayoutDashboard className="h-4 w-4" />,
            routeName: 'dashboard',
        },
        {
            label: 'Data Sidang',
            href: route('sidang.index'),
            icon: <Calendar className="h-4 w-4" />,
            routeName: 'sidang.*',
        },
        {
            label: 'Undangan',
            href: route('undangan.index'),
            icon: <FileText className="h-4 w-4" />,
            routeName: 'undangan.*',
        },
    ];

    const items = user.role === 'admin' ? adminItems : userItems;

    return (
        <div className={`flex h-full flex-col border-r bg-white ${className}`}>
            <div className="flex h-14 items-center border-b px-4">
                <Link href={user.role === 'admin' ? route('admin.dashboard') : route('dashboard')}>
                    <ApplicationLogo className="h-8 w-auto fill-current text-gray-800" />
                </Link>
            </div>

            <nav className="flex-1 space-y-1 overflow-auto p-3">
                {items.map((item) => (
                    <SidebarItem key={item.label} item={item} />
                ))}
            </nav>
        </div>
    );
}
