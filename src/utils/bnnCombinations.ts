export interface BNNCombination {
    planets: string[]; // e.g. ["JUPITER", "SATURN", "SUN"]
    result: string;
}

export const BNN_JOB_COMBINATIONS: BNNCombination[] = [
    // Trios
    { planets: ["JUPITER", "SATURN", "SUN"], result: "High post in government - IAS, Minister, Mass leader." },
    { planets: ["MARS", "SATURN", "SUN"], result: "Government, Army." },
    { planets: ["SATURN", "SUN", "VENUS"], result: "High post – finance, Deal luxury items." },
    { planets: ["RAHU", "SATURN", "SUN"], result: "Police messenger." },
    { planets: ["KETU", "SATURN", "SUN"], result: "Success in Political field, Philosophy." },
    { planets: ["MOON", "SATURN", "SUN"], result: "Travels connect to government." },
    { planets: ["JUPITER", "MOON", "SATURN"], result: "Liquid, Food Transport." },
    { planets: ["MOON", "RAHU", "SATURN"], result: "Arts, Films, Digital." },
    { planets: ["KETU", "MOON", "SATURN"], result: "Healers, career in holy places" },
    { planets: ["RAHU", "SATURN", "VENUS"], result: "Magician, Musician." },
    { planets: ["KETU", "SATURN", "VENUS"], result: "Worshipper of goddess, Profession astrologer. In female chart - Break in career More." },
    { planets: ["JUPITER", "RAHU", "SATURN"], result: "Guru, Film Director" },
    { planets: ["JUPITER", "MARS", "MOON", "RAHU"], result: "CRIMINAL." },
    // Duos
    { planets: ["SATURN", "SUN"], result: "Administration work in any field, Troubled by govt., No satisfaction in job, Government work." },
    { planets: ["MOON", "SUN"], result: "Travels a lot in job." },
    { planets: ["MARS", "SUN"], result: "Father or himself in defense, Surgeons, Health related Job." },
    { planets: ["MERCURY", "SUN"], result: "Publisher, Book keeping, Accounting, Business Management, Native will become famous Wealth manager" },
    { planets: ["JUPITER", "SUN"], result: "Consultant, Speaker, Counselor, Minister." },
    { planets: ["SUN", "VENUS"], result: "Philosopher, Sales, Sports, Business Administrator." },
    { planets: ["RAHU", "SUN"], result: "Foreign job, Invention, Unusual job." },
    { planets: ["KETU", "SUN"], result: "Saints, Preacher’s, Spiritual healers, Native will become Famous." },
    { planets: ["MERCURY", "SATURN"], result: "Normal business, Commerce, Hardworking People." },
    { planets: ["JUPITER", "MARS"], result: "Short tempered, aggressive, reputed person" },
    { planets: ["JUPITER", "MERCURY"], result: "Land Lords and deals in it, Can write books." },
    { planets: ["JUPITER", "SATURN"], result: "Success in profession, Respectful Job, Will get jobs easily, cooperation of reputed people." },
    { planets: ["JUPITER", "RAHU"], result: "Working away from family." },
    { planets: ["MERCURY", "MOON"], result: "Software Engineer, Artist." },
    { planets: ["JUPITER", "MOON"], result: "Travels more and very good job." },
    { planets: ["MOON", "SATURN"], result: "Too much of expenses, mental stress, Native changes place in career, Marketing job, Travelling job, Lies in job, Related to liquid, Artistic, More transfers in job." },
    { planets: ["MARS", "SATURN"], result: "Hardship in life, Struggle to get a job, Changing jobs, No satisfaction in profession, Technical job" },
    { planets: ["MARS", "RAHU"], result: "Sports person" },
    { planets: ["MERCURY", "VENUS"], result: "Business, Real estate" },
    { planets: ["MERCURY", "RAHU"], result: "Occult science." },
    { planets: ["KETU", "VENUS"], result: "Breaks in income" },
    { planets: ["SATURN", "VENUS"], result: "Good earnings from work, good work environment." },
    { planets: ["RAHU", "SATURN"], result: "Lawyer, Work in big organization, Mostly working in night shift or works overnight more, Photography, Driving, Anti-social work." },
    { planets: ["KETU", "SATURN"], result: "Saint, Failure in high jobs, Spirituality, Visit holy places." },
    // Single
    { planets: ["SATURN"], result: "Normal job" }
];

