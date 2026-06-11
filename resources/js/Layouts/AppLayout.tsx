import { Link, router, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    UserCog,
    FileText,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Menu,
    Calendar,
    Mail,
    Library,
    Clock,
    Building2,
    Settings,
    Cog,
} from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import FlashMessages from '@/Components/FlashMessages';
import type { Setting } from '@/types';

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
    pattern: string | RegExp;
}

const adminNavItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
        pattern: 'admin.dashboard',
    },
    {
        label: 'Kelola User',
        href: '/admin/users',
        icon: Users,
        pattern: 'admin.users*',
    },
    {
        label: 'Data Dosen',
        href: '/admin/dosen',
        icon: GraduationCap,
        pattern: 'admin.dosen*',
    },
    {
        label: 'Program Studi',
        href: '/admin/program-studi',
        icon: Library,
        pattern: 'admin.program-studi*',
    },
    {
        label: 'Data Mahasiswa',
        href: '/admin/mahasiswa',
        icon: BookOpen,
        pattern: 'admin.mahasiswa*',
    },
    {
        label: 'Data PIC',
        href: '/admin/pic',
        icon: UserCog,
        pattern: 'admin.pic*',
    },
    {
        label: 'Data Ruangan',
        href: '/admin/ruangan',
        icon: Building2,
        pattern: 'admin.ruangan*',
    },
    {
        label: 'Data Jam',
        href: '/admin/jam',
        icon: Clock,
        pattern: 'admin.jam*',
    },
    {
        label: 'Kelola Jadwal Sidang',
        href: '/admin/sidang',
        icon: FileText,
        pattern: 'admin.sidang*',
    },
    {
        label: 'Data Sidang',
        href: '/sidang',
        icon: Calendar,
        pattern: 'sidang*',
    },
    {
        label: 'Undangan',
        href: '/undangan',
        icon: Mail,
        pattern: 'undangan*',
    },
    {
        label: 'Template PDF',
        href: '/template',
        icon: Settings,
        pattern: 'template*',
    },
    {
        label: 'Pengaturan',
        href: '/admin/setting',
        icon: Cog,
        pattern: 'admin.setting*',
    },
];

const userNavItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        pattern: 'dashboard',
    },
    {
        label: 'Data Sidang',
        href: '/sidang',
        icon: FileText,
        pattern: 'sidang*',
    },
    {
        label: 'Undangan',
        href: '/undangan',
        icon: FileText,
        pattern: 'undangan*',
    },
    {
        label: 'Template PDF',
        href: '/template',
        icon: Settings,
        pattern: 'template*',
    },
];

function isActive(pattern: string | RegExp): boolean {
    if (typeof pattern === 'string') {
        return route().current(pattern) ?? false;
    }
    return pattern.test(route().current() ?? '');
}

export default function AppLayout({ children }: PropsWithChildren) {
    const { auth, setting } = usePage().props as any;
    const user = auth.user;
    const isAdmin = user.role === 'admin';
    const navItems = isAdmin ? adminNavItems : userNavItems;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const appName = (setting as Setting)?.app_name || 'Undangan Sidang';
    const appLogoUrl = (setting as Setting)?.app_logo_url;

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 lg:relative lg:z-auto',
                    collapsed ? 'w-16' : 'w-64',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <div className="flex h-16 items-center justify-between border-b px-4">
                    {!collapsed && (
                        <Link href={isAdmin ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2 min-w-0">
                            {appLogoUrl ? (
                                <img src={appLogoUrl} alt={appName} className="h-8 w-auto object-contain shrink-0" />
                            ) : (
                                <FileText className="h-6 w-6 text-primary shrink-0" />
                            )}
                            <span className="text-lg font-bold truncate">{appName}</span>
                        </Link>
                    )}
                    {collapsed && (
                        <Link href={isAdmin ? '/admin/dashboard' : '/dashboard'} className="mx-auto">
                            {appLogoUrl ? (
                                <img src={appLogoUrl} alt={appName} className="h-6 w-auto object-contain" />
                            ) : (
                                <FileText className="h-6 w-6 text-primary" />
                            )}
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden lg:flex"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.pattern);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <Separator />

                <div className="p-2">
                    {!collapsed && (
                        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground">
                            <div className="flex flex-col">
                                <span className="font-medium text-foreground">{user.name}</span>
                                <span className="text-xs">{isAdmin ? 'Admin' : 'User'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Navbar */}
                <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="flex-1" />

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="outline" size="sm">
                                {user.name}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => router.visit(route('profile.edit'))}
                            >
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => router.post(route('logout'))}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Log Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
            <FlashMessages />
        </div>
    );
}
