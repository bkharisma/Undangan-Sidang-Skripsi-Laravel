import '../css/app.css';
import './bootstrap';

import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = import.meta.glob<React.ComponentType>('./Pages/**/*.tsx', { eager: true });

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const page = pages[`./Pages/${name}.tsx`] as React.ComponentType;
        if (!page) throw new Error(`Page not found: ${name}`);
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster richColors />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
