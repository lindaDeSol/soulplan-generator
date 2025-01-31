"use client";

import React, { use, useEffect } from "react";
import { put } from "@vercel/blob";

import { useAppStore } from "../store/useAppStore";

export default function SoulplanPage() {
  const fullname = useAppStore((state) => state.fullname);
  const processedSums = useAppStore((state) => state.processedSums);
  const soulNumber = useAppStore((state) => state.soulNumber);
  const dominantNumber = useAppStore((state) => state.dominantNumber);

  //todo: fullname an useEffect übergeben

  useEffect(() => {
    // 1. Logs in eine JSON-Datei auf dem Server speichern (Vercel Blob Storage)
    //Logs im Admin-Panel ansehen - pages/admin.js mit login
    const { url } = await put("articles/blob.txt", "Log Name " + fullname, {
      access: "public",
    });
  }, [fullname]);

  return (
    <main>
      <h1 className="text-2xl font-bold text-center text-gray-600 py-4">
        Seelenplan
      </h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        für: {fullname}
      </h2>
      <div className="text-lg text-gray-700 mb-6">
        {processedSums.map((sum) => (
          <p
            key={sum.label}
            className="mb-2 text-gray-700 border-b border-gray-300 pb-1"
          >
            <strong>{sum.label}</strong>: {sum.reduced} - {sum.singleDigit}
          </p>
        ))}
      </div>
      <h3 className="text-xl font-bold text-green-600 pb-4">
        <strong>Seelenbestimmung</strong>: {soulNumber.reduced} -{" "}
        {soulNumber.singleDigit}
      </h3>
      {dominantNumber > 0 && (
        <p className="text-xl font-bold text-blue-600">
          <strong>Dominante Schwingung</strong>: {dominantNumber}
        </p>
      )}
    </main>
  );
}
