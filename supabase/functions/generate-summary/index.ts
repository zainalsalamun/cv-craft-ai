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
    const { cvData, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { personalInfo, skills, workExperience, projects, education } = cvData;
    
    const role = personalInfo?.jobTitle || 'professional';
    const topSkills = skills?.slice(0, 5).map((s: any) => s.name).join(', ') || '';
    const recentExperience = workExperience?.[0];
    const recentProject = projects?.[0];
    const latestEducation = education?.[0];

    const languageInstructions = language === 'en' 
      ? 'Write the summaries in English.'
      : 'Tulis ringkasan dalam Bahasa Indonesia yang profesional dan natural.';

    const systemPrompt = `You are an expert CV/resume writer. Generate exactly 3 professional summary variants based on the provided CV data.

IMPORTANT RULES:
- ${languageInstructions}
- Do NOT invent or fabricate any information not provided
- Do NOT add specific years of experience if not explicitly provided
- Do NOT add metrics or numbers that weren't given
- Keep each summary between 2-4 sentences
- Make summaries ATS-friendly and recruiter-focused
- Each variant should have a different tone/style

Output format: Return a JSON object with this exact structure:
{
  "variants": [
    {"tone": "Standard", "summary": "..."},
    {"tone": "Impact-focused", "summary": "..."},
    {"tone": "Friendly", "summary": "..."}
  ]
}`;

    const userContent = `Generate 3 professional summary variants based on this CV data:

Role/Position: ${role}
${topSkills ? `Key Skills: ${topSkills}` : ''}
${recentExperience ? `Recent Experience: ${recentExperience.position} at ${recentExperience.company}${recentExperience.bullets?.length ? ` - ${recentExperience.bullets.slice(0, 2).join(', ')}` : ''}` : ''}
${recentProject ? `Notable Project: ${recentProject.name}${recentProject.description ? ` - ${recentProject.description}` : ''}` : ''}
${latestEducation ? `Education: ${latestEducation.degree} from ${latestEducation.institution}` : ''}

Generate the summaries now.`;

    console.log("Generating summary with Lovable AI...");
    console.log("Language:", language);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response received:", content);

    // Parse JSON from response
    let variants;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        variants = parsed.variants;
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      // Fallback: return raw content as single variant
      variants = [
        { tone: "Standard", summary: content },
        { tone: "Impact-focused", summary: content },
        { tone: "Friendly", summary: content }
      ];
    }

    return new Response(JSON.stringify({ variants }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-summary function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
