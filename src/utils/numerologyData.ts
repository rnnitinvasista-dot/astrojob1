
export const VOWEL_VALUES: Record<string, number> = {
  'A': 1,
  'E': 5,
  'I': 1,
  'O': 7,
  'U': 6
};

export const CHEIRO_VALUES: Record<string, number> = {
  'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
  'B': 2, 'K': 2, 'R': 2,
  'C': 3, 'G': 3, 'L': 3, 'S': 3,
  'D': 4, 'M': 4, 'T': 4,
  'E': 5, 'H': 5, 'N': 5, 'X': 5,
  'U': 6, 'V': 6, 'W': 6,
  'O': 7, 'Z': 7,
  'F': 8, 'P': 8
};

export interface NumerologyMeaning {
  planet: string;
  traits: string;
  careers: string[];
  luckyDays: string[];
  luckyDates: number[];
  economicYears: number[];
  luckyDirection: string;
  gem: string;
  grain: string;
  god?: string;
}

export const NUMBER_MEANINGS: Record<number, NumerologyMeaning> = {
  1: {
    planet: "SUN",
    traits: "The number comes under the planet SUN. These people have firm view of their own. They are busy and adamant. They work only on major things. Usually they don't like to work under any one or to be supervised. People usually respect them. Their decisions are made of careful thought and study. Once taken decision, they don't change. They keep their appointments in time. Whichever field they work they try to reach the highest position. They keep the responsibility of taking care of their family. They don't like oily and hot food. They are fond of spiritual books. They have firm belief in god. They like soft songs. They have control on others and respect too. Leadership qualities are high. They are of independent nature. Their advice proves to be beneficial to others. They earn lot of money through their intelligence. They never lack confidence. They are straightforward, honest, and bright. They have endless energy and enthusiasm. They are tending to be lonelier. They lack in diplomacy and need to get along with others. They go to bed late.",
    careers: ["Designing", "Politics", "Government related jobs", "Medicine", "Arts", "Management", "Inventing", "Planning", "Teaching", "Leadership", "Writing"],
    luckyDays: ["Sunday", "Monday"],
    luckyDates: [1, 2, 4, 7, 10, 11, 13, 16, 19, 20, 22, 25, 29, 31],
    economicYears: [1, 10, 19, 28, 37, 46],
    luckyDirection: "East",
    gem: "Ruby",
    grain: "Wheat",
    god: "Rama [Surya Vamsha]"
  },
  2: {
    planet: "MOON",
    traits: "The number comes under the planet MOON. These people are polite. They are sensitive and if someone insults, they take it to their heart. They internally do not accept others views and don't oppose them too. They are the best analyzers of others. They love art, imagination, emotional and lovers of beauty. They admire nature a lot. They are fickle minded and cannot take firm decisions. They think over a plan too much and more or less don't bring into practice. During sleep their thoughts don't stop. They lack attention when others ask and ask to repeat. They have huge attraction for water. They save water and get irritated if no water at home. They get frustrated soon and need to develop confidence and courage. They are revolutionary, quick in decision but not firm and sometime dictatorial attitude. They are usually non-violent. They always think of success. These people are always engaged in some work or the other. They are fast in talking, reading and writing. They are romantic too. They are self-inspired and motivated. They get frustrated instantly and sometimes lose their cool. They always need partner for fresh energy and courage. They rather quickly believe others and get cheated often. They like fast and rhythmic songs. They like salty and bitter food. They like curry foods and fruits a lot. These people understand the grief of others and become too emotional. They always think of well being of others. They please others immediately. They like the company of many people and tend to meet new friends. They are diplomatic, creative, intuitive and emotional.",
    careers: ["Agriculture", "Advertising", "Film industry", "Travel job", "Painting", "Poetry", "Architecture", "Computers", "Photography", "Printing", "Writing", "Liquid business", "Textiles", "Clothing", "Jewelry", "Gems"],
    luckyDays: ["Sunday", "Monday", "Friday"],
    luckyDates: [1, 2, 4, 7, 10, 11, 13, 16, 19, 20, 22, 25, 28, 29],
    economicYears: [2, 11, 20, 25, 29, 35, 38, 47, 56],
    luckyDirection: "North West",
    gem: "Pearl",
    grain: "Rice",
    god: "Shiva [MOON]"
  },
  3: {
    planet: "JUPITER",
    traits: "The number comes under the planet JUPITER. They are logical people. They like to rule over others. They don't want others to rule over them. They think themselves great compared to others in any area of their life. They are intelligent, tolerant, ambitious, energetic, talented and punctual. They are particular about work. They work to reach high in life with rules. They like to lead a luxurious life and tend to purchase costly items. They please their friends and relatives. They don't want complaints on them from any one. No one should control them. They don't like to work under domination. They are disciplined in work and are fearless. They like rich and big people and adore being like them and working. They don't accept anybody so easily. The like music very much. They sometimes are ruthless on others. They like to fight odds during difficult times. They are poor planners of money and tend to run out of it soon. They should control expenditure and save for old age. They should control their egoistic nature. They should avoid jealousy. They like hot oily and spicy food.",
    careers: ["Politics", "Public offices", "Banking", "Advertising", "Acting", "Teaching", "Medicine"],
    luckyDays: ["Tuesday", "Thursday", "Friday"],
    luckyDates: [3, 10, 12, 18, 19, 21, 27, 30],
    economicYears: [6, 15, 21, 24, 30, 33, 39, 48, 57],
    luckyDirection: "North East",
    gem: "Pushyaraga (Yellow Sapphire)",
    grain: "Bengal Gram",
    god: "Guru / Saibaba"
  },
  4: {
    planet: "RAHU",
    traits: "The number comes under the planet RAHU. These people are trustworthy, have stamina, dependable and inventive. The natures of these people are different from others. They study a subject very deeply. They suffer from opposition. They usually have more number of enemies. They are strong willed and usually nontraditional and practical. They never change opinion and not bother even if they suffer loss. Their anger is high and beyond control. Friendship with these people is not easy. They do have very few friends. They cannot adjust anybody in their family. These people are mysterious too. They don't like to amass wealth, but wealth flows easily towards them. They use it in a constructive way and sometimes stingy. These people have to develop common sense, balance of mind and self-confidence and emotions. They oppose customs and traditions and debate on it. They are studious and interested in public welfare. These people are not interested in self-importance and are very principled and idealistic. They have sharp eyesight. They are extreme in their thoughts and inspection oriented mind. They maintain highest secrets with them. Their friendship doesn't last for long. They should avoid criticizing others. They should avoid smoking and drinking, may lead to addicts. They seldom love music and go to extreme if interested.",
    careers: ["Astrology", "Stock market", "Hotels", "Constructions", "Publishing", "Research", "Management", "Transport"],
    luckyDays: ["Sunday", "Monday", "Saturdays"],
    luckyDates: [1, 2, 4, 7, 10, 11, 13, 16, 19, 20, 22, 25, 28, 29],
    economicYears: [13, 19, 22, 28, 31, 37, 40, 46, 49, 55, 58],
    luckyDirection: "East",
    gem: "Gomedhaka (Hessonite)",
    grain: "Black Gram",
    god: "Durga / Parvathi"
  },
  5: {
    planet: "MERCURY",
    traits: "The number comes under the planet MERCURY. These people like to form more friends. They are sensuous, emotional, changeable and impulsive. They have a unique sense of humor while talking. They talk freely and clearly. They have the ability to read others fast. They are always in a hurry in their work. They are good of completion work soon. They have tendency of mind to become rich quickly. They are more attracted to any money increasing schemes. Their memory is excellent. They can reach to top position by using their intellect and their memory is very good. They are good at leading masses and in speech. Their main aim is to acquire knowledge. They work vigorously and guide the people. They should have firm mind and should not the fickle. They make critical decisions easy with logic. They are inclined to material interests. They have the ability to hypnotize other in no time. They reach top position in small period by not wasting time. They usually have liking for multiple profession. They look young compared to their actual age. They like soft music.",
    careers: ["Business", "Writing", "Communication", "Astrology", "Statistics", "Travel job", "Journalism", "Debates", "Shares", "Drama", "Education", "Trading", "Banking", "Public relations", "Computers"],
    luckyDays: ["Wednesday", "Friday"],
    luckyDates: [5, 6, 8, 14, 15, 17, 23, 24, 26],
    economicYears: [14, 15, 17, 23, 24, 26, 32, 33, 38, 41, 42, 44, 50, 51, 53, 59, 60],
    luckyDirection: "North",
    gem: "Emerald / Peridot",
    grain: "Green Gram",
    god: "Vishnu"
  },
  6: {
    planet: "VENUS",
    traits: "The number comes under the planet VENUS. They always feel to have a clean image. They respect others and get respect from others. They have good attraction. They don't change their path of life easily and stick to one routine. They like lot of social work. They like to get to the highest post in any field they work. These people plan their tasks skillfully. They are restless to finish any work they undertake. They have lasting friendship and maintain them for life. They are usually fond of pets. They don't like to quarrel with any one. They are charitable, romantic, idealistic, sensual, true lovers and good character. They should avoid from being addicts of any sort. They are always busy in achieving their goal. They like singing and old songs. They don't like obligations from other. They get the secrets of other by conversation. They should avoid revengeful attitude. These people are lovers of nature and beauty. If they accept any views they go to extent of sacrifice on it. They should avoid adamant nature.",
    careers: ["Institution heads", "Commerce", "Medicine", "Textile", "Entertainment", "Spiritual", "Architecture", "Military", "Fashion", "Hotels", "Interior designing"],
    luckyDays: ["Tuesday", "Thursday", "Friday"],
    luckyDates: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
    economicYears: [15, 20, 24, 26, 33, 35, 39, 42, 44, 47, 51, 53, 56],
    luckyDirection: "South East",
    gem: "Diamond / Zircon",
    grain: "Avare (Hyacinthous Beans)",
    god: "Lakshmi / Krishna"
  },
  7: {
    planet: "KETU",
    traits: "The number comes under the planet KETU. These people are always looking for a change. They are not interested in doing the same thing repeatedly. They love travel a lot. They love books, travel and television a lot. They are intuitive, intellectual, psychic and unique. They find a job where travel is involved. They have capacity to guide and encourage others. They like to have separate identity. They study a lot and also research. They spend lot of time in new experiments and research. They try to give advice to others and also are proficient in advising. They have inner knowledge, vitality and have intuition of future happenings. They come out of difficult situations easily. Failure in work depresses them. Due to this they seldom get angry and irritated. These people are dreamers and their dream comes true most of the time. Many get attracted to these people. Their opinions don't go wrong. They never change their decisions. They have capacity to read others mind. They don't get deceived easily. They are messengers to others. They like music a lot and get engrossed in it. They are fond of reading. They maintain good relations with seniors. They also do social work.",
    careers: ["Writers", "Poets", "Artists", "Actors", "Foreign trade", "Occult", "Religion", "Dairy items"],
    luckyDays: ["Sunday", "Monday", "Friday"],
    luckyDates: [1, 2, 7, 10, 11, 13, 16, 19, 20, 22, 25, 28, 29],
    economicYears: [7, 11, 16, 20, 25, 29, 34, 38, 43, 47, 57],
    luckyDirection: "North West",
    gem: "Cat's Eye",
    grain: "Horse Gram",
    god: "Ganapathi"
  },
  8: {
    planet: "SATURN",
    traits: "The number comes under the planet SATURN. These people think about any subject deeply. They strive to get justice equally to all. They are firm about their views. They have great love for children. They spend money on them too. These people are internally emotional and don't express to others. Their views on many subjects are clear. Many times they behave stern sense of justice. Many people don't freely talk with them. Usually these people feel lonely. They face opposition and dangers from others. Dharma is their main character. They are very secret in what they do. If they develop their mental capacity they reach high positions. They don't want to enjoy happiness alone. Their attitude is to make social reforms through philosophy. They are engrossed in their own thought. These sometimes get into absent mindedness. It's difficult for many people to understand others. They are of serious nature. They are firm about their decisions. They are honest with their friends. They try to earn money from many sources and spend less. They like light food.",
    careers: ["Law", "Social work", "Philosophy", "Science", "Religious institution", "Mining", "Estate agent", "Iron and steel", "Finance", "Footwear", "Administration"],
    luckyDays: ["Sunday", "Monday", "Saturday"],
    luckyDates: [5, 6, 8, 14, 15, 17, 23, 24, 26],
    economicYears: [8, 14, 15, 17, 23, 24, 26, 32, 33, 35, 41, 42, 44, 50, 51, 53],
    luckyDirection: "West",
    gem: "Blue Sapphire",
    grain: "Black Sesame",
    god: "Bhairava / Shiva / Kaala Bhairava"
  },
  9: {
    planet: "MARS",
    traits: "The number comes under the planet MARS. They are very ambitious. They are bold, moral and quick decision maker. They do not like delaying of any work. These people don't like opposition. They have a great presence of mind. They don't like to work under anybody. They become reckless and have very little self-control. They face many accidents in life. They get injured in routine life. They have a dynamic personality. They have quarreling and outspoken nature and hence create many enemies. They like to be independent. They don't like any type of control. They are fickle minded to some extent. They do not sit still for long hours. They get depressed if they see failure. These people make friendship with rich and high position individuals. They spend money freely and always don't plan for old age. They face many ups and downs in their life. They have urge to see lot of places. They like to lead a speedy life. They have frequent clashes with partners. They try to control their partner. They finish their job quickly.",
    careers: ["Engineering", "Mining", "Water", "Military", "Police", "Foreign relations", "Publishing", "Business", "Writing"],
    luckyDays: ["Sunday", "Tuesday", "Thursday", "Friday"],
    luckyDates: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
    economicYears: [9, 18, 21, 27, 30, 36, 39, 45, 48, 54, 57, 63],
    luckyDirection: "South",
    gem: "Coral",
    grain: "Toordal",
    god: "Narasimha / Hanumantha"
  }
};