export const BNN_WEALTH_COMBINATIONS: BNNCombination[] = [
    { planets: ["SUN", "VENUS"], result: "Money from father or Ancestral." },
    { planets: ["MOON", "VENUS"], result: "Loss of money, Too much of expenditure." },
    { planets: ["MERCURY", "VENUS"], result: "Good Money through his intelligence" },
    { planets: ["MARS", "VENUS"], result: "Hardship in earning or Saving." },
    { planets: ["JUPITER", "VENUS"], result: "Native will be wealthy, lucky, own house" },
    { planets: ["RAHU", "VENUS"], result: "Huge money." },
    { planets: ["KETU", "VENUS"], result: "Breaks in income or inconsistency in income." },
    { planets: ["SATURN", "VENUS"], result: "Good earnings from work, Delay in getting money." },
    { planets: ["JUPITER", "SUN"], result: "Great Wealth" },
    { planets: ["JUPITER", "KETU"], result: "Less Income, Stingy" },
    { planets: ["VENUS"], result: "Normal wealth" }
];

export const BNN_EDUCATION_COMBINATIONS: BNNCombination[] = [
    { planets: ["MERCURY", "SUN", "VENUS"], result: "Education connecting Agency Business." },
    { planets: ["MERCURY", "MOON", "VENUS"], result: "Banking, Real estate, Arts, Architecture, Hotels." },
    { planets: ["MARS", "MERCURY", "VENUS"], result: "Accounts, Agencies." },
    { planets: ["JUPITER", "MERCURY", "VENUS"], result: "MBA, Hotel Management, Knowledgeable in many field, Learns many subjects." },
    { planets: ["MERCURY", "SATURN", "VENUS"], result: "Commercial line, Business management." },
    { planets: ["MERCURY", "RAHU", "SATURN"], result: "Film industry studies or Cinematography, Computers, Photography." },
    { planets: ["JUPITER", "MARS", "MERCURY"], result: "Initial obstructions in Education, Mathematics, Surgery." },
    { planets: ["MARS", "MERCURY", "RAHU"], result: "Laziness, Breaks, Army training, Police training, Automobile, Motor or Vehicle repair studies." },
    { planets: ["KETU", "MARS", "MERCURY"], result: "Struggle in Education, Fashion or Garments Studies Machine Engineering." },
    { planets: ["KETU", "MERCURY", "SUN"], result: "Political studies, Textiles & wires related studies." },
    { planets: ["MARS", "MERCURY", "SUN"], result: "IAS studies, Engineer." },
    { planets: ["MERCURY", "MOON", "RAHU"], result: "Business, Accounts, Architects, Liquid or Petroleum" },
    { planets: ["KETU", "MERCURY", "MOON"], result: "Priest studies, Garments, Horticulture studies." },
    { planets: ["JUPITER", "KETU", "MERCURY"], result: "Priest studies, Law Studies." },
    { planets: ["KETU", "MERCURY", "VENUS"], result: "Related to Gynecology studies, Sociology" },
    { planets: ["JUPITER", "MERCURY", "SATURN"], result: "Teaching Studies, Medicine Learning." },
    { planets: ["MERCURY", "SUN"], result: "Intelligent and Educated." },
    { planets: ["MERCURY", "MOON"], result: "Artistic, Software Engineer or Technology." },
    { planets: ["MARS", "MERCURY"], result: "Native will have trouble in education, Technical or Mechanical Education." },
    { planets: ["JUPITER", "MERCURY"], result: "Brilliant, Highly Educated, Good Memory, Good Education, knowledgeable." },
    { planets: ["MERCURY", "VENUS"], result: "Architect, Creative ideas, Deals with luxury items." },
    { planets: ["MERCURY", "SATURN"], result: "Education hurdles and slow Education Commerce, Trade, Banking." },
    { planets: ["MERCURY", "RAHU"], result: "Computers, Abroad studies, Networking, Coding." },
    { planets: ["KETU", "MERCURY"], result: "Break in education or Confusion in education or Normal Studies, Astrology, Numerology, Research, Invention, Occult Science." },
    { planets: ["MERCURY"], result: "Normal Education." }
];

