import type { MarkdownContent } from '@/types/sections';

export const aboutContent: MarkdownContent = {
  kind: 'markdown',
  body: [
    '# About',
    '',
    '_[This section intentionally waiting for Ishan to write it in his own voice — fill via the hidden admin post-deploy.]_',
    '',
    'Placeholder until the real bio lands:',
    '',
    '- **Ishan Kumar Sahu** — B.Tech CSE (Data Science) student at Bhilai Institute of Technology, Durg',
    '- ML/DL researcher focused on deepfake detection, adversarial ML, low-resource NLP, and edge-deployed AI',
    '- Builder of ShrutiAI (offline ISL translator, Smart India Hackathon 2025 winner), BinSense (IoT smart-waste platform, ₹2L DST i-NIDHI grant), and AksharDhara (Chhattisgarhi dialect speech translation)',
    '',
    '> Use the file tree on the left to navigate the rest of the workspace. Press the theme toggle in the bottom-right if dark isn\u2019t your thing.',
  ].join('\n'),
};