export const HEART_DESIRE_MEANINGS: Record<number, string> = {
  1: "You like to succeed in any type of competition. Sense of winning in any is the desire. Winning makes you feel appreciated and accepted makes your desire filled.",
  2: "You like love and harmony in your life. Resolving issues through Diplomacy and mediation gives sense of achievement. Conflict and Stress are disappointing and opposite to this is the desired filled.",
  3: "You like creativity in all. Speech and writing makes you feel good about yourself. Social interaction and having good time with society is the desired filled.",
  4: "You like to be financially and professionally winning in life. Your home environment and being debt free. Appreciation of knowledge and expertise by others is the desire filled.",
  5: "You desire to have complete control and freedom of your affairs or duty in your life. Like to have life without any restrictions. Unrestrained life is the desire filled.",
  6: "You desire to be in present world being needed by all and appreciated. Acknowledgement is the need for you. When family, friends, coworkers appreciate for your time extended to them desired filled.",
  7: "You like to gain spiritually around your society. You appreciate nature and the wonder things around the World. You like to gain wisdom on the world and spiritual through solitude is desire filled.",
  8: "You like to gain position, authority, power and material. A secure job or business or financial freedom is the need. Status in any field chosen and achieving is desire filled.",
  9: "You like to do something to humanity and feel happiest through this. You have strong desire to make difference in this world. Helping the society and world at large are the desire filled."
};

