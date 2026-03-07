export interface BirthDetails {
    name?: string;
    gender?: 'Male' | 'Female' | 'Others';
    date_of_birth: string;
    time_of_birth: string;
    timezone: string;
    latitude: number;
    longitude: number;
    place?: string;
    ayanamsa?: string; // Added ayanamsa
    horary_number?: number; // Added for Prashna
}

export interface CalculationSettings {
    ayanamsa: string;
    house_system: string;
    node_type: string;
}

export interface KundliRequest {
    birth_details: BirthDetails;
    calculation_settings: CalculationSettings;
    horary_number?: number;
}

export interface House {
    house_number: number;
    cusp_degree_dms: string;
    degree_dms?: string; // Optional for compatibility
    sign: string;
    sign_lord: string;
    star_lord: string;
    sub_lord: string;
    sub_sub_lord: string;
    planet_lord: string;
    nakshatra: string;
    nadi: string;
    cusp_degree_decimal?: number;
}

export interface ChartPlanet {
    name: string;
    isRetro: boolean;
    isCombust?: boolean;
    isCusp?: boolean;
    subScript?: string;
    color?: string;
}

export interface Ascendant {
    degree_dms: string;
    sign: string;
    sign_lord: string;
    star_lord: string;
    sub_lord: string;
    sub_sub_lord: string;
    planet_lord: string;
    nakshatra: string;
    nadi: string;
    degree_decimal?: number;
}

export interface Planet {
    planet: string;
    degree_dms: string;
    sign: string;
    house_placed: number;
    sign_lord: string; // Added
    star_lord: string;
    sub_lord: string;
    sub_sub_lord: string;
    planet_lord: string;
    nakshatra: string;
    nadi: string;
    is_retrograde: boolean;
    is_combust: boolean;
    degree_decimal?: number;
}

export interface Signification {
    planet: string;
    total: number[];
    total_detailed?: HouseDetail[];
    agent?: string | null;
    levels: {
        L1: number[];
        L2: number[];
        L3: number[];
        L4: number[];
        is_self_strength: boolean;
        original?: {
            L1: number[];
            L2: number[];
            L3: number[];
            L4: number[];
        };
    };
}

export interface DashaSequenceItem {
    planet: string;
    start_date: string;
    end_date: string;
    label?: string; // D, B, A, P, S
    bukthis?: DashaSequenceItem[];
    antaras?: DashaSequenceItem[];
    pratyantars?: DashaSequenceItem[];
    sookshmas?: DashaSequenceItem[];
}

export interface HouseDetail {
    house: number;
    is_placed: boolean;
}

export interface Dasha {
    balance_at_birth: string;
    current_dasha: string;
    current_bukthi: string;
    current_antara: string;
    current_pratyantar?: string;
    current_sookshma?: string;
    mahadasha_sequence: DashaSequenceItem[];
}

export interface NakshatraNadiItem {
    planet: string;
    nakshatra_name: string;
    is_retrograde: boolean;
    is_combust?: boolean;
    pl_signified: HouseDetail[];
    star_lord: string;
    nl_signified: HouseDetail[];
    sub_lord: string;
    sl_signified: HouseDetail[];
    planet_lord?: string;
    dasha_role?: string;
}

export interface Aspect {
    planet: string;
    aspect: string;
    target: string;
    degree_diff: number;
}

export interface KundliResponse {
    status: 'success' | 'error';
    message?: string;
    metadata?: {
        ayanamsa: string;
        ayanamsa_value: string;
        janma_nakshatra: string;
        pada: number;
    };
    ascendant: Ascendant;
    houses: House[];
    planets: Planet[];
    significations: Signification[];
    nakshatra_nadi: NakshatraNadiItem[];
    dasha: Dasha;
    aspects: Aspect[];
}
