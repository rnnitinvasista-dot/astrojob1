import React, { useState } from 'react';
import type { NakshatraNadiItem, Planet } from '../../types/astrology';

interface JobPredictionTableProps {
    data: NakshatraNadiItem[];
    planets: Planet[];
    types: ('Dasha' | 'Bhukti' | 'Antara' | 'Sukshma')[];
    planetName: string;
    selectedArea: string;
}

const JOB_PROFESSION_MAP: Record<number, string> = {
    1: "Self effort job, Body or Mind Job, Psychiatrist, Nutritionist, Yoga, Gym instructor, Models Army, Military",
    2: "Bank, Investment business, Family business, Hotel industry, Gems, Jewelry business, Speakers, Singers, Marriage bureau, Food products, Dental, ENT specialist.",
    3: "CA, Bank, Accountancy, Retail, Commission agent, Sales, Marketing, Media, Journalism, Commerce, Tours and Travels, Software and Networking, Brokers, Sports.",
    4: "Institutions, Hospitality, Restaurants, Property, Farming and Agriculture, Vehicle dealer, Automobile engineering, Real Estate, Educationist, Civil works, Building Contractors, Rental, Team Leader, Teachers, Tuition’s, Vaastu Consultant.",
    5: "Actors, Film, Arts, Sports, Advertising, Product development, Children Play school, Any Consultation, Cinema, Multiplex, Entertainment, Event organizers or Games, Healing industry, Designer, Creative, Software field, Solution provider, Shares, Information technology, Architecture, Fashion, Child specialist.",
    6: "Service industry, All general jobs, Lawyers and Advocates, Money Lenders, Medicine field, CA, Financiers, Civil services, Banking, Dietician, Nursing, Pharmacy, Human resources, Army, Military, Airforce, Engineering filed.",
    7: "Business, Data sciences, Retail, Sales, Marketing, Logistics, Trading, Daily transaction, Dealers, Public relations, International sales, Banking services, Police, Army, Military.",
    8: "Technology, Research, Manufacturing, Astrology, Scientist, Insurance field, Occult science, Doctors, Surgeons, Agriculture, Petroleum, Oil industry, Excavators, Mines, Granite business.",
    9: "Professor, Preacher, NGO’s, Trusts, Old age homes, All type of Consultants, Tourism, Publication, Judges, Foreign travels, Immigration, Travel Job, Philosopher, Navy, Hospital Management.",
    10: "Government job, Civil services, All type of Manager’s, Any Authoritative job, Administrators, Politics, Corporate’s, CA's, MD, CEO's.",
    11: "Government job, NGO’s, Private clubs, Private Banks, Pubs and Restaurant, Any Business, Shares, Any profession is good.",
    12: "Research, Scientist, Abroad jobs, Hospitals, Doctors, Yoga, Astrology, MNC jobs, Job away from Birth Place, Old age homes, Export industry, Insurance field, Legal, Physiology, Health Consultant, Nursing, Script writer, Investigation and Detective."
};

const EDU_PROFESSION_MAP: Record<number, string> = {
    1: "Self-development Studies, Success through self, Physical training, Acting, Dance, Army, Military.",
    2: "Banking, Finance, Speech therapy, Family business, Gems, Jewelry, Food, Dental, Singers.",
    3: "Marketing, Sales, Retail, Communication, Accountancy, Software and Networking, Sports, Media, Short Travel, Broadcasting, IT, Tourism.",
    4: "Teaching, Institutions, any sort of Training, Team Leader, Hotel Management, Construction/Civil, Real estate, Farming, Automobile engineering.",
    5: "Creativity, Fashion, Product Development, Sports, Dancing, Media, Shares, Medicine, Gynecology, Entertainment, Event management, Film, Advertising, Software.",
    6: "Civil services, Medicine, Banking, Loan, Legal, Finance, Nursing, Dietician, Pharmacy, HR, Army, Military, Air force, Engineering.",
    7: "Business studies, Banking, International trade, Retail, Police, Army, Military.",
    8: "Technical or Research field, Manufacturing, Astrology, Insurance, Surgeons, Mines, Geologist, Oil studies, Crime, Priest study, Engineering.",
    9: "Publishers, Philosophy, Lecturer, Law, Judge, Immigration, Tourism, Travel, Navy, Management studies, Sports, Hospital management.",
    10: "Civil Services, Management study, Judge, Political studies, Mass communication, Administration, Masters.",
    11: "Good in any educational field selected.",
    12: "Interest in depth study of a Subject, Yoga, Hospital, Medicine, Nursing, Astrology, Psychology, Research, Detective, Script writer, Legal, Health, Export."
};

