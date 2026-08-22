import React, { useState } from 'react';
import type { NakshatraNadiItem, Planet } from '../../types/astrology';


// --- EMBEDDED COMBINATIONS DATA ---

export interface CombinationRule {
    about: string;
    cuspText: string;
    dashaText: string;
    remarks: string;
}

export const FIRST_CUSP_COMBINATIONS: CombinationRule[] = [
    {
        about: "Very Strong Lagna",
        cuspText: "1, 2, 4, 9, 10, 11",
        dashaText: "",
        remarks: "If Lagna lord is placed in 2nd or 10th or 11th house and if not connected to Badhaka that Lagna will be very strong."
    },
    {
        about: "Medium",
        cuspText: "5, 6, 7, 8, 12",
        dashaText: "",
        remarks: "If Lagna lord is placed in 5th or 8th or 12th house that Lagna will be weak. But Nakshatra Lord placed in 2nd or 10th or 11th will become Medium."
    },
    {
        about: "Low",
        cuspText: "5, 8, 12",
        dashaText: "",
        remarks: "If Lagna Lord is placed in 5th or 8th or 12th house that Lagna will be weak if Nakshatra lord also same 5th or 8th or 12th house indicated will give bad Result."
    },
    {
        about: "Long Life",
        cuspText: "1, 3, 5, 8, 9, 10",
        dashaText: "1, 3, 5, 8, 9, 10",
        remarks: "Cusp Planet Lord should not be Badhaka or Maraka."
    },
    {
        about: "Short Life",
        cuspText: "6, 8, 12 Badhaka or Maraka",
        dashaText: "12 WITH Badhaka or Maraka",
        remarks: ""
    },
    {
        about: "Short Life Below 33 Years",
        cuspText: "2, 6, 8, 12 Badhaka or Maraka",
        dashaText: "",
        remarks: "Check in 3rd and 8th Cusp also."
    },
    {
        about: "Good Health",
        cuspText: "1, 5, 9, 11",
        dashaText: "1, 5, 9, 11",
        remarks: ""
    },
    {
        about: "Bad Health",
        cuspText: "6, 8, 12",
        dashaText: "6, 8, 12",
        remarks: ""
    },
    {
        about: "Normal Sickness",
        cuspText: "1, 6 or 1, 12",
        dashaText: "1, 6 or 1, 12",
        remarks: "Check in 6th Cusp also."
    },
    {
        about: "Long Term Disease",
        cuspText: "1, 6, 8",
        dashaText: "1, 6, 8",
        remarks: "Check in 8th Cusp also."
    },
    {
        about: "Hospitalization or Bed Ridden",
        cuspText: "1, 6, 8, 12",
        dashaText: "1, 6, 8, 12",
        remarks: "Check in 12th Cusp also."
    },
    {
        about: "Surgery",
        cuspText: "4, 6, 8, 12",
        dashaText: "4, 6, 8, 12",
        remarks: "If Mars indicated surgery possible."
    },
    {
        about: "To Recover from Disease",
        cuspText: "1, 3, 5, 11",
        dashaText: "1, 3, 5, 11",
        remarks: "Check in 1st And 5th Cusp also"
    },
    {
        about: "Recovery from Disease / Cure",
        cuspText: "1, 3, 5, 11",
        dashaText: "1, 3, 5, 11",
        remarks: "If 6, 8, 12 connected cure is difficult."
    },
    {
        about: "Treatment not Effective",
        cuspText: "4, 10",
        dashaText: "4, 10",
        remarks: ""
    },
    {
        about: "Discharge from Hospital",
        cuspText: "2, 4, 11",
        dashaText: "2, 4, 11",
        remarks: ""
    },
    {
        about: "Accident",
        cuspText: "1, 4, 6, 7, 8, 12",
        dashaText: "1, 4, 6, 7, 8, 12",
        remarks: "If connected with MA, SA, RA, KE high chances and Badhaka or Maraka"
    },
    {
        about: "Unnatural Death",
        cuspText: "4, 8, 12",
        dashaText: "4, 8, 12",
        remarks: "4 = End of Everything. Need to check 3rd, 8th and 12th Cusp also with Badhaka or Maraka."
    },
    {
        about: "Death",
        cuspText: "",
        dashaText: "4, 8, 10, 12",
        remarks: "10 = Life Retirement. 4 = End of everything with Badhaka or Maraka"
    },
    {
        about: "Good Eye Health",
        cuspText: "2, 3, 10, 11",
        dashaText: "2, 3, 10, 11",
        remarks: "If not connected to Badhaka"
    },
    {
        about: "Deaf and Dumb",
        cuspText: "2, 3 + 6, 8, 12",
        dashaText: "2, 3 + 6, 8, 12",
        remarks: "2 = Speech, 3 = Hearing. Cancer, Scorpio, Pisces signs denotes Dumbness. Check 3rd, 6th, 8th and 12th Cusp are connected to Mercury"
    },
    {
        about: "Attainment of Siddhi",
        cuspText: "3, 9, 10, 12 KE, SA",
        dashaText: "5, 10 or 4, 10 or 1, 12",
        remarks: "3 = Loss of home forever, 5 = Spiritual initiation, 9 = Tapa sthana, 10 = Sadhana, 11 = Siddhi, 12 = Service to others. Also check in 11th Cusp for 5, 10 Combinations."
    },
    {
        about: "To be Popular",
        cuspText: "1, 3, 4, 10, 11",
        dashaText: "1, 3, 4, 10, 11",
        remarks: ""
    },
    {
        about: "Restless or relentless Mind",
        cuspText: "6, 8, 12",
        dashaText: "6, 8, 12",
        remarks: "If sub lord MO or ME."
    },
    {
        about: "Head with Name and Fame",
        cuspText: "1, 3, 4, 7, 10, 11",
        dashaText: "1, 3, 4, 7, 10, 11",
        remarks: ""
    },
    {
        about: "Normal Name",
        cuspText: "2, 6, 9",
        dashaText: "2, 6, 9",
        remarks: ""
    },
    {
        about: "Bad or no Name",
        cuspText: "5, 8, 12",
        dashaText: "5, 8, 12",
        remarks: ""
    },
    {
        about: "To go out of Present Environment",
        cuspText: "1, 3, 5, 9, 12",
        dashaText: "1, 3, 5, 9, 12",
        remarks: "Also to check 11th CSL. to resign and go out to another place to find one's Fortune."
    },
    {
        about: "Charming Face",
        cuspText: "1, 2, 5, 7, 9, 10, 11, VE",
        dashaText: "",
        remarks: "To be checked in 1st Cusp Nakshatra Lord or Sub Lord."
    }
];



export const SECOND_CUSP_COMBINATIONS: CombinationRule[] = [
    {
        about: "To Amass Wealth / Gain Money / Have Profit",
        cuspText: "2, 6, 7, 10, 11",
        dashaText: "2, 6, 7, 10, 11",
        remarks: ""
    },
    {
        about: "Loss of Money",
        cuspText: "5, 8, 12",
        dashaText: "5, 8, 12",
        remarks: "Along With 2, 11 Less Loss"
    },
    {
        about: "Increase in Bank Deposit",
        cuspText: "2, 3, 6, 10, 11",
        dashaText: "2, 3, 6, 10, 11",
        remarks: ""
    },
    {
        about: "Independent Earning",
        cuspText: "1, 4, 6, 10, 11",
        dashaText: "1, 4, 6, 10, 11",
        remarks: ""
    },
    {
        about: "Self - Acquisition",
        cuspText: "1, 2, 11",
        dashaText: "1, 2, 11",
        remarks: ""
    },
    {
        about: "Insurance Legacy, Gratuity",
        cuspText: "2, 8, 11",
        dashaText: "2, 8, 11",
        remarks: ""
    },
    {
        about: "Own Profession, Business, Ancestral Property",
        cuspText: "2, 10, 11",
        dashaText: "2, 10, 11",
        remarks: "To check family Business."
    },
    {
        about: "One Speaks Truth",
        cuspText: "SU or JU",
        dashaText: "",
        remarks: "If MA, ME or SA Speaks Lie."
    },
    {
        about: "Proficient in Occult Science",
        cuspText: "3, 8, 9, 12",
        dashaText: "3, 8, 9, 12",
        remarks: "A Good Astrologer"
    },
    {
        about: "For Increase of Ornaments, Jewels",
        cuspText: "2, 3, 6, 8, 10, 11",
        dashaText: "2, 3, 6, 8, 10, 11",
        remarks: ""
    },
    {
        about: "2nd CUSP Planet in",
        cuspText: "Odd Sign",
        dashaText: "",
        remarks: "Good Finance throughout life [ Aries, Gemini, Leo, Libra, Sagittarius, Aquarius ]."
    },
    {
        about: "2nd CUSP Planet in",
        cuspText: "Movable Sign",
        dashaText: "",
        remarks: "Good Money Flow."
    },
    {
        about: "2nd CUSP Planet in",
        cuspText: "Fixed Sign",
        dashaText: "",
        remarks: "Medium Money Flow."
    },
    {
        about: "2nd CUSP Planet in",
        cuspText: "Common Sign",
        dashaText: "",
        remarks: "Normal Money Flow."
    },
    {
        about: "2nd CUSP Planet in",
        cuspText: "",
        dashaText: "",
        remarks: "2 / 3 / 4 / 6 / 7 / 10 / 11 Gives Good Finance with good Status.\\n1 / 9 Gives medium finance with medium Status.\\n5 / 8 / 12 gives normal finance with normal Status."
    }
];



