import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import FlashMessages from '@/Components/FlashMessages';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:shrink-0">
                <Sidebar className="w-64" />
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-64">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar
                    header={header}
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
            <FlashMessages />
        </div>
    );
}