export const BNN_MARRIAGE_FEMALE_COMBINATIONS: BNNCombination[] = [
    { planets: ["MARS", "SUN", "MOON"], result: "Respectable Husband, gain through travel, proud man. Husband will be in reputed company" },
    { planets: ["MARS", "SUN", "MERCURY"], result: "From good family background, intelligent, business mind, respected" },
    { planets: ["MARS", "SUN", "JUPITER"], result: "Short tempered, enjoys good status, honor in society, Career in government, good looking, courageous" },
    { planets: ["MARS", "SUN", "VENUS"], result: "Respectable person, after marriage husband prospers, egoistic, Good family background, will have good patience, good speaker" },
    { planets: ["MARS", "SUN", "SATURN"], result: "Husband in good career, good earnings, happy life." },
    { planets: ["MARS", "SUN", "RAHU"], result: "Husband adamant, fair looking, husband will be a problem to his father or father in-law" },
    { planets: ["MARS", "SUN", "KETU"], result: "Inclined to spirituality, native should adjust with husband otherwise problems in family" },
    { planets: ["MARS", "MOON", "MERCURY"], result: "Will have travel career, good looking, food industries, artistic" },
    { planets: ["MARS", "MOON", "JUPITER"], result: "Will have artistic knowledge, prosperity after marriage, will change place, medical field, travels" },
    { planets: ["MARS", "MOON", "VENUS"], result: "Good person, intelligent, fortunate, artistic nature, architect, financier, Late marriage, misunderstanding in family, husband travels a lot" },
    { planets: ["MARS", "MOON", "SATURN"], result: "Good person, but gives up good opportunities, works in odd jobs" },
    { planets: ["MARS", "MOON", "RAHU"], result: "Husband good looking, artistic nature, will face water accidents, poor intelligence, late marriage, drinking habits" },
    { planets: ["MARS", "MOON", "KETU"], result: "Late marriage, life will not be that good" },
    { planets: ["MARS", "MERCURY", "JUPITER"], result: "Good education, respectable career, Business, social status" },
    { planets: ["MARS", "MERCURY", "VENUS"], result: "Adjustable person, good speaker and good wealth, Husband intelligent, but little quarrelsome" },
    { planets: ["MARS", "MERCURY", "SATURN"], result: "Intelligent person, will have many sources of income" },
    { planets: ["MARS", "MERCURY", "RAHU"], result: "Difficulty in marriage." },
    { planets: ["MARS", "MERCURY", "KETU"], result: "Will have love, break in affair then marriage" },
    { planets: ["MARS", "JUPITER", "VENUS"], result: "Intelligent, love’s his wife, good talker, good status, Husband good administrator" },
    { planets: ["MARS", "JUPITER", "SATURN"], result: "Respectable person, adjustable person, affectionate" },
    { planets: ["MARS", "JUPITER", "RAHU"], result: "Greedy, Husband will have bad associates" },
    { planets: ["MARS", "JUPITER", "KETU"], result: "Husband Charitable, good status in life" },
    { planets: ["MARS", "VENUS", "SATURN"], result: "Both working class, Good husband, Bank job, finance" },
    { planets: ["MARS", "VENUS", "RAHU"], result: "Enjoys luxury, dealing with vehicles, machinery, Husband profession may be photography, Computer related, husband is not favorable to wife disappointment in the family" },
    { planets: ["MARS", "VENUS", "KETU"], result: "Not enjoy a happy family." },
    { planets: ["MARS", "SATURN", "RAHU"], result: "Marriage delay, Greedy and suffers" },
    { planets: ["MARS", "SATURN", "KETU"], result: "Detached husband, soft natured, not inclined to job" },
    { planets: ["MARS", "SUN"], result: "Husband a reputed person" },
    { planets: ["MARS", "MOON"], result: "Husband may come from other place, travelling job, Husband usually buys 2nd hand items more." },
    { planets: ["MARS", "MERCURY"], result: "Husband will be educated." },
    { planets: ["MARS", "JUPITER"], result: "Marriage guarantee, Early marriage, Husband divine person, Reputed Person, Commanding or ordering nature." },
    { planets: ["MARS", "VENUS"], result: "Marriage guarantee, Early Marriage, Husband wealthy, Husband will be soft and at times aggressive." },
    { planets: ["MARS", "SATURN"], result: "Late Marriage, Husband will be suffering" },
    { planets: ["MARS", "RAHU"], result: "Marriage delay, Husband greedy and Handsome." },
    { planets: ["MARS", "KETU"], result: "No Marriage or Problem in Marriage, native will be Spiritual, Husband withdrawing nature / Less bold." }
];

