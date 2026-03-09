import React from 'react';
import { Sparkles, Info } from 'lucide-react';

interface Planet {
    planet: string;
    house: number;
    sign: string;
}

interface PhaladeepikaTableProps {
    planets: Planet[];
    houseLords: Record<number, string>;
    isDayBirth?: boolean;
    gender?: string;
}

const HOUSE_LORD_PLACEMENTS: Record<number, Record<number, string>> = {
  1: { 1: "Strong physique, courageous, self-reliant, long-lived and intelligent.", 2: "Wealthy, focusing on family assets, good speaker, and earns through own efforts.", 3: "Courageous, brave, risk-taker, but potential issues with siblings or relatives.", 4: "Attached to mother and home, earns through fixed assets or lands, respected.", 5: "Intelligent, creative, dear to the king (power), but may face first child issues.", 6: "Debt, diseases or enemies may persist. Skilled at problem solving. Hard worker.", 7: "Wife may be influential, extensive travels, potentially multiple marriages or relationships.", 8: "Deep interest in occult, transformations, but may face health or financial crises.", 9: "Highly fortunate, spiritual, wealthy, respected, and gains from father or teachers.", 10: "High status, fame, career success, and honored by the government.", 11: "Always enjoys gains, many friends, influential, and fulfills all desires.", 12: "Spends on charities, potential foreign residence, or interest in spiritual isolation." },
  2: { 1: "Earning through own intelligence, self-made wealth, but may be vocal or argumentative.", 2: "Highly prosperous, stable family business, good orator, and respected.", 3: "Wealth through communication, writing, or siblings. Bold and adventurous.", 4: "Ancestral wealth, gains through real estate or mother. Comfortable life.", 5: "Gains through speculation, children, or creative talents. Intelligent.", 6: "Fluctuating income, disputes over money, or earning through service/medicine.", 7: "Wealth through spouse or partnerships. Successful in foreign associations.", 8: "Sudden gains through inheritance or occult. Secret earnings.", 9: "Very fortunate, wealth from religious or higher education sources. Divine grace.", 10: "Wealth through public status, government, or high-level administration.", 11: "Fulfilled desires, high monetary gains, and wealthy social circle.", 12: "Expenditure exceeds income, potential travel abroad for work, or losses." },
  3: { 1: "Self-reliant, courageous, skilled and their communication shapes their identity.", 2: "Wealthy and powerful through own efforts. Younger siblings may live far away.", 3: "Bold, risk-taking, effective communication, and a strong bond with siblings.", 4: "Skills are developed in privacy of home. Business from home. Connected emotions.", 5: "Happiness from children and siblings (if unafflicted). Creative intelligence.", 6: "Lack of courage, prone to anger, inimical to siblings. Tough character.", 7: "Wife may be beautiful or a foreigner. Success in foreign lands. Sensual.", 8: "Transformation through struggles. Potential for sudden changes in life.", 9: "Gains through younger siblings. Fortunate wife. Spiritual and well-behaved.", 10: "Goodwill of government. Career involving communication or writing. Fame.", 11: "Highly courageous. Profit from trading. Fulfills desires through bold actions.", 12: "Gains through spouse. If weak, losses due to siblings or fathers." },
  4: { 1: "Endowed with learning, maternal happiness, lands, and vehicles. Healthy mindset.", 2: "Enjoying luxuries, family honor, and earning through education and intelligence.", 3: "Valorous, charitable, but potentially residing away from mother or homeland.", 4: "High status, minister-like qualities, skillful, virtuous, and happy at home.", 5: "Devoted, virtuous, finding peace through creativity, sports, and children.", 6: "Decline of maternal happiness. Hurdles in acquiring home. Good for medical field.", 7: "Establishment of property after marriage. High degree of education.", 8: "Ups and downs in domestic comfort. Secretive person. Potential inheritance.", 9: "Blessed with fortune, dharmic mother, and success in higher education.", 10: "Royal honors, career success, and authority among people of homeland.", 11: "Gains through real estate or mother. Conveniences from large organizations.", 12: "Comfort found in spiritual places or far from home. Potential loss of property." },
  5: { 1: "Intelligent, charismatic, with strong self-expression. High status or judge.", 2: "Blessed with good family and children. Gains from government. Astrological talent.", 3: "Many siblings, courageous, and children achieving great success.", 4: "Advisor or teacher. Long life for mother. Spiritual knowledge.", 5: "Expert in mantra/mathematics. Many children. Religious leadership.", 6: "Struggles with children. Struggles in education. Karmic obstacles.", 7: "Rich, influential, learned. Gains fame through arts. High commitment in love.", 8: "Occult knowledge. Sudden changes in progeny matters. Spiritual research.", 9: "Auspicious wealth, good children, and deep faith in God. Teacher or guru.", 10: "Powerful Raja Yoga. Alliances with powerful people. Gains in professional life.", 11: "Learned, helpful, and wealthy. Gains through sons and creative works.", 12: "Pious life, search for truth, moksha. Success in foreign education." },
  6: { 1: "Inimical to own people, but rich and famous. Career in law or medicine.", 2: "Loss of wealth due to foes. Cunning but skillful speaker. Foreign residence.", 3: "Hostile towards brothers. Lack of courage. Issues with domestic help.", 4: "Conflict with mother. Problems with property or education. Menial jobs if weak.", 5: "Discord with children. Fluctuating finances. Potential adoption case.", 6: "Wealthy, strong, defeat enemies. Maternal uncle may be famous.", 7: "Challenges in marriage happiness. Famous but potentially separated from spouse.", 8: "Sickly, inimical, desire for others' wealth. Potential unfaithfulness.", 9: "Conflicts with father. Benefiting from paternal cousins. Judicial career.", 10: "Not respectful to father. Gifted speaker. Selfish but famous.", 11: "Gains through enemies. Adventurous. Elder brother may be in authority.", 12: "Frugal, happy, independent. Vimala Yoga if well placed. Fights adversaries." },
  7: { 1: "Marriage significantly shapes identity. Possible marital issues if afflicted.", 2: "Spouse impacts finances. Wealth acquisition through spouse or family business.", 3: "Intellectual or multicultural spouse. Gains through partnerships and travel.", 4: "Marital happiness, spouse manages household effectively. Property gains.", 5: "Possible love marriage. Intelligence, wealth, but potential issues with progeny.", 6: "Challenges in marital harmony. Possible ill health for spouse or distance.", 7: "Strong, harmonious marital life. Good understanding and social reputation.", 8: "Profound life transformations through spouse. Possible secret or mystical spouse.", 9: "Spouse brings extensive good luck. Success in higher education and travel.", 10: "Influential and supportive spouse who aids in career and public status.", 11: "Gains and affluence through spouse. Prosperous and social marital life.", 12: "Marital struggles or distance. Possible financial losses through partnerships." },
  8: { 1: "Frequent changes in health and fortune. Interest in secret knowledge.", 2: "Fluctuating wealth. Sudden gains or losses through inheritance/occult.", 3: "Struggles with willpower. Challenges with siblings or near relatives.", 4: "Domestic instability. Emotional ups and downs related to home or mother.", 5: "Speculative gains. Secretive children. Deep interest in spiritual research.", 6: "Strength to overcome adversaries. Possible chronic health issues.", 7: "Marriage brings major transformations. Challenges in initial partnership.", 8: "Longevity, fearless nature. Sudden unexpected events shape the life path.", 9: "Issues with traditional faith or father. Possible inheritance from father.", 10: "Professional setbacks or career in research/occult. Success through mystery.", 11: "Prosperity comes late in life. Good for longevity and secret gains.", 12: "High expenditure on health or spiritual retreats. Foreign connections." },
  9: { 1: "Fortunate, religious, attractive, and highly educated. Respected by all.", 2: "Financial prosperity, scholarly, happy family life, and virtuous children.", 3: "Property struggles. Fortune may be hindered by siblings or distance.", 4: "Happiness from mother, property gains, and success in homeland.", 5: "Excellent education, lucky children, and religious leadership roles.", 6: "Obstacles in fortune. Path to success involves service and hard work.", 7: "Financial and social gains after marriage. Reputed spouse.", 8: "Deep transformation through spirituality or research. Gains from occult.", 9: "Highly fortunate, virtuous, religious leader, and very wealthy.", 10: "King-like status, career authority, and respected by the government.", 11: "Consistent financial growth, skillful, and fulfills all high ambitions.", 12: "Spiritual liberation (Moksha), material struggles but lucky for isolation." },
  10: { 1: "Career is central to identity. Scholarly, famous, and self-made success.", 2: "Wealthy, virtuous, royal honors, and gains through family assets.", 3: "Success through communication, brave siblings, and virtuous actions.", 4: "Landed property, happiness from mother, and powerful domestic base.", 5: "Happiness from children, learning, and success in consultancy/advisory.", 6: "Routine-based career. Success through resolving conflicts or in medicine.", 7: "Successful business partnerships. Supportive and influential spouse.", 8: "Unstable career with sudden shifts. Interest in hidden or research paths.", 9: "Success in foreign lands, high learning, and luck in professional authority.", 10: "Very skillful, truthful, high status, and honored for professional work.", 11: "Profit from career and business. Elder siblings guide the professional path.", 12: "Career in isolation or foreign lands. Risk of business losses if weak." },
  11: { 1: "Born into wealth or influential social circle. Many desires fulfilled.", 2: "Success in banking or business. Profits from friends and family assets.", 3: "Gains through skills, music, or siblings. Help from social network.", 4: "Profits from land, rentals, and mother's assets. Renowned learner.", 5: "Gains through arts, creativity, or children. Learned and helpful nature.", 6: "Obstacles to gains. Potential health issues impacting financial goals.", 7: "Gains through life partners or successful business alliances.", 8: "Hidden gains or inheritance. Resilience in overcoming miseries.", 9: "Lucky, religious, charitable, and honored by the state for good work.", 10: "Professional success leads to wealth. Fulfillment of dreams via career.", 11: "Long life, happy family, and consistently high social standing.", 12: "Expenses on friends or social causes. Gains from foreign sources." },
  12: { 1: "Prone to expenditure and travel. Focus on spirituality or isolation.", 2: "Savings may be difficult. Interest in foreign languages and food travel.", 3: "Expenses on creative travel or short journeys. Possible sibling issues.", 4: "Losses in property or distance from mother. Focus on internal peace.", 5: "Challenges in formal education or progeny matters. Spiritual children.", 6: "Health issues or visible social role in curing/resolving conflicts.", 7: "Martyr-like devotion to spouse. Possible challenges in partnerships.", 8: "Long life but many transformations. Interest in magical or occult arts.", 9: "Gains and luck in foreign journeys. Expenditure on religious deeds.", 10: "Professional success in isolation or foreign trades. Possible setbacks.", 11: "Expenditure on friends. Prosperity through distant lands or secrets.", 12: "Success in meditation, spiritual liberation, and auspicious spending." }
};

