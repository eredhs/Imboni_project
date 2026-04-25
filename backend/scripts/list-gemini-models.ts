import "../src/config/env.ts";

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  const models = Array.isArray(data.models) ? data.models : [];
  const supported = models
    .filter((model: any) => Array.isArray(model.supportedGenerationMethods))
    .filter((model: any) => model.supportedGenerationMethods.includes("generateContent"))
    .map((model: any) => ({
      name: model.name,
      displayName: model.displayName,
      methods: model.supportedGenerationMethods,
    }));

  console.log(JSON.stringify(supported, null, 2));
}

main().catch((error) => {
  console.error("[list-gemini-models] failed", error?.message ?? error);
  process.exit(1);
});
