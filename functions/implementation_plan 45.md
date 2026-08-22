# Combination Tab Implementation Plan

This plan details the addition of a new "Combination" tab to the application, specifically focusing on the 1st Cusp general combinations provided in the photos.

## Proposed Changes

### 1. New "Combination" Tab in App.tsx
- Add a new main tab called "Combination" right after the "Prediction" tab.
- This tab will render a new component: `CombinationTable`.

### 2. CombinationTable Component
- **Cusp Selector**: A dropdown or row of buttons to select the Cusp (1st to 12th). Initially, only the 1st Cusp will have data.
- **Planet Selector**: A row of buttons to select a Planet (Sun, Moon, Mars, etc.).
- **Data Table**: A table displaying the combination rules for the selected Cusp.
  - Columns: `ABOUT`, `CUSP`, `DASHA`, `REMARKS`, `STATUS` (Applicable / Not Applicable).

### 3. Data Structure for 1st Cusp Combinations
I will transcribe the rules from the photos into a structured format:
```typescript
const FIRST_CUSP_COMBINATIONS = [
  {
    about: "Very Strong Lagna",
    cuspText: "1, 2, 4, 9, 10, 11",
    dashaText: "",
    remarks: "If Lagna lord is placed in 2nd or 10th or 11th house and if not connected to Badhaka that Lagna will be very strong.",
    // Matching logic to be defined
  },
  // ... all other rules from photos
];
```

### 4. Matching Logic (NEEDS CLARIFICATION)
> [!IMPORTANT]  
> **How should we determine if a combination is "Applicable"?**
> When you select a planet (e.g., Sun), we look at the houses it signifies (its own houses, Nakshatra Lord's houses, and Sub Lord's houses). 
> 
> If a rule says `1, 6 or 1, 12`, does the planet need to signify **ALL** numbers in a group (i.e., both 1 AND 6) for it to be applicable?
> For a long rule like `1, 2, 4, 9, 10, 11`, does the planet need to signify **ALL** 6 numbers, or just **SOME/ANY** of them to be applicable?

## Verification Plan
1. Ensure the new "Combination" tab appears correctly.
2. Verify the Cusp and Planet selectors work.
3. Check the table rendering and ensure the "Status" column correctly highlights "Applicable" in green based on the matching logic.