export const THIRD_CUSP_COMBINATIONS: CombinationRule[] = [
    {
        about: "Have Co-Borns",
        cuspText: "2, 11",
        dashaText: "",
        remarks: ""
    },
    {
        about: "Separation from Younger Siblings",
        cuspText: "2, 10",
        dashaText: "2, 10",
        remarks: ""
    },
    {
        about: "Death of Younger Siblings",
        cuspText: "",
        dashaText: "3, 5, 10 BADHAKA",
        remarks: ""
    },
    {
        about: "Harmony with Younger Siblings",
        cuspText: "1, 11",
        dashaText: "1, 11",
        remarks: ""
    },
    {
        about: "Enmity with Younger Siblings",
        cuspText: "6, 8",
        dashaText: "6, 8",
        remarks: ""
    },
    {
        about: "Transfer of Job",
        cuspText: "3, 9, 12",
        dashaText: "3, 9, 12",
        remarks: "10th CSL With 1, 3, 5, 9, 12 Combination."
    },
    {
        about: "Successful Broker",
        cuspText: "3, 6, 10, 11",
        dashaText: "3, 6, 10, 11",
        remarks: ""
    },
    {
        about: "Publishing a Book",
        cuspText: "3, 10, 11",
        dashaText: "3, 10, 11",
        remarks: ""
    },
    {
        about: "To Run News Paper, Media, Advertising",
        cuspText: "3, 10, 11",
        dashaText: "3, 10, 11",
        remarks: ""
    },
    {
        about: "For Short Journey",
        cuspText: "1, 3, 12",
        dashaText: "1, 3, 12",
        remarks: ""
    },
    {
        about: "Hearing News About a Missing Person",
        cuspText: "3, 11",
        dashaText: "3, 11",
        remarks: ""
    },
    {
        about: "Getting A Mobile",
        cuspText: "3, 9, 11",
        dashaText: "3, 9, 11",
        remarks: ""
    },
    {
        about: "For a Successful Negotiation",
        cuspText: "3, 11 ME or JU",
        dashaText: "3, 11",
        remarks: "Also for good timing of Interview"
    },
    {
        about: "To Make a Contract / Agreement",
        cuspText: "1, 3, 11, 12",
        dashaText: "1, 3, 11, 12",
        remarks: ""
    },
    {
        about: "Good Time to Sign an Agreement",
        cuspText: "1, 3, 7, 11",
        dashaText: "1, 3, 7, 11",
        remarks: ""
    },
    {
        about: "Appointment or to meet a Person",
        cuspText: "1, 3, 7, 9, 11",
        dashaText: "1, 3, 7, 9, 11",
        remarks: ""
    },
    {
        about: "For Purchase of TV or Electrical Goods",
        cuspText: "1, 3, 4, 5, 11, 12",
        dashaText: "4, 11, 12",
        remarks: ""
    },
    {
        about: "Success in Appeal",
        cuspText: "6, 11",
        dashaText: "6, 11",
        remarks: "For court appealing. 6th cusp also to be checked"
    },
    {
        about: "Loss in Appeal",
        cuspText: "5, 12",
        dashaText: "5, 12",
        remarks: "For court appealing. 6th Cusp also to be checked."
    },
    {
        about: "Coward Person",
        cuspText: "8, 12 SA",
        dashaText: "8, 12 SA",
        remarks: ""
    },
    {
        about: "Making Money by Sales Possession",
        cuspText: "3, 11, 12",
        dashaText: "3, 11, 12",
        remarks: ""
    },
    {
        about: "Negotiation (For Marriage)",
        cuspText: "3, 7, 9",
        dashaText: "3, 7, 9",
        remarks: "7 = Negotiation Carried on,\\n9 (3rd From 7th) = Conclude,\\n3, 9, 11 = Success in Negotiation.\\n3, 9, 12 = Failure in Negotiation."
    },
    {
        about: "Competitive Exam",
        cuspText: "4, 9, 11",
        dashaText: "4, 9, 11",
        remarks: ""
    },
    {
        about: "News of Promotion in Service with Transfer order",
        cuspText: "3, 8, 11",
        dashaText: "3, 8, 11",
        remarks: ""
    },
    {
        about: "Bold Enough to make a Venture",
        cuspText: "6, 10, 11",
        dashaText: "6, 10, 11",
        remarks: ""
    },
    {
        about: "Rumors or any Information True or False",
        cuspText: "SA or MA (Nakshatra Lord)",
        dashaText: "",
        remarks: "False : If NL Connected to SA.\\nTrue : If NL Connected to JU.\\nOthers Neutral."
    },
    {
        about: "3rd Cusp Planet Mars",
        cuspText: "MARS",
        dashaText: "",
        remarks: "Highly Ambitious, Courage, not easily Satisfied."
    },
    {
        about: "3rd Cusp Planet Jupiter",
        cuspText: "JUPITER",
        dashaText: "",
        remarks: "Ambition, Ethical, Values, Reasonable, Legitimate."
    },
    {
        about: "3rd Cusp Planet Saturn",
        cuspText: "SATURN",
        dashaText: "",
        remarks: "No Ambition, Lethargy, Dull Mind."
    }
];



export const FOURTH_CUSP_COMBINATIONS: CombinationRule[] = [
    {
        about: "Lower Level Education",
        cuspText: "2, 3, 11",
        dashaText: "2, 3, 11",
        remarks: ""
    },
    {
        about: "Higher Education",
        cuspText: "4, 9, 11",
        dashaText: "4, 9, 11",
        remarks: "ME, JU Connected is very good with 4, 9, 11."
    },
    {
        about: "Non-Completion / Suffer in Education",
        cuspText: "3, 5, 8",
        dashaText: "3, 5, 8",
        remarks: "12 Added Suffer. 4, 6, 9 Added Less Marks"
    },
    {
        about: "Success in Exam",
        cuspText: "4, 9, 11",
        dashaText: "4, 9, 11",
        remarks: "Not Connected to 3, 8, 12"
    },
    {
        about: "Failure in Exam",
        cuspText: "3, 6, 8, 12",
        dashaText: "3, 6, 8, 12",
        remarks: ""
    },
    {
        about: "Success in Competitive Exam",
        cuspText: "4, 6, 9, 11",
        dashaText: "4, 6, 9, 11",
        remarks: "MA, ME, JU Connected to 4, 9, 11"
    },
    {
        about: "Degree with Correspondence or Hostel Studies",
        cuspText: "3, 9, 12",
        dashaText: "3, 9, 12",
        remarks: ""
    },
    {
        about: "No Education",
        cuspText: "3, 6, 8, 12",
        dashaText: "3, 6, 8, 12",
        remarks: "Consider Before 12th Standard or PUC"
    },
    {
        about: "Own, Purchase / Construct House / Land / Property",
        cuspText: "4, 11, 12, SA, MA",
        dashaText: "4, 11, 12",
        remarks: ""
    },
    {
        about: "Purchase of Property through Loan",
        cuspText: "4, 6, 11, 12, SA, MA",
        dashaText: "4, 6, 11, 12",
        remarks: ""
    },
    {
        about: "Own Vehicle",
        cuspText: "4, 11 VE",
        dashaText: "2, 4, 11",
        remarks: "Venus is Karaka"
    },
    {
        about: "Purchase of Vehicle",
        cuspText: "4, 11, 12",
        dashaText: "4, 11, 12",
        remarks: ""
    },
    {
        about: "Gift of Vehicle",
        cuspText: "3, 5, 8, 10, 11",
        dashaText: "3, 5, 8, 10, 11",
        remarks: ""
    },
    {
        about: "Sale of Property / Vehicle",
        cuspText: "3, 5, 10",
        dashaText: "3, 5, 10",
        remarks: ""
    },
    {
        about: "Theft of Vehicle",
        cuspText: "4, 6, 8, 12 SA, RA, KE",
        dashaText: "4, 6, 8, 12 SA, RA, KE",
        remarks: ""
    },
    {
        about: "VE - Separation from Mother",
        cuspText: "3, 12 / 4, 12",
        dashaText: "3, 12 / 4, 12",
        remarks: "MOON KARAKA"
    },
    {
        about: "Demise / Death of Mother",
        cuspText: "",
        dashaText: "3, 5, 10 BADHAKA",
        remarks: ""
    },
    {
        about: "Change of Residence",
        cuspText: "3, 5 OR 3, 12",
        dashaText: "3, 5 OR 3, 12",
        remarks: ""
    },
    {
        about: "To Do a Job in a Permanent Place",
        cuspText: "4, 10",
        dashaText: "4, 10",
        remarks: "4 is home or office comfort like Home"
    },
    {
        about: "Back to Home after Discharge from Hospital",
        cuspText: "2, 4, 11",
        dashaText: "2, 4, 11",
        remarks: ""
    },
    {
        about: "Have Ancestral Property",
        cuspText: "4, 8, 11",
        dashaText: "4, 8, 11",
        remarks: "Saturn involved"
    },
    {
        about: "Have a Car or (Purchase of a Car)",
        cuspText: "4, 9, 10, 11 VE (Movable Sign)",
        dashaText: "4, 9, 10, 11 VE",
        remarks: "4 = Vehicle, 9, 10 = Present Enjoyment of Past Good Karma, 11 = Fulfilment of Desire, VE = Karaka For Vehicle, also SA, MO, MA can Considered (2, 4, 11 = Purchase of a Car)"
    },
    {
        about: "Disposal of a Car",
        cuspText: "3, 4, 5, 10",
        dashaText: "3, 4, 5, 10",
        remarks: "3, 4, 5, 10 = 4, 9, 10, 11 from 7th."
    },
    {
        about: "4th Cusp Planet",
        cuspText: "Movable Sign",
        dashaText: "",
        remarks: "Aries, Cancer, Libra, Capricorn Denotes Vehicle Luck through Out Life."
    },
    {
        about: "4th Cusp Planet",
        cuspText: "",
        dashaText: "",
        remarks: "Vehicle Denoted If Planet in Aries, Taurus, Cancer, Leo, Scorpio, Sagittarius, Capricorn."
    },
    {
        about: "Purchase of Consumer Durable",
        cuspText: "4, 11, 12 SA",
        dashaText: "4, 11, 12 SA",
        remarks: "4 = Pleasure, 11 = Fulfilment of Desire, 12 = Investment, SA / MA / VE = Machine, Luxury"
    },
    {
        about: "Pleasant Stay or Function At Home",
        cuspText: "5, 10, 11",
        dashaText: "5, 10, 11",
        remarks: ""
    },
    {
        about: "Building Constructed For Rent",
        cuspText: "2, 4, 6, 10, 11, 12",
        dashaText: "2, 4, 6, 10, 11, 12",
        remarks: ""
    }
];



