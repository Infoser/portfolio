import type { StructuredListContent } from '@/types/sections';

export const experienceContent: StructuredListContent = {
  kind: 'structured-list',
  entries: [
    {
      id: 'mist-lab-2026',
      title: 'ML / DL Intern',
      subtitle: 'MIST Lab, IIT Bhilai',
      start: 'Jun 2026',
      end: 'Sept 2026',
      location: 'Durg, Chhattisgarh',
      bullets: [
        'Researching generator-agnostic deepfake detection — building models that identify AI-generated facial images regardless of the source generator or architecture.',
        'Implementing and extending GAKer (adversarial example generation) and conditional diffusion models; studying cross-generator generalization under distribution shift.',
        'Applying deep learning and image-processing techniques toward a unified detection framework robust to unseen generators.',
      ],
      tags: ['PyTorch', 'Diffusion', 'Adversarial ML', 'Deepfake Detection'],
      links: [],
    },
    {
      id: 'spaceborn-2026',
      title: 'ML / LLM Intern',
      subtitle: 'Spaceborn Autonomous Systems',
      start: 'Apr 2026',
      end: 'Present',
      location: 'Remote',
      bullets: [
        'Building CV features for autonomous drone navigation: gesture control, path and trajectory prediction, and obstacle avoidance using SLAM sensor data.',
        'Contributing to the LLM pipeline via LoRA and QLoRA fine-tuning; handling output customization, training automation, and dataset generation and integration.',
      ],
      tags: ['Computer Vision', 'SLAM', 'LoRA', 'QLoRA', 'Drones'],
      links: [],
    },
  ],
};
