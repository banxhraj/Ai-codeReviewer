import cors from 'cors';

export const corsOptions = {
  origin: [
    'https://ai-code-reviewer-1cys.vercel.app',
    'https://ai-code-reviewer-seven-bay.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};
