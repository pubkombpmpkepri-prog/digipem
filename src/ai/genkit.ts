import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {firebase} from '@genkit-ai/firebase';
import {googleCloud} from '@genkit-ai/google-cloud';

// Initialize Genkit and configure plugins.
// You can add or remove plugins as needed.
// See https://genkit.dev/docs/plugins for a list of available plugins.
export const ai = genkit({
  plugins: [
    // The Firebase plugin is used to deploy flows and other resources
    // to Firebase. See https://genkit.dev/docs/plugins/firebase
    firebase(),

    // The Google AI plugin is used to access models like Gemini.
    // See https://genkit.dev/docs/plugins/google-ai
    googleAI(),

    // The Google Cloud plugin is used to enable production-ready tracing.
    // See https://genkit.dev/docs/plugins/google-cloud
    googleCloud(),
  ],
  // Log all requests and responses to the console.
  logLevel: 'debug',
  // Perform OpenTelemetry instrumentation and enable traces locally.
  enableTracingAndMetrics: true,
});