export const BNN_MARRIAGE_MALE_COMBINATIONS: BNNCombination[] = [
    { planets: ["VENUS", "SUN", "MOON"], result: "Wife will be respectful, will have travelling interest, Artistic talents, her father comes from different place" },
    { planets: ["VENUS", "SUN", "MARS"], result: "Proud by nature, stubborn, good fortune from wife, Wife will be dignified, controls native, vehicle gains, short tempered, respects elders, will accumulate jewelry" },
    { planets: ["VENUS", "SUN", "MERCURY"], result: "Good in nature, intelligent, good name for both, after marriage husband enjoys prosperity" },
    { planets: ["VENUS", "SUN", "JUPITER"], result: "Courageous, can settle others disputes, good social activities, children will have good fortune, wife will be self-centered and inclined to divine, With wife Enjoys name, fame, enjoys lavish food, enjoys luxury, enjoys good life because of past good karma, one of the son enjoys name & fame" },
    { planets: ["VENUS", "SUN", "SATURN"], result: "Wife comes from good family, father would have suffered for some time after her birth" },
    { planets: ["VENUS", "SUN", "RAHU"], result: "Wife will enjoy more benefits after marriage, difficulties in male issues" },
    { planets: ["VENUS", "SUN", "KETU"], result: "Average fortune, Wife enjoys respect in society, name & fame to wife" },
    { planets: ["VENUS", "MOON", "MARS"], result: "Intelligent, Interested to travel, After marriage native undergoes change of place and enjoys prosperity through travelling, mood swings, wife may quarrel with elder brother" },
    { planets: ["VENUS", "MOON", "MERCURY"], result: "Wife will be knowledgeable in various fields, very active, social minded, will have brothers & sisters, she will be a nature lover, native may mistake her because of her many activities. Good talker, attractive, adjustable in nature, social minded, after marriage husband profits from land, little lazy, good house wife" },
    { planets: ["VENUS", "MOON", "RAHU"], result: "Wife will be fair looking, innocent, mental stress to wife" },
    { planets: ["VENUS", "MOON", "KETU"], result: "Good fortune at birth place, she will have intuitional powers, adamant, over cleanliness, art and embroidery" },
    { planets: ["VENUS", "MARS", "MERCURY"], result: "Wife will be calculative, fair looking, controls husband, intelligent, Short tempered, average education, ambition to continue education, good natured" },
    { planets: ["VENUS", "MARS", "JUPITER"], result: "Fair Looking, Good talker, Fortunate, should overcome wife stubbornness, native should change his behavior of aggressiveness or else no peace / prosperity in family" },
    { planets: ["VENUS", "MARS", "SATURN"], result: "Average fortune, lazy, short temper" },
    { planets: ["VENUS", "MARS", "RAHU"], result: "Good Looking, fair, husband must be careful while driving, very aggressive, Wife brother will face problem after her birth" },
    { planets: ["VENUS", "MARS", "KETU"], result: "Short tempered, fair looking, marriage issue" },
    { planets: ["VENUS", "MERCURY", "JUPITER"], result: "Wife talented, may be teacher, Fair looking wife, she will be having divine inclination, she will be neglected" },
    { planets: ["VENUS", "MERCURY", "SATURN"], result: "Educated, career oriented, troubles in family life, husband enjoys prosperity through her" },
    { planets: ["VENUS", "MERCURY", "RAHU"], result: "Intelligent, husband enjoys prosperity through her fortune, but wife has fear or hallucination" },
    { planets: ["VENUS", "MERCURY", "KETU"], result: "Spiritual inclination, wife will be a devotee of lord Vishnu, Husband will enjoy prosperity from agricultural lands, Problems with couples frequently" },
    { planets: ["VENUS", "JUPITER", "SATURN"], result: "Wife will have Good fortunes, brings good name to the family, interested in teaching and guiding, Pride wife Good guide, loves husband" },
    { planets: ["VENUS", "JUPITER", "RAHU"], result: "From good family, Husband will be prosperous after marriage, domination over husband, ignorant wife" },
    { planets: ["VENUS", "JUPITER", "KETU"], result: "Wife will be orthodox, good charitable nature, adamant, good money, little marriage issues" },
    { planets: ["VENUS", "SATURN", "RAHU"], result: "Couples lazy, but more ambitions, both working" },
    { planets: ["VENUS", "SATURN", "KETU"], result: "Couples inclined to spirituality, Detached, stingy" },
    { planets: ["VENUS", "SUN"], result: "Respected wife from respectable family, Good Administrator, behaves like Leader" },
    { planets: ["VENUS", "MOON"], result: "Wife from far place, Artistic, wife blamed usually, Wife interested in taking loan, Wife spendthrift." },
    { planets: ["VENUS", "MARS"], result: "Wife aggressive, short tempered, dominating, straight forward, Wife always says I am correct." },
    { planets: ["VENUS", "MERCURY"], result: "Educated wife, Intelligent." },
    { planets: ["VENUS", "JUPITER"], result: "Marriage promised, Early Marriage, Wife will have good knowledge, Religious, Married life good, Never fails in life" },
    { planets: ["VENUS", "SATURN"], result: "Marriage promised, Delay in Marriage, working wife, lazy, Wife always Looks Life at negative side." },
    { planets: ["VENUS", "RAHU"], result: "Marriage delay, Couples more ambition in life, wife Beautiful." },
    { planets: ["VENUS", "KETU"], result: "Problem in marriage, Wife will be spiritual, Don’t like luxury items or fancy dressing, Little harassing character. Couples stingy in all matters." }
];

