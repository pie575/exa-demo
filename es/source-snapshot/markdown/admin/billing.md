> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="billing-and-rate-limits">
  # Facturación y límites de tasa
</div>

> Gestiona los credits de Exa, las facturas y los límites de tasa de la API.

Exa ofrece un plan gratuito, facturación de pago por uso y planes Enterprise personalizados. El uso de la API se descuenta del saldo de credits de tu equipo, mientras que los límites de tasa controlan con qué frecuencia puede hacer solicitudes.

<Columns cols={3}>
  <Card title="Panel de facturación" icon="credit-card" href="https://dashboard.exa.ai/billing" cta="Gestionar facturación" arrow="true">
    Añade credits, configura la recarga automática y consulta tus facturas.
  </Card>

  <Card title="API keys" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Gestionar API keys" arrow="true">
    Revisa el uso y establece un límite más bajo para una key concreta.
  </Card>

  <Card title="Precios" icon="tag" href="/es/docs/admin/pricing" cta="Ver precios" arrow="true">
    Compara las tarifas actuales de los productos de Exa.
  </Card>
</Columns>

<div id="plans-at-a-glance">
  ## Planes de un vistazo
</div>

| Plan              | Facturación                                                                        | Límite de tasa                                   | concurrency de Agent  |
| ----------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------- |
| **Free**          | $20 en credit de bienvenida y, después, $10 en credit que se renuevan cada mes | 10 QPS                                           | 50 ejecuciones activas |
| **Pay as you go** | credit prepagados, sin suscripción ni gasto mínimo                               | 10 QPS, [hasta 25 QPS](#25-qps-on-pay-as-you-go) | 50 ejecuciones activas |
| **Enterprise**    | Precios personalizados por volumen y facturación pospago opcional                  | Personalizado                                    | Personalizado          |

<Card title="Contáctanos" icon="headset" href="https://exa.ai/contact/sales" cta="Contactar con ventas" arrow="true">
  Te asesoraremos sobre la mejor configuración para gestionar la latencia, la escala, ZDR y mucho más.
</Card>

<div id="billing-basics">
  ## Conceptos básicos de facturación
</div>

Las solicitudes se cobran a los credits prepagados según las tarifas indicadas en [Precios](/es/docs/admin/pricing) o en tu contrato Enterprise. Los propietarios del equipo pueden añadir credits desde el [panel de Facturación](https://dashboard.exa.ai/billing); los pagos se procesan a través de Stripe.

Si tu equipo agota sus credits, las solicitudes devuelven `402 Payment Required`. Una API key que alcance el presupuesto asignado también devuelve `402`. Añade credits o pide a un administrador del equipo que ajuste el presupuesto de la key. Consulta [Códigos de error](/es/docs/admin/error-codes).

Para consultar el uso histórico por API key, usa [Obtener uso de una API key](/es/docs/reference/team-management/get-api-key-usage).

<div id="rate-limits">
  ## Límites de tasa
</div>

Los límites de tasa se miden en consultas por segundo (QPS) y se aplican a tu equipo en conjunto, incluyendo todas sus API keys. Puedes asignar un límite menor a una key individual desde la página [API Keys](https://dashboard.exa.ai/api-keys), pero su tráfico sigue contando para el límite del equipo.

| Endpoint                                                    | Límite predeterminado          |
| ----------------------------------------------------------- | ------------------------------ |
| `/search`, `/answer`, `/chat/completions`                   | 10 QPS                         |
| `/search` con `type` `deep-lite`, `deep` o `deep-reasoning` | 5 QPS                          |
| `/contents`                                                 | 100 QPS                        |
| `/agent/runs`, `/responses`                                 | 5 QPS y 50 ejecuciones activas |
| `/websets/*`                                                | 20 QPS                         |

Algunos endpoints comparten la capacidad del límite de tasa. Los límites están sujetos a cambios y pueden variar según el plan; las búsquedas de Websets también tienen límites de concurrency según el plan, que puedes consultar con [Get Team Info](/es/docs/websets/api/teams/get-team-info).

Cuando superas un límite, las solicitudes devuelven `429 Too Many Requests`. Espera el tiempo indicado por el encabezado `Retry-After` cuando esté presente, o reintenta con retroceso exponencial. Consulta [Códigos de error](/es/docs/admin/error-codes).

<div id="agent-limits">
  ### Límites de Agent
</div>

Los límites de Agent son dos controles distintos: cuántas ejecuciones pueden estar en curso a la vez y con qué rapidez puedes iniciar nuevas ejecuciones.

* **Concurrency**: puede haber 50 ejecuciones de Agent en curso a la vez. Este límite es independiente de tu QPS y no cambia aunque se aumente tu QPS. Iniciar una ejecución por encima del límite devuelve `429` con el código de error `CONCURRENCY_LIMIT_REACHED`; espera a que termine alguna ejecución o contáctanos para aumentar tu límite de concurrency.
* **Inicio de ejecuciones**: `POST /agent/runs` consume del QPS de tu cuenta y cada inicio de ejecución cuenta como dos solicitudes. Puedes iniciar ejecuciones a la mitad de tu QPS, de modo que una cuenta con los 10 QPS predeterminados puede iniciar 5 ejecuciones por segundo, y con 25 QPS se permiten 12 por segundo.
* **Sondeo**: las solicitudes `GET` para consultar el estado de una ejecución, los eventos y las listas de ejecuciones no cuentan para tu QPS ni bloquean nunca el despacho, así que puedes sondear los Agents en ejecución sin importar la rapidez con la que inicies otros nuevos.

<div id="25-qps-on-pay-as-you-go">
  ### 25 QPS en pago por uso
</div>

Añade $1.000 en credits en cualquier ventana de 30 días y el límite de tasa de tu equipo subirá automáticamente a **25 QPS durante 90 días**. El umbral tiene en cuenta los credits que compras, no los que gastas, y volver a cumplirlo reinicia los 90 días. Consulta tu progreso en el [panel de Facturación](https://dashboard.exa.ai/billing).

¿Necesitas más de 25 QPS? [Habla con ventas](https://exa.ai/contact/sales).

<div id="auto-recharge">
  ## Recarga automática
</div>

La recarga automática compra credits cuando tu saldo alcanza un umbral que tú defines. Configúrala desde el [panel de Facturación](https://dashboard.exa.ai/billing).

| Configuración         | Descripción                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Monto de recarga**  | Credits que se compran cada vez que se activa la recarga automática, desde $5 hasta $10,000.                                                |
| **Umbral de recarga** | El saldo con el que se activa la recarga.                                                                                                   |
| **Máximo mensual**    | Límite opcional para las compras de recarga automática durante el ciclo de facturación. Déjalo en $0 o vacío para no aplicar ningún límite. |

Por ejemplo, con un monto de recarga de $100, un umbral de $10 y un máximo mensual de $500, se compran $100 cada vez que el saldo llega a $10, hasta un total de $500 en compras automáticas durante el ciclo.

Si tienes un lanzamiento próximo u otra carga de trabajo de alto volumen, agrega suficientes credits por adelantado y define un monto de recarga automática que evite muchos intentos de pago pequeños.

<div id="receipts-and-invoices">
  ## Recibos y facturas
</div>

Exa envía por correo electrónico los recibos de las compras de credit y de las recargas automáticas desde [billing@exa.ai](mailto:billing@exa.ai). Si es necesario, agrega esa dirección a tu lista de remitentes permitidos. Todo tu historial de facturas está disponible en el [panel de Facturación](https://dashboard.exa.ai/billing).

La facturación pospago está disponible con un plan Enterprise.

<div id="get-help">
  ## Obtener ayuda
</div>

<Columns cols={2}>
  <Card title="Aumenta tus límites" icon="gauge" href="https://exa.ai/contact/sales" cta="Contactar con ventas" arrow="true">
    Solicita más de 25 QPS, concurrency personalizada, precios por volumen o facturación pospago.
  </Card>

  <Card title="Soporte de facturación" icon="mail" href="mailto:billing@exa.ai" cta="Escribir a facturación" arrow="true">
    Recibe ayuda con pagos, credits, facturas o cualquier duda sobre la facturación de tu cuenta.
  </Card>
</Columns>