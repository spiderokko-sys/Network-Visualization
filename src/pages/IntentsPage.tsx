import React from 'react';
import { GlobeWithUI } from '../components/GlobeMap';

export const IntentsPage = () => {
    return (
        <div className="h-full w-full relative animate-in fade-in duration-700 bg-slate-950">
            <GlobeWithUI showHeader={false} />
        </div>
    );
};