export const FIFTH_CUSP_COMBINATIONS: CombinationRule[] = [
    {
        about: "Child Birth",
        cuspText: "2, 5, 11",
        dashaText: "2, 5, 11",
        remarks: "9th is Facilitator House."
    },
    {
        about: "No Child",
        cuspText: "1, 4, 10",
        dashaText: "1, 4, 10",
        remarks: "Connected with Barren signs by Cusp Planet in Aries, Gemini, Leo, Virgo and Planet Associated SA, RA, KE."
    },
    {
        about: "Child Birth Deny / Abortion",
        cuspText: "1, 4, 10 & 6, 8, 12",
        dashaText: "1, 4, 10 & 6, 8, 12",
        remarks: "Connected with KE, MA, RA, SA."
    },
    {
        about: "Normal Delivery",
        cuspText: "2, 5, 11 (3,9)",
        dashaText: "2, 5, 11 (3,9)",
        remarks: "3 = 11 AND 9 = 5 FROM 5th"
    },
    {
        about: "Cesarean Birth",
        cuspText: "2, 5, 11 & 6, 8, 12",
        dashaText: "2, 5, 11 & 6, 8, 12",
        remarks: "Any connection with MA, KE"
    },
    {
        about: "Twin Birth",
        cuspText: "2, 5, 11",
        dashaText: "2, 5, 11",
        remarks: "Connected with ME or JU or Dual Sign - Gemini, Virgo, Sagittarius and Pisces."
    },
    {
        about: "Separation from child",
        cuspText: "4, 12",
        dashaText: "4, 12",
        remarks: ""
    },
    {
        about: "Death of Child",
        cuspText: "",
        dashaText: "4, 6, 8, 12 BADHAKA, MARAKA",
        remarks: "MARAKA, BADHAKA FOR 5th"
    },
    {
        about: "Adopt a Child",
        cuspText: "4, 8, 10, 12",
        dashaText: "2, 6, 8",
        remarks: "10th is other's as Mother"
    },
    {
        about: "Love Affair",
        cuspText: "2, 5, 7, 8",
        dashaText: "2, 5, 7, 8",
        remarks: "Venus is Karaka"
    },
    {
        about: "Success in Love Affair",
        cuspText: "2, 7, 11",
        dashaText: "2, 5, 11",
        remarks: "Falls in Love without Sexual Contact."
    },
    {
        about: "Premarital Sex",
        cuspText: "5, 12 or 5, 8 or 8,11 or 2,11",
        dashaText: "2, 5, 8, 11, 12",
        remarks: "Having a Love affair with Sexual Relations."
    },
    {
        about: "Termination of Love Affair",
        cuspText: "4, 6, 8, 10, 12",
        dashaText: "4, 6, 8, 10, 12",
        remarks: "Failure in Love Affair by Separative Planet - SA / RA / KE"
    },
    {
        about: "Love Marriage",
        cuspText: "2, 7, 11",
        dashaText: "2, 5, 7, 11",
        remarks: "Having a Love Affair Leading to Marriage"
    },
    {
        about: "No Marriage but only Love",
        cuspText: "4, 6, 12",
        dashaText: "1, 4, 6, 10, 12",
        remarks: "Love Affair ending without Marriage or Failure in Love Affair."
    },
    {
        about: "Inter-Community Marriage",
        cuspText: "2, 7, 11 RA / KE",
        dashaText: "2, 7, 11",
        remarks: "Connected with RA / KE"
    },
    {
        about: "Illegal Affair",
        cuspText: "2, 8, 11",
        dashaText: "2, 8, 11",
        remarks: "Without 7 No Legal Partner and with 8 (Physical Relation)."
    },
    {
        about: "Speculative Gain",
        cuspText: "2, 5, 6, 11 Connected JU / ME",
        dashaText: "2, 5, 6, 11",
        remarks: "Not connected to 8, 12 (loss)"
    },
    {
        about: "Gambling Gain",
        cuspText: "2, 5, 6, 8, 10, 11",
        dashaText: "2, 5, 6, 8, 10, 11",
        remarks: "No 12"
    },
    {
        about: "To be a Cinema Actor",
        cuspText: "3, 5, 7, 8, 10, 11",
        dashaText: "3, 5, 7, 8, 10, 11",
        remarks: "Connected to Karaka Venus"
    },
    {
        about: "Intelligent thinking",
        cuspText: "1, 3, 5, 9, 10, 11",
        dashaText: "1, 3, 5, 9, 10, 11",
        remarks: "ME increases"
    },
    {
        about: "Foolish thinking",
        cuspText: "3 or 5 or 8",
        dashaText: "3 or 5 or 8",
        remarks: "Connected to RA or KE"
    },
    {
        about: "Addiction to Alcohol",
        cuspText: "1, 2, 3, 4, 6 SA / MA",
        dashaText: "1, 2, 3, 4, 6",
        remarks: "SA / RA / KE / MO"
    },
    {
        about: "Cure of Disease or Recovery",
        cuspText: "1, 5, 11",
        dashaText: "1, 5, 11",
        remarks: "JU is Karaka for Recovery, 9th is Facilitator for Good Health, also check 6th and 11th Cusp."
    },
    {
        about: "Treatment not Effective",
        cuspText: "4, 10",
        dashaText: "4, 10",
        remarks: "SA / RA / KE / MO"
    },
    {
        about: "Have a Love Affair",
        cuspText: "2, 11",
        dashaText: "2, 5, 11",
        remarks: "If Sublord is connected to RA / KE, its with a person of different caste creed or province."
    },
    {
        about: "Delivery of Child by Operation",
        cuspText: "8, 12 MA, SA, KE",
        dashaText: "2, 5, 11 & 4, 8, 12 MA, SA, KE",
        remarks: "4 = 12 To 5, 8 = Operation, 12 = Hospilization, MA = Operation, SA = Obstruction, KE = Unnatural."
    },
    {
        about: "Popularity and success in Music",
        cuspText: "2, 3, 5, 6, 10, 11",
        dashaText: "2, 3, 5, 6, 10, 11",
        remarks: "Sub lord is connected to VE & ME one will compose music with good intelligence."
    }
];



