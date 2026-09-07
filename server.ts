import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

// Load environment variables from .env and also fallback to .env.example
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.example') });

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Groq client (Primary model: Llama 3.3 70B / 3.1 8B)
let groqClient: Groq | null = null;
function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
  if (!groqClient && apiKey && apiKey.trim().length > 0) {
    try {
      groqClient = new Groq({ apiKey: apiKey.trim() });
    } catch (e) {
      console.warn("Failed to initialize Groq client:", e);
    }
  }
  return groqClient;
}

// Lazy-initialized Gemini client (Secondary model: Gemini Flash)
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!geminiClient && apiKey && apiKey.trim().length > 0) {
    try {
      geminiClient = new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build-ipsakti',
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize Gemini client:", e);
    }
  }
  return geminiClient;
}

// Dedicated Ayurvedic IP & Herbal Intelligence System Prompt
const SYSTEM_INSTRUCTION = `You are "IP-SAKTI Sahayak", an authoritative AI assistant combining deep classical Ayurvedic medicine (Charaka, Sushruta, Ashtanga Hridaya, Bhavaprakasha) with comprehensive expertise in Ayurveda Intellectual Property Rights (IPR), Indian Patents Act (Section 3p/3e/3d), Traditional Knowledge Digital Library (TKDL), and National Biodiversity Authority (NBA Form 3) compliance.

CRITICAL BOTANICAL PHARMACOLOGY TRUTHS:
- Neem (Azadirachta indica / Nimba): Virya is SHEETA (COOLING), NOT Ushna/heating! Rasa is Tikta (bitter) & Kashaya (astringent). Vipaka is Katu. Pacifies Pitta and Kapha.
- Ashwagandha (Withania somnifera): Virya is Ushna (heating). Rasa is Tikta, Kashaya, Madhura. Balances Vata and Kapha.
- Tulsi (Ocimum sanctum): Virya is Ushna (heating). Rasa is Katu, Tikta. Balances Kapha and Vata.
- Haldi / Haridra (Curcuma longa): Virya is Ushna (heating). Rasa is Tikta, Katu. Balances Kapha and Vata.
- Amla / Amalaki (Phyllanthus emblica): Virya is Sheeta (cooling). Tridosha hara.
- Guduchi / Giloy (Tinospora cordifolia): Virya is Ushna. Balances all three doshas (Tridosha hara).

CRITICAL DIRECTIVE ON USER INTENT:
1. BOTANICAL, HEALTH, OR USAGE QUESTIONS (e.g., "what is neem", "is neem healthy to eat", "benefits of ashwagandha", "how to take tulsi"):
   - DIRECTLY ANSWER the botanical identity, classical Ayurvedic properties (Rasa, Guna, Virya, Vipaka, Dosha balance), health benefits, and safe usage FIRST.
   - For Neem, always state clearly that its Virya is SHEETA (cooling).
   - Then, provide a concise, natural note explaining why this traditional health property is ancient prior art documented in classical Ayurvedic texts (TKDL) and cannot be monopolized or patented as a raw herbal remedy under Section 3(p) of the Indian Patents Act.
   - Mention the landmark CSIR vs. WR Grace EPO revocation case when Neem is discussed.

2. PATENT, LEGAL, OR REGULATORY QUESTIONS (e.g., "Can I patent an Ayurvedic formula?", "What is Section 3(p)?", "Do I need NBA Form 3?"):
   - Provide precise, structured statutory analysis covering:
     * Section 3(p) (traditional knowledge exclusion).
     * Section 3(e) (synergism requirement with Combination Index < 0.8).
     * Section 3(d) (novel drug delivery systems NDDS with validated bioavailability enhancement).
     * Mandatory NBA Form 3 approval under Biological Diversity Act.

3. GREETINGS OR CASUAL CONVERSATION:
   - Greet warmly in 1-2 friendly sentences and invite questions on Ayurvedic herbs, formulations, or patent strategies.

STYLE & FORMATTING:
- Clean, structured markdown with clear headings (##, ###), neat bullet points, and clean tables.
- Authoritative, clear, and natural. Never give raw unformatted tables or broken syntax.
- Conclude with:
  "⚠️ *Disclaimer: This is information only. Not clinical prescription or formal legal counsel. Consult a certified Ayurvedic practitioner and an IP professional.*"`;

