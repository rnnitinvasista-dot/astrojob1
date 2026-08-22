import React, { useState } from 'react';
import type { NakshatraNadiItem, Planet } from '../../types/astrology';

interface JobPredictionTableProps {
    data: NakshatraNadiItem[];
    planets: Planet[];
    types: ('Dasha' | 'Bhukti' | 'Antara' | 'Cusp')[];
    planetName: string;
    selectedArea: string;
    customLabel?: string;
    isTransitMode?: boolean;
    loadingTransit?: boolean;
    onTransitToggle?: (active: boolean) => void;
    selectedHouseNum?: number;
    isPrashnaMode?: boolean;
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
    4: "Long term or incurable disease",
    5: "Strong health",
    6: "Small disease",
    7: "Normal Health, Kidneys/Urine area.",
    8: "Chronic disease",
    9: "Divine protection",
    10: "Major disease diagnosis",
    11: "Gain or recovery of health",
    12: "Hospitalization or bed rest"
};

const HEALTH_DISEASE_MAP: Record<string, string> = {
    "SUN": "Headache, Eyesight problem, Fever, Migraine, Brain and Heart related problem, Acidity, Spinal Cord, Loss of appetite, Bile, Sun stroke",
    "MOON": "Poor blood circulation, Heart issue, Common Cough and Cold, Depression, Poor Eyesight, Fears and Phobia, Wetting in hand, Unconsciousness (Coma), Breast related problem, Stomach Problem, Insomnia",
    "MARS": "All Blood related problem, Accidents, Operation to any part of body, Bone marrow, Fracture, Calcium deficiency, BP and low BP, Varicose Veins, Tooth related Problem, Nail Problems, Fever",
    "MERCURY": "Fits or Epilepsy, Skin and Nerve problem, Deaf and Dumb, Psoriasis, White Patches, Varicose and Veins, Ear Nose Throat Problems, Memory Loss, Alzimer's disease, Parkinson's disease",
    "JUPITER": "Diabetes, Cholesterol, Lungs, Thyroid, Obesity, Jaundice, Liver problems, fat accumulation",
    "VENUS": "Kidney, PCOD, Spermatozoa, Fungus and Infection, Skin problem, White Patches, Stones, Urine and Uterus",
    "SATURN": "Deformalities of a body, Joint and Back pain, Spondylosis, Hair fall and White hair, Disc slip, Leprosy, Asthma, Snoring, Knee pain, Insomnia, Leg pain",
    "RAHU": "Incurable disease like Cancer, Aids, Disease which is difficult to diagnosis, Immunity, Bite of poisonous insects, Operations, Hospitalization",
    "KETU": "Allergies and Infection, B P, Contagious disease, Airborne disease, Infections, Amputations, Heat related problem, Piles and Fistula, Intestine, Constipation"
};


const PROPERTY_LITIGATION = [[3, 5, 6, 8, 12], [3, 5, 6, 12], [3, 5, 6, 8], [3, 5, 8, 12], [3, 5, 12]];


const DONATION_MAP: Record<string, { item: string, day: string, time: string }> = {
    "SUN": { item: "Wheat", day: "Sunday", time: "Morning 6:00 AM to 7:00 AM" },
    "MOON": { item: "Rice", day: "Monday", time: "Morning 6:00 AM to 7:00 AM" },
    "MARS": { item: "Toordal", day: "Tuesday", time: "Morning 6:00 AM to 7:00 AM" },
    "MERCURY": { item: "Green Gram", day: "Wednesday", time: "Morning 6:00 AM to 7:00 AM" },
    "JUPITER": { item: "Bengal Gram", day: "Thursday", time: "Morning 6:00 AM to 7:00 AM" },
    "VENUS": { item: "Hyacinth Beans", day: "Friday", time: "Morning 6:00 AM to 7:00 AM" },
    "SATURN": { item: "Black Sesame", day: "Saturday", time: "Morning 6:00 AM to 7:00 AM" },
    "RAHU": { item: "Black Urad", day: "Saturday", time: "Morning 6:00 AM to 7:00 AM" },
    "KETU": { item: "Horse Gram", day: "Thursday", time: "Morning 6:00 AM to 7:00 AM" }
};

const PLANET_DAY_MAP: Record<string, string> = {
    "SUN": "Sunday",
    "MOON": "Monday",
    "MARS": "Tuesday",
    "MERCURY": "Wednesday",
    "JUPITER": "Thursday",
    "KETU": "Thursday",
    "VENUS": "Friday",
    "RAHU": "Saturday",
    "SATURN": "Saturday"
};

interface HouseHitRemedy {
    house: number;
    domain: string;
    remedy: string;
    note: string;
}

const HOUSE_HIT_REMEDIES: HouseHitRemedy[] = [
    { house: 1, domain: "Money", remedy: "Go to Busy Bank and sit for sometime", note: "Busy Bank indicate more customers" },
    { house: 1, domain: "Money", remedy: "Jewellery Shopping", note: "No need to buy observe the ambience" },
    { house: 1, domain: "Marriage", remedy: "Stay in relative's home", note: "Duration One week starting on respective Day" },
    { house: 2, domain: "Craving", remedy: "Visit Hospital and Gym (Vyayama shale)", note: "on impacted day" },
    { house: 2, domain: "Health", remedy: "Avoid having food after 6 PM", note: "w.r.t impacted day for 6 months" },
    { house: 2, domain: "Health", remedy: "Prefer to fast on impacted day", note: "on impacted day" },
    { house: 3, domain: "Job", remedy: "Take Leave & Stay at home", note: "No office related activity at home on impacted day" },
    { house: 4, domain: "Marriage", remedy: "Go for movie in Theatre only", note: "on Impacted day to activate 5th house" },
    { house: 4, domain: "Job", remedy: "Join sports (Activity Driven) to increase Stamina", note: "on impacted day to activate 3rd and 5th house" },
    { house: 4, domain: "Child", remedy: "Join Singing class", note: "on impacted day to activate 5th house (Child Birth)" },
    { house: 5, domain: "Marriage", remedy: "Due to selective mindset need to attend marriage ceremonies", note: "on impacted day" },
    { house: 5, domain: "Finance", remedy: "Invest only in Mutual Funds instead of shares", note: "on impacted day" },
    { house: 5, domain: "Finance", remedy: "Play cards for fun and without involving money", note: "on impacted day" },
    { house: 6, domain: "Finance", remedy: "Go to Busy Bank and sit for sometime", note: "Busy Bank indicate more customers" },
    { house: 6, domain: "Marriage", remedy: "Couple need to go for Movie in Theatre", note: "on Impacted day to activate 7th house" },
    { house: 6, domain: "Marriage", remedy: "Couple need to have Financial Discussions to have accountability for all income and expenses", note: "on Impacted day" },
    { house: 6, domain: "Marriage", remedy: "Go to Gym or Court", note: "on impacted day" },
    { house: 7, domain: "Marriage", remedy: "To avoid Doubt or delay in Marriage - Go to marriage ceremonies", note: "on impacted day" },
    { house: 8, domain: "Health", remedy: "If healthy Blood Donation (to avoid accident)", note: "on Impacted day" },
    { house: 8, domain: "Health", remedy: "If not healthy visit Market and roam for 1 hour", note: "on Impacted day to activate 7th house" },
    { house: 8, domain: "Health", remedy: "If on Wheel chair visit Marriage Ceremonies", note: "on Impacted day to activate 7th house" },
    { house: 8, domain: "Marriage", remedy: "Go to Marriage Ceremonies", note: "on Impacted day to activate 7th house" },
    { house: 8, domain: "Health", remedy: "Go to Crematorium (Mashana) and stay for 10-15 min during afternoon", note: "on Impacted day" },
    { house: 8, domain: "Health", remedy: "Drink Alcohol (Responsible/Limited - Drinking)", note: "on Impacted day" },
    { house: 8, domain: "Spiritual", remedy: "White Wine", note: "on Impacted day to increase spiritual inclination" },
    { house: 8, domain: "Spiritual", remedy: "Satvik - Consume Gass Gase Payasa (Alternative to Alcohol)", note: "on Impacted day" },
    { house: 9, domain: "Travel", remedy: "Travel to Long places / Visit Government representation Buildings", note: "on Impacted day" },
    { house: 12, domain: "General", remedy: "Visit Hospital, Crematorium, Temples", note: "on Impacted day" }
];

const HEALTH_GOOD_HIGH = [[5, 9, 11]];
const HEALTH_GOOD_MEDIUM = [[5, 11], [5, 9]];
const HEALTH_GOOD_LOW = [[5], [11], [9]];

const HEALTH_BAD_HIGH = [[4, 6, 8, 10, 12], [4, 6, 10, 12], [4, 8, 10, 12]];
const HEALTH_BAD_MEDIUM = [[4, 6, 8, 10], [4, 8, 12], [4, 6, 12], [4, 6, 10], [4, 8, 10], [4, 10], [6, 8, 12]];
const HEALTH_BAD_LOW = [[4], [6, 12], [6, 8], [8], [6]];

const MARRIAGE_GOOD_VERY_GOOD = [[2, 7, 9, 11]];
const MARRIAGE_GOOD_GOOD = [[2, 7, 11], [7, 9, 11], [2, 9, 11]];
const MARRIAGE_GOOD_MEDIUM = [[2, 7], [2, 11], [7, 11]];
const MARRIAGE_GOOD_LOW = [[2], [7], [9], [11]];

const MARRIAGE_BAD_VERY_BAD = [[1, 5, 6, 8, 10, 12]];
const MARRIAGE_BAD_BAD = [[1, 5, 6, 10], [1, 6, 10], [5, 6, 10]];
const MARRIAGE_BAD_MEDIUM = [[6, 10], [5, 10], [5, 6]];
const MARRIAGE_BAD_LOW = [[5], [6], [1, 10]];

function checkSubset(set: Set<number>, subsets: number[][]): boolean {
    return subsets.some(sub => sub.every(h => set.has(h)));
}

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

const TRAVEL_ABROAD_VERY_HIGH = [[1, 3, 7, 9, 11, 12], [3, 7, 9, 12], [3, 9, 12]];
const TRAVEL_ABROAD_HIGH = [[9, 12], [3, 12], [12]];
const TRAVEL_ABROAD_MEDIUM = [[9], [3]];

const TRAVEL_HOME_VERY_HIGH = [[2, 4, 11]];
const TRAVEL_HOME_HIGH = [[2, 11]];
const TRAVEL_HOME_MEDIUM = [[4, 11]];
const TRAVEL_HOME_LOW = [[2, 4], [2], [4]];

const PROPERTY_PURCHASE_VERY_HIGH = [[4, 6, 8, 11, 12], [4, 6, 11, 12]];
const PROPERTY_PURCHASE_HIGH = [[4, 8, 11, 12], [4, 11, 12], [4, 6, 11]];
const PROPERTY_PURCHASE_MEDIUM = [[4, 8, 11], [4, 11]];
const PROPERTY_PURCHASE_LOW = [[4], [8, 11]];

const PROPERTY_SALE_VERY_HIGH = [[3, 5, 10, 11], [3, 5, 10, 11, 12]];
const PROPERTY_SALE_HIGH = [[3, 5, 11], [3, 5, 11, 12]];
const PROPERTY_SALE_MEDIUM = [[3, 5, 10], [3, 11], [3, 11, 12]];
const PROPERTY_SALE_LOW = [[3, 12], [3, 5], [3, 10], [3]];

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

const CHILD_BIRTH_VERY_HIGH = [[2, 5, 9, 11]];
const CHILD_BIRTH_HIGH = [[2, 5, 11], [5, 9, 11], [5, 11]];
const CHILD_BIRTH_MEDIUM = [[5], [2], [11]];
const CHILD_BIRTH_BAD = [[1, 4, 8, 10, 12], [1, 4, 8, 10], [1, 4, 10], [4, 10], [4], [1, 10]];
const CHILD_BIRTH_ABORTION = [[2, 5, 6, 8, 12], [2, 5, 8, 12], [5, 8, 12]];
const CHILD_BIRTH_SPECIAL_CASE = [[2, 5, 8, 11]]; // Caesarean / IVF / Test Tube Baby


const FIRST_CUSP_PREDICTIONS: Record<number, { health: string; wealth: string; general: string }> = {
    1: { health: "Good health, High immunity, Good Aura.", wealth: "Self-Effort most time, Fortunate by self-endeavours.", general: "Winning in all, Inspires others, Decision maker." },
    2: { health: "Priority on food, Maraka house for health.", wealth: "Good earning, Good savings, Money through good self-service, Priority on money and material possessions.", general: "Enjoying life's comforts, Family focused." },
    3: { health: "Good health and courage.", wealth: "Money through Networking, Documentation, Writing.", general: "High effort, Extra effort in planning, Active mind, Smaller travels, Neighbours helpful, good Relations." },
    4: { health: "Immunity less, Weak and lethargic.", wealth: "Ancestral property, Profit from mines and guiding real estate, Housing and Education industry, Managerial skills.", general: "Always likes to study, Occult science, Prefers comfort and Luxury, Attached to Mother, Home and Family." },
    5: { health: "Good Health, Good Immunity. Fast recovery from ill-health", wealth: "Money is less through investment, Money from Ideas, Creativity, Advisor and Healing.", general: "Likes luxury, Passionate, Creative, Intelligent, Entertainment and Children." },
    6: { health: "Health issues, Less immunity, Minor Disease More, Focus on Physical Fitness proves good.", wealth: "Money from Service and Assistance, Money minded.", general: "Good for Politics, Law, Medicine, Wins in fights." },
    7: { health: "Good against Chronic disease; but a Maraka house, Saves against Medical operation.", wealth: "Interest in Business ventures, Money through negotiation, Money from interaction.", general: "Good marriage life, high Public contact, No Enemies and Meets more people." },
    8: { health: "Depression life, Chronic disease, Frequent Small Accidents, Low immunity, Emotional distress.", wealth: "Good in Astrology stream, Money from Ancestors, Dead or Unknown source, Research line.", general: "Obstacles and difficulties, Unpredictable life, Secret studies, leading Tough life to transform into Great leader or Spirituality." },
    9: { health: "Good health, Good Immunity, God's grace.", wealth: "Money through Own knowledge, Ideologies, Spiritual pursuits.", general: "Long journey, Constant changes, Likes Vedas and scriptures, Good research mind, Higher Knowledge and Learning." },
    10: { health: "Denotes long term lifestyle disease.", wealth: "Money through Status, Name, Position, Authority and Management.", general: "Name, Politics, Fame, Honour, Awards and Good position." },
    11: { health: "Good health, Good Immunity, Faster recovery from disease.", wealth: "Money through Network, Friends, Ambition, Regular income.", general: "Realizes all hopes, Multiple desires, Gets help from Many and Happy." },
    12: { health: "Anxiety, Accident, Depression, Addiction, Frequent hospitalization, Less immunity.", wealth: "Spends More and High investment, Good in Research, Yoga, Meditation, Money From Abroad, Charitable institution, Spirituality.", general: "Difficulty, Jealousy, Confusion, Blames, Cheated, Abroad life, Far from Birth place." }
};

const FIRST_CSL_NL_RASHI_WEAKNESS: Record<string, string> = {
    "Aries": "Angry, Fickle Mind, Takes No Suggestion, Rigid, Temper, No Patience.",
    "Taurus": "Selfish, Revengeful, Lethargic, Stubborn, Non-forgiveness.",
    "Gemini": "Non-Decision, Unrest, Irritability, Impatience, Shortcut method, Stubborn.",
    "Cancer": "Waste of Energy, Highly Emotional, Grudges, Delayed attitude, Anxiety.",
    "Leo": "Impolite, Spendthrift, Overambitious, Partiality, Self Glory, Boasting nature.",
    "Virgo": "Inconsistency, Workaholic, Criticizing nature, Non-decider, Restless.",
    "Libra": "Spendthrift, Mixes Personal and Official, Non-planner, Get deceived easily.",
    "Scorpio": "Over Execution, Over Estimates, Over Criticizes, Irritable, Anger.",
    "Sagittarius": "No Target, Hasty Decision, less Attention, No Concentration.",
    "Capricorn": "Noble, Workaholic, Over Ambitious, Discouraging Nature.",
    "Aquarius": "Less Activity, Loneliness, Pessimistic, Lazy, Lonely, Restless.",
    "Pisces": "Non-Analytical, Non-Decisive, Depressive, Repetitive, Many Advices taken."
};

const SECOND_CUSP_PREDICTIONS: Record<number, { family: string; wealth: string; general: string }> = {
    1: {
        family: "Makes self-effort for family.",
        wealth: "Self-earning mind, Unique Ideas, Speech and Present",
        general: "Possession of Jewellery, Bank balance, Support are self-made."
    },
    2: {
        family: "Good Family Connections and Security.",
        wealth: "Money through family involvement, Earns through Speech, Family Industries, Sales, Negotiation Skills and Family Lineage.",
        general: "Accumulates jewellery, Good Foodie, Likes material possessions and Financial Interest high."
    },
    3: {
        family: "Financial support through Younger Brother, Younger Sister, Cousin's and Neighbour support.",
        wealth: "Money accumulation through Journalism, YouTube, Computer Agency, Printing, Writing, Marketing, Commission, Franchisee and Contracts.",
        general: "Money earned through Courage and active Mind."
    },
    4: {
        family: "Mother Influence and Involvement in Finance, Enjoys Home, Luxury and Good Food, Properties from Family.",
        wealth: "Money through Site, House, Teaching, Agriculture, Real estate and Commercial Building.",
        general: "Interested in work from Home. Works in Start-up Company or home Business."
    },
    5: {
        family: "Family Guidance and Solution in Wealth seen, Depletion of Family Wealth through Speculative Mind.",
        wealth: "Money through Creativity, Singing, Drama, Architect, Fashion, Software, Healing, Dance and Children.",
        general: "Makes Money through Own Intelligence, Guidance and Expertise."
    },
    6: {
        family: "Conflict with Family for Finance, Family spends on Debt or Disease, Family Enemies more.",
        wealth: "Money through Service, Loan, Medicine, Law, Pets, Domestic Animals and Banking.",
        general: "It shows money Lenders and Fights for Finance too."
    },
    7: {
        family: "Family Business or Involvement of family for Wealth Creation seen,",
        wealth: "Money through Friends, Partnership, Commission, Retail, Daily transactions, Public Management and Tender works.",
        general: "Good Social Engagement, Food Lover, Gatherings, Financial Support from others."
    },
    8: {
        family: "Money through Dowry, Alimony, Legacies and Inheritance.",
        wealth: "Money through Astrology, Insurance, Yoga, Taxation, Auditing, Excavation, Technology, Manufacturing, Research and Production.",
        general: "Indicates Transformation on Wealth Creation, Trouble, Difficulty, Physical issue, Emotional issue, Challenges and Unpredictable events on Wealth."
    },
    9: {
        family: "Money from Father, Ancestral, Ethical way of Wealth Creation by family",
        wealth: "Money through Spirituality, Export, Long travel, Book Writing, Publication, Preaching, Teaching, Professor and Consultation.",
        general: "Money earned through Good Principles, Luck, Ideologies, Wisdom and Values."
    },
    10: {
        family: "Family into Status and Authoritarian views, Dominating too",
        wealth: "Money through Politics, Management, Government and Authority, Own Profession.",
        general: "Good Name, Fame, Authority, Recognition, Honour and Appreciation."
    },
    11: {
        family: "Money through Elder Brother or Elder Sister, Support to make more Money.",
        wealth: "Money through Social Connections, Multi National Company, Shares, Consulting, Friends, Networking, Asset or Wealth Management, Good money flow through Multiple Avenues.",
        general: "High Desires to achieve Wealth, Sometimes with Greed too."
    },
    12: {
        family: "Family Involvement less in Wealth Creation.",
        wealth: "Money through Foreign Source, Hospital, Abroad, Agriculture, Yoga, Meditation, Charitable, Research and Investigation.",
        general: "Investments and Money Lending losses, Expenses may be higher than Savings."
    }
};