export const BNN_MARRIAGE_DIVORCE_COMBINATIONS: BNNCombination[] = [
    { planets: ["VENUS", "KETU"], result: "High Disturbance in Married Life / Delay Marriage" },
    { planets: ["VENUS", "KETU", "MARS"], result: "More Disturbance in Married Life" },
    { planets: ["VENUS", "KETU", "JUPITER"], result: "Medium Disturbance in Married Life" },
    { planets: ["VENUS", "KETU", "SATURN"], result: "Detachment in Married Life" },
    { planets: ["VENUS", "KETU", "SUN"], result: "Disturbance and Ego in Married Life" },
    { planets: ["VENUS", "RAHU", "MARS"], result: "Occasional fight in Married Life" },
    { planets: ["MARS", "KETU"], result: "High Disturbance in Married Life / Delay Marriage" },
    { planets: ["MARS", "KETU", "VENUS"], result: "More Disturbance in Married Life" },
    { planets: ["MARS", "KETU", "JUPITER"], result: "Medium Disturbance in Married Life" },
    { planets: ["MARS", "KETU", "SATURN"], result: "Detachment in Married Life" },
    { planets: ["MARS", "KETU", "SUN"], result: "Disturbance and Ego in Married Life" },
    { planets: ["MARS", "RAHU", "VENUS"], result: "Occasional fight in Married Life" },
    { planets: ["MOON", "MERCURY"], result: "Love marriage, inter caste Marriage, Cunning Couple." },
    { planets: ["JUPITER", "MOON"], result: "Flirting nature to native." },
    { planets: ["JUPITER", "KETU"], result: "Not interested in Family matters, Blames society." }
];

