import { GoogleGenAI } from '@google/genai';

// Sample policy documents for demonstration
// Vic: In production, these would come from a database. For this prototype,
// I'm using realistic policy text to show how the system handles real documentation.
// The AI reads the full policy, so it can answer follow-up questions accurately.
const SAMPLE_POLICIES = {
  health: `
HEALTH BENEFITS PLAN - SUMMARY OF COVERAGE

Plan Name: Manulife Health Plus Premium
Effective Date: January 1, 2026

COVERED SERVICES:
- Hospital stays: 100% coverage (semi-private room)
- Emergency room visits: 100% coverage after $250 deductible
- Preventive care: 100% coverage (annual physical, screenings)
- Prescription medications: 80% coverage after $50 annual deductible
- Mental health counseling: 10 visits per year, 80% coverage
- Dental: Basic cleaning and exams 100%, crowns/fillings 50%, orthodontics not covered
- Vision: Eye exams $0 copay, glasses/contacts $100 annually

DEDUCTIBLE: $250 per year per individual, $500 family max
OUT-OF-POCKET MAX: $5,000 individual, $10,000 family

EXCLUSIONS: Cosmetic procedures, weight loss programs, fertility treatments
  `,
  
  disability: `
DISABILITY INSURANCE PLAN

Plan Type: Short-term Disability (STD) & Long-term Disability (LTD)

SHORT-TERM DISABILITY:
- Waiting Period: 7 calendar days
- Benefit Period: Up to 26 weeks
- Replacement Rate: 60% of salary up to $3,000/week
- Maximum Benefit: $3,000 per week

LONG-TERM DISABILITY:
- Waiting Period: End of STD benefit period (typically day 183)
- Benefit Period: To age 65
- Replacement Rate: 60% of salary up to $6,000/month
- Definition of Disability: Unable to perform own occupation for 24 months, then any occupation

COVERAGE: Full-time employees after 6 months of service

EXCLUSIONS: Pre-existing conditions (90-day lookback), self-inflicted injuries, substance abuse
  `,
  
  retirement: `
RETIREMENT SAVINGS PLAN - 401(k)

Plan Details:
- Eligibility: After 90 days of employment
- Employee Contribution: 1-15% of gross salary, pre-tax
- Employer Match: 50% of first 6% contributed
- Annual Contribution Limit: $23,500 (2024)
- Catch-up Contributions: Additional $7,500 if age 50+

INVESTMENT OPTIONS:
- Target-date funds (2030-2065)
- Index funds (S&P 500, Total Market, International)
- Bond funds
- Stable value fund (2.5% guaranteed return)

VESTING SCHEDULE: Employer match vests over 3 years (33% per year)
LOAN OPTIONS: Available after 2 years of participation

BENEFICIARY DESIGNATION: Spouse or designated beneficiary
  `,
};

export async function POST(request: Request) {
  try {
    const { question, selectedPlan } = await request.json();

    if (!question || !selectedPlan) {
      return Response.json(
        { error: 'Question and plan selection required' },
        { status: 400 }
      );
    }

    const policyText = SAMPLE_POLICIES[selectedPlan as keyof typeof SAMPLE_POLICIES];

    if (!policyText) {
      return Response.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a benefits advisor helping employees understand their insurance plans.
You have access to the following policy document:

<policy>
${policyText}
</policy>

When answering questions:
1. Give the direct answer first (use plain language, not insurance jargon)
2. Quote the relevant section from the policy
3. Point out any exclusions or limitations that matter
4. Suggest what the employee should do next (call HR, submit forms, etc.)

Be helpful and clear. If the answer isn't in the policy, say so directly.`;

    const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      const ignoredTerms = new Set([
        'what', 'when', 'where', 'which', 'that', 'this', 'have', 'does',
        'your', 'from', 'with', 'about', 'tell', 'much', 'many', 'plan',
        'health', 'disability', 'retirement', 'insurance', 'benefits',
      ]);
      const questionTerms = (question.toLowerCase().match(/[a-z0-9]+/g) ?? [])
        .filter((term: string) => term.length > 3 && !ignoredTerms.has(term));
      const serviceSpecificDeductible = questionTerms.some((term: string) =>
        ['prescription', 'emergency', 'hospital', 'medication', 'drug'].includes(term)
      );
      const overallDeductible = questionTerms.includes('deductible') && !serviceSpecificDeductible
        ? policyText.split('\n').map((line) => line.trim()).find((line) => /^DEDUCTIBLE:/i.test(line))
        : undefined;
      const relevantLines = overallDeductible
        ? [overallDeductible]
        : policyText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => ({
          line,
          score: questionTerms.filter((term: string) => line.toLowerCase().includes(term)).length,
        }))
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score)
        .slice(0, 3)
        .map((item) => item.line);

      return Response.json(
        {
          answer: relevantLines.length
            ? `Demo mode (Gemini key unavailable). The sample policy says:\n${relevantLines.join('\n')}\n\nAdd GEMINI_API_KEY or GOOGLE_API_KEY to enable Gemini-generated answers.`
            : "Demo mode (Gemini key unavailable). I couldn't find a direct match in this sample policy. Try asking about a listed benefit, deductible, waiting period, contribution, or limit.",
          plan: selectedPlan,
          policyExcerpt: policyText.substring(0, 200) + '...',
          demoMode: true,
        }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 1024,
      },
    });

    const responseText = response.text ?? '';

    return Response.json({
      answer: responseText,
      plan: selectedPlan,
      policyExcerpt: policyText.substring(0, 200) + '...',
      usage: {
        input_tokens: response.usageMetadata?.promptTokenCount ?? 0,
        output_tokens: response.usageMetadata?.candidatesTokenCount ?? 0,
      },
    });
  } catch (error) {
    console.error('Error processing question:', error);
    return Response.json(
      { error: 'Failed to process your question' },
      { status: 500 }
    );
  }
}