function buildFullPrompt(message: string, jurisdiction: string, language: string, context?: any): string {
  const isGreeting = /^(hi|hello|hey|namaste|pranam|greetings|hola)\b/i.test(message.trim());
  if (isGreeting) {
    return `User Greeting: "${message}". Please greet the user warmly in 1-2 friendly sentences as IP-SAKTI Sahayak, and invite them to ask about Ayurvedic herbs, health benefits, patentability (Section 3p), TKDL prior art, or NBA Form 3.`;
  }

  const jurisdictionText = jurisdiction === "international"
    ? "JURISDICTION: INTERNATIONAL (PCT / WIPO / USPTO / EPO / NAGOYA PROTOCOL). If patenting is discussed, emphasize global patent pathways and ABS."
    : "JURISDICTION: INDIA (INDIAN PATENTS ACT 1970, NBA FORM 3, TKDL, DRUGS & COSMETICS ACT).";

  const langInstruction = language === "hi"
    ? "LANGUAGE: HINDI (Provide response in clear, formal Hindi in Devanagari script with key botanical/legal terms noted bilingually)."
    : "LANGUAGE: ENGLISH.";

  const isClassificationRelated = /classif|category|proprietary|phytopharm|nutra|cosmetic|formula|recipe|product/i.test(message);

  let prompt = `${jurisdictionText}\n${langInstruction}\n\nUser Question: ${message}`;
  if (context && isClassificationRelated) {
    prompt += `\n(Product Context: Category: ${context.category || 'ASU'}, Source: ${context.ingredientSource || 'India'})`;
  }

  prompt += `\n\nDIRECTIVE: Directly and accurately answer the user's specific question above. If it is about eating or health benefits of a herb, answer the health & usage question first with Ayurvedic science, then add relevant IP/TKDL context.`;

  return prompt;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  const hasGroq = Boolean(process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
  res.json({
    status: "ok",
    hasGroqKey: hasGroq,
    hasGeminiKey: hasGemini,
    name: "IP-SAKTI Sahayak AI Backend",
    models: {
      primary: hasGroq ? "Groq (Llama 3.3 70B Active)" : "Groq (Pending API Key in .env)",
      secondary: hasGemini ? "Gemini (Active)" : "Gemini (Pending API Key)",
      fallback: "Ayurvedic Herbal & IP Knowledge Engine"
    }
  });
});

// Supported Groq models in prioritized order (openai/gpt-oss-120b is tested and active on Groq)
const GROQ_CANDIDATE_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant"
];

// Regular JSON Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, jurisdiction = "india", language = "en", context } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const fullPrompt = buildFullPrompt(message, jurisdiction, language, context);

    // 1. Try Groq (Iterate through candidate models)
    const groq = getGroqClient();
    if (groq) {
      for (const modelName of GROQ_CANDIDATE_MODELS) {
        try {
          const completion = await groq.chat.completions.create({
            model: modelName,
            messages: [
              { role: "system", content: SYSTEM_INSTRUCTION },
              { role: "user", content: fullPrompt }
            ],
            temperature: 0.3,
            max_tokens: 1000
          });

          const reply = completion.choices[0]?.message?.content || "";
          if (reply) {
            return res.json({ reply, source: `groq:${modelName}` });
          }
        } catch (groqErr: any) {
          console.warn(`Groq API model ${modelName} error:`, groqErr?.message);
        }
      }
    }

    // 2. Try Gemini (Secondary Model: Free Tier Gemini Flash)
    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const response = await gemini.models.generateContent({
          model: "gemini-2.5-flash",
          contents: fullPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.4,
          },
        });

        const text = response.text || "";
        if (text) {
          return res.json({ reply: text, source: "gemini:2.5-flash" });
        }
      } catch (geminiErr: any) {
        console.warn("Gemini API error, falling back to expert knowledge engine:", geminiErr?.message);
      }
    }

    // 3. Expert Knowledge Engine Fallback
    const fallbackAnswer = generateAyurvedicIPAnswer(message, jurisdiction, language, context);
    return res.json({ reply: fallbackAnswer, source: "knowledge-engine" });
  } catch (error: any) {
    console.error("Chat route error:", error);
    res.status(500).json({ error: "Failed to generate guidance" });
  }
});