export const SIXTH_CUSP_COMBINATIONS: CombinationRule[] = [
    {
        about: "Sickness / Disease",
        cuspText: "",
        dashaText: "",
        remarks: "Saturn Karaka"
    },
    {
        about: "Earn Money",
        cuspText: "2, 6, 11",
        dashaText: "2, 6, 11",
        remarks: "If 2 & 6 or 6 & 11 or 2 & 11 Jointly signified with Karaka JU"
    },
    {
        about: "Getting Donation",
        cuspText: "2, 6, 11",
        dashaText: "2, 6, 11",
        remarks: "Also check 11th Sublord."
    },
    {
        about: "Small term Disease",
        cuspText: "2, 6,",
        dashaText: "2, 6,",
        remarks: ""
    },
    {
        about: "Long term Disease",
        cuspText: "1, 6, 8",
        dashaText: "1, 6, 8",
        remarks: "Surgery may be Required if sub lord is connected to MA or KE."
    },
    {
        about: "Life long Disease",
        cuspText: "1, 4, 6, 8, 12",
        dashaText: "1, 4, 6, 8, 12",
        remarks: "Incurable, also check 1st CSL"
    },
    {
        about: "Joining a Job / Service",
        cuspText: "2, 6, 10, 11",
        dashaText: "2, 6, 10, 11",
        remarks: "SA is Karaka for Job, also check 10th if it signifies 6th for service, if 7th for Business. If 6th & 7th both service and Business Depending on the Running Dasha"
    },
    {
        about: "No Job / Obstacles",
        cuspText: "2, 8, 12 / 5, 8, 12 / 6, 8, 12",
        dashaText: "2, 8, 12 / 5, 8, 12 / 6, 8, 12",
        remarks: "Also check 10th CSL"
    },
    {
        about: "Promotion",
        cuspText: "2, 6, 10, 11",
        dashaText: "2, 6, 10, 11",
        remarks: "Also check 10th CSL"
    },
    {
        about: "Change of Job",
        cuspText: "1, 3, 5, 9",
        dashaText: "1, 3, 5, 9",
        remarks: "Also check 10th CSL"
    },
    {
        about: "Loss of Money",
        cuspText: "5, 7, 8, 12",
        dashaText: "5, 7, 8, 12",
        remarks: "Loss of Wealth"
    },
    {
        about: "Borrowing from Bank",
        cuspText: "2, 6, 10, 11",
        dashaText: "2, 6, 10, 11",
        remarks: ""
    },
    {
        about: "In Debt",
        cuspText: "6, 8, 12",
        dashaText: "6, 8, 12",
        remarks: ""
    },
    {
        about: "Gain in any Sort of Competition (Election / Litigation / Sports Match Ect)",
        cuspText: "1, 6, 10, 11",
        dashaText: "1, 6, 10, 11",
        remarks: ""
    },
    {
        about: "Political Success",
        cuspText: "1, 6, 5, 8, 9, 10, 11",
        dashaText: "1, 6, 5, 8, 9, 10, 11",
        remarks: ""
    },
    {
        about: "Job Interview",
        cuspText: "6, 11 or 10, 11",
        dashaText: "6, 11 or 10, 11",
        remarks: "3rd CSL"
    },
    {
        about: "Loss in Competition",
        cuspText: "4, 5, 7, 8, 9, 12",
        dashaText: "4, 5, 7, 8, 9, 12",
        remarks: "11th CSL"
    },
    {
        about: "Suffer from Disease",
        cuspText: "6, 8, 12 & Connected With 1",
        dashaText: "1 & 6, 1 & 8, 1 & 6, 6 & 12",
        remarks: "SA = Chronic, MA = Acute, Sudden Pain and causes, ME = Complicated, RA / KE = Remains Undiagnosed with similar effect to MA. Also to check 8th & 12th Sublord for the same Signification."
    },
    {
        about: "Disease is Cured, Safe from any Danger",
        cuspText: "1, 5, 9, 11",
        dashaText: "1, 5, 9, 11",
        remarks: ""
    },
    {
        about: "Aggravating Nature of Disease under control",
        cuspText: "1, 3, 5, 10, 11",
        dashaText: "1, 3, 5, 10, 11",
        remarks: ""
    },
    {
        about: "To get a Desired or Good Job",
        cuspText: "2, 6 or 6",
        dashaText: "2, 6 or 6",
        remarks: "6th, 8th, 11th and 12th CSL to be checked"
    },
    {
        about: "Obstacles, Impediments & Mental Agony in Service Matters",
        cuspText: "1 & 8, 5 OR 9",
        dashaText: "1 & 8, 5 OR 9",
        remarks: "10th CSL also to be checked"
    }
];



export const SEVENTH_CUSP_COMBINATIONS: CombinationRule[] = [
    {
        about: "Marriage",
        cuspText: "1, 5, 9, 11",
        dashaText: "1, 5, 9, 11",
        remarks: "Venus is Karaka"
    },
    {
        about: "Marriage",
        cuspText: "2, 7, 11",
        dashaText: "2, 7, 11",
        remarks: "House 3 is a Facilitator for Marriage by Negotiation and Celebration. 5th and 8th House are also included. JU transit is mostly found in one of 2, 7, 11 or in Nakshatra of 2, 7, 11"
    },
    {
        about: "Dual Marriage",
        cuspText: "2, 7 or 2, 11 or 8, 11",
        dashaText: "2, 7 or 2, 11 or 8, 11",
        remarks: "ME OR JU AS CSL"
    },
    {
        about: "No Marriage",
        cuspText: "1, 4, 6, 10, 12",
        dashaText: "1, 4, 6, 10, 12",
        remarks: ""
    },
    {
        about: "Delay in Marriage",
        cuspText: "2, 4, 7, 10, 11",
        dashaText: "2, 4, 7, 10, 11",
        remarks: "Punarpoo Yoga (Connection between SA & MO)"
    },
    {
        about: "Delay in Marriage",
        cuspText: "1, 6, 10 or 6, 8, 12",
        dashaText: "1, 6, 10 or 6, 8, 12",
        remarks: "With 2, 7 Involved"
    },
    {
        about: "Break of Engagement",
        cuspText: "2, 7, 11 also 1, 6, 10 / 6, 8, 12",
        dashaText: "2, 7, 11 also 1, 6, 10 / 6, 8, 12",
        remarks: ""
    },
    {
        about: "Love Marriage",
        cuspText: "2, 5, 7, 11",
        dashaText: "2, 5, 7, 11",
        remarks: ""
    },
    {
        about: "Inter Community Marriage",
        cuspText: "2, 7, 11 RA / KE",
        dashaText: "2, 7, 11",
        remarks: "Connected to RA / KE"
    },
    {
        about: "Marriage to Widow / Widower / Divorce",
        cuspText: "2, 7, 8, 11",
        dashaText: "2, 7, 8, 11",
        remarks: "Sub lord connected to RA or SA"
    },
    {
        about: "Getting Dowry",
        cuspText: "2, 7, 11 & 8, 11",
        dashaText: "2, 7, 11",
        remarks: "8th CSL also to be checked"
    },
    {
        about: "Marriage and Separation",
        cuspText: "2, 7, 11 & 1, 4, 6, 8, 10, 12",
        dashaText: "2, 7, 11 & 1, 4, 6, 8, 10, 12",
        remarks: "Misunderstanding with Partner."
    },
    {
        about: "Separation after Marriage",
        cuspText: "2, 6, 7, 12",
        dashaText: "2, 6, 7, 12",
        remarks: "After Love Marriage if 5 is involved."
    },
    {
        about: "Separation from Partner",
        cuspText: "6, 12",
        dashaText: "6, 12",
        remarks: "Failure in love affair. Partnership Breaks."
    },
    {
        about: "Separation of Husband & Wife",
        cuspText: "1, 6, 10, 12",
        dashaText: "1, 6, 10, 12",
        remarks: "If 7th Cusp Signifies 6, 9 wife will leave, if 3, 12 Husband will leave."
    },
    {
        about: "Bickering in Marriage",
        cuspText: "6, 8, 12 or 7, 8, 12",
        dashaText: "6, 8, 12 or 7, 8, 12",
        remarks: ""
    },
    {
        about: "Divorce Decided",
        cuspText: "1, 6, 8, 10, 12",
        dashaText: "1, 6, 8, 10, 12",
        remarks: ""
    },
    {
        about: "Reconciliation after Separation / Divorce",
        cuspText: "1, 6, 10, 12 also 2, 5, 7, 11",
        dashaText: "1, 6, 10, 12 also 2, 5, 7, 11",
        remarks: ""
    },
    {
        about: "Illegal Relationship",
        cuspText: "2, 8, 11",
        dashaText: "2, 8, 11",
        remarks: "Without 7 (legal Parther)"
    },
    {
        about: "Second Child Birth",
        cuspText: "2, 5, 11",
        dashaText: "2, 5, 7, 11",
        remarks: "5th for 1st Child, 7th for 2nd, 9th for 3rd Child so on."
    },
    {
        about: "Joining Business",
        cuspText: "2, 7, 10, 11",
        dashaText: "2, 7, 10, 11",
        remarks: ""
    },
    {
        about: "Gain / Profit in Business",
        cuspText: "2, 6, 7, 10, 11",
        dashaText: "2, 6, 7, 10, 11",
        remarks: ""
    },
    {
        about: "Loss in Business",
        cuspText: "5, 8, 12",
        dashaText: "5, 8, 12",
        remarks: "(Without own investment it Saves)"
    },
    {
        about: "Getting Partner",
        cuspText: "7, 11",
        dashaText: "7, 11",
        remarks: ""
    },
    {
        about: "Having a Business Partner",
        cuspText: "6, 7, 11",
        dashaText: "6, 7, 11",
        remarks: "If connected with 5, 12 a good partner cannot be got."
    },
    {
        about: "Partnership Breaks",
        cuspText: "2, 6, 8, 12",
        dashaText: "2, 6, 8, 12",
        remarks: ""
    },
    {
        about: "No Sexual Contact ever",
        cuspText: "No connection to 2, 3, 5, 7, 8, 11, 12",
        dashaText: "No connection to 2, 3, 5, 7, 8, 11, 12",
        remarks: "Just 1, 4, 6, 9, 10 gives no sex or no interest in it"
    },
    {
        about: "Unpleasant-ness, Misunderstanding & other Difficulties In Married Life",
        cuspText: "4, 6, 8, 12",
        dashaText: "4, 6, 8, 12",
        remarks: ""
    },
    {
        about: "Misunderstanding with Partner & Family Members",
        cuspText: "2, 7, 8, 12",
        dashaText: "2, 7, 8, 12",
        remarks: ""
    },
    {
        about: "Separation by Violence",
        cuspText: "6, 12 MA",
        dashaText: "6, 12 MA",
        remarks: ""
    },
    {
        about: "Marriage Fixed and Cancelled Immediately",
        cuspText: "1, 6, 7, 10, 12",
        dashaText: "1, 6, 7, 10, 12",
        remarks: "Horary Questionare"
    },
    {
        about: "Dull Business",
        cuspText: "1, 5, 7, 8",
        dashaText: "1, 5, 7, 8",
        remarks: ""
    }
];



