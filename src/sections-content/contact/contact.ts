import type { TomlContent } from '@/types/sections';

export const contactContent: TomlContent = {
  kind: 'toml',
  data: {
    identity: {
      name: 'Ishan Kumar Sahu',
      title: 'B.Tech CSE (Data Science) student, ML/DL researcher',
    },
    email: 'ishanksahu@bitdurg.ac.in',
    phone: '+91 9302597193',
    links: {
      github: 'https://github.com/ishanksahu',
      huggingface: 'https://huggingface.co/ishanksahu',
      linkedin: 'https://www.linkedin.com/in/ishanksahu',
    },
    cv: '/Curriculum_Vitae_Ishan.pdf',
  },
};