const THIRD_CUSP_PREDICTIONS: Record<number, { sibling: string; wealth: string; general: string }> = {
    1: { sibling: "Involvement of Younger Brother/Sister.", wealth: "Highly Communicative, Friendly and Active Mind.", general: "Life is Easy going, More Courage, Physically strong, Get things easily and Mental Activities." },
    2: { sibling: "Profit from Younger Brother/Sister.", wealth: "Income from Writing, Journalism, Media, Travelling, Sports, Planning, Sales, Marketing, social media, Reporting and Communication.", general: "Profit from Neighbours, Good health, Family support, Personal Savings and Agreements." },
    3: { sibling: "High Support in all Areas of 3rd house from Younger Brother/Sister.", wealth: "Good in Communication and Writing.", general: "Increase in Earnings day by day, Interested in Contracts, Agreements, Media, Sales, Marketing, Sports and Documents." },
    4: { sibling: "Involvement of Younger Brother/Sister in Home Matters.", wealth: "Communication on Education and Learning types.", general: "Effort in Education, Real estate, Learning, Teaching, Home, Vehicle Interest, Works for Material possessions and Comfortable Lifestyle." },
    5: { sibling: "Younger Brother/Sister supports for Arts, Higher goals and Creativity.", wealth: "Good Advisor and Communication through Intelligence.", general: "Works for Constant Change, Arts, Creative, Writer, Children, Interest in sports, Entertainment Industry, Stardom, Discussions in love matters." },
    6: { sibling: "Younger Brother/Sister experiences good job and earnings and helps Native, Fights also indicated.", wealth: "Likes Communication through Networking and Information Technology.", general: "Good Earning through Job, Money through Service, Gets Loan, More Enemies, Diseased Brother/Sister." },
    7: { sibling: "Younger Brother/Sister in partnership with Native in any matters.", wealth: "Native is Interactive and known to Public or more people.", general: "Travel more for Business, Networking to increase Contacts, Commission from Marriage, Dealer for Marriage, Small journey for Business and Starts New Ventures." },
    8: { sibling: "Fights or Misunderstanding with Younger Brother/Sister", wealth: "Discussion or Communication Leads to Challenges or Complication.", general: "Efforts for Agreements of Ancestor property, Insurance, Audit, Tax, Document issue, Obstacles, Hindrance, Insult, Astrology, Secret agency, Research, Technology and Public money, Failure through Contract or Communication and Unexpected Events." },
    9: { sibling: "Younger Brother/Sister Involvement in Travel, Ideal Mindset of Younger Brother/Sister.", wealth: "Desire for Higher Knowledge through Communication or Efforts.", general: "Far travel, Father involvement, Spirituality, Faith, Good Health and Luck through Communication or Efforts." },
    10: { sibling: "Famous Younger Brother/Sister or helps native to become Famous.", wealth: "Authority or Leadership through Communication.", general: "Good name as Orator, Deals in Government Agreement, Name in Sports. Authority involvement in any Application. Agreements, Visa's, Social Media, Marketing, Commission's, Contracts and Fame through Communication." },
    11: { sibling: "Gain from Younger Brother/Sister and Supports the Native.", wealth: "Gains through Communication and Efforts.", general: "Gain through Speeches, Sports, Agreements, Short travel, Social Media, Network and communication." },
    12: { sibling: "Younger Brother/Sister in Abroad, Separation or Unhealthy.", wealth: "Loss or Negativity in Communication or helps in Spiritual area.", general: "Abroad travel. Loss in Commission, Lies for personal Gains, Selfish, loss in Sports, Troublesome and Expenditure." }
};

const FOURTH_CUSP_PREDICTIONS: Record<number, { property: string; education: string; general: string }> = {
    1: { property: "Happy being alone at Home, Self-effort in buying Home or Vehicle by Willpower and Interested in Real-estate.", education: "Self-learning Mind, Results through Self-focus and High Effort.", general: "Mother involvement in life and Comfort or Luxury through Self-created Work." },
    2: { property: "Investment in Real-Estate. Earnings from Home, Land, Building, Agriculture and Buys Property through Savings.", education: "Good Learning, General Knowledge and focus on Development through Learning.", general: "Focus on Family Development, Mother's Involvement or Main In-charge." },
    3: { property: "Problems in House or Vehicle with respect to Repair, Loss in Real-estate or Vehicle, Loss to self by giving Surety. Obstacles in building house, May not live in Own House or troubles at Own House. Sale of Property or Vehicle Indicated and Away from Home.", education: "Loss of Education or Less Interest in Studies, Own effort to finish Education, Little Aggressive behavior, puts Mind in Technical study, Singing, Media, Journalism, Sales, Marketing and Communication.", general: "Health issues to Mother, Good Orator, Interested in Sports, Real-Estate Sales and Active Mind." },
    4: { property: "Good in Real-Estate or Vehicle, Construction of House good, Purchase of Land, Agriculture Land, House in birth place or Country.", education: "Good Education, Great Knowledge, Likes life-long Learning and Studying, can create Education Institute, Vastu Studies, Civil work, Works as per Policies.", general: "Satisfaction from Mother and help from her, Interest in Real-Estate or Vehicle, Luxury and Comfort High with all Consumer Durables at Home." },
    5: { property: "Sale of Property or Vehicle, Difficulty in Agriculture Produce, can obtain Land through Court Case and Getting Loan is Difficult.", education: "Little Laziness indicated, Education is good due to Creative, Intelligence, Fashion.", general: "Learns Healing, Gets Luxury through Intelligence, Comfort through creativity." },
    6: { property: "Good Money from Property, Vehicle, Real estate or Agriculture, Loan for Property, Litigation possibility on Property Matters, Vehicle Repair or Accident.", education: "Little Aggressive, Study on Banking, Accounts, Technical, Law or Medicine.", general: "Indifference at Home also with Mother, Legal issues on Property or in Education and Rent of Property Indicated." },
    7: { property: "Business type in Property, Real-estate, Agriculture, Home based business and partnership from Home, Construction business, Vehicle or Transport Business.", education: "Study in Business, Administration, Sales, Marketing, Political Science, Data Science, Hospitality and Hotel.", general: "Spouse involvement in Property Matters or home, Commercial building and Vehicle Business." },
    8: { property: "Obstacles in Property Indicated, Home or Real-estate, Loss of Property, Chances of Ancestor Property.", education: "Aggressive Behavior, Difficulty in studies, Possibility of study in Technical, Astrology, Law, Auditing, Medicine, Mines, Research, Audit and Insurance.", general: "Obstacles, Stress, Delays to Self or Education or Mother or Property" },
    9: { property: "Help from Father in Property, Agriculture and Real-Estate, Ethical way of Acquiring Property.", education: "Good for Education, Higher education, Travel Abroad for Education, Likes Philosophy and its studies, help from Father in Education, Likes to Study Scriptures and Religious texts.", general: "Spreads Philosophical views to Mass, Works in Educational Sector and Focus on Comfort." },
    10: { property: "Good for Property dealers, Trouble from Authority at Home or Own Property and Sale of Property Indicated.", education: "Good Name from Education. Awards and Rewards for Education, Name and Fame in Running Education Institutions, Head of an Educational Institute.", general: "Famous Mother, Likes Political career, Status through Education and Property." },
    11: { property: "Good House with Comfort, Profit from House and Vehicle.", education: "Good Education and Gain from Learning.", general: "Gain from Mother, Social Interaction for Gain in Education or Property or Luxury." },
    12: { property: "Loss of House, More Expenses on House or Vehicle, Possible of Property Outside Home town or Country.", education: "Loss of Education but Good for certain Area like MNC, Research, Hospital, Astrology, Yoga, Travel or Abroad for Studies.", general: "Always away from Home, Loss from Mother and loss in Material Possessions." }
};

const FIFTH_CUSP_PREDICTIONS: Record<number, { health: string; child: string; general: string }> = {
    1: { health: "Good Health, Focus on body and Personality Development, Interested in body Exercise.", child: "Difficult in Child Birth, Medical assistance Needed.", general: "Less Money, One sided Love in Relationship, Break in Love, Good Intelligence, Interested in Spirituality, Arts, Sports and Acting, Self-Happy most of the time, Creative and Natural Talent." },
    2: { health: "Health is Medium, Foodie, Should take care of Health and it's a Maraka Sthana.", child: "Child Birth Indicated, Good Health to Child and Happy.", general: "Good Income through Family, Interested in Music, Dance, Money through Music, Creative Ideas, Healing, Shares, Entertainment Industry, Charity, Trust, Consultancy, Success in Love indicated and Possibility of Marriage." },
    3: { health: "Health is Good, Focus on Physical Activity and Likes Sports.", child: "Indicates Neutral Result in Child birth, also Indicates Adoption, Medical assistance Needed.", general: "Interest in YouTube, Singing, Sports, Drama, Cinema, Direction in Serial or Cinema, Good Story Writer, Publishing in the Entertainment field and Achievement through High Effort." },
    4: { health: "Immunity is Less, Negates Good health, Weak constitute of the body and Fragile Development of Body.", child: "Very Difficult for Child Birth, Adoption possibility or Medically assisted Child Birth with Difficulty.", general: "Loss or Cancellation of Love, Break in Marriage Engagement, break in Love Marriage or break up of Love affair, Slow in Decision Making, thinks more on Minor Matters, Becomes Restless, Concentration on other Areas less, Focused on Home Comforts or its Issues, Education Good and Real Estate focus." },
    5: { health: "Good Health, Good Immunity, Faster Recovery from Ailments or Operation.", child: "Child Birth Indicated, Good Healthy Children will be Born.", general: "Success in Love affair, Success in Software, Sports, Entertainment Industry, Medicine, Past Life Good deeds leads to Creativity, Healing and Good Life." },
    6: { health: "Most time Diseased State of Health, Immunity Less, Minor Ailment denoted and Curing Delays.", child: "Difficult for Childbirth, Abortion possibility, Growth of Foetus Slow or Issue, Weak Child Birth and through Medical Assistance.", general: "Good Money from Shares, Healing, Fitness, Health, Entertainment Industry, Winning in betting, But loss due to fights in Love Affairs or Love Marriage." },
    7: { health: "Good Health, Good Immunity, Cures Faster in Ailment or Operation, But a Maraka Sthana.", child: "Child Birth Indicated as Neutral, Doctor Intervention is Needed.", general: "Success in Love Marriage. Good business in Fitness, Health, Entertainment, Marriage Broker. Good Network with Public and Passionate in Business Ventures." },
    8: { health: "Very Low Immunity, Operation possibility, Incurable disease, Difficult to diagnosis and Curing takes longer time and also Accident Indicated.", child: "Difficulty in Child Birth, Abortion Indications, Adoption, Medical Assistance Needed for Child Birth.", general: "Tension or Obstacles in Love matters, Break in Love affairs, Good Money in Healing or Technology or Science or Research or MNC, Obstacles on Money matters, Many fights, Mental Tension, Imbalance of Life and Loss in Investment." },
    9: { health: "Good Health, Good Immunity, God's grace in Health and Disease Cures Faster.", child: "Child birth is Good through God's grace and Medical Assistance.", general: "Success in Love Marriage through Elders approval, will take Good Decision, Good Education through intelligence, intelligence enhances through Mentors, Good ethics and ideologies." },
    10: { health: "A Neutral House for Health, but it shows Long term life style disease or a Mild Long term disease like BP or Diabetes and cure takes longer time.", child: "Difficult for Child Birth, Miscarriages possible, Medical assistance shown.", general: "Strong Public Relations, Good result in Name or Fame, Prestige or Ego in Love matters which results in Separation, Name and Fame in Healing, Software, Consultancy related Jobs. Good Money through Management and Administration areas." },
    11: { health: "Good Health, High Immunity, Disease or Minor Operation or Faster Cure.", child: "Good Child Birth, Happiness from Child Birth and Prosperity through them.", general: "Good Intelligence, Strong Social Networks, Success in Shares, Success related to Love and Marriage, Good income from Entertainment Industry, Consultancy and Healing." },
    12: { health: "Health issues, Long Term Disease or Frequent Hospitalization, Failure of Operation or Difficulty in Cure.", child: "Difficulty in Child Birth, Loss of Child Birth or Separation from them.", general: "International projects, Huge loss in Investment or Business or by Lending, Problem from surety, Love issues leads to Fights or Separation, Loss in Job, Good in charitable or Hospitality industry, Good profit without investment and only through Creativity and Talent." }
};

const SIXTH_CUSP_PREDICTIONS: Record<number, { job: string; health: string; legal: string; general: string }> = {
    1: { job: "High Effort in Job, Money or less income and increases with more effort, self-dealing in job like Law, Medicine, Health, Healer, Banking, Software and Service Industry.", health: "Health issues indicated, Shows Minor illness, Interest in Fitness and Body Building.", legal: "Trouble in Legal Case to Self, Win Possibility with Struggle.", general: "Difficult to repay Loan, Need Lot of Effort to Pay and Long term taken, Difficult to get back the Lost item." },
    2: { job: "Normal Job, Good Earnings from Job in Hotel, Food, Law, Medicine, Health, Dental, Banking and Family Business.", health: "Normal Health, But Life style disease Indicated, this is a Maraka Sthana.", legal: "Neutral in Legal Case, Trouble to Opponents, Expenses in Legal cases and Settlement Indicated", general: "Money through Loans, Good Servants, Great Savings Through Service or Job with earning Movable Property, Possibility to Get Back the Lost item." },
    3: { job: "High effort in Job, Job Favourable in Sales, Marketing, Media, Journalism, Documentation, Contracts, Commission, Agreements, Information Technology and Communication.", health: "Fast Recovery From Health, With Exercise, Life style and Yoga Results in Good Health.", legal: "Negotiation in Legal Cases, Compromise through Mediation and Effort.", general: "Good Earnings through Commission, Agency, Dealership, Communication, Short Travels, Lost items are Possibly away from Home or Far form Lost place." },
    4: { job: "Little less interest in Office oriented jobs, Jobs in Education field, HR, Teaching field, Home Décor, Data Science, Real-Estate, Vastu, Hotel Industry, Agriculture, Home based job.", health: "Long term disease, Ailments Curing takes Longer period, Less Immunity, Weak Body and Sedentary life.", legal: "Legal cases from Home or Family side, Difficult to Win due to Authority non favourable. Compromise Indicated.", general: "Good results in Competition Exams, Good Name in Society, Loan for Land, Vehicle, Education and Agriculture, Lost Item at Home and Delay to find it." },
    5: { job: "Bad for Job, Frequent Change in Job, Less interest in Job, Jobs in Entertainment, Healing, Medicine, Software, Solution Provider, Consultation, Media, Fashion and Product Development.", health: "Very Good for Health, Fast Recovery from Disease or Ailment or Operation, Good Immunity.", legal: "Loss in Legal Cases or Trouble in Legal cases, Loss of Money through Fighting Cases and Difficulty in Winning.", general: "Loss of Money through loan Lender or Taken, Loss in Job and Change Indicated, Loss in investment or No Recovery of Investment. Difficult to Recover Lost Item." },
    6: { job: "Good Job and Career, Job good in Law, Banking, Medicine, Engineering, Police, Military and Service Industry.", health: "Frequent Health Issues Indicated, Minor Ailments or Small Operation, Low Immunity, Need to Exercise to Maintain Good Health.", legal: "Struggle in Legal Battle Indicated, Win in Legal cases, Loss to Opponent Indicated.", general: "Good income. Gets loan and repays too. Gets back loaned amount soon. Lost item Recovered through Legal or Police Intervention." },
    7: { job: "Job Good and High Contacts, Jobs in Sales, Marketing, Retail, Business projects, Dealer, Daily Transaction, Data Analyst, Good Income.", health: "Good Health, Recovery from illness, Saves from operation or Chronic illness, but a Maraka Sthana.", legal: "Legal cases takes Longer time, High Negotiation, Compromise in Legal case.", general: "Less enemy, Partnership business is good, Repayment of Loan is possible, Difficult to get back the Lost item since the item with opposite person." },
    8: { job: "Loss in Job, Obstacles, stress, challenges, difficulties, Frustration, Setbacks, Job is Favourable if in fields like Astrology, Computers, Medicine, Research, Analysis, Auditing, Insurance, Manufacturing and Film Line.", health: "Health issues are high, possibility of Surgery, Chronic Pain, Long term Chronic Disease, Healing Difficult and Weak Immunity.", legal: "Loss in Legal case, Financial loss in Legal Matters, Legal Entanglement, Conspiracy, Stress, Fights, Obstacles and Death like Situations.", general: "Humiliation from Enemies, Problem in loan Getting or Repayment, Trouble or Problem from Servants and Employees, Lost item Difficult to get back." },
    9: { job: "Job involves Distraction, Resignation, Instability, Support in Job through Ethics only, Travel in Job, Job Like Preaching, Professor, Consultant, Trust, Navy, Hospital, Management and Good in Abroad.", health: "Good Health, Healing is faster, Good Immunity, Small Ailments and illness.", legal: "Support from Higher Authority, God's Grace and Ethics provide Support, Compromise or win in legal case with delay.", general: "Support from Servants, Employees, Loan repayment is easy, Mind Follows Ethical and Philosophical way, Difficult to get back lost item, try through Elders." },
    10: { job: "Very good in Job, Lots of interest in Job, Fast career Growth, Grows to the Highest position based on Knowledge or Intelligence, Name or Fame in Job, Job good in Management, Political, Civil Service, Government, Administration, Authoritarian Role, Management and Head of any Chosen Field.", health: "Life-style Disease Indicated, less Immunity, Health is Medium and Slow in Recovering.", legal: "Wins in Legal case, Support from Authority, Gain over Opponents.", general: "Loan is easy and repays fast, Servants and Employees are Supportive, easy to get back Lost item." },
    11: { job: "All Areas of Job will be Good, NGO's, Private Clubs, Pub, Restaurant, Government, Private Banks and Success in Chosen Field, Gains, Profits and Support Indicated.", health: "Health is Very Good, Small Ailments or Minor Operation or Lifestyle Disease indicated.", legal: "Gain From Legal Cases, Win in Legal Case easily, Gets Back Money or Articles in Legal Cases.", general: "Servants, Employees Helpful, Loan Repayment Successful, all efforts successful, easy to get back Lost item." },
    12: { job: "Job Loss, Disappointment, Job less, Loss of Money, end of one's career or no Stability, Job in Spirituality, Health Industry, Research, Astrology, Science, Abroad, Agriculture, MNC, Export, Legal, Insurance, Investigation, Detective and Script Writer.", health: "Hospitalisation, Long Term Ailment, Health is Bad.", legal: "Win in Legal case is very difficult.", general: "Most time problem with loan tension or High Expenses, Problem from Servants and Employees. Job in abroad or away from home will be Good, Difficult to get back Lost item." }
};

const SEVENTH_CUSP_PREDICTIONS: Record<number, { marriage: string; business: string; general: string }> = {
    1: { marriage: "Marriage Interest less, Self-Centered, Self Focused, Mind Isolation and Distanced from Family, Married Life Medium.", business: "Self Set-up Business, Struggle to Earn More, Self-effort in Business, will work Independently in Business and Achieve Success.", general: "Good Name in Society, Many followers with less opponents but always will be Isolated, Should work without own Investment, Negotiation or Mediation is Difficult due to Egoistic Nature." },
    2: { marriage: "Marriage is Good, Money through marriage or Post Marriage, Family with Money Oriented Partner, Togetherness of couple linked to having Food, Savings, Jewellery and Partnership in many areas Indicated.", business: "More money from business, Gain from partnership, Family Business too, Business Indicated in Hotel, Gems, Marriage Bureau, Food, Dental, Jewellery, Banking and Finance.", general: "Good ties with family relations, More Family Functions and Get-together, Negotiation or Mediation Fruitful." },
    3: { marriage: "Marriage through Communication, Discussion or Effort, Marriage Through Marriage Dealer, Matrimony Sites or Dating App. Marriage life is Medium and More communicative with Little Aggressiveness.", business: "Commission based Business Good, Support from partner through Communication and Guidance, Analyst, Sales, Internet Surfer, Social Media, Matrimonial App, Writer, Online Business and Marketing interest.", general: "High Effort in Life, Improvement in life over Time with Experience, Courage and Fearless attitude in Society, Negotiation or Mediation on Written agreement." },
    4: { marriage: "Less Interest in Marriage or Just commitment to Marry, Loss in Love affair or Betrayal in Love or Absence of Affection, Engagement Cancellation in Marriage, Less Interest in Romance or Enjoyment or Less Conjugal Married Life and focused more on Home Comforts or Material Possession.", business: "In Business Income from Home, Real-Estate, Teaching, Agriculture, Institution, Farming, Automobile, Tuition, Vastu, Contractors, Hotel Industry, Hospitality Industry, Data Centre, and Construction.", general: "Focus on Home Improvement, Property from Partner. Money or Income is good from a partner or Partner in Job, Famous in Society or Known in More Circles, Negotiation or Mediation fails and favorable to opposite person." },
    5: { marriage: "Love Marriage is possible or Marriage through Self-Selected Person or Highly Selective in Choosing Partner or Remains Unmarried Due to Spiritual Inclination or Delayed decision, Occasional Disturbance is Indicated.", business: "Business Good only without investment. Business good in intellectual area, Fashion, Beauty Parlour, Consultation, Spiritual Centre, Advertisements, Children play school, Event Organisers, Solution Provider, Architect, Healers and Event Management.", general: "Most Time Finance will be an issue, Interested in Stock Trading, Money Given to others will be Delayed or Denied, Most time life does not show correct Direction to Move Ahead, Negotiation or Mediation Fails." },
    6: { marriage: "Marriage is difficult, Shows Separation, Abuse, Fights or Divorce, Either of Partner's Health is bad, Legal entanglements, If the Couple Plan to Make Money or Focus is on Immovable property or Material Possession or Busy in Career Married Life goes Little Smooth.", business: "Good income from Business, More Rivalry in Business, If Business is in Service Industry, Health, Financiers, Law.", general: "Money from Fights or from Partner Indicated, Negotiation or Mediation does not go well with fights Indicated." },
    7: { marriage: "Good Marriage, Prosperous Married life, Either of Partner will be Famous, Married couples with Good Health and Money.", business: "Good Business Ideas, Partnership Business Good with No tension, Business like Retail store, Sales, Logistics, Banking Services, Public relation Services, Daily Transactions and Marketing.", general: "More Contacts and Publicity, Daily Interaction with many people, Negotiation/Mediation goes well with Settlement." },
    8: { marriage: "Marriage Delayed or Tension, Upsetting, Obstacles, Stress, Humiliation in Marriage, Less interest in Marriage life, Separation indicated.", business: "Troubles in Partnership Business, Legal issue in Business, Business Stress, Hurdles, Tension. If Business is Involved in Research, Engineering, Manufacturing, Auditing, Insurance, Agriculture, Mines, Petroleum, Granite and Software or Technology is Good.", general: "Unethical Approach, Problems from Public and Self-Generated Troubles, Negotiation or Mediation fails and Troublesome." },
    9: { marriage: "Good Marriage life, Ideal partner, Luck from Marriage, In relationship it shows Principles or ideologies in Marriage, Couples travel far and also have Spiritual Trips.", business: "Business is through Support and Medium Profit, Business in Teaching, Training, Consultation, Tourism, Publication, Immigration, Travel, Hospital Management, Spiritual trusts, NGO's and old age homes", general: "Meets lot of people for Ideologies, Negotiation or Mediation are towards Compromise." },
    10: { marriage: "Delay in Marriage, Less Interest in Marriage, Marriage usually with a Name or Fame person, Ego with Prestige in Married life, Desires and Dreams on Relationship or Marriage are Ended on Legal matters.", business: "Business is very Good, Business gets good Name, Growth in Business, Good profit in Business, Good Brand, Recognition, Status, Business in Government Contracts, Corporate Company, Political Office, Chartered Accountants, Directors and Agencies.", general: "Focus on High Contacts and Friendship towards Authority Indicated, Negotiation or Mediation will be Successful." },
    11: { marriage: "Marriage is dependent on 2nd or 7th house Involvement with 11th house, Generally Happy Married life, Life partner as per one's wish, Friendly Natured Partner in Marriage.", business: "Business is very Good and Profitable, Good Business as Partnership, Business in PUB's, Club's, NGO's, Private Banks, Restaurants and Government projects.", general: "Gain from Discussions, Dreams, Wishes or Vision Fulfilled, more contacts, Negotiation or Mediation are Successful." },
    12: { marriage: "Marriage difficulty, Divorce possibility in Marriage, Either partner unhealthy, Cheating, Losses, Humiliation, Disappointments, Obstacles in Marriage, If working Couples staying away in different Cities or in Abroad can sustain Marriage.", business: "High loss in Business, Cheating in Business, Business partner Cheating, Disappointments in Business, if Business in Hospital, Research, Yoga, Astrology, Spiritual Centre, Agriculture, old Age Home, Legal, Insurance and Consultant is good .", general: "Negotiation and Mediation Fails and Loss of Money too." }
};

