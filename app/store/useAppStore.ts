import { create } from "zustand";

// Define the type for the store state
interface StoreState {
  fullname: string;
  isShortName: boolean;
  processedSums: {
    label: string;
    original: number;
    reduced: number;
    singleDigit: number;
  }[];
  soulNumber: {
    label: string;
    reduced: number;
    singleDigit: number;
  };
  dominantNumber: number;
  setFullname: (name: string) => void;
  calculateSoulPlan: () => void;
}

export const useAppStore = create<StoreState>((set, get) => ({
  fullname: "",
  isShortName: false,
  processedSums: [],
  soulNumber: { label: "", reduced: 0, singleDigit: 0 },
  dominantNumber: 0,
  setFullname: (name) => set({ fullname: name }),

  // Function to calculate the soul plan
  calculateSoulPlan: () => {
    // Get the full name and clean it
    let name = get().fullname.toUpperCase();

    // Replace Umlaute
    name = name.replace(/Ä/g, "AE");
    name = name.replace(/Ö/g, "OE");
    name = name.replace(/Ü/g, "UE");

    // Replace non letter characters to spaces
    name = name.replace(/[^A-Z]/g, " ");

    const countLetters = name.split("").filter((char) => char !== " ").length;
    if (countLetters <= 9) {
      set({ isShortName: true });
    } else {
      set({ isShortName: false });
    }

    const letterValues: Record<string, number> = {
      A: 1,
      B: 2,
      C: 11,
      D: 4,
      E: 5,
      F: 17,
      G: 3,
      H: 5,
      I: 10,
      J: 10,
      K: 19,
      L: 12,
      M: 13,
      N: 14,
      O: 6,
      P: 17,
      Q: 19,
      R: 20,
      S: 15,
      T: 9,
      U: 6,
      V: 6,
      W: 6,
      X: 15,
      Y: 16,
      Z: 7,
      AH: 5,
      CH: 8,
      SH: 21,
      TA: 22,
      TH: 22,
      TZ: 18,
      WH: 16,
    };

    const letterCombinations: Record<string, number> = {
      AH: 5,
      CH: 8,
      SH: 21,
      TA: 22,
      TH: 22,
      TZ: 18,
      WH: 16,
    };

    const labelOfArea = [
      "Irdische Herausforderung",
      "Spirituelle Herausforderung",
      "Irdisches Talent",
      "Spirituelles Talent",
      "Irdisches Ziel",
      "Spirituelles Ziel",
    ];

    const lastLetterValues: Record<string, number> = { M: 12, P: 12 };

    const crossSum = (value: number): number =>
      value > 9 ? Math.floor(value / 10) + (value % 10) : value;

    const crossSumAfter22 = (value: number): number =>
      value > 22 ? crossSum(value) : value;

    const sums = Array(6).fill(0);
    let index = 0;

    for (let i = 0; i < name.length; i++) {
      let char = name[i];

      // Check for combinations
      if (i < name.length - 1 && letterCombinations[name.substring(i, i + 2)]) {
        char = name.substring(i, i + 2);
        i++; // Skip next letter
      }

      // Check for last letter values
      const value =
        (i === name.length - 1 || name[i + 1] === "") && lastLetterValues[char]
          ? lastLetterValues[char]
          : letterValues[char] || 0;

      if (value > 0) {
        //short Names have same values for iridisch and spiritual
        if (get().isShortName) {
          if (index % 3 === 0) {
            sums[0] += value;
            sums[1] += value;
          } else if (index % 3 === 1) {
            sums[2] += value;
            sums[3] += value;
          }
          if (index % 3 === 2) {
            sums[4] += value;
            sums[5] += value;
          }
        }
        //long Names > 9
        else {
          sums[index % 6] += value;
        }
        index++;
      }
    }

    const processedSums = sums.map((sum, index) => ({
      label: labelOfArea[index],
      original: sum,
      reduced: crossSumAfter22(sum),
      singleDigit: crossSum(crossSum(crossSumAfter22(sum))),
    }));

    // Calculate the soul number
    let totalReduced = 0;

    if (get().isShortName) {
      totalReduced = crossSumAfter22(
        processedSums[0].reduced +
          processedSums[2].reduced +
          processedSums[4].reduced
      );
    } else {
      totalReduced = crossSumAfter22(
        processedSums.reduce((acc, { reduced }) => acc + reduced, 0)
      );
    }

    const totalSingleDigit = crossSum(totalReduced);

    // Combine all relevant numbers into one array
    const allNumbers = [
      ...processedSums
        .map(({ reduced, singleDigit }) => [reduced, singleDigit])
        .flat(),
      totalReduced,
      totalSingleDigit,
    ];

    // Count occurrences of each number
    const counts = allNumbers.reduce<Record<number, number>>((acc, num) => {
      acc[num] = (acc[num] || 0) + 1;
      return acc;
    }, {});

    //console.log("counts", counts);

    // Find the dominant number (key with at least 4 occurrences)
    const dominantNumber = !get().isShortName
      ? parseInt(
          Object.entries(counts).find(([_, count]) => count >= 4)?.[0] || "0",
          10
        )
      : 0;

    // Update state
    set({
      processedSums,
      soulNumber: {
        label: "Seelenbestimmung",
        reduced: totalReduced,
        singleDigit: totalSingleDigit,
      },
      dominantNumber: dominantNumber,
    });

    console.log("Summen:", get().processedSums);
    console.log("Seelenplan-Summe Gesamt:", get().soulNumber);
  },
}));