const MARRIAGE_RESULT_MAP: Record<number, string> = {
    1: "Single, Self Focus, Not interested or Partner discarding nature.",
    2: "Partnership focus, Marriage interest, Family addition.",
    3: "Cooperation, Negotiation, Comunicative in married life.",
    4: "Focus on individual goal, Working partner, Mother/In-law Involvement.",
    5: "Love, Selective choosing, Potential obstacles or separation mindset.",
    6: "No interest, Separation mindset, Money or Work focused partner.",
    7: "Marriage good, Partner helpful, Caring, Loving, Happy.",
    8: "Obstacles, Hindrances, Humiliation, Fear, Separation, Divorce.",
    9: "Elders approval, Father/In-law Involvement, Normal Marriage.",
    10: "Ego, Highly Selective, Aggressive behavior, Pride.",
    11: "Good Marriage, Gain in married life, Partner's Love.",
    12: "Detached mindset, Physical separation, Seclusion, Divorce."
};

const CHILD_BIRTH_RESULT_MAP: Record<number, string> = {
    1: "Difficulty in Child Birth.",
    2: "Child Birth Indicated.",
    3: "Neutral.",
    4: "Difficulty in Child Birth.",
    5: "Child Birth Indicated.",
    6: "Complication in Child Birth.",
    7: "Neutral.",
    8: "Complication in Child Birth.",
    9: "Child Birth Indicated with 2 or 5.",
    10: "Difficulty in Child Birth.",
    11: "Child Birth Indicated with 2 or 5.",
    12: "Complication in Child Birth."
};

const HEALTH_RESULT_MAP: Record<number, string> = {
    1: "Good Health, Recovery potential.",
    2: "Normal Health, Face/Eye area focus.",
    3: "Normal Health, Ears/Hands area.",
    4: "Long term or Incurable potential, High intensity.",
    5: "Robust Health, Active, Fast recovery.",
    6: "Small Disease, Acute issues.",
    7: "Normal Health, Kidneys/Urine area.",
    8: "Long Disease, Chronic issues, Surgery potential.",
    9: "God's Grace, Protection, Good Health.",
    10: "Significant Disease Name, Back/Knee area.",
    11: "Gain of health, Successful recovery.",
    12: "Hospitalization, Bed ridden, Feet area focus."
};

const JOB_SUCCESS_MATRIX: Record<number, Record<number, string>> = {
    1: { 1: "M", 2: "M", 3: "M", 4: "M", 5: "M", 6: "M", 7: "M", 8: "L", 9: "M", 10: "H", 11: "H", 12: "B!" },
    2: { 1: "H", 2: "H", 3: "M", 4: "H", 5: "H", 6: "E", 7: "H", 8: "M", 9: "H", 10: "H", 11: "E", 12: "M" },
    3: { 1: "L", 2: "M", 3: "M", 4: "M", 5: "M", 6: "M", 7: "M", 8: "L", 9: "M", 10: "H", 11: "H", 12: "B!" },
    4: { 1: "M", 2: "H", 3: "M", 4: "M", 5: "M", 6: "H", 7: "H", 8: "M", 9: "M", 10: "H", 11: "H", 12: "B!" },
    5: { 1: "M", 2: "M", 3: "M", 4: "M", 5: "M", 6: "M", 7: "M", 8: "B!", 9: "M", 10: "M", 11: "M", 12: "VB!" },
    6: { 1: "H", 2: "E", 3: "H", 4: "H", 5: "H", 6: "E", 7: "E", 8: "M", 9: "H", 10: "E", 11: "E", 12: "M" },
    7: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "E", 7: "H", 8: "M", 9: "H", 10: "H", 11: "E", 12: "M" },
    8: { 1: "L", 2: "M", 3: "L", 4: "L", 5: "B!", 6: "M", 7: "M", 8: "B!", 9: "L", 10: "M", 11: "M", 12: "VB!" },
    9: { 1: "M", 2: "H", 3: "M", 4: "M", 5: "M", 6: "H", 7: "H", 8: "L", 9: "H", 10: "H", 11: "H", 12: "B!" },
    10: { 1: "H", 2: "E", 3: "H", 4: "H", 5: "H", 6: "E", 7: "H", 8: "H", 9: "E", 10: "H", 11: "E", 12: "M" },
    11: { 1: "H", 2: "E", 3: "H", 4: "H", 5: "H", 6: "E", 7: "E", 8: "H", 9: "E", 10: "E", 11: "E", 12: "M" },
    12: { 1: "VB!", 2: "B!", 3: "VB!", 4: "VB!", 5: "VB!", 6: "B!", 7: "B!", 8: "VB!", 9: "B!", 10: "B!", 11: "B!", 12: "VB!" }
};