export const LUCKY_NUMBERS_PER_NUMBER: Record<number, number[]> = {
  1: [1, 3, 4, 5, 9],
  2: [1, 2, 4, 7],
  3: [1, 2, 3, 4, 8, 9],
  4: [1, 2, 4, 7],
  5: [5, 1, 6],
  6: [6, 5, 1],
  7: [7, 1, 2, 4],
  8: [8, 3, 5, 6, 9],
  9: [9, 1, 3, 5, 8]
};

export const BEST_LUCKY_NUMBERS: Record<number, number[]> = {
  1: [1, 4, 7],
  2: [2, 1, 4, 7],
  3: [3],
  4: [4, 1, 7],
  5: [5],
  6: [6],
  7: [7, 1, 4],
  8: [8],
  9: [9]
};

export const LUCKY_COLORS_PER_NUMBER: Record<number, string[]> = {
  1: ["Orange", "White", "Yellow", "Brown", "Red"],
  2: ["White", "Yellow", "Green", "Blue"],
  3: ["Yellow", "Orange", "White", "Red", "Blue"],
  4: ["Orange", "Yellow", "Blue", "Red"],
  5: ["Green", "Orange", "Red", "White", "Blue"],
  6: ["White", "Green", "Sky Blue", "Red", "Brown"],
  7: ["Violet", "White", "Sky Blue", "Brown", "Orange"],
  8: ["Black", "Yellow", "Green", "Blue", "White", "Red"],
  9: ["Red", "Yellow", "Green", "Orange", "Blue"]
};

export const GOOD_LUCK_ITEMS: Record<number, string> = {
  1: "Copper coin without hole",
  2: "Square Silver coin",
  3: "Golden colour Watch",
  4: "Nashe (Snuff)",
  5: "Copper coin with a hole or Chinese coin",
  6: "Platinum(Rectangle)/Diamond/Zircon",
  7: "Photo of Ganapathi/Vigneshwara/Black Dog",
  8: "Boat Nail",
  9: "Danger Triangle symbol (red Colour)"
};

