import { InputForm } from "@/app/input/InputForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seelenplan-Generator Eingabe",
  description: "Namenseingabe für den Seelenplan",
};

export default function InputPage() {
  return (
    <main>
      <h1 className="text-2xl font-bold text-center text-gray-600 py-4">
        Vollständiger Name
      </h1>
      <InputForm />
    </main>
  );
}
