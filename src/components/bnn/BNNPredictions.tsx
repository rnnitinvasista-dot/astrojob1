import React from 'react';
import {
    BNN_EDUCATION_COMBINATIONS,
    BNN_JOB_COMBINATIONS,
    BNN_WEALTH_COMBINATIONS,
    BNN_MARRIAGE_MALE_COMBINATIONS,
    BNN_MARRIAGE_FEMALE_COMBINATIONS,
    BNN_MARRIAGE_DIVORCE_COMBINATIONS,
    BNN_HEALTH_MALE_COMBINATIONS,
    BNN_HEALTH_FEMALE_COMBINATIONS,
    BNN_WIFE_HEALTH_COMBINATIONS,
    BNN_COMMON_HEALTH_COMBINATIONS,
    BNN_PROPERTY_COMBINATIONS,
    BNN_RELATION_COMBINATIONS,
    BNN_CHILDREN_COMBINATIONS,
    BNN_DEGREE_COMBINATIONS
} from '../../utils/bnnCombinations';
import type { BNNCombination, BNNDegreeCombination } from '../../utils/bnnCombinations';
import type { Planet } from '../../types/astrology';

interface BNNPredictionsProps {
    groupedPlanets: {
        NORTH: Planet[];
        EAST: Planet[];
        SOUTH: Planet[];
        WEST: Planet[];
    };
    gender: 'Male' | 'Female' | 'Others';
}

const getPlanetCode = (planet: string) => {
    const p = planet.toUpperCase();
    if (p.startsWith('RA')) return 'RA';
    if (p.startsWith('KE')) return 'KE';
    return p.slice(0, 2);
};

const getPredictionsForGroup = (planets: Planet[], combinations: BNNCombination[]) => {
    const results: { code: string; text: string }[] = [];
    const usedPlanets = new Set<string>();
    
    const inputNames = planets.map(p => p.planet.toUpperCase());
    const sortedInput = [...inputNames].sort();

    const sortedCombos = [...combinations].sort((a, b) => b.planets.length - a.planets.length);

    for (const combo of sortedCombos) {
        const comboSorted = [...combo.planets].sort();
        const isSubset = comboSorted.every(p => sortedInput.includes(p));

        if (isSubset) {
            if (combo.planets.length === 1 && usedPlanets.has(combo.planets[0])) {
                continue;
            }

            const code = combo.planets.map(getPlanetCode).join('+');
            results.push({ code, text: combo.result });
            combo.planets.forEach(p => usedPlanets.add(p));
        }
    }
    return results;
};

const getDegreePredictions = (planets: Planet[], combinations: BNNDegreeCombination[]) => {
    const results: { code: string; text: string }[] = [];
    
    for (const combo of combinations) {
        const p1 = planets.find(p => p.planet.toUpperCase() === combo.p1 || (combo.p1 === 'RA' && p.planet.toUpperCase().startsWith('RA')) || (combo.p1 === 'KE' && p.planet.toUpperCase().startsWith('KE')));
        const p2 = planets.find(p => p.planet.toUpperCase() === combo.p2 || (combo.p2 === 'RA' && p.planet.toUpperCase().startsWith('RA')) || (combo.p2 === 'KE' && p.planet.toUpperCase().startsWith('KE')));

        if (p1 && p2 && p1.degree_decimal !== undefined && p2.degree_decimal !== undefined) {
            const diff = Math.abs(p1.degree_decimal - p2.degree_decimal);
            if (diff <= combo.maxDiff) {
                const code = `${p1.planet.toUpperCase().slice(0,2)}+${p2.planet.toUpperCase().slice(0,2)}`;
                results.push({ code, text: combo.result });
            }
        }
    }
    return results;
};