// Streaming Server-Sent Events (SSE) Chat endpoint
app.post("/api/chat/stream", async (req, res) => {
  try {
    const { message, jurisdiction = "india", language = "en", context } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const fullPrompt = buildFullPrompt(message, jurisdiction, language, context);

    // 1. Try Streaming from Groq (Iterate through candidate models)
    const groq = getGroqClient();
    if (groq) {
      for (const modelName of GROQ_CANDIDATE_MODELS) {
        try {
          const stream = await groq.chat.completions.create({
            model: modelName,
            messages: [
              { role: "system", content: SYSTEM_INSTRUCTION },
              { role: "user", content: fullPrompt }
            ],
            temperature: 0.3,
            max_tokens: 1000,
            stream: true
          });

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              res.write(`data: ${JSON.stringify({ chunk: content, source: `groq:${modelName}` })}\n\n`);
            }
          }
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          return res.end();
        } catch (groqErr: any) {
          console.warn(`Groq streaming model ${modelName} error:`, groqErr?.message);
        }
      }
    }

    // 2. Try Streaming from Gemini
    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const responseStream = await gemini.models.generateContentStream({
          model: "gemini-2.5-flash",
          contents: fullPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.4,
          },
        });

        for await (const chunk of responseStream) {
          const textChunk = chunk.text;
          if (textChunk) {
            res.write(`data: ${JSON.stringify({ chunk: textChunk, source: "gemini:2.5-flash" })}\n\n`);
          }
        }
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        return res.end();
      } catch (geminiErr: any) {
        console.warn("Gemini streaming error, using knowledge engine streamer:", geminiErr?.message);
      }
    }

    // 3. Fallback Knowledge Engine Streamer (Word-by-word streaming)
    const fallbackAnswer = generateAyurvedicIPAnswer(message, jurisdiction, language, context);
    const words = fallbackAnswer.split(/(\s+)/);
    for (const word of words) {
      res.write(`data: ${JSON.stringify({ chunk: word, source: "knowledge-engine" })}\n\n`);
      await new Promise(r => setTimeout(r, 12));
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    return res.end();
  } catch (err) {
    console.error("Stream endpoint error:", err);
    res.write(`data: ${JSON.stringify({ error: "Streaming error occurred", done: true })}\n\n`);
    res.end();
  }
});

