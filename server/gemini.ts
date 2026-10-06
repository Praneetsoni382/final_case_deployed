import { GoogleGenAI, Type } from '@google/genai';
import {
  MainGrowthParameter,
  Criterion,
  CriterionResult,
  VivekanandaGrowthReport,
  KeyfieldEvidence,
} from '../src/types/index.ts';

export interface ScenarioEvaluationInput {
  challengeTitle: string;
  scenario: string;
  question: string;
  options: Array<{ id: string; text: string }>;
  selectedOptionId: string;
  selectedOptionText: string;
  correctOptionId: string;
  correctOptionExplanation?: string;
  activityData: {
    timeTakenSeconds?: number;
    changeCount?: number;
    hintsUsed?: number;
    hintIdsUsed?: string[];
  };
  optionalReasoning?: string;
  criteria: Criterion[];
}

export interface ScenarioEvaluationOutput {
  criteriaResults: CriterionResult[];
  demonstrated: string[];
  toDevelop: string[];
  insufficientEvidence: string[];
  summary: string;
  disclaimer: string;
}

export interface FullTestEvaluationInput {
  studentName: string;
  answers: Array<{
    scenarioTitle: string;
    scenarioText: string;
    questionText: string;
    selectedOptionText: string;
    isPreferred: boolean;
    explanation?: string;
    writtenReasoning?: string;
    relatedParameters: MainGrowthParameter[];
  }>;
}

