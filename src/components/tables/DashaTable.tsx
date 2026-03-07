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
        <div className="w-full max-w-lg mx-auto bg-white min-h-[500px] flex flex-col font-sans mb-10 overflow-hidden rounded-xl shadow-lg border border-gray-100">
            {/* Title / Header */}
            <div className="p-8 text-center border-b border-gray-50 bg-white">
                <div className="flex items-center justify-between mb-4">
                    {history.length > 0 && (
                        <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                            <ChevronLeft size={32} />
                        </button>
                    )}
                    <div className={`flex-1 ${history.length === 0 ? 'text-center' : 'pl-2'}`}>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                            {currentView.title}
                        </h2>
                    </div>
                    {history.length > 0 && <div className="w-10" />} {/* Spacer */}
                </div>

                {history.length === 0 && (
                    <div className="text-[14px] font-bold text-gray-400 uppercase tracking-widest mt-2 bg-gray-50 inline-block px-4 py-1.5 rounded-full">
                        Balance at Birth: <span className="text-gray-900">{dasha.balance_at_birth}</span>
                    </div>
                )}
            </div>

            {/* List Container */}
            <div className="flex-1">
                <div className="divide-y divide-gray-50">
                    {currentView.items.map((item, idx) => {
                        const isActive = activePlanets.includes(item.planet);

                        return (
                            <div
                                key={idx}
                                onClick={() => handleRowClick(item)}
                                className={`flex items-center justify-between py-6 px-8 cursor-pointer active:bg-gray-100 transition-colors group ${isActive ? 'bg-orange-50/40' : 'hover:bg-gray-50/50'
                                    }`}
                            >
                                <div className="flex items-center gap-8">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg border-2 transition-all group-hover:scale-105 ${isActive
                                        ? 'bg-orange-600 border-orange-600 text-white shadow-2xl shadow-orange-200'
                                        : 'bg-white border-gray-100 text-gray-400 group-hover:border-orange-200 group-hover:text-orange-400'
                                        }`}>
                                        {item.abbr || item.planet.substring(0, 2)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-black text-2xl leading-none mb-1.5 tracking-tight ${isActive ? 'text-gray-900' : 'text-gray-600'
                                            }`}>
                                            {item.planet}
                                        </span>
                                        <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.1em]">
                                            Ending Date
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <span className={`font-mono font-black text-2xl tracking-tighter ${isActive ? 'text-orange-600' : 'text-gray-900'
                                        }`}>
                                        {item.end_date}
                                    </span>
                                    {(item.bhuktis || item.antar_bhuktis || item.pratyantars || item.sukshmas) && (
                                        <ChevronRight size={24} className={`transition-transform group-hover:translate-x-1 ${isActive ? 'text-orange-300' : 'text-gray-200'}`} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Persistence Note Footer */}
            <div className="p-10 bg-white text-center mt-4">
                <p className="text-[15px] text-orange-500 font-black leading-8 tracking-tight">
                    Note :- Click on row above for sub-period.
                </p>
                <p className="text-[15px] text-orange-500 font-black leading-8 tracking-tight">
                    Date mentioned above are ending dates.
                </p>
                <div className="mt-4 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                    Build: v1.2.5 (High-Precision Vedic Dasha)
                </div>
            </div>
        </div>
    );
};

export default DashaTable;