export const GRID_CELL_MEANINGS: Record<number, string> = {
  1: "Good communicator/Hard to express their innermost feelings.",
  2: "Sensitive & intuitive. Easy to be hurt.",
  3: "Intellectual Capacity, positive attitude happy. Thinking clearly and logically. Find hard to listen to others.",
  4: "Practical, hardworking, Balance and order. Hard to pay attention to other areas of life.",
  5: "Balance and emotional stability and freedom. They motivate and inspire others. Unnecessary risks to be avoided.",
  6: "Creativity, Love, Home and Family. Affects emotionally and Affects their mental imbalance.",
  7: "Learn lessons through losses; knowledge and wisdom are excellent. Little sad lives.",
  8: "Attention to detail. Restless working. Fixed views and options.",
  9: "Humanitarian, Idealism, ambition. Mixing with people from all walks of society is low."
};

export const ABSENCE_MEANINGS: Record<number, string> = {
  1: "Lack of Confidence drive & Motivation",
  2: "Lack of people skills, insensitive.",
  3: "Lack of fun and friends, self-centered.",
  4: "Lack of hardwork.",
  5: "Lack of change.",
  6: "Lack of handling responsibility.",
  7: "Lack of philosophy and are impatient.",
  8: "Lack of care on money and possessions.",
  9: "Lack of compassion and care."
};

export const PERSONAL_YEAR_PREDICTIONS: Record<number, string> = {
  1: "Personal Year-1: New starts, More Enthusiasm and Energy. Anything started is likely to remain important for a long time. May start many new ventures.",
  2: "Personal Year-2: Slow starts, waste of Time & Energy. Year to be patience in all aspects. Pleasant time to be calm.",
  3: "Personal Year-3: Pleasant, enjoyable year. But hard work is must. Time to make new friends, new hobbies. Short lived interest is more. Success in social fields.",
  4: "Personal Year-4: Year of hard work. Year will be serious, difficult and restricting. This is the year of difficulties. Need for discipline and organization.",
  5: "Personal Year-5: Year of change. Year of new excitements and different. Perfect year to change anything unwanted and unhappy. Change in career, home, partner or even country. Be prepared for the unexpected things.",
  6: "Personal Year-6: Year for home and family. It is a year for separation and marriage. It is a year for good or bad. It is a two-way year. If relationship is good, this is a wonderful year. Responsibility increases.",
  7: "Personal Year-7: This is a soft, gentle and quite year. You need more time yourself to think. New learning or Education help. Knowledge and wisdom is acquired. Spiritual growth expected.",
  8: "Personal Year-8: It is a year of hard work and it is money time. You reap the rewards for all the hard works done over the past few years. Health issues may occur; have to be cautious. Material success is possible.",
  9: "Personal Year-9: This is the final year in the wheel of Personal Year Number. Letting go off fast things may be a painful and difficult task. You will also be looking forward as to where to move ahead. Completions and endings."
};

