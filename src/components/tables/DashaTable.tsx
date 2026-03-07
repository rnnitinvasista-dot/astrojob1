import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { Dasha, DashaSequenceItem } from '../../types/astrology';

interface DashaTableProps {
    dasha: Dasha;
}

const DashaTable: React.FC<DashaTableProps> = ({ dasha }) => {
    const [expandedMD, setExpandedMD] = useState<number | null>(null);
    const [expandedBH, setExpandedBH] = useState<string | null>(null);
    const [expandedAB, setExpandedAB] = useState<string | null>(null);
    const [expandedPR, setExpandedPR] = useState<string | null>(null);

    // Auto-expand current period on load
    useEffect(() => {
        if (dasha && dasha.mahadasha_sequence) {
            const mdIdx = dasha.mahadasha_sequence.findIndex(md => md.planet === dasha.dasha);
            if (mdIdx !== -1) {
                setExpandedMD(mdIdx);
                const bhIdx = dasha.mahadasha_sequence[mdIdx].bhuktis?.findIndex(bh => bh.planet === dasha.bhukti);
                if (bhIdx !== undefined && bhIdx !== -1) {
                    setExpandedBH(`${mdIdx}-${bhIdx}`);
                    const abIdx = dasha.mahadasha_sequence[mdIdx].bhuktis?.[bhIdx].antar_bhuktis?.findIndex(ab => ab.planet === dasha.antar_bhukti);
                    if (abIdx !== undefined && abIdx !== -1) {
                        setExpandedAB(`${mdIdx}-${bhIdx}-${abIdx}`);
                        const prIdx = dasha.mahadasha_sequence[mdIdx].bhuktis?.[bhIdx].antar_bhuktis?.[abIdx].pratyantars?.findIndex(pr => pr.planet === dasha.pratyantar);
                        if (prIdx !== undefined && prIdx !== -1) {
                            setExpandedPR(`${mdIdx}-${bhIdx}-${abIdx}-${prIdx}`);
                        }
                    }
                }
            }
        }
    }, [dasha]);

    const toggleMD = (idx: number) => {
        setExpandedMD(expandedMD === idx ? null : idx);
        setExpandedBH(null);
        setExpandedAB(null);
        setExpandedPR(null);
    };

    const toggleBH = (mdIdx: number, bhIdx: number) => {
        const key = `${mdIdx}-${bhIdx}`;
        setExpandedBH(expandedBH === key ? null : key);
        setExpandedAB(null);
        setExpandedPR(null);
    };

    const toggleAB = (mdIdx: number, bhIdx: number, abIdx: number) => {
        const key = `${mdIdx}-${bhIdx}-${abIdx}`;
        setExpandedAB(expandedAB === key ? null : key);
        setExpandedPR(null);
    };

    const togglePR = (mdIdx: number, bhIdx: number, abIdx: number, prIdx: number) => {
        const key = `${mdIdx}-${bhIdx}-${abIdx}-${prIdx}`;
        setExpandedPR(expandedPR === key ? null : key);
    };

    return (
        <div className="w-full space-y-6">
            {/* Professional Summary Header */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm" style={{ borderTop: '5px solid #3b82f6' }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <span className="bg-blue-600 text-white p-1.5 rounded-lg">🕉️</span>
                        VIMSHOTTARI DASHA SUMMARY
                    </h3>
                    <div className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
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

            {/* Integrated Nested Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ borderTop: '5px solid #3b82f6' }}>
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-blue-900 font-bold text-lg">Vimshottari Dasha Sequence</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-gray-50/50 text-gray-500 uppercase text-[10px] font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-4 border-b border-gray-100">Planet Period</th>
                                <th className="px-6 py-4 border-b border-gray-100">Start Date & Time</th>
                                <th className="px-6 py-4 border-b border-gray-100">End Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dasha.mahadasha_sequence.map((md, mdIdx) => (
                                <React.Fragment key={mdIdx}>
                                    {/* Mahadasha Row */}
                                    <tr
                                        onClick={() => toggleMD(mdIdx)}
                                        className={`cursor-pointer transition-colors border-b border-gray-100 ${md.planet === dasha.dasha ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                                    >
                                        <td className="px-6 py-4 font-black flex items-center gap-3">
                                            {expandedMD === mdIdx ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            {md.planet} Mahadasha
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs opacity-80">{md.start_date}</td>
                                        <td className="px-6 py-4 font-mono text-xs opacity-80">{md.end_date}</td>
                                    </tr>

                                    {/* Bhukti Level */}
                                    {expandedMD === mdIdx && md.bhuktis?.map((bh, bhIdx) => (
                                        <React.Fragment key={`${mdIdx}-${bhIdx}`}>
                                            <tr
                                                onClick={(e) => { e.stopPropagation(); toggleBH(mdIdx, bhIdx); }}
                                                className={`cursor-pointer border-b border-gray-100 ${bh.planet === dasha.bhukti ? 'bg-green-700 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                                            >
                                                <td className="px-12 py-3 font-bold flex items-center gap-2">
                                                    {expandedBH === `${mdIdx}-${bhIdx}` ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                    {bh.planet} Bhukti
                                                </td>
                                                <td className="px-6 py-3 font-mono text-[11px] opacity-80">{bh.start_date}</td>
                                                <td className="px-6 py-3 font-mono text-[11px] opacity-80">{bh.end_date}</td>
                                            </tr>

                                            {/* Antar Bhukti Level */}
                                            {expandedBH === `${mdIdx}-${bhIdx}` && bh.antar_bhuktis?.map((ab, abIdx) => (
                                                <React.Fragment key={`${mdIdx}-${bhIdx}-${abIdx}`}>
                                                    <tr
                                                        onClick={(e) => { e.stopPropagation(); toggleAB(mdIdx, bhIdx, abIdx); }}
                                                        className={`cursor-pointer border-b border-gray-100 ${ab.planet === dasha.antar_bhukti ? 'bg-amber-700 text-white' : 'bg-white hover:bg-gray-50'}`}
                                                    >
                                                        <td className="px-20 py-2.5 font-semibold text-xs flex items-center gap-2">
                                                            {expandedAB === `${mdIdx}-${bhIdx}-${abIdx}` ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                                                            {ab.planet} Antar Bhukti
                                                        </td>
                                                        <td className="px-6 py-2.5 font-mono text-[10px] opacity-70 italic">{ab.start_date}</td>
                                                        <td className="px-6 py-2.5 font-mono text-[10px] opacity-70 italic">{ab.end_date}</td>
                                                    </tr>

                                                    {/* Pratyantar Level */}
                                                    {expandedAB === `${mdIdx}-${bhIdx}-${abIdx}` && ab.pratyantars?.map((pr, prIdx) => (
                                                        <React.Fragment key={`${mdIdx}-${bhIdx}-${abIdx}-${prIdx}`}>
                                                            <tr
                                                                onClick={(e) => { e.stopPropagation(); togglePR(mdIdx, bhIdx, abIdx, prIdx); }}
                                                                className={`cursor-pointer border-b border-gray-100 ${pr.planet === dasha.pratyantar ? 'bg-orange-700 text-white' : 'bg-gray-50/50 hover:bg-gray-100'}`}
                                                            >
                                                                <td className="px-28 py-2 text-xs flex items-center gap-2">
                                                                    {expandedPR === `${mdIdx}-${bhIdx}-${abIdx}-${prIdx}` ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                                                                    • {pr.planet} Pratyantar
                                                                </td>
                                                                <td className="px-6 py-2 font-mono text-[10px] opacity-60 underline underline-offset-2">{pr.start_date}</td>
                                                                <td className="px-6 py-2 font-mono text-[10px] opacity-60 underline underline-offset-2">{pr.end_date}</td>
                                                            </tr>

                                                            {/* Sukshma Level */}
                                                            {expandedPR === `${mdIdx}-${bhIdx}-${abIdx}-${prIdx}` && pr.sukshmas?.map((sk, skIdx) => (
                                                                <tr
                                                                    key={`${mdIdx}-${bhIdx}-${abIdx}-${prIdx}-${skIdx}`}
                                                                    className={`border-b border-gray-50 ${sk.planet === dasha.sukshma ? 'bg-stone-800 text-white' : 'bg-white hover:bg-stone-50'}`}
                                                                >
                                                                    <td className="px-36 py-1.5 text-[11px] font-medium flex items-center gap-2">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                                                                        {sk.planet} Sukshma
                                                                    </td>
                                                                    <td className="px-6 py-1.5 font-mono text-[9px] opacity-60">{sk.start_date}</td>
                                                                    <td className="px-6 py-1.5 font-mono text-[9px] opacity-60">{sk.end_date}</td>
                                                                </tr>
                                                            ))}
                                                        </React.Fragment>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashaTable;
