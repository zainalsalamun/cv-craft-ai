import * as pdfjsLib from 'pdfjs-dist';

// Define the worker script path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let fullText = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n\n";
        }
        
        resolve(fullText);
      } catch (error) {
        console.error("Error parsing PDF", error);
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

// A simple rule-based parser to guess sections (Very basic)
export function parseCVTextToData(text: string, fileName: string) {
  // Extract basic details
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  const fullName = baseName.split(/[-_ ]+/).map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');
  
  // Default structure
  const cvData = {
    personalInfo: {
      fullName: fullName,
      title: "",
      email: "",
      phone: "",
      location: "",
      website: ""
    },
    summary: "",
    workExperience: [] as any[],
    education: [] as any[],
    skills: [] as any[],
    projects: [],
    certificates: [],
    languages: [],
    hobbies: "",
    achievements: ""
  };

  // Try to find emails
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) cvData.personalInfo.email = emailMatch[0];

  // Try to find phone
  const phoneMatch = text.match(/(?:\+?62|0)[2-9]\d{7,11}/);
  if (phoneMatch) cvData.personalInfo.phone = phoneMatch[0];

  // We will just put the first 200 words as summary so the user can see it
  const words = text.split(/\s+/);
  cvData.summary = words.slice(0, 80).join(" ") + (words.length > 80 ? "..." : "");

  // Create a single dummy experience block with the rest of the text so it's not lost
  cvData.workExperience.push({
    id: "ext-1",
    company: "Hasil Ekstraksi (Raw Text)",
    position: "Harap edit/pisahkan manual ke form",
    startDate: "Sesuai PDF",
    endDate: "Sesuai PDF",
    bullets: text.substring(0, 1500).split(/(?:\n|•|- )/).map(s => s.trim()).filter(s => s.length > 10).slice(0, 5)
  });

  return cvData;
}