const EDU_SUCCESS_MATRIX: Record<number, Record<number, string>> = {
    1: { 1: "M", 2: "M", 3: "L", 4: "H", 5: "M", 6: "M", 7: "M", 8: "L", 9: "M", 10: "M", 11: "H", 12: "VB!" },
    2: { 1: "M", 2: "M", 3: "M", 4: "H", 5: "M", 6: "M", 7: "M", 8: "M", 9: "H", 10: "H", 11: "E", 12: "M" },
    3: { 1: "L", 2: "M", 3: "L", 4: "M", 5: "L", 6: "L", 7: "M", 8: "B!", 9: "M", 10: "M", 11: "M", 12: "VB!" },
    4: { 1: "H", 2: "H", 3: "M", 4: "H", 5: "M", 6: "M", 7: "M", 8: "M", 9: "H", 10: "H", 11: "E", 12: "M" },
    5: { 1: "M", 2: "M", 3: "L", 4: "M", 5: "M", 6: "L", 7: "M", 8: "L", 9: "L", 10: "M", 11: "H", 12: "B!" },
    6: { 1: "M", 2: "M", 3: "L", 4: "M", 5: "L", 6: "L", 7: "M", 8: "B!", 9: "L", 10: "M", 11: "H", 12: "VB!" },
    7: { 1: "M", 2: "M", 3: "M", 4: "M", 5: "M", 6: "M", 7: "M", 8: "M", 9: "M", 10: "H", 11: "H", 12: "B!" },
    8: { 1: "B!", 2: "M", 3: "B!", 4: "M", 5: "B!", 6: "B!", 7: "M", 8: "B!", 9: "L", 10: "M", 11: "M", 12: "VB!" },
    9: { 1: "M", 2: "H", 3: "M", 4: "H", 5: "L", 6: "L", 7: "M", 8: "L", 9: "M", 10: "H", 11: "E", 12: "M" },
    10: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "E", 12: "M" },
    11: { 1: "H", 2: "E", 3: "H", 4: "E", 5: "H", 6: "H", 7: "H", 8: "H", 9: "E", 10: "E", 11: "E", 12: "M" },
    12: { 1: "B!", 2: "M", 3: "VB!", 4: "M", 5: "B!", 6: "VB!", 7: "VB!", 8: "VB!", 9: "B!", 10: "M", 11: "M", 12: "VB!" }
};

