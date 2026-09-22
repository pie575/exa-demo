> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="nevermined">
  # Nevermined
</div>

> Pagos autónomos de agentes para Exa mediante la card delegation x402 de Nevermined. Una compra de 7 USD aprovisiona o recarga una API key de Exa con 7 USD en créditos.

Los agentes pagan a Exa con tarjeta de crédito mediante el esquema de [card-delegation x402](https://nevermined.ai/docs/specs/x402-card-delegation) de [Nevermined](https://nevermined.ai). Cada **compra de $7** devuelve una API key de Exa con **$7 en créditos de Exa**.

<Info>
  Usa este plan ID de Nevermined:<br />`27800462147494506865542649899724877617306579171265399959488097895839186996870`<br />Este plan se ejecuta en el entorno en vivo de Nevermined (API keys con prefijo live). La compra corresponde a créditos de API, no a una única solicitud de búsqueda.
</Info>

Si el pagador usa Nevermined por primera vez, `POST /team-management/nevermined/purchase-key` aprovisiona una nueva API key de Exa y añade $7 en créditos. Si la key se queda sin saldo, genera un nuevo token x402 con la misma delegation y llama de nuevo al mismo endpoint. Exa devuelve la misma API key con otros $7 en créditos añadidos.

<div id="buy-a-key">
  ## Comprar una key
</div>

```bash theme={null}
POST https://admin-api.exa.ai/team-management/nevermined/purchase-key
payment-signature: <x402-token>
```

* **Costo:** $7 por compra, cargados a la tarjeta asociada a la delegation a la que hace referencia el x402 token.
* **Respuesta (pagador nuevo):** `{ status: "ok", apiKey: "…", expiresAt: null }` — una nueva API key de Exa con $7 en créditos.
* **Respuesta (pagador recurrente):** `{ status: "ok", apiKey: "…", expiresAt: null }` — la misma API key de Exa con $7 adicionales en créditos.
* **Respuesta (token reproducido):** resultado en caché, sin cargo adicional.
* **Firma ausente o inválida:** `402 Payment Required` con los requisitos de pago en el cuerpo.

<div id="how-it-works">
  ## Cómo funciona
</div>

Nevermined se encarga de la parte de pagos; Exa solo ve el token x402 firmado.

1. **Configuración inicial (a cargo del titular de la tarjeta):** registra una tarjeta en [nevermined.app](https://nevermined.app), crea una **delegation** sobre ella (el permiso de gasto: el titular define un límite y una duración, y puede acotarla a una API key concreta) y emite una API key de Nevermined para el agente.
2. **El agente localiza su delegation.** El SDK de Nevermined permite al agente descubrir las delegations con las que puede gastar su key y elegir una con presupuesto restante suficiente (al menos $7). Si no hay ninguna, el titular puede crearla en el panel, o un agente totalmente autónomo puede crearla mediante el SDK dentro de los límites de la tarjeta.
3. **El agente genera un access token x402** para el plan ID anterior, con el esquema card-delegation, referenciando la delegation por ID. Las delegations deben existir antes de generar el token; los tokens no pueden crearlas sobre la marcha.
4. **El agente envía el token por POST al endpoint anterior** en el encabezado `payment-signature` y recibe la API key de Exa en la respuesta.
5. **La key funciona de inmediato** con la [Exa Search API](/es/docs/search/quickstart) estándar.

Para la guía completa lista para agentes (métodos del SDK, parámetros, descubrimiento y creación de delegations, resolución de problemas), consulta la guía de integración de Exa de Nevermined: [nevermined.ai/docs/integrations/exa](https://nevermined.ai/docs/integrations/exa) (agentes: obtengan [nevermined.ai/docs/integrations/exa.md](https://nevermined.ai/docs/integrations/exa.md)).

<div id="what-7-buys">
  ## Qué puedes obtener con $7
</div>

Los créditos se consumen según los precios estándar de la API de Exa. Con las tarifas actuales, $7 en créditos cubren aproximadamente:

| Endpoint o funcionalidad                                     |                                   Precio |         Uso aproximado |
| ------------------------------------------------------------ | ---------------------------------------: | ---------------------: |
| Search (`instant`, `fast`, `auto`) con hasta 10 resultados |                   $7 / 1.000 solicitudes |      1.000 solicitudes |
| Deep-Lite Search                                             |                  $10 / 1.000 solicitudes |        700 solicitudes |
| Deep Search                                                  |                  $12 / 1.000 solicitudes |       ~583 solicitudes |
| Deep-Reasoning Search                                        |                  $15 / 1.000 solicitudes |       ~466 solicitudes |
| Contents (`text`, `highlights` o `summary`)                  | $1 / 1.000 páginas por tipo de contenido |          7.000 páginas |
| Resúmenes de página generados por IA en Search o Contents    |                       $1 / 1.000 páginas |        7.000 resúmenes |
| Resultados adicionales a partir del décimo                   |                    $1 / 1.000 resultados | 7.000 resultados extra |
| Answer                                                       |                   $5 / 1.000 solicitudes |      1.400 solicitudes |
| Monitors                                                     |                  $15 / 1.000 solicitudes |       ~466 solicitudes |

Las solicitudes de Search incluyen texto y highlights para hasta 10 resultados. Los resultados que superen esos 10 y los resúmenes generados por IA se facturan por separado.<br />
Para consultar todos los detalles de precios, visita [Precios de Exa](https://exa.ai/pricing).

<div id="when-the-key-runs-out">
  ## Cuando la key se agota
</div>

Exa devuelve **`HTTP 402`** en los endpoints habituales de la API cuando se agotan los créditos de la API key:

```json theme={null}
{
  "requestId": "...",
  "error": "You have exceeded your credits limit. Please top up to keep using Exa at dashboard.exa.ai",
  "tag": "NO_MORE_CREDITS"
}
```

Genera un nuevo x402 token con el mismo plan ID y la misma delegation, y vuelve a enviarlo mediante POST al mismo endpoint `/purchase-key`. Exa añade otros $7 en créditos a la misma API key.

<div id="references">
  ## Referencias
</div>

* [Guía de integración de Exa con Nevermined](https://nevermined.ai/docs/integrations/exa)
* [Especificación de x402 card-delegation](https://nevermined.ai/docs/specs/x402-card-delegation)
* [Precios de Exa](https://exa.ai/pricing)
* [Exa Search API](/es/docs/search/quickstart)