const CONJUNCTIONS: Record<string, string> = {
  "Sun-Moon": "Skilled in machinery, stone-work, and bold in actions.",
  "Sun-Mars": "Brave, but inclined towards harsh deeds or impetuous nature.",
  "Sun-Mercury": "Budha-Aditya Yoga: Intelligent, famous, happy and clever in speech.",
  "Sun-Jupiter": "Cruel, interested in performing religious rites or helping others.",
  "Sun-Venus": "Earning through stage, art, or use of weapons. Luxurious.",
  "Sun-Saturn": "Clever in work involving metals, lead or pottery. Hard worker.",
  "Moon-Mars": "Skilled in dealing with rough instruments, disobedient to mother (sometimes).",
  "Moon-Mercury": "Sweet and modest speech, clever, intelligent and highly fortunate.",
  "Moon-Jupiter": "Gajakesari Yoga: Energetic, wealthy, intelligent and famous.",
  "Moon-Venus": "Artistic expertise, luxurious life, and attractive personality.",
  "Moon-Saturn": "Miserly, potentially prone to mood swings or deep discipline.",
  "Mars-Mercury": "Expert in arts, crafts, and skilled in communication or strategy.",
  "Mars-Jupiter": "Leader, commander, or respected official. Bold and virtuous.",
  "Mars-Venus": "Strong passions, success in partnerships, and artistic flair.",
  "Mars-Saturn": "Strong/Tough character, potentially argumentative but very disciplined.",
  "Mercury-Jupiter": "Learned, wise, eloquent, and respected by the government.",
  "Mercury-Venus": "Eloquent speaker, talented artist, and enjoying all comforts.",
  "Mercury-Saturn": "Skilled in arts involving structure, metals, or old artifacts.",
  "Jupiter-Venus": "Very wealthy, learned, and enjoying high status and luxuries.",
  "Jupiter-Saturn": "Respected, conservative, but potentially achieving high status late in life.",
  "Venus-Saturn": "Successful in business, potentially through old methods or structured arts.",
  "Mars-Rahu": "Angarak Yoga: Prone to sudden anger, courage but potentially impulsive.",
  "Jupiter-Rahu": "Guru-Chandala Yoga: Unconventional wisdom, struggles with traditional authorities.",
  "Sun-Rahu": "Grahan influence: Challenges with authority or ego.",
  "Moon-Rahu": "Grahan influence: Emotional sensitivity, artistic imagination.",
  "Saturn-Rahu": "Shrapit influence: Hard work required, success through foreign means.",
  "Sun-Ketu": "Spiritual inclination, aloofness from worldly power.",
  "Moon-Ketu": "High intuition, detachment from emotional bonds.",
  "Mars-Ketu": "Sharp intellect, technical skill.",
  "Jupiter-Ketu": "Deeply spiritual, philosophical wisdom.",
  "Venus-Ketu": "Artistic creativity through intuition.",
  "Sun-Moon-Mars": "Courageous, wealth through difficult tasks, energetic personality.",
  "Sun-Moon-Mercury": "Highly intelligent, skillful in many arts, eloquent speaker.",
  "Sun-Moon-Jupiter": "Famous, wealthy, respected by authorities, religious nature.",
  "Sun-Moon-Venus": "Successful in artistic fields, attractive, enjoying life high status.",
  "Sun-Moon-Saturn": "Reserved nature, disciplined, gains through perseverance.",
  "Sun-Mars-Mercury": "Great prowess, expert in strategy and communication.",
  "Sun-Mars-Jupiter": "Strong leader, victorious over enemies, commanding presence.",
  "Sun-Mars-Venus": "Passionate, successful in ventures, social fame.",
  "Sun-Mars-Saturn": "Tough disposition, authority through struggle, resilience.",
  "Sun-Mercury-Jupiter": "Scholarly, wise advisor, favored by the government.",
  "Sun-Mercury-Venus": "Polite, artistic, wealthy and respected in society.",
  "Sun-Mercury-Saturn": "Deep thinker, successful in technical or hidden knowledge.",
  "Sun-Jupiter-Venus": "Extremely fortunate, wealthy, and enjoying royal or high status.",
  "Sun-Jupiter-Saturn": "Conservative authority, respected for wisdom and longevity of work.",
  "Sun-Venus-Saturn": "Successful in architecture or arts involving structure.",
  "Moon-Mars-Mercury": "Quick witted, skilled with hands, adventurous.",
  "Moon-Mars-Jupiter": "Energetic leader, protective, wealthy and brave.",
  "Moon-Mars-Venus": "Romantic, successful in arts/partnerships, emotive.",
  "Moon-Mars-Saturn": "Emotionally disciplined, hardworking, potentially stern.",
  "Moon-Mercury-Jupiter": "Learned, virtuous, teacher or advisor, wealthy.",
  "Moon-Mercury-Venus": "Eloquent, artistic, beautiful and enjoying comforts.",
  "Moon-Mercury-Saturn": "Logical, disciplined mind, successful in research.",
  "Moon-Jupiter-Venus": "Blessed with children, wealth and long-lasting fame.",
  "Moon-Jupiter-Saturn": "Steady mind, respected family life, deep spiritual roots.",
  "Moon-Venus-Saturn": "Gains through spouse or artistic legacy, structured life.",
  "Mars-Mercury-Jupiter": "Gifted speaker, strategic mind, honored by society.",
  "Mars-Mercury-Venus": "Skilled in music or fine arts, popular and wealthy.",
  "Mars-Mercury-Saturn": "Highly disciplined skill, technical expertise, determined.",
  "Mars-Jupiter-Venus": "High command, wealthy, successful in all undertakings.",
  "Mars-Jupiter-Saturn": "Commanding respect, disciplined leader, strong principles.",
  "Mars-Venus-Saturn": "Steady partnerships, success in luxury or construction business.",
  "Mercury-Jupiter-Venus": "Wise, wealthy, eloquent and enjoying divine grace.",
  "Mercury-Jupiter-Saturn": "High learning, structural wisdom, administrative success.",
  "Mercury-Venus-Saturn": "Successful in business involving arts, design or high-end items.",
  "Jupiter-Venus-Saturn": "Enduring wealth, high reputation, and spiritual depth."
};