export async function generateVivekanandaGrowthReport(
  data: FullTestEvaluationInput
): Promise<VivekanandaGrowthReport> {
  const apiKey = process.env.GEMINI_API_KEY || '';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `
You are the Vivekananda Human Development Analysis Engine for the Vivekananda Innovation Hackathon.

MISSION & MANDATE:
- Ground your analysis in Swami Vivekananda's philosophy of education ("Education is the manifestation of the perfection already in man").
- Focus on observable evidence across Vivekananda's core human growth parameters:
  * Self-Reliance (Faith in Self)
  * Confidence
  * Fearlessness
  * Concentration
  * Perseverance
  * Initiative
  * Responsibility
  * Critical Thinking
  * Judgement
  * Adaptability
  * Resourcefulness
  * Empathy
  * Cooperation
  * Harmony
  * Reflection
- NEVER diagnose a student's personality, psychology, IQ, morality, or inherent character.
- NEVER use integer scores or percentages (e.g. "80%", "8/10").
- Identify WHERE and HOW evidence of each growth indicator was observable in their decisions and optional reasoning.
- Provide constructive, inspiring guidance on areas where balance or deeper discernment can be cultivated.

STUDENT SCENARIO RESPONSES:
${data.answers
  .map(
    (a, i) => `
[Scenario ${i + 1}: ${a.scenarioTitle}]
Situation: "${a.scenarioText}"
Question: "${a.questionText}"
Student Selected: "${a.selectedOptionText}" (${a.isPreferred ? 'Constructive/Aligned Option' : 'Alternative Option'})
Optional Student Reasoning: "${a.writtenReasoning ? a.writtenReasoning.trim() : '(No written explanation provided)'}"
Core Parameters Exercised: ${a.relatedParameters.join(', ')}
Principles: ${a.explanation || ''}
`
  )
  .join('\n')}

Analyze the complete 10-scenario cycle and return clean JSON conforming to the schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              highlightedKeyfields: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Vivekananda keyfields where strong constructive evidence was demonstrated',
              },
              areasForImprovement: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Keyfields where the student can practice deeper discernment or balance',
              },
              evidenceBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    keyfield: { type: Type.STRING },
                    level: {
                      type: Type.STRING,
                      enum: ['Strong Evidence', 'Developing', 'Emerging', 'Insufficient Evidence'],
                    },
                    where: { type: Type.STRING, description: 'Scenario title & contextual situation where observed' },
                    how: { type: Type.STRING, description: 'Specific observable choice and rationale demonstrating this quality' },
                    guidance: { type: Type.STRING, description: 'Actionable developmental reflection rooted in Vivekananda principles' },
                  },
                  required: ['keyfield', 'level', 'where', 'how', 'guidance'],
                },
              },
              synthesis: {
                type: Type.STRING,
                description: 'Deep philosophical and practical synthesis of today’s decision pattern',
              },
              disclaimer: {
                type: Type.STRING,
                description: 'Standard responsible development notice',
              },
            },
            required: ['highlightedKeyfields', 'areasForImprovement', 'evidenceBreakdown', 'synthesis'],
          },
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim()) as VivekanandaGrowthReport;
        return {
          ...parsed,
          disclaimer:
            'Observable Evidence Notice: This report identifies behavioral and reflective evidence demonstrated during today’s scenario interactions. It does not measure human character as a fixed score or diagnose psychological traits.',
        };
      }
    } catch (err: any) {
      console.warn('Gemini growth report fallback triggered:', err?.message || err);
    }
  }

  // Analytical Fallback grounded strictly in Vivekananda parameters
  const alignedCount = data.answers.filter(a => a.isPreferred).length;
  const demonstratedParams = new Set<string>();
  const improvementParams = new Set<string>();

  data.answers.forEach(a => {
    if (a.isPreferred) {
      a.relatedParameters.forEach(p => demonstratedParams.add(p));
    } else {
      a.relatedParameters.forEach(p => improvementParams.add(p));
    }
  });

  const highlightedKeyfields = Array.from(demonstratedParams);
  const areasForImprovement = Array.from(improvementParams).filter(p => !highlightedKeyfields.includes(p));

  const evidenceBreakdown: KeyfieldEvidence[] = data.answers.map(a => {
    const primaryParam = a.relatedParameters[0] || 'Reflection';
    return {
      keyfield: primaryParam,
      level: a.isPreferred ? 'Strong Evidence' : 'Developing',
      where: `"${a.scenarioTitle}"`,
      how: a.isPreferred
        ? `Selected the constructive decision: "${a.selectedOptionText}"${a.writtenReasoning ? ` with added reflection: "${a.writtenReasoning}"` : ''}, demonstrating conscious ${primaryParam.toLowerCase()}.`
        : `Selected "${a.selectedOptionText}". Shows active engagement with the dilemma with opportunities for greater ${primaryParam.toLowerCase()}.`,
      guidance: a.isPreferred
        ? `Continue anchoring future actions in this balanced expression of ${primaryParam.toLowerCase()}.`
        : `Reflect on how balancing short-term outcomes with long-term capability elevates decision-making.`,
    };
  });

  return {
    highlightedKeyfields: highlightedKeyfields.length > 0 ? highlightedKeyfields : ['Self-Reliance', 'Reflection', 'Initiative'],
    areasForImprovement: areasForImprovement.length > 0 ? areasForImprovement : ['Adaptability under Uncertainty', 'Continuous Discernment'],
    evidenceBreakdown,
    synthesis: `Today's 10 scenario interactions reveal conscious reflection across critical human development dimensions. You demonstrated notable alignment in ${highlightedKeyfields.slice(0, 4).join(', ')}, showing a strong willingness to confront complex situations through balanced judgment rather than avoidance or passivity. As Swami Vivekananda taught, every situation is a field for the manifestation of higher inner strength.`,
    disclaimer:
      'Observable Evidence Notice: This report identifies behavioral and reflective evidence demonstrated during today’s scenario interactions. It does not measure human character as a fixed score or diagnose psychological traits.',
  };
}

export async function generateDevelopmentInsight(data: {
  studentName: string;
  goals: string[];
  struggles: string[];
  answeredQuestions: Array<{
    questionText: string;
    selectedOptionText: string;
    writtenResponse?: string;
    isPreferred: boolean;
  }>;
  score: number;
  growthParametersAffected: MainGrowthParameter[];
}): Promise<string> {
  const strongParams = data.growthParametersAffected.slice(0, 3).join(', ') || 'Self-Reliance, Confidence and Initiative';
  return `### Vivekananda Human Development Synthesis

Today's responses reflect deliberate awareness and discernment. Through realistic decision scenarios, you exercised key qualities of **${strongParams}**.

Swami Vivekananda taught: *"All the powers in the universe are already ours. It is we who have put our hands before our eyes and cry that it is dark."* Every scenario practiced builds greater clarity for independent, courageous action in everyday life.`;
}