// Comprehensive Ayurvedic Herbal & IP Knowledge Engine
function generateAyurvedicIPAnswer(
  query: string, 
  jurisdiction: string, 
  language: string,
  context?: any
): string {
  const q = query.toLowerCase().trim();
  const isHindi = language === "hi";
  const isInternational = jurisdiction === "international";

  // Handle greetings
  const isGreeting = /^(hi|hello|hey|namaste|pranam|greetings|hola)\b/i.test(q);
  if (isGreeting) {
    return isHindi
      ? `नमस्ते! मैं **आईपी-शक्ति सहायक** हूँ, आयुर्वेद स्वास्थ्य, वानस्पतिक विज्ञान एवं बौद्धिक संपदा (IPR) के लिए आपका समर्पित एआई सहायक।\n\nआप मुझसे किसी भी जड़ी-बूटी के स्वास्थ्य लाभ, सेवन विधि, पेटेंट पात्रता (धारा 3p), टीकेडीएल पूर्व-कला, या एनबीए फॉर्म 3 के बारे में पूछ सकते हैं। मैं आज आपकी क्या सहायता कर सकता हूँ?\n\n⚠️ *Disclaimer: This is information only. Not legal or medical advice.*`
      : `Welcome to **IP-SAKTI Sahayak!** I am your dedicated AI guide for Ayurvedic botanical sciences, herbal health properties, and Intellectual Property / Patent regulations.\n\nYou can ask me about medicinal herbs (Neem, Ashwagandha, Tulsi, Curcumin), safe consumption and dosage, Indian Patents Act Section 3(p) prior art exceptions, TKDL defenses, or NBA Form 3 clearances. How can I help your research today?\n\n⚠️ *Disclaimer: This is information only. Not legal or medical advice.*`;
  }

  // 1. NEEM HANDLER (General Overview & Health/Consumption)
  if (q.includes("neem")) {
    const isEatingSpecific = q.includes("eat") || q.includes("consum") || q.includes("chew") || q.includes("drink") || q.includes("food");
    
    if (isHindi) {
      if (isEatingSpecific) {
        return `### क्या नीम खाना स्वास्थ्य के लिए लाभकारी है? (आयुर्वेदिक एवं औषधीय विश्लेषण):

1. **आयुर्वेदिक गुणधर्म (Pharmacological Profile)**:
   - **रस (Taste)**: तिक्त (कड़वा) और कषाय (कसैला)।
   - **वीर्य (Potency)**: **शीत (ठंडा)** – *नीम की तासीर शीतल होती है*।
   - **विपाक (Post-digestive effect)**: कटु (तीखा)।
   - **दोष प्रभाव**: **पित्त और कफ दोष को शांत करता है**; अत्यधिक सेवन से वात बढ़ सकता है।

2. **प्रमुख स्वास्थ्य लाभ**:
   - **रक्तशोधक (Blood Purifier)**: रक्त को शुद्ध कर त्वचा संबंधी विकारों (मुंहासे, सोरायसिस, एक्जिमा) में उत्कृष्ट परिणाम देता है।
   - **कृमिघ्न (Antimicrobial & Deworming)**: आंतों के हानिकारक बैक्टीरिया व परजीवियों को नष्ट करता है।
   - **यकृत (Liver) एवं चयापचय सहयोग**: लिवर डिटॉक्स में सहायता करता है और इंसुलिन संवेदनशीलता में सुधार कर रक्त शर्करा को नियंत्रित रखता है।
   - **रोग प्रतिरोधक क्षमता (Immunity)**: संक्रमणों से लड़ने की स्वाभाविक क्षमता बढ़ाता है।

3. **सही सेवन विधि एवं मात्रा**:
   - **ताजी कोमल पत्तियां**: सुबह खाली पेट 2 से 4 कोमल (लाल-हरी) पत्तियां गुनगुने पानी के साथ चबाएं।
   - **ऋतु संधि (Spring Detox)**: वसंत ऋतु (चैत्र मास) में 15–21 दिन तक नीम की पत्तियों का सेवन पूरे वर्ष संक्रमण से बचाव के लिए पारंपरिक रूप से श्रेष्ठ माना गया है।
   - **नीम रस**: 5 से 10 मिली पानी में मिलाकर, लगातार 2-3 सप्ताह से अधिक न लें।

4. **महत्वपूर्ण सावधानियां एवं निषेध**:
   - **गर्भावस्था एवं परिवार नियोजन**: गर्भवती महिलाओं या गर्भधारण का प्रयास कर रहे दंपतियों को इसका सेवन बिल्कुल नहीं करना चाहिए।
   - **उच्च वात या कमजोरी**: अत्यंत दुर्बल, शुष्क त्वचा वाले या वात-प्रधान व्यक्तियों को अधिक सेवन से बचना चाहिए।

5. **बौद्धिक संपदा एवं टीकेडीएल (TKDL) संदर्भ**:
   - नीम के ये औषधीय गुण चरक संहिता एवं भावप्रकाश निघण्टु में सदियों पूर्व दर्ज हैं।
   - चूंकि यह **पारंपरिक ज्ञान (Traditional Knowledge)** सार्वजनिक डोमेन में है, इसलिए भारतीय पेटेंट अधिनियम की **धारा 3(p)** के तहत नीम के साधारण अर्क या सेवन विधि पर कोई पेटेंट नहीं दिया जा सकता।

⚠️ *Disclaimer: This is information only. Not medical advice. Consult a certified Ayurvedic physician.*`;
      }

      return `## 🌿 नीम (*Azadirachta indica*) – शास्त्रीय आयुर्वेदिक एवं वानस्पतिक विश्लेषण

### 1. वानस्पतिक पहचान
- **वानस्पतिक नाम**: *Azadirachta indica* (A. Juss)
- **कुल (Family)**: मेलीएसी (Meliaceae)
- **शास्त्रीय संस्कृत नाम**: **निम्ब** (आरोग्य प्रदाता), **अरिष्ट** (अविनाशी/रोगहर्ता), **पिचुमर्द** (कुष्ठ एवं चर्मरोग नाशक)
- **सामान्य नाम**: नीम, कड़वा नीम, इंडियन लायलेक

---

### 2. शास्त्रीय द्रव्यगुण विज्ञान (चरक एवं सुश्रुत संहिता)
| गुणधर्म | शास्त्रीय विवरण |
| :--- | :--- |
| **रस (Taste)** | **तिक्त** (कड़वा) एवं **कषाय** (कसैला) |
| **गुण (Qualities)** | **लघु** (पचाने में हल्का) एवं **रूक्ष** (शुष्क) |
| **वीर्य (Potency)** | **शीत (ठंडा)** *(नीम की तासीर शीतल होती है)* |
| **विपाक (Post-Digestive)** | **कटु** (तीखा) |
| **दोष कर्म** | **पित्त और कफ दोष शामक**; अत्यधिक सेवन से वातवर्धक |
| **प्रभाव (Special Action)** | **कृमिघ्न** (कीटाणुनाशक) एवं **विषघ्न** (डिटॉक्सिफाइंग) |

---

### 3. प्रमुख औषधीय एवं चिकित्सीय लाभ
- **रक्तशोधक (Blood Purifier)**: रक्त की अशुद्धियों और चयापचयी विषों (आम) को बाहर निकालकर मुंहासे, सोरायसिस और एक्जिमा में अत्यंत लाभकारी।
- **कृमिघ्न एवं व्रणरोपण**: आंतों के हानिकारक परजीवियों को नष्ट करता है तथा घावों को संक्रमण-मुक्त कर शीघ्र भरता है।
- **कंडूघ्न (Anti-pruritic)**: त्वचा की तीव्र खुजली, जलन और एलर्जी को शांत करता है।
- **प्रमेहहर (Glycemic Control)**: इंसुलिन संवेदनशीलता में सुधार कर रक्त शर्करा को संतुलित करता है।

---

### 4. सक्रिय पादपरसायन (Phytochemistry)
नीम में 140 से अधिक जैव-सक्रिय लिमोनोइड्स पाए जाते हैं:
- **Azadirachtin**: प्रसिद्ध प्राकृतिक जैव-कीटनाशक व कीट-विकास नियंत्रक।
- **Nimbin एवं Nimbidin**: शक्तिशाली सूजनरोधी (anti-inflammatory), ज्वरनाशक (antipyretic) व रोगाणुरोधी तत्व।
- **Gedunin**: प्रभावी कवकनाशी (antifungal) यौगिक।

---

### 5. बौद्धिक संपदा (IPR) एवं टीकेडीएल (TKDL) ऐतिहासिक संदर्भ
- **धारा 3(p) भारतीय पेटेंट अधिनियम**: नीम के औषधीय गुण *चरक संहिता* और *सुश्रुत संहिता* में दर्ज सार्वजनिक ज्ञान हैं। अतः नीम के प्राकृतिक अर्क, चूर्ण या पारंपरिक उपयोग पेटेंट योग्य नहीं हैं।
- **ऐतिहासिक ईपीओ (EPO) पेटेंट निरस्तीकरण (W.R. Grace Case)**: 1995 में यूरोपीय पेटेंट कार्यालय द्वारा डब्ल्यू.आर. ग्रेस कंपनी को नीम के कवकनाशी प्रभाव पर दिए गए पेटेंट को भारत की सीएसआईआर (CSIR) ने प्राचीन संस्कृत ग्रन्थों के प्रमाण प्रस्तुत कर सफलतापूर्वक रद्द करवाया था।

⚠️ *Disclaimer: यह सूचनात्मक एवं आईपी विश्लेषण है। चिकित्सीय सलाह हेतु प्रमाणित आयुर्वेदाचार्य से परामर्श लें।*`;
    }

    // English Response
    if (isEatingSpecific) {
      return `### Is Neem Healthy to Eat? (Classical Ayurvedic & Modern Pharmacological Assessment):

Yes, consuming neem (*Azadirachta indica*) in appropriate, controlled quantities has profound therapeutic benefits in classical Ayurveda and modern phytotherapy.

---

### 1. Ayurvedic Botanical Profile:
- **Rasa (Taste)**: *Tikta* (predominantly bitter) & *Kashaya* (astringent).
- **Virya (Potency)**: **Sheeta (cooling)**.
- **Vipaka (Post-digestive)**: *Katu* (pungent).
- **Dosha Action**: Strongly pacifies **Pitta and Kapha**; can aggravate **Vata** if consumed excessively or by emaciated individuals.

---

### 2. Core Health Benefits:
- **Raktashodhaka (Potent Blood Purifier)**: Eliminates deep-seated metabolic toxins (*Ama*) from the bloodstream, helping clear acne, eczema, urticaria, and skin inflammation.
- **Krimighna (Antimicrobial & Anti-parasitic)**: Natural bioactive limonoids (azadirachtin, nimbin) act as gut cleansers, destroying intestinal worms and pathogenic bacteria.
- **Glycemic & Liver Support**: Stimulates hepatic enzymes, assists liver detoxification, and helps improve insulin receptor sensitivity to modulate blood sugar.
- **Oral & Digestive Health**: Chewing tender leaves cleanses the oral microbiome and relieves hyperacidity (*Amlapitta*).

---

### 3. Recommended Safe Consumption & Dosage:
- **Fresh Tender Leaves**: Chew **2 to 4 small, young reddish-green leaves** on an empty stomach in the morning, followed by lukewarm water.
- **Spring Detoxification (*Chaitra* Season)**: Classical texts recommend consuming tender neem leaves for 15–21 days during seasonal transition (*Ritu Sandhi*) into spring to prevent fevers and summer infections.
- **Neem Juice (*Swarasa*)**: 5 to 10 ml diluted with water, limited to short therapeutic courses (2–3 weeks max).

---

### 4. Critical Cautions & Contraindications:
- **Pregnancy & Conception**: **Strictly contraindicated** for pregnant women and couples actively attempting to conceive.
- **Not for Infants or Young Children**: Concentrated extracts can be hepatotoxic in young children.
- **High Vata & Emaciation**: Individuals with severe body dryness should avoid regular intake due to its drying (*Ruksha*) nature.

---

### 5. Ayurvedic Intellectual Property (IP) & TKDL Context:
- The antimicrobial and blood-purifying properties of Neem are cataloged in foundational texts like *Charaka Samhita* and *Bhavaprakasha*.
- Because this knowledge is in the **public domain (TKDL)**, raw neem leaves or simple extracts cannot be patented under **Section 3(p)** of the Indian Patents Act.
- In a landmark case, India's CSIR successfully overturned a patent granted by the European Patent Office (EPO) to WR Grace for neem's fungicidal properties by submitting ancient Sanskrit textual evidence proving prior art.

⚠️ *Disclaimer: This is information only. Not clinical or legal advice. Consult a certified Ayurvedic doctor before starting any herbal regimen.*`;
    }

    return `## 🌿 Neem (*Azadirachta indica*) – Classical Ayurvedic & Botanical Overview

### 1. Botanical Identity
- **Botanical Name**: *Azadirachta indica* (A. Juss)
- **Family**: Meliaceae (Mahogany family)
- **Classical Sanskrit Names**: **Nimba** (bestower of good health), **Arishta** (indestructible / relieves affliction), **Pichumarda** (eliminator of dermatosis)
- **Common Names**: Neem, Indian Lilac, Margosa tree

---

### 2. Classical Ayurvedic Pharmacology (Dravyaguna)
| Attribute | Classical Property (*Charaka & Sushruta Samhita*) |
| :--- | :--- |
| **Rasa (Taste)** | **Tikta** (Bitter) & **Kashaya** (Astringent) |
| **Guna (Qualities)** | **Laghu** (Light to digest), **Ruksha** (Dry) |
| **Virya (Potency)** | **Sheeta (Cooling)** *(Note: Neem is cooling in nature, pacifying internal heat)* |
| **Vipaka (Post-Digestive)** | **Katu** (Pungent) |
| **Dosha Karma** | **Pacifies Pitta and Kapha**; aggravates Vata in excess |
| **Prabhava (Special Action)** | **Krimighna** (Antiparasitic / Antimicrobial) & **Vishaghna** (Antitoxic) |

---

### 3. Major Therapeutic Actions
- **Raktashodhaka (Blood Purifier)**: Foremost Ayurvedic therapeutic for clearing accumulated toxins (*Ama*) and clearing chronic dermatological disorders (*Kushtha* - eczema, acne, psoriasis).
- **Krimighna & Vrana Shodhana**: Cleanses septic ulcers, infected wounds, and eradicates intestinal helminthes.
- **Kandughna (Anti-pruritic)**: Relieves skin itching, urticaria, and burning sensations.
- **Pramehahara (Glycemic Balance)**: Enhances insulin sensitivity and assists in healthy carbohydrate metabolism.
- **Danta Dhavana (Oral Health)**: Traditional morning chewsticks (*Datun*) prevent gingivitis, plaque, and oral pathogens.

---

### 4. Active Phytochemistry
Neem features over 140 bio-active tetranortriterpenoids and limonoids:
- **Azadirachtin**: World-renowned natural biodegradable bio-insecticide and anti-feedant.
- **Nimbin & Nimbidin**: Potent anti-inflammatory, antipyretic, and antihistaminic agents.
- **Gedunin & Mahmoodin**: Active antifungal, antibacterial, and antimalarial principles.

---

### 5. Intellectual Property (IPR) & TKDL Landmark Case
- **Section 3(p) Indian Patents Act**: Traditional medicinal uses of Neem are ancient prior art preserved in classical Sanskrit treatises and protected by the **Traditional Knowledge Digital Library (TKDL)**. Natural plant parts and conventional extracts cannot be patented.
- **Historic EPO Patent Revocation (WR Grace Case)**: In 1995, the European Patent Office granted Patent No. 436257 to W.R. Grace for a method of controlling fungi on plants using neem oil extract. India (via CSIR) legally contested this grant by presenting ancient Ayurvedic texts proving Indian farmers and healers had used neem formulations for fungal control for centuries. In May 2000, the EPO revoked the patent in its entirety, marking an international milestone against biopiracy.

⚠️ *Disclaimer: This information is for educational and IP research purposes. It is not clinical or legal advice.*`;
  }

  // 2. ASHWAGANDHA HEALTH / CONSUMPTION
  if (q.includes("ashwagandha") && (q.includes("eat") || q.includes("health") || q.includes("take") || q.includes("benefit") || q.includes("how to") || q.includes("milk"))) {
    return `### How to Take Ashwagandha & Health Benefits:

1. **Ayurvedic Profile (*Withania somnifera*)**:
   - **Rasa**: Tikta (bitter), Kashaya (astringent), Madhura (sweet).
   - **Virya**: Ushna (warming).
   - **Dosha**: Excellent for pacifying **Vata and Kapha**.

2. **Key Benefits**:
   - **Rasayana (Rejuvenation)**: Reduces cortisol, relieves chronic stress/anxiety, and enhances cognitive function.
   - **Balya (Strength & Vitality)**: Boosts muscle mass, physical stamina, and reproductive vitality in both men and women.
   - **Nidrajanana (Sleep Support)**: Promotes deep restorative sleep when taken with warm cow's milk at bedtime.

3. **Dosage & Anupana (Carrier)**:
   - **Root Powder (Churna)**: 3 to 5 grams once or twice daily with warm milk, ghee, or honey.
   - **Extracts / Capsules**: Standardized withanolide extract (300–600 mg daily).

4. **IP Context**: Classical Ashwagandha formulations are in TKDL. Only novel delivery forms (e.g. liposomal withanolides with proven enhanced bioavailability under Sec 3d) qualify for patenting.

⚠️ *Disclaimer: This is information only. Not medical advice. Consult an Ayurvedic doctor.*`;
  }

  // 3. TULSI HEALTH / CONSUMPTION
  if (q.includes("tulsi") && (q.includes("eat") || q.includes("health") || q.includes("benefit") || q.includes("tea") || q.includes("leaf"))) {
    return `### Tulsi (Holy Basil) Consumption & Benefits:

1. **Ayurvedic Profile (*Ocimum sanctum*)**:
   - **Rasa**: Katu (pungent), Tikta (bitter).
   - **Virya**: Ushna (hot potency).
   - **Dosha**: Balances **Kapha and Vata**; increases Pitta in excess.

2. **Health Benefits**:
   - **Respiratory Relief (*Kasahara*)**: Relieves cough, colds, and bronchial congestion.
   - **Adaptogenic**: Combats psychological and physiological stress.
   - **Antimicrobial**: Purifies digestive tract and oral cavity.

3. **Safe Consumption**:
   - 3 to 5 fresh leaves chewed daily or brewed into herbal tea (*Kwath*).
   - *Note*: Swallow or wash mouth after chewing due to high iron and mercury traces that can affect tooth enamel if held long in teeth.

4. **IP Note**: Classical Tulsi remedies cannot be patented under Section 3(p). Novel standardized fraction inhalers or synergistic combinations (CI < 0.8) are patentable.

⚠️ *Disclaimer: This is information only. Not medical advice.*`;
  }

  // 4. INTERNATIONAL JURISDICTION RESPONSES
  if (isInternational) {
    if (isHindi) {
      return `### अंतर्राष्ट्रीय पेटेंट (PCT) एवं वैश्विक ABS अनुपालन:

1. **पेटेंट सहयोग संधि (PCT) फाइलिंग**:
   - प्राथमिकता आवेदन से 12 महीने में WIPO PCT आवेदन दाखिल करें। 30-31 महीनों में USPTO या EPO के राष्ट्रीय चरण में प्रवेश करें।
2. **TKDL वैश्विक पूर्व-कला**:
   - CSIR-TKDL के विदेशी पेटेंट कार्यालयों के साथ समझौते हैं, जिससे नीम, हल्दी जैसी पारंपरिक जड़ी-बूटियों पर विदेशी पेटेंट स्वतः रद्द हो जाते हैं।
3. **नागोया प्रोटोकॉल एवं NBA फॉर्म 3**:
   - भारतीय औषधीय पौधों पर आधारित शोध पर विदेश में पेटेंट प्राप्त करने से पहले राष्ट्रीय जैव विविधता प्राधिकरण (NBA) से **फॉर्म 3 अनुमोदन** लेना अनिवार्य है।

⚠️ *Disclaimer: This is information only. Not legal advice.*`;
    }

    return `### International Patent (PCT) & Global ABS Regulatory Framework:

1. **PCT Filing Strategy**:
   - File an Indian priority application followed by a **PCT Application via WIPO** within 12 months.
   - Enter target national jurisdictions (USPTO, EPO) within 30 or 31 months.
2. **Overcoming Prior Art with TKDL**:
   - Raw herbal combinations are barred under 35 U.S.C. 102/103 (USPTO) or EPC Article 54/56.
   - Focus claims on standardized bioactive fractions, novel delivery carriers (phytosomes), or proven molecular synergy.
3. **Mandatory NBA Form 3 Clearance**:
   - Section 6 of India's Biological Diversity Act requires NBA approval before any patent grant outside India using Indian bio-resources.

⚠️ *Disclaimer: This is information only. Not legal advice.*`;
  }

  // 5. INDIAN PATENT LAWS (Section 3p, 3e, 3d, NBA)
  if (q.includes("patent") || q.includes("3(p)") || q.includes("3(e)") || q.includes("3(d)") || q.includes("synergy")) {
    return `### Patentability Assessment under Indian Patent Law (Section 3(p), 3(e) & 3(d)):

1. **Section 3(p) Traditional Knowledge Bar**:
   - Strictly excludes from patentability any invention that represents traditional knowledge or mere aggregation of known herbal properties.
2. **Section 3(e) Synergistic Interaction**:
   - Requires non-obvious pharmacological synergy (Combination Index CI < 0.8) to overcome the mere admixture bar.
3. **Section 3(d) Enhanced Therapeutic Efficacy**:
   - Required when creating new forms of known extracts (e.g. liposomal or nano-phytosomal delivery systems).
4. **Mandatory NBA Form 3 Clearance**:
   - Biological Diversity Act Section 6 mandates NBA clearance prior to patent grant for innovations derived from Indian biological material.

⚠️ *Disclaimer: This is information only. Not legal advice.*`;
  }

  if (q.includes("abs") || q.includes("nba") || q.includes("biodiversity") || q.includes("form 3") || q.includes("form 1")) {
    return `### National Biodiversity Authority (NBA) & ABS Compliance:

1. **Statutory Framework**:
   - Biological Diversity Act regulates access to Indian biological resources to prevent biopiracy and ensure fair benefit sharing.
2. **Key Forms**:
   - **Form 1**: Foreign entities or NRI-owned firms accessing Indian bio-resources.
   - **Form 3**: Mandatory for ANY applicant seeking patents in India or abroad using Indian biological resources.
3. **Benefit Sharing**:
   - 0.1% to 0.5% ex-factory sales value contribution to the National Biodiversity Fund.

⚠️ *Disclaimer: This is information only. Not legal advice.*`;
  }

  // 6. DEFAULT BALANCED AYURVEDIC & IP GUIDANCE
  return `### Ayurvedic Science & Intellectual Property Guidance:

1. **Classical Ayurvedic Herbal Principles**:
   - Classical medicinal herbs and formulations described in Schedule I texts (*Charaka Samhita*, *Sushruta Samhita*, *AFI*) represent ancient Traditional Knowledge.

2. **Public Domain & Section 3(p)**:
   - Traditional herbal uses (for immunity, digestion, fever, skin) are in the public domain in the CSIR Traditional Knowledge Digital Library (TKDL) and cannot be patented in raw or classical form.

3. **Pathways to Modern Innovation**:
   - Formulations that demonstrate non-obvious synergy (Combination Index < 0.8), standardized novel marker fractions, or novel drug delivery systems (phytosomes, nano-carriers) can qualify for patent protection under Section 3(e) and 3(d).

⚠️ *Disclaimer: This is information only. Not clinical or legal advice. Consult certified practitioners.*`;
}

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IP-SAKTI Sahayak Server running on http://localhost:${PORT}`);
  });
}

startServer();
