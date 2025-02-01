import { create } from "zustand";

// Define the type for the store state
interface StoreState {
  fullname: string;
  isShortName: boolean;
  processedSums: {
    label: string;
    description?: string;
    original: number;
    reduced: number;
    singleDigit: number;
  }[];
  soulNumber: {
    label: string;
    reduced: number;
    singleDigit: number;
  };
  dominantNumbers: number[];
  setFullname: (name: string) => void;
  calculateSoulPlan: () => void;
  getSoulPlanExplanations: () => void;
}

export const useAppStore = create<StoreState>((set, get) => ({
  fullname: "Linda Formumm",
  isShortName: false,
  processedSums: [],
  soulNumber: { label: "", reduced: 0, singleDigit: 0 },
  dominantNumbers: [],
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
      "Irdische Herausforderungen",
      "Spirituelle Herausforderungen",
      "Irdische Talente",
      "Spirituelle Talente",
      "Irdische Ziele",
      "Spirituelle Ziele",
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

    // Find the dominant numbers (keys with at least 4 occurrences)
    function findKeysWithAtLeastFourOccurrences(counts: {
      [key: string]: number;
    }): string[] {
      return Object.keys(counts).filter((key) => counts[key] >= 4);
    }

    const dominantNumbers = !get().isShortName
      ? findKeysWithAtLeastFourOccurrences(counts).map((num) => parseInt(num))
      : [0];

    // Update state
    set({
      processedSums,
      soulNumber: {
        label: "Seelenbestimmung",
        reduced: totalReduced,
        singleDigit: totalSingleDigit,
      },
      dominantNumbers: dominantNumbers,
    });

    //console.log("Summen:", get().processedSums);
    //console.log("Seelenplan-Summe Gesamt:", get().soulNumber);
  },
  getSoulPlanExplanations: () => {
    // json aus dem Kindle Buch herauskopieren und in .env.local als Umgebungsvariabke hinterlegen
    // z.B.: DATASET_JSON=[{"id":1,"name":"Datensatz A","value":100},{"id":2,"name":"Datensatz B","value":200}]

    // API-Route zum Abrufen der JSON-Daten erstellen
    // in pages/api/dataset.js:

    //  Umgebungsvariable in Vercel speichern
    // Gehe zu Vercel → Settings → Environment Variables.

    //Daten im Frontend abrufen
    // im store mit useEffect und fetch die Daten abrufen
    // diese kann ich dann auf der Page verwenden

    // zu den processedSums einzeln ein neues Feld hinzufügen, in dem die Erklärung steht

    let soulNumbers = get().processedSums;

    soulNumbers[0].description = `
      Erklärung für Irdische Herausforderungen = negative Eigenschaften

      <h4>Erklärung Herausforderungen:</h4>
      <p>
      Du wirst nicht zwingend das ganze Potenzial der negativen Eigenschaften einer Energie 
      erfahren, auch wenn sie sich in deinem Chart in der Position der Herausforderungen 
      befindet. Einige Menschen müssen nur ein oder zwei Bereiche durcharbeiten oder nur 
      einfach achtsam sein, um sich vor auftauchenden Tendenzen oder Versuchungen zu 
      schützen. Es gibt auch jene Menschen, deren Hauptherausforderung es ist, Hindernisse 
      und Blockaden zu überwinden, um die positiven Eigenschaften der Energie zu verwirklichen.
      </p>
      <p>
      Positive Eigenschaften sind normalerweise schwieriger zu erlangen, wenn sich 
      die Energie in der Position der Herausforderungen befindet. 
      Hier sind eher einige Erfahrungen der negativen Eigenschaften vorhanden, 
      bis diese durchgearbeitet sind. Jedoch können deine größten Hindernisse schließlich 
      zu deiner größten Stärke transformiert werden. Es ist auch möglich, gelegentlich 
      Zugang zu positiven Merkmalen zu erhalten, bevor du deine Herausforderungen voll 
      durchgearbeitet hast.<br>
      Normalerweise ist dies aber ein Prozess, der Zeit braucht.</p>
    `;
    soulNumbers[1].description = `
      Erklärung für Spirituelle Herausforderungen = negative Eigenschaften
      <h4>Erklärung Herausforderungen:</h4>
      <p>
      Du wirst nicht zwingend das ganze Potenzial der negativen Eigenschaften einer Energie 
      erfahren, auch wenn sie sich in deinem Chart in der Position der Herausforderungen 
      befindet. Einige Menschen müssen nur ein oder zwei Bereiche durcharbeiten oder nur 
      einfach achtsam sein, um sich vor auftauchenden Tendenzen oder Versuchungen zu 
      schützen. Es gibt auch jene Menschen, deren Hauptherausforderung es ist, Hindernisse 
      und Blockaden zu überwinden, um die positiven Eigenschaften der Energie zu verwirklichen.
      </p>
      <p>
      Positive Eigenschaften sind normalerweise schwieriger zu erlangen, wenn sich 
      die Energie in der Position der Herausforderungen befindet. 
      Hier sind eher einige Erfahrungen der negativen Eigenschaften vorhanden, 
      bis diese durchgearbeitet sind. Jedoch können deine größten Hindernisse schließlich 
      zu deiner größten Stärke transformiert werden. Es ist auch möglich, gelegentlich 
      Zugang zu positiven Merkmalen zu erhalten, bevor du deine Herausforderungen voll 
      durchgearbeitet hast.<br>
      Normalerweise ist dies aber ein Prozess, der Zeit braucht.
      </p>
          
   `;
    soulNumbers[2].description = `
      Erklärung für Irdische Talente = positive Eigenschaften

      <h4>Erklärung Talente:</h4>
      <p>
      Talente enthalten manchmal einen ungewöhnlich hohen Grad an Begabung in einem 
      bestimmten Bereich. Dann sagen wir, jemand ist „begabt“. Aber eine solche Gabe 
      kann auch aus den Energien der Ziele oder sogar der Herausforderungen entstehen.<br> 
      Um Zugang zu den Talenten zu bekommen, weitere Aspekte zum Vorschein zu bringen 
      und dieses Potential weiterzuentwickeln, ist es wichtig <b>deine Talente zu nutzen.</b>
      </p>
      <p>
      <b>Irdische Talente</b> wie Kreativität, praktische Intelligenz, akademische Bildung, 
      Ausdruck, Logik, Sprache, Charme, Macht, Führung können sich bereits früh zeigen.
      </p>
    `;
    soulNumbers[3].description = `
      Erklärung für Irdische Talente = positive Eigenschaften

      <h4>Erklärung Talente:</h4>
      <p>
      Talente enthalten manchmal einen ungewöhnlich hohen Grad an Begabung in einem 
      bestimmten Bereich. Dann sagen wir, jemand ist „begabt“. Aber eine solche Gabe 
      kann auch aus den Energien der Ziele oder sogar der Herausforderungen entstehen.<br> 
      Um Zugang zu den Talenten zu bekommen, weitere Aspekte zum Vorschein zu bringen 
      und dieses Potential weiterzuentwickeln, ist es wichtig <b>deine Talente zu nutzen.</b>
      </p>
      <p>
      Die eher abstrakten <b>spirituellen Talente</b> (wie Intuition, Sensibilität,
      Medialität, Spiritualität) entwickeln sich dagegen meist etwas später 
      im Leben. Darum werden viele Menschen im spirituellen Bereich oft als „Spätzünder“ 
      bezeichnet.
    </p>
     `;
    soulNumbers[4].description = `
      Erklärung für Irdische Ziele = Bei den Zielen arbeitest du normalerweise darauf hin, 
      positive Eigenschaften zu erlangen und erfährst dabei beide Seiten, positive wie auch 
      negative. 
      <h4>Erklärung Ziele:</h4>
      <p>
      Wenn du aber deine Talente gut nutzt, wird es dir helfen, deine 
      Herausforderungen außer Kraft zu setzen, um Zugang zu den positiven Eigenschaften 
      deiner Ziele zu bekommen.
      </p>`;
    soulNumbers[5].description = `
      Erklärung für Spirituelle Ziele = Bei den Zielen arbeitest du normalerweise darauf hin, 
      positive Eigenschaften zu erlangen und erfährst dabei beide Seiten, positive wie auch 
      negative. 
     <h4>Erklärung Ziele:</h4>
    <p>
      Wenn du aber deine Talente gut nutzt, wird es dir helfen, deine 
      Herausforderungen außer Kraft zu setzen, um Zugang zu den positiven Eigenschaften 
      deiner Ziele zu bekommen.
     </p>`;
    set({ processedSums: soulNumbers });
  },
}));