export const EIGHTH_CUSP_COMBINATIONS: CombinationRule[] = [
    {
        about: "Long Life",
        cuspText: "1, 3, 5, 8, 9, 10",
        dashaText: "1, 3, 5, 8, 9, 10",
        remarks: ""
    },
    {
        about: "Short Life",
        cuspText: "Badhaka, Maraka\\n6, 8, 12",
        dashaText: "Badhaka, Maraka\\n6, 8, 12",
        remarks: ""
    },
    {
        about: "Danger to Health",
        cuspText: "1, 6, 8, 12",
        dashaText: "6, 8, 12",
        remarks: ""
    },
    {
        about: "Good Health / Cure / Recovery / Escape from Accident or Danger for life",
        cuspText: "1, 5, 9, 11",
        dashaText: "1, 5, 9, 11",
        remarks: "Check Badhaka too"
    },
    {
        about: "Suicide",
        cuspText: "2, 6, 7, 8, 12",
        dashaText: "2, 6, 7, 8, 12",
        remarks: "Check in 1st CSL too"
    },
    {
        about: "Accident",
        cuspText: "4, 6, 8, 12\\nMA, RA, KE, SA",
        dashaText: "4, 6, 8, 12\\nMA, RA, KE, SA",
        remarks: "Also check 1st & 6th CSL"
    },
    {
        about: "Surgery / Operation",
        cuspText: "4, 6, 8, 12 MA",
        dashaText: "4, 6, 8, 12 MA",
        remarks: "Safety in life. JU is Karaka. also to check 1st & 6th Sub Lord for the same Signification."
    },
    {
        about: "Madness or Insanity",
        cuspText: "3, 6, 8, 12\\nMO, ME, KE, SA",
        dashaText: "3, 6, 8, 12\\nMO, ME, KE, SA",
        remarks: "MO, ME, KE, SA CONNECTED TO 6,8,12.\\nMO = MIND,\\nME = REASON,\\nKE = INSANITY,\\nSA = SADNESS."
    },
    {
        about: "Getting Wife's Property",
        cuspText: "2, 8, 11",
        dashaText: "2, 8, 11",
        remarks: "Getting Unearned Income."
    },
    {
        about: "Getting Gratuity, Insurance, Etc, Property of the Deceased Person.",
        cuspText: "2, 5, 6, 8, 11 (JU)",
        dashaText: "2, 5, 6, 8, 11",
        remarks: ""
    },
    {
        about: "Getting Dowry",
        cuspText: "6, 8, 11",
        dashaText: "6, 8, 11 & 2, 7, 11",
        remarks: "Also Check In 7th CSL signification of 8, 11."
    },
    {
        about: "Giving Dowry",
        cuspText: "5, 12",
        dashaText: "5, 12",
        remarks: "Also to check 7th CSL for the same signification."
    },
    {
        about: "Marrying a Widow",
        cuspText: "2, 7, 8, 11 VE, RA",
        dashaText: "2, 7, 8, 11",
        remarks: "VE Widow at young age.\\nIf RA or SA old age, also check 7th CSL for the same."
    },
    {
        about: "Lottery Gain",
        cuspText: "2, 3, 5, 6, 11",
        dashaText: "2, 3, 5, 6, 11",
        remarks: "8 = Sudden Unexpected Gain. also to check 3rd CSL signification if 2, 5, 6, 8, 11."
    },
    {
        about: "To Become an Astrologer",
        cuspText: "3, 4, 5, 8, 9, 10, 11, 12",
        dashaText: "3, 4, 5, 8, 9, 10, 11, 12",
        remarks: ""
    },
    {
        about: "Dacoit (Person of Nuisance for others)",
        cuspText: "3, 5, 8",
        dashaText: "3, 5, 8",
        remarks: ""
    },
    {
        about: "Can have a Business Partner",
        cuspText: "6, 11",
        dashaText: "6, 11",
        remarks: ""
    }
];



export const NINTH_CUSP_COMBINATIONS: CombinationRule[] = [
    {
        about: "Foreign Travel",
        cuspText: "3, 9, 12",
        dashaText: "3, 9, 12",
        remarks: ""
    },
    {
        about: "Foreign Travel for Business",
        cuspText: "3, 7, 9, 12",
        dashaText: "3, 7, 9, 12",
        remarks: "Foreign Travel (3, 9, 12) + Business (7)"
    },
    {
        about: "Foreign Travel for Job",
        cuspText: "3, 6, 9, 12",
        dashaText: "3, 6, 9, 12",
        remarks: "Foreign Travel (3, 9, 12) + Job (6)"
    },
    {
        about: "Foreign Travel for Education",
        cuspText: "3, 4, 9, 12",
        dashaText: "3, 4, 9, 12",
        remarks: "Foreign Travel (3, 9, 12) + Education (4, 9)"
    },
    {
        about: "Foreign Pleasure Trip",
        cuspText: "3, 5, 9, 12",
        dashaText: "3, 5, 9, 12",
        remarks: "Foreign Travel (3, 9, 12) + Pleasure (5)"
    },
    {
        about: "Foreign Travel for Marriage",
        cuspText: "3, 7, 9, 12",
        dashaText: "3, 7, 9, 12",
        remarks: "Foreign Travel (3, 9, 12) + Marriage (7)"
    },
    {
        about: "Foreign Travel for Medical/Hospital",
        cuspText: "3, 8, 9, 12",
        dashaText: "3, 8, 9, 12",
        remarks: "Foreign Travel (3, 9, 12) + Hospital (8)"
    },
    {
        about: "Higher Studies (Master, Ph.d.)",
        cuspText: "4, 9, 11",
        dashaText: "4, 9, 11",
        remarks: "Also to check 11th CSL signification of 4, 6, 9, 11."
    },
    {
        about: "Travel",
        cuspText: "3, 9, 12",
        dashaText: "3, 9, 12",
        remarks: "Mainly to check 12th CSL signification of 3, 9, 12."
    },
    {
        about: "Pilgrimage",
        cuspText: "3, 9, 10",
        dashaText: "3, 9, 12",
        remarks: "Also to check 10th CSL."
    },
    {
        about: "Separation from Father",
        cuspText: "8, 12",
        dashaText: "8, 12",
        remarks: "8 = Also Danger to Father."
    },
    {
        about: "Long life of Father",
        cuspText: "1, 6, 9, 11",
        dashaText: "1, 6, 9, 11",
        remarks: "1, 9, 11 = 5, 9, 3. but 6 = 10 from 9th"
    },
    {
        about: "Short life of Father",
        cuspText: "3, 8, 10 BADHAKA",
        dashaText: "3, 8, 10 BADHAKA",
        remarks: "Death of Father during D.B.A"
    },
    {
        about: "2nd Marriage",
        cuspText: "2, 9, 11",
        dashaText: "2, 7, 9, 11",
        remarks: "For second Marriage need to check 7th Cusp"
    },
    {
        about: "Spiritual Life & Divine Worship",
        cuspText: "1, 5, 9, 11, 12 SA",
        dashaText: "5, 9, 10, 11",
        remarks: "SA Connected to JU by Aspect. 5 = Initiation For Spirituality. 10 = Practicing of Spirituality. 11 = Attainment of Spirituality. 12 = Service to others. Also check 1st, 5th & 11th Cusp."
    },
    {
        about: "A genius in Astrology",
        cuspText: "2, 9, 10, 11, 12 JU, ME",
        dashaText: "2, 9, 10, 11, 12",
        remarks: "JU, ME are connected to 9 & 12. Also to check 10th CSL."
    },
    {
        about: "Leading Scientist",
        cuspText: "2, 3, 8, 9, 10, 11 SA",
        dashaText: "2, 3, 8, 9, 10, 11 SA",
        remarks: "SA is connected to ME."
    },
    {
        about: "Success in Research",
        cuspText: "6, 8, 9, 11, 12 SA, KE",
        dashaText: "6, 8, 9, 11, 12",
        remarks: "Also to check 11th CSL."
    }
];



