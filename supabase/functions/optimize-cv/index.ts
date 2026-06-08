import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvData, jobDescription, language } = await req.json();

    // Gunakan gateway Lovable atau OpenAI/Gemini (bisa disesuaikan di ENV Supabase)
    const AI_API_KEY = Deno.env.get("LOVABLE_API_KEY") || Deno.env.get("OPENAI_API_KEY");

    if (!AI_API_KEY) {
      throw new Error("AI API KEY is not configured");
    }

    const systemPrompt = `You are an expert ATS Resume Optimizer.
Analyze the provided CV Data against the given Job Description.
Return ONLY a JSON response matching this exact structure:
{
  "matchScore": 75,
  "missingSkills": ["REST API", "Docker"],
  "topKeywords": ["Flutter", "Dart", "Firebase"],
  "improvements": ["Gunakan metrik pada pencapaian", "Tambahkan keyword Docker"],
  "optimizedCvData": {
    // This should be the original CV data, but with workExperience bullet points rewritten
    // to include the missing skills/keywords naturally and using action-verbs (X-Y-Z format).
  }
}`;

    const userContent = `
=== JOB DESCRIPTION ===
${jobDescription}

=== CURRENT CV DATA ===
${JSON.stringify(cvData)}

Analyze and return the JSON response.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", // Atau ganti dengan gpt-4o
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (e) {
      throw new Error("Gagal parsing hasil AI");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
