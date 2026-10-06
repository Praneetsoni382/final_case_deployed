import { Challenge } from '../src/types/index.ts';

export const PROTOTYPE_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'The Problem You Can Solve Yourself',
    scenario:
      'You are preparing for an important school presentation. Your teammate who normally handles the technical setup is absent. The presentation is only a few hours away, and you have never handled the setup yourself. You could ask another person to take over, but this would leave you dependent on someone who may also be unavailable.',
    question: 'What is the most constructive response?',
    options: [
      {
        id: 'opt-1a',
        text: 'Ask someone experienced to handle the entire setup so the presentation has the lowest possible risk.',
      },
      {
        id: 'opt-1b',
        text: 'Spend some time understanding the setup yourself and seek targeted help only where you are genuinely stuck.',
      },
      {
        id: 'opt-1c',
        text: 'Try to handle everything independently because asking for help would reduce your confidence.',
      },
      {
        id: 'opt-1d',
        text: 'Divide the setup between available students so that responsibility does not fall mainly on you.',
      },
    ],
    correctOptionId: 'opt-1b',
    explanation:
      'The strongest response balances independent action with appropriate help rather than either complete dependence or refusing help.',
    criteria: [
      {
        id: 'self-reliance',
        name: 'Self-Reliance',
        description:
          'Evidence of independently approaching a problem rather than unnecessarily depending on others.',
      },
      {
        id: 'confidence',
        name: 'Confidence',
        description:
          'Evidence of taking a considered decision despite uncertainty.',
      },
      {
        id: 'initiative',
        name: 'Initiative',
        description:
          'Evidence of taking active constructive steps rather than waiting or deferring.',
      },
    ],
    hints: [
      {
        id: 'hint-1-1',
        order: 1,
        text: 'Consider the difference between asking for help and handing over responsibility.',
      },
      {
        id: 'hint-1-2',
        order: 2,
        text: 'Think about what capability you will have after the immediate problem is solved.',
      },
      {
        id: 'hint-1-3',
        order: 3,
        text: 'The goal is not to prove that you need nobody; it is to become capable of acting independently.',
      },
    ],
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    optionalReasoning: true,
    active: true,
    createdAt: '2026-10-06T00:00:00.000Z',
  },
  {
    id: 'challenge-2',
    title: 'When Everyone Is Waiting',
    scenario:
      'During a group activity, nobody is sure who should begin. Everyone is waiting for someone else to take responsibility. You understand the task reasonably well, but you are not completely certain that your approach is the best one.',
    question: 'What would be the strongest response?',
    options: [
      {
        id: 'opt-2a',
        text: 'Wait until someone more experienced takes the initiative so that the group does not follow a wrong approach.',
      },
      {
        id: 'opt-2b',
        text: 'Suggest a possible starting approach, invite the group to examine it, and begin if no major concern emerges.',
      },
      {
        id: 'opt-2c',
        text: 'Take complete control of the task because hesitation will otherwise prevent the group from progressing.',
      },
      {
        id: 'opt-2d',
        text: 'Ask the teacher for exact instructions before doing anything because the group should avoid unnecessary mistakes.',
      },
    ],
    correctOptionId: 'opt-2b',
    explanation:
      'Taking a thoughtful first step while inviting feedback enables collective progress without autocratic control or passive waiting.',
    criteria: [
      {
        id: 'initiative',
        name: 'Initiative',
        description:
          'Evidence of initiating action when a group is hesitant.',
      },
      {
        id: 'confidence',
        name: 'Confidence',
        description:
          'Evidence of expressing a thought despite lack of complete certainty.',
      },
      {
        id: 'cooperation',
        name: 'Cooperation',
        description:
          'Evidence of inviting collaborative scrutiny and valuing peer input.',
      },
    ],
    hints: [
      {
        id: 'hint-2-1',
        order: 1,
        text: 'Confidence does not require certainty.',
      },
      {
        id: 'hint-2-2',
        order: 2,
        text: 'Consider how you can act without preventing others from contributing.',
      },
      {
        id: 'hint-2-3',
        order: 3,
        text: 'Think about taking the first step while remaining open to correction.',
      },
    ],
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    optionalReasoning: true,
    active: true,
    createdAt: '2026-10-06T00:00:00.000Z',
  },
  {
    id: 'challenge-3',
    title: 'The Failure That Changes The Plan',
    scenario:
      'You have spent 40 minutes solving a problem using an approach you believed would work. It produces an unexpected result. You can continue trying variations of the same method, or reconsider your original assumption.',
    question: 'What is the strongest response?',
    options: [
      {
        id: 'opt-3a',
        text: 'Continue with the same method because abandoning it after significant effort may waste the work already completed.',
      },
      {
        id: 'opt-3b',
        text: 'Stop immediately and ask someone else for the solution to avoid spending more time unsuccessfully.',
      },
      {
        id: 'opt-3c',
        text: 'Identify where the approach stopped working, reconsider the underlying assumption, and then decide whether to modify or replace the method.',
      },
      {
        id: 'opt-3d',
        text: 'Start again from the beginning with a completely different method so that the previous failure does not influence your thinking.',
      },
    ],
    correctOptionId: 'opt-3c',
    explanation:
      'Reflecting on what the unexpected result reveals about initial assumptions enables intelligent adaptation rather than stubborn repetition or premature surrender.',
    criteria: [
      {
        id: 'perseverance',
        name: 'Perseverance',
        description:
          'Evidence of sustaining inquiry rather than quitting after an unexpected result.',
      },
      {
        id: 'adaptability',
        name: 'Adaptability',
        description:
          'Evidence of willingness to modify strategies based on objective outcomes.',
      },
      {
        id: 'critical-thinking',
        name: 'Critical Thinking',
        description:
          'Evidence of examining underlying assumptions when results deviate from expectation.',
      },
    ],
    hints: [
      {
        id: 'hint-3-1',
        order: 1,
        text: 'Perseverance does not necessarily mean repeating the same action.',
      },
      {
        id: 'hint-3-2',
        order: 2,
        text: 'A failed result can provide information.',
      },
      {
        id: 'hint-3-3',
        order: 3,
        text: 'Before changing everything, identify what the failure is actually telling you.',
      },
    ],
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    optionalReasoning: true,
    active: true,
    createdAt: '2026-10-06T00:00:00.000Z',
  },
  {
    id: 'challenge-4',
    title: 'Helping Without Creating Dependence',
    scenario:
      'A younger student repeatedly asks you to solve difficult problems for them. You know that giving the answers will help them finish faster, but you also notice that they have started depending on you for similar problems.',
    question: 'What is the most constructive response?',
    options: [
      {
        id: 'opt-4a',
        text: 'Continue giving the answers because completing the work successfully is the immediate priority.',
      },
      {
        id: 'opt-4b',
        text: 'Stop helping completely so that the student is forced to become independent.',
      },
      {
        id: 'opt-4c',
        text: 'Guide the student through the thinking process and gradually reduce the amount of help you provide.',
      },
      {
        id: 'opt-4d',
        text: 'Solve the first few problems yourself and ask the student to imitate the same method independently afterward.',
      },
    ],
    correctOptionId: 'opt-4c',
    explanation:
      'True empathy and assistance empowers the other person to develop self-reliance rather than reinforcing dependency.',
    criteria: [
      {
        id: 'empathy',
        name: 'Empathy',
        description:
          'Evidence of considering the long-term developmental welfare of others.',
      },
      {
        id: 'self-reliance',
        name: 'Self-Reliance',
        description:
          'Evidence of fostering autonomy and problem-solving capacity.',
      },
      {
        id: 'responsibility',
        name: 'Responsibility',
        description:
          'Evidence of recognizing the impact of one’s assistance on another person’s growth.',
      },
    ],
    hints: [
      {
        id: 'hint-4-1',
        order: 1,
        text: 'Consider what happens after today’s problem is solved.',
      },
      {
        id: 'hint-4-2',
        order: 2,
        text: 'Helping and doing everything for someone are not the same.',
      },
      {
        id: 'hint-4-3',
        order: 3,
        text: 'Ask yourself: "What form of help makes the other person more capable?"',
      },
    ],
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    optionalReasoning: true,
    active: true,
    createdAt: '2026-10-06T00:00:00.000Z',
  },
  {
    id: 'challenge-5',
    title: 'The Decision When Information Is Incomplete',
    scenario:
      'Your class must decide whether to organize an outdoor activity tomorrow. The forecast indicates a significant possibility of rain, but the exact timing is uncertain. Cancelling guarantees that the activity will not happen; continuing without preparation could disrupt it.',
    question: 'What is the most responsible approach?',
    options: [
      {
        id: 'opt-5a',
        text: 'Cancel immediately because avoiding the possibility of failure is safer.',
      },
      {
        id: 'opt-5b',
        text: 'Continue as planned because uncertainty should not prevent action.',
      },
      {
        id: 'opt-5c',
        text: 'Identify the critical uncertainty, prepare a practical alternative, and make the final decision using the latest reliable information.',
      },
      {
        id: 'opt-5d',
        text: 'Ask the majority of students what they prefer and follow the majority decision.',
      },
    ],
    correctOptionId: 'opt-5c',
    explanation:
      'Sound judgement involves risk mitigation and contingency planning under uncertainty rather than paralysis or recklessness.',
    criteria: [
      {
        id: 'judgement',
        name: 'Judgement',
        description:
          'Evidence of balancing risk, uncertainty, and objectives.',
      },
      {
        id: 'responsibility',
        name: 'Responsibility',
        description:
          'Evidence of proactive preparation for potential contingencies.',
      },
      {
        id: 'adaptability',
        name: 'Adaptability',
        description:
          'Evidence of readiness to adjust according to emerging circumstances.',
      },
    ],
    hints: [
      {
        id: 'hint-5-1',
        order: 1,
        text: 'Good judgement does not require perfect information.',
      },
      {
        id: 'hint-5-2',
        order: 2,
        text: 'Think about reducing the consequences of uncertainty.',
      },
      {
        id: 'hint-5-3',
        order: 3,
        text: 'Consider whether a backup plan can preserve the objective.',
      },
    ],
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    optionalReasoning: true,
    active: true,
    createdAt: '2026-10-06T00:00:00.000Z',
  },
  {
    id: 'challenge-6',
    title: 'The Voice of the Group',
    scenario:
      'Your group strongly supports an idea because most members believe it will work. You notice one detail that may cause a problem, but you are not completely certain.',
    question: 'What should you do?',
    options: [
      {
        id: 'opt-6a',
        text: 'Stay silent because challenging the majority without certainty may slow the group down.',
      },
      {
        id: 'opt-6b',
        text: 'Reject the group’s idea and propose your own approach because noticing a possible problem gives you reason to act.',
      },
      {
        id: 'opt-6c',
        text: 'Explain the concern, ask the group to examine it, and remain open to being corrected.',
      },
      {
        id: 'opt-6d',
        text: 'Privately tell one trusted member about your concern and let them decide whether to raise it.',
      },
    ],
    correctOptionId: 'opt-6c',
    explanation:
      'Constructive courage means expressing a reasoned concern with intellectual humility for the benefit of the group.',
    criteria: [
      {
        id: 'confidence',
        name: 'Confidence',
        description:
          'Evidence of speaking up when holding an unconfirmed but reasoned perspective.',
      },
      {
        id: 'critical-thinking',
        name: 'Critical Thinking',
        description:
          'Evidence of identifying potential blindspots in consensus thinking.',
      },
      {
        id: 'cooperation',
        name: 'Cooperation',
        description:
          'Evidence of contributing to group goals without adversarial confrontation.',
      },
    ],
    hints: [
      {
        id: 'hint-6-1',
        order: 1,
        text: 'Confidence can mean expressing uncertainty responsibly.',
      },
      {
        id: 'hint-6-2',
        order: 2,
        text: 'Disagreement does not have to become confrontation.',
      },
      {
        id: 'hint-6-3',
        order: 3,
        text: 'Consider how to protect the group from a possible problem without assuming you are automatically correct.',
      },
    ],
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    optionalReasoning: true,
    active: true,
    createdAt: '2026-10-06T00:00:00.000Z',
  },
  {
    id: 'challenge-7',
    title: 'The Shortcut That Helps Today',
    scenario:
      'You are given a difficult assignment. Someone offers you their completed solution. You could submit it and finish immediately, but you know that a similar problem may appear in an important assessment later.',
    question: 'What is the strongest choice?',
    options: [
      {
        id: 'opt-7a',
        text: 'Use the solution because understanding the answer is still better than leaving the assignment incomplete.',
      },
      {
        id: 'opt-7b',
        text: 'Study the solution carefully and then reproduce its method in your own work.',
      },
      {
        id: 'opt-7c',
        text: 'Attempt the problem yourself first, use the solution only to identify where your reasoning differs, and then complete the work independently.',
      },
      {
        id: 'opt-7d',
        text: 'Refuse to look at the solution under any circumstances because independent work should never involve outside assistance.',
      },
    ],
    correctOptionId: 'opt-7c',
    explanation:
      'Prioritizing genuine understanding over superficial completion builds enduring capability.',
    criteria: [
      {
        id: 'self-reliance',
        name: 'Self-Reliance',
        description:
          'Evidence of engaging with difficulty directly rather than taking cognitive shortcuts.',
      },
      {
        id: 'responsibility',
        name: 'Responsibility',
        description:
          'Evidence of taking ownership of long-term learning outcomes.',
      },
      {
        id: 'growth-orientation',
        name: 'Learning Orientation',
        description:
          'Evidence of valuing skill mastery over effortless short-term results.',
      },
    ],
    hints: [
      {
        id: 'hint-7-1',
        order: 1,
        text: 'Think beyond completing today’s assignment.',
      },
      {
        id: 'hint-7-2',
        order: 2,
        text: 'External help can be useful without replacing your own thinking.',
      },
      {
        id: 'hint-7-3',
        order: 3,
        text: 'Consider which option leaves you more capable of solving a similar problem tomorrow.',
      },
    ],
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    optionalReasoning: true,
    active: true,
    createdAt: '2026-10-06T00:00:00.000Z',
  },
  {
    id: 'challenge-8',
    title: 'Individual Success vs Group Harmony',
    scenario:
      'Your group can complete a project faster if one member’s suggestion is ignored. Their idea is not necessarily the best, but they have raised a concern that the group has not fully discussed.',
    question: 'What should you do?',
    options: [
      {
        id: 'opt-8a',
        text: 'Follow the majority because prolonged discussion could prevent the project from being completed.',
      },
      {
        id: 'opt-8b',
        text: 'Give the concern a reasonable opportunity to be examined before the group commits to the faster approach.',
      },
      {
        id: 'opt-8c',
        text: 'Accept the member’s suggestion so that everyone feels included even if the idea is unlikely to work.',
      },
      {
        id: 'opt-8d',
        text: 'Ask the teacher to decide because disagreements within a group are difficult to resolve objectively.',
      },
    ],
    correctOptionId: 'opt-8b',
    explanation:
      'True harmony reconciles task progress with thorough, respectful evaluation of all perspectives.',
    criteria: [
      {
        id: 'harmony',
        name: 'Harmony',
        description:
          'Evidence of ensuring fair hearing of concerns while maintaining group cohesion.',
      },
      {
        id: 'cooperation',
        name: 'Cooperation',
        description:
          'Evidence of collaborative problem analysis over dismissive speed.',
      },
      {
        id: 'critical-thinking',
        name: 'Critical Thinking',
        description:
          'Evidence of testing potential overlooked flaws in a proposed plan.',
      },
    ],
    hints: [
      {
        id: 'hint-8-1',
        order: 1,
        text: 'Harmony is not the same as avoiding disagreement.',
      },
      {
        id: 'hint-8-2',
        order: 2,
        text: 'Consider whether the concern could reveal something the majority has missed.',
      },
      {
        id: 'hint-8-3',
        order: 3,
        text: 'The goal is neither automatic agreement nor automatic rejection.',
      },
    ],
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    optionalReasoning: true,
    active: true,
    createdAt: '2026-10-06T00:00:00.000Z',
  },
  {
    id: 'challenge-9',
    title: 'When Confidence Is Tested',
    scenario:
      'You volunteer to lead a task because you believe you can do it. Halfway through, you discover a difficulty you did not anticipate. Other people now know that your original plan is not working.',
    question: 'What is the strongest response?',
    options: [
      {
        id: 'opt-9a',
        text: 'Continue confidently with the original plan so others do not lose faith in your leadership.',
      },
      {
        id: 'opt-9b',
        text: 'Admit that the original approach needs revision, identify the problem, and propose a modified plan.',
      },
      {
        id: 'opt-9c',
        text: 'Hand the task to someone more experienced because continuing after failure may make the situation worse.',
      },
      {
        id: 'opt-9d',
        text: 'Avoid discussing the difficulty until you have privately found a complete solution.',
      },
    ],
    correctOptionId: 'opt-9b',
    explanation:
      'Authentic confidence demonstrates transparency and adaptive leadership rather than defensiveness or abandonment.',
    criteria: [
      {
        id: 'confidence',
        name: 'Confidence',
        description:
          'Evidence of composure and transparency when faced with unexpected difficulty.',
      },
      {
        id: 'adaptability',
        name: 'Adaptability',
        description:
          'Evidence of recalibrating approach without losing focus on the objective.',
      },
      {
        id: 'responsibility',
        name: 'Responsibility',
        description:
          'Evidence of owning mistakes and providing constructive direction.',
      },
    ],
    hints: [
      {
        id: 'hint-9-1',
        order: 1,
        text: 'Confidence is not the same as pretending that a problem does not exist.',
      },
      {
        id: 'hint-9-2',
        order: 2,
        text: 'Consider what trustworthy leadership looks like when a plan fails.',
      },
      {
        id: 'hint-9-3',
        order: 3,
        text: 'Changing a method does not necessarily mean abandoning the goal.',
      },
    ],
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    optionalReasoning: true,
    active: true,
    createdAt: '2026-10-06T00:00:00.000Z',
  },
  {
    id: 'challenge-10',
    title: 'The Choice That Builds The Person',
    scenario:
      'You are given one hour to complete a difficult task. You can choose a simple method that will probably produce an acceptable result, or a more challenging method that may take longer but will teach you a capability you currently lack. The final outcome matters, but there is no immediate penalty for choosing either approach.',
    question: 'What should influence your decision most?',
    options: [
      {
        id: 'opt-10a',
        text: 'Choose the safer method because completing the task successfully should remain the primary objective.',
      },
      {
        id: 'opt-10b',
        text: 'Choose the harder method because personal growth should always be preferred over immediate success.',
      },
      {
        id: 'opt-10c',
        text: 'Compare the importance of the current outcome, the learning opportunity, and the realistic risk before choosing.',
      },
      {
        id: 'opt-10d',
        text: 'Choose whichever method is more likely to impress the people evaluating the work.',
      },
    ],
    correctOptionId: 'opt-10c',
    explanation:
      'Mature human development balances situational duty, personal growth, and reasoned risk assessment.',
    criteria: [
      {
        id: 'self-reliance',
        name: 'Self-Reliance',
        description:
          'Evidence of taking conscious responsibility for personal development.',
      },
      {
        id: 'judgement',
        name: 'Judgement',
        description:
          'Evidence of weighing risk, objective consequences, and developmental benefits.',
      },
      {
        id: 'growth-orientation',
        name: 'Growth Orientation',
        description:
          'Evidence of recognizing opportunities to expand capability.',
      },
      {
        id: 'confidence',
        name: 'Confidence',
        description:
          'Evidence of readiness to engage challenge when thoughtfully evaluated.',
      },
    ],
    hints: [
      {
        id: 'hint-10-1',
        order: 1,
        text: 'Neither difficulty nor safety is automatically the better choice.',
      },
      {
        id: 'hint-10-2',
        order: 2,
        text: 'Consider both the present responsibility and the capability you can develop.',
      },
      {
        id: 'hint-10-3',
        order: 3,
        text: 'The strongest decision balances purpose, risk, and growth.',
      },
    ],
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    optionalReasoning: true,
    active: true,
    createdAt: '2026-10-06T00:00:00.000Z',
  },
];
