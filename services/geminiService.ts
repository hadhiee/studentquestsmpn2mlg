import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateQuestion = async (level: number, previousTopics: string[]): Promise<Question | null> => {
  if (!ai || !apiKey) {
    console.warn("Gemini API Key missing, using fallback questions.");
    return null;
  }

  const modelId = "gemini-3-flash-preview";

  let scope = "Dinasti Bani Umayyah (Umayyah 1 di Damaskus & Umayyah 2 di Andalusia/Spanyol)";
  if (level === 2) {
    scope = "Dinasti Abbasiyah di Baghdad (Masa Keemasan Islam, Baitul Hikmah, 1001 Malam)";
  }

  const systemInstruction = `
    Kamu adalah 'AI Chrono-Guide', asisten virtual guru Sejarah Kebudayaan Islam (SKI) untuk siswa SMP Kelas 7 di SMPN 2 Malang.
    Tugasmu adalah mensimulasikan perjalanan waktu melalui soal quiz pilihan ganda.
    
    Fokus Materi Level ${level} (${scope}):
    1. Tokoh-tokoh kunci dan kepemimpinannya.
    2. Penemuan sains dan teknologi (Kedokteran, Astronomi, Kimia, Matematika) yang masih digunakan hingga sekarang.
    3. Kehidupan sosial, toleransi, dan arsitektur (Masjid, Istana, Tata Kota).
    
    Format Output (JSON Only):
    {
      "text": "Pertanyaan quiz...",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "correctIndex": 0-3,
      "explanation": "Fakta sejarah menarik yang menjelaskan jawaban...",
      "topic": "Misal: Tokoh, Sains, atau Budaya",
      "difficulty": "Easy/Medium/Hard"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Buat satu soal quiz unik level ${level} tentang ${scope}.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            topic: { type: Type.STRING },
            difficulty: { type: Type.STRING }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;
    const parsed = JSON.parse(jsonText);

    return {
      id: Date.now().toString(),
      text: parsed.text,
      options: parsed.options,
      correctIndex: typeof parsed.correctIndex === 'number' ? parsed.correctIndex : 0,
      explanation: parsed.explanation || "Tidak ada penjelasan tersedia.",
      topic: parsed.topic || "Sejarah",
      difficulty: (parsed.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Medium'
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const generateStudentResponse = async (studentName: string, message: string): Promise<string> => {
  if (!ai || !apiKey) return "Sinyal temporal lemah...";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Pesan dari teman: "${message}"`,
      config: {
        systemInstruction: `
                    Kamu berperan sebagai ${studentName}, seorang siswa Kelas 7 SMPN 2 Malang yang sedang bermain game 'ChronoQuest'.
                    Gunakan gaya bicara anak SMP Gen-Z Indonesia (santai, sedikit gaul, pakai kata 'gue/lo' atau 'aku/kamu', selipkan emoji).
                    Kamu sedang berada di misi sejarah Umayyah. Respon pesan temanmu dengan semangat, kadang bahas soal sejarah yang sulit, atau ajak balapan skor.
                    Maksimal 15 kata.
                `,
      }
    });
    return response.text || "Semangat belajarnya!";
  } catch (e) {
    return "Lagi fokus ngerjain soal nih!";
  }
};

export const getHistoricalFact = async (): Promise<string> => {
  if (!ai || !apiKey) return "Tahukah kamu? Kota Cordoba punya perpustakaan terbesar di masanya.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Berikan satu fakta singkat (maksimal 20 kata) yang mencengangkan tentang teknologi/sains di masa kejayaan Islam untuk siswa SMP.",
    });
    return response.text || "Fakta sejarah sedang dimuat...";
  } catch (e) {
    return "Sistem database sejarah sedang mengalami gangguan.";
  }
}