export const TENTH_CUSP_COMBINATIONS: CombinationRule[] = [
    {
        about: "Job in Service",
        cuspText: "6",
        dashaText: "6",
        remarks: "SA is Karaka"
    },
    {
        about: "Paid Job",
        cuspText: "2, 6, 10, 11",
        dashaText: "2, 6, 10, 11",
        remarks: "Also to check 6th CSL"
    },
    {
        about: "Promotion",
        cuspText: "2, 6, 10, 11",
        dashaText: "2, 6, 10, 11",
        remarks: "2, 6 or 6, 10 or 2, 6, 10 or 10, 11 or 6, 11 or 2, 10, 11 or 6, 10, 11 {10 Very Important}"
    },
    {
        about: "Promotion With Transfer",
        cuspText: "2, 3, 6, 10, 11",
        dashaText: "2, 3, 6, 10, 11",
        remarks: "3 = Change of Work or Place"
    },
    {
        about: "No Change of Work Place",
        cuspText: "1, 4, 10, 11",
        dashaText: "1, 4, 10, 11",
        remarks: "Remain in Same Place"
    },
    {
        about: "Promotion & Overseas",
        cuspText: "2, 3, 6, 10, 11 & 3, 9, 12",
        dashaText: "2, 3, 6, 10, 11 & 3, 9, 12",
        remarks: "Signifying 2 house groupings simultaneously"
    },
    {
        about: "Getting an Award / Prizes",
        cuspText: "6, 10, 11 (2)",
        dashaText: "6, 10, 11 (2)",
        remarks: "6 = Competition.\\n2 = With Monetary Gain.\\nSU/MO from Govt. JU / VE from non-govt."
    },
    {
        about: "Not Getting A Single Profit",
        cuspText: "Not connected to 2 or 3 or 6 or 11",
        dashaText: "Not connected to 2 or 3 or 6 or 11",
        remarks: ""
    },
    {
        about: "Change in Job / Business (Change In Career)",
        cuspText: "1, 5, 9 or 3, 5, 9 OR 3, 9, 12 (5, 9) are main. 1, 5, 9 = 12 to 2, 6, 10\\n3, 5, 9 = 6, 8, 12 to 10.\\n{12 = LEAVING PRESENT JOB & JOINING NEW JOB}",
        dashaText: "1,5,9 or\\n3,5,9 or\\n3,9,12",
        remarks: "If also 2, 6 (7) 10, 11 are simultaneously signified, taking a New Job. If DBA signify 9, 11 or 10, 11 change for better. If 8, 12 for Bad. If only 5, 9 The same Status. If 8 is Signified without 2, 6, 10. Termination of Job by Punishment. 3 = Change of Place. 9 = Change in Job."
    },
    {
        about: "Transfer",
        cuspText: "3, 9, 12\\nor\\n3, 10, 12",
        dashaText: "3, 9, 12\\nor\\n3, 10, 12",
        remarks: "JOINTLY SIGNIFIED.\\n3 = CLOSE BY PLACE.\\n9 = FAR OFF.\\n3, 9, 10, 12 = CHANGE IN JOB AND PLACE OF JOB."
    },
    {
        about: "Suspension",
        cuspText: "1, 8, 9, 12\\nor\\n1, 5, 9",
        dashaText: "1, 5, 8, 9, 12",
        remarks: "5 = POSSIBLE DISMISSAL.\\n8 = TROUBLE, PUNISHMENT."
    },
    {
        about: "Reinstatement",
        cuspText: "2, 6, 10, 11",
        dashaText: "2, 6, 10, 11",
        remarks: "No Reinstatement, if connected to 1, 5, 9, 12. Also to check 6th CSL."
    },
    {
        about: "Retirement (Loss of Service)",
        cuspText: "1, 5, 9, 12",
        dashaText: "1, 5, 9, 12",
        remarks: "5 & 12 = Loss Of Job.\\n3, 9, 12 = (without Signifying 2, 6, 10) Giving up the Present Job."
    },
    {
        about: "Undertaking Independent Business",
        cuspText: "2, 7, 10",
        dashaText: "2, 7, 10",
        remarks: "Ma Gives Courage to do so, also to Check 7th Cusp for The Same Signification."
    },
    {
        about: "Doing Both Paid Job & Independent Business",
        cuspText: "2, 6, 7, 10\\nME DUAL SIGN",
        dashaText: "2, 6, 7, 10",
        remarks: "6 = Service,\\n7 = Business Depending On Running DBA. For Additional in Job / Business JU / ME is Karaka."
    },
    {
        about: "Gain / Success In Independent Business",
        cuspText: "2, 7, 10, 11",
        dashaText: "2, 7, 10, 11",
        remarks: "7, 11 or 2, 7 or 2, 7, 10 or 7, 10, 11 Should operate jointly, not Separately each alone. Also to check 7th CSL"
    },
    {
        about: "Loss in Business (winding Up Business / Break in Career)",
        cuspText: "5, 8, 12\\n(In Earthy Sign)",
        dashaText: "5, 8, 12",
        remarks: "5, 8, 12 = 2, 6, 11 for opponent to gain. Also to check 7th CSL"
    },
    {
        about: "Having Business Partner",
        cuspText: "6, 11",
        dashaText: "6, 11",
        remarks: "Also to check 7th CSL"
    },
    {
        about: "No occupation in life",
        cuspText: "Not Connected To 6, 7, 10",
        dashaText: "Not Connected To 6, 7, 10",
        remarks: "Wasting one's life time."
    },
    {
        about: "Success in Politics",
        cuspText: "1, 3, 5, 6, 8, 9, 10, 11",
        dashaText: "1, 3, 5, 6, 8, 9, 10, 11",
        remarks: "JU, ME, MA & SA are strong and signify 1, 3, 5, 6, 8, 9, 10, 11.\\n1 = Self Success,\\n3 = Communication,\\n5 = Creative,\\n6 = Defeat Of Opponents,\\n8 = Hidden Talent Or Wealth,\\n9 = General Fortune,\\n10 = Honor & Popularity,\\n11 = Ambition Achieved.\\nAlso, Tocheck Csl Of 1st, 5th, 6th & 11th Whether they Signify 1, 6, 10, 11 For Success In Politics Or Winning Election."
    },
    {
        about: "Failure in Politics",
        cuspText: "",
        dashaText: "5, 8, 12 OR\\n6, 8, 12 OR\\n7, 8, 12",
        remarks: "Signifying Jontly, Not Each Separately.\\n5, 8, 12 = 2, 6, 11 For Opponents To Gain."
    },
    {
        about: "To be Successful in Share Market Business",
        cuspText: "2, 5, 7, 10, 11",
        dashaText: "2, 5, 7, 10, 11",
        remarks: "5 = Speculation,\\n10 = Taking share Market as His Proffession.\\n12 = Increase in his Bank Balance.\\n7 = His Custommers.\\n1 = Gain in his Business.\\nAlso to check 5th Csl's Signification of 2, 5, 6, 11."
    },
    {
        about: "Sale of Immovable Property",
        cuspText: "3, 5, 10",
        dashaText: "3, 5, 10",
        remarks: "MA is Karaka for Building.\\nSA for Land."
    },
    {
        about: "Inheriting Property",
        cuspText: "2, 10, 11",
        dashaText: "2, 10, 11",
        remarks: "10 = 2nd To 9th Governs Patrimony or one's inheritance. If 6 is involved, there will be Litigation. If 8 there will be Tensions, Obstacles."
    },
    {
        about: "Wife is Destined to Get Property",
        cuspText: "5, 8, 10",
        dashaText: "5, 8, 10",
        remarks: "5, 8, 10 = 2, 4, 11 from 7th. at the same time Native may Lose his Profession."
    },
    {
        about: "Earning Money Through Illegal Means",
        cuspText: "SA 11",
        dashaText: "SA 11",
        remarks: ""
    },
    {
        about: "Loss of Reputation & Money / Income Tax Trouble / Ill Fame",
        cuspText: "7, 8, 12",
        dashaText: "7, 8, 12",
        remarks: "Criminal Proceedings,\\n7 = Court Procedure.\\n8 = Infamous,\\n12 = Crime.\\nalso to check 12th CSL Signification of 8 & 12."
    },
    {
        about: "Honorable Life but poor",
        cuspText: "1, 3, 9, 10",
        dashaText: "1, 3, 9, 10",
        remarks: ""
    },
    {
        about: "Royal Living",
        cuspText: "2, 6, 9, 11",
        dashaText: "2, 6, 9, 11",
        remarks: ""
    },
    {
        about: "Poor Living",
        cuspText: "8, 12",
        dashaText: "8, 12",
        remarks: ""
    },
    {
        about: "Obstacles, Impediments & Mental Agony in Service Matters",
        cuspText: "1 & 8, 5 OR 9",
        dashaText: "1 & 8, 5 OR 9",
        remarks: "Also to check 6th CSL for the same Signification."
    },
    {
        about: "Will Resign from Service",
        cuspText: "1, 3, 8, 9, 10",
        dashaText: "1, 3, 8, 9, 10",
        remarks: "3 = Writing Resignation,\\n8 = Making impossible to continue in service.\\nalso check 6th CSL."
    },
    {
        about: "Anticipated Promotion will be Delayed",
        cuspText: "2, 3, 5, 10",
        dashaText: "2, 3, 5, 10",
        remarks: "Also it indicates Dull in Business."
    }
];



