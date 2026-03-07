import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { Dasha, DashaSequenceItem } from '../../types/astrology';

interface DashaTableProps {
    dasha: Dasha;
}

const DashaTable: React.FC<DashaTableProps> = ({ dasha }) => {
    // Navigation stack for drill-down (5 levels: MD -> BH -> AB -> PR -> SK)
    const [history, setHistory] = useState<{ title: string, items: DashaSequenceItem[] }[]>([]);

    const currentView = history.length > 0
        ? history[history.length - 1]
        : { title: 'Vimshottari Maha Dasha', items: dasha.mahadasha_sequence };

    const handleRowClick = (item: DashaSequenceItem) => {
        let nextItems: DashaSequenceItem[] | undefined;
        let nextTitle = '';

        // Check depth
        if (item.bhuktis && item.bhuktis.length > 0) {
            nextItems = item.bhuktis;
            nextTitle = `${item.planet} Bhukti`;
        } else if (item.antar_bhuktis && item.antar_bhuktis.length > 0) {
            nextItems = item.antar_bhuktis;
            nextTitle = `${item.planet} Antar Bhukti`;
        } else if (item.pratyantars && item.pratyantars.length > 0) {
            nextItems = item.pratyantars;
            nextTitle = `${item.planet} Pratyantar`;
        } else if (item.sukshmas && item.sukshmas.length > 0) {
            nextItems = item.sukshmas;
            nextTitle = `${item.planet} Sukshma`;
        }

        if (nextItems) {
            setHistory([...history, { title: nextTitle, items: nextItems }]);
        }
    };

    const goBack = () => {
        setHistory(history.slice(0, -1));
    };

    const activePlanets = [dasha.dasha, dasha.bhukti, dasha.antar_bhukti, dasha.pratyantar, dasha.sukshma];

    return (
        <div className="w-full max-w-lg mx-auto bg-white min-h-screen flex flex-col font-sans">
            {/* Title / Header */}
            <div className="p-6 text-center border-b border-gray-50 bg-white sticky top-0 z-10">
                <div className="flex items-center justify-between mb-2">
                    {history.length > 0 && (
                        <button onClick={goBack} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                            <ChevronLeft size={28} />
                        </button>
                    )}
                    <div className="flex-1">
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">
                            {currentView.title}
                        </h2>
                    </div>
                    {history.length > 0 && <div className="w-8" />} {/* Spacer */}
                </div>

                {history.length === 0 && (
                    <div className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                        Balance at Birth: <span className="text-gray-900">{dasha.balance_at_birth}</span>
                    </div>
                )}
            </div>

            {/* List Container */}
            <div className="flex-1 px-4 py-2">
                <div className="space-y-1">
                    {currentView.items.map((item, idx) => {
                        const isActive = activePlanets.includes(item.planet);

                        return (
                            <div
                                key={idx}
                                onClick={() => handleRowClick(item)}
                                className="flex items-center justify-between py-6 px-4 cursor-pointer active:bg-gray-50 border-b border-gray-50 group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-base border-2 transition-all ${isActive
                                            ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-100'
                                            : 'bg-white border-gray-100 text-gray-400 group-hover:border-orange-200 group-hover:text-orange-400'
                                        }`}>
                                        {item.abbr || item.planet.substring(0, 2)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-bold text-xl leading-none mb-1 ${isActive ? 'text-gray-900' : 'text-gray-500'
                                            }`}>
                                            {item.planet}
                                        </span>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                            Ending Date
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`font-mono font-black text-xl tracking-tight ${isActive ? 'text-orange-600' : 'text-gray-800'
                                        }`}>
                                        {item.end_date}
                                    </span>
                                    {(item.bhuktis || item.antar_bhuktis || item.pratyantars || item.sukshmas) && (
                                        <ChevronRight size={22} className="text-gray-200 group-hover:text-orange-300 transition-colors" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Persistence Note Footer */}
            <div className="p-8 bg-white text-center">
                <p className="text-[14px] text-orange-500 font-bold leading-7">
                    Note :- Click on row above for sub-period.
                </p>
                <p className="text-[14px] text-orange-500 font-bold leading-7">
                    Date mentioned above are ending dates.
                </p>
            </div>
        </div>
    );
};

export default DashaTable;
