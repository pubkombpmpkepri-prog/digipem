import {ai} from './genkit';

// This is a sample flow.
// You can delete this file and create your own flows.
ai.defineFlow(
  {
    name: 'helloFlow',
  },
  async name => {
    return `Hello, ${name}!`;
  }
);
