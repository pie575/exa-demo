> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Descripción general de seguridad {#security-overview}

> Información sobre seguridad, cumplimiento y acceso regional de Exa.

***

En Exa nos tomamos en serio la seguridad y la privacidad de los datos. Nos enorgullece contar con la certificación SOC 2 Type II, que demuestra nuestro compromiso con mantener prácticas y controles rigurosos de seguridad de la información.

Escríbenos a [sales@exa.ai](mailto:sales@exa.ai) para hablar sobre un plan Enterprise si te interesa [Zero Data Retention](/es/docs/admin/security/zero-data-retention), el [cumplimiento de HIPAA](/es/docs/admin/security/hipaa) u otras soluciones personalizadas de seguridad de datos.

Visita nuestro [Trust Center](https://trust.exa.ai) para consultar nuestros informes SOC 2, el Acuerdo de Tratamiento de Datos y demás documentación de seguridad.

## Restricciones de acceso regional {#regional-access-restrictions}

Para cumplir con las sanctions y las restricciones comerciales, Exa bloquea el acceso a la API desde países y regiones sancionados o restringidos de algún otro modo, como Crimea, Cuba, Irán, Corea del Norte, Rusia, Siria, Ucrania y Venezuela.

Cloudflare puede bloquear las solicitudes provenientes de estas ubicaciones antes de que lleguen a Exa. En ese caso, la respuesta puede ser una página de bloqueo del WAF de Cloudflare con un Ray ID en lugar del JSON de error estándar de la API de Exa.

Si crees que tu traffic se está geolocalizando de forma incorrecta, escribe a [hello@exa.ai](mailto:hello@exa.ai) indicando tu dirección IP de origen, el país o región, el timestamp de la solicitud y el Ray ID de Cloudflare.