export async function evaluateScenarioAttempt(
  data: ScenarioEvaluationInput
): Promise<ScenarioEvaluationOutput> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const isCorrect = data.selectedOptionId === data.correctOptionId;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `
You are the Evidence-Based Decision Analysis Engine for the Vivekananda Human Development Platform.

CORE PHILOSOPHY & MANDATES:
1. This is an evidence-based developmental analysis, NOT a psychological test or personality diagnosis.
2. You must NEVER infer or diagnose personality, intelligence, morality, inherent character, mental health, or permanent traits.
3. You must evaluate OBSERVABLE EVIDENCE from the student's decision in this specific scenario.
4. For each criterion, assign exactly one Level: "Strong", "Developing", "Emerging", or "Insufficient Evidence".
5. Do NOT return arbitrary percentages.
6. If the student provided optional reasoning, evaluate it as additional evidence.
7. If the student left optional reasoning blank, DO NOT penalize them.
8. If the interaction lacks sufficient evidence to assess a criterion, assign "Insufficient Evidence".

SCENARIO CONTEXT:
Challenge Title: "${data.challengeTitle}"
Scenario: "${data.scenario}"
Question: "${data.question}"

OPTIONS:
${data.options.map(o => `- [${o.id}] ${o.text} ${o.id === data.correctOptionId ? '(Developmentally Optimal Option)' : ''}`).join('\n')}

STUDENT'S INTERACTION:
- Selected Option: [${data.selectedOptionId}] "${data.selectedOptionText}"
- Decision Alignment: ${isCorrect ? 'Aligned with optimal option' : 'Selected alternative option'}
- Optional Written Reasoning: "${data.optionalReasoning ? data.optionalReasoning.trim() : '(No optional reasoning provided)'}"
- Hints Used: ${data.activityData.hintsUsed || 0} hint(s)

CRITERIA TO EVALUATE:
${data.criteria.map(c => `- ID: "${c.id}", Name: "${c.name}", Definition: "${c.description}"`).join('\n')}

Return clean JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              criteriaResults: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    criterionId: { type: Type.STRING },
                    criterionName: { type: Type.STRING },
                    level: {
                      type: Type.STRING,
                      enum: ['Strong', 'Developing', 'Emerging', 'Insufficient Evidence'],
                    },
                    evidence: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ['criterionId', 'criterionName', 'level', 'evidence'],
                },
              },
              demonstrated: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              toDevelop: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              insufficientEvidence: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              summary: {
                type: Type.STRING,
              },
            },
            required: ['criteriaResults', 'demonstrated', 'toDevelop', 'insufficientEvidence', 'summary'],
          },
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim()) as ScenarioEvaluationOutput;
        return {
          ...parsed,
          disclaimer:
            'Observable Evidence Notice: This analysis identifies observable decision evidence from this scenario. It does not measure human character as a fixed score or diagnose psychological traits.',
        };
      }
    } catch (err: any) {
      console.warn('Gemini scenario analysis fallback triggered:', err?.message || err);
    }
  }

  // Robust analytical fallback
  const criteriaResults: CriterionResult[] = data.criteria.map(c => {
    return {
      criterionId: c.id,
      criterionName: c.name,
      level: isCorrect ? 'Strong' : 'Developing',
      evidence: isCorrect
        ? `In this scenario, the student selected an approach that balances ${c.name.toLowerCase()} with constructive action.`
        : `The student chose option "${data.selectedOptionText}". Observable evidence demonstrates an initial exploration of ${c.name.toLowerCase()}.`,
      explanation: `Observed in response to "${data.challengeTitle}".`,
    };
  });

  return {
    criteriaResults,
    demonstrated: isCorrect
      ? [`Constructive decision-making addressing "${data.challengeTitle}".`]
      : [`Active engagement with a non-trivial situational dilemma.`],
    toDevelop: isCorrect
      ? ['Continue applying similar multi-perspective reflection in collaborative environments.']
      : ['Consider how balancing short-term outcomes with long-term capability transforms problem-solving.'],
    insufficientEvidence: ['Long-term habits cannot be inferred from a single question attempt.'],
    summary: isCorrect
      ? `The student demonstrated reasoned discernment in choosing an option that balances autonomous initiative with responsible execution.`
      : `The student engaged with the scenario and chose an alternative approach, highlighting valuable reflection areas for future decisions.`,
    disclaimer:
      'Observable Evidence Notice: This analysis identifies observable decision evidence from this scenario. It does not measure human character as a fixed score or diagnose psychological traits.',
  };
}
