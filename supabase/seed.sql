-- seed.sql — demo rows mirroring the static content in src/sections-content/.
-- Run after 0001_init.sql. SAFE to re-run (upserts).

insert into public.sections (section_key, content) values
  ('site_banner',
    '{"kind":"banner","enabled":false,"message":"Under Development"}'::jsonb)
  on conflict (section_key) do nothing;


insert into public.sections (section_key, content) values
  ('about',
    '{"kind":"markdown","body":"# About\n\n_[This section intentionally waiting for Ishan to write it in his own voice — fill via the hidden admin post-deploy.]_\n\nPlaceholder until the real bio lands:\n\n- **Ishan Kumar Sahu** — B.Tech CSE (Data Science) student at Bhilai Institute of Technology, Durg\n- ML/DL researcher focused on deepfake detection, adversarial ML, low-resource NLP, and edge-deployed AI\n- Builder of ShrutiAI (offline ISL translator, Smart India Hackathon 2025 winner), BinSense (IoT smart-waste platform, ₹2L DST i-NIDHI grant), and AksharDhara (Chhattisgarhi dialect speech translation)\n\n> Use the file tree on the left to navigate the rest of the workspace."}'::jsonb)
  on conflict (section_key) do nothing;

insert into public.sections (section_key, content) values
  ('experience',
    '{"kind":"structured-list","entries":[{"id":"mist-lab-2026","title":"ML / DL Intern","subtitle":"MIST Lab, IIT Bhilai","start":"Jun 2026","end":"Sept 2026","location":"Durg, Chhattisgarh","bullets":["Researching generator-agnostic deepfake detection.","Implementing and extending GAKer and conditional diffusion models."],"tags":["PyTorch","Diffusion","Adversarial ML"]}]}'::jsonb)
  on conflict (section_key) do nothing;

insert into public.sections (section_key, content) values
  ('projects',
    '{"kind":"structured-list","entries":[{"id":"shrutiai","title":"ShrutiAI","subtitle":"Offline sign-language translation system","bullets":["Offline edge-deployed ISL gesture-recognition system on Raspberry Pi.","Dense neural network trained on 1,38,216 datapoints across 70 ISL signs; 99.89% accuracy.","Won Smart India Hackathon 2025 — Hardware Edition (PSID 25247)."],"tags":["Raspberry Pi","MediaPipe","TensorFlow/Keras","React","Node.js"],"imageUrl":"https://picsum.photos/seed/shrutiai/640/360"},{"id":"binsense","title":"BinSense","subtitle":"IoT-based smart waste management platform","bullets":["IoT sensor network across 10 deployed dustbin units streaming fill-level telemetry.","Recipient of ₹2 Lakh DST i-NIDHI grant. Won 1st Prize at Code of the Phoenix Hackathon 2024."],"tags":["ESP32","ThingSpeak","Firebase","React","Django"],"imageUrl":"https://picsum.photos/seed/binsense/640/360"},{"id":"akshardhara","title":"AksharDhara","subtitle":"Low-resource dialect speech translation pipeline","bullets":["End-to-end speech-to-text translation pipeline for Chhattisgarhi.","Fine-tuned Whisper and NLLB-200-600M; improved chrF by 46.34% over baseline."],"tags":["OpenAI Whisper","Meta NLLB-200","PyTorch","Hugging Face"],"imageUrl":"https://picsum.photos/seed/akshardhara/640/360"}]}'::jsonb)
  on conflict (section_key) do nothing;

insert into public.sections (section_key, content) values
  ('achievements',
    '{"kind":"structured-list","entries":[{"id":"sih-2025","title":"Winner — Smart India Hackathon 2025 (Hardware Edition)","subtitle":"PSID 25247 · Built ShrutiAI","bullets":["Won with ShrutiAI — offline ISL-to-English sign-language translation on Raspberry Pi."],"tags":["Smart India Hackathon","Hardware","ISL","Edge AI"]}]}'::jsonb)
  on conflict (section_key) do nothing;

insert into public.sections (section_key, content) values
  ('education',
    '{"kind":"structured-list","entries":[{"id":"bit-durg","title":"B.Tech, Computer Science & Engineering (Data Science)","subtitle":"Bhilai Institute of Technology, Durg","start":"Sept 2023","end":"Sept 2027","bullets":["CPI: 8.31 (till 5th semester).","Relevant coursework: DSA, Machine Learning, DBMS, Computer Networks, Statistics."],"tags":["BIT Durg","Data Science","CSE"]}]}'::jsonb)
  on conflict (section_key) do nothing;

insert into public.sections (section_key, content) values
  ('leadership',
    '{"kind":"structured-list","entries":[{"id":"csea-2024","title":"Secretary — Computer Science Engineering Association (CSEA)","subtitle":"BIT Durg","start":"2024","end":"Present","bullets":["Coordinated workshops, coding competitions, and technical events."],"tags":["Leadership","Technical Society","BIT Durg"]}]}'::jsonb)
  on conflict (section_key) do nothing;

insert into public.sections (section_key, content) values
  ('skills',
    '{"kind":"json","data":{"languages":["Python","JavaScript"],"ml_computer_vision":["PyTorch","TensorFlow","CNNs","MediaPipe","Ultralytics YOLO","scikit-learn"],"llms_nlp":["LoRA","QLoRA","PEFT","Hugging Face Transformers","OpenAI Whisper","NLLB-200"],"web_backend":["React","Node.js","Django","Docker","Tailwind CSS","Bootstrap","REST APIs"],"embedded_iot":["Raspberry Pi","ESP32/ESP8266","ThingSpeak","Firebase","Sensors"]}}'::jsonb)
  on conflict (section_key) do nothing;

insert into public.sections (section_key, content) values
  ('contact',
    '{"kind":"toml","data":{"identity":{"name":"Ishan Kumar Sahu","title":"B.Tech CSE (Data Science) student, ML/DL researcher"},"email":"ishanksahu@bitdurg.ac.in","phone":"+91 9302597193","links":{"github":"https://github.com/ishanksahu","huggingface":"https://huggingface.co/ishanksahu","linkedin":"https://www.linkedin.com/in/ishanksahu"},"cv":"/Curriculum_Vitae_Ishan.pdf"}}'::jsonb)
  on conflict (section_key) do nothing;