export const BNN_HEALTH_MALE_COMBINATIONS: BNNCombination[] = [
    { planets: ["JUPITER", "SUN"], result: "Headaches, Acidity, Heart, Arteries." },
    { planets: ["JUPITER", "MOON"], result: "Laziness, Depression, Obesity, Cough," },
    { planets: ["JUPITER", "MARS"], result: "Blood sugar, Liver, Fat, Pancreas" },
    { planets: ["JUPITER", "MERCURY"], result: "Fluid, Nerves, Intestinal, Lungs, Tissues." },
    { planets: ["JUPITER", "VENUS"], result: "Kidney, Blood sugar, Throat, Reproductive issue, Feet, Joint pains, Fat, Lung, Thigh." },
    { planets: ["JUPITER", "SATURN"], result: "Swelling in legs, Heart, Body aches, Stagnation." },
    { planets: ["JUPITER", "RAHU"], result: "Health problem at the time of birth, Sleep, Toxic, Feet, Digestion, Hip, and Slip disc, Back pain." },
    { planets: ["JUPITER", "KETU"], result: "Diagnosis difficult, Infections, Accidents, Lung, Hip, Fractures, Heat." }
];

export const BNN_HEALTH_FEMALE_COMBINATIONS: BNNCombination[] = [
    { planets: ["VENUS", "SUN"], result: "Veins, Heart, Circulation, Back bone, Reproductive." },
    { planets: ["VENUS", "MOON"], result: "Stomach, Swelling, Breast, Irregular menstruation or Pain." },
    { planets: ["VENUS", "MARS"], result: "Sexual disease, Uterus, Excess heat, Gynecological Issues, Venereal, Eye troubles." },
    { planets: ["VENUS", "MERCURY"], result: "Respiratory, Skin, Speech, Ear, Frigidity" },
    { planets: ["VENUS", "SATURN"], result: "Veins, Blood, Varicose, Reproductive, Sexual disorder." },
    { planets: ["VENUS", "RAHU"], result: "Kidney, Urinary, Stomach, Digestion, Intestinal, Sexual issues, Teeth, Face, Thyroid, Neck" },
    { planets: ["VENUS", "KETU"], result: "Face, Mouth, Libido, Neck, Kidney stone, Pus, Menstrual, Abdominal." }
];

export const BNN_WIFE_HEALTH_COMBINATIONS: BNNCombination[] = [
    { planets: ["VENUS", "MOON", "JUPITER"], result: "Wife will suffer intestinal disorders" },
    { planets: ["VENUS", "MOON", "SATURN"], result: "Wife will suffer cold or cough and problem in respiratory organs," },
    { planets: ["VENUS", "MARS", "SUN"], result: "Wife will have bile complaints, and blood pressure" },
    { planets: ["VENUS", "MARS", "SATURN"], result: "Wife suffers due to excess of heat, and its problems" },
    { planets: ["VENUS", "MARS", "RAHU"], result: "Wife suffers from rheumatism" },
    { planets: ["VENUS", "MERCURY", "MOON"], result: "Wife will have tonsil problem" },
    { planets: ["VENUS", "MERCURY", "KETU"], result: "Wife suffers nervous problem" },
    { planets: ["VENUS", "JUPITER", "SUN"], result: "Wife suffers from excessive heat, nervous problem" }
];

export const BNN_COMMON_HEALTH_COMBINATIONS: BNNCombination[] = [
    { planets: ["MOON", "RAHU"], result: "Mind always confused or corrupted." },
    { planets: ["MOON", "KETU"], result: "Negative mind, Secretive, Not happy in life, Mother Too same" }
];

export const BNN_PROPERTY_COMBINATIONS: BNNCombination[] = [
    { planets: ["MERCURY"], result: "Native will have Normal land" },
    { planets: ["MERCURY", "SUN"], result: "Father will have lands" },
    { planets: ["VENUS", "SUN"], result: "Father will have a house" },
    { planets: ["VENUS"], result: "Native will have a Normal House" },
    { planets: ["JUPITER", "MERCURY"], result: "Native will have good land" },
    { planets: ["JUPITER", "MERCURY", "RAHU"], result: "Native will have big land" },
    { planets: ["JUPITER", "MERCURY", "KETU"], result: "Native will have narrow land or litigation" },
    { planets: ["JUPITER", "VENUS", "RAHU"], result: "Native will have a big house" },
    { planets: ["JUPITER", "VENUS", "KETU"], result: "Native’s house will be narrow or have litigation" },
    { planets: ["JUPITER", "VENUS"], result: "Native will have a good house" },
    { planets: ["MERCURY", "RAHU"], result: "Grandfather is landlord, big land, land issues" },
    { planets: ["MERCURY", "KETU"], result: "Land issues, small land, or agricultural land" },
    { planets: ["VENUS", "SATURN"], result: "Native will have an Own house (Old)" },
    { planets: ["VENUS", "RAHU"], result: "Native will have a big house, ancestor property, or a big kitchen" },
    { planets: ["VENUS", "KETU"], result: "Normal house, narrow house, or litigation in house" }
];