const EIGHTH_CUSP_PREDICTIONS: Record<number, { inheritance: string; health: string; general: string }> = {
    1: { inheritance: "Money from Self Effort, Legacies and Inheritance are Difficult with lot of Struggle, Loss of Inheritance may occur.", health: "Health Issues Indicated with Mental Aberrations or Physical Ailment, Physical Exercise, Better Food Habits and Yoga Helps to overcome Health issues.", general: "Native Experiences Ups and Downs in Life, there is a Transformation from old version of life to new life, if in Research, Engineering, Yoga, Spiritual, Insurance, Surgeon, Health Industry, Manufacturing, Agriculture, Astrology, Auditing and Mystical Science Reduces Pain and Suffering." },
    2: { inheritance: "Good Money through Partner and Family, Inheritance support from Family, Money through Insurance, Gratuity, Provident Funds, Dowry from Spouse, Money from Undisclosed Source.", health: "Normal General Health, long term Disease due to Lifestyle, But a Maraka Sthana, Accident Possibility, can Lead to any type of Bad Addiction.", general: "Sudden Financial Fluctuations, Challenges for Money within Family, Good Money from Business Partner, Insurance, Fight with Father, Money from Father Through fights, if in Research, Engineering, Yoga, Spiritual, Insurance, Surgeon, Health Industry, Manufacturing, Agriculture, Astrology, Auditing and Mystical Science Reduces Pain and Suffering." },
    3: { inheritance: "Fights with Siblings on Partition, Agreements, Written Communication, Good money from Inheritance, Negotiations ends in Controversies.", health: "Good Health with Immunity and Valour, Minor Health Ailments and Minor Surgeries.", general: "Good Money from Insurance, Commission from Insurance, Money through Agencies or Contract, Scandalous Communication or Involvement Leading to Legal complication." },
    4: { inheritance: "Inheritance or Legacy from Home Indicated, Obstacles, Hurdles or Legal in Obtaining Inheritance Denoted, Property from Spouse Indicated.", health: "Many Accidents, always gets body injuries, High Expenses for Medicine or Surgery, Immunity very less and prone to Chronic Ailments, Falls from High rise place.", general: "Unexpected Problems to home or Theft Indicated, No Mental Peace or Tension or Misunderstanding at Home, Vehicle Accident or More Expenses Indicated, Mother's Health is not good, if in Research, Engineering, Yoga, Spiritual, Insurance, Surgeon, Health Industry, Manufacturing, Agriculture, Astrology, Auditing and Mystical Science Reduces Pain and Suffering." },
    5: { inheritance: "Difficulty in getting Inheritance, Loss in Inheritance through Legal case, Fights for Money from Inheritance or Insurance or Legacy.", health: "Good Health, Operation successful, Long Term or Chronic Ailments gets cured, Life style disease indicated, can lead to any type of Bad Addiction.", general: "Hard work with less Success, Humiliation, Stress, Loss in Speculation or Shares, Issue in Fun or Enjoyment or Love Affairs, Difficulty in Child Birth or Difficulties from Children, Indicates Hidden Knowledge or acquire New Skills, Spirituality Helps." },
    6: { inheritance: "Inheritance through Struggle, Disputes or Fights for Inheritance and more Enemies in Family.", health: "Bad Health, Accident possibility, Operation or Surgeries Difficult to Cure, Long term Ailments or Chronic Disease, Difficult to Diagnose, can lead to any type of Bad Addiction, very Less Immunity, Regular Exercise or Fitness Needed.", general: "Wins court case after lot of Struggle, Humiliation or Hurdles or Pain in Job or Business area, Loan repayment is difficult, Transformation after Stress, Tension and Challenges, Job or Business in areas like Medicine or Healing or Research or Occult Science or Engineering or Service Industry Helps to reduce above matters, Theft possibility High." },
    7: { inheritance: "Disputes in Inheritance can be overcome by Negotiation or Mediation, some Struggle to get Inheritance.", health: "Good Health, Maraka Sthana, Less lifespan, Operation or Surgeries cure faster, Good Immunity.", general: "No much struggle in life. Any trouble will be handled diplomatically, Issues with Relationship is usually Compromised, Wrong Decisions to be Avoided and Pain and Stress in Relationship or Business Indicated." },
    8: { inheritance: "Money from Partner or Spouse, Inheritance or Dowry or Legacy Indicated, Huge Ancestral property indicated and Sudden Wealth.", health: "Bad Health or Chronic Disease, Operation indicated, can lead to any type of Bad Addiction, this shows very bad on Health but gets back to Good Health surprisingly, Long Life but Low Immunity, Father's Health is a concern.", general: "Feels Lonely or Isolated at Home, Stress or Depression most of the time, Job or Business in areas like Medicine or Healing or Research or Occult Science or Engineering or Service Industry helps to reduce above matters." },
    9: { inheritance: "Money from Father, Inheritance is indicated, Little Indifference with father.", health: "Good Health, life style disease indicated, Operation successful.", general: "Hindrances in higher studies, Misery and Challenging to complete higher Education, Difficult to maintain Ideology and Values, Travel's a lot or stays far Off." },
    10: { inheritance: "Difficulty in Inheritance, Delay in Getting Ancestral Property.", health: "Medium Health, Long term Ailment, Life Style Disease, Healing takes More time.", general: "Good Name and Unearned Money, Money through Fame, Fame Post Death Too, Will Win against any Conspiracy, Delay's, Difficulties, Obstacles, Rejections in Career, Job or Business in areas Like Medicine or Healing or Research or Occult Science or Engineering or Service Industry Helps to reduce Above matters, Shows Major transformation in Life on Career." },
    11: { inheritance: "Profit from Ancestral Property, Inheritance Indicated, Money or profit from Partner, Trouble from Elder Brother or Elder Sister.", health: "Very Good Health, Surgery or Operation successful, long life.", general: "Good Unearned Money, winning in any tough situation indicated, Problems or Stress or Pain from Friends or Society, Profits through lessons learnt or through Transformation from Friends or Society, if in Research, Engineering, Yoga, Spiritual, Insurance, Surgeon, Health Industry, Manufacturing, Agriculture, Astrology, Auditing and Mystical Science gives more Profit" },
    12: { inheritance: "Loss in Ancestral Property, Money loss through Partner, Inheritance troublesome or Denial indicated, Loss through Inheritance.", health: "Very Bad Health, very Less Immunity, Surgery or Operation Unsuccessful, Most time ill-Health, can lead to any type of Bad Addiction.", general: "Theft possibility is High, loss in Litigation or loss from Enemies or Unknown person, Losses or Expenses or Separation from Public and Family, may lead to Hospitalisation or Imprisonment or Confinement, if in Research, Engineering, Yoga, Spiritual, Insurance, Surgeon, Health Industry, Manufacturing, Agriculture, Astrology, Auditing and Mystical Science reduces Pain and Suffering." }
};

const NINTH_CUSP_PREDICTIONS: Record<number, { higherEducation: string; travel: string; father: string; general: string; secondMarriage: string }> = {
    1: { higherEducation: "Success in Higher Education by Self Effort, Self Interest on studying will be lifelong.", travel: "Self-decision for Long Journey or Abroad, Travel for studies indicated", father: "Less Support from Father, Relationship is Neutral.", general: "Self-Decision, Spirituality, Own Ideologies or Moral Values in Life.", secondMarriage: "Second Marriage through self decision, Marriage leads to Isolation and Distanced from Family." },
    2: { higherEducation: "Success in Higher studies in own country, gets a Good Mentor, Loan for Higher Studies through Bank Indicated.", travel: "Higher Studies in Abroad possible, Frequent Travel with Family Indicated.", father: "Money from Father or Ancestral, Father main decision maker in Family.", general: "Money from Spirituality, Philosophy, Trust, Travel, likes Good Food, Good Speaker on Spirituality or Moral Values.", secondMarriage: "Success in Second Marriage, Spirituality or Moral Values with Couples." },
    3: { higherEducation: "Difficulty in pursuing Higher Studies, Short Travels for Study purposes.", travel: "Short Journey, Loves short trip, Abroad Travel indicated.", father: "Communication with Father more, Father helps for Higher Studies.", general: "Money from debates, Good Investigator, Communication on Spiritual and Philosophy, Support from Neighbours.", secondMarriage: "Medium Success in Second marriage, Communication more in Relationship." },
    4: { higherEducation: "Great success in Higher Studies, focus more on New Learning, Studies Indicated Life Long, Writes Books and Periodicals, Acquires Specialized Knowledge on Interested Subject.", travel: "Travels Abroad for Studies.", father: "Father Educated or helps in Higher Studies to Native, Property from Fore-Father.", general: "Knows Spirituality, Philosophy and Higher knowledge in Scriptures, Builds Temple, Trust, Institution, Hospitals, Destiny good and brings great benefits", secondMarriage: "Difficult in Second Marriage, Loss of Love in Marriage or detachment mind-set post Marriage." },
    5: { higherEducation: "Good for Higher Studies, Acquires new knowledge through Intelligence, gets higher wisdom and gains experience through Studies.", travel: "Travel more related for Pleasure or Leisure, Higher Studies in Abroad helps, Spends more on Travel.", father: "Support from Fore-Father and Father.", general: "Good Intelligence, very good Health, Spiritual and Philosophical, highly lucky.", secondMarriage: "Second Marriage Difficult, Marriage probably through Love or through highly selective mind-set in selecting Partner." },
    6: { higherEducation: "Good result in Competitive exam, Higher Studies in Technical or Service Areas of Life.", travel: "Long Journey on Job indicated, Travels Abroad for Job.", father: "Not good Relation with Father, Inimical Relationship with Father, Discussion with Father too less.", general: "Good Mediator from disputes and fights, good money through Service or Consultation, Health suffers.", secondMarriage: "Second Marriage also problematic, Physical Separation or Second Marriage focus mainly on making Money and Luxury within Couples." },
    7: { higherEducation: "Support from others for Higher Studies, Interested in Business Studies.", travel: "Travel profitable for Business deals, Pleasure or Leisure Trips Indicated.", father: "Good rapport with Father, Father Helps the Native in Difficult times or vice versa.", general: "Good Income from Institution or Trust, Partner or Public support in Spirituality.", secondMarriage: "Second Marriage is indicated if first Marriage is divorced, Second Marriage is Good and Happy." },
    8: { higherEducation: "Stress and Obstacles in Higher Studies, Good in Research Studies, Engineering, Yoga, Spiritual, Insurance, Surgeon, Health Industry, Manufacturing, Agriculture, Astrology, Auditing and Mystical Science.", travel: "Stress and Troubles in Travel or away from Home.", father: "Trouble or Obstacle from Father or to Father only, Trouble in Inheritance Indicated.", general: "Bad Health, Problem in Religious Matters or Spirituality, Challenges and Humiliation in Life.", secondMarriage: "Second Marriage Problematic, Tension, Upsetting, Obstacles, Stress, Humiliation in Marriage, Less interest in Marriage life, Separation Indicated." },
    9: { higherEducation: "Success in Higher Education, Learns Philosophy and Spiritual subjects well, Gain Access to Best Knowledge.", travel: "Likes Travel, Profit through Travel, Travels for Higher Studies.", father: "Support from Father Indicated.", general: "Very Good Health, Excellent opportunities to Fulfil your Desires; Recognition, Fame, Status and Passion.", secondMarriage: "Success in Second Marriage with Moral Values and Support from Partner." },
    10: { higherEducation: "Name and Fame in Higher Studies, Excels in Higher Knowledge, Learns Great Skills and Techniques to deal in life.", travel: "Travel for Job or Career, Pleasure or Leisure Trips", father: "Good Name and Fame through Father, Father Supportive, Gets Fathers Money.", general: "Good Name in Spirituality, Status, Power, Prestige, Moral Values and Ideologies adopted.", secondMarriage: "Difficulty in Second Marriage, Egoistic and Selective in choosing Partner, Little Success in Second Marriage." },
    11: { higherEducation: "Success in Higher studies, Learns Many Subjects,", travel: "Frequent travels indicated, Profit from Travels, more contacts through Travels.", father: "Profit from Father, Supportive Father.", general: "Success in Spirituality, Gains, Opportunities, Social Networks, Friends, Recognition and Profits in Life.", secondMarriage: "Second Marriage possibility, Success in second Marriage." },
    12: { higherEducation: "Higher Studies in Abroad possible, Studies Good in Research, Engineering, Yoga, Spiritual, Insurance, Surgeon, Health Industry, Manufacturing, Agriculture, Astrology, Auditing and Mystical Science.", travel: "Travel for Higher Education.", father: "No support from Father, Inimical Relationship with Father.", general: "Loss of Health, Loss in Investments Seen, Good in Research, Engineering, Yoga, Spiritual, Insurance, Surgeon, Health Industry, Manufacturing, Agriculture, Astrology, Auditing, Trust, Foreign Projects and Mystical Science.", secondMarriage: "Second Marriage unsuccessful, Troubles, Tensions, Separation or Couples may be into Spirituality." }
};

const TENTH_CUSP_PREDICTIONS: Record<number, { profession: string; general: string }> = {
    1: { profession: "Image, Physical Appearance, Nutritionist, Yoga, Gym Instructor, Models, Army, Military, Psychiatrists, Life Coach Individuals, Self Effort Job, Body or Mind Related Job.", general: "Job through Self-effort, Good Name or Fame in Career by Hard work and continuity of job, day by day progress, Financial Gains are Medium." },
    2: { profession: "Finance, Banking, Speech Therapist, Family Business, Gems Dealer, Jewellery Dealer, Food or Hotel Industry, Dentist, Singer, Investment Consultant Business, Public Speakers, ENT Specialist, Marriage Bureau.", general: "Good Money and Income from Career or Business, likes his Job a lot, always does one or the other Job, Financial Gains are Excellent." },
    3: { profession: "Dealership, E-Commerce, Franchisee or Agencies, Writer, YouTuber, Journalism, Media, Short Film Line, Communication Field, Accountancy, Charted Accountant, Software related Coding or Networking, Content Writer, Commission Agent, Broker's Retail, Sales, Marketing, Advertiser, Sports, Short Travel Jobs, Tourism Industry, Broadcasting Industry, Information Technology (IT), Documentation Or Agreement contract field, Social media Apps.", general: "Money is earned through high effort or presentations or struggle or active mind, sometimes addiction of loneliness or Internet or Adamant or Aggressive behavior might lead to Career Loss, Financial Gains are Medium." },
    4: { profession: "Teaching, Educational Sector, Trainer, Team Leader, Hotel Management, Restaurants, Civil Works, Building Contractor, Rental Income, Real-Estate, Farming, Agriculture, Automobile Engineering, Hospitality or Management Industry, Vehicle Dealer, Tuitions, All Home Care or House Utility Products Dealer, Interior Designer, Vastu Consultant, Fengshui Consultant, Manufacturing.", general: "Career well at home town, small type home based Business, interested to work from Home or Home-based Jobs, Comfort or Harmonious or Easy condition at Office Work or Work at home indicated, Financial Gains are Good." },
    5: { profession: "Spirituality, Healer's, Medicine, Dietician, Fashion, Creativity, Architecture, Product Developer, Dancing, Media, Shares, Gynecology or Child Specialist, Entertainment Industry, Event Management, Film or Cinema Line, Software Field - Solutions or Services, Artificial Intelligence, Information Technology, Advertisement, Drama, Dancer, Singing, Arts, Sports, Any Consultancy, Children Play School, Cinema, Multiplex, Gamer's.", general: "Career Good without much Investment, Genuinely Passionate Native will Excel in Career, Does not like Routine Jobs, if the Native find Enjoyment in their Job they Build their Career, New or Special Skills or Talent or Expertise or Innovation helps Successful Career. If not Fear or Insecurity or Instability or Lethargy in Job, Focus on one line with Passion or Brilliance or Admiration will give Stability in Career, Financial Gains are Passion or Focus Oriented, Dependent on Interested Subject." },
    6: { profession: "All type of Service Companies, Banking, Finance, Loan division, Legal, Chartered Accountant, Medicine, Nursing, Dietician, Pharmacy, Human Resources, Army, Military, Air force, Engineering, Computer Science, Civil services.", general: "Good income from Service Industry Job, Always Job or Busy in life, Good Name and Fame in Job, some Enemies at Work Place, Health is a Major Concern for Over Working, Financial Gains are Very Good." },
    7: { profession: "Business, Banking, International Trade or Sales, Partnership, Daily Transaction or Sales, Retail, Marketing, E-Commerce, Logistics, Trading, Dealers, Data Science, Public Relation or Networking, Police, Army, Military, Partnership.", general: "Good Growth with money, High Interaction with High Contacts, involvement of Spouse Indicated, in Job a Decision-Making Role Indicated, may get Stakes in working Company, Opponents and Competition are always High, Career demands for Proper Services or Strategies to Increase Business, Financial Gains are Excellent." },
    8: { profession: "Technical, Engineering, Computer Science, Artificial Intelligence, Research, Manufacturing, Astrology, Numerology, Tarot Cards, Occult Field, Insurance, Film Line, Doctors, Surgeons, Spirituality, Yoga, Mines, Geologist, Petroleum, Oil Industry, Crime line, Priest Study, Auditor, Scientist, Excavators, Agriculture, Granite, PF, Gratuity, Legacy, Inheritance.", general: "Name and Fame damaged by wrong doings, Promotion in Job difficulty, high pressure in Job, chances of conspiracy high, not much interested in Job, Obstacles, Stress, Ups and Downs in Career, Insult, Depression, Fights, Fears, Dishonors, Insecurity, loss in Job, (Should be careful in Self-Generated Issues or Short cuts or Unlawful activity and should Avoid it), Should Stay within Values or Ethics or Principles or Work related to 8th house - Job / Business for positive results, usually this gives a transformation from problem to Newness along with Purity in life and the same should be adopted, financial gains are excellent as per all above Profession." },
    9: { profession: "All type Consultant, Counselling, Trainer, Teaching, Lecturer, Professor, Preacher, Publisher, NGO's, Religious or Educational Institution, Trusts, Law, Middle Management, Judiciary, Foreign travel, Tours, Travels, Immigration, Navy, Sports, Hospital Management, Legal Matters.", general: "Connecting to Mentor or Guru or Tradition gives Success, Principled or Ethical or ideological life, likes to gain more Knowledge always, likes independent Job with No Boss, support from Father in Career, Name and Fame away from Home or Abroad, Difficult in Promotion, End of Position or Moderate Growth in career, Financial Gains Excellency depends on above mentioned points or Focus." },
    10: { profession: "Government, Senior Management, Politics, Administrator, Civil Services, all type of Managers, Corporate Level, Managing Directors, CEOs, Chartered Accountant, Team Leaders, Supervisors,", general: "Honours, Rewards are High, Income also very good, Head or Lead or President or high Profile in Career, Name or Fame or Success in any type of Job or Business, Good success in high post or grow to that level faster, Important point to focus is on Law or Principle in Job or Business to Avoid Loss of Position or Reputation, Financial Gains are Excellent." },
    11: { profession: "Good in all Areas and is subject to important Astrology houses associated like 2, 3, 4, 6, 7, 9, 10 combinations for best Job or Business and little difficulty with 1, 5, 8, 12 Houses, Focused Working on any Projects by any Sector or MNC will be Favourable.", general: "Determined job or Business gives Success, Success in all Endeavour's, Help from Friends or Social Circle for Job and Business, More Money and Profit in Job and Business, Will do all Jobs without Obstacles, Financial Gains are Excellent based on other Important associated Astrological Houses, Financial Gains are Good." },
    12: { profession: "Research, Invention, Yoga, Meditation, Astrology, Spirituality, MNCs, Medicine, Hospital, Health Consultant, Foreign Projects, Abroad Jobs, Insurance, Nursing, Psychology, Legal, Detective, Script Writer, Agriculture, Export Industry, Old age Homes, Investigation, Detective.", general: "Job or Business far from birth place, Loves Solitude, Business good without investment, constant change in Projects or Job or Career, usually experience Pressure or Fears or Agitated or Stress or Tension or Inferiority Complex, if distracted Native may waste life through Addiction or Negative Imagination or False Fantasies and Ruins Self, if works with 12th house Professions as stated above Positive Results and Less Misfortune indicated, Financial Gains are Good based on above Criteria and Carefulness." }
};