export const MAHURTHAM_SCHEDULES = {
  landWorship: {
    "1": ["1", "3", "4", "10", "12", "13", "19", "21", "22", "28", "30", "31"],
    "10": ["1", "3", "4", "10", "12", "13", "19", "21", "22", "28", "30", "31"],
    "19": ["1", "3", "4", "10", "12", "13", "19", "21", "22", "28", "30", "31"],
    "28": ["1", "3", "4", "10", "12", "13", "19", "21", "22", "28", "30", "31"],
    "2": ["6", "15", "24"],
    "11": ["6", "15", "24"],
    "20": ["6", "15", "24"],
    "29": ["6", "15", "24"],
    "3": ["3", "9", "12", "19", "21", "27"],
    "12": ["3", "9", "12", "19", "21", "27"],
    "21": ["3", "9", "12", "19", "21", "27"],
    "30": ["3", "9", "12", "19", "21", "27"],
    "4": ["6", "15", "24"],
    "13": ["6", "15", "24"],
    "22": ["6", "15", "24"],
    "31": ["6", "15", "24"],
    "5": ["9", "18", "19", "27"],
    "14": ["9", "18", "19", "27"],
    "23": ["9", "18", "19", "27"],
    "6": ["6", "15", "24"],
    "15": ["6", "15", "24"],
    "24": ["6", "15", "24"],
    "7": ["6", "15", "24"],
    "16": ["6", "15", "24"],
    "25": ["6", "15", "24"],
    "8": ["5", "14", "26"],
    "17": ["5", "14", "26"],
    "26": ["5", "14", "26"],
    "9": ["3", "6", "12", "15", "21", "24"],
    "18": ["3", "6", "12", "15", "21", "24"],
    "27": ["3", "6", "12", "15", "21", "24"]
  },
  vehiclePurchase: {
    "1": ["1", "3", "4", "9", "10", "12", "13", "18", "19", "21", "22", "27", "28", "30", "31"],
    "10": ["1", "3", "4", "9", "10", "12", "13", "18", "19", "21", "22", "27", "28", "30", "31"],
    "19": ["1", "3", "4", "9", "10", "12", "13", "18", "19", "21", "22", "27", "28", "30", "31"],
    "28": ["1", "3", "4", "9", "10", "12", "13", "18", "19", "21", "22", "27", "28", "30", "31"],
    "2": ["2", "7", "11", "16", "20", "25", "29"],
    "11": ["2", "7", "11", "16", "20", "25", "29"],
    "20": ["2", "7", "11", "16", "20", "25", "29"],
    "29": ["2", "7", "11", "16", "20", "25", "29"],
    "3": ["3", "12", "21", "30", "9, 18, 27"],
    "12": ["3", "12", "21", "30", "9, 18, 27"],
    "21": ["3", "12", "21", "30", "9, 18, 27"],
    "30": ["3", "12", "21", "30", "9, 18, 27"],
    "4": ["1", "10", "19", "28"],
    "13": ["1", "10", "19", "28"],
    "22": ["1", "10", "19", "28"],
    "31": ["1", "10", "19", "28"],
    "5": ["5", "14", "23"],
    "14": ["5", "14", "23"],
    "23": ["5", "14", "23"],
    "6": ["6", "15", "24"],
    "15": ["6", "15", "24"],
    "24": ["6", "15", "24"],
    "7": ["2", "7", "11", "16", "20", "25", "29"],
    "16": ["2", "7", "11", "16", "20", "25", "29"],
    "25": ["2", "7", "11", "16", "20", "25", "29"],
    "8": ["5", "14", "23"],
    "17": ["5", "14", "23"],
    "26": ["5", "14", "23"],
    "9": ["9", "18", "27"]
  },
  houseWarmingOwn: {
    "1": ["1", "10", "19", "28"],
    "10": ["1", "10", "19", "28"],
    "19": ["1", "10", "19", "28"],
    "28": ["1", "10", "19", "28"],
    "2": ["2", "11", "20", "29"],
    "11": ["2", "11", "20", "29"],
    "20": ["2", "11", "20", "29"],
    "29": ["2", "11", "20", "29"],
    "3": ["3", "12", "21", "30"],
    "12": ["3", "12", "21", "30"],
    "21": ["3", "12", "21", "30"],
    "30": ["3", "12", "21", "30"],
    "4": ["1", "10", "19", "28"],
    "13": ["1", "10", "19", "28"],
    "22": ["1", "10", "19", "28"],
    "31": ["1", "10", "19", "28"],
    "5": ["5", "14", "23"],
    "14": ["5", "14", "23"],
    "23": ["5", "14", "23"],
    "6": ["6", "15", "24"],
    "15": ["6", "15", "24"],
    "24": ["6", "15", "24"],
    "7": ["2", "11", "20", "29"],
    "16": ["2", "11", "20", "29"],
    "25": ["2", "11", "20", "29"],
    "8": ["5", "14", "23"],
    "17": ["5", "14", "23"],
    "26": ["5", "14", "23"],
    "9": ["9", "18", "27"]
  },
  houseWarmingRent: {
    "1": ["1", "10", "19", "28"],
    "10": ["1", "10", "19", "28"],
    "19": ["1", "10", "19", "28"],
    "28": ["1", "10", "19", "28"],
    "2": ["2", "11", "20", "29"],
    "11": ["2", "11", "20", "29"],
    "20": ["2", "11", "20", "29"],
    "29": ["2", "11", "20", "29"],
    "3": ["3", "12", "21", "30"],
    "12": ["3", "12", "21", "30"],
    "21": ["3", "12", "21", "30"],
    "30": ["3", "12", "21", "30"],
    "4": ["4", "13", "22", "31"],
    "13": ["4", "13", "22", "31"],
    "22": ["4", "13", "22", "31"],
    "31": ["4", "13", "22", "31"],
    "5": ["5", "14", "23"],
    "14": ["5", "14", "23"],
    "23": ["5", "14", "23"],
    "6": ["6", "15", "24"],
    "15": ["6", "15", "24"],
    "24": ["6", "15", "24"],
    "7": ["7", "16", "25"],
    "16": ["7", "16", "25"],
    "25": ["7", "16", "25"],
    "8": ["8", "17", "26"],
    "17": ["8", "17", "26"],
    "26": ["8", "17", "26"],
    "9": ["9", "18", "27"]
  },
  marriage: {
    "1": ["1", "10", "19", "28", "2", "4", "7"],
    "10": ["1", "10", "19", "28", "2", "4", "7"],
    "19": ["1", "10", "19", "28", "2", "4", "7"],
    "28": ["1", "10", "19", "28", "2", "4", "7"],
    "2": ["1, 2, 4, 7, 10, 11, 13, 16, 19, 20, 22, 25, 28, 29"],
    "11": ["1, 2, 4, 7, 10, 11, 13, 16, 19, 20, 22, 25, 28, 29"],
    "20": ["1, 2, 4, 7, 10, 11, 13, 16, 19, 20, 22, 25, 28, 29"],
    "29": ["1, 2, 4, 7, 10, 11, 13, 16, 19, 20, 22, 25, 28, 29"],
    "3": ["3, 12, 21, 30, 9, 18, 27"],
    "12": ["3, 12, 21, 30, 9, 18, 27"],
    "21": ["3, 12, 21, 30, 9, 18, 27"],
    "30": ["3, 12, 21, 30, 9, 18, 27"],
    "4": ["1, 10, 19, 28, 2, 4, 7"],
    "13": ["1, 10, 19, 28, 2, 4, 7"],
    "22": ["1, 10, 19, 28, 2, 4, 7"],
    "31": ["1, 10, 19, 28, 2, 4, 7"],
    "5": ["5, 14, 23, 1, 6"],
    "14": ["5, 14, 23, 1, 6"],
    "23": ["5, 14, 23, 1, 6"],
    "6": ["6, 15, 24, 1, 5, 9"],
    "15": ["6, 15, 24, 1, 5, 9"],
    "24": ["6, 15, 24, 1, 5, 9"],
    "7": ["1, 10, 19, 28, 2, 4, 7"],
    "16": ["1, 10, 19, 28, 2, 4, 7"],
    "25": ["1, 10, 19, 28, 2, 4, 7"],
    "8": ["1, 10, 19, 28, 3, 5, 6"],
    "17": ["1, 10, 19, 28, 3, 5, 6"],
    "26": ["1, 10, 19, 28, 3, 5, 6"],
    "9": ["9, 18, 27, 3, 6"]
  }
};

export const MOBILE_VALIDATION_RULES = {
  startConflicts: {
    "9": ["7", "2"],
    "8": ["4"],
    "7": ["3"]
  },
  conflictPairs: ["78", "87", "97", "79", "84", "48", "29", "92", "63", "36"],
  conflictTriples: ["784", "487", "874"],
  neverEndWith: ["0"],
  maxZeros: 2
};

