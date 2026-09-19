> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="security-overview">
  # Descripción general de seguridad
</div>

> Información sobre seguridad, cumplimiento normativo y acceso regional de Exa.

***

En Exa nos tomamos muy en serio la seguridad y la privacidad de los datos. Contamos con la certificación SOC 2 Type II, lo que demuestra nuestro compromiso con mantener prácticas y controles rigurosos de seguridad de la información.

Escríbenos a [sales@exa.ai](mailto:sales@exa.ai) para hablar sobre un plan Enterprise si te interesa la [retención cero de datos](/es/docs/admin/security/zero-data-retention), el [cumplimiento de HIPAA](/es/docs/admin/security/hipaa) u otras soluciones personalizadas de seguridad de datos.

Visita nuestro [Trust Center](https://trust.exa.ai) para consultar nuestros informes SOC 2, el Acuerdo de Tratamiento de Datos y demás documentación de seguridad.

<div id="regional-access-restrictions">
  ## Restricciones de acceso por región
</div>

Para cumplir con las sanciones y las restricciones comerciales, Exa bloquea el acceso a la API desde países y regiones sancionados o sujetos a otras restricciones, incluidos Crimea, Cuba, Irán, Corea del Norte, Rusia, Siria, Ucrania y Venezuela.

Cloudflare puede bloquear las solicitudes procedentes de estas ubicaciones antes de que lleguen a Exa. En ese caso, la respuesta puede ser una página de bloqueo del WAF de Cloudflare con un Ray ID en lugar del JSON de error estándar de la API de Exa.

Si crees que tu tráfico se está geolocalizando de forma incorrecta, escribe a [hello@exa.ai](mailto:hello@exa.ai) indicando tu dirección IP de origen, el país o la región, la marca de tiempo de la solicitud y el Ray ID de Cloudflare.