import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { Dasha, DashaSequenceItem } from '../../types/astrology';

interface DashaTableProps {
    dasha: Dasha;
}

const DashaTable: React.FC<DashaTableProps> = ({ dasha }) => {
    // Navigation stack for drill-down
    const [history, setHistory] = useState<{ title: string, items: DashaSequenceItem[] }[]>([]);

    const currentView = history.length > 0
        ? history[history.length - 1]
        : { title: 'Vimshottari Maha Dasha', items: dasha.mahadasha_sequence };

    const handleRowClick = (item: DashaSequenceItem) => {
        // Determine next level
        let nextItems: DashaSequenceItem[] | undefined;
        let nextTitle = '';

        if (item.bhuktis && item.bhuktis.length > 0) {
            nextItems = item.bhuktis;
            nextTitle = `Bhukti of ${item.planet}`;
        } else if (item.antar_bhuktis && item.antar_bhuktis.length > 0) {
            nextItems = item.antar_bhuktis;
            nextTitle = `Antar Bhukti of ${item.planet}`;
        } else if (item.pratyantars && item.pratyantars.length > 0) {
            nextItems = item.pratyantars;
            nextTitle = `Pratyantar of ${item.planet}`;
        } else if (item.sukshmas && item.sukshmas.length > 0) {
            nextItems = item.sukshmas;
            nextTitle = `Sukshma of ${item.planet}`;
        }

        if (nextItems) {
            setHistory([...history, { title: nextTitle, items: nextItems }]);
        }
    };

    const goBack = () => {
        setHistory(history.slice(0, -1));
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white min-h-[400px] flex flex-col font-sans">
            {/* Header */}
            <div className="border-b border-gray-100 p-4 shrink-0">
                <div className="flex items-center gap-3 mb-1">
                    {history.length > 0 && (
                        <button onClick={goBack} className="p-1 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                    )}
                    <h2 className="text-xl font-bold text-gray-900">{currentView.title}</h2>
                </div>
                {history.length === 0 && (
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">
                        Balance at Birth: <span className="text-orange-600">{dasha.balance_at_birth}</span>
                    </div>
                )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-gray-50">
                    {currentView.items.map((item, idx) => {
                        const isActive = [dasha.dasha, dasha.bhukti, dasha.antar_bhukti, dasha.pratyantar, dasha.sukshma].includes(item.planet);

                        return (
                            <div
                                key={idx}
                                onClick={() => handleRowClick(item)}
                                className={`flex items-center justify-between p-4 cursor-pointer transition-all duration-200 group active:bg-gray-100 ${isActive ? 'bg-orange-50/50' : 'hover:bg-gray-50/30'
                                    }`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 transition-transform group-hover:scale-110 ${isActive
                                        ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-200'
                                        : 'bg-white border-gray-200 text-gray-600'
                                        }`}>
                                        {item.abbr || item.planet.substring(0, 2)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-bold text-lg leading-tight transition-colors ${isActive ? 'text-orange-950' : 'text-gray-800'
                                            }`}>
                                            {item.planet}
                                        </span>
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                                            Ending Date
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`font-mono font-bold text-lg tracking-tight ${isActive ? 'text-orange-700' : 'text-gray-900'
                                        }`}>
                                        {item.end_date}
                                    </span>
                                    <ChevronRight size={20} className={`${isActive ? 'text-orange-400' : 'text-gray-300'} group-hover:translate-x-1 transition-transform`} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Note (Screenshot Style) */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 italic">
                <p className="text-[13px] text-orange-600 font-bold leading-relaxed mb-1">
                    Note :- Click on row above for sub-period.
                </p>
                <p className="text-[13px] text-orange-600 font-bold leading-relaxed">
                    Date mentioned above are ending dates.
                </p>
            </div>
        </div>
    );
};

export default DashaTable;