const BNNPredictions: React.FC<BNNPredictionsProps> = ({ groupedPlanets, gender }) => {
    // Collect all unique predictions from all 4 directions for a given combo set
    const gatherAll = (comboList: BNNCombination[]) => {
        const all: { code: string; text: string }[] = [];
        const seenTexts = new Set<string>();

        const dirs = ['NORTH', 'EAST', 'SOUTH', 'WEST'] as const;
        for (const dir of dirs) {
            const res = getPredictionsForGroup(groupedPlanets[dir], comboList);
            for (const r of res) {
                if (!seenTexts.has(r.text)) {
                    all.push(r);
                    seenTexts.add(r.text);
                }
            }
        }
        return all;
    };

    const eduResults = gatherAll(BNN_EDUCATION_COMBINATIONS);
    const jobResults = gatherAll(BNN_JOB_COMBINATIONS);
    const wealthResults = gatherAll(BNN_WEALTH_COMBINATIONS);
    
    // Marriage Logic
    const marriageCombos = gender === 'Female' ? BNN_MARRIAGE_FEMALE_COMBINATIONS : BNN_MARRIAGE_MALE_COMBINATIONS;
    const marriageBase = gatherAll(marriageCombos);
    const divorceResults = gatherAll(BNN_MARRIAGE_DIVORCE_COMBINATIONS);
    
    // Deduplicate combined marriage results
    const finalMarriage: { code: string; text: string }[] = [];
    const seenMatchTexts = new Set<string>();
    [...marriageBase, ...divorceResults].forEach(r => {
        if (!seenMatchTexts.has(r.text)) {
            finalMarriage.push(r);
            seenMatchTexts.add(r.text);
        }
    });

    // Health Logic
    const healthCombos = gender === 'Female' ? BNN_HEALTH_FEMALE_COMBINATIONS : BNN_HEALTH_MALE_COMBINATIONS;
    const healthBase = gatherAll(healthCombos);
    const commonHealth = gatherAll(BNN_COMMON_HEALTH_COMBINATIONS);
    const wifeHealth = gender === 'Male' ? gatherAll(BNN_WIFE_HEALTH_COMBINATIONS) : [];

    const finalHealth: { code: string; text: string }[] = [];
    const seenHealthTexts = new Set<string>();
    [...healthBase, ...commonHealth].forEach(r => {
        if (!seenHealthTexts.has(r.text)) {
            finalHealth.push(r);
            seenHealthTexts.add(r.text);
        }
    });

    const propertyResults = gatherAll(BNN_PROPERTY_COMBINATIONS);
    const relationResults = gatherAll(BNN_RELATION_COMBINATIONS);
    
    // Children Logic
    const childrenBase = gatherAll(BNN_CHILDREN_COMBINATIONS);
    const degreeResults: { code: string; text: string }[] = [];
    const seenDegreeTexts = new Set<string>();
    
    (['NORTH', 'EAST', 'SOUTH', 'WEST'] as const).forEach(dir => {
        const res = getDegreePredictions(groupedPlanets[dir], BNN_DEGREE_COMBINATIONS);
        res.forEach(r => {
            if (!seenDegreeTexts.has(r.text)) {
                degreeResults.push(r);
                seenDegreeTexts.add(r.text);
            }
        });
    });

    const childrenResults = [...childrenBase, ...degreeResults];

    const renderSection = (title: string, results: { code: string; text: string }[]) => {
        if (results.length === 0) return null;
        return (
            <div style={{ marginBottom: '2.5rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                <h3 style={{
                    color: '#8b0000',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {title}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {results.map((res, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            borderBottom: '1px solid rgba(0,0,0,0.1)',
                            padding: '12px 0',
                            alignItems: 'center',
                            gap: '2rem'
                        }}>
                            <div style={{
                                minWidth: '120px',
                                fontWeight: '900',
                                color: '#1e293b',
                                fontSize: '1.05rem',
                                flexShrink: 0,
                                textAlign: 'left',
                                background: 'rgba(0,0,0,0.03)',
                                padding: '4px 8px',
                                borderRadius: '4px'
                            }}>
                                {res.code}
                            </div>
                            <div style={{
                                flex: 1,
                                fontSize: '1rem',
                                color: '#334155',
                                lineHeight: '1.5',
                                fontWeight: '600'
                            }}>
                                {res.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div style={{
            background: 'url("https://www.transparenttextures.com/patterns/old-wall.png"), #fdf5e6',
            padding: '3rem 1.5rem',
            minHeight: '400px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <h2 style={{
                textAlign: 'center',
                color: '#3e2723',
                fontSize: '2.2rem',
                fontWeight: '900',
                marginBottom: '0.8rem',
                textTransform: 'uppercase'
            }}>
                Life Predictions
            </h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem', gap: '12px' }}>
                <div style={{ width: '60px', height: '1.5px', background: '#3e2723', opacity: 0.6 }}></div>
                <div style={{ display: 'flex', gap: '4px', fontSize: '1.4rem' }}>
                    <span>🍃</span>
                    <span>🍃</span>
                </div>
                <div style={{ width: '60px', height: '1.5px', background: '#3e2723', opacity: 0.6 }}></div>
            </div>

            {renderSection('EDUCATION', eduResults)}
            {renderSection('JOB', jobResults)}
            {renderSection('WEALTH', wealthResults)}
            {renderSection('MARRIAGE', finalMarriage)}
            
            {renderSection('HEALTH', finalHealth)}
            {renderSection('PROPERTY & VEHICLE', propertyResults)}
            {renderSection('FAMILY & RELATIONS', relationResults)}
            {renderSection('CHILDREN', childrenResults)}
            {gender === 'Male' && renderSection('WIFE HEALTH THROUGH MALE’S CHART', wifeHealth)}

            {(eduResults.length + jobResults.length + wealthResults.length + finalMarriage.length + finalHealth.length + propertyResults.length + relationResults.length + childrenResults.length + wifeHealth.length) === 0 && (
                <div style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic', marginTop: '3rem' }}>
                    No specific BNN combinations found for this chart.
                </div>
            )}
        </div>
    );
};

export default BNNPredictions;
