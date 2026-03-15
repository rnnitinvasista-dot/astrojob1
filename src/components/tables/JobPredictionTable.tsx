import React, { useState } from 'react';
import type { NakshatraNadiItem, Planet } from '../../types/astrology';

interface JobPredictionTableProps {
    data: NakshatraNadiItem[];
    planets: Planet[];
    types: ('Dasha' | 'Bhukti' | 'Antara')[];
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

const JobPredictionTable: React.FC<JobPredictionTableProps> = ({ data, planets, types, planetName, selectedArea }) => {
    const isEducation = selectedArea === 'Education';
    const isMarriage = selectedArea === 'Marriage';
    const isChildBirth = selectedArea === 'Child Birth';
    const isHealth = selectedArea === 'Health';
    const isTravel = selectedArea === 'Travel';
    const isProperty = selectedArea === 'Property & Vehicle';
    
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'DETAILS' | 'REMEDIES'>('DETAILS');
    const [subTab, setSubTab] = useState<'ABROAD' | 'HOME' | 'PURCHASE' | 'SALE'>(isTravel ? 'ABROAD' : 'PURCHASE');

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

    const plBif = renderHousesPerRow(plHouses, isHealth ? -1 : plHit);
    const nlBif = renderHousesPerRow(nlHouses, nlHit);
    const slBif = renderHousesPerRow(slHouses, slHit);

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
        Antara: { color: '#b45309', text: '#ffffff', label: 'Antar Bhukthi' }
    }[t]));

    // Determine header background based on highest priority type
    const getHeaderStyle = () => {
        const themeMap = {
            Dasha: '#1d4ed8',
            Bhukti: '#15803d',
            Antara: '#b45309'
        };

        if (types.length === 0) return { background: '#f8fafc', color: '#1e3a8a' };
        if (types.length === 1) return { background: themeMap[types[0]], color: '#ffffff' };
        
        const step = 100 / types.length;
        const stops = types.map((t, i) => `${themeMap[t]} ${i * step}%, ${themeMap[t]} ${(i + 1) * step}%`);
        return { background: `linear-gradient(to right, ${stops.join(', ')})`, color: '#ffffff' };
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
            borderRadius: '0',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            marginBottom: '1.5rem',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            width: '100%',
            maxWidth: '100%',
            margin: '0 0 0.75rem',
            border: '3px solid #000000',
        }}>
            <div style={{ background: headerStyle.background, padding: '10px 8px', textAlign: 'center', borderBottom: '2px solid #000000' }}>
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
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#15803d', marginBottom: '4px', textTransform: 'uppercase' }}>
                                    {isTravel ? "ABROAD / AWAY" : isProperty ? "PURCHASE" : "GOOD"}
                                </div>
                                {row.bif.renderCell(row.bif.good, false)}
                            </div>
                            <div style={{ background: '#fef2f2', padding: '6px', borderRadius: '6px', border: '1px solid #fee2e2' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#b91c1c', marginBottom: '4px', textTransform: 'uppercase' }}>
                                    {isTravel ? "HOME" : isProperty ? "SALE" : "BAD"}
                                </div>
                                {row.bif.renderCell(row.bif.bad, true)}
                            </div>
                        </div>
                    </div>
                ))}

                <div style={{ borderBottom: '1.5px solid #000000', padding: '8px 12px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
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
                    <div style={{ borderBottom: '1.5px solid #000000', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid #000000' }}>
                            <div 
                                onClick={() => setSubTab(isTravel ? 'ABROAD' : 'PURCHASE')}
                                style={{ 
                                    flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer',
                                    fontSize: '0.7rem', fontWeight: 900, 
                                    background: (subTab === 'ABROAD' || subTab === 'PURCHASE') ? '#ffffff' : '#f1f5f9',
                                    color: (subTab === 'ABROAD' || subTab === 'PURCHASE') ? '#1e3a8a' : '#64748b',
                                    borderRight: '1px solid #000000'
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

                <div style={{ borderBottom: '1.5px solid #000000', padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
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
                        <div style={{ borderBottom: '1.5px solid #000000', padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
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
                    <div style={{ borderBottom: '1.5px solid #000000', padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#b91c1c', textTransform: 'uppercase' }}>DESCRIPTION</div>
                        <div style={{ display: 'flex', gap: '8px', fontWeight: 800, fontSize: '0.85rem', alignItems: 'center', textAlign: 'center' }}>
                            <span style={{ color: '#ef4444' }}>
                                PROBLEM TIME (LITIGATION)
                            </span>
                        </div>
                    </div>
                )}
                
                {!isHealth && !isTravel && !isProperty && (
                    <div onClick={() => setIsExpanded(!isExpanded)} style={{ padding: '10px', textAlign: 'center', cursor: 'pointer', background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', borderBottom: '1.5px solid #000000' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>SUCCESS RATE</div>
                        <span style={{ color: successInfo.color, fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px' }}>
                            {successInfo.label.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#000000', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                    </div>
                )}

                {isHealth && (
                    <div style={{ borderBottom: '1.5px solid #000000', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid #000000' }}>
                            <div 
                                onClick={() => setActiveTab('DETAILS')}
                                style={{ 
                                    flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer',
                                    fontSize: '0.7rem', fontWeight: 900, 
                                    background: activeTab === 'DETAILS' ? '#ffffff' : '#f1f5f9',
                                    color: activeTab === 'DETAILS' ? '#1e3a8a' : '#64748b',
                                    borderRight: '1px solid #000000'
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
                                            <span style={{ fontWeight: 900, color: '#000000', minWidth: '40px' }}>NL:</span>
                                            <span>{shuffleText(HEALTH_DISEASE_MAP[planetData.star_lord.toUpperCase()] || "General health issues")}</span>
                                        </div>
                                    )}
                                    
                                    <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
                                    
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 900, color: '#35a4f4' }}>NL:</span>
                                        <span style={{ color: '#334155' }}>{nlProfessionText}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 900, color: '#35a4f4' }}>SL:</span>
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

                                    if (!showDonation) {
                                        return <div style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.6 }}>No specific remedies for this period</div>;
                                    }

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
                                                    <div style={{ marginTop: '4px', padding: '10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 900, marginBottom: '6px' }}>OFFERING GUIDELINES:</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            <div>• For the initial three months, please perform the donation every week on the indicated day. Thereafter, from the 4th to 6th month, you may continue once per month on that same day.</div>
                                                            <div>• Should the disruptive hit come along with secondary houses <strong>(5 or 11)</strong> in the combination, a monthly donation for a six-month duration on the specified day is appropriate.</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                )}

                {isMarriage && (
                    <div style={{ borderBottom: '1.5px solid #000000', padding: '12px', background: '#f8fafc' }}>
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

                {isExpanded && !isChildBirth && !isHealth && (
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
                                        <span style={{ fontWeight: 900, color: '#35a4f4' }}>NL:</span>
                                        <span style={{ color: '#334155' }}>{nlProfessionText}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 900, color: '#35a4f4' }}>SL:</span>
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

                                    if (!showDonation) {
                                        return <div style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.6 }}>No specific remedies for this period</div>;
                                    }

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
                                                    <div style={{ marginTop: '4px', padding: '10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 900, marginBottom: '6px' }}>OFFERING GUIDELINES:</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            <div>• For the initial three months, please perform the donation every week on the indicated day. Thereafter, from the 4th to 6th month, you may continue once per month on that same day.</div>
                                                            <div>• Should the disruptive hit come along with secondary houses <strong>{isMarriage ? "(2, 7, or 9)" : isEducation ? "(4, 9, 10, or 11)" : "(2, 6, 10, or 11)"}</strong> in the combination, a monthly donation for a six-month duration on the specified day is appropriate.</div>
                                                        </div>
                                                    </div>
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
            </div>
        </div>
    );
};

export default JobPredictionTable;
