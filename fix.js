const fs = require('fs');

function processFile(path, baseClass, activeClass, inactiveClass, mobileBase, mobileActive, mobileInactive) {
    let content = fs.readFileSync(path, 'utf8');

    // Imports
    if (!content.includes('NavLink')) {
        content = content.replace(/import \{([^}]+)\} from 'react-router-dom'/, (match, p1) => {
            return import { \, NavLink } from 'react-router-dom';
        });
    }
    if (!content.includes('import { cn }')) {
        content = content.replace(/(import .*? from 'react-router-dom'.*?\n)/, " { cn } from '@/utils/cn'\n");
    }

    // Replace Links in Desktop Nav
    content = content.replace(/<Link className="([^"]+)" to="([^"]+)">/g, (match, cls, to) => {
        if (cls.includes('flex flex-col') || cls.includes('md:hidden') || cls.includes('bottom-0')) {
            // Mobile NavLink
            return <NavLink to="\" className={({ isActive }) => cn("\", isActive ? "\" : "\")}>;
        }
        // Desktop NavLink
        return <NavLink to="\" className={({ isActive }) => cn("\", isActive ? "\" : "\")}>;
    });

    content = content.replace(/<\/Link>/g, '</NavLink>');
    
    fs.writeFileSync(path, content);
    console.log('Processed', path);
}

// ManagerLayout
processFile(
    'src/features/auth/layouts/ManagerLayout.tsx',
    'flex items-center gap-3 px-4 py-3 transition-all rounded-lg font-manrope text-sm',
    'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-900 dark:text-cyan-100 font-bold hover:translate-x-1',
    'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 hover:translate-x-1 font-medium',
    'flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150',
    'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100 rounded-xl',
    'text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-300'
);

// CanteenLayout
processFile(
    'src/features/auth/layouts/CanteenLayout.tsx',
    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
    'bg-cyan-100 text-cyan-900 font-bold',
    'text-slate-600 hover:bg-slate-200/50 hover:translate-x-1',
    'flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150',
    'bg-cyan-50 text-cyan-800 rounded-xl',
    'text-slate-400 hover:text-cyan-600'
);

// HRLayout
processFile(
    'src/features/auth/layouts/HRLayout.tsx',
    'flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-lg',
    'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-sm font-bold translate-x-1',
    'text-slate-500 dark:text-slate-400 hover:text-cyan-900 hover:bg-slate-100 dark:hover:bg-slate-800',
    'flex flex-col items-center justify-center px-3 py-1.5 active:scale-90 transition-transform duration-150',
    'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-100 rounded-xl',
    'text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-300'
);
