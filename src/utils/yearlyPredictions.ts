export interface YearlyPredictionData {
    hitNumber: number;
    descriptions: string[];
}

export const HIT_NUMBER_DESCRIPTIONS: Record<number, string[]> = {
    1: [
        "Self-effort, Loneliness, Isolation",
        "Less Money",
        "Detachment Mind Set, Detachment from spouse",
        "Good Health"
    ],
    2: [
        "Family association time",
        "Good Education",
        "Good Food",
        "Increase in Wealth",
        "Marriage time",
        "Purchase of Jewellery",
        "Child Birth Possibility"
    ],
    3: [
        "Low Education",
        "Improvement in Communication",
        "Increase in Commission, High Effort, More Courage",
        "Important Agreement time",
        "Change of Place, Probability of Sale of Property",
        "More short Journey time"
    ],
    4: [
        "Good Education time",
        "Unhappy at Work Place",
        "Loss of Love Life",
        "Issues with Child Birth",
        "Construction time, Purchase of Vehicle",
        "Complication in Health",
        "Support from Mother or issues from Mother in-law"
    ],
    5: [
        "Normal Education",
        "Job Obstacles",
        "Loss of Money by Lending, Drop in Income",
        "Love possibility, Fashion, Lifestyle spending, Glamour time",
        "Child Birth Possibility",
        "Good Health",
        "Loss or Sale of Property or Vehicle",
        "Loss from Opponents"
    ],
    6: [
        "Non focus in Education",
        "Good Job time or New Job",
        "Good Inflow of Money, Increase in Salary",
        "Business Good",
        "Disturbance in Married Life, Discard or Separation from Marriage, Difficulty in getting Partner",
        "Loan Possible",
        "Litigation from Opponents"
    ],
    7: [
        "Support in Education",
        "Support and Co-operation from Colleague",
        "New Business opportunity, Growth in Business",
        "Happy Marriage time, New Marriage Proposal, Partnership",
        "Negotiation in Litigation"
    ],
    8: [
        "Obstacles, Stress, Insults, Humiliation, Conspiracy, Depression",
        "Trouble from Unknown, Un-accounted Money",
        "Dowry, Ancestral Property, Sudden gifts",
        "Danger from Criminal Activity",
        "Problem to Father, Problem from In laws",
        "Long term Disease, Accidents",
        "Litigation"
    ],
    9: [
        "Interest in Higher Studies, Normal Education",
        "Little Lazy",
        "Learning Sacred Scripture",
        "Change of Job, Support from Boss, Loss of Designation",
        "Less Increment, Low Profit",
        "Marriage through Elders",
        "Long Journey, Abroad Travel",
        "Good Health",
        "Negotiation in Litigation"
    ],
    10: [
        "Good Education",
        "Promotion time, Name and Fame in Job / Business",
        "Rewards and Recognition",
        "Ego Clashes in Marriage",
        "Difficulty in Child Birth",
        "Sale of Property or Profit from Property and Vehicle sale",
        "Bad Health",
        "Win in Litigation through Authority"
    ],
    11: [
        "Success in education",
        "Increment in Job",
        "Good flow of Fund, Profit in Business, Many Opportunities",
        "Winning in Competition and Litigation",
        "Fulfilment of Desire"
    ],
    12: [
        "Loss in Education",
        "Transfer, Loss in Business, High Expenditure",
        "Separation from Spouse or Family",
        "Complication in Child Birth",
        "Loss in Litigation",
        "Loss of Property or Wealth",
        "Gain in Spirituality, Yoga, Astrology",
        "Hospitalization",
        "Visit Holy Place",
        "Trouble from Government",
        "Away from Home",
        "Travel Abroad"
    ]
};

export const NN_PLANET_MAP: Record<number, string> = {
    1: "SUN",
    2: "MOON",
    3: "JUPITER",
    4: "RAHU",
    5: "MERCURY",
    6: "VENUS",
    7: "KETU",
    8: "SATURN",
    9: "MARS"
};
