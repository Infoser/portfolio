import type { MarkdownContent } from '@/types/sections';

export const aboutContent: MarkdownContent = {
  kind: 'markdown',
  body: [
    '# About',
    '',
    "I'm **Ishan Kumar Sahu** — a third-year B.Tech CSE (Data Science) student at Bhilai Institute of Technology, Durg (CPI: 8.31).",
    '',
    'My work sits at the intersection of **deepfake detection**, **adversarial ML**, **low-resource NLP**, and **edge-deployed AI under real-world hardware constraints**. I like building systems that have to actually run somewhere constrained — a Raspberry Pi, a drone, a municipal dustbin — not just in a notebook.',
    '',
    'Currently I am:',
    '',
    '- **ML / DL Intern, MIST Lab (IIT Bhilai)** — researching generator-agnostic deepfake detection; extending GAKer and conditional diffusion models to generalize across unseen generators under domain shift.',
    '- **ML / LLM Intern, Spaceborn Autonomous Systems** (remote) — building CV features for autonomous drone navigation (gesture control, trajectory prediction, SLAM-based obstacle avoidance) and contributing to the LLM pipeline via LoRA / QLoRA fine-tuning.',
    '',
    "Things I've shipped that I'm proud of:",
    '',
    '- **ShrutiAI** — offline ISL-to-English sign-language translation on Raspberry Pi; won Smart India Hackathon 2025 (Hardware Edition, PSID 25247).',
    '- **BinSense** — IoT smart-waste platform deployed across 10 dustbin units; recipient of Rupees 2 Lakh DST i-NIDHI funding from CSVTU.',
    '- **AksharDhara** — end-to-end Chhattisgarhi speech-to-text translation (Whisper + NLLB-200); 46.34% chrF improvement over the base model baseline.',
    '',
    "> Navigate via the explorer tree on the left. Theme toggle is bottom-right if dark isn't your thing.",
  ].join('\n'),
};
