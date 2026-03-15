import type { NakshatraNadiItem, Planet } from '../types/astrology';

export const JOB_PROFESSION_MAP: Record<number, string> = {
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

export const EDU_PROFESSION_MAP: Record<number, string> = {
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

export const MARRIAGE_RESULT_MAP: Record<number, string> = {
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

export const CHILD_BIRTH_RESULT_MAP: Record<number, string> = {
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

export const HEALTH_RESULT_MAP: Record<number, string> = {
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

export const HEALTH_DISEASE_MAP: Record<string, string> = {
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

export const DONATION_MAP: Record<string, { item: string, day: string, time: string }> = {
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
const JOB_BAD_01 = [[5, 6, 7, 8, 9, 12], [5, 6, 7, 8, 12], [5, 7, 8, 12], [5, 6, 8, 12], [5, 8, 12], [8, 12], [5, 8], [5, 12]];
const JOB_BAD_02 = [[6, 8, 9, 12], [7, 8, 9, 12], [6, 8, 12], [7, 8, 12], [6, 12], [7, 12], [9, 12]];
const JOB_GOOD_A_PLUS = [[2, 6, 7, 9, 10, 11], [2, 6, 7, 9, 11], [2, 6, 7, 11], [2, 6, 11], [2, 7, 11], [2, 11], [10, 11], [7, 11], [4, 11], [3, 11], [5, 11], [8, 11], [11]];
const JOB_GOOD_A = [[2, 6, 7, 9, 10], [2, 6, 7, 10], [2, 6, 10], [2, 7, 10], [2, 10], [9, 10], [7, 10], [4, 10], [3, 10], [5, 10], [8, 10], [10]];
const JOB_GOOD_B = [[2, 6, 7, 9], [2, 6, 9], [2, 7, 9], [2, 6], [2, 7], [2, 9], [7, 9], [4, 9], [3, 9], [5, 9], [5], [8], [12]];
const CHILD_BIRTH_VERY_HIGH = [[2, 5, 9, 11]];
const CHILD_BIRTH_HIGH = [[2, 5, 11], [5, 9, 11], [5, 11]];
const CHILD_BIRTH_MEDIUM = [[5], [2], [11]];
const CHILD_BIRTH_BAD = [[1, 4, 8, 10, 12], [1, 4, 8, 10], [1, 4, 10], [4, 10], [4], [1, 10]];
const HEALTH_GOOD_HIGH = [[5, 9, 11]];
const HEALTH_GOOD_MEDIUM = [[5, 11], [5, 9]];
const HEALTH_GOOD_LOW = [[5], [11], [9]];
const MARRIAGE_GOOD_VERY_GOOD = [[2, 7, 9, 11]];
const MARRIAGE_GOOD_GOOD = [[2, 7, 11], [7, 9, 11], [2, 9, 11]];
const MARRIAGE_GOOD_MEDIUM = [[2, 7], [2, 11], [7, 11]];
const MARRIAGE_GOOD_LOW = [[2], [7], [9], [11]];

export function checkSubset(set: Set<number>, subsets: number[][]): boolean {
    return subsets.some(sub => sub.every(h => set.has(h)));
}

export function getSuccessLabel(code: string) {
    switch (code) {
        case 'VB!': case 'VB': return 'Very Bad!';
        case 'B!': case 'B': return 'Bad!';
        case 'M': return 'Medium';
        case 'L': return 'Low';
        case 'H': return 'High';
        case 'G': return 'Good';
        case 'E': return 'Excellent';
        default: return code;
    }
}

export function getBifurcation(houseSet: Set<number>, area: string) {
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
}

export function calculateReportData(planetName: string, area: string, nakshatraNadi: NakshatraNadiItem[], planets: Planet[]) {
    const planetData = nakshatraNadi.find(p => p.planet === planetName);
    if (!planetData) return null;

    const placementMap: Record<string, number> = {};
    planets.forEach(p => { placementMap[p.planet.toUpperCase()] = p.house_placed; });

    let plHouses = planetData.pl_signified.map(h => h.house);
    let nlHouses = planetData.nl_signified.map(h => h.house);
    let slHouses = planetData.sl_signified.map(h => h.house);
    
    let plHit = placementMap[planetData.planet.toUpperCase()];
    let nlHit = placementMap[planetData.star_lord.toUpperCase()];
    let slHit = placementMap[planetData.sub_lord.toUpperCase()];

    if (area === 'Child Birth') {
        plHouses = plHouses.filter(h => h !== 3 && h !== 6 && h !== 7);
        nlHouses = nlHouses.filter(h => h !== 3 && h !== 6 && h !== 7);
        slHouses = slHouses.filter(h => h !== 3 && h !== 6 && h !== 7);
        if (plHit === 3 || plHit === 6 || plHit === 7) plHit = -1;
        if (nlHit === 3 || nlHit === 6 || nlHit === 7) nlHit = -1;
        if (slHit === 3 || slHit === 6 || slHit === 7) slHit = -1;
    }

    const plSet = new Set(plHouses); if (plHit !== -1) plSet.add(plHit);
    const nlSet = new Set(nlHouses); if (nlHit !== -1) nlSet.add(nlHit);
    const slSet = new Set(slHouses); if (slHit !== -1) slSet.add(slHit);

    const plBif = getBifurcation(plSet, area);
    const nlBif = getBifurcation(nlSet, area);
    const slBif = getBifurcation(slSet, area);

    const allHousesSet = new Set([...plSet, ...nlSet, ...slSet]);
    const comboGoodSet = new Set([...plBif.colGood, ...nlBif.colGood, ...slBif.colGood]);
    const comboBadSet = new Set([...plBif.colBad, ...nlBif.colBad, ...slBif.colBad]);

    let successCode = "M";
    const matrixMap: any = {
        'Education': EDU_SUCCESS_MATRIX,
        'Marriage': MARRIAGE_SUCCESS_MATRIX,
        'Child Birth': CHILD_BIRTH_SUCCESS_MATRIX,
        'Health': HEALTH_SUCCESS_MATRIX,
        'Job': JOB_SUCCESS_MATRIX,
        'Business': JOB_SUCCESS_MATRIX,
        'Travel': JOB_SUCCESS_MATRIX,
        'Property & Vehicle': JOB_SUCCESS_MATRIX
    };
    const activeMatrix = matrixMap[area] || JOB_SUCCESS_MATRIX;
    successCode = activeMatrix[slHit]?.[nlHit] || "M";

    let indication = "";
    let expenseIndication = ""; // Specifically for Job
    if (area === 'Education') {
        const greenCount = Array.from(comboGoodSet).filter(h => ![1, 5, 7].includes(h)).length;
        indication = greenCount > 3 ? "Very High" : greenCount === 3 ? "High" : greenCount === 2 ? "Medium" : "Low";
    } else if (area === 'Marriage') {
        if (checkSubset(allHousesSet, MARRIAGE_GOOD_VERY_GOOD)) indication = "Very Good";
        else if (checkSubset(allHousesSet, MARRIAGE_GOOD_GOOD)) indication = "Good";
        else if (checkSubset(allHousesSet, MARRIAGE_GOOD_MEDIUM)) indication = "Medium";
        else if (checkSubset(allHousesSet, MARRIAGE_GOOD_LOW)) indication = "Low";
        else indication = "No Indication";
    } else if (area === 'Child Birth') {
        if (checkSubset(allHousesSet, CHILD_BIRTH_VERY_HIGH)) indication = "Very Good";
        else if (checkSubset(allHousesSet, CHILD_BIRTH_HIGH)) indication = "Good";
        else if (checkSubset(allHousesSet, CHILD_BIRTH_MEDIUM)) indication = "Medium";
        else if (allHousesSet.has(9) && (allHousesSet.has(2) || allHousesSet.has(5))) indication = "Medium";
        else if (checkSubset(allHousesSet, CHILD_BIRTH_BAD)) indication = "Bad / No Indication";
        else indication = "Low";
    } else if (area === 'Health') {
        if (checkSubset(allHousesSet, HEALTH_GOOD_HIGH)) indication = "High";
        else if (checkSubset(allHousesSet, HEALTH_GOOD_MEDIUM)) indication = "Medium";
        else if (checkSubset(allHousesSet, HEALTH_GOOD_LOW)) indication = "Low";
        else indication = "No Indication";
    } else if (area === 'Travel') {
        if (checkSubset(allHousesSet, TRAVEL_ABROAD_VERY_HIGH)) indication = "Abroad: VERY HIGH";
        else if (checkSubset(allHousesSet, TRAVEL_ABROAD_HIGH)) indication = "Abroad: HIGH";
        else if (checkSubset(allHousesSet, TRAVEL_ABROAD_MEDIUM)) indication = "Abroad: MEDIUM";
        else if (checkSubset(allHousesSet, TRAVEL_HOME_VERY_HIGH)) indication = "Home: VERY HIGH";
        else indication = "Low";
    } else {
        // Job / Business / Property
        if (checkSubset(comboGoodSet, JOB_GOOD_A_PLUS)) indication = "Very High";
        else if (checkSubset(comboGoodSet, JOB_GOOD_A)) indication = "High";
        else if (checkSubset(comboGoodSet, JOB_GOOD_B)) indication = "Medium";
        else indication = "Low";

        if (checkSubset(comboBadSet, JOB_BAD_01)) expenseIndication = "High Loss";
        else if (checkSubset(comboBadSet, JOB_BAD_02)) expenseIndication = "Medium Loss";
        else expenseIndication = "Low Loss";
    }

    const profMap: any = {
        'Education': EDU_PROFESSION_MAP,
        'Marriage': MARRIAGE_RESULT_MAP,
        'Child Birth': CHILD_BIRTH_RESULT_MAP,
        'Health': HEALTH_RESULT_MAP,
        'Job': JOB_PROFESSION_MAP,
        'Business': JOB_PROFESSION_MAP,
        'Travel': JOB_PROFESSION_MAP,
        'Property & Vehicle': JOB_PROFESSION_MAP
    };
    const activeProfMap = profMap[area] || JOB_PROFESSION_MAP;

    const nlFindings = activeProfMap[nlHit] || "";
    const slFindings = activeProfMap[slHit] || "";

    // Detailed Reasoning
    let reason = "";
    if (slHit === 8 || slHit === 12) {
        reason = `Sub Lord ${planetData.sub_lord} is in house ${slHit}, which causes obstacles and delays.`;
    } else if (slHit === 5 || slHit === 6) {
        reason = `Sub Lord ${planetData.sub_lord} in house ${slHit} indicates focus on service or emotional factors over direct success.`;
    } else if (slHit === 11 || slHit === 10 || slHit === 2) {
        reason = `Sub Lord ${planetData.sub_lord} in house ${slHit} is extremely favorable for gains and authoritative success.`;
    }

    // Remedies
    const targetPlanets = [];
    if (nlHit === 8 || nlHit === 12) targetPlanets.push(planetData.star_lord);
    if (slHit === 8 || slHit === 12) targetPlanets.push(planetData.sub_lord);
    
    const remedies = targetPlanets.map(p => {
        const d = DONATION_MAP[p.toUpperCase()];
        return d ? `${p}: Donate ${d.item} on ${d.day} between ${d.time}` : null;
    }).filter(Boolean);

    return {
        planet: planetName,
        pl: planetData.planet,
        nl: planetData.star_lord,
        sl: planetData.sub_lord,
        goodHouses: Array.from(comboGoodSet).sort((a,b) => a-b),
        badHouses: Array.from(comboBadSet).sort((a,b) => a-b),
        combination: `${Array.from(comboGoodSet).sort((a,b) => a-b).join(',')} / ${Array.from(comboBadSet).sort((a,b) => a-b).join(',')}`,
        indicationValue: indication,
        expenseValue: expenseIndication,
        successRate: getSuccessLabel(successCode),
        detailedFindings: `NL: ${nlFindings}\nSL: ${slFindings}`,
        reasoning: reason,
        remedies: remedies,
        notes: (area === 'Job' && (successCode.startsWith('B') || successCode.startsWith('VB'))) ? "Good in Medicine, Abroad, Software, any Business without investments, Astrology, Technology" : ""
    };
}