export const ELEVENTH_CUSP_COMBINATIONS: CombinationRule[] = [
    {
        about: "Gain of Money / Wealth",
        cuspText: "2, 6, 11",
        dashaText: "2, 6, 11",
        remarks: "Large Income / Profit, Amasing Wealth. Also to check 2nd & 6th CSL."
    },
    {
        about: "Loss of Money / Wealth",
        cuspText: "5, 8, 12",
        dashaText: "5, 8, 12",
        remarks: "Also an indication of suffering in Life. Also to check 2nd & 6th CSL"
    },
    {
        about: "Safety from Danger / Cure / Recovery",
        cuspText: "1, 5, 11",
        dashaText: "1, 5, 11",
        remarks: "Also to check 1st, 6th, 8th & 12th CSL for the same Signification.\\n1 = Health 5, 11, 12 To 6, 12."
    },
    {
        about: "No Cure",
        cuspText: "6, 12",
        dashaText: "6, 12",
        remarks: "4, 6, 12 = Treatment at home & No Cure.\\n3, 6, 11 & 12 = Successful Treatment in the Hospital.\\nalso to check 5th & 6th CSL."
    },
    {
        about: "Free of Disease",
        cuspText: "6, 11",
        dashaText: "6, 11",
        remarks: "Winning from disease"
    },
    {
        about: "Promotion / Reinstatement / Gain In Occupation",
        cuspText: "2, 6, 10, 11",
        dashaText: "2, 6, 10, 11",
        remarks: "If CSL is Connected to 1, 5, 9, 12 no Reinstatement. also to check 6th & 10th CSL for the Same."
    },
    {
        about: "Profit in Business",
        cuspText: "2, 7, 10, 11",
        dashaText: "2, 7, 10, 11",
        remarks: "Also to check 7th & 10th CSL\\n1, 2, 11 = Success in any Enterprise."
    },
    {
        about: "Success in Education",
        cuspText: "4, 9, 11",
        dashaText: "4, 9, 11",
        remarks: "4, 11 = Lower-level Education.\\n9, 11 = Higher Education.\\nalso to check the main 4th CSL."
    },
    {
        about: "Further Study (Master, Ph.d.)",
        cuspText: "4, 8, 9, 10, 11",
        dashaText: "4, 8, 9, 10, 11",
        remarks: "Also to check 9th CSL."
    },
    {
        about: "Foreign Further Study",
        cuspText: "6, 9, 11, 12",
        dashaText: "3, 6, 9, 11, 12",
        remarks: "Also to cross check 4th & 9th CSL for Education Level."
    },
    {
        about: "Hidden Treasure Under Earth",
        cuspText: "4, 11",
        dashaText: "4, 11",
        remarks: "Check 8th CSL also."
    },
    {
        about: "Success in all",
        cuspText: "6, 10, 11",
        dashaText: "6, 10, 11",
        remarks: ""
    },
    {
        about: "Loss in Computation",
        cuspText: "5, 8, 12",
        dashaText: "5, 8, 12",
        remarks: "Check in 6th CSL also."
    },
    {
        about: "Marriage Life with Mutual Understanding",
        cuspText: "2, 5, 7, 11",
        dashaText: "2, 5, 7, 11",
        remarks: "7, 11 = Good Wife, and Married Life also."
    },
    {
        about: "Unhappy Married Life",
        cuspText: "4, 6, 8, 10, 12",
        dashaText: "4, 6, 8, 10, 12",
        remarks: "Misunderstanding, Difference of opinion, Quarreling, Man Handling, Frequent Separations Etc."
    },
    {
        about: "Reunion with Spouse (Husband)",
        cuspText: "2, 7, 11",
        dashaText: "2, 7, 11",
        remarks: "Check 7th CSL also."
    },
    {
        about: "Reunion with Spouse (wife)",
        cuspText: "5, 6, 7, 11",
        dashaText: "5, 6, 7, 11",
        remarks: "Check 7th CSL also."
    },
    {
        about: "Reunion with Friends and Family",
        cuspText: "3, 9, 11",
        dashaText: "3, 9, 11",
        remarks: "Check 12th CSL also."
    },
    {
        about: "Reunion with Missing Person",
        cuspText: "2, 4, 6, 11",
        dashaText: "2, 8, 11",
        remarks: "3, 9, 12 Run Away."
    },
    {
        about: "Benefit or help from Friends",
        cuspText: "1, 2, 3, 6, 10, 11",
        dashaText: "1, 2, 3, 6, 10, 11",
        remarks: ""
    },
    {
        about: "Loss from Friends",
        cuspText: "4, 5, 7, 8, 9, 12",
        dashaText: "4, 5, 7, 8, 9, 12",
        remarks: ""
    },
    {
        about: "Unreliable Friend",
        cuspText: "7, 8, 9",
        dashaText: "7, 8, 9",
        remarks: ""
    },
    {
        about: "Attainment of Spiritual Life",
        cuspText: "5, 10, 11",
        dashaText: "5, 10, 11",
        remarks: "5 = Initiation (Mantra),\\n10 = Practice,\\n11 = Achievement.\\ncheck 1st and 9th CSL Also."
    },
    {
        about: "Getting Passport or Visa",
        cuspText: "3, 9, 11, 12",
        dashaText: "3, 9, 11, 12",
        remarks: "Check 12th CSL also for Promise or Foreign Going."
    },
    {
        about: "Green Card",
        cuspText: "1, 6, 11",
        dashaText: "1, 6, 11",
        remarks: "1 = Own effort,\\n11 = Success."
    },
    {
        about: "Prosperity of an Institute",
        cuspText: "6, 10",
        dashaText: "6, 10",
        remarks: "12th House Indicates Investment"
    },
    {
        about: "Popular in Acting",
        cuspText: "5, 11 ME, VE",
        dashaText: "5, 11",
        remarks: "If 11th CSL is MA, he will get Villain chance. Check 5th CSL also."
    },
    {
        about: "Realization of Amount Lent",
        cuspText: "2, 11",
        dashaText: "2, 11",
        remarks: "2= Money Matters including Loan, 11 = Principal & Interest of Loan given / also Fulfillment of Desires."
    },
    {
        about: "Satisfactory Spiritual Life",
        cuspText: "5, 10",
        dashaText: "5, 10",
        remarks: "5 = Poorva Punya and Spiritual Transformation on Initiation, Mantra. 10 = Regular Practice of Spirituality. Also check 1st, 9th and 12th CSL."
    }
];



export const TWELFTH_CUSP_COMBINATIONS: CombinationRule[] = [
    {
        about: "Foreign Going",
        cuspText: "3, 9, 12",
        dashaText: "3, 9, 12",
        remarks: "Check 9th Csl Also"
    },
    {
        about: "Stay in Mother Land",
        cuspText: "2, 4, 11",
        dashaText: "2, 4, 11",
        remarks: ""
    },
    {
        about: "Coming back from abroad",
        cuspText: "3, 9, 11 or 2, 4, 11",
        dashaText: "3, 9, 11 or 2, 4, 11",
        remarks: "Reunion with kids and friends. for Grouping 3, 9, 12 is for Better Result"
    },
    {
        about: "Going Abroad for Job / Business",
        cuspText: "3, 6, 9, 10, 12 + 7",
        dashaText: "3, 6, 9, 10, 12 + 7",
        remarks: "Check 10th CSL also.\\n7 = Business Trip,\\n6 = Service,\\n10 = Profession."
    },
    {
        about: "Going Abroad for Studies",
        cuspText: "3, 9, 11, 12 + 4",
        dashaText: "3, 9, 11, 12 + 4",
        remarks: "Check 4th and 9th CSL also."
    },
    {
        about: "Gain In Foreign Land",
        cuspText: "2, 3, 6, 10, 11",
        dashaText: "2, 3, 6, 10, 11",
        remarks: ""
    },
    {
        about: "Foreign Settlement",
        cuspText: "1, 3, 9, 10, 12",
        dashaText: "1, 3, 9, 10, 12",
        remarks: "12th CSL is movable sign Indicates Leaving Present place and Never Return. 11th CSL has 11, and 12 combination or Lagna or 4th lord in 9th House Indicates Living in Foreign Place."
    },
    {
        about: "Imprisonment",
        cuspText: "2, 3, 8, 12 RA",
        dashaText: "2, 3, 8, 12",
        remarks: "Rahu Primarily Involved"
    },
    {
        about: "Release from Jail",
        cuspText: "2, 4, 11 or 6, 11",
        dashaText: "2, 4, 11 or 6, 11",
        remarks: "For Getting Bail also same combination with (6, 10, 11)."
    },
    {
        about: "Restriction in House",
        cuspText: "4, 8, 12",
        dashaText: "4, 8, 12",
        remarks: ""
    },
    {
        about: "Getting Bail",
        cuspText: "6, 10 or 6, 11",
        dashaText: "6, 10 or 6, 11",
        remarks: ""
    },
    {
        about: "Suicide",
        cuspText: "1, 6, 8, 12\\nMA, RA Badhaka, Maraka",
        dashaText: "1, 6, 8, 12\\nMA, RA Badhaka, Maraka",
        remarks: "Check 1st and 8th CSL also."
    },
    {
        about: "Danger to Life",
        cuspText: "8, 12 Badhaka",
        dashaText: "6, 8, 12 Badhaka, Maraka",
        remarks: "Check 1st And 8th CSL also as well as Longevity."
    },
    {
        about: "Recovery / Cure",
        cuspText: "1, 5, 11",
        dashaText: "1, 5, 11",
        remarks: "Also check 1st, 6th, 8th and 11th CSL."
    },
    {
        about: "Move from one place to another Place",
        cuspText: "3, 12",
        dashaText: "3, 12",
        remarks: "Never Returnds Home.\\n7 = Going many Places."
    },
    {
        about: "Good Luck",
        cuspText: "2, 6, 11",
        dashaText: "2, 6, 11",
        remarks: ""
    }
];



// --- END EMBEDDED DATA ---


interface CombinationTabProps {
    data: NakshatraNadiItem[];
    planets?: Planet[];
    dasha?: any;
}

const ALL_PLANETS = [
    'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'
];

