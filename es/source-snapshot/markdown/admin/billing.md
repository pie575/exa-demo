> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="billing-and-rate-limits">
  # Facturación y límites de tasa
</div>

> Gestiona los créditos, las facturas y los límites de tasa de la API de Exa.

Exa ofrece un nivel gratuito, facturación de pago por uso y planes Enterprise personalizados. El uso de la API se descuenta del saldo de créditos de tu equipo, mientras que los límites de tasa controlan la rapidez con la que el equipo puede realizar solicitudes.

<Columns cols={3}>
  <Card title="Panel de facturación" icon="credit-card" href="https://dashboard.exa.ai/billing" cta="Gestionar facturación" arrow="true">
    Añade créditos, configura la recarga automática y consulta tus facturas.
  </Card>

  <Card title="API keys" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Gestionar API keys" arrow="true">
    Revisa el uso y establece un límite menor para una key concreta.
  </Card>

  <Card title="Precios" icon="tag" href="/es/docs/admin/pricing" cta="Ver precios" arrow="true">
    Compara las tarifas actuales de los productos de Exa.
  </Card>
</Columns>

<div id="plans-at-a-glance">
  ## Planes de un vistazo
</div>

| Plan             | Facturación                                                                    | Límite de tasa                                   | Concurrencia de Agent |
| ---------------- | ------------------------------------------------------------------------------ | ------------------------------------------------ | --------------------- |
| **Free**         | $20 en créditos iniciales y, después, $10 en créditos que se renuevan cada mes | 10 QPS                                           | 50 runs activos       |
| **Pago por uso** | Créditos prepagados, sin suscripción ni gasto mínimo                           | 10 QPS, [hasta 25 QPS](#25-qps-on-pay-as-you-go) | 50 runs activos       |
| **Enterprise**   | Precios por volumen personalizados y facturación pospago opcional              | Personalizado                                    | Personalizada         |

<Card title="Contáctanos" icon="headset" href="https://exa.ai/contact/sales" cta="Contactar con ventas" arrow="true">
  Te asesoraremos sobre la mejor configuración para gestionar la latencia, la escala, ZDR y más.
</Card>

<div id="billing-basics">
  ## Conceptos básicos de facturación
</div>

Las solicitudes se cobran con cargo a créditos prepagados según las tarifas indicadas en [Precios](/es/docs/admin/pricing) o conforme a tu contrato Enterprise. Los propietarios del equipo pueden añadir créditos desde el [panel de facturación](https://dashboard.exa.ai/billing); los pagos se procesan a través de Stripe.

Si tu equipo agota sus créditos, las solicitudes devuelven `402 Payment Required`. Una API key que alcanza el presupuesto asignado también devuelve `402`. Añade créditos o pide a un administrador del equipo que ajuste el presupuesto de la key. Consulta [Códigos de error](/es/docs/admin/error-codes).

Para consultar el uso histórico por API key, usa [Get API key usage](/es/docs/reference/team-management/get-api-key-usage).

<div id="rate-limits">
  ## Límites de tasa
</div>

Los límites de tasa se miden en consultas por segundo (QPS) y se aplican a tu equipo en conjunto, sumando todas sus API keys. Puedes asignar un límite menor a una key individual desde la página [API Keys](https://dashboard.exa.ai/api-keys), pero su tráfico sigue contando para el límite del equipo.

| Endpoint                                                    | Límite predeterminado   |
| ----------------------------------------------------------- | ----------------------- |
| `/search`, `/answer`, `/chat/completions`                   | 10 QPS                  |
| `/search` con `type` `deep-lite`, `deep` o `deep-reasoning` | 5 QPS                   |
| `/contents`                                                 | 100 QPS                 |
| `/agent/runs`, `/responses`                                 | 5 QPS y 50 runs activos |
| `/websets/*`                                                | 20 QPS                  |

Algunos endpoints comparten la capacidad del límite de tasa. Los límites están sujetos a cambios y pueden variar según el plan; las búsquedas de Websets también tienen límites de concurrencia según el plan, que puedes consultar con [Get Team Info](/es/docs/websets/api/teams/get-team-info).

Cuando superas un límite, las solicitudes devuelven `429 Too Many Requests`. Espera el tiempo indicado en el encabezado `Retry-After` cuando esté presente, o reintenta con exponential backoff. Consulta [Códigos de error](/es/docs/admin/error-codes).

<div id="agent-limits">
  ### Límites de Agent
</div>

Los límites de Agent son dos controles independientes: cuántos runs pueden estar en curso a la vez y con qué rapidez puedes iniciar nuevos.

* **Concurrencia**: puede haber 50 runs de Agent en curso simultáneamente. Este límite es independiente de tu QPS y no cambia aunque se aumente tu QPS. Iniciar un run por encima del límite devuelve `429` con el código de error `CONCURRENCY_LIMIT_REACHED`; espera a que termine algún run o contáctanos para aumentar tu límite de concurrencia.
* **Inicio de runs**: `POST /agent/runs` consume del QPS de tu cuenta, y cada inicio de run cuenta como dos solicitudes. Puedes iniciar runs a la mitad de tu QPS, de modo que una cuenta con los 10 QPS predeterminados puede iniciar 5 runs por segundo, y con 25 QPS se permiten 12 por segundo.
* **Sondeo**: las solicitudes `GET` para consultar el estado de un run, los eventos y las listas de runs no cuentan para tu QPS ni bloquean nunca el despacho, así que puedes sondear los Agents en ejecución con independencia de la rapidez con la que inicies nuevos.

<div id="25-qps-on-pay-as-you-go">
  ### 25 QPS con pago por uso
</div>

Añade $1.000 en créditos en cualquier periodo de 30 días y el límite de tasa de tu equipo subirá automáticamente a **25 QPS durante 90 días**. El umbral tiene en cuenta los créditos que compras, no los que gastas, y volver a alcanzarlo reinicia los 90 días. Consulta tu progreso en el [panel de facturación](https://dashboard.exa.ai/billing).

¿Necesitas más de 25 QPS? [Habla con ventas](https://exa.ai/contact/sales).

<div id="auto-recharge">
  ## Recarga automática
</div>

La recarga automática compra créditos cuando tu saldo alcanza el umbral que elijas. Configúrala desde el [panel de facturación](https://dashboard.exa.ai/billing).

| Ajuste                | Descripción                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Monto de recarga**  | Créditos que se compran cada vez que se activa la recarga automática, desde $5 hasta $10.000.                                                                |
| **Umbral de recarga** | El saldo con el que se activa la recarga.                                                                                                                    |
| **Máximo mensual**    | Límite opcional para las compras por recarga automática durante el ciclo de facturación. Establécelo en $0 o déjalo en blanco para no aplicar ningún límite. |

Por ejemplo, con un monto de recarga de $100, un umbral de $10 y un máximo mensual de $500, se compran $100 cada vez que el saldo llega a $10, hasta un total de $500 en compras automáticas durante el ciclo.

Si tienes un lanzamiento próximo u otra carga de trabajo de alto volumen, añade suficientes créditos por anticipado y define un monto de recarga automática que evite muchos intentos de pago pequeños.

<div id="receipts-and-invoices">
  ## Recibos y facturas
</div>

Exa envía por correo electrónico los recibos de las compras de créditos y de las recargas automáticas desde [billing@exa.ai](mailto:billing@exa.ai). Añade la dirección a tu lista de remitentes permitidos si es necesario. El historial completo de tus facturas está disponible en el [panel de facturación](https://dashboard.exa.ai/billing).

La facturación pospago está disponible con un plan Enterprise.

<div id="get-help">
  ## Obtener ayuda
</div>

<Columns cols={2}>
  <Card title="Aumenta tus límites" icon="gauge" href="https://exa.ai/contact/sales" cta="Contactar con ventas" arrow="true">
    Solicita más de 25 QPS, concurrencia personalizada, precios por volumen o facturación pospago.
  </Card>

  <Card title="Soporte de facturación" icon="mail" href="mailto:billing@exa.ai" cta="Escribir a facturación" arrow="true">
    Recibe ayuda con pagos, créditos, facturas o consultas sobre la facturación de tu cuenta.
  </Card>
</Columns>