// VERSION 1.1.2 - FORCE UPDATE CACHE
const PhaladeepikaTable: React.FC<PhaladeepikaTableProps> = ({ planets, houseLords, isDayBirth, gender }) => {
    const getAdvancedAnalysis = () => {
        const specialYogas: { name: string; effect: string }[] = [];
        const lordPlacements: { planet: string; lordOf: number; placedIn: number; result: string; aspects: string[] }[] = [];
        const conjunctions: { planets: string[]; result: string }[] = [];

        const moon = planets.find(p => p.planet === 'Moon');
        const sun = planets.find(p => p.planet === 'Sun');

        // Helper: Calculate Aspects (Drishti)
        const getPlanetsAspectingHouse = (targetHouse: number) => {
          const aspecting: { planet: string; type: 'benefic' | 'malefic' }[] = [];
          
          planets.forEach(p => {
            const h = p.house;
            const diff = (targetHouse - h + 12) % 12 + 1;
            
            let hasAspect = false;
            // All planets aspect 7th
            if (diff === 7) hasAspect = true;
            // Mars 4, 8
            if (p.planet === 'Mars' && (diff === 4 || diff === 8)) hasAspect = true;
            // Jupiter 5, 9
            if (p.planet === 'Jupiter' && (diff === 5 || diff === 9)) hasAspect = true;
            // Saturn 3, 10
            if (p.planet === 'Saturn' && (diff === 3 || diff === 10)) hasAspect = true;

            if (hasAspect) {
              const isBenefic = ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.planet);
              aspecting.push({ planet: p.planet, type: isBenefic ? 'benefic' : 'malefic' });
            }
          });
          return aspecting;
        };

        // 1. House Lord Placement Analysis + Aspects
        Object.entries(houseLords).forEach(([houseNum, ruler]) => {
            const hNum = parseInt(houseNum);
            const p = planets.find(planet => planet.planet === ruler);
            if (p) {
                const resultsForLord = HOUSE_LORD_PLACEMENTS[hNum];
                let baseResult = resultsForLord ? (resultsForLord[p.house] || `Lord of ${hNum} in ${p.house} house brings specific results as per lordship.`) : null;
                
                if (baseResult) {
                  const aspects = getPlanetsAspectingHouse(p.house);
                  let finalResult = baseResult;
                  
                  // Synthesize Aspects
                  if (aspects.length > 0) {
                    const beneficAspects = aspects.filter(a => a.type === 'benefic').map(a => a.planet);
                    const maleficAspects = aspects.filter(a => a.type === 'malefic').map(a => a.planet);
                    
                    if (beneficAspects.length > 0) {
                      finalResult += ` Benefic influence from ${beneficAspects.join(' and ')}'s aspect adds grace and removes obstacles.`;
                    }
                    if (maleficAspects.length > 0) {
                      finalResult += ` Aspect of ${maleficAspects.join(' and ')} may bring challenges or require hard work to achieve success.`;
                    }
                  }

                  lordPlacements.push({ 
                    planet: p.planet, 
                    lordOf: hNum, 
                    placedIn: p.house, 
                    result: finalResult,
                    aspects: aspects.map(a => a.planet)
                  });
                }
            }
        });

        // 2. Conjunction Analysis
        const houseGroups: Record<number, string[]> = {};
        planets.forEach(p => {
          if (!houseGroups[p.house]) houseGroups[p.house] = [];
          houseGroups[p.house].push(p.planet);
        });

        Object.values(houseGroups).forEach(group => {
          if (group.length >= 2) {
            // Helper to get normalized map key for any set of planets
            const getBestMatch = (planetList: string[]) => {
              const sorted = [...planetList].sort();
              // Check exact sorted key (e.g., "Moon-Sun" alphabetically)
              const key = sorted.join('-');
              for (const mapKey of Object.keys(CONJUNCTIONS)) {
                const mapKeySorted = mapKey.split('-').sort().join('-');
                if (key.toLowerCase() === mapKeySorted.toLowerCase()) return CONJUNCTIONS[mapKey];
              }
              return null;
            };

            // 1. Check for 3+ Planet Conjunctions first
            if (group.length >= 3) {
              for (let i = 0; i < group.length; i++) {
                for (let j = i + 1; j < group.length; j++) {
                  for (let k = j + 1; k < group.length; k++) {
                    const triple = [group[i], group[j], group[k]];
                    const result = getBestMatch(triple);
                    if (result) {
                      conjunctions.push({ planets: triple, result });
                    }
                  }
                }
              }
            }

            // 2. Pairwise Conjunctions (only if not already partly covered by a larger grouping or as fallback)
            for (let i = 0; i < group.length; i++) {
              for (let j = i + 1; j < group.length; j++) {
                const pair = [group[i], group[j]];
                const result = getBestMatch(pair);
                if (result) {
                  const alreadyReportedInTriple = conjunctions.some(c => 
                    c.planets.length >= 3 && 
                    c.planets.includes(group[i]) && 
                    c.planets.includes(group[j])
                  );
                  if (!alreadyReportedInTriple) {
                    conjunctions.push({ planets: pair, result });
                  }
                }
              }
            }
          }
        });

        // 3. EXPANDED YOGA DETECTION
        // 1. MAHAPURUSHA YOGA
        const MAHAPURUSHA = {
            'Mars': { sign: ['Aries', 'Scorpio', 'Capricorn'], name: 'Ruchaka Yoga', effect: 'Bold, victorious, and commanding.' },
            'Mercury': { sign: ['Gemini', 'Virgo'], name: 'Bhadra Yoga', effect: 'Eloquence, long life, and keen intellect.' },
            'Jupiter': { sign: ['Sagittarius', 'Pisces', 'Cancer'], name: 'Hamsa Yoga', effect: 'Handsome, respected, and high-minded.' },
            'Venus': { sign: ['Taurus', 'Libra', 'Pisces'], name: 'Malavya Yoga', effect: 'Attractive, successful, and artistic.' },
            'Saturn': { sign: ['Capricorn', 'Aquarius', 'Libra'], name: 'Sasa Yoga', effect: 'Commanding, wise, and high status.' }
        };
        planets.forEach(p => {
            const yoga = MAHAPURUSHA[p.planet as keyof typeof MAHAPURUSHA];
            if (yoga && yoga.sign.includes(p.sign) && [1, 4, 7, 10].includes(p.house)) {
                specialYogas.push({ name: yoga.name, effect: yoga.effect });
            }
        });

        // 2. LUNAR YOGAS
        if (moon) {
            const pIn2FromMoon = planets.filter(p => p.planet !== 'Moon' && p.planet !== 'Sun' && p.planet !== 'Rahu' && p.planet !== 'Ketu' && (p.house === (moon.house % 12 + 1)));
            const pIn12FromMoon = planets.filter(p => p.planet !== 'Moon' && p.planet !== 'Sun' && p.planet !== 'Rahu' && p.planet !== 'Ketu' && (p.house === ((moon.house - 2 + 12) % 12 + 1)));

            if (pIn2FromMoon.length > 0 && pIn12FromMoon.length === 0) {
                specialYogas.push({ name: 'Sunapha Yoga', effect: 'Wealthy, intelligent, and famous. Enjoys royal status.' });
            } else if (pIn12FromMoon.length > 0 && pIn2FromMoon.length === 0) {
                specialYogas.push({ name: 'Anapha Yoga', effect: 'Polite, generous, handsome, and enjoying physical comforts.' });
            } else if (pIn2FromMoon.length > 0 && pIn12FromMoon.length > 0) {
                specialYogas.push({ name: 'Durudhara Yoga', effect: 'Very wealthy, powerful, and possessing all luxuries.' });
            } else if (pIn2FromMoon.length === 0 && pIn12FromMoon.length === 0) {
                const isCancelled = planets.some(p => p.planet !== 'Moon' && [1, 4, 7, 10].includes(p.house));
                if (!isCancelled) specialYogas.push({ name: 'Kemadruma Yoga', effect: 'Struggles with wealth and support. Found mostly in isolation.' });
            }

            // Gaja Kesari
            const jupiter = planets.find(p => p.planet === 'Jupiter');
            if (jupiter) {
                const angle = (jupiter.house - moon.house + 12) % 12;
                if ([0, 3, 6, 9].includes(angle)) {
                    specialYogas.push({ name: 'Gaja Kesari Yoga', effect: 'Overpowers enemies, eloquent speaker, and long-lived.' });
                }
            }
        }

        // 3. SOLAR YOGAS
        if (sun) {
            const pIn2FromSun = planets.filter(p => p.planet !== 'Sun' && p.planet !== 'Moon' && p.planet !== 'Rahu' && p.planet !== 'Ketu' && (p.house === (sun.house % 12 + 1)));
            const pIn12FromSun = planets.filter(p => p.planet !== 'Sun' && p.planet !== 'Moon' && p.planet !== 'Rahu' && p.planet !== 'Ketu' && (p.house === ((sun.house - 2 + 12) % 12 + 1)));

            if (pIn2FromSun.length > 0 && pIn12FromSun.length === 0) {
                specialYogas.push({ name: 'Veshi Yoga', effect: 'Helpful, famous, and industrious. Respected by society.' });
            } else if (pIn12FromSun.length > 0 && pIn2FromSun.length === 0) {
                specialYogas.push({ name: 'Vashi Yoga', effect: 'Virtuous, learned, and potentially residing far from birthplace.' });
            } else if (pIn2FromSun.length > 0 && pIn12FromSun.length > 0) {
                specialYogas.push({ name: 'Ubhayachari Yoga', effect: 'A balanced personality, wealthy and traveling extensively.' });
            }
        }

        // 4. SPECIFIC RAJA YOGAS (Kendra-Trikona Relations)
        const kendras = [1, 4, 7, 10];
        const trikonas = [5, 9, 1]; // 1 is both
        
        kendras.forEach(k => {
            trikonas.forEach(t => {
                if (k === t) return;
                const lordK = houseLords[k];
                const lordT = houseLords[t];
                const pK = planets.find(p => p.planet === lordK);
                const pT = planets.find(p => p.planet === lordT);
                
                if (lordK && lordT && pK && pT) {
                    // 1. Conjunction
                    const isConjunct = pK.house === pT.house;
                    // 2. Mutual Aspect (roughly check if 7 houses apart)
                    const isAspecting = (pK.house - pT.house + 12) % 12 === 6;
                    // 3. Exchange (Parivartana)
                    const isExchange = pK.house === t && pT.house === k;

                    if (isConjunct || isAspecting || isExchange) {
                        let yogaName = 'Kendra-Trikona Raja Yoga';
                        if ((k === 9 && t === 10) || (k === 10 && t === 9)) {
                            yogaName = 'Dharma Karmadhipati Yoga';
                        }
                        
                        const alreadyAdded = specialYogas.some(y => y.name === yogaName);
                        if (!alreadyAdded) {
                            specialYogas.push({ 
                                name: yogaName, 
                                effect: `Lord of ${k} (Kendra) and ${t} (Trikona) relating brings high status, power, and prosperity.` 
                            });
                        }
                    }
                }
            });
        });

        // 5. VIPAREETA RAJA YOGAS
        const dusthanaLords = [6, 8, 12];
        dusthanaLords.forEach(houseNum => {
            const lord = houseLords[houseNum];
            const p = planets.find(pl => pl.planet === lord);
            if (p && dusthanaLords.includes(p.house)) {
                if (houseNum === 6 && p.house === 6) {
                    specialYogas.push({ name: 'Harsha Yoga', effect: 'Health, wealth, happiness, and victory over enemies.' });
                } else if (houseNum === 8 && p.house === 8) {
                    specialYogas.push({ name: 'Sarala Yoga', effect: 'Long life, prosperity, learning, and success in ventures.' });
                } else if (houseNum === 12 && p.house === 12) {
                    specialYogas.push({ name: 'Vimala Yoga', effect: 'Noble character, wealth, and a happy, independent life.' });
                }
            }
        });

        // 6. DHANA YOGAS (Wealth)
        const lord2 = houseLords[2];
        const lord11 = houseLords[11];
        const p2 = planets.find(p => p.planet === lord2);
        const p11 = planets.find(p => p.planet === lord11);
        if (p2 && p11 && (p2.house === p11.house || p2.house === 11 || p11.house === 2)) {
          specialYogas.push({ name: 'Dhana Yoga', effect: 'Strong financial prosperity and accumulation of wealth.' });
        }

        // 7. MAHABHAGYA YOGA
        if (sun && moon) {
          const isOddSign = (sign: string) => ["Aries", "Gemini", "Leo", "Libra", "Sagittarius", "Aquarius"].includes(sign);
          if (gender === 'male' && isDayBirth && isOddSign(sun.sign) && isOddSign(moon.sign)) {
            specialYogas.push({ name: 'Mahabhagya Yoga', effect: 'Extraordinary fortune, prosperity, and high command.' });
          } else if (gender === 'female' && !isDayBirth && !isOddSign(sun.sign) && !isOddSign(moon.sign)) {
            specialYogas.push({ name: 'Mahabhagya Yoga', effect: 'Exceptional auspiciousness, wealth, and virtuous life.' });
          }
        }

        // 8. NEECHA BHANGA RAJA YOGA (Simplified)
        const DEBILITATION: Record<string, string> = {
            'Sun': 'Libra', 'Moon': 'Scorpio', 'Mars': 'Cancer', 'Mercury': 'Pisces',
            'Jupiter': 'Capricorn', 'Venus': 'Virgo', 'Saturn': 'Aries'
        };

        planets.forEach(p => {
            if (DEBILITATION[p.planet] === p.sign) {
                // Rule 1: Lord of debilitation sign (where p is) is in Kendra from Lagna
                const signLord = houseLords[p.house]; // Approximate for now
                const signLordPlanet = planets.find(pl => pl.planet === signLord);
                
                // Rule 2: Lord of the sign where the planet gets exalted (Rule check omitted for simplicity)
                
                if (signLordPlanet && [1, 4, 7, 10].includes(signLordPlanet.house)) {
                    specialYogas.push({ name: `Neecha Bhanga (${p.planet})`, effect: 'The debilitation is cancelled! This reversal creates a powerful Raja Yoga leading to high status through perseverance.' });
                }
            }
        });

        return { specialYogas, lordPlacements, conjunctions };
    };

    const { specialYogas, lordPlacements, conjunctions } = getAdvancedAnalysis();

    return (
        <div className="space-y-6" style={{ padding: '0.5rem', animation: 'fadeIn 0.5s ease' }}>
            <div style={{
                color: '#ef4444',
                fontWeight: 900,
                textAlign: 'center',
                padding: '1.25rem',
                fontSize: '1rem',
                border: '2px solid #fee2e2',
                borderRadius: '20px',
                background: '#fef2f2',
                textTransform: 'uppercase',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
                THIS PREDICTION IS VERY GENERAL PREDICTION FOR DEEP ANALYSIS USE KRISHNAMURTI PADDHATI (SLS) METHOD
            </div>
            {/* Header - Simplified & Cache-Busted */}
            <div style={{
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: '20px',
                border: '2px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
                <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '14px' }}>
                  <Sparkles className="text-amber-600" size={28} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>Astrological Analysis</h2>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, fontWeight: 500 }}>Vedic principles of Lords, Aspects (Drishti), and Yogas.</p>
                </div>
            </div>

            {/* Conjunctions */}
            {conjunctions.length > 0 && (
              <div className="space-y-4" style={{ 
                border: '2px solid #fbcfe8', 
                borderRadius: '16px', 
                padding: '1.25rem', 
                background: '#fff1f2',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Sparkles className="text-pink-600" size={24} />
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#9f1239', margin: 0 }}>Significant Conjunctions</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {conjunctions.map((cj, idx) => (
                      <div key={idx} style={{ background: 'white', borderRadius: '12px', border: '1px solid #fecdd3', borderLeft: '5px solid #e11d48', padding: '1rem' }}>
                        <div style={{ fontWeight: 900, color: '#e11d48', fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#e11d48', borderRadius: '50%' }}></div>
                          {cj.planets.map(p => p.toUpperCase()).join(' + ')}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#9f1239', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                          {cj.result}
                        </p>
                      </div>
                    ))}
                  </div>
              </div>
            )}

            {/* Yogas Detected */}
            {specialYogas.length > 0 && (
                <div className="space-y-4" style={{ 
                  border: '2px solid #3b82f6', 
                  borderRadius: '16px', 
                  padding: '1.25rem', 
                  background: '#f0f9ff',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sparkles className="text-blue-600" size={22} />
                        <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '1.2rem', fontWeight: 900 }}>Power Yogas Detected</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {specialYogas.map((yoga, idx) => (
                            <div key={idx} style={{ 
                              background: 'white', 
                              padding: '1.25rem', 
                              borderRadius: '12px', 
                              border: '1px solid #3b82f6',
                              borderBottom: '4px solid #3b82f6'
                            }}>
                                <div style={{ fontWeight: 900, color: '#1e40af', fontSize: '0.95rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  {yoga.name}
                                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#1e3a8a', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{yoga.effect}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* House Lord Analysis (Synthesized with Aspects) */}
            <div className="space-y-4" style={{ 
              border: '2px solid #e2e8f0', 
              borderRadius: '16px', 
              padding: '1.25rem', 
              background: '#f8fafc',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Info className="text-indigo-600" size={24} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>Lordship & Aspect Analysis</h3>
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {lordPlacements.map((lp, idx) => (
                    <div key={idx} style={{ 
                      background: 'white', 
                      borderRadius: '12px', 
                      border: '1px solid #cbd5e1', 
                      display: 'flex', 
                      overflow: 'hidden',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ 
                        background: '#eff6ff', 
                        width: '130px', 
                        padding: '12px', 
                        borderRight: '1px solid #cbd5e1',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>Lord of {lp.lordOf}</span>
                        <div style={{ background: '#1e40af', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 900, marginBottom: '2px' }}>{lp.planet}</div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1e40af' }}>In House {lp.placedIn}</span>
                      </div>
                      <div style={{ padding: '12px 16px', flex: 1 }}>
                        <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                          {lp.result}
                        </p>
                        {lp.aspects.length > 0 && (
                          <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                             {lp.aspects.map((a, i) => (
                               <span key={i} style={{ fontSize: '0.65rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, border: '1px solid #bae6fd' }}>
                                 Aspected by {a}
                               </span>
                             ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
            </div>

            <div style={{ 
                marginTop: '1.5rem', 
                padding: '1.25rem', 
                background: '#f8fafc', 
                borderRadius: '16px',
                border: '2px solid #cbd5e1',
                fontSize: '0.75rem',
                color: '#64748b',
                textAlign: 'center',
                fontWeight: 600,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                Vedic Astrology analysis synthesizing House Lordships, Conjunctions, and Aspects (Drishti) according to <i>Phaladeepika</i>.
            </div>
        </div>
    );
};

export default PhaladeepikaTable;