export const CombinationTab: React.FC<CombinationTabProps> = ({ data, dasha }) => {
    const [selectedCusp, setSelectedCusp] = useState<number>(1);
    const [selectedPlanet, setSelectedPlanet] = useState<string>('Sun');

    const getCombinations = () => {
        if (selectedCusp === 1) return FIRST_CUSP_COMBINATIONS;
        if (selectedCusp === 2) return SECOND_CUSP_COMBINATIONS;
        if (selectedCusp === 3) return THIRD_CUSP_COMBINATIONS;
        if (selectedCusp === 4) return FOURTH_CUSP_COMBINATIONS;
        if (selectedCusp === 5) return FIFTH_CUSP_COMBINATIONS;
        if (selectedCusp === 6) return SIXTH_CUSP_COMBINATIONS;
        if (selectedCusp === 7) return SEVENTH_CUSP_COMBINATIONS;
        if (selectedCusp === 8) return EIGHTH_CUSP_COMBINATIONS;
        if (selectedCusp === 9) return NINTH_CUSP_COMBINATIONS;
        if (selectedCusp === 10) return TENTH_CUSP_COMBINATIONS;
        if (selectedCusp === 11) return ELEVENTH_CUSP_COMBINATIONS;
        if (selectedCusp === 12) return TWELFTH_CUSP_COMBINATIONS;
        return [];
    };
    const combinations = getCombinations();

    const getMatchResult = (planetName: string, text: string) => {
        if (!text) return { status: 'Unknown', ratio: 0, matches: 0, total: 0 };
        
        const planetData = data.find(d => d.planet === planetName);
        if (!planetData) return { status: 'Unknown', ratio: 0, matches: 0, total: 0 };
        
        const allHouses = new Set<number>();
        
        const addHouses = (houses: { house: number }[]) => {
            if (!houses) return;
            houses.forEach(h => {
                allHouses.add(h.house);
            });
        };
        
        addHouses(planetData.pl_signified);
        addHouses(planetData.nl_signified);
        addHouses(planetData.sl_signified);
        
        const groups = text.toLowerCase().split('or');
        
        let maxRatio = 0;
        let bestMatchCount = 0;
        let bestTotalCount = 0;
        
        groups.forEach(group => {
            const numbersMatch = group.match(/\b\d+\b/g);
            if (numbersMatch) {
                const reqNumbers = numbersMatch.map(Number);
                const total = reqNumbers.length;
                if (total === 0) return;
                const matched = reqNumbers.filter(n => allHouses.has(n)).length;
                const ratio = matched / total;
                if (ratio > maxRatio || (ratio === maxRatio && total > bestTotalCount)) {
                    maxRatio = ratio;
                    bestMatchCount = matched;
                    bestTotalCount = total;
                }
            }
        });
        
        if (bestTotalCount === 0) return { status: 'Unknown', ratio: 0, matches: 0, total: 0 };
        
        if (maxRatio >= 0.8) {
            return { status: 'Applicable', ratio: maxRatio, matches: bestMatchCount, total: bestTotalCount };
        } else if (maxRatio >= 0.66) {
            return { status: 'Applicable with Conditions', ratio: maxRatio, matches: bestMatchCount, total: bestTotalCount };
        } else {
            return { status: 'Not Applicable', ratio: maxRatio, matches: bestMatchCount, total: bestTotalCount };
        }
    };

    const dName = dasha?.current_dasha?.split('-')[0]?.trim();
    const bName = dasha?.current_bukthi?.split('-')[0]?.trim();
    const aName = dasha?.current_antara?.split('-')[0]?.trim();

    return (
        <div style={{ padding: '16px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: 900, color: '#1e293b' }}>
                Combination Analysis
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Select Cusp</label>
                    <select 
                        value={selectedCusp} 
                        onChange={e => setSelectedCusp(Number(e.target.value))}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#f8fafc',
                            fontWeight: 700,
                            color: '#0f172a',
                            fontSize: '0.95rem'
                        }}
                    >
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
                            <option key={c} value={c}>{c}{['st','nd','rd'][((c+90)%100-10)%10-1]||'th'} Cusp</option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Select Planet</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {ALL_PLANETS.map(p => {
                            const isD = p === dName;
                            const isB = p === bName;
                            const isA = p === aName;
                            const labels = [];
                            if (isD) labels.push('D');
                            if (isB) labels.push('B');
                            if (isA) labels.push('A');
                            const isDBA = labels.length > 0;
                            const isSelected = selectedPlanet === p;
                            
                            return (
                                <button
                                    key={p}
                                    onClick={() => setSelectedPlanet(p)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: isSelected ? '2px solid #1d4ed8' : (isDBA ? '2px solid #16a34a' : '1px solid #cbd5e1'),
                                        background: isSelected ? '#eff6ff' : (isDBA ? '#dcfce7' : '#ffffff'),
                                        color: isSelected ? '#1d4ed8' : (isDBA ? '#16a34a' : '#475569'),
                                        fontWeight: (isSelected || isDBA) ? 900 : 600,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {p} {isDBA && <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>({labels.join(',')})</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {combinations.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', color: '#64748b', fontWeight: 600 }}>
                    Combinations for {selectedCusp} Cusp are not yet available.
                </div>
            ) : (
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxWidth: '100vw' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000', fontSize: '0.8rem' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9' }}>
                                <th style={{ border: '1px solid #000000', padding: '6px 4px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', width: '15%' }}>ABOUT</th>
                                <th style={{ border: '1px solid #000000', padding: '6px 4px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', width: '18%' }}>CUSP / DASHA REQUIRED</th>
                                <th style={{ border: '1px solid #000000', padding: '6px 4px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', width: '12%' }}>STATUS</th>
                                <th style={{ border: '1px solid #000000', padding: '6px 4px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', width: '10%' }}>D B A</th>
                                <th style={{ border: '1px solid #000000', padding: '6px 4px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', width: '45%' }}>REMARKS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {combinations.map((comb, idx) => {
                                // 1. Match selected planet against CUSP rule
                                const cuspResult = getMatchResult(selectedPlanet, comb.cuspText);
                                
                                // 2. Match DBA planets against DASHA rule
                                const dResult = getMatchResult(dName, comb.dashaText);
                                const bResult = getMatchResult(bName, comb.dashaText);
                                const aResult = getMatchResult(aName, comb.dashaText);
                                
                                const dbaMatches = [];
                                if (dResult.status === 'Applicable' || dResult.status === 'Applicable with Conditions') dbaMatches.push('D');
                                if (bResult.status === 'Applicable' || bResult.status === 'Applicable with Conditions') dbaMatches.push('B');
                                if (aResult.status === 'Applicable' || aResult.status === 'Applicable with Conditions') dbaMatches.push('A');
                                
                                // The main row matching focuses on the CUSP result (if any), otherwise DBA result
                                const isCuspMatching = (cuspResult.status === 'Applicable' || cuspResult.status === 'Applicable with Conditions');
                                const isDbaMatching = dbaMatches.length > 0;
                                const isMatching = (comb.cuspText && isCuspMatching) || (!comb.cuspText && isDbaMatching);
                                
                                // For display in STATUS col, use cuspResult if CUSP text exists, else show Dasha summary
                                const displayResult = comb.cuspText ? cuspResult : dResult; // Fallback
                                
                                const remarkColor = isMatching ? '#dcfce7' : '#fef9c3'; // light green vs light yellow
                                const statusColor = displayResult.status === 'Applicable' ? '#16a34a' : (displayResult.status === 'Applicable with Conditions' ? '#ca8a04' : '#dc2626');

                                return (
                                    <tr key={idx} style={{ background: '#ffffff', transition: 'background 0.2s' }}>
                                        <td style={{ border: '1px solid #000000', padding: '6px 4px', fontWeight: 800, color: '#1e293b' }}>
                                            {comb.about}
                                        </td>
                                        <td style={{ border: '1px solid #000000', padding: '6px 4px', fontWeight: 700, color: '#334155' }}>
                                            {comb.cuspText && <div><span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>CUSP:</span> {comb.cuspText}</div>}
                                            {comb.dashaText && <div style={{ marginTop: comb.cuspText ? '4px' : '0' }}><span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>DASHA:</span> {comb.dashaText}</div>}
                                        </td>
                                        <td style={{ border: '1px solid #000000', padding: '6px 4px', textAlign: 'center', fontWeight: 900 }}>
                                            {!comb.cuspText ? (
                                                <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>See DBA</span>
                                            ) : displayResult.status === 'Unknown' ? (
                                                <span style={{ color: '#94a3b8' }}>-</span>
                                            ) : (
                                                <div>
                                                    <div style={{ color: statusColor, textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '2px' }}>
                                                        {displayResult.status}
                                                    </div>
                                                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>
                                                        ({displayResult.matches}/{displayResult.total} matched)
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ border: '1px solid #000000', padding: '6px 4px', textAlign: 'center', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px', color: '#1d4ed8' }}>
                                            {dbaMatches.length > 0 ? dbaMatches.join(' ') : <span style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>-</span>}
                                        </td>
                                        <td style={{ border: '1px solid #000000', padding: '6px 4px', background: (comb.cuspText || comb.dashaText) ? remarkColor : 'transparent', fontWeight: 600, color: '#334155', lineHeight: '1.3', fontSize: '0.75rem' }}>
                                            {comb.remarks || '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
export default CombinationTab;
