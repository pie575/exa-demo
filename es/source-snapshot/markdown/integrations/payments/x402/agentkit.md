> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="world-agentkit">
  # World AgentKit
</div>

> Permite que los agentes de IA respaldados por personas verificadas accedan a Exa gratis con World AgentKit, sin necesidad de USDC.

<div id="what-is-agentkit">
  ## ¿Qué es AgentKit?
</div>

[World AgentKit](https://docs.world.org/agents/agent-kit) es un conjunto de herramientas que permite a los agentes de IA demostrar que están respaldados por una persona real y verificada mediante [World ID](https://world.org). Al integrarse con [x402](/es/docs/integrations/payments/x402/quickstart), habilita una vía de **prueba gratuita**: los agentes registrados en [AgentBook](https://docs.world.org/agents/agent-kit/integrate) de World pueden acceder a los endpoints `/search` y `/contents` de Exa sin pagar USDC.

Esto funciona junto con el flujo de pago x402 estándar. Cada persona verificada dispone de **100 solicitudes gratuitas al mes** repartidas entre todos los agentes que respalda. Una vez agotadas, el agente vuelve a la vía de pago normal con USDC. Los contadores se reinician al inicio de cada mes natural (UTC).

<Info>
  Tanto la prueba gratuita de AgentKit como el pago x402 se omiten si tu solicitud incluye un encabezado `x-api-key` o `Authorization: Bearer`. El flujo normal de facturación por API key tiene prioridad.
</Info>

<div id="how-it-works">
  ## Cómo funciona
</div>

Cuando un cliente llama a `/search` o `/contents` sin una API key, Exa responde con `402 Payment Required`. La respuesta incluye una extensión `agentkit` en el encabezado `PAYMENT-REQUIRED` que contiene un desafío [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) (Sign-In with Ethereum).

El agente firma este desafío con su wallet registrada y Exa verifica:

1. **Comprobación de la firma** — valida la firma SIWE frente a la dirección de la wallet (admite tanto EOA mediante EIP-191 como smart contract wallets mediante ERC-1271)
2. **Consulta en AgentBook** — resuelve la wallet a un `humanId` anónimo mediante el contrato AgentBook en World Chain (`eip155:480`), lo que confirma que una única persona verificada delegó su identidad a este agente
3. **Comprobación de uso** — si a la persona aún le quedan usos de prueba gratuita, se concede el acceso; de lo contrario, se exige un pago en USDC

<div id="quickstart">
  ## Quickstart
</div>

<div id="1-register-your-agent-in-agentbook">
  ### 1. Registra tu agente en AgentBook
</div>

Esta configuración solo se hace una vez. Necesitas la [World App](https://world.org/download) con una identidad verificada.

```bash theme={null}
npx @worldcoin/agentkit-cli register <your-agent-wallet-address>
```

La CLI inicia un flujo de verificación en World App y luego envía una transacción de registro en World Chain. Una vez completado, cualquier server que use AgentKit puede consultar tu wallet y confirmar que está respaldada por una persona real.

<div id="2-send-a-request-get-the-challenge">
  ### 2. Enviar una solicitud (obtener el desafío)
</div>

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

La respuesta `402` incluye una extensión `agentkit` dentro del payload decodificado de `PAYMENT-REQUIRED`:

```json theme={null}
{
  "x402Version": 2,
  "accepts": [ ... ],
  "extensions": {
    "agentkit": {
      "info": {
        "version": "1",
        "statement": "Verify your agent is backed by a real human to access Exa",
        "domain": "api.exa.ai",
        "uri": "https://api.exa.ai/search",
        "nonce": "abc123...",
        "issuedAt": "2026-04-11T01:30:00.000Z",
        "resources": ["https://api.exa.ai/search"]
      },
      "supportedChains": [
        { "chainId": "eip155:480", "type": "eip191" },
        { "chainId": "eip155:480", "type": "eip1271" }
      ],
      "schema": { ... },
      "_options": {
        "statement": "Verify your agent is backed by a real human to access Exa",
        "mode": { "type": "free-trial", "uses": 100 },
        "network": "eip155:480"
      }
    }
  }
}
```

<div id="3-sign-the-challenge-and-resubmit">
  ### 3. Firma el desafío y reenvía la solicitud
</div>

Construye un [mensaje SIWE](https://eips.ethereum.org/EIPS/eip-4361) a partir de los campos de `info` (domain, uri, nonce, statement, etc.), fírmalo con la wallet registrada de tu agente usando uno de los tipos de `supportedChains` y envíalo en el encabezado `agentkit` (JSON codificado en base64):

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -H "agentkit: <base64-encoded-signed-challenge>" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

Si el agente está verificado y le quedan usos de prueba gratuita, Exa devuelve `200` con los resultados de búsqueda, sin necesidad de pago.

<div id="using-the-agentkit-x402-skill">
  ### Uso de la skill AgentKit x402
</div>

En lugar de implementar manualmente el flujo de desafío-respuesta, añade la [skill agentkit-x402](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md) a tu agente de IA:

```bash theme={null}
npx skills add worldcoin/agentkit agentkit-x402
```

Esta skill gestiona automáticamente el flujo completo cuando el agente recibe una respuesta `402` con una extensión de AgentKit.

<div id="free-trial-details">
  ## Detalles de la prueba gratuita
</div>

* Cada persona verificada obtiene **100 solicitudes gratuitas al mes** entre todos los agentes que respalda
* Los contadores de uso se reinician al inicio de cada mes natural (UTC)
* El uso se contabiliza por persona y por endpoint (`/search` y `/contents` se cuentan por separado)
* Dos agentes respaldados por la misma persona comparten el mismo contador
* Una vez agotados los usos de prueba gratuita del mes, el agente vuelve al [flujo de pago x402](/es/docs/integrations/payments/x402/quickstart) estándar
* El mismo [límite de 10 resultados](/es/docs/integrations/payments/x402/quickstart#pricing) se aplica a las solicitudes de prueba gratuita en `/search`
* Actualmente el contador de la prueba gratuita no se expone en la respuesta de la API: cuando se agotan los usos, el server responde con un `402` estándar sin conceder acceso gratuito

<div id="supported-endpoints">
  ## Endpoints compatibles
</div>

| Endpoint    | Pago x402 | Prueba gratuita de AgentKit |
| ----------- | :-------: | :-------------------------: |
| `/search`   |     Sí    |              Sí             |
| `/contents` |     Sí    |              Sí             |

El resto de endpoints de Exa no son compatibles con x402 ni con la prueba gratuita de AgentKit.

<div id="network-details">
  ## Detalles de la red
</div>

| Propiedad                   | Valor                                             |
| --------------------------- | ------------------------------------------------- |
| Cadena de AgentBook         | World Chain                                       |
| Chain ID (CAIP-2)           | `eip155:480`                                      |
| Verificación                | Contrato AgentBook en World Chain                 |
| Tipos de wallet compatibles | EOA (EIP-191) y smart contract wallets (ERC-1271) |

<div id="faq">
  ## Preguntas frecuentes
</div>

<AccordionGroup>
  <Accordion title="¿Puedo usar el pago x402 y AgentKit a la vez?">
    Sí. La respuesta `PAYMENT-REQUIRED` incluye tanto el precio del pago como el desafío de AgentKit. Tu cliente puede elegir cualquiera de las dos vías. Si se agotan los usos de prueba gratuita, el agente puede recurrir al pago con USDC.
  </Accordion>

  <Accordion title="¿Qué ocurre si mi agente no está registrado en AgentBook?">
    La verificación de AgentKit falla de forma silenciosa y la solicitud se trata como un `402` estándar: tu agente igualmente puede pagar con USDC mediante el flujo x402 habitual.
  </Accordion>

  <Accordion title="¿Dos agentes respaldados por la misma persona obtienen cuotas de prueba gratuita independientes?">
    No. El uso se contabiliza por persona (mediante el `humanId` anónimo de AgentBook), no por wallet. Dos agentes respaldados por el mismo World ID comparten el mismo contador.
  </Accordion>

  <Accordion title="¿Qué redes blockchain intervienen?">
    Los pagos estándar de x402 en USDC pueden liquidarse en **Base** (`eip155:8453`) o en **Solana mainnet** (`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`). La verificación de AgentKit usa **World Chain** (`eip155:480`) para las consultas en AgentBook. Son independientes: AgentKit no requiere ningún pago on-chain.
  </Accordion>

  <Accordion title="¿Qué tipos de wallet son compatibles?">
    Tanto las EOA (cuentas de propiedad externa) que usan firmas EIP-191 como las smart contract wallet (por ejemplo, Coinbase Smart Wallet, Safe) que usan ERC-1271. Consulta la [referencia del SDK de World AgentKit](https://docs.world.org/agents/agent-kit/sdk-reference) para más detalles.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Recursos
</div>

* [Guía de pago con x402](/es/docs/integrations/payments/x402/quickstart): flujo de pago estándar con USDC
* [Documentación de World AgentKit](https://docs.world.org/agents/agent-kit): documentación completa de AgentKit
* [Guía de integración de World AgentKit](https://docs.world.org/agents/agent-kit/integrate): registro en AgentBook
* [Referencia del SDK de World AgentKit](https://docs.world.org/agents/agent-kit/sdk-reference): referencia de la API del SDK
* [Skill x402 de AgentKit](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md): skill predefinida para agentes de IA
* [Documentación del protocolo x402](https://docs.x402.org): especificación completa de x402