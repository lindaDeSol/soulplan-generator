"use client";

import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

export default function SoulplanPage() {
  const fullname = useAppStore((state) => state.fullname);
  const processedSums = useAppStore((state) => state.processedSums);
  const soulNumber = useAppStore((state) => state.soulNumber);
  const dominantNumbers = useAppStore((state) => state.dominantNumbers);
  const [openIndices, setOpenIndices] = useState<number[]>([]);
  const [isDominantOpen, setIsDominantOpen] = useState(false);

  interface Sum {
    label: string;
    reduced: number;
    singleDigit: number;
  }

  interface SoulNumber {
    reduced: number;
    singleDigit: number;
  }

  const toggleAccordion = (index: number) => {
    setOpenIndices((prev: number[]) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleDominantAccordion = () => {
    setIsDominantOpen(!isDominantOpen);
  };

  return (
    <main>
      <h1 className="text-2xl font-bold text-center text-gray-600 py-4">
        Seelenplan
      </h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        für: {fullname}
      </h2>
      <div className="text-lg text-gray-700 mb-6">
        {processedSums.map((sum, index) => (
          <div key={sum.label} className="border-b border-gray-300 pb-2 mb-2">
            <button
              className="w-full text-left font-semibold text-gray-700 flex justify-between items-center"
              onClick={() => toggleAccordion(index)}
            >
              <span>
                <strong>{sum.label}</strong>: {sum.reduced} - {sum.singleDigit}
              </span>
              <span className="font-serif text-gray-500 text-l rotate-90 transform scale-y-150">
                {openIndices.includes(index) ? "<" : ">"}
              </span>
            </button>
            {openIndices.includes(index) && (
              <p className="text-sm text-gray-600 mt-2">
                Beschreibung für {sum.label} (Hier kann eine spezifische
                Erklärung stehen...)
              </p>
            )}
          </div>
        ))}
      </div>
      <h3 className="text-xl font-bold text-green-600 pb-4">
        <strong>Seelenbestimmung</strong>: {soulNumber.reduced} -{" "}
        {soulNumber.singleDigit}
      </h3>
      {dominantNumbers.length > 0 && (
        <div className="border-b border-gray-300 pb-2 mb-2">
          <button
            className="w-full text-left font-bold text-blue-600 flex justify-between items-center"
            onClick={toggleDominantAccordion}
          >
            <span>
              Dominante Schwingung{dominantNumbers.length > 1 ? "(en)" : ""}:{" "}
              {dominantNumbers.join(", ")}
            </span>
            <span className="font-serif text-gray-500 text-l rotate-90 transform scale-y-150">
              {isDominantOpen ? "<" : ">"}
            </span>
          </button>
          {isDominantOpen && (
            <span className="text-sm text-gray-700 block mt-2">
              Das bedeutet, dass du diese Energien besonders stark erfährst und
              darin eine bestimmte Seelenbotschaft für dich enthalten ist.
              Ungefähr 50% aller Menschen haben eine dominante Schwingung. Es
              spielt keine Rolle, ob man eine hat oder nicht. Wenn du keine
              dominante Schwingung hast, wird die Zahl deiner Seelenbotschaft
              dieselbe sein wie deine Seelenbestimmung.
            </span>
          )}
        </div>
      )}
    </main>
  );
}
