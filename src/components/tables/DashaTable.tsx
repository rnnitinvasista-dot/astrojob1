import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Dasha, DashaSequenceItem } from '../../types/astrology';

interface DashaTableProps {
    dasha: Dasha;
}

const DashaTable: React.FC<DashaTableProps> = ({ dasha }) => {
    // Level selections
    const [selectedMD, setSelectedMD] = useState<DashaSequenceItem | null>(null);
    const [selectedBH, setSelectedBH] = useState<DashaSequenceItem | null>(null);
    const [selectedAB, setSelectedAB] = useState<DashaSequenceItem | null>(null);
    const [selectedPR, setSelectedPR] = useState<DashaSequenceItem | null>(null);

    // Auto-select current dasha periods on load
    useEffect(() => {
        if (dasha && dasha.mahadasha_sequence) {
            const activeMD = dasha.mahadasha_sequence.find(m => m.planet === dasha.dasha);
            if (activeMD) {
                setSelectedMD(activeMD);
                const activeBH = activeMD.bhuktis?.find(b => b.planet === dasha.bhukti);
                if (activeBH) {
                    setSelectedBH(activeBH);
                    const activeAB = activeBH.antar_bhuktis?.find(a => a.planet === dasha.antar_bhukti);
                    if (activeAB) {
                        setSelectedAB(activeAB);
                        const activePR = activeAB.pratyantars?.find(p => p.planet === dasha.pratyantar);
                        if (activePR) {
                            setSelectedPR(activePR);
                        }
                    }
                }
            }
        }
    }, [dasha]);

    const renderTable = (
        title: string,
        items: DashaSequenceItem[] | undefined,
        selectedItem: DashaSequenceItem | null,
        onSelect: (item: DashaSequenceItem) => void,
        activePlanet: string,
        levelColor: string
    ) => {
        if (!items || items.length === 0) return null;

        return (
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 text-white font-bold flex justify-between items-center" style={{ backgroundColor: levelColor }}>
                    <span>{title}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider">Sequential View</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-[10px] font-bold tracking-wider">
                            <tr>
                                <th className="px-4 py-3 border-b border-gray-200">Planet</th>
                                <th className="px-4 py-3 border-b border-gray-200">Start Date & Time</th>
                                <th className="px-4 py-3 border-b border-gray-200">End Date & Time</th>
                                <th className="px-4 py-3 border-b border-gray-200 w-12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => {
                                const isActive = item.planet === activePlanet;
                                const isSelected = selectedItem?.planet === item.planet;

                                return (
                                    <tr
                                        key={idx}
                                        onClick={() => onSelect(item)}
                                        className={`cursor-pointer transition-all duration-200 ${isActive ? 'bg-amber-50' : isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <td className="px-4 py-3 border-b border-gray-100 font-bold">
                                            <div className="flex items-center gap-2">
                                                <span className={isActive ? 'text-amber-700' : isSelected ? 'text-blue-700' : 'text-gray-900'}>
                                                    {item.planet}
                                                </span>
                                                {isActive && (
                                                    <span className="text-[9px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className={`px-4 py-3 border-b border-gray-100 font-mono text-xs ${isActive ? 'text-amber-600' : 'text-gray-500'}`}>
                                            {item.start_date}
                                        </td>
                                        <td className={`px-4 py-3 border-b border-gray-100 font-mono text-xs ${isActive ? 'text-amber-600' : 'text-gray-500'}`}>
                                            {item.end_date}
                                        </td>
                                        <td className="px-4 py-3 border-b border-gray-100 text-right">
                                            <ChevronRight size={18} className={`${isSelected ? 'text-blue-600' : isActive ? 'text-amber-400' : 'text-gray-300'}`} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full p-2 md:p-6 space-y-2 bg-gray-50/50">
            {/* Professional Summary Header */}
            <div className="bg-white p-5 rounded-xl mb-8 border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <span className="bg-blue-600 text-white p-1.5 rounded-lg">🕉️</span>
                        VIMSHOTTARI DASHA
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                        BALANCE AT BIRTH: <span className="text-blue-700 underline">{dasha.balance_at_birth}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                        { label: 'Dasha', value: dasha.dasha, color: '#1d4ed8', bg: 'bg-blue-50' },
                        { label: 'Bhukti', value: dasha.bhukti, color: '#15803d', bg: 'bg-green-50' },
                        { label: 'Antar Bhukti', value: dasha.antar_bhukti, color: '#b45309', bg: 'bg-amber-50' },
                        { label: 'Pratyantar', value: dasha.pratyantar, color: '#7c2d12', bg: 'bg-orange-50' },
                        { label: 'Sukshma', value: dasha.sukshma, color: '#451a03', bg: 'bg-stone-50' }
                    ].map((item, i) => (
                        <div key={i} className={`${item.bg} p-3 rounded-lg border border-transparent hover:border-gray-200 transition-all`}>
                            <span className="text-[9px] block font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</span>
                            <span className="text-lg font-black block" style={{ color: item.color }}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sequential Tables Container */}
            <div className="max-w-4xl mx-auto space-y-4">
                {renderTable(
                    '1. DASHA (MAHADASHA)',
                    dasha.mahadasha_sequence,
                    selectedMD,
                    (item) => { setSelectedMD(item); setSelectedBH(null); setSelectedAB(null); setSelectedPR(null); },
                    dasha.dasha,
                    '#1d4ed8'
                )}

                {selectedMD && renderTable(
                    `2. BHUKTI OF ${selectedMD.planet}`,
                    selectedMD.bhuktis,
                    selectedBH,
                    (item) => { setSelectedBH(item); setSelectedAB(null); setSelectedPR(null); },
                    dasha.bhukti,
                    '#15803d'
                )}

                {selectedBH && renderTable(
                    `3. ANTAR BHUKTI OF ${selectedBH.planet}`,
                    selectedBH.antar_bhuktis,
                    selectedAB,
                    (item) => { setSelectedAB(item); setSelectedPR(null); },
                    dasha.antar_bhukti,
                    '#b45309'
                )}

                {selectedAB && renderTable(
                    `4. PRATYANTAR OF ${selectedAB.planet}`,
                    selectedAB.pratyantars,
                    selectedPR,
                    (item) => setSelectedPR(item),
                    dasha.pratyantar,
                    '#7c2d12'
                )}

                {selectedPR && renderTable(
                    `5. SUKSHMA OF ${selectedPR.planet}`,
                    selectedPR.sukshmas,
                    null,
                    () => { },
                    dasha.sukshma,
                    '#451a03'
                )}
            </div>
        </div>
    );
};

export default DashaTable;