const ELEVENTH_CUSP_PREDICTIONS: Record<number, { general: string }> = {
    1: { general: "Good Health, Courage and Long Life, Success in many areas on Self Decision or Self Effort, Good Respect, Dreams or Desire is on Self Image or Appearance of Physical, Good Motivational Speaker, Self Presentation or Self Skills Indicated," },
    2: { general: "Huge Savings and Good Bank balance, Good Profit from Many Areas, Good support from Friends, Less issue in terms of Money, Gains from Speech / Food / Family / Liquid Assets / Network, Good Education , Gain From Marriage, Child Birth or Gain from Children." },
    3: { general: "Money or Gains from Debate / Journalism / Literature / Writing / YouTube / Sports / Communication / Social Media / Sales / Marketing / Public Speaking / Documentation / Franchises / Commission / Contracts / Online / E-Commerce / Agreements / Younger Siblings, winning through Struggle or Courage, Gain from Sale of Property, Gains from Short Travel, Strong active Mind." },
    4: { general: "Landed Properties, Profit from Home, Good Success from Real Estate / Teaching / Education / Agriculture / Vehicle / Educational Institution / Builds Good Building / Supportive Mother / Vastu / Support from Spouse or Partner, Good Education, Gain from Construction or Home." },
    5: { general: "Good Income from Creative, Technical, Recreation, Sports, Health, Healing, Spiritual, Entertainment, Speculation, Software, Shares, Dance, Music, Drama, Solution Provider, Good for Love related matters, Child Birth or Children's Good with Native, There is Change most time in Career, Transformation from One Career to other Career seen, Mastery in one Strong Field gives Good gains, Your Job or career will not have good Supporters and Well-wisher's, Good Health, Chance of Love Marriage or Self Selected partner, Compromise in Litigation." },
    6: { general: "Winning in many Areas of Life, Winning in Court case, Job areas good like Politics / Legal / Medical / Financial / Litigations, Good servants and loyal to them, Success in Service Industry, always Active and Success in Job, Win against Enemies at work place" },
    7: { general: "Good Support or Name from Public, Good Money from Business or Spouse or Partnership, Good Position in Company / Daily Sales / Business to Business, Marriage too Profitable, More Material Success." },
    8: { general: "Tension or Humiliation most of the time, Stress, Obstacles, Scandals, Illegal Activity, Fights are High, Trouble from Elder Brother / Elder Sister / Friends / Elders, Most work or Task will become Incomplete or Problematic, But Work Related to Astrology, Software, Mining, Contracts, Manufacturing, Technical, Vastu, Tarot reading, Artificial Intelligence, In-depth works, Yoga, Secret Science, research will be More Beneficial and Profitable, Even legacy or Unearned money Indicated like Insurance, Ancestral Property, Alimony, Lottery, Pension, PF, which denotes end of something and start of New." },
    9: { general: "Profit from Travelling or Away from Home, Support from Elder Brother / Elder Sister, helps in Higher studies, Support from Father, Gain from / Immigration / Counselling / Book Publisher / Coaching / Foreign Affairs / Higher Studies / Consultation / Training /" },
    10: { general: "Reaches high Position in Life, Elevated Status, Work's in Big Organization, Earns Name and Fame in many Fields, Respect from Elders, Public, Office, Elder Brothers or Elder Sisters, comes to a High Position in Life, Recognition, Interested in Politics." },
    11: { general: "Success in all Areas, Very Lucky, achieves what he Believes, Success with everyone, Desire Fulfilled, Support from Admirers / Followers / Elder brother / Elder Sister, High Profits and Gain." },
    12: { general: "Unsuccessful in many Areas or Works associated, Every area Unhappy, Trouble or Losses from Elder Brother / Elder Sister, Troubles from Friends too, Downtrend in Projects, Likes to be Isolated, Funds Invested shows loss, Profit from 12th house related like far Places or Abroad or MNC Companies or Long term Investment or Foreign Projects or Import Export or Astrology or Charity or Meditation or Yoga or Medical or Software or Insurance." }
};

