import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Prediction {
    overall_combination: {
        good: number[];
        medium: number[];
        bad: number[];
    };
    income_expenses: {
        good: string;
        bad: string;
    };
    success_rate: string;
    job_areas: string[];
    hits: {
        pl: number | null;
        nl: number | null;
        sl: number | null;
    };
}

interface PlanetReport {
    planet: string;
    star_lord: string;
    sub_lord: string;
    pl: number[];
    nl: number[];
    sl: number[];
    prediction: Prediction;
}

interface JobAnalysisData {
    status: string;
    message?: string;
    csl_focus: {
        csl6: string;
        csl10: string;
    };
    dasha_info: {
        dasha: string;
        bhukti: string;
        antara: string;
    };
    reports: PlanetReport[];
}

interface JobResultsProps {
    data: JobAnalysisData;
}

const JobResults: React.FC<JobResultsProps> = ({ data }) => {
    const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);

    if (!data) return <div className="p-8 text-center text-gray-500 italic">No analysis data available.</div>;

    // Auto-scroll to top on mount
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (data.status === 'error') return <div className="p-4 text-red-500 font-bold border border-red-200 rounded-lg bg-red-50">Error: {data.message || 'Analysis failed.'}</div>;

    const { reports = [] } = data;

    const getHouseColorFromCombo = (h: number, combo: Prediction['overall_combination']) => {
        if (combo.good.includes(h)) return 'text-green-600';
        if (combo.medium.includes(h)) return 'text-blue-600';
        if (combo.bad.includes(h)) return 'text-red-600';
        return 'text-gray-800';
    };

    const renderLevelRow = (label: string, lord: string, houses: number[] = [], hit: number | null, percent: string, combo: Prediction['overall_combination']) => {
        const safeHouses = houses || [];
        // Group by color for display logic
        const good = safeHouses.filter(h => combo.good.includes(h));
        const medium = safeHouses.filter(h => combo.medium.includes(h));
        const bad = safeHouses.filter(h => combo.bad.includes(h));

        return (
            <tr className="border-b border-gray-300">
                <td className="w-1/3 p-2 border-r border-gray-300 bg-gray-50 font-black text-[10px] uppercase">
                    {lord} ({label}) <span className="opacity-60">{percent}</span>
                </td>
                <td className="w-1/3 p-2 text-center" style={{ border: '2px solid #16a34a' }}>
                    <div className="flex flex-wrap justify-center gap-1 font-bold text-sm">
                        {[...good, ...medium].map((h, i) => (
                            <React.Fragment key={i}>
                                <div className={`inline-flex items-center justify-center ${h === hit ? 'w-6 h-6 rounded-full border border-black' : ''} ${combo.good.includes(h) ? 'text-green-600' : 'text-blue-600'}`}>
                                    {h}
                                </div>
                                {i < ([...good, ...medium].length - 1) && <span className="text-gray-400">,</span>}
                            </React.Fragment>
                        ))}
                        {[...good, ...medium].length === 0 && <span className="text-gray-300">-</span>}
                    </div>
                </td>
                <td className="w-1/3 p-2 text-center" style={{ border: '2px solid #dc2626' }}>
                    <div className="flex flex-wrap justify-center gap-1 font-bold text-sm text-red-600">
                        {bad.map((h, i) => (
                            <React.Fragment key={i}>
                                <div className={`inline-flex items-center justify-center ${h === hit ? 'w-6 h-6 rounded-full border border-black' : ''}`}>
                                    {h}
                                </div>
                                {i < (bad.length - 1) && <span className="text-gray-400">,</span>}
                            </React.Fragment>
                        ))}
                        {bad.length === 0 && <span className="text-gray-300">-</span>}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="max-w-md mx-auto p-2 bg-white min-h-screen font-sans">
            {/* Minimal Header to match screenshot */}
            <div className="mb-4">
                <div className="border-2 border-amber-500 rounded-lg p-3 flex justify-between items-center bg-amber-50 shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-black text-amber-900">HIT THEORY DASHBOARD</span>
                    </div>
                    <div className="flex flex-col items-end leading-tight">
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {reports.map((report) => {
                    const { planet, star_lord, sub_lord, pl = [], nl = [], sl = [], prediction } = report;
                    const isExpanded = expandedPlanet === planet;
                    const sp = prediction || { overall_combination: { good: [], medium: [], bad: [] }, hits: {}, success_rate: 'Stable' };
                    const combo = sp.overall_combination || { good: [], medium: [], bad: [] };
                    const planetShort = planet.substring(0, 2).toUpperCase();

                    return (
                        <div key={planet} className="border-2 border-gray-400 rounded-lg overflow-hidden bg-white mb-6 shadow-md">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#1e293b] text-white">
                                        <th className="p-2 border-r border-white/30 text-sm font-black uppercase text-left w-1/3">{planet}</th>
                                        <th className="p-2 border-r border-white/30 text-sm font-black uppercase w-1/3 text-center">Gains</th>
                                        <th className="p-2 text-sm font-black uppercase w-1/3 text-center">Loss</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* PL Row */}
                                    <tr className="border-b border-gray-300">
                                        <td className="p-2 border-r border-gray-300 bg-gray-50 font-black text-[10px] uppercase">{planetShort} (PL) 20%</td>
                                        <td className="p-2 border-r border-gray-300 border-2 border-green-600 text-center">
                                            <div className="flex flex-wrap justify-center gap-1 font-bold text-sm">
                                                {pl.filter(h => !combo.bad.includes(h)).map((h, i) => (
                                                    <React.Fragment key={i}>
                                                        <div className={`inline-flex items-center justify-center ${h === sp.hits?.pl ? 'w-6 h-6 rounded-full border border-black' : ''} ${getHouseColorFromCombo(h, combo)}`}>
                                                            {h}
                                                        </div>
                                                        {i < pl.filter(h => !combo.bad.includes(h)).length - 1 && <span className="text-gray-400">,</span>}
                                                    </React.Fragment>
                                                ))}
                                                {pl.filter(h => !combo.bad.includes(h)).length === 0 && <span className="text-gray-300">-</span>}
                                            </div>
                                        </td>
                                        <td className="p-2 border-2 border-red-600 text-center">
                                            <div className="flex flex-wrap justify-center gap-1 font-bold text-sm text-red-600">
                                                {pl.filter(h => combo.bad.includes(h)).map((h, i) => (
                                                    <React.Fragment key={i}>
                                                        <div className={`inline-flex items-center justify-center ${h === sp.hits?.pl ? 'w-6 h-6 rounded-full border border-black' : ''}`}>
                                                            {h}
                                                        </div>
                                                        {i < pl.filter(h => combo.bad.includes(h)).length - 1 && <span className="text-gray-400">,</span>}
                                                    </React.Fragment>
                                                ))}
                                                {pl.filter(h => combo.bad.includes(h)).length === 0 && <span className="text-gray-300">-</span>}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* NL Row */}
                                    {renderLevelRow('NL', star_lord.substring(0, 2).toUpperCase(), nl, sp.hits?.nl, '30%', combo)}

                                    {/* SL Row */}
                                    {renderLevelRow('SL', sub_lord.substring(0, 2).toUpperCase(), sl, sp.hits?.sl, '50%', combo)}

                                    {/* COMBINATION Row */}
                                    <tr className="border-b border-gray-300">
                                        <td className="p-2 border-r border-gray-300 bg-gray-50 font-black text-xs uppercase text-left">
                                            COMBINATION
                                        </td>
                                        <td className="p-2 text-center" style={{ border: '2px solid #16a34a' }}>
                                            <div className="flex flex-wrap justify-center gap-1 font-black text-lg">
                                                {[...combo.good, ...combo.medium].map((h, i) => {
                                                    const isHit = h === sp.hits?.pl || h === sp.hits?.nl || h === sp.hits?.sl;
                                                    return (
                                                        <React.Fragment key={i}>
                                                            <div className={`inline-flex items-center justify-center ${isHit ? 'w-8 h-8 rounded-full border-2 border-green-600 text-green-600' : combo.good.includes(h) ? 'text-green-600' : 'text-blue-600'}`}>
                                                                {h}
                                                            </div>
                                                            {i < ([...combo.good, ...combo.medium].length - 1) && <span className="text-gray-400">,</span>}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="p-2 text-center" style={{ border: '2px solid #dc2626' }}>
                                            <div className="flex flex-wrap justify-center gap-1 font-black text-lg text-red-600">
                                                {(combo.bad || []).map((h, i) => {
                                                    const isHit = h === sp.hits?.pl || h === sp.hits?.nl || h === sp.hits?.sl;
                                                    return (
                                                        <React.Fragment key={i}>
                                                            <div className={`inline-flex items-center justify-center ${isHit ? 'w-8 h-8 rounded-full border-2 border-red-600' : ''}`}>
                                                                {h}
                                                            </div>
                                                            {i < ((combo.bad || []).length - 1) && <span className="text-gray-400">,</span>}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* INCOME / EXPENSES Row */}
                                    <tr className="border-b border-gray-300 text-center font-black">
                                        <td className="p-2 border-r border-gray-300 bg-gray-50 text-xs uppercase text-left">
                                            MONEY STATUS
                                        </td>
                                        <td className="p-2 border-r border-gray-300 text-green-600 text-sm">
                                            {sp.income_expenses?.good || '-'}
                                        </td>
                                        <td className="p-2 text-red-600 text-sm">
                                            {sp.income_expenses?.bad || '-'}
                                        </td>
                                    </tr>

                                    {/* SUCCESS RATE Row */}
                                    <tr
                                        className="cursor-pointer"
                                        onClick={() => setExpandedPlanet(isExpanded ? null : planet)}
                                    >
                                        <td className="p-2 border-r border-gray-300 bg-gray-50 font-black text-xs uppercase text-left">
                                            SUCCESS RATE
                                        </td>
                                        <td colSpan={2} className="p-2 text-center">
                                            <div className="flex justify-between items-center px-4 font-black">
                                                <span className="text-green-600">{sp.success_rate} success in Job</span>
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* AREA OF JOB Expanded Panel */}
                            {isExpanded && (
                                <div className="p-4 border-t border-gray-400 bg-white">
                                    <div className="flex border-t border-gray-200 pt-2">
                                        <div className="w-1/4 font-black text-xs uppercase pt-1">AREA OF JOB</div>
                                        <div className="w-3/4 space-y-4">
                                            {sp.job_areas && sp.job_areas.length > 0 ? (
                                                sp.job_areas.map((area, i) => {
                                                    const cleanArea = area.replace('Primary: ', '').replace('Secondary: ', '').replace('Focus: ', '');
                                                    // Split by commas if too long or just show as bullet
                                                    return (
                                                        <div key={i} className="flex items-start gap-2 text-green-700 font-bold text-sm leading-relaxed">
                                                            <span className="text-xl leading-none mt-1">•</span>
                                                            <span>{cleanArea}</span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-gray-400 italic text-xs">Analysis pending...</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Diagnostics Removed per User Request */}
        </div>
    );
};

export default JobResults;