const MARRIAGE_SUCCESS_MATRIX: Record<number, Record<number, string>> = {
    1: { 1: "B", 2: "M", 3: "B", 4: "B", 5: "B", 6: "VB", 7: "L", 8: "B", 9: "L", 10: "VB", 11: "M", 12: "B" },
    2: { 1: "M", 2: "E", 3: "M", 4: "M", 5: "M", 6: "M", 7: "E", 8: "M", 9: "E", 10: "M", 11: "E", 12: "M" },
    3: { 1: "B", 2: "M", 3: "L", 4: "L", 5: "L", 6: "B", 7: "M", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" },
    4: { 1: "B", 2: "M", 3: "L", 4: "L", 5: "L", 6: "B", 7: "M", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" },
    5: { 1: "B", 2: "M", 3: "L", 4: "L", 5: "L", 6: "B", 7: "M", 8: "B", 9: "M", 10: "B", 11: "M", 12: "B" },
    6: { 1: "VB", 2: "L", 3: "VB", 4: "VB", 5: "VB", 6: "VB", 7: "L", 8: "VB", 9: "L", 10: "VB", 11: "L", 12: "VB" },
    7: { 1: "M", 2: "E", 3: "M", 4: "M", 5: "M", 6: "M", 7: "E", 8: "M", 9: "E", 10: "M", 11: "E", 12: "M" },
    8: { 1: "B", 2: "M", 3: "L", 4: "L", 5: "B", 6: "VB", 7: "M", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" },
    9: { 1: "M", 2: "H", 3: "M", 4: "M", 5: "M", 6: "M", 7: "H", 8: "M", 9: "M", 10: "L", 11: "H", 12: "M" },
    10: { 1: "VB", 2: "M", 3: "B", 4: "B", 5: "B", 6: "VB", 7: "M", 8: "B", 9: "L", 10: "B", 11: "M", 12: "B" },
    11: { 1: "H", 2: "E", 3: "M", 4: "M", 5: "H", 6: "M", 7: "E", 8: "M", 9: "H", 10: "M", 11: "E", 12: "M" },
    12: { 1: "B", 2: "M", 3: "L", 4: "L", 5: "B", 6: "VB", 7: "M", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" }
};

const CHILD_BIRTH_SUCCESS_MATRIX: Record<number, Record<number, string>> = {
    1: { 1: "B", 2: "M", 3: "B", 4: "VB", 5: "M", 6: "B", 7: "L", 8: "B", 9: "L", 10: "B", 11: "M", 12: "B" },
    2: { 1: "M", 2: "H", 3: "M", 4: "M", 5: "E", 6: "M", 7: "M", 8: "M", 9: "H", 10: "M", 11: "H", 12: "M" },
    3: { 1: "B", 2: "M", 3: "L", 4: "B", 5: "M", 6: "L", 7: "L", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" },
    4: { 1: "VB", 2: "VB", 3: "VB", 4: "VB", 5: "B", 6: "VB", 7: "VB", 8: "VB", 9: "VB", 10: "VB", 11: "B", 12: "VB" },
    5: { 1: "M", 2: "E", 3: "H", 4: "M", 5: "E", 6: "H", 7: "H", 8: "M", 9: "E", 10: "M", 11: "E", 12: "M" },
    6: { 1: "B", 2: "M", 3: "L", 4: "VB", 5: "M", 6: "L", 7: "L", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" },
    7: { 1: "L", 2: "M", 3: "L", 4: "VB", 5: "M", 6: "L", 7: "L", 8: "L", 9: "M", 10: "L", 11: "M", 12: "L" },
    8: { 1: "B", 2: "M", 3: "L", 4: "VB", 5: "M", 6: "L", 7: "L", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" },
    9: { 1: "M", 2: "H", 3: "M", 4: "B", 5: "H", 6: "M", 7: "M", 8: "M", 9: "M", 10: "L", 11: "H", 12: "M" },
    10: { 1: "B", 2: "B", 3: "L", 4: "VB", 5: "M", 6: "B", 7: "L", 8: "B", 9: "L", 10: "B", 11: "M", 12: "L" },
    11: { 1: "M", 2: "E", 3: "M", 4: "M", 5: "E", 6: "M", 7: "M", 8: "M", 9: "H", 10: "M", 11: "H", 12: "M" },
    12: { 1: "B", 2: "M", 3: "L", 4: "VB", 5: "M", 6: "L", 7: "L", 8: "L", 9: "M", 10: "B", 11: "M", 12: "L" }
};

const HEALTH_SUCCESS_MATRIX: Record<number, Record<number, string>> = {
    1: { 1: "M", 2: "M", 3: "L", 4: "B", 5: "M", 6: "B", 7: "M", 8: "VB", 9: "M", 10: "B", 11: "M", 12: "B" },
    2: { 1: "M", 2: "M", 3: "M", 4: "M", 5: "M", 6: "B", 7: "M", 8: "B", 9: "M", 10: "M", 11: "M", 12: "B" },
    3: { 1: "M", 2: "M", 3: "M", 4: "M", 5: "L", 6: "L", 7: "M", 8: "B", 9: "M", 10: "M", 11: "M", 12: "B" },
    4: { 1: "B", 2: "B", 3: "B", 4: "VB", 5: "L", 6: "VB", 7: "B", 8: "VB", 9: "B", 10: "VB", 11: "M", 12: "VB" },
    5: { 1: "E", 2: "G", 3: "G", 4: "M", 5: "E", 6: "M", 7: "G", 8: "M", 9: "E", 10: "G", 11: "E", 12: "M" },
    6: { 1: "B", 2: "B", 3: "B", 4: "B", 5: "L", 6: "B", 7: "L", 8: "VB", 9: "L", 10: "VB", 11: "M", 12: "VB" },
    7: { 1: "M", 2: "M", 3: "M", 4: "M", 5: "M", 6: "B", 7: "M", 8: "B", 9: "M", 10: "B", 11: "M", 12: "B" },
    8: { 1: "B", 2: "B", 3: "B", 4: "B", 5: "L", 6: "VB", 7: "B", 8: "VB", 9: "L", 10: "VB", 11: "M", 12: "VB" },
    9: { 1: "G", 2: "G", 3: "G", 4: "M", 5: "G", 6: "M", 7: "M", 8: "M", 9: "G", 10: "M", 11: "E", 12: "M" },
    10: { 1: "B", 2: "M", 3: "M", 4: "B", 5: "M", 6: "B", 7: "B", 8: "B", 9: "M", 10: "VB", 11: "M", 12: "VB" },
    11: { 1: "G", 2: "G", 3: "G", 4: "M", 5: "E", 6: "M", 7: "M", 8: "M", 9: "G", 10: "G", 11: "E", 12: "M" },
    12: { 1: "VB", 2: "B", 3: "B", 4: "VB", 5: "B", 6: "VB", 7: "B", 8: "VB", 9: "B", 10: "VB", 11: "B", 12: "VB" }
};

const JOB_GOOD_A_PLUS = [
    [2, 6, 7, 9, 10, 11], [2, 6, 7, 9, 11], [2, 6, 7, 11], [2, 6, 11], [2, 7, 11], [2, 11], [10, 11], [7, 11], [4, 11], [3, 11], [5, 11], [8, 11], [11]
];
const JOB_GOOD_A = [
    [2, 6, 7, 9, 10], [2, 6, 7, 10], [2, 6, 10], [2, 7, 10], [2, 10], [9, 10], [7, 10], [4, 10], [3, 10], [5, 10], [8, 10], [10]
];
const JOB_GOOD_B = [
    [2, 6, 7, 9], [2, 6, 9], [2, 7, 9], [2, 6], [2, 7], [2, 9], [7, 9], [4, 9], [3, 9], [5, 9], [5], [8], [12]
];

const JOB_BAD_01 = [
    [5, 6, 7, 8, 9, 12], [5, 6, 7, 8, 12], [5, 7, 8, 12], [5, 6, 8, 12], [5, 8, 12], [8, 12], [5, 8], [5, 12]
];
const JOB_BAD_02 = [
    [6, 8, 9, 12], [7, 8, 9, 12], [6, 8, 12], [7, 8, 12], [6, 12], [7, 12], [9, 12]
];

const CHILD_BIRTH_HIGH = [[2, 5, 9, 11], [2, 5, 11]];
const CHILD_BIRTH_MEDIUM = [[5, 9, 11], [5, 11]];
const CHILD_BIRTH_LOW = [[5], [2], [11]];
const CHILD_BIRTH_NEGATIVE = [[1, 4, 8, 10, 12], [1, 4, 8, 10], [1, 4, 10], [4, 10], [4], [1, 10]];
const CHILD_BIRTH_ABORTION = [[2, 5, 6, 8, 12], [2, 5, 8, 12], [5, 8, 12]];

const checkSubset = (target: Set<number>, subsets: number[][]) => {
    return subsets.some(sub => sub.every(h => target.has(h)));
};

const getSuccessInfo = (code: string) => {
    switch (code) {
        case 'VB!': case 'VB': return { label: 'Very Bad!', color: '#ef4444' };
        case 'B!': case 'B': return { label: 'Bad!', color: '#ef4444' };
        case 'M': return { label: 'Medium', color: '#2563eb' };
        case 'L': return { label: 'Low', color: '#2563eb' };
        case 'H': return { label: 'High', color: '#16a34a' };
        case 'G': return { label: 'Good', color: '#16a34a' };
        case 'E': return { label: 'Excellent', color: '#16a34a' };
        default: return { label: code, color: '#1e293b' };
    }
};

const shuffleText = (text: string | undefined) => {
    if (!text) return '-';
    const parts = text.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length <= 1) return text;

    for (let i = parts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = parts[i];
        parts[i] = parts[j];
        parts[j] = temp;
    }
    return parts.join(', ');
};

const getBifurcation = (houseSet: Set<number>, area: string) => {
    let good: number[];
    let bad: number[];

    if (area === 'Education') {
        const coreGood = [1, 2, 4, 10, 11];
        const gp = [3, 5, 7, 9];
        const chela = [6, 8];
        const has11 = houseSet.has(11);
        const has12 = houseSet.has(12);

        if (has11 && has12) {
            good = [...coreGood, ...gp];
            bad = [...chela, 12];
        } else if (has11) {
            good = [...coreGood, ...gp, ...chela];
            bad = [12];
        } else if (has12) {
            good = [...coreGood];
            bad = [...gp, ...chela, 12];
        } else {
            good = [...coreGood, ...gp];
            bad = [...chela, 12];
        }
    } else if (area === 'Marriage') {
        good = [2, 3, 4, 7, 9, 11];
        bad = [1, 5, 6, 8, 10, 12];
    } else if (area === 'Child Birth') {
        const primGood = [2, 5, 9, 11];
        const primBad = [1, 4, 10];
        const obstacles = [8, 12];
        const neutrals = [3, 6, 7];

        const has5 = houseSet.has(5);
        const has4 = houseSet.has(4);

        if (has5 && has4) {
            good = [...primGood, ...obstacles, ...neutrals];
            bad = [...primBad];
        } else if (has5) {
            good = [...primGood, ...obstacles, ...primBad.filter(h => h !== 4), ...neutrals];
            bad = [4];
        } else if (has4) {
            good = [...primGood.filter(h => h !== 5), ...neutrals];
            bad = [...primBad, ...obstacles, 5];
        } else {
            good = [...primGood.filter(h => h !== 5), ...obstacles, ...neutrals];
            bad = [...primBad, 5];
        }
    } else if (area === 'Health') {
        good = [1, 2, 3, 5, 7, 9, 11];
        bad = [4, 6, 8, 10, 12];
    } else {
        const combo = Array.from(houseSet);
        const has11 = combo.includes(11);
        const has12 = combo.includes(12);
        const coreGood = [2, 10, 11];
        const coreBlue = [1, 3, 4];
        const coreRed = [12];

        let dynamicGood: number[] = [];
        let dynamicRed: number[] = [];

        if (has11 && has12) {
            dynamicGood = [6, 7, 9];
            dynamicRed = [5, 8];
        } else if (has11 && !has12) {
            dynamicGood = [5, 6, 7, 8, 9];
            dynamicRed = [];
        } else if (!has11 && has12) {
            dynamicGood = [];
            dynamicRed = [5, 6, 7, 8, 9];
        } else {
            dynamicGood = [6, 7, 9];
            dynamicRed = [5, 8];
        }

        good = combo.filter(h => coreGood.includes(h) || coreBlue.includes(h) || dynamicGood.includes(h));
        bad = combo.filter(h => coreRed.includes(h) || dynamicRed.includes(h));
    }

    return {
        colGood: Array.from(new Set(good)),
        colBad: Array.from(new Set(bad))
    };
};

const JobPredictionTable: React.FC<JobPredictionTableProps> = ({ data, planets, types, planetName, selectedArea }) => {
    const isEducation = selectedArea === 'Education';
    const isMarriage = selectedArea === 'Marriage';
    const isChildBirth = selectedArea === 'Child Birth';
    const isHealth = selectedArea === 'Health';
    const [isExpanded, setIsExpanded] = useState(false);

    const planetData = data.find(p => p.planet === planetName) || data[0];
    if (!planetData) return <div>No data available</div>;

    const placementMap: Record<string, number> = {};
    planets.forEach(p => { placementMap[p.planet] = p.house_placed; });

    const plHit = placementMap[planetData.planet];
    const nlHit = placementMap[planetData.star_lord];
    const slHit = placementMap[planetData.sub_lord];

    const plHouses = planetData.pl_signified.map(h => h.house);
    const nlHouses = planetData.nl_signified.map(h => h.house);
    const slHouses = planetData.sl_signified.map(h => h.house);

    const getHouseColor = (h: number, isBad: boolean, area: string) => {
        if (area === 'Education') {
            if (isBad) {
                if ([2, 4, 10, 11].includes(h)) return '#16a34a';
                return '#ef4444';
            } else {
                if ([1, 5, 7].includes(h)) return '#0ea5e9';
                return '#16a34a';
            }
        }
        if (area === 'Marriage') {
            if ([2, 7].includes(h)) return '#16a34a';
            if ([3, 4, 9, 11].includes(h)) return '#60a5fa';
            return '#ef4444';
        }
        if (area === 'Health') {
            if ([5, 9, 11].includes(h)) return '#16a34a';
            if ([1, 2, 3, 7].includes(h)) return '#60a5fa';
            return '#ef4444';
        }
        if (isBad) return '#ef4444';
        if ([2, 5, 6, 7, 8, 9, 10, 11].includes(h)) return '#16a34a';
        if ([1, 3, 4].includes(h)) return '#0ea5e9';
        return '#1e293b';
    };

    const renderHousesPerRow = (sigs: number[], hit: number) => {
        const pool = new Set([...sigs, hit]);
        const bif = getBifurcation(pool, selectedArea);
        const uniquePool = Array.from(pool).sort((a, b) => a - b);
        const good = uniquePool.filter(h => bif.colGood.includes(h));
        const bad = uniquePool.filter(h => bif.colBad.includes(h));

        const renderCell = (list: number[], isBad: boolean) => {
            if (list.length === 0) return <span style={{ color: '#ccc', fontSize: '11px' }}>-</span>;
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1px' }}>
                    {list.map((h, i) => (
                        <span key={i} className="house-pill" style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: (h === hit) ? '24px' : 'auto', height: (h === hit) ? '24px' : 'auto',
                            border: (h === hit) ? '1.5px solid #000000' : 'none',
                            borderRadius: '3px', margin: '0 2px', padding: (h === hit) ? '0' : '0 3px',
                            background: (h === hit) ? '#f8fafc' : 'transparent',
                            color: getHouseColor(h, isBad, selectedArea) === '#ef4444' ? '#ef4444' : getHouseColor(h, isBad, selectedArea) === '#16a34a' ? '#16a34a' : '#2563eb',
                            fontWeight: '800'
                        }}>
                            {h}
                        </span>
                    ))}
                </div>
            );
        };
        return { good, bad, renderCell };
    };

    const plBif = renderHousesPerRow(plHouses, plHit);
    const nlBif = renderHousesPerRow(nlHouses, nlHit);
    const slBif = renderHousesPerRow(slHouses, slHit);

    const comboGoodSet = new Set([...plBif.good, ...nlBif.good, ...slBif.good]);
    const comboBadSet = new Set([...plBif.bad, ...nlBif.bad, ...slBif.bad]);

    const allHousesSet = new Set([
        ...plHouses, plHit,
        ...nlHouses, nlHit,
        ...slHouses, slHit
    ]);

    const counts: Record<number, number> = {};
    [...plHouses, ...nlHouses, ...slHouses].forEach(h => { counts[h] = (counts[h] || 0) + 1; });

    const renderCombination = (hSet: Set<number>, isBad: boolean) => {
        const sorted = Array.from(hSet).sort((a, b) => a - b);
        if (sorted.length === 0) return <span style={{ color: '#ccc' }}>-</span>;
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px' }}>
                {sorted.map((h, i) => {
                    const count = counts[h] || 1;
                    const isCircled = h === nlHit || h === slHit;
                    return (
                        <span key={h} style={{
                            color: getHouseColor(h, isBad, selectedArea) === '#ef4444' ? '#ef4444' : getHouseColor(h, isBad, selectedArea) === '#16a34a' ? '#16a34a' : '#2563eb',
                            fontWeight: '800',
                            width: isCircled ? '24px' : 'auto',
                            height: isCircled ? '24px' : 'auto',
                            border: isCircled ? '1.5px solid #000000' : 'none',
                            borderRadius: '3px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: isCircled ? '0' : '0 2px',
                            margin: '0 2px'
                        }}>
                            {h}{count > 1 && <sup style={{ fontSize: '10px', marginLeft: '1px', color: '#818cf8', opacity: 0.8 }}>{count}</sup>}
                            {i < sorted.length - 1 && !isCircled ? <span style={{ opacity: 0.4, marginLeft: '2px' }}>,</span> : ''}
                        </span>
                    );
                })}
            </div>
        );
    };

    const matrix = isEducation ? EDU_SUCCESS_MATRIX : isMarriage ? MARRIAGE_SUCCESS_MATRIX : isChildBirth ? CHILD_BIRTH_SUCCESS_MATRIX : isHealth ? HEALTH_SUCCESS_MATRIX : JOB_SUCCESS_MATRIX;
    const successCode = matrix[slHit]?.[nlHit] || "M";
    const successInfo = getSuccessInfo(successCode);

    const activeThemes = types.map(t => ({
        Dasha: { color: '#1d4ed8', text: '#ffffff', label: 'Dasha' },
        Bhukti: { color: '#15803d', text: '#ffffff', label: 'Bukthi' },
        Antara: { color: '#b45309', text: '#ffffff', label: 'Antar Bhukthi' },
        Sukshma: { color: '#7c2d12', text: '#ffffff', label: 'Sukshma' }
    }[t]));

    // Determine header background based on highest priority type
    const getHeaderStyle = () => {
        if (types.includes('Dasha')) return { background: '#1d4ed8', color: '#ffffff' };
        if (types.includes('Bhukti')) return { background: '#15803d', color: '#ffffff' };
        if (types.includes('Antara')) return { background: '#b45309', color: '#ffffff' };
        if (types.includes('Sukshma')) return { background: '#7c2d12', color: '#ffffff' };
        return { background: '#f8fafc', color: '#1e3a8a' };
    };
    const headerStyle = getHeaderStyle();

    const nlProfessionText = React.useMemo(() =>
        shuffleText((isEducation ? EDU_PROFESSION_MAP : isMarriage ? MARRIAGE_RESULT_MAP : isChildBirth ? CHILD_BIRTH_RESULT_MAP : isHealth ? HEALTH_RESULT_MAP : JOB_PROFESSION_MAP)[nlHit]),
        [nlHit, selectedArea]
    );

    const slProfessionText = React.useMemo(() =>
        shuffleText((isEducation ? EDU_PROFESSION_MAP : isMarriage ? MARRIAGE_RESULT_MAP : isChildBirth ? CHILD_BIRTH_RESULT_MAP : isHealth ? HEALTH_RESULT_MAP : JOB_PROFESSION_MAP)[slHit]),
        [slHit, selectedArea]
    );

    const jobNoteText = React.useMemo(() => {
        if (!isEducation && !isMarriage && !isChildBirth && !isHealth) {
            return shuffleText("Technology, Medicine, Software, Abroad, Astrology, any Business without investments");
        }
        return "";
    }, [selectedArea, isEducation, isMarriage, isChildBirth, isHealth]);

    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            marginBottom: '1.5rem',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            width: '100%',
            maxWidth: '100%',
            margin: '0 0 0.75rem',
            border: '2px solid #000000',
            borderTop: '5px solid #000000'
        }}>
            <div style={{ background: headerStyle.background, padding: '10px 8px', textAlign: 'center', borderBottom: '1.5px solid #000000' }}>
                <h3 style={{ margin: 0, color: headerStyle.color, fontWeight: 900, fontSize: '1rem', letterSpacing: '0.5px' }}>
                    {planetData.planet.toUpperCase()}
                </h3>
                {activeThemes.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                        {activeThemes.map((t, idx) => (
                            <span key={idx} style={{ color: t?.text, fontSize: '0.65rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase' }}>
                                {t?.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ padding: '0px' }}>
                {[
                    { label: 'PL', p: planetData.planet, h: plHit, bif: plBif },
                    { label: 'NL', p: planetData.star_lord, h: nlHit, bif: nlBif },
                    { label: 'SL', p: planetData.sub_lord, h: slHit, bif: slBif }
                ].map((row) => (
                    <div key={row.label} style={{ borderBottom: '1.5px solid #000000', padding: '8px 12px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#000000', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#1d4ed8' }}>{row.p.substring(0, 2).toUpperCase()}</span>
                            <span style={{ opacity: 0.8, fontSize: '0.65rem' }}>({row.label})</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div style={{ background: '#f0fdf4', padding: '6px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#15803d', marginBottom: '4px', textTransform: 'uppercase' }}>GOOD</div>
                                {row.bif.renderCell(row.bif.good, false)}
                            </div>
                            <div style={{ background: '#fef2f2', padding: '6px', borderRadius: '6px', border: '1px solid #fee2e2' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#b91c1c', marginBottom: '4px', textTransform: 'uppercase' }}>BAD</div>
                                {row.bif.renderCell(row.bif.bad, true)}
                            </div>
                        </div>
                    </div>
                ))}

                <div style={{ borderBottom: '1.5px solid #000000', padding: '8px 12px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>COMBINATION</div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {renderCombination(comboGoodSet, false)}
                        <span style={{ color: '#000000', fontWeight: 900, fontSize: '1rem' }}>/</span>
                        {renderCombination(comboBadSet, true)}
                    </div>
                </div>

                <div style={{ borderBottom: '1.5px solid #000000', padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>
                        {isEducation ? "EXAM" : isMarriage ? "INDICATION" : isChildBirth ? "INDICATION" : isHealth ? "HEALTH STATUS" : "INCOME/EXPENSES"}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', fontWeight: 800, fontSize: '0.85rem', alignItems: 'center' }}>
                        <span style={{ color: '#16a34a' }}>
                            {isEducation
                                ? (() => {
                                    const comboGoodArray = Array.from(comboGoodSet);
                                    const greenHouses = comboGoodArray.filter(h => ![1, 5, 7].includes(h));
                                    const greenCount = greenHouses.length;

                                    if (greenCount > 3) return "Very High";
                                    if (greenCount === 3) return "High Indication";
                                    if (greenCount === 2) return "Medium Indication";
                                    return "Low";
                                })()
                                : isMarriage ? "High Indication" : isChildBirth ? (() => {
                                    if (checkSubset(allHousesSet, CHILD_BIRTH_HIGH)) return "High Indication";
                                    if (checkSubset(allHousesSet, CHILD_BIRTH_MEDIUM)) return "Medium Indication";
                                    if (checkSubset(allHousesSet, CHILD_BIRTH_LOW)) return "Low Indication";
                                    return "No Indication";
                                })() : isHealth ? "Excellent" : (() => {
                                    if (checkSubset(comboGoodSet, JOB_GOOD_A_PLUS)) return "Very High";
                                    if (checkSubset(comboGoodSet, JOB_GOOD_A)) return "High";
                                    if (checkSubset(comboGoodSet, JOB_GOOD_B)) return "Medium";
                                    return "Low";
                                })()
                            }
                        </span>
                        <span style={{ color: '#cbd5e1', fontWeight: 400 }}>/</span>
                        <span style={{ color: '#ef4444' }}>
                            {isChildBirth ? (() => {
                                if (checkSubset(allHousesSet, CHILD_BIRTH_NEGATIVE)) return "High Difficulty";
                                if (checkSubset(allHousesSet, CHILD_BIRTH_ABORTION)) return "Abortion Risk";
                                return "Low Loss";
                            })() : isEducation ? "Low" : isMarriage ? "Low Loss" : isHealth ? "Neutral" : (() => {
                                if (checkSubset(comboBadSet, JOB_BAD_01)) return "High Loss";
                                if (checkSubset(comboBadSet, JOB_BAD_02)) return "Medium Loss";
                                return "Low Loss";
                            })()}
                        </span>
                    </div>
                </div>

                <div onClick={() => setIsExpanded(!isExpanded)} style={{ padding: '10px', textAlign: 'center', cursor: 'pointer', background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', borderBottom: '1.5px solid #000000' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>SUCCESS RATE</div>
                    <span style={{ color: successInfo.color, fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px' }}>
                        {successInfo.label.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#000000', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                </div>

                {isExpanded && (
                    <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '16px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#35a4f4', marginBottom: '10px', textTransform: 'uppercase' }}>DETAILED FINDINGS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                                <span style={{ fontWeight: 900, color: '#35a4f4' }}>NL:</span>
                                <span style={{ color: '#334155' }}>{nlProfessionText}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                                <span style={{ fontWeight: 900, color: '#35a4f4' }}>SL:</span>
                                <span style={{ color: '#334155' }}>{slProfessionText}</span>
                            </div>
                            {isEducation && successCode && (successCode.startsWith('B') || successCode.startsWith('VB')) && (
                                <div style={{ marginTop: '8px', padding: '8px', background: '#fef2f2', borderRadius: '6px', fontSize: '0.8rem', color: '#dc2626', fontWeight: 800 }}>
                                    ! Note: Till 2nd PUC or 10+2
                                </div>
                            )}

                            {!isEducation && !isMarriage && !isChildBirth && !isHealth && successCode && (successCode.startsWith('B') || successCode.startsWith('VB')) && (
                                <div style={{ marginTop: '8px', padding: '8px', background: '#fef2f2', borderRadius: '6px', fontSize: '0.8rem', color: '#dc2626', fontWeight: 800 }}>
                                    ! Note: {jobNoteText}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobPredictionTable;