export const ARROW_DEFINITIONS = [
  { name: "Arrow of Planing", cells: [4, 3, 8], type: "Strength" },
  { name: "Arrow of Willpower", cells: [9, 5, 1], type: "Strength" },
  { name: "Arrow of Action", cells: [2, 7, 6], type: "Strength" },
  { name: "Arrow of Mental", cells: [4, 9, 2], type: "Strength" },
  { name: "Arrow of Emotional", cells: [3, 5, 7], type: "Strength" },
  { name: "Arrow of Practical", cells: [8, 1, 6], type: "Strength" },
  { name: "Arrow of Success", cells: [4, 5, 6], type: "Strength" },
  { name: "Arrow of Determination", cells: [8, 5, 2], type: "Strength" },
  // Weakness Arrows (missing these same cells)
  { name: "Arrow of Frustrations", cells: [4, 3, 8], type: "Weakness" },
  { name: "Arrow of Cowardice", cells: [9, 5, 1], type: "Weakness" },
  { name: "Arrow of Hesitation", cells: [2, 7, 6], type: "Weakness" },
  { name: "Arrow of Poor Memory", cells: [4, 9, 2], type: "Weakness" },
  { name: "Arrow of Sensitivity", cells: [3, 5, 7], type: "Weakness" },
  { name: "Arrow of Impracticality", cells: [8, 1, 6], type: "Weakness" },
  { name: "Arrow of Failure", cells: [4, 5, 6], type: "Weakness" },
  { name: "Arrow of Indecision", cells: [8, 5, 2], type: "Weakness" }
];

export const NUMEROLOGY_COMBINATIONS: Record<string, { numbers: number[], colors: string[] }> = {
  "1-1": { "numbers": [1, 3, 4, 5, 9], "colors": ["Orange", "Yellow", "Brown", "Green", "Red"] },
  "1-2": { "numbers": [3, 5, 7], "colors": ["Yellow", "Green"] },
  "1-3": { "numbers": [1, 3, 4, 5, 9], "colors": ["Orange", "Yellow", "Red"] },
  "1-4": { "numbers": [1, 3, 9], "colors": ["Yellow", "Orange", "Red"] },
  "1-5": { "numbers": [1, 5, 9], "colors": ["Green", "Orange", "Red"] },
  "1-6": { "numbers": [4, 5, 9], "colors": ["Brown", "Green", "Red"] },
  "1-7": { "numbers": [1, 4, 7], "colors": ["Orange", "Brown", "White"] },
  "1-8": { "numbers": [3, 5, 9], "colors": ["Yellow", "Green", "Red"] },
  "1-9": { "numbers": [3, 4, 5, 9], "colors": ["Yellow", "Brown", "Green", "Red"] },
  "2-1": { "numbers": [3, 5, 7], "colors": ["Yellow", "Green", "Blue"] },
  "2-2": { "numbers": [3, 5, 6, 7], "colors": ["White", "Green", "Yellow", "Blue"] },
  "2-3": { "numbers": [2, 3], "colors": ["White", "Yellow"] },
  "2-4": { "numbers": [3, 6, 7], "colors": ["Yellow", "White", "Blue"] },
  "2-5": { "numbers": [5, 6], "colors": ["Green", "White", "Blue"] },
  "2-6": { "numbers": [2, 5, 6], "colors": ["White", "Green", "Blue"] },
  "2-7": { "numbers": [2, 7, 6], "colors": ["White", "Blue"] },
  "2-8": { "numbers": [3, 5, 6], "colors": ["Yellow", "Green", "White"] },
  "2-9": { "numbers": [1, 3, 5, 6], "colors": ["Yellow", "Green", "Red"] },
  "3-1": { "numbers": [1, 3, 9], "colors": ["Orange", "Yellow", "Red"] },
  "3-2": { "numbers": [2, 3], "colors": ["White", "Yellow"] },
  "3-3": { "numbers": [1, 2, 3, 8, 9], "colors": ["Orange", "White", "Yellow", "Red", "Blue"] },
  "3-4": { "numbers": [1, 3, 9], "colors": ["Yellow", "Red"] },
  "3-5": { "numbers": [1, 2, 8, 9], "colors": ["White", "Orange", "Red"] },
  "3-6": { "numbers": [2, 4, 8, 9], "colors": ["Brown", "Blue", "White", "Red"] },
  "3-7": { "numbers": [1, 2, 4], "colors": ["Orange", "White", "Brown"] },
  "3-8": { "numbers": [3, 9], "colors": ["Yellow", "Red"] },
  "3-9": { "numbers": [1, 3, 4, 8, 9], "colors": ["Orange", "Yellow", "Brown", "Blue", "Red"] },
  "4-1": { "numbers": [1, 3, 7, 9], "colors": ["Orange", "Yellow", "Red"] },
  "4-2": { "numbers": [3, 6, 7], "colors": ["Yellow", "Blue"] },
  "4-3": { "numbers": [1, 3], "colors": ["Orange", "Yellow"] },
  "4-4": { "numbers": [1, 3, 6, 7, 9], "colors": ["Orange", "Blue", "Yellow", "Red"] },
  "4-5": { "numbers": [1, 6, 9], "colors": ["Orange", "Blue", "Red"] },
  "4-6": { "numbers": [6, 7, 9], "colors": ["Blue", "Red"] },
  "4-7": { "numbers": [1, 6], "colors": ["Orange", "Blue"] },
  "4-8": { "numbers": [3, 6, 9], "colors": ["Yellow", "Blue", "Red"] },
  "4-9": { "numbers": [1, 3, 6], "colors": ["Orange", "Blue", "Yellow"] },
  "5-1": { "numbers": [1, 5, 9], "colors": ["Orange", "Green", "Red", "White"] },
  "5-2": { "numbers": [2, 6], "colors": ["White", "Green", "Blue"] },
  "5-3": { "numbers": [1, 2, 8, 9], "colors": ["White", "Orange", "Red"] },
  "5-4": { "numbers": [1, 6, 9], "colors": ["Orange", "Red", "White", "Blue"] },
  "5-5": { "numbers": [1, 2, 6, 8, 9], "colors": ["White", "Red", "Green"] },
  "5-6": { "numbers": [2, 5, 6, 8, 9], "colors": ["Blue", "Red", "Green", "White"] },
  "5-7": { "numbers": [1, 2, 6], "colors": ["White", "Blue", "Orange"] },
  "5-8": { "numbers": [5, 6, 9], "colors": ["Green", "Red", "Blue", "White"] },
  "5-9": { "numbers": [1, 5, 6, 8, 9], "colors": ["White", "Orange", "Green", "Red", "Blue"] },
  "6-1": { "numbers": [4, 5, 7, 9], "colors": ["Red", "Green", "Brown"] },
  "6-2": { "numbers": [2, 5, 6, 7], "colors": ["White", "Green", "Blue"] },
  "6-3": { "numbers": [2, 4, 8, 9], "colors": ["Red", "White", "Blue"] },
  "6-4": { "numbers": [4, 6, 7, 9], "colors": ["Orange", "Red"] },
  "6-5": { "numbers": [2, 5, 6, 8, 9], "colors": ["White", "Green", "Blue", "Red"] },
  "6-6": { "numbers": [2, 4, 5, 7, 8, 9], "colors": ["White", "Green", "Blue"] },
  "6-7": { "numbers": [2, 4, 6, 7], "colors": ["White", "Blue"] },
  "6-8": { "numbers": [5, 6, 9], "colors": ["Red", "Green", "Blue"] },
  "6-9": { "numbers": [4, 5, 6, 9], "colors": ["Red", "Green", "Blue"] },
  "7-1": { "numbers": [1, 4, 7], "colors": ["White", "Brown", "Sky Blue"] },
  "7-2": { "numbers": [2, 6], "colors": ["White", "Sky Blue"] },
  "7-3": { "numbers": [1, 2, 4], "colors": ["White", "Sky Blue", "Orange"] },
  "7-4": { "numbers": [1, 6], "colors": ["Blue", "Brown", "Orange"] },
  "7-5": { "numbers": [1, 2, 6], "colors": ["White", "Sky Blue", "Orange"] },
  "7-6": { "numbers": [2, 4, 6, 7], "colors": ["White", "Sky Blue", "Brown"] },
  "7-7": { "numbers": [1, 2, 4, 6], "colors": ["White", "Sky Blue", "Orange"] },
  "7-8": { "numbers": [6], "colors": ["White", "Blue"] },
  "7-9": { "numbers": [1, 4, 6], "colors": ["Blue", "Orange"] },
  "8-1": { "numbers": [3, 5, 9], "colors": ["White", "Yellow", "Green"] },
  "8-2": { "numbers": [3, 5, 6], "colors": ["Yellow", "Green", "Blue", "White"] },
  "8-3": { "numbers": [3, 8, 9], "colors": ["Red", "Yellow"] },
  "8-4": { "numbers": [3, 6, 9], "colors": ["Yellow", "Red", "Blue"] },
  "8-5": { "numbers": [5, 6, 9], "colors": ["Red", "Blue", "Green"] },
  "8-6": { "numbers": [5, 6, 9], "colors": ["Red", "Blue", "Green"] },
  "8-7": { "numbers": [6], "colors": ["White", "Blue"] },
  "8-8": { "numbers": [3, 5, 6, 9], "colors": ["Yellow", "Red", "Blue", "Green"] },
  "8-9": { "numbers": [3, 5, 6], "colors": ["Yellow", "Red", "Blue", "Green"] },
  "9-1": { "numbers": [1, 3, 4, 5, 9], "colors": ["Yellow", "Red", "Green"] },
  "9-2": { "numbers": [3, 5, 6], "colors": ["Yellow", "Green", "Blue"] },
  "9-3": { "numbers": [1, 3, 9], "colors": ["Orange", "Yellow", "Red"] },
  "9-4": { "numbers": [1, 3, 6, 9], "colors": ["Yellow", "Red", "Blue"] },
  "9-5": { "numbers": [1, 5, 6, 8, 9], "colors": ["Orange", "Green", "Blue", "Red"] },
  "9-6": { "numbers": [4, 5, 6, 9], "colors": ["Green", "Blue", "Red"] },
  "9-7": { "numbers": [1, 4, 6], "colors": ["Orange", "Sky Blue"] },
  "9-8": { "numbers": [3, 5, 6], "colors": ["Yellow", "Green", "Blue", "Red"] },
  "9-9": { "numbers": [1, 3, 4, 5, 6, 8, 9], "colors": ["Red", "Yellow", "Green"] }
};

