'use client';

import { Menu, DownloadCloud, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'youtube-playlist-data';

export function AuthButton() {
    const handleExportData = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            alert('No data to export');
            return;
        }
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `vextube-backup-${Date.now()}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    const handleClearData = () => {
        if (confirm('Clear all local data? This cannot be undone.')) {
            localStorage.removeItem(STORAGE_KEY);
            window.location.reload();
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Menu className="w-4 h-4 mr-2" />
                    Data
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleExportData}>
                    <DownloadCloud className="w-4 h-4 mr-2" />
                    Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClearData} className="text-red-400">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Local Data
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
