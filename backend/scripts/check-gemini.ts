import "../src/config/env.ts";
import { callGemini } from "../src/config/gemini.ts";

async function main() {
  const prompt =
    'Return only this exact JSON: {"ok":true,"source":"gemini","message":"connection working"}';
  const response = await callGemini(prompt);
  console.log(response);
}

main().catch((error) => {
  console.error("[check-gemini] failed", error?.message ?? error);
  process.exit(1);
});