export const MAHURTHAM_PROCEDURES: Record<string, { land: string; house: string; milkRaising?: string }> = {
  "1": { 
    land: "Sprinkle Toordal on the land. Afterwards the digging may be done deeply.", 
    house: "Hang a portrait of Lord Ganesha on the wall before the Main Door of the house." 
  },
  "2": { 
    land: "Sprinkle Coconut water on the land before sunrise on 6, 15, 24 dates. Afterwards the digging may be done deeply.", 
    house: "Hang a portrait of the ocean or a river scene before the Main Door of the house." 
  },
  "3": { 
    land: "Sprinkle Honey or Sugar water on the land. Afterwards the digging may be done deeply.", 
    house: "Hang a portrait of Lord Ganesha and Goddess Saraswati before the Main Door of the house." 
  },
  "4": { 
    land: "Sprinkle water brought from any God's Abhishekam on the land. Afterwards the digging may be done deeply.", 
    house: "Hang a portrait of any beautiful scenery with flowers before the Main Door of the house." 
  },
  "5": { 
    land: "Sprinkle soil brought from any Mars, Anjaneya, or Narasimha temple on the land. Afterwards the digging may be done deeply.", 
    house: "Hang a portrait of Lord Krishna or Lord Vishnu before the Main Door of the house." 
  },
  "6": { 
    land: "Sprinkle holy water of Abhishekam from a temple related to any Goddess on the land. Afterwards the digging may be done deeply.", 
    house: "Hang a portrait of any Goddess or specifically Goddess Lakshmi before the Main Door of the house." 
  },
  "7": { 
    land: "Sprinkle holy water from any holy river or lake on the land. Afterwards the digging may be done deeply.", 
    house: "The process of milk raising should be performed between 5:00 AM and 7:00 AM.",
    milkRaising: "5:00 AM to 7:00 AM"
  },
  "8": { 
    land: "Sprinkle soil brought from any old temple or holy place on the land. Afterwards the digging may be done deeply.", 
    house: "Place an idol of Lord Anjaneya in meditation posture before the Main Door of the house." 
  },
  "9": { 
    land: "Sprinkle soil brought from any Mars or Anjaneya temple on the land. Afterwards the digging may be done deeply.", 
    house: "Hang a portrait of Lord Shanmukha before the Main Door of the house." 
  }
};

