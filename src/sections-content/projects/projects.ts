import type { StructuredListContent } from '@/types/sections';

export const projectsContent: StructuredListContent = {
  kind: 'structured-list',
  entries: [
    {
      id: 'shrutiai',
      title: 'ShrutiAI',
      subtitle: 'Offline sign-language translation system',
      bullets: [
        'Offline edge-deployed ISL gesture-recognition system running on Raspberry Pi \u2014 converts hand gestures to English text in real time via MediaPipe landmark extraction with no internet dependency.',
        'Dense neural network trained on a self-curated dataset of 1,38,216 datapoints across 70 ISL signs; achieved 99.89% test accuracy (loss: 0.0037) with 2ms per-sample inference on the trained model.',
        'Won Smart India Hackathon 2025 \u2014 Hardware Edition (PSID 25247). React + Node.js interface renders translations with sub-second display refresh.',
      ],
      tags: ['Raspberry Pi', 'MediaPipe', 'TensorFlow/Keras', 'React', 'Node.js'],
      links: [
        { label: 'Demo', href: '#', kind: 'demo' },
        { label: 'Site', href: '#', kind: 'site' },
      ],
      imageUrl: 'https://picsum.photos/seed/shrutiai/640/360',
    },
    {
      id: 'binsense',
      title: 'BinSense',
      subtitle: 'IoT-based smart waste management platform',
      bullets: [
        'IoT sensor network across 10 deployed dustbin units streaming fill-level telemetry to Firebase; automated threshold-based alerts to municipal authorities.',
        'Waste-pattern analytics module estimating 65% reduction in redundant collection trips.',
        'Recipient of \u20b92 Lakh government research funding under DST i-NIDHI scheme, CSVTU. Won 1st Prize at Code of the Phoenix Hackathon \u2014 IIIT Naya Raipur, 2024.',
      ],
      tags: ['ESP32', 'ThingSpeak', 'Firebase', 'React', 'Django'],
      links: [
        { label: 'GitHub', href: '#', kind: 'github' },
        { label: 'Site', href: '#', kind: 'site' },
        { label: 'Demo', href: '#', kind: 'demo' },
      ],
      imageUrl: 'https://picsum.photos/seed/binsense/640/360',
    },
    {
      id: 'akshardhara',
      title: 'AksharDhara',
      subtitle: 'Low-resource dialect speech translation pipeline',
      bullets: [
        'End-to-end speech-to-text translation pipeline for Chhattisgarhi \u2014 a low-resource dialect spoken by ~18 million people with virtually no prior NLP tooling.',
        'Fine-tuned Whisper (ASR) and NLLB-200-600M (translation) on a self-curated dataset of 20,000 sentence pairs; improved chrF score by 46.34% over the base-model baseline, with ~1s end-to-end latency per utterance.',
      ],
      tags: ['OpenAI Whisper', 'Meta NLLB-200', 'PyTorch', 'Hugging Face'],
      links: [
        { label: 'GitHub', href: '#', kind: 'github' },
        { label: 'HuggingFace', href: '#', kind: 'site' },
      ],
      imageUrl: 'https://picsum.photos/seed/akshardhara/640/360',
    },
  ],
};
