import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}

export default function Pagination({ links, from, to, total }: PaginationProps) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
                Menampilkan {from}–{to} dari {total} data
            </p>
            <div className="flex items-center gap-1">
                {links.map((link, i) => {
                    if (link.label.includes('Previous')) {
                        return (
                            <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        );
                    }
                    if (link.label.includes('Next')) {
                        return (
                            <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        );
                    }
                    return (
                        <Button
                            key={i}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                        >
                            {link.label.replace(/&laquo;|&raquo;/g, '')}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
