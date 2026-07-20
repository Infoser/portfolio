import type { JsonContent } from '@/types/sections';

export const skillsContent: JsonContent = {
  kind: 'json',
  data: {
    languages: ['Python', 'JavaScript'],
    'ml_computer_vision': ['PyTorch', 'TensorFlow', 'CNNs', 'MediaPipe', 'Ultralytics YOLO', 'scikit-learn'],
    'llms_nlp': ['LoRA', 'QLoRA', 'PEFT', 'Hugging Face Transformers', 'OpenAI Whisper', 'NLLB-200'],
    web_backend: ['React', 'Node.js', 'Django', 'Docker', 'Tailwind CSS', 'Bootstrap', 'REST APIs'],
    embedded_iot: ['Raspberry Pi', 'ESP32/ESP8266', 'ThingSpeak', 'Firebase', 'Sensors'],
  },
};
