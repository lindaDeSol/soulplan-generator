"use client";

import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

import AccordeonArrow from "@/components/ui/accordeonArrow";

export default function SoulplanPage() {
  const fullname = useAppStore((state) => state.fullname);
  const processedSums = useAppStore((state) => state.processedSums);
  const soulNumber = useAppStore((state) => state.soulNumber);
  const dominantNumbers = useAppStore((state) => state.dominantNumbers);
  const [openIndices, setOpenIndices] = useState<number[]>([]);
  const [isDominantOpen, setIsDominantOpen] = useState(false);
  const [isSoulNumberOpen, setIsSoulNumberOpen] = useState(false);

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

  const toggleSoulNumberAccordion = () => {
    setIsSoulNumberOpen(!isSoulNumberOpen);
  };

  return (
    <main className="soulplan-description">
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
              <AccordeonArrow isOpen={openIndices.includes(index)} />
            </button>
            {openIndices.includes(index) && (
              <div
                className="text-sm text-gray-600 mt-4 mb-6 max-w-[730px]"
                dangerouslySetInnerHTML={{ __html: sum.description || "" }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="border-b border-gray-300 pb-2 mb-2">
        <h3
          className="w-full text-left text-lg font-bold text-green-600 flex justify-between items-center"
          onClick={toggleSoulNumberAccordion}
        >
          <span>
            <strong>Seelenbestimmung</strong>: {soulNumber.reduced} -{" "}
            {soulNumber.singleDigit}
          </span>
          <AccordeonArrow isOpen={isSoulNumberOpen} />
        </h3>
        {isSoulNumberOpen && (
          <p className="text-sm text-gray-600 mt-2">
            Hier kann eine ausführliche Erklärung zur Seelenbestimmung stehen...
          </p>
        )}
      </div>
      {dominantNumbers.length > 0 && (
        <div className="border-b border-gray-300 pb-2 mb-2">
          <button
            className="w-full text-left text-lg  font-bold text-blue-600 flex justify-between items-center"
            onClick={toggleDominantAccordion}
          >
            <span>
              Dominante Schwingung{dominantNumbers.length > 1 ? "(en)" : ""}:{" "}
              {dominantNumbers.join(", ")}
            </span>
            <AccordeonArrow isOpen={isDominantOpen} />
          </button>
          {isDominantOpen && (
            <p className="text-sm text-gray-700 block mt-2">
              Das bedeutet, dass du diese Energien besonders stark erfährst und
              darin eine bestimmte Seelenbotschaft für dich enthalten ist.
              Ungefähr 50% aller Menschen haben eine dominante Schwingung. Es
              spielt keine Rolle, ob man eine hat oder nicht. Wenn du keine
              dominante Schwingung hast, wird die Zahl deiner Seelenbotschaft
              dieselbe sein wie deine Seelenbestimmung.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