export const BNN_RELATION_COMBINATIONS: BNNCombination[] = [
    { planets: ["SUN", "JUPITER"], result: "Father is a religious person, good relation with father/son. Father/Native will do job one after the other." },
    { planets: ["SUN", "MOON"], result: "Father/Ancestors are from a different place. Father is wealthy and noted." },
    { planets: ["SUN", "MARS"], result: "Father is a short-tempered man, aggressive, or angry." },
    { planets: ["SUN", "MERCURY"], result: "Father well educated, younger brother/sister become powerful, Father cheated by friends, very calculative." },
    { planets: ["SUN", "VENUS"], result: "Father will be a wealthy man." },
    { planets: ["SUN", "SATURN"], result: "Father will have hardship, poor, or ordinary job." },
    { planets: ["SUN", "RAHU"], result: "Father will have bad habits or face accidents. Son is an illogical dreamer." },
    { planets: ["SUN", "KETU"], result: "Father has spiritual inclination. Son is not progressive." },
    { planets: ["MOON", "SUN"], result: "Mother will be a good person." },
    { planets: ["MOON", "MARS"], result: "Mother straight forward. Brother may travel a lot." },
    { planets: ["MOON", "MERCURY"], result: "Mother intelligent, mother's sister may change place, younger brother travels." },
    { planets: ["MOON", "JUPITER"], result: "Mother from respectable family, elder sister lucky, native prospers." },
    { planets: ["MOON", "VENUS"], result: "Mother is wealthy." },
    { planets: ["MOON", "SATURN"], result: "Mother will struggle a lot in life." },
    { planets: ["MOON", "RAHU"], result: "Mother will be confused." },
    { planets: ["MOON", "KETU"], result: "Mother is a divine person." },
    { planets: ["MARS", "SUN"], result: "Brother is a reputed person." },
    { planets: ["MARS", "MOON"], result: "Brother may travel." },
    { planets: ["MARS", "MERCURY"], result: "Brother will be educated." },
    { planets: ["MARS", "JUPITER"], result: "Brother knowledgeable and divine person." },
    { planets: ["MARS", "VENUS"], result: "Brother wealthy." },
    { planets: ["MARS", "SATURN"], result: "Brother will be suffering." },
    { planets: ["MARS", "KETU"], result: "Brother may have religious mind." },
    { planets: ["MERCURY", "SUN"], result: "Well educated brother / sister / father." },
    { planets: ["MERCURY", "MOON"], result: "Younger brother / sister get blames, may go to other places." },
    { planets: ["MERCURY", "MARS"], result: "Younger brother / sister aggressive or abusive." },
    { planets: ["MERCURY", "JUPITER"], result: "Younger brother / sister are lucky and knowledgeable." },
    { planets: ["MERCURY", "VENUS"], result: "Sister will be prosperous." },
    { planets: ["MERCURY", "SATURN"], result: "Younger brother in business or management." },
    { planets: ["MERCURY", "RAHU"], result: "Native is cunning with many people." },
    { planets: ["MERCURY", "KETU"], result: "Younger sister/brother spiritual, Native has character of openness, direct." },
    { planets: ["VENUS", "SATURN"], result: "Elder brother will be lucky." },
    { planets: ["VENUS", "JUPITER"], result: "Good Daughter, one of the Sisters will be lucky." },
    { planets: ["SATURN", "RAHU"], result: "Native gets over helping from all people." },
    { planets: ["SATURN", "KETU"], result: "Native is hated by neighbors, Relatives and many people." },
    { planets: ["SUN", "KETU", "MARS"], result: "Disputes between father and brothers." },
    { planets: ["MERCURY", "KETU", "MARS"], result: "Disputes with brothers." },
    { planets: ["JUPITER", "KETU", "MOON"], result: "Disputes between native & mother." }
];
