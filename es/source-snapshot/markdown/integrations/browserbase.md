> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Browserbase {#browserbase}

> Combina la búsqueda de empresas de Exa con la automatización del navegador de Browserbase para flujos de trabajo de postulación a empleos.

Usa Exa para encontrar empresas y sus páginas de empleo, y luego usa Browserbase y Stagehand para inspeccionar esas páginas e interactuar con ellas.

## Instalación {#install}

Instala los paquetes que utiliza la plantilla de Browserbase para Exa:

```bash npm theme={null}
npm install @browserbasehq/stagehand dotenv exa-js zod
```

## Configurar variables de entorno {#configure-environment-variables}

Define las API keys que utilizan Exa y Browserbase:

```bash .env theme={null}
BROWSERBASE_API_KEY=your-browserbase-api-key
EXA_API_KEY=your-exa-api-key
```

## Búsqueda e interacción con una página {#search-and-interact-with-a-page}

El siguiente ejemplo sigue el flujo de trabajo de la plantilla: buscar empresas, encontrar una página de empleo, abrirla en una sesión de Browserbase, extraer la descripción del puesto y permitir que un agente de Stagehand interactúe con la página.

```typescript quickstart.ts theme={null}
import "dotenv/config";
import { Stagehand } from "@browserbasehq/stagehand";
import Exa from "exa-js";
import { z } from "zod";

const exa = new Exa(process.env.EXA_API_KEY);

const companies = await exa.search("AI startups in SF", {
  category: "company",
  type: "auto",
  numResults: 5,
  contents: { text: true },
});

const company = companies.results[0];
if (!company?.url) {
  throw new Error("No matching company found");
}

const companyDomain = new URL(company.url).hostname.replace("www.", "");
const careers = await exa.search(`${companyDomain} careers page`, {
  excludeDomains: ["linkedin.com"],
  type: "deep",
  numResults: 5,
  contents: { text: true },
});

const careersUrl = careers.results[0]?.url;
if (!careersUrl) {
  throw new Error("No careers page found");
}

const stagehand = new Stagehand({
  env: "BROWSERBASE",
  model: "google/gemini-2.5-pro",
});

try {
  await stagehand.init();
  const page = stagehand.context.pages()[0];
  await page.goto(careersUrl);

  const jobDescription = await stagehand.extract(
    "Extract the job title, requirements, responsibilities, and other important details from this page.",
    z.object({
      jobTitle: z.string(),
      requirements: z.array(z.string()),
      responsibilities: z.array(z.string()),
      details: z.string(),
    }),
  );

  const agent = stagehand.agent({
    mode: "hybrid",
    model: "google/gemini-3-flash-preview",
    systemPrompt: "Interact with the page without submitting an application.",
  });

  const result = await agent.execute({
    instruction: `Review this job posting and identify the next application step. Job details: ${JSON.stringify(jobDescription)}`,
    maxSteps: 10,
  });

  console.log(result);
} finally {
  await stagehand.close();
}
```

La plantilla incluye el flujo de trabajo completo para extraer los detalles de las ofertas de empleo, generar respuestas personalizadas y rellenar formularios de solicitud. Consulta la [implementación en TypeScript](https://github.com/browserbase/templates/tree/dev/typescript/exa-browserbase) o la [implementación en Python](https://github.com/browserbase/templates/tree/dev/python/exa-browserbase).