const TWELFTH_CUSP_PREDICTIONS: Record<number, { wealth: string; health: string; general: string }> = {
    1: { wealth: "Converts loss into profit through consultation, From less Investment Huge Profit.", health: "Tired, Weak Immunity, Mental Worries, Sleep Disorders, Hospitalisation, Depression", general: "Spends others money easily, Brings out self Secrets in public, Self liberation." },
    2: { wealth: "Financial Loss, Loss of Accumulated Money, Always thinks of making Money, Secret money too possible, Good in Long term Investment, wise Investments very Important.", health: "Sickness or illness on food Habits and Bad Eating Life Style.", general: "Spends for relatives, Outside Family Members involvement and expenses for them Indicated, Likes liquid assets." },
    3: { wealth: "Makes money with difficulty from writing, Documentation issue, Agreement issue, Communication, Debates, Loss from Younger Brother / Younger Sister, Success in Foreign Documents or away from home activity.", health: "With regular exercise good health Indicated.", general: "Short travels or travels abroad, Success in Abroad or far away from Home, Loss of Active Mind Indicated with Aggressive Behaviour." },
    4: { wealth: "Spends more Money for Land, Building, Agriculture, Farming but Profit is Less, Long term Crops gives Good Gains, also always Spends for above development.", health: "Long term Ailment, Life style Disease, if Chronic Bed ridden at home, Treatment most time Ineffective.", general: "Always likes to stay at Home, Expenses More for Home buying and Home Comforts or Home in Foreign Place, Expenses for Education." },
    5: { wealth: "Loss in Investment or Lending or in Share Market, More Loss if spending on Fun or Entertainment.", health: "Mild Trouble to Health and Frequent Small Illness and possible of Hospitalization.", general: "Loss in Litigation or Court case, Loss from Children or Separation, Interested in liberation or Spiritual mind-set, if Spending or Focus is on Improving Intellect, Learning, Product Development and Creativity Good Gains." },
    6: { wealth: "Gains from Foreign Country or Hospital or Service far off Place, Loss of Money in Home town with Fights.", health: "Hospitalization or More Health Issue, Sleep disorder.", general: "High fear, Listens to Partner More, any secrets done will become Public or get revealed, Job Loss in Home town, Separation in Relationship, Many Litigation or Court Case or Loss through it, Abroad job with tension, Job profit in Medical, Legal, Police, Military, Odd time Service Jobs." },
    7: { wealth: "Loss from Partnership Business, Cheating from Partner.", health: "Health issue of Partner Indicated.", general: "Loss from Spouse or Partner, Partnership away from Home or Abroad Good, Good Name and Fame in Abroad, Interested in Spirituality, Divorce possibility, Legal Issue or Difficulties Indicated, Astrology or Yoga or Medical, or Insurance or Software or Agriculture are Profitable." },
    8: { wealth: "Gets Unaccounted money and spends heavily without hesitation.", health: "Long term Illness, Sleep disorders, Violent death possible, Always Operation or Hospitalization Indicated.", general: "Always Stress, Disturbance, Obstacles, Humiliation, Involvement in Secret Activities and Suffering from it, Good if involved in Astrology, Yoga, Science, Research, Spirituality, Hospital, Technical, Software, Law." },
    9: { wealth: "Profit from Travelling and Away from Home.", health: "Good Health and Less Hospitalization.", general: "Travels a lot, Travels Abroad, Visits Holy or Religious Places often, Spends more on Higher Learning or Travelling, Makes life Happy and Comfortable, Interested in Meditation, Yoga, Spirituality, Works for Internal Peace and Liberation." },
    10: { wealth: "Gain from job rather than Business.", health: "Low Immunity, Lifestyle diseases Indicated.", general: "Short term Work, Frequent Changes in Career, Gives Imaginative Mind and helps in building Career, Success from Enemies and Secretive people, Reaches High position through Struggle and Losses, Interested in Secret agencies like CBI, CID, Research, Writer, Author, Poet, Interested in Spirituality, Success, Name or Fame in far Place or Abroad." },
    11: { wealth: "Success in all matters after Isolation from Social Circle or Friends and focuses on Self work, Investments in Foreign projects, MNC's or NGO's good.", health: "Good for Immunity, Less Disease or Weakness in Body.", general: "Separation from Elder Brother or Elder Sister, Failures are very minimal, More interested and less depressed in life. Success in abroad, secret activities, hospital, spirituality." },
    12: { wealth: "Loss in Many areas except in few areas of work like Foreign Country, Law, Astrology, Yoga, Medical line, Agriculture, Trust.", health: "Stress and Hospitalization Most of the Time.", general: "Trouble from Many areas of Life, Humiliation or harm most of the time. Possibility of jail, Away from home, Abroad, Isolation, Depression, Addiction, Indicated." }
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
    } else if (area === 'Travel') {
        good = [1, 3, 7, 9, 11, 12];
        bad = [2, 4, 11];
    } else if (area === 'Property & Vehicle') {
        good = [1, 2, 4, 6, 7, 8, 11, 12];
        bad = [3, 5, 10];
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

const JobPredictionTable: React.FC<JobPredictionTableProps> = ({ 
    data, 
    planets, 
    types, 
    planetName, 
    selectedArea, 
    customLabel,
    isTransitMode = false,
    loadingTransit = false,
    onTransitToggle,
    selectedHouseNum,
    isPrashnaMode = false
}) => {
    const isEducation = selectedArea === 'Education';
    const isMarriage = selectedArea === 'Marriage';
    const isChildBirth = selectedArea === 'Child Birth';
    const isHealth = selectedArea === 'Health';
    const isTravel = selectedArea === 'Travel';
    const isProperty = selectedArea === 'Property & Vehicle';
    
    // Resolve the active cusp number robustly
    let activeCuspNum: number | undefined = selectedHouseNum;
    if (!activeCuspNum && customLabel) {
        const match = customLabel.match(/^(\d+)/);
        if (match) {
            activeCuspNum = parseInt(match[1]);
        }
    }
    
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'DETAILS' | 'REMEDIES'>('DETAILS');
    const [subTab, setSubTab] = useState<'ABROAD' | 'HOME' | 'PURCHASE' | 'SALE'>(isTravel ? 'ABROAD' : 'PURCHASE');
    const [showCalculation, setShowCalculation] = useState(false);

    const isPlanetRetrograde = (name: string) => {
        const p = planets.find(pl => pl.planet.toLowerCase() === name.toLowerCase());
        return p?.is_retrograde || false;
    };

    const planetData = data.find(p => p.planet === planetName) || data[0];
    if (!planetData) return <div>No data available</div>;

    const placementMap: Record<string, number> = {};
    planets.forEach(p => { placementMap[p.planet.toUpperCase()] = p.house_placed; });

    let plHit = placementMap[planetData.planet.toUpperCase()];
    let nlHit = placementMap[planetData.star_lord.toUpperCase()];
    let slHit = placementMap[planetData.sub_lord.toUpperCase()];

    let plHouses = planetData.pl_signified.map(h => h.house);
    let nlHouses = planetData.nl_signified.map(h => h.house);
    let slHouses = planetData.sl_signified.map(h => h.house);

    if (isChildBirth) {
        plHouses = plHouses.filter(h => h !== 3 && h !== 6 && h !== 7);
        nlHouses = nlHouses.filter(h => h !== 3 && h !== 6 && h !== 7);
        slHouses = slHouses.filter(h => h !== 3 && h !== 6 && h !== 7);
        if (plHit === 3 || plHit === 6 || plHit === 7) plHit = -1; // -1 to avoid matching any house
        if (nlHit === 3 || nlHit === 6 || nlHit === 7) nlHit = -1;
        if (slHit === 3 || slHit === 6 || slHit === 7) slHit = -1;
    }

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
            if (h === 1) return isBad ? '#ef4444' : '#16a34a';
            if ([5, 9, 11].includes(h)) return '#16a34a';
            if ([2, 3, 7].includes(h)) return '#60a5fa';
            return '#ef4444';
        }
        if (isBad) return '#ef4444';
        if ([2, 5, 6, 7, 8, 9, 10, 11].includes(h)) return '#16a34a';
        if ([1, 3, 4].includes(h)) return '#0ea5e9';
        return '#1e293b';
    };

    const renderHousesPerRow = (sigs: number[], hit: number) => {
        const hSet = new Set(sigs);
        if (hit !== -1) hSet.add(hit);
        const pool = Array.from(hSet);
        
        const bif = getBifurcation(hSet, selectedArea);
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
                            fontWeight: '900'
                        }}>
                            {h}
                        </span>
                    ))}
                </div>
            );
        };
        return { good, bad, renderCell };
    };

    const plBif = renderHousesPerRow(plHouses, isHealth ? -1 : plHit);
    const nlBif = renderHousesPerRow(nlHouses, nlHit);
    const slBif = renderHousesPerRow(slHouses, slHit);

    const primaryHitsRaw = [nlHit, slHit].filter(h => h !== -1);
    const primaryHits = Array.from(new Set(primaryHitsRaw));
    
    const secondaryHitsRaw = [...nlBif.good, ...nlBif.bad, ...slBif.good, ...slBif.bad]
        .filter((n): n is number => typeof n === 'number' && n >= 1 && n <= 12 && !primaryHits.includes(n));
    const secondaryHits = Array.from(new Set(secondaryHitsRaw));

    const comboGoodSet = new Set([...plBif.good, ...nlBif.good, ...slBif.good]);
    const comboBadSet = new Set([...plBif.bad, ...nlBif.bad, ...slBif.bad]);

    const allHousesSet = new Set([
        ...plHouses,
        ...nlHouses,
        ...slHouses
    ]);
    if (plHit !== -1) allHousesSet.add(plHit);
    if (nlHit !== -1) allHousesSet.add(nlHit);
    if (slHit !== -1) allHousesSet.add(slHit);

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
                            fontWeight: isCircled ? '900' : '800',
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
        Dasha: { color: '#ffd8d1', text: '#000000', label: 'Dasha' },
        Bhukti: { color: '#a2d5c6', text: '#000000', label: 'Bukthi' },
        Antara: { color: '#e9d5ff', text: '#000000', label: 'Antar Bhukthi' },
        Cusp: { color: '#FFD700', text: '#000000', label: 'Cusp' }
    }[t]));

    // Determine header background based on highest priority type
    const getHeaderStyle = () => {
        const themeMap = {
            Dasha: '#ffd8d1',
            Bhukti: '#a2d5c6',
            Antara: '#e9d5ff',
            Cusp: '#FFD700'
        };

        if (types.length === 0) return { background: '#f8fafc', color: '#1e3a8a' };
        if (types.length === 1) return { background: themeMap[types[0]], color: '#000000' };
        
        const step = 100 / types.length;
        const stops = types.map((t, i) => `${themeMap[t]} ${i * step}%, ${themeMap[t]} ${(i + 1) * step}%`);
        return { background: `linear-gradient(to right, ${stops.join(', ')})`, color: '#000000' };
    };
    const headerStyle = getHeaderStyle();

    const isForeignStudies = React.useMemo(() => {
        if (!isEducation) return false;
        const has9And12 = allHousesSet.has(9) && allHousesSet.has(12);
        const hasSupport = [3, 4, 5, 7, 8].some(h => allHousesSet.has(h));
        return has9And12 && hasSupport;
    }, [allHousesSet, isEducation]);

    const isJobAndBusiness = !isEducation && !isMarriage && !isChildBirth && !isHealth && !isTravel && !isProperty;

    const nlProfessionText = React.useMemo(() => {
        let text = shuffleText((isEducation ? EDU_PROFESSION_MAP : isMarriage ? MARRIAGE_RESULT_MAP : isChildBirth ? CHILD_BIRTH_RESULT_MAP : isHealth ? HEALTH_RESULT_MAP : JOB_PROFESSION_MAP)[nlHit]);
        if (isForeignStudies) text += ", Foreign Studies (ACCA, MBA, PMP, CPA, CFA, CMA US, FRM, International Certification)";
        if (isJobAndBusiness) {
            if ([3, 5, 8].includes(nlHit)) text += ", Film line";
            if ([8, 12].includes(nlHit)) text += ", Spirituality";
        }
        return text;
    }, [nlHit, isForeignStudies, isJobAndBusiness]);

    const slProfessionText = React.useMemo(() => {
        let text = shuffleText((isEducation ? EDU_PROFESSION_MAP : isMarriage ? MARRIAGE_RESULT_MAP : isChildBirth ? CHILD_BIRTH_RESULT_MAP : isHealth ? HEALTH_RESULT_MAP : JOB_PROFESSION_MAP)[slHit]);
        if (isForeignStudies) text += ", Foreign Studies (ACCA, MBA, PMP, CPA, CFA, CMA US, FRM, International Certification)";
        if (isJobAndBusiness) {
            if ([3, 5, 8].includes(slHit)) text += ", Film line";
            if ([8, 12].includes(slHit)) text += ", Spirituality";
        }
        return text;
    }, [slHit, isForeignStudies, isJobAndBusiness]);

    const jobNoteText = React.useMemo(() => {
        if (!isEducation && !isMarriage && !isChildBirth && !isHealth) {
            // Only show this fixed text when success rate is bad/very bad. Do not shuffle.
            if (successCode.startsWith('B') || successCode.startsWith('VB')) {
                return "Good in Medicine, Abroad, Software, any Business without investments, Astrology, Technology";
            }
        }
        return "";
    }, [selectedArea, isEducation, isMarriage, isChildBirth, isHealth, successCode]);

    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
            marginBottom: '1.5rem',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            width: '100%',
            maxWidth: '100%',
            margin: '0 0 0.75rem',
            border: '1px solid rgba(124, 92, 183, 0.08)',
        }}>
            <div style={{ 
                background: headerStyle.background, 
                padding: '16px 20px', 
                borderBottom: '1px solid rgba(124, 92, 183, 0.08)' 
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                }}>
                    <h3 style={{ margin: 0, color: headerStyle.color, fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        {planetName} - {selectedArea} {customLabel && <span style={{ fontSize: '0.8rem', opacity: 0.9, marginLeft: '8px', padding: '2px 6px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}>{customLabel}</span>}
                        {isTransitMode && <span style={{ color: '#3b82f6', marginLeft: '8px', fontSize: '0.75rem' }}>(TRANSIT)</span>}
                    </h3>

                    {!selectedHouseNum && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: isTransitMode ? '#3b82f6' : '#64748b' }}>
                                TRANSIT
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTransitToggle?.(!isTransitMode);
                                }}
                                disabled={loadingTransit}
                                style={{
                                    width: '32px',
                                    height: '16px',
                                    borderRadius: '8px',
                                    background: isTransitMode ? '#3b82f6' : '#e2e8f0',
                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'all 0.3s ease',
                                    padding: '1px'
                                }}
                            >
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                    transition: 'all 0.3s ease',
                                    transform: isTransitMode ? 'translateX(14px)' : 'translateX(0px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {loadingTransit && (
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            border: '1px solid #3b82f6',
                                            borderTopColor: 'transparent',
                                            borderRadius: '50%',
                                            animation: 'spin 0.8s linear infinite'
                                        }} />
                                    )}
                                </div>
                            </button>
                        </div>
                    )}
                </div>
                {activeThemes.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                        {activeThemes.map((t, idx) => (
                            <span key={idx} style={{ 
                                background: t?.color,
                                color: t?.text, 
                                fontSize: '0.6rem', 
                                fontWeight: 900, 
                                padding: '2px 8px',
                                borderRadius: '10px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                textTransform: 'uppercase',
                                border: '1px solid rgba(0,0,0,0.1)'
                            }}>
                                {t?.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ padding: '0px' }}>
                {selectedHouseNum !== undefined && (
                    <div style={{
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'center',
                        borderBottom: '1px solid rgba(124, 92, 183, 0.08)',
                        background: '#f8fafc'
                    }}>
                        <button
                            onClick={() => setShowCalculation(!showCalculation)}
                            style={{
                                background: showCalculation ? '#f1f5f9' : '#3b82f6',
                                color: showCalculation ? '#000000' : '#ffffff',
                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                padding: '8px 16px',
                                fontWeight: 900,
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '3px 3px 0px #000000'
                            }}
                        >
                            {showCalculation ? 'Hide Calculation' : 'Show Calculation'}
                        </button>
                    </div>
                )}

                {(!selectedHouseNum || showCalculation) && (
                    <>
                        {selectedHouseNum && showCalculation && isPrashnaMode && (
                            <div style={{
                                padding: '12px',
                                borderBottom: '1px solid rgba(124, 92, 183, 0.08)',
                                background: '#faf5ff',
                            }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: '#701a75',
                                    borderBottom: '1px solid rgba(124, 92, 183, 0.08)',
                                    paddingBottom: '6px',
                                    marginBottom: '10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span>RETROGRADE CONSIDERATION</span>
                                    <span style={{ fontSize: '0.65rem', background: '#ffaeff', color: '#701a75', padding: '1px 6px', borderRadius: '3px', border: '1px solid #f5d0fe' }}>
                                        PRASHNA
                                    </span>
                                </div>

                                {(() => {
                                    const plRetro = isPlanetRetrograde(planetData.planet);
                                    const nlRetro = isPlanetRetrograde(planetData.star_lord);
                                    const slRetro = isPlanetRetrograde(planetData.sub_lord);

                                    let outcome = "DENIED";
                                    let outcomeColor = "#b91c1c";

                                    if (!nlRetro) {
                                        if (!slRetro) {
                                            if (!plRetro) {
                                                outcome = "VERY GOOD";
                                                outcomeColor = "#166534";
                                            } else {
                                                outcome = "LITTLE DELAYED BUT NOT DENIED";
                                                outcomeColor = "#1e40af";
                                            }
                                        } else {
                                            outcome = "DELAYED WITH DIFFICULTY";
                                            outcomeColor = "#9a3412";
                                        }
                                    }

                                    const isSLRetroSupported = ['mars', 'mercury', 'jupiter', 'venus', 'saturn'].includes(planetData.sub_lord.toLowerCase());
                                    const isRahuKetu = ['rahu', 'ketu'].includes(planetData.sub_lord.toLowerCase()) || ['rahu', 'ketu'].includes(planetData.star_lord.toLowerCase()) || ['rahu', 'ketu'].includes(planetData.planet.toLowerCase());

                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#000000' }}>
                                                QUERY RESULT: <span style={{ color: outcomeColor, textTransform: 'uppercase' }}>{outcome}</span>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                                                {slRetro && isSLRetroSupported && (
                                                    <div style={{ fontSize: '0.68rem', color: '#581c87', fontStyle: 'italic', display: 'flex', gap: '4px' }}>
                                                        <span>•</span>
                                                        <span>
                                                            Since Sub Lord ({planetData.sub_lord}) is Retrograde, direct results will happen after the planet turns 'Direct' in transit, provided it is positively signified in Power Position.
                                                        </span>
                                                    </div>
                                                )}
                                                {isRahuKetu && (
                                                    <div style={{ fontSize: '0.68rem', color: '#581c87', fontStyle: 'italic', display: 'flex', gap: '4px' }}>
                                                        <span>•</span>
                                                        <span>
                                                            Rahu / Ketu result is generally to be taken as Denied, especially if the overall combination result is negative.
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {[
                            { label: 'PL', p: planetData.planet, h: plHit, bif: plBif, isRetro: isPlanetRetrograde(planetData.planet) },
                            { label: 'NL', p: planetData.star_lord, h: nlHit, bif: nlBif, isRetro: isPlanetRetrograde(planetData.star_lord) },
                            { label: 'SL', p: planetData.sub_lord, h: slHit, bif: slBif, isRetro: isPlanetRetrograde(planetData.sub_lord) }
                        ].map((row) => (
                            <div key={row.label} style={{ borderBottom: '1px solid rgba(124, 92, 183, 0.08)', padding: '8px 12px' }}>
                                <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#000000', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: '#1d4ed8' }}>{row.p.substring(0, 2).toUpperCase()}</span>
                                    <span style={{ opacity: 0.8, fontSize: '0.65rem' }}>({row.label})</span>
                                    <span style={{ 
                                        fontSize: '0.75rem', 
                                        fontWeight: 900, 
                                        color: row.isRetro ? '#dc2626' : '#16a34a'
                                    }}>
                                        {row.isRetro ? 'R' : 'D'}
                                    </span>
                                </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div style={{ background: '#f0fdf4', padding: '6px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#15803d', marginBottom: '4px', textTransform: 'uppercase' }}>
                                    {isTravel ? "ABROAD / AWAY" : isProperty ? "PURCHASE" : "AUSPICIOUS"}
                                </div>
                                {row.bif.renderCell(row.bif.good, false)}
                            </div>
                            <div style={{ background: '#fef2f2', padding: '6px', borderRadius: '6px', border: '1px solid #fee2e2' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#b91c1c', marginBottom: '4px', textTransform: 'uppercase' }}>
                                    {isTravel ? "HOME" : isProperty ? "SALE" : "INAUSPICIOUS"}
                                </div>
                                {row.bif.renderCell(row.bif.bad, true)}
                            </div>
                        </div>
                    </div>
                ))}

                <div style={{ borderBottom: '1px solid rgba(124, 92, 183, 0.08)', padding: '8px 12px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>COMBINATION</div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {isTravel || isProperty ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px' }}>
                                {Array.from(allHousesSet)
                                    .filter(h => (isTravel ? (subTab === 'ABROAD' ? [1,3,7,9,11,12] : [2,4,11]) : (subTab === 'PURCHASE' ? [1,2,4,6,7,8,11,12] : [3,5,10])).includes(h))
                                    .sort((a,b) => a-b)
                                    .map((h, i, arr) => (
                                        <React.Fragment key={h}>
                                            <span style={{ 
                                                fontSize: '0.8rem', fontWeight: 900, color: '#1e293b',
                                                background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e8f0'
                                            }}>{h}</span>
                                            {i < arr.length - 1 && <span style={{ color: '#cbd5e1', fontWeight: 400 }}>-</span>}
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                        ) : (
                            <>
                                {renderCombination(comboGoodSet, false)}
                                <span style={{ color: '#000000', fontWeight: 900, fontSize: '1rem' }}>/</span>
                                {renderCombination(comboBadSet, true)}
                            </>
                        )}
                    </div>
                </div>
                {(isTravel || isProperty) && (
                    <div style={{ borderBottom: '1px solid rgba(124, 92, 183, 0.08)', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid rgba(124, 92, 183, 0.08)' }}>
                            <div 
                                onClick={() => setSubTab(isTravel ? 'ABROAD' : 'PURCHASE')}
                                style={{ 
                                    flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer',
                                    fontSize: '0.7rem', fontWeight: 900, 
                                    background: (subTab === 'ABROAD' || subTab === 'PURCHASE') ? '#ffffff' : '#f1f5f9',
                                    color: (subTab === 'ABROAD' || subTab === 'PURCHASE') ? '#1e3a8a' : '#64748b',
                                    borderRight: '1px solid rgba(124, 92, 183, 0.08)'
                                }}
                            >
                                {isTravel ? "ABROAD / AWAY" : "PURCHASE"}
                            </div>
                            <div 
                                onClick={() => setSubTab(isTravel ? 'HOME' : 'SALE')}
                                style={{ 
                                    flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer',
                                    fontSize: '0.7rem', fontWeight: 900, 
                                    background: (subTab === 'HOME' || subTab === 'SALE') ? '#ffffff' : '#f1f5f9',
                                    color: (subTab === 'HOME' || subTab === 'SALE') ? '#1e3a8a' : '#64748b'
                                }}
                            >
                                {isTravel ? "HOME" : "SALE"}
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ borderBottom: '1px solid rgba(124, 92, 183, 0.08)', padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>
                        {isEducation ? "EXAM" : (isMarriage || isChildBirth || isHealth || isTravel || isProperty) ? "INDICATION" : "INCOME/EXPENSES"}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', fontWeight: 800, fontSize: '0.85rem', alignItems: 'center' }}>
                        <span style={{ color: '#16a34a' }}>
                            {(() => {
                                if (isEducation) {
                                    const comboGoodArray = Array.from(comboGoodSet);
                                    const greenHouses = comboGoodArray.filter(h => ![1, 5, 7].includes(h));
                                    const greenCount = greenHouses.length;
                                    if (greenCount > 3) return "Very High";
                                    if (greenCount === 3) return "High Indication";
                                    if (greenCount === 2) return "Medium Indication";
                                    return "Low";
                                }
                                if (isMarriage) {
                                    if (checkSubset(allHousesSet, MARRIAGE_GOOD_VERY_GOOD)) return "Very Good Indication";
                                    if (checkSubset(allHousesSet, MARRIAGE_GOOD_GOOD)) return "Good Indication";
                                    if (checkSubset(allHousesSet, MARRIAGE_GOOD_MEDIUM)) return "Medium Indication";
                                    if (checkSubset(allHousesSet, MARRIAGE_GOOD_LOW)) return "Low Indication";
                                    return "No Indication";
                                }
                                if (isChildBirth) {
                                    if (checkSubset(allHousesSet, CHILD_BIRTH_VERY_HIGH)) return "Very Good Indication";
                                    if (checkSubset(allHousesSet, CHILD_BIRTH_HIGH)) return "Good Indication";
                                    if (checkSubset(allHousesSet, CHILD_BIRTH_MEDIUM)) return "Medium Indication";
                                    const has9 = allHousesSet.has(9);
                                    const has2 = allHousesSet.has(2);
                                    const has5 = allHousesSet.has(5);
                                    if (has9 && (has2 || has5)) return "Medium Indication";
                                    if (checkSubset(allHousesSet, CHILD_BIRTH_BAD)) return "Bad / No Indication";
                                    return "Low Indication";
                                }
                                if (isHealth) {
                                    if (checkSubset(allHousesSet, HEALTH_GOOD_HIGH)) return "High";
                                    if (checkSubset(allHousesSet, HEALTH_GOOD_MEDIUM)) return "Medium";
                                    if (checkSubset(allHousesSet, HEALTH_GOOD_LOW)) return "Low";
                                    return "No Indication";
                                }
                                if (isTravel) {
                                    if (subTab === 'ABROAD') {
                                        if (checkSubset(allHousesSet, TRAVEL_ABROAD_VERY_HIGH)) return "VERY HIGH";
                                        if (checkSubset(allHousesSet, TRAVEL_ABROAD_HIGH)) return "HIGH";
                                        if (checkSubset(allHousesSet, TRAVEL_ABROAD_MEDIUM)) return "MEDIUM";
                                    } else { // subTab === 'HOME'
                                        if (checkSubset(allHousesSet, TRAVEL_HOME_VERY_HIGH)) return "VERY HIGH";
                                        if (checkSubset(allHousesSet, TRAVEL_HOME_HIGH)) return "HIGH";
                                        if (checkSubset(allHousesSet, TRAVEL_HOME_MEDIUM)) return "MEDIUM";
                                        if (checkSubset(allHousesSet, TRAVEL_HOME_LOW)) return "LOW";
                                    }
                                    return "NO INDICATION";
                                }
                                if (isProperty) {
                                    if (subTab === 'PURCHASE') {
                                        if (checkSubset(allHousesSet, PROPERTY_PURCHASE_VERY_HIGH)) return "VERY HIGH";
                                        if (checkSubset(allHousesSet, PROPERTY_PURCHASE_HIGH)) return "HIGH";
                                        if (checkSubset(allHousesSet, PROPERTY_PURCHASE_MEDIUM)) return "MEDIUM";
                                        if (checkSubset(allHousesSet, PROPERTY_PURCHASE_LOW)) return "LOW";
                                    } else { // subTab === 'SALE'
                                        if (checkSubset(allHousesSet, PROPERTY_SALE_VERY_HIGH)) return "VERY HIGH";
                                        if (checkSubset(allHousesSet, PROPERTY_SALE_HIGH)) return "HIGH";
                                        if (checkSubset(allHousesSet, PROPERTY_SALE_MEDIUM)) return "MEDIUM";
                                        if (checkSubset(allHousesSet, PROPERTY_SALE_LOW)) return "LOW";
                                    }
                                    return "NO INDICATION";
                                }
                                if (checkSubset(comboGoodSet, JOB_GOOD_A_PLUS)) return "Very High";
                                if (checkSubset(comboGoodSet, JOB_GOOD_A)) return "High";
                                if (checkSubset(comboGoodSet, JOB_GOOD_B)) return "Medium";
                                return "Low";
                            })()}
                        </span>
                        {!(isTravel || isProperty) && (isHealth ? (() => {
                            if (checkSubset(allHousesSet, HEALTH_GOOD_HIGH) || checkSubset(allHousesSet, HEALTH_GOOD_MEDIUM) || checkSubset(allHousesSet, HEALTH_GOOD_LOW)) {
                                if (checkSubset(allHousesSet, HEALTH_BAD_HIGH) || checkSubset(allHousesSet, HEALTH_BAD_MEDIUM) || checkSubset(allHousesSet, HEALTH_BAD_LOW)) {
                                    return true;
                                }
                            }
                            return false;
                        })() : isMarriage ? (() => {
                            if (checkSubset(allHousesSet, MARRIAGE_GOOD_VERY_GOOD) || checkSubset(allHousesSet, MARRIAGE_GOOD_GOOD) || checkSubset(allHousesSet, MARRIAGE_GOOD_MEDIUM) || checkSubset(allHousesSet, MARRIAGE_GOOD_LOW)) {
                                if (checkSubset(allHousesSet, MARRIAGE_BAD_VERY_BAD) || checkSubset(allHousesSet, MARRIAGE_BAD_BAD) || checkSubset(allHousesSet, MARRIAGE_BAD_MEDIUM) || checkSubset(allHousesSet, MARRIAGE_BAD_LOW)) {
                                    return true;
                                }
                            }
                            return false;
                        })() : true) && <span style={{ color: '#cbd5e1', fontWeight: 400 }}>/</span>}
                        {!(isTravel || isProperty) && (
                            <span style={{ color: '#ef4444' }}>
                                {isChildBirth ? (() => {
                                    if (checkSubset(allHousesSet, CHILD_BIRTH_BAD)) return "High Difficulty";
                                    if (checkSubset(allHousesSet, CHILD_BIRTH_ABORTION)) return "Abortion Risk";
                                    return ""; 
                                })() : isEducation ? "Low" : isMarriage ? (() => {
                                    if (checkSubset(allHousesSet, MARRIAGE_BAD_VERY_BAD)) return "Very Bad Indication";
                                    if (checkSubset(allHousesSet, MARRIAGE_BAD_BAD)) return "Bad Indication";
                                    if (checkSubset(allHousesSet, MARRIAGE_BAD_MEDIUM)) return "Medium Problems";
                                    if (checkSubset(allHousesSet, MARRIAGE_BAD_LOW)) return "Low Problems";
                                    return "";
                                })() : isHealth ? (() => {
                                    if (checkSubset(allHousesSet, HEALTH_BAD_HIGH)) return "High";
                                    if (checkSubset(allHousesSet, HEALTH_BAD_MEDIUM)) return "Medium";
                                    if (checkSubset(allHousesSet, HEALTH_BAD_LOW)) return "Low";
                                    return "";
                                })() : (() => {
                                    if (checkSubset(comboBadSet, JOB_BAD_01)) return "High Loss";
                                    if (checkSubset(comboBadSet, JOB_BAD_02)) return "Medium Loss";
                                    return "Low Loss";
                                })()}
                            </span>
                        )}
                    </div>
                </div>

                {isChildBirth && (() => {
                    const hasGoodNL = nlBif.good.length > 0;
                    const resultToUse = hasGoodNL ? nlProfessionText : slProfessionText;
                    const labelToUse = hasGoodNL ? "RESULT (NL)" : "RESULT (SL)";
                    
                    const formatResult = (text: string) => {
                        if (text.includes("Low Loss")) return "Low";
                        if (text.includes("Medium Loss")) return "Medium";
                        if (text.includes("High Loss")) return "High";
                        if (text.includes("Loss")) return text.replace("Loss", "").trim();
                        return text;
                    };

                    return (
                        <div style={{ borderBottom: '1px solid rgba(124, 92, 183, 0.08)', padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>{labelToUse}</div>
                            <div style={{ display: 'flex', gap: '8px', fontWeight: 800, fontSize: '0.85rem', alignItems: 'center', textAlign: 'center' }}>
                                <span style={{ color: '#334155' }}>
                                    {formatResult(resultToUse)}
                                </span>
                            </div>
                        </div>
                    );
                })()}

                {isProperty && subTab === 'SALE' && checkSubset(allHousesSet, PROPERTY_LITIGATION) && (
                    <div style={{ borderBottom: '1px solid rgba(124, 92, 183, 0.08)', padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#b91c1c', textTransform: 'uppercase' }}>DESCRIPTION</div>
                        <div style={{ display: 'flex', gap: '8px', fontWeight: 800, fontSize: '0.85rem', alignItems: 'center', textAlign: 'center' }}>
                            <span style={{ color: '#ef4444' }}>
                                PROBLEM TIME (LITIGATION)
                            </span>
                        </div>
                    </div>
                )}
                
                {!isHealth && !isTravel && !isProperty && (
                    <div 
                        onClick={() => {
                            if (!isTransitMode) setIsExpanded(!isExpanded);
                        }} 
                        style={{ 
                            padding: '10px', 
                            textAlign: 'center', 
                            cursor: isTransitMode ? 'default' : 'pointer', 
                            background: '#ffffff', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            gap: '6px', 
                            borderBottom: '1px solid rgba(124, 92, 183, 0.08)' 
                        }}
                    >
                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>SUCCESS RATE</div>
                        <span style={{ color: successInfo.color, fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px' }}>
                            {successInfo.label.toUpperCase()}
                        </span>
                        {!isTransitMode && <span style={{ fontSize: '0.75rem', color: '#000000', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>}
                    </div>
                )}

                {isHealth && !isTransitMode && (
                    <div style={{ borderBottom: '1px solid rgba(124, 92, 183, 0.08)', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid rgba(124, 92, 183, 0.08)' }}>
                            <div 
                                onClick={() => setActiveTab('DETAILS')}
                                style={{ 
                                    flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer',
                                    fontSize: '0.7rem', fontWeight: 900, 
                                    background: activeTab === 'DETAILS' ? '#ffffff' : '#f1f5f9',
                                    color: activeTab === 'DETAILS' ? '#1e3a8a' : '#64748b',
                                    borderRight: '1px solid rgba(124, 92, 183, 0.08)'
                                }}
                            >
                                DISEASE POSSIBILITY
                            </div>
                            <div 
                                onClick={() => setActiveTab('REMEDIES')}
                                style={{ 
                                    flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer',
                                    fontSize: '0.7rem', fontWeight: 900, 
                                    background: activeTab === 'REMEDIES' ? '#ffffff' : '#f1f5f9',
                                    color: activeTab === 'REMEDIES' ? '#1e3a8a' : '#64748b'
                                }}
                            >
                                REMIDIES
                            </div>
                        </div>

                        {activeTab === 'DETAILS' ? (
                            <div style={{ padding: '12px' }}>
                                <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {plHit !== -1 && (
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <span style={{ fontWeight: 900, color: '#000000', minWidth: '40px' }}>PL:</span>
                                            <span>{shuffleText(HEALTH_DISEASE_MAP[planetData.planet.toUpperCase()] || "General health issues")}</span>
                                        </div>
                                    )}
                                    {nlHit !== -1 && (
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <span style={{ fontWeight: 900, color: '#000000', minWidth: '40px' }}>NL (40%):</span>
                                            <span>{shuffleText(HEALTH_DISEASE_MAP[planetData.star_lord.toUpperCase()] || "General health issues")}</span>
                                        </div>
                                    )}
                                    
                                    <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
                                    
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 900, color: '#35a4f4' }}>NL (40%):</span>
                                        <span style={{ color: '#334155' }}>{nlProfessionText}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 900, color: '#35a4f4' }}>SL (60%):</span>
                                        <span style={{ color: '#334155' }}>{slProfessionText}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '12px' }}>
                                {(() => {
                                    // Donation Logic - Planet selection based on hit boxes
                                    const nlHasRemedy = nlHit === 8 || nlHit === 12;
                                    const slHasRemedy = slHit === 8 || slHit === 12;
                                    let targetPlanets: string[] = [];

                                    if (nlHasRemedy && slHasRemedy) {
                                        const badSet = new Set([4, 6, 8, 10, 12]);
                                        const nlBadCount = nlBif.bad.filter((h: number) => badSet.has(h)).length;
                                        const slBadCount = slBif.bad.filter((h: number) => badSet.has(h)).length;
                                        
                                        if (nlBadCount > slBadCount) {
                                            targetPlanets.push(planetData.star_lord);
                                        } else if (slBadCount > nlBadCount) {
                                            targetPlanets.push(planetData.sub_lord);
                                        } else {
                                            targetPlanets.push(planetData.star_lord);
                                            targetPlanets.push(planetData.sub_lord);
                                        }
                                    } else if (nlHasRemedy) {
                                        targetPlanets.push(planetData.star_lord);
                                    } else if (slHasRemedy) {
                                        targetPlanets.push(planetData.sub_lord);
                                    }

                                    targetPlanets = Array.from(new Set(targetPlanets)).filter(p => DONATION_MAP[p.toUpperCase()]);

                                    const showDonation = targetPlanets.length > 0;
                                    const nlHitRemedies = HOUSE_HIT_REMEDIES.filter(r => r.house === nlHit);
                                    const hasNlHitRemedies = nlHitRemedies.length > 0;

                                    const slHitRemedies = HOUSE_HIT_REMEDIES.filter(r => r.house === slHit);
                                    const hasSlHitRemedies = slHitRemedies.length > 0 && slHit !== nlHit;

                                    if (!showDonation && !hasNlHitRemedies && !hasSlHitRemedies) {
                                        return <div style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.6 }}>No specific remedies for this period</div>;
                                    }

                                    const nlPlanetName = planetData.star_lord.toUpperCase();
                                    const nlDay = PLANET_DAY_MAP[nlPlanetName] || "respective Day";

                                    const slPlanetName = planetData.sub_lord.toUpperCase();
                                    const slDay = PLANET_DAY_MAP[slPlanetName] || "respective Day";

                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {showDonation && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {targetPlanets.map((planet, idx) => {
                                                        const donation = DONATION_MAP[planet.toUpperCase()];
                                                        return (
                                                            <div key={idx} style={{ padding: '8px', background: '#fefce8', borderRadius: '6px', border: '1px solid #fef08a' }}>
                                                                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#854d0e', marginBottom: '4px' }}>DONATION REMEDY ({planet.toUpperCase()})</div>
                                                                <div style={{ fontSize: '0.85rem', color: '#854d0e', lineHeight: 1.4 }}>
                                                                    Donate <strong>{donation.item}</strong> on <strong>{donation.day}</strong> between <strong>{donation.time}</strong>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {hasNlHitRemedies && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#000000', borderBottom: '1px solid rgba(124, 92, 183, 0.08)', paddingBottom: '4px', marginBottom: '4px', textTransform: 'uppercase' }}>
                                                        House Hit Remedies (NL Hit: House {nlHit})
                                                    </div>
                                                    {nlHitRemedies.map((remedy, idx) => {
                                                        const personalizedNote = remedy.note.replace(/impacted day/gi, nlDay);
                                                        return (
                                                            <div key={idx} style={{ padding: '8px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                                                                    <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#166534' }}>REMEDY: {remedy.remedy}</div>
                                                                    <div style={{ fontSize: '0.7rem', fontWeight: 900, background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '3px', height: 'fit-content' }}>
                                                                        {remedy.domain.toUpperCase()}
                                                                    </div>
                                                                </div>
                                                                <div style={{ fontSize: '0.75rem', color: '#166534', opacity: 0.85, fontStyle: 'italic' }}>
                                                                    Note: {personalizedNote}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {hasSlHitRemedies && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#000000', borderBottom: '1px solid rgba(124, 92, 183, 0.08)', paddingBottom: '4px', marginBottom: '4px', textTransform: 'uppercase' }}>
                                                        House Hit Remedies (SL Hit: House {slHit})
                                                    </div>
                                                    {slHitRemedies.map((remedy, idx) => {
                                                        const personalizedNote = remedy.note.replace(/impacted day/gi, slDay);
                                                        return (
                                                            <div key={idx} style={{ padding: '8px', background: '#fdf4ff', borderRadius: '6px', border: '1px solid #f5d0fe' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                                                                    <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#701a75' }}>REMEDY: {remedy.remedy}</div>
                                                                    <div style={{ fontSize: '0.7rem', fontWeight: 900, background: '#fdbbfb', color: '#701a75', padding: '1px 6px', borderRadius: '3px', height: 'fit-content' }}>
                                                                        {remedy.domain.toUpperCase()}
                                                                    </div>
                                                                </div>
                                                                <div style={{ fontSize: '0.75rem', color: '#701a75', opacity: 0.85, fontStyle: 'italic' }}>
                                                                    Note: {personalizedNote}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                )}

                {isMarriage && !isTransitMode && (
                    <div style={{ borderBottom: '1px solid rgba(124, 92, 183, 0.08)', padding: '12px', background: '#f8fafc' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#1e3a8a', marginBottom: '8px', textTransform: 'uppercase', textAlign: 'center' }}>
                            IMPORTANT NOTES
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {(() => {
                                const notes = [];
                                // Love Marriage Logic
                                const has5 = allHousesSet.has(5);
                                const marriageHouses = [2, 7, 11];
                                const hasMarriageHouses = marriageHouses.some(h => allHousesSet.has(h));
                                
                                if (has5 && hasMarriageHouses) {
                                    if (comboGoodSet.has(5)) {
                                        notes.push({
                                            title: "Love Marriage Indication",
                                            desc: "Involvement of house 5 with marriage houses (2, 7, 11) indicates a strong promise of love marriage or a romantic relationship before marriage.",
                                            color: '#16a34a'
                                        });
                                    } else if (comboBadSet.has(5)) {
                                        notes.push({
                                            title: "Love Indication",
                                            desc: "Involvement of house 5 indicates attraction and love, but since it appears on the problem side, it may indicate love without a successful marriage.",
                                            color: '#ef4444'
                                        });
                                    }
                                }

                                // Second Marriage Logic
                                if (allHousesSet.has(9) && hasMarriageHouses) {
                                    notes.push({
                                        title: "Second Marriage Indication",
                                        desc: "Involvement of house 9 with marriage houses (2, 7, 11) indicates the possibility of a second marriage, typically after a separation or divorce.",
                                        color: '#2563eb'
                                    });
                                }

                                if (notes.length === 0) return <div style={{ textAlign: 'center', opacity: 0.6 }}>No special notes for this period</div>;

                                return notes.map((note, idx) => (
                                    <div key={idx} style={{ padding: '8px', background: '#ffffff', borderRadius: '6px', border: `1px solid ${note.color}44` }}>
                                        <div style={{ fontWeight: 900, color: note.color, marginBottom: '2px', fontSize: '0.75rem' }}>{note.title.toUpperCase()}</div>
                                        <div style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>{note.desc}</div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                )}

                {isExpanded && !isTransitMode && !isChildBirth && !isHealth && (
                    <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
                            <div 
                                onClick={() => setActiveTab('DETAILS')}
                                style={{ 
                                    flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer',
                                    fontSize: '0.7rem', fontWeight: 900, 
                                    background: activeTab === 'DETAILS' ? '#ffffff' : '#f1f5f9',
                                    color: activeTab === 'DETAILS' ? '#1e3a8a' : '#64748b',
                                    borderRight: '1px solid #e2e8f0'
                                }}
                            >
                                DETAILED FINDINGS
                            </div>
                            <div 
                                onClick={() => setActiveTab('REMEDIES')}
                                style={{ 
                                    flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer',
                                    fontSize: '0.7rem', fontWeight: 900, 
                                    background: activeTab === 'REMEDIES' ? '#ffffff' : '#f1f5f9',
                                    color: activeTab === 'REMEDIES' ? '#1e3a8a' : '#64748b'
                                }}
                            >
                                REMIDIES
                            </div>
                        </div>

                        {activeTab === 'DETAILS' ? (
                            <div style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 900, color: '#35a4f4' }}>NL{(selectedArea !== 'Travel' && selectedArea !== 'Property & Vehicle' && selectedArea !== 'Child Birth') ? ' (40%)' : ''}:</span>
                                        <span style={{ color: '#334155' }}>{nlProfessionText}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 900, color: '#35a4f4' }}>SL{(selectedArea !== 'Travel' && selectedArea !== 'Property & Vehicle' && selectedArea !== 'Child Birth') ? ' (60%)' : ''}:</span>
                                        <span style={{ color: '#334155' }}>{slProfessionText}</span>
                                    </div>
                                    
                                    {(isEducation && successCode && (successCode.startsWith('B') || successCode.startsWith('VB'))) && (
                                        <div style={{ marginTop: '8px', padding: '8px', background: '#fef2f2', borderRadius: '6px', fontSize: '0.8rem', color: '#dc2626', fontWeight: 800 }}>
                                            ! Note: Till 2nd PUC or 10+2
                                        </div>
                                    )}

                                    {!isEducation && !isMarriage && !isChildBirth && !isHealth && jobNoteText && (
                                        <div style={{ marginTop: '8px', padding: '10px', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.8rem', color: '#1e3a8a', fontWeight: 800, border: '1px solid #3b82f6' }}>
                                            Note: {jobNoteText}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '16px' }}>
                                {(() => {
                                    // Donation Logic - Planet selection based on hit boxes
                                    const nlHasRemedy = nlHit === 8 || nlHit === 12;
                                    const slHasRemedy = slHit === 8 || slHit === 12;
                                    let targetPlanets: string[] = [];

                                    if (nlHasRemedy && slHasRemedy) {
                                        const badSet = new Set(isMarriage ? [1, 5, 6, 8, 10, 12] : [4, 6, 8, 10, 12]);
                                        const nlBadCount = nlBif.bad.filter((h: number) => badSet.has(h)).length;
                                        const slBadCount = slBif.bad.filter((h: number) => badSet.has(h)).length;
                                        
                                        if (nlBadCount > slBadCount) {
                                            targetPlanets.push(planetData.star_lord);
                                        } else if (slBadCount > nlBadCount) {
                                            targetPlanets.push(planetData.sub_lord);
                                        } else {
                                            targetPlanets.push(planetData.star_lord);
                                            targetPlanets.push(planetData.sub_lord);
                                        }
                                    } else if (nlHasRemedy) {
                                        targetPlanets.push(planetData.star_lord);
                                    } else if (slHasRemedy) {
                                        targetPlanets.push(planetData.sub_lord);
                                    }

                                    targetPlanets = Array.from(new Set(targetPlanets)).filter(p => DONATION_MAP[p.toUpperCase()]);
                                    const showDonation = targetPlanets.length > 0;
                                    const nlHitRemedies = HOUSE_HIT_REMEDIES.filter(r => r.house === nlHit);
                                    const hasNlHitRemedies = nlHitRemedies.length > 0;

                                    const slHitRemedies = HOUSE_HIT_REMEDIES.filter(r => r.house === slHit);
                                    const hasSlHitRemedies = slHitRemedies.length > 0 && slHit !== nlHit;

                                    if (!showDonation && !hasNlHitRemedies && !hasSlHitRemedies) {
                                        return <div style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.6 }}>No specific remedies for this period</div>;
                                    }

                                    const nlPlanetName = planetData.star_lord.toUpperCase();
                                    const nlDay = PLANET_DAY_MAP[nlPlanetName] || "respective Day";

                                    const slPlanetName = planetData.sub_lord.toUpperCase();
                                    const slDay = PLANET_DAY_MAP[slPlanetName] || "respective Day";

                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {showDonation && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {targetPlanets.map((planet, idx) => {
                                                        const donation = DONATION_MAP[planet.toUpperCase()];
                                                        return (
                                                            <div key={idx} style={{ padding: '8px', background: '#fefce8', borderRadius: '6px', border: '1px solid #fef08a' }}>
                                                                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#854d0e', marginBottom: '4px' }}>DONATION REMEDY ({planet.toUpperCase()})</div>
                                                                <div style={{ fontSize: '0.85rem', color: '#854d0e', lineHeight: 1.4 }}>
                                                                    Donate <strong>{donation.item}</strong> on <strong>{donation.day}</strong> between <strong>{donation.time}</strong>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {hasNlHitRemedies && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#000000', borderBottom: '1px solid rgba(124, 92, 183, 0.08)', paddingBottom: '4px', marginBottom: '4px', textTransform: 'uppercase' }}>
                                                        House Hit Remedies (NL Hit: House {nlHit})
                                                    </div>
                                                    {nlHitRemedies.map((remedy, idx) => {
                                                        const personalizedNote = remedy.note.replace(/impacted day/gi, nlDay);
                                                        return (
                                                            <div key={idx} style={{ padding: '8px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                                                                    <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#166534' }}>REMEDY: {remedy.remedy}</div>
                                                                    <div style={{ fontSize: '0.7rem', fontWeight: 900, background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '3px', height: 'fit-content' }}>
                                                                        {remedy.domain.toUpperCase()}
                                                                    </div>
                                                                </div>
                                                                <div style={{ fontSize: '0.75rem', color: '#166534', opacity: 0.85, fontStyle: 'italic' }}>
                                                                    Note: {personalizedNote}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {hasSlHitRemedies && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#000000', borderBottom: '1px solid rgba(124, 92, 183, 0.08)', paddingBottom: '4px', marginBottom: '4px', textTransform: 'uppercase' }}>
                                                        House Hit Remedies (SL Hit: House {slHit})
                                                    </div>
                                                    {slHitRemedies.map((remedy, idx) => {
                                                        const personalizedNote = remedy.note.replace(/impacted day/gi, slDay);
                                                        return (
                                                            <div key={idx} style={{ padding: '8px', background: '#fdf4ff', borderRadius: '6px', border: '1px solid #f5d0fe' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                                                                    <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#701a75' }}>REMEDY: {remedy.remedy}</div>
                                                                    <div style={{ fontSize: '0.7rem', fontWeight: 900, background: '#fdbbfb', color: '#701a75', padding: '1px 6px', borderRadius: '3px', height: 'fit-content' }}>
                                                                        {remedy.domain.toUpperCase()}
                                                                    </div>
                                                                </div>
                                                                <div style={{ fontSize: '0.75rem', color: '#701a75', opacity: 0.85, fontStyle: 'italic' }}>
                                                                    Note: {personalizedNote}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                )}

                {isExpanded && isChildBirth && (
                    <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '16px' }}>
                       {checkSubset(allHousesSet, CHILD_BIRTH_SPECIAL_CASE) && (
                            <div style={{ marginTop: '8px', padding: '8px', background: '#e0f2fe', borderRadius: '6px', fontSize: '0.8rem', color: '#0369a1', fontWeight: 800 }}>
                                ! Note: Caesarean / IVF / Test Tube Baby
                            </div>
                        )}
                    </div>
                )}
                </>
            )}

            {/* 1st House Cusp Custom Predictions Section */}
            {activeCuspNum === 1 && (
                <div style={{
                    padding: '16px',
                    background: '#ffffff',
                    borderTop: '1px solid rgba(124, 92, 183, 0.08)',
                    fontFamily: "'Inter', sans-serif"
                }}>
                    <h4 style={{
                        margin: '0 0 4px 0',
                        fontSize: '1rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: '#000000'
                    }}>
                        1st Cusp and its Effect
                    </h4>
                    <p style={{
                        fontSize: '0.75rem',
                        color: '#000000',
                        margin: '0 0 16px 0',
                        lineHeight: '1.4',
                        fontWeight: 800
                    }}>
                        1st Cuspal Sub Lord's: Nakshatra Lord is all about Health, Name, Fame, Self, Character and Struggle.
                    </p>

                    {/* 1st CSL Nakshatra Lord Rasi Placed Weakness or Negativity */}
                    {(() => {
                        const nlObj = planets?.find(p => p.planet.toUpperCase() === planetData.star_lord.toUpperCase());
                        const nlRashiRaw = nlObj?.sign || '';
                        const rashiKey = Object.keys(FIRST_CSL_NL_RASHI_WEAKNESS).find(
                            k => k.toLowerCase() === nlRashiRaw.toLowerCase()
                        ) || '';
                        const weaknessText = FIRST_CSL_NL_RASHI_WEAKNESS[rashiKey] || "No significant weakness indicated.";

                        return (
                            <div style={{ marginBottom: '20px', border: '1px solid rgba(124, 92, 183, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ background: '#fef2f2', padding: '10px 12px', borderBottom: '1px solid rgba(124, 92, 183, 0.08)', fontWeight: 900, fontSize: '0.85rem', color: '#b91c1c', textTransform: 'uppercase', textAlign: 'center' }}>
                                    1st CSL Nakshatra Lord Rasi Placed Weakness or Negativity
                                </div>
                                <div style={{ padding: '12px', background: '#ffffff', fontSize: '0.8rem', color: '#334155', lineHeight: '1.6' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1.5px dashed #cbd5e1' }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b', marginBottom: '2px' }}>1st CSL (Sub Lord)</div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{planetData.planet}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b', marginBottom: '2px' }}>Nakshatra Lord (NL)</div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{planetData.star_lord} ({nlRashiRaw || '--'})</div>
                                        </div>
                                    </div>

                                    <div>
                                        <span style={{ fontWeight: 900, color: '#dc2626', display: 'block', marginBottom: '4px' }}>WEAKNESS / NEGATIVITY:</span>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b91c1c', background: '#fee2e2', padding: '8px 12px', border: '1px solid #fca5a5', borderRadius: '4px' }}>
                                            {weaknessText}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Primary Result Table */}
                    {primaryHits.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                color: '#000000',
                                marginBottom: '6px'
                            }}>
                                Primary Result
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {primaryHits.map((activeHit) => {
                                    if (!FIRST_CUSP_PREDICTIONS[activeHit]) return null;
                                    return (
                                        <table key={activeHit} style={{
                                            width: '100%',
                                            borderCollapse: 'collapse',
                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                            fontSize: '0.75rem'
                                        }}>
                                            <tbody>
                                                <tr>
                                                    <td rowSpan={3} style={{
                                                        width: '50px',
                                                        textAlign: 'center',
                                                        verticalAlign: 'middle',
                                                        fontWeight: 900,
                                                        fontSize: '1.1rem',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc'
                                                    }}>
                                                        {activeHit}
                                                    </td>
                                                    <td style={{
                                                        width: '80px',
                                                        fontWeight: 900,
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc',
                                                        color: '#000000'
                                                    }}>
                                                        HEALTH
                                                    </td>
                                                    <td style={{
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        color: '#000000',
                                                        fontWeight: 500
                                                    }}>
                                                        {FIRST_CUSP_PREDICTIONS[activeHit].health}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{
                                                        fontWeight: 900,
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc',
                                                        color: '#000000'
                                                    }}>
                                                        WEALTH
                                                    </td>
                                                    <td style={{
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        color: '#000000',
                                                        fontWeight: 500
                                                    }}>
                                                        {FIRST_CUSP_PREDICTIONS[activeHit].wealth}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{
                                                        fontWeight: 900,
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc',
                                                        color: '#000000'
                                                    }}>
                                                        GENERAL
                                                    </td>
                                                    <td style={{
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        color: '#000000',
                                                        fontWeight: 500
                                                    }}>
                                                        {FIRST_CUSP_PREDICTIONS[activeHit].general}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Secondary Results Table */}
                    {(() => {
                        if (secondaryHits.length === 0) return null;

                        return (
                            <div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: '#000000',
                                    marginBottom: '6px'
                                }}>
                                    Secondary Result
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {secondaryHits.map((num) => {
                                        const pred = FIRST_CUSP_PREDICTIONS[num];
                                        if (!pred) return null;
                                        return (
                                            <table key={num} style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                fontSize: '0.75rem'
                                            }}>
                                                <tbody>
                                                    <tr>
                                                        <td rowSpan={3} style={{
                                                            width: '50px',
                                                            textAlign: 'center',
                                                            verticalAlign: 'middle',
                                                            fontWeight: 900,
                                                            fontSize: '1.1rem',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            background: '#f8fafc'
                                                        }}>
                                                            {num}
                                                        </td>
                                                        <td style={{
                                                            width: '80px',
                                                            fontWeight: 900,
                                                            padding: '8px',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            background: '#f8fafc',
                                                            color: '#000000'
                                                        }}>
                                                            HEALTH
                                                        </td>
                                                        <td style={{
                                                            padding: '8px',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            color: '#000000',
                                                            fontWeight: 500
                                                        }}>
                                                            {pred.health}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{
                                                            fontWeight: 900,
                                                            padding: '8px',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            background: '#f8fafc',
                                                            color: '#000000'
                                                        }}>
                                                            WEALTH
                                                        </td>
                                                        <td style={{
                                                            padding: '8px',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            color: '#000000',
                                                            fontWeight: 500
                                                        }}>
                                                            {pred.wealth}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{
                                                            fontWeight: 900,
                                                            padding: '8px',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            background: '#f8fafc',
                                                            color: '#000000'
                                                        }}>
                                                            GENERAL
                                                        </td>
                                                        <td style={{
                                                            padding: '8px',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            color: '#000000',
                                                            fontWeight: 500
                                                        }}>
                                                            {pred.general}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* 2nd House Cusp Custom Predictions Section */}
            {activeCuspNum === 2 && (
                <div style={{
                    padding: '16px',
                    background: '#ffffff',
                    borderTop: '1px solid rgba(124, 92, 183, 0.08)',
                    fontFamily: "'Inter', sans-serif"
                }}>
                    <h4 style={{
                        margin: '0 0 4px 0',
                        fontSize: '1rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: '#000000'
                    }}>
                        2nd Cusp and its Effect
                    </h4>
                    <p style={{
                        fontSize: '0.75rem',
                        color: '#000000',
                        margin: '0 0 16px 0',
                        lineHeight: '1.4',
                        fontWeight: 800
                    }}>
                        2nd Cuspal Sub Lord's Nakshatra Lord is all about Finance, Family and Speech.
                    </p>

                    {/* Primary Result Table */}
                    {primaryHits.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                color: '#000000',
                                marginBottom: '6px'
                            }}>
                                Primary Result
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {primaryHits.map((activeHit) => {
                                    if (!SECOND_CUSP_PREDICTIONS[activeHit]) return null;
                                    return (
                                        <table key={activeHit} style={{
                                            width: '100%',
                                            borderCollapse: 'collapse',
                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                            fontSize: '0.75rem'
                                        }}>
                                            <tbody>
                                                <tr>
                                                    <td rowSpan={3} style={{
                                                        width: '50px',
                                                        textAlign: 'center',
                                                        verticalAlign: 'middle',
                                                        fontWeight: 900,
                                                        fontSize: '1.1rem',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc'
                                                    }}>
                                                        {activeHit}
                                                    </td>
                                                    <td style={{
                                                        width: '80px',
                                                        fontWeight: 900,
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc',
                                                        color: '#000000'
                                                    }}>
                                                        FAMILY
                                                    </td>
                                                    <td style={{
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        color: '#000000',
                                                        fontWeight: 500
                                                    }}>
                                                        {SECOND_CUSP_PREDICTIONS[activeHit].family}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{
                                                        fontWeight: 900,
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc',
                                                        color: '#000000'
                                                    }}>
                                                        WEALTH
                                                    </td>
                                                    <td style={{
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        color: '#000000',
                                                        fontWeight: 500
                                                    }}>
                                                        {SECOND_CUSP_PREDICTIONS[activeHit].wealth}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{
                                                        fontWeight: 900,
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc',
                                                        color: '#000000'
                                                    }}>
                                                        GENERAL
                                                    </td>
                                                    <td style={{
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        color: '#000000',
                                                        fontWeight: 500
                                                    }}>
                                                        {SECOND_CUSP_PREDICTIONS[activeHit].general}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Secondary Results Table */}
                    {(() => {
                        if (secondaryHits.length === 0) return null;

                        return (
                            <div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: '#000000',
                                    marginBottom: '6px'
                                }}>
                                    Secondary Result
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {secondaryHits.map((num) => {
                                        const pred = SECOND_CUSP_PREDICTIONS[num];
                                        if (!pred) return null;
                                        return (
                                            <table key={num} style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                fontSize: '0.75rem'
                                            }}>
                                                <tbody>
                                                    <tr>
                                                        <td rowSpan={3} style={{
                                                            width: '50px',
                                                            textAlign: 'center',
                                                            verticalAlign: 'middle',
                                                            fontWeight: 900,
                                                            fontSize: '1.1rem',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            background: '#f8fafc'
                                                        }}>
                                                            {num}
                                                        </td>
                                                        <td style={{
                                                            width: '80px',
                                                            fontWeight: 900,
                                                            padding: '8px',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            background: '#f8fafc',
                                                            color: '#000000'
                                                        }}>
                                                            FAMILY
                                                        </td>
                                                        <td style={{
                                                            padding: '8px',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            color: '#000000',
                                                            fontWeight: 500
                                                        }}>
                                                            {pred.family}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{
                                                            fontWeight: 900,
                                                            padding: '8px',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            background: '#f8fafc',
                                                            color: '#000000'
                                                        }}>
                                                            WEALTH
                                                        </td>
                                                        <td style={{
                                                            padding: '8px',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            color: '#000000',
                                                            fontWeight: 500
                                                        }}>
                                                            {pred.wealth}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{
                                                            fontWeight: 900,
                                                            padding: '8px',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            background: '#f8fafc',
                                                            color: '#000000'
                                                        }}>
                                                            GENERAL
                                                        </td>
                                                        <td style={{
                                                            padding: '8px',
                                                            border: '1px solid rgba(124, 92, 183, 0.08)',
                                                            color: '#000000',
                                                            fontWeight: 500
                                                        }}>
                                                            {pred.general}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* 3th House Cusp Custom Predictions Section */}
                {activeCuspNum === 3 && (
                    <div style={{
                        padding: '16px',
                        background: '#ffffff',
                        borderTop: '1px solid rgba(124, 92, 183, 0.08)',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        <h4 style={{
                            margin: '0 0 4px 0',
                            fontSize: '1rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#000000'
                        }}>
                            3rd Cusp and its Effect
                        </h4>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#000000',
                            margin: '0 0 16px 0',
                            lineHeight: '1.4',
                            fontWeight: 800
                        }}>
                            3rd Cuspal Sub Lord's Nakshatra Lord is all about Courage, Younger Brother, Younger Sister, Short Journey, Patience, Relatives and Friends, Contracts, Agreements, Communication, Brokerage, Commission, Active Mind, Memory Power.
                        </p>

                        {/* Primary Result Table */}
                        {primaryHits.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: '#000000',
                                    marginBottom: '6px'
                                }}>
                                    Primary Result
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {primaryHits.map((activeHit) => {
                                        if (!THIRD_CUSP_PREDICTIONS[activeHit]) return null;
                                        return (
                                            <table key={activeHit} style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                fontSize: '0.75rem'
                                            }}>
                                                <tbody>
                                        <tr>
                                            <td rowSpan={3} style={{
                                                width: '50px',
                                                textAlign: 'center',
                                                verticalAlign: 'middle',
                                                fontWeight: 900,
                                                fontSize: '1.1rem',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc'
                                            }}>
                                                {activeHit}
                                            </td>
                                            <td style={{
                                                width: '80px',
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                SIBLING
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {THIRD_CUSP_PREDICTIONS[activeHit].sibling}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                WEALTH
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {THIRD_CUSP_PREDICTIONS[activeHit].wealth}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                GENERAL
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {THIRD_CUSP_PREDICTIONS[activeHit].general}
                                            </td>
                                        </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Secondary Results Table */}
                        {(() => {
                            if (secondaryHits.length === 0) return null;

                            return (
                                <div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        color: '#000000',
                                        marginBottom: '6px'
                                    }}>
                                        Secondary Result
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {secondaryHits.map((num) => {
                                            const pred = THIRD_CUSP_PREDICTIONS[num];
                                            if (!pred) return null;
                                            return (
                                                <table key={num} style={{
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td rowSpan={3} style={{
                                                                width: '50px',
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 900,
                                                                fontSize: '1.1rem',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc'
                                                            }}>
                                                                {num}
                                                            </td>
                                                            <td style={{
                                                                width: '80px',
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                SIBLING
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.sibling}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                WEALTH
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.wealth}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                GENERAL
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.general}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* 4th House Cusp Custom Predictions Section */}
                {activeCuspNum === 4 && (
                    <div style={{
                        padding: '16px',
                        background: '#ffffff',
                        borderTop: '1px solid rgba(124, 92, 183, 0.08)',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        <h4 style={{
                            margin: '0 0 4px 0',
                            fontSize: '1rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#000000'
                        }}>
                            4th Cusp and its Effect
                        </h4>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#000000',
                            margin: '0 0 16px 0',
                            lineHeight: '1.4',
                            fontWeight: 800
                        }}>
                            4th Cuspal Sub Lord's Nakshatra Lord is all about Property, House, Land, Agriculture, Mother, Vehicle, Immovable Property, Luxury and Comforts, Education, Water, Real Estate.
                        </p>

                        {/* Primary Result Table */}
                        {primaryHits.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: '#000000',
                                    marginBottom: '6px'
                                }}>
                                    Primary Result
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {primaryHits.map((activeHit) => {
                                        if (!FOURTH_CUSP_PREDICTIONS[activeHit]) return null;
                                        return (
                                            <table key={activeHit} style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                fontSize: '0.75rem'
                                            }}>
                                                <tbody>
                                        <tr>
                                            <td rowSpan={3} style={{
                                                width: '50px',
                                                textAlign: 'center',
                                                verticalAlign: 'middle',
                                                fontWeight: 900,
                                                fontSize: '1.1rem',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc'
                                            }}>
                                                {activeHit}
                                            </td>
                                            <td style={{
                                                width: '80px',
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                PROPERTY
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {FOURTH_CUSP_PREDICTIONS[activeHit].property}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                EDUCATION
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {FOURTH_CUSP_PREDICTIONS[activeHit].education}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                GENERAL
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {FOURTH_CUSP_PREDICTIONS[activeHit].general}
                                            </td>
                                        </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Secondary Results Table */}
                        {(() => {
                            if (secondaryHits.length === 0) return null;

                            return (
                                <div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        color: '#000000',
                                        marginBottom: '6px'
                                    }}>
                                        Secondary Result
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {secondaryHits.map((num) => {
                                            const pred = FOURTH_CUSP_PREDICTIONS[num];
                                            if (!pred) return null;
                                            return (
                                                <table key={num} style={{
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td rowSpan={3} style={{
                                                                width: '50px',
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 900,
                                                                fontSize: '1.1rem',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc'
                                                            }}>
                                                                {num}
                                                            </td>
                                                            <td style={{
                                                                width: '80px',
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                PROPERTY
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.property}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                EDUCATION
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.education}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                GENERAL
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.general}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* 5th House Cusp Custom Predictions Section */}
                {activeCuspNum === 5 && (
                    <div style={{
                        padding: '16px',
                        background: '#ffffff',
                        borderTop: '1px solid rgba(124, 92, 183, 0.08)',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        <h4 style={{
                            margin: '0 0 4px 0',
                            fontSize: '1rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#000000'
                        }}>
                            5th Cusp and its Effect
                        </h4>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#000000',
                            margin: '0 0 16px 0',
                            lineHeight: '1.4',
                            fontWeight: 800
                        }}>
                            5th Cuspal Sub Lord's Nakshatra Lord is all about Child Birth, Good Health, Love, Intelligence, Creativity, Solution provider, Healing, Lottery, Share Market, Thinking Power, Art, Drama and Film.
                        </p>

                        {/* Primary Result Table */}
                        {primaryHits.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: '#000000',
                                    marginBottom: '6px'
                                }}>
                                    Primary Result
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {primaryHits.map((activeHit) => {
                                        if (!FIFTH_CUSP_PREDICTIONS[activeHit]) return null;
                                        return (
                                            <table key={activeHit} style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                fontSize: '0.75rem'
                                            }}>
                                                <tbody>
                                        <tr>
                                            <td rowSpan={3} style={{
                                                width: '50px',
                                                textAlign: 'center',
                                                verticalAlign: 'middle',
                                                fontWeight: 900,
                                                fontSize: '1.1rem',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc'
                                            }}>
                                                {activeHit}
                                            </td>
                                            <td style={{
                                                width: '80px',
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                HEALTH
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {FIFTH_CUSP_PREDICTIONS[activeHit].health}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                CHILD
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {FIFTH_CUSP_PREDICTIONS[activeHit].child}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                GENERAL
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {FIFTH_CUSP_PREDICTIONS[activeHit].general}
                                            </td>
                                        </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Secondary Results Table */}
                        {(() => {
                            if (secondaryHits.length === 0) return null;

                            return (
                                <div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        color: '#000000',
                                        marginBottom: '6px'
                                    }}>
                                        Secondary Result
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {secondaryHits.map((num) => {
                                            const pred = FIFTH_CUSP_PREDICTIONS[num];
                                            if (!pred) return null;
                                            return (
                                                <table key={num} style={{
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td rowSpan={3} style={{
                                                                width: '50px',
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 900,
                                                                fontSize: '1.1rem',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc'
                                                            }}>
                                                                {num}
                                                            </td>
                                                            <td style={{
                                                                width: '80px',
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                HEALTH
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.health}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                CHILD
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.child}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                GENERAL
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.general}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* 6th House Cusp Custom Predictions Section */}
                {activeCuspNum === 6 && (
                    <div style={{
                        padding: '16px',
                        background: '#ffffff',
                        borderTop: '1px solid rgba(124, 92, 183, 0.08)',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        <h4 style={{
                            margin: '0 0 4px 0',
                            fontSize: '1rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#000000'
                        }}>
                            6th Cusp and its Effect
                        </h4>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#000000',
                            margin: '0 0 16px 0',
                            lineHeight: '1.4',
                            fontWeight: 800
                        }}>
                            6th Cuspal Sub Lord's Nakshatra Lord is all about Disease, Loan, Enemy, Disputes, Lost Article, Service, Employment and Prarabdha Karma.
                        </p>

                        {(() => {
                            const HOUSE_BODY_PARTS: Record<number, string> = {
                                1: "Head, Brain, Forehead, Skull, Body",
                                2: "Face, Neck, Throat, Nose, Eyes, Complexion, Teeth",
                                3: "Shoulders, Lungs, Hands, Fingers, Elbow, Ears, Collar Bone, Breathing",
                                4: "Breast, Heart, Chest, Ribs, Skin, Fat, Emotion, Digestive System",
                                5: "Stomach, Heart, Blood Circulation, Back, Spinalchord, Bile Juice, Mind",
                                6: "Liver & Lower Stomach, Abdomen, Umbilicus, Lower Spine, Intestine",
                                7: "Kidney, Lumbar, Hips, Pancreas, Bowels",
                                8: "Private Parts, Urinary, Reproductive Organ, Bladder, Anus",
                                9: "Thighs, Hips, Bones Of Thigh",
                                10: "Knees, Joints, Spine, All Bones",
                                11: "Calf Muscle, Ankles, Body Movement",
                                12: "Feet, Sole, Toes"
                            };

                            const RASHI_BODY_PARTS: Record<string, string> = {
                                "Aries": "Head, Brain, Forehead, Skull, Body",
                                "Taurus": "Face, Neck, Throat, Nose, Eyes, Complexion, Teeth",
                                "Gemini": "Shoulders, Lungs, Hands, Fingers, Elbow, Ears, Collar Bone, Breathing",
                                "Cancer": "Breast, Heart, Chest, Ribs, Skin, Fat, Emotion, Digestive System",
                                "Leo": "Stomach, Heart, Blood Circulation, Back, Spinalchord, Bile Juice, Mind",
                                "Virgo": "Liver & Lower Stomach, Abdomen, Umbilicus, Lower Spine, Intestine",
                                "Libra": "Kidney, Lumbar, Hips, Pancreas, Bowels",
                                "Scorpio": "Private Parts, Urinary, Reproductive Organ, Bladder, Anus",
                                "Sagittarius": "Thighs, Hips, Bones Of Thigh",
                                "Capricorn": "Knees, Joints, Spine, All Bones",
                                "Aquarius": "Calf Muscle, Ankles, Body Movement",
                                "Pisces": "Feet, Sole, Toes"
                            };

                            const PLANET_DISEASES: Record<string, string> = {
                                "SUN": "Stomach, heart, head, back, the right eye of a man, left eye of a woman, vitality, joint, sinus, migraine, high fever",
                                "MOON": "Lungs, blood, body fluids, brain, left eye of a man, right eye of a woman, insomnia, asthma, dry cough, diabetes, vomiting",
                                "MARS": "Blood, thalassemia, chest, nose, gall bladder, bile, bone marrow, red blood cells, brain disorder, itching, blood clotting, female genital diseases, knee problems",
                                "MERCURY": "Nervous system, skin, face, thyroid, mental disorders, ear problems",
                                "JUPITER": "Liver, kidneys, pancreas, Excessive fat gain, fatty liver, heart tumour, memory loss",
                                "VENUS": "throat, throat glands, face, cheeks, urine problems, ovarian cysts, impotency",
                                "SATURN": "Legs, bones, muscle, teeth, hair, physical weakness, joint pain, arthritis, gastric problems",
                                "RAHU": "cancer, breathing problems, ulcers, cataracts, stammering problems",
                                "KETU": "abdomen, wounds, flesh rotting, insect bite, mysterious diseases, physical weakness, stomach pain"
                            };

                            // PL and NL
                            const plName = planetData.planet;
                            const nlName = planetData.star_lord;

                            // PL and NL Rashis
                            const plObj = planets?.find(p => p.planet.toUpperCase() === plName?.toUpperCase());
                            const nlObj = planets?.find(p => p.planet.toUpperCase() === nlName?.toUpperCase());
                            const plRashi = plObj?.sign;
                            const nlRashi = nlObj?.sign;

                            // Extraction
                            const extractTerms = (text: string | undefined) => {
                                if (!text) return [];
                                return text.split(',').map(s => s.trim().toLowerCase().replace(/etc\.?/g, '').replace(/ and /g, '')).filter(s => s.length > 0 && s !== 'etc' && s !== 'etc.');
                            };

                            let allTerms: string[] = [];
                            
                            // 1. Planets
                            allTerms.push(...extractTerms(PLANET_DISEASES[plName.toUpperCase()]));
                            allTerms.push(...extractTerms(PLANET_DISEASES[nlName.toUpperCase()]));

                            // 2. Rashis
                            if (plRashi) allTerms.push(...extractTerms(RASHI_BODY_PARTS[plRashi]));
                            if (nlRashi) allTerms.push(...extractTerms(RASHI_BODY_PARTS[nlRashi]));

                            // 3. Hit Houses
                            if (plHit > 0 && plHit <= 12) allTerms.push(...extractTerms(HOUSE_BODY_PARTS[plHit]));
                            if (nlHit > 0 && nlHit <= 12) allTerms.push(...extractTerms(HOUSE_BODY_PARTS[nlHit]));

                            // Tallying
                            const frequency: Record<string, number> = {};
                            allTerms.forEach(t => {
                                frequency[t] = (frequency[t] || 0) + 1;
                            });

                            const sortedTerms = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
                            const primary = sortedTerms.filter(([, count]) => count > 1).map(([term]) => term);
                            const secondary = sortedTerms.filter(([, count]) => count === 1).map(([term]) => term);

                            // Helper to capitalize
                            const capitalize = (s: string) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                            return (
                                <div style={{ marginBottom: '20px', border: '1px solid rgba(124, 92, 183, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ background: '#fef2f2', padding: '10px 12px', borderBottom: '1px solid rgba(124, 92, 183, 0.08)', fontWeight: 900, fontSize: '0.85rem', color: '#b91c1c', textTransform: 'uppercase', textAlign: 'center' }}>
                                        6TH CUSP GENERAL COMBINATION (DISEASE)
                                    </div>
                                    <div style={{ padding: '12px', background: '#ffffff', fontSize: '0.8rem', color: '#334155', lineHeight: '1.6' }}>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1.5px dashed #cbd5e1' }}>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b', marginBottom: '2px' }}>PL: {plName}</div>
                                                <div style={{ fontSize: '0.75rem' }}>Rashi: <span style={{ fontWeight: 700 }}>{plRashi || '--'}</span></div>
                                                <div style={{ fontSize: '0.75rem' }}>Hit House: <span style={{ fontWeight: 700 }}>{plHit > 0 ? plHit : '--'}</span></div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b', marginBottom: '2px' }}>NL: {nlName}</div>
                                                <div style={{ fontSize: '0.75rem' }}>Rashi: <span style={{ fontWeight: 700 }}>{nlRashi || '--'}</span></div>
                                                <div style={{ fontSize: '0.75rem' }}>Hit House: <span style={{ fontWeight: 700 }}>{nlHit > 0 ? nlHit : '--'}</span></div>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '10px' }}>
                                            <span style={{ fontWeight: 900, color: '#dc2626', display: 'block', marginBottom: '4px' }}>PRIMARY DISEASE / BODY PARTS:</span>
                                            {primary.length > 0 ? (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {primary.map((p, i) => (
                                                        <span key={i} style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}>
                                                            {capitalize(p)}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>No strongly repeated indicators found.</span>
                                            )}
                                        </div>

                                        <div>
                                            <span style={{ fontWeight: 900, color: '#475569', display: 'block', marginBottom: '4px' }}>SECONDARY DISEASE / BODY PARTS:</span>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                                {secondary.length > 0 ? secondary.map(s => capitalize(s)).join(', ') : 'None'}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })()}

                        {/* Primary Result Table */}
                        {primaryHits.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: '#000000',
                                    marginBottom: '6px'
                                }}>
                                    Primary Result
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {primaryHits.map((activeHit) => {
                                        if (!SIXTH_CUSP_PREDICTIONS[activeHit]) return null;
                                        return (
                                            <table key={activeHit} style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                fontSize: '0.75rem'
                                            }}>
                                                <tbody>
                                        <tr>
                                            <td rowSpan={4} style={{
                                                width: '50px',
                                                textAlign: 'center',
                                                verticalAlign: 'middle',
                                                fontWeight: 900,
                                                fontSize: '1.1rem',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc'
                                            }}>
                                                {activeHit}
                                            </td>
                                            <td style={{
                                                width: '80px',
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                JOB
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {SIXTH_CUSP_PREDICTIONS[activeHit].job}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                HEALTH
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {SIXTH_CUSP_PREDICTIONS[activeHit].health}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                LEGAL
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {SIXTH_CUSP_PREDICTIONS[activeHit].legal}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                GENERAL
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {SIXTH_CUSP_PREDICTIONS[activeHit].general}
                                            </td>
                                        </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Secondary Results Table */}
                        {(() => {
                            if (secondaryHits.length === 0) return null;

                            return (
                                <div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        color: '#000000',
                                        marginBottom: '6px'
                                    }}>
                                        Secondary Result
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {secondaryHits.map((num) => {
                                            const pred = SIXTH_CUSP_PREDICTIONS[num];
                                            if (!pred) return null;
                                            return (
                                                <table key={num} style={{
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td rowSpan={4} style={{
                                                                width: '50px',
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 900,
                                                                fontSize: '1.1rem',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc'
                                                            }}>
                                                                {num}
                                                            </td>
                                                            <td style={{
                                                                width: '80px',
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                JOB
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.job}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                HEALTH
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.health}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                LEGAL
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.legal}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                GENERAL
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.general}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* 7th House Cusp Custom Predictions Section */}
                {activeCuspNum === 7 && (
                    <div style={{
                        padding: '16px',
                        background: '#ffffff',
                        borderTop: '1px solid rgba(124, 92, 183, 0.08)',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        <h4 style={{
                            margin: '0 0 4px 0',
                            fontSize: '1rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#000000'
                        }}>
                            7th Cusp and its Effect
                        </h4>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#000000',
                            margin: '0 0 16px 0',
                            lineHeight: '1.4',
                            fontWeight: 800
                        }}>
                            7th Cuspal Sub Lord's Nakshatra Lord is All About Life Partner, Business Partner, Contracts, Mediation, Negotiation, Dealers And Relationships.
                        </p>

                        {/* 7th CSL Special Analysis Panels */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                            {/* 1. Marriage Fixed By */}
                            {(() => {
                                const activeWhoDecides = [
                                    "",
                                    "Self-Effort.",
                                    "Family Member.",
                                    "Online / Matrimony / Neighbor / Mediator / Broker / Younger Siblings.",
                                    "Mother / Same locality.",
                                    "Mother's Family / Unknown person / By Love / Self Selective.",
                                    "Uncle side / Cousin / Work place.",
                                    "Public side / Father's friend / Marriage Bureau.",
                                    "Sudden / Unexpected / Old friends.",
                                    "Father / Elder's / Mentor.",
                                    "Working place / Father's Family.",
                                    "Friends / Elder Siblings / Social Network.",
                                    "Far from Native place / Foreign / NRI."
                                ][plHit] || "Not available";

                                return (
                                    <div style={{ border: '1px solid rgba(124, 92, 183, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ background: '#eff6ff', padding: '10px 12px', borderBottom: '1px solid rgba(124, 92, 183, 0.08)', fontWeight: 900, fontSize: '0.85rem', color: '#1e40af', textTransform: 'uppercase', textAlign: 'center' }}>
                                            Marriage Fixed By
                                        </div>
                                        <div style={{ padding: '12px', background: '#ffffff' }}>
                                            <div style={{ background: '#dbeafe', border: '1.5px solid #1e40af', borderRadius: '4px', padding: '10px 12px' }}>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#1e40af', textTransform: 'uppercase', marginBottom: '2px' }}>
                                                    7th CSL Planet ({planetData.planet}) Placement: House {plHit}
                                                </div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e3a8a', lineHeight: '1.4' }}>
                                                    {activeWhoDecides}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* 2. Nature of Partner */}
                            {(() => {
                                const activePlanetName = planetData.planet.toUpperCase();
                                const partnerCharacteristics: Record<string, string> = {
                                    "SUN": "Egoistic.",
                                    "MOON": "Emotional / Sensitive / Caring.",
                                    "MARS": "Aggressive / Energetic / Fights / Arguments.",
                                    "MERCURY": "Talkative / Intellect / Calculative / Lazy.",
                                    "JUPITER": "Ideal / Cultured.",
                                    "VENUS": "Stylish / Luxury Mind.",
                                    "SATURN": "Slow.",
                                    "RAHU": "Money Minded / Doubtful / Manipulative / Insecure.",
                                    "KETU": "Spiritual / Detached."
                                };
                                const activeCharacteristic = partnerCharacteristics[activePlanetName] || "Not available";

                                return (
                                    <div style={{ border: '1px solid rgba(124, 92, 183, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ background: '#fdf2f8', padding: '10px 12px', borderBottom: '1px solid rgba(124, 92, 183, 0.08)', fontWeight: 900, fontSize: '0.85rem', color: '#be185d', textTransform: 'uppercase', textAlign: 'center' }}>
                                            Nature of Partner
                                        </div>
                                        <div style={{ padding: '12px', background: '#ffffff' }}>
                                            <div style={{ background: '#fce7f3', border: '1.5px solid #be185d', borderRadius: '4px', padding: '10px 12px' }}>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#be185d', textTransform: 'uppercase', marginBottom: '2px' }}>
                                                    7th CSL Planet: {planetData.planet}
                                                </div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#831843', lineHeight: '1.4' }}>
                                                    {activeCharacteristic}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* 3. Houses in Content of Marriage */}
                            {(() => {
                                const activeAttribute = [
                                    "",
                                    "Self-center Attitude.",
                                    "Addition in Family.",
                                    "Mediator / Marriage bureau.",
                                    "Loveless partner / Unromantic.",
                                    "Love / Attraction / Ego.",
                                    "Fights / Dispute / Conflict.",
                                    "Bonding / Partnership / Daily Interaction.",
                                    "Doubt / Problems / Stress / Obstacles / Humiliation / Depression.",
                                    "Luck / Ideal partners.",
                                    "Ego / Authority / Dominant.",
                                    "Friendly / Wish Fulfillment.",
                                    "Separation / Loss / Depression / Detachment."
                                ][plHit] || "Not available";

                                return (
                                    <div style={{ border: '1px solid rgba(124, 92, 183, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ background: '#fef3c7', padding: '10px 12px', borderBottom: '1px solid rgba(124, 92, 183, 0.08)', fontWeight: 900, fontSize: '0.85rem', color: '#92400e', textTransform: 'uppercase', textAlign: 'center' }}>
                                            7th Cusp General Combination (Houses in Content of Marriage)
                                        </div>
                                        <div style={{ padding: '12px', background: '#ffffff' }}>
                                            <div style={{ background: '#fef3c7', border: '1.5px solid #92400e', borderRadius: '4px', padding: '10px 12px' }}>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#92400e', textTransform: 'uppercase', marginBottom: '2px' }}>
                                                    7th CSL Placement: House {plHit}
                                                </div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#78350f', lineHeight: '1.4' }}>
                                                    {activeAttribute}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Primary Result Table */}
                        {primaryHits.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: '#000000',
                                    marginBottom: '6px'
                                }}>
                                    Primary Result
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {primaryHits.map((activeHit) => {
                                        if (!SEVENTH_CUSP_PREDICTIONS[activeHit]) return null;
                                        return (
                                            <table key={activeHit} style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                fontSize: '0.75rem'
                                            }}>
                                                <tbody>
                                        <tr>
                                            <td rowSpan={3} style={{
                                                width: '50px',
                                                textAlign: 'center',
                                                verticalAlign: 'middle',
                                                fontWeight: 900,
                                                fontSize: '1.1rem',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc'
                                            }}>
                                                {activeHit}
                                            </td>
                                            <td style={{
                                                width: '80px',
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                MARRIAGE
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {SEVENTH_CUSP_PREDICTIONS[activeHit].marriage}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                BUSINESS
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {SEVENTH_CUSP_PREDICTIONS[activeHit].business}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                GENERAL
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {SEVENTH_CUSP_PREDICTIONS[activeHit].general}
                                            </td>
                                        </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Secondary Results Table */}
                        {(() => {
                            if (secondaryHits.length === 0) return null;

                            return (
                                <div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        color: '#000000',
                                        marginBottom: '6px'
                                    }}>
                                        Secondary Result
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {secondaryHits.map((num) => {
                                            const pred = SEVENTH_CUSP_PREDICTIONS[num];
                                            if (!pred) return null;
                                            return (
                                                <table key={num} style={{
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td rowSpan={3} style={{
                                                                width: '50px',
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 900,
                                                                fontSize: '1.1rem',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc'
                                                            }}>
                                                                {num}
                                                            </td>
                                                            <td style={{
                                                                width: '80px',
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                MARRIAGE
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.marriage}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                BUSINESS
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.business}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                GENERAL
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.general}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* 8th House Cusp Custom Predictions Section */}
                {activeCuspNum === 8 && (
                    <div style={{
                        padding: '16px',
                        background: '#ffffff',
                        borderTop: '1px solid rgba(124, 92, 183, 0.08)',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        <h4 style={{
                            margin: '0 0 4px 0',
                            fontSize: '1rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#000000'
                        }}>
                            8th Cusp and its Effect
                        </h4>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#000000',
                            margin: '0 0 16px 0',
                            lineHeight: '1.4',
                            fontWeight: 800
                        }}>
                            8th Cuspal Sub Lord's Nakshatra Lord is all about Self-Created Issues, Death, Chronic Disease, Unexpected Incidents, Insurance Money, Legacies, Research, Hidden Knowledge, Mystic Science and Depth Studies.
                        </p>

                        {/* Primary Result Table */}
                        {primaryHits.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: '#000000',
                                    marginBottom: '6px'
                                }}>
                                    Primary Result
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {primaryHits.map((activeHit) => {
                                        if (!EIGHTH_CUSP_PREDICTIONS[activeHit]) return null;
                                        return (
                                            <table key={activeHit} style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                fontSize: '0.75rem'
                                            }}>
                                                <tbody>
                                        <tr>
                                            <td rowSpan={3} style={{
                                                width: '50px',
                                                textAlign: 'center',
                                                verticalAlign: 'middle',
                                                fontWeight: 900,
                                                fontSize: '1.1rem',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc'
                                            }}>
                                                {activeHit}
                                            </td>
                                            <td style={{
                                                width: '80px',
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                INHERITANCE
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {EIGHTH_CUSP_PREDICTIONS[activeHit].inheritance}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                HEALTH
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {EIGHTH_CUSP_PREDICTIONS[activeHit].health}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                GENERAL
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {EIGHTH_CUSP_PREDICTIONS[activeHit].general}
                                            </td>
                                        </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Secondary Results Table */}
                        {(() => {
                            if (secondaryHits.length === 0) return null;

                            return (
                                <div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        color: '#000000',
                                        marginBottom: '6px'
                                    }}>
                                        Secondary Result
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {secondaryHits.map((num) => {
                                            const pred = EIGHTH_CUSP_PREDICTIONS[num];
                                            if (!pred) return null;
                                            return (
                                                <table key={num} style={{
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td rowSpan={3} style={{
                                                                width: '50px',
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 900,
                                                                fontSize: '1.1rem',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc'
                                                            }}>
                                                                {num}
                                                            </td>
                                                            <td style={{
                                                                width: '80px',
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                INHERITANCE
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.inheritance}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                HEALTH
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.health}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                GENERAL
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.general}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* 9th House Cusp Custom Predictions Section */}
                {activeCuspNum === 9 && (
                    <div style={{
                        padding: '16px',
                        background: '#ffffff',
                        borderTop: '1px solid rgba(124, 92, 183, 0.08)',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        <h4 style={{
                            margin: '0 0 4px 0',
                            fontSize: '1rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#000000'
                        }}>
                            9th Cusp and its Effect
                        </h4>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#000000',
                            margin: '0 0 16px 0',
                            lineHeight: '1.4',
                            fontWeight: 800
                        }}>
                            9th Cuspal Sub Lord's Nakshatra Lord is all about Long Travel, Higher Education, Father, Guru, Luck, Prosperity, Principles, Ethics, Moral Values, God Grace, Scriptures, Tapa Sthana, Meditation.
                        </p>

                        {/* Primary Result Table */}
                        {primaryHits.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: '#000000',
                                    marginBottom: '6px'
                                }}>
                                    Primary Result
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {primaryHits.map((activeHit) => {
                                        if (!NINTH_CUSP_PREDICTIONS[activeHit]) return null;
                                        return (
                                            <table key={activeHit} style={{
                                                        width: '100%',
                                                        borderCollapse: 'collapse',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        fontSize: '0.75rem'
                                                        }}>
                                            <tbody>
                                                <tr>
                                                    <td rowSpan={5} style={{
                                                        width: '50px',
                                                        textAlign: 'center',
                                                        verticalAlign: 'middle',
                                                        fontWeight: 900,
                                                        fontSize: '1.1rem',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc'
                                                        }}>
                                                        {activeHit}
                                                    </td>
                                                    <td style={{
                                                        width: '80px',
                                                        fontWeight: 900,
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc',
                                                        color: '#000000'
                                                        }}>
                                                        HIGHER
                                                    </td>
                                                    <td style={{
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        color: '#000000',
                                                        fontWeight: 500
                                                        }}>
                                                        {NINTH_CUSP_PREDICTIONS[activeHit].higherEducation}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{
                                                        fontWeight: 900,
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc',
                                                        color: '#000000'
                                                        }}>
                                                        TRAVEL
                                                    </td>
                                                    <td style={{
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        color: '#000000',
                                                        fontWeight: 500
                                                        }}>
                                                        {NINTH_CUSP_PREDICTIONS[activeHit].travel}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{
                                                        fontWeight: 900,
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc',
                                                        color: '#000000'
                                                        }}>
                                                        FATHER
                                                    </td>
                                                    <td style={{
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        color: '#000000',
                                                        fontWeight: 500
                                                        }}>
                                                        {NINTH_CUSP_PREDICTIONS[activeHit].father}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{
                                                        fontWeight: 900,
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc',
                                                        color: '#000000'
                                                        }}>
                                                        GENERAL
                                                    </td>
                                                    <td style={{
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        color: '#000000',
                                                        fontWeight: 500
                                                        }}>
                                                        {NINTH_CUSP_PREDICTIONS[activeHit].general}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{
                                                        fontWeight: 900,
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        background: '#f8fafc',
                                                        color: '#000000'
                                                        }}>
                                                        2ND MARRIAGE
                                                    </td>
                                                    <td style={{
                                                        padding: '8px',
                                                        border: '1px solid rgba(124, 92, 183, 0.08)',
                                                        color: '#000000',
                                                        fontWeight: 500
                                                        }}>
                                                        {NINTH_CUSP_PREDICTIONS[activeHit].secondMarriage}
                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Secondary Results Table */}
                        {(() => {
                            if (secondaryHits.length === 0) return null;

                            return (
                                <div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        color: '#000000',
                                        marginBottom: '6px'
                                    }}>
                                        Secondary Result
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {secondaryHits.map((num) => {
                                            const pred = NINTH_CUSP_PREDICTIONS[num];
                                            if (!pred) return null;
                                            return (
                                                <table key={num} style={{
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td rowSpan={5} style={{
                                                                width: '50px',
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 900,
                                                                fontSize: '1.1rem',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc'
                                                            }}>
                                                                {num}
                                                            </td>
                                                            <td style={{
                                                                width: '80px',
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                HIGHER
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.higherEducation}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                TRAVEL
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.travel}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                FATHER
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.father}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                GENERAL
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                             }}>
                                                                {pred.general}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                2ND MARRIAGE
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.secondMarriage}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* 10th House Cusp Custom Predictions Section */}
                {activeCuspNum === 10 && (
                    <div style={{
                        padding: '16px',
                        background: '#ffffff',
                        borderTop: '1px solid rgba(124, 92, 183, 0.08)',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        <h4 style={{
                            margin: '0 0 4px 0',
                            fontSize: '1rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#000000'
                        }}>
                            10th Cusp and its Effect
                        </h4>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#000000',
                            margin: '0 0 16px 0',
                            lineHeight: '1.4',
                            fontWeight: 800
                        }}>
                            10th Cuspal Sub Lord's Nakshatra Lord is all about Job, Professional, Status, Power, and Prestige.
                        </p>

                        {/* Primary Result Table */}
                        {primaryHits.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: '#000000',
                                    marginBottom: '6px'
                                }}>
                                    Primary Result
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {primaryHits.map((activeHit) => {
                                        if (!TENTH_CUSP_PREDICTIONS[activeHit]) return null;
                                        return (
                                            <table key={activeHit} style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                fontSize: '0.75rem'
                                            }}>
                                                <tbody>
                                        <tr>
                                            <td rowSpan={2} style={{
                                                width: '50px',
                                                textAlign: 'center',
                                                verticalAlign: 'middle',
                                                fontWeight: 900,
                                                fontSize: '1.1rem',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc'
                                            }}>
                                                {activeHit}
                                            </td>
                                            <td style={{
                                                width: '80px',
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                PROFESSION
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {TENTH_CUSP_PREDICTIONS[activeHit].profession}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                GENERAL
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {TENTH_CUSP_PREDICTIONS[activeHit].general}
                                            </td>
                                        </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Secondary Results Table */}
                        {(() => {
                            if (secondaryHits.length === 0) return null;

                            return (
                                <div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        color: '#000000',
                                        marginBottom: '6px'
                                    }}>
                                        Secondary Result
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {secondaryHits.map((num) => {
                                            const pred = TENTH_CUSP_PREDICTIONS[num];
                                            if (!pred) return null;
                                            return (
                                                <table key={num} style={{
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td rowSpan={2} style={{
                                                                width: '50px',
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 900,
                                                                fontSize: '1.1rem',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc'
                                                            }}>
                                                                {num}
                                                            </td>
                                                            <td style={{
                                                                width: '80px',
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                PROFESSION
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.profession}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                GENERAL
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.general}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* 11th House Cusp Custom Predictions Section */}
                {activeCuspNum === 11 && (
                    <div style={{
                        padding: '16px',
                        background: '#ffffff',
                        borderTop: '1px solid rgba(124, 92, 183, 0.08)',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        <h4 style={{
                            margin: '0 0 4px 0',
                            fontSize: '1rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#000000'
                        }}>
                            11th Cusp and its Effect
                        </h4>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#000000',
                            margin: '0 0 16px 0',
                            lineHeight: '1.4',
                            fontWeight: 800
                        }}>
                            11th Cuspal Sub Lord's Nakshatra Lord is all about Gains or Profit through all Houses, Support, Elder Brother, Friends, Social Association, Hopes, Desires, Realization of Dreams, Followers, wish fulfilment, Happiness, Victory.
                        </p>

                        {/* Primary Result Table */}
                        {primaryHits.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: '#000000',
                                    marginBottom: '6px'
                                }}>
                                    Primary Result
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {primaryHits.map((activeHit) => {
                                        if (!ELEVENTH_CUSP_PREDICTIONS[activeHit]) return null;
                                        return (
                                            <table key={activeHit} style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                fontSize: '0.75rem'
                                            }}>
                                                <tbody>
                                        <tr>
                                            <td rowSpan={1} style={{
                                                width: '50px',
                                                textAlign: 'center',
                                                verticalAlign: 'middle',
                                                fontWeight: 900,
                                                fontSize: '1.1rem',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc'
                                            }}>
                                                {activeHit}
                                            </td>
                                            <td style={{
                                                width: '80px',
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                GENERAL
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {ELEVENTH_CUSP_PREDICTIONS[activeHit].general}
                                            </td>
                                        </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Secondary Results Table */}
                        {(() => {
                            if (secondaryHits.length === 0) return null;

                            return (
                                <div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        color: '#000000',
                                        marginBottom: '6px'
                                    }}>
                                        Secondary Result
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {secondaryHits.map((num) => {
                                            const pred = ELEVENTH_CUSP_PREDICTIONS[num];
                                            if (!pred) return null;
                                            return (
                                                <table key={num} style={{
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td rowSpan={1} style={{
                                                                width: '50px',
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 900,
                                                                fontSize: '1.1rem',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc'
                                                            }}>
                                                                {num}
                                                            </td>
                                                            <td style={{
                                                                width: '80px',
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                GENERAL
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.general}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* 12th House Cusp Custom Predictions Section */}
                {activeCuspNum === 12 && (
                    <div style={{
                        padding: '16px',
                        background: '#ffffff',
                        borderTop: '1px solid rgba(124, 92, 183, 0.08)',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        <h4 style={{
                            margin: '0 0 4px 0',
                            fontSize: '1rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#000000'
                        }}>
                            12th Cusp and its Effect
                        </h4>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#000000',
                            margin: '0 0 16px 0',
                            lineHeight: '1.4',
                            fontWeight: 800
                        }}>
                            12th Cuspal Sub Lord's Nakshatra Lord is all about Abroad or Faraway from Birth place, Jail, Hospitality, Losses, Secret Work, Fears, Isolation, Separation, Endings, Poor Health, Moksha.
                        </p>

                        {/* Primary Result Table */}
                        {primaryHits.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: '#000000',
                                    marginBottom: '6px'
                                }}>
                                    Primary Result
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {primaryHits.map((activeHit) => {
                                        if (!TWELFTH_CUSP_PREDICTIONS[activeHit]) return null;
                                        return (
                                            <table key={activeHit} style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                fontSize: '0.75rem'
                                            }}>
                                                <tbody>
                                        <tr>
                                            <td rowSpan={3} style={{
                                                width: '50px',
                                                textAlign: 'center',
                                                verticalAlign: 'middle',
                                                fontWeight: 900,
                                                fontSize: '1.1rem',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc'
                                            }}>
                                                {activeHit}
                                            </td>
                                            <td style={{
                                                width: '80px',
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                WEALTH
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {TWELFTH_CUSP_PREDICTIONS[activeHit].wealth}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                HEALTH
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {TWELFTH_CUSP_PREDICTIONS[activeHit].health}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{
                                                fontWeight: 900,
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                background: '#f8fafc',
                                                color: '#000000'
                                            }}>
                                                GENERAL
                                            </td>
                                            <td style={{
                                                padding: '8px',
                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                color: '#000000',
                                                fontWeight: 500
                                            }}>
                                                {TWELFTH_CUSP_PREDICTIONS[activeHit].general}
                                            </td>
                                        </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Secondary Results Table */}
                        {(() => {
                            if (secondaryHits.length === 0) return null;

                            return (
                                <div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        color: '#000000',
                                        marginBottom: '6px'
                                    }}>
                                        Secondary Result
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {secondaryHits.map((num) => {
                                            const pred = TWELFTH_CUSP_PREDICTIONS[num];
                                            if (!pred) return null;
                                            return (
                                                <table key={num} style={{
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    border: '1px solid rgba(124, 92, 183, 0.08)',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td rowSpan={3} style={{
                                                                width: '50px',
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 900,
                                                                fontSize: '1.1rem',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc'
                                                            }}>
                                                                {num}
                                                            </td>
                                                            <td style={{
                                                                width: '80px',
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                WEALTH
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.wealth}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                HEALTH
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.health}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{
                                                                fontWeight: 900,
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                background: '#f8fafc',
                                                                color: '#000000'
                                                            }}>
                                                                GENERAL
                                                            </td>
                                                            <td style={{
                                                                padding: '8px',
                                                                border: '1px solid rgba(124, 92, 183, 0.08)',
                                                                color: '#000000',
                                                                fontWeight: 500
                                                            }}>
                                                                {pred.general}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

            </div>
        </div>
    );
};

export default JobPredictionTable;