export const VEHICLE_REG_RULES: Record<string, { avoid: number[]; targetSum: number[] }> = {
  "1": { avoid: [0, 6, 8], targetSum: [3, 5] },
  "2": { avoid: [0, 4, 8, 9], targetSum: [5, 6] },
  "3": { avoid: [0, 4, 5, 6, 7], targetSum: [1, 9] },
  "4": { avoid: [0, 2, 5, 7, 8], targetSum: [1, 6] },
  "5": { avoid: [0, 2, 4, 7, 8, 9], targetSum: [5] },
  "6": { avoid: [0, 3, 4, 8, 9], targetSum: [6, 9] },
  "7": { avoid: [0, 2, 8, 9], targetSum: [1, 3, 5] },
  "8": { avoid: [0, 1, 2, 7, 9], targetSum: [5, 6] },
  "9": { avoid: [0, 2, 7, 8], targetSum: [3, 5, 6] }
};
export const MONTHLY_LUCKY_DATES: Record<string, number[]> = {
  "1": [1, 10, 19, 2, 11, 20, 4, 13, 22, 7, 16, 25],
  "2": [2, 7, 11, 16, 20, 25, 29],
  "3": [3, 12, 21, 30, 9, 18, 27],
  "4": [1, 10, 19, 28, 4, 13, 22, 31],
  "5": [5, 14, 23, 9, 18, 27],
  "6": [6, 15, 24, 9, 18, 27],
  "7": [2, 7, 11, 16, 20, 25, 29],
  "8": [8, 17, 26, 5, 14, 23],
  "9": [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
};

export const ECONOMIC_PROSPERITY_YEARS: Record<string, number[]> = {
  "1": [1, 10, 19, 28, 37, 46, 55, 64, 73, 82, 91],
  "2": [2, 7, 11, 16, 20, 25, 29, 34, 38, 43, 47, 52, 56],
  "3": [3, 12, 21, 30, 39, 48, 57, 66, 75, 84, 93],
  "4": [4, 13, 22, 31, 40, 49, 58, 67, 76, 85, 94],
  "5": [5, 14, 23, 32, 41, 50, 59, 68, 77, 86, 95],
  "6": [6, 15, 24, 33, 42, 51, 60, 69, 78, 87, 96],
  "7": [2, 7, 11, 16, 20, 25, 29, 34, 38, 43, 47, 52],
  "8": [8, 17, 26, 35, 44, 53, 62, 71, 80, 89, 98],
  "9": [9, 18, 21, 27, 30, 36, 39, 45, 48, 54, 57, 63]
};

export const DAY_SPECIFIC_PREDICTIONS: Record<string, string> = {
  "1": "You lead a kingly life but often face enmity. Success is more likely in the second half of life.",
  "2": "Gentle, imaginative, and helpful, though you may experience mood swings.",
  "3": "Highly disciplined and knowledgeable, often excelling in law, administration, or education.",
  "4": "Extremely hardworking but encounter many obstacles before achieving late-life success.",
  "5": "Fast thinkers and dynamic individuals who succeed in business and extensive travel.",
  "6": "Possess natural magnetism and charm, excelling in fine arts, luxury, and aesthetics.",
  "7": "Spiritual, intuitive, and simple, often preferring a philosophical and calm lifestyle.",
  "8": "Deeply patient and resilient, achieving solid success after significant effort and hard work.",
  "9": "Brave and bold, though you may struggle with ego and anger in your quest for justice.",
  "10": "Remarkably successful in business and political leadership with an honorable character.",
  "11": "Artistic and dynamic, you possess the skill to succeed in music and creative fields.",
  "12": "Possess vast knowledge and exceptional speaking skills, earning deep respect.",
  "13": "Fearless and technically gifted, though your life may experience sudden, unexpected shifts.",
  "14": "Highly skillful in speech and communication, often proficient in multiple languages.",
  "15": "Inherently artistic, you often receive significant support from members of the opposite gender.",
  "16": "May face early struggles and unexpected changes that lead to profound spiritual growth.",
  "17": "Achieve great respect in society through sheer hard work and consistent determination.",
  "18": "Follow the path of justice and truth, often advising others on ethical living.",
  "19": "Exceptionably lucky and successful in almost all undertakings; often very religious.",
  "20": "Lead a simple, religious, and helpful life, always ready to support those in need.",
  "21": "Naturally inclined toward public life and politics, achieving success in leadership.",
  "22": "Extremely lucky, especially when doing business in foreign lands or handling large scales.",
  "23": "Attract help from high-ranking individuals and find success in authoritative positions.",
  "24": "Likely to inherit property or paternal wealth; highly successful in business ventures.",
  "25": "Greatly benefit from travel and often find immense success in distant or foreign locations.",
  "26": "Benefit significantly from partnerships and maintain a circle of very helpful friends.",
  "27": "May experience mental unrest or family inconsistency, often struggling to find peace.",
  "28": "Encounter many struggles in the formative years, but achieve grand success in the later phase.",
  "29": "Highly egoistic and bold; your success is built on a foundation of relentless hard work.",
  "30": "Distinguished by discipline and high respect from society, often following religious paths.",
  "31": "Known for having unique thoughts and achieving success through highly unconventional methods."
};
