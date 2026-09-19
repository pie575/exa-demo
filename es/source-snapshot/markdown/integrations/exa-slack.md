> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="exa-in-slack">
  # Exa en Slack
</div>

> Instala Exa en Slack y menciona a @Exa en cualquier canal o hilo para obtener respuestas con citas sobre investigación, creación de listas y enrichment.

Lleva Exa al Slack de tu equipo. Menciona a **@Exa** en cualquier canal o hilo con una pregunta de investigación, una tarea de creación de listas o una solicitud de enrichment. Exa busca en la web, lee las fuentes y responde en el propio hilo con respuestas citadas.

<div id="get-started">
  ## Primeros pasos
</div>

<div id="installation">
  ### Instalación
</div>

1. Ve a [Dashboard &gt; Management &gt; Exa in Slack](https://dashboard.exa.ai/integrations/slack) y haz clic en **Install**.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/dashboard-install.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5c4f876b2618cb7c86126aa8d7c6b8a1" alt="La página Exa in Slack en el dashboard de Exa, con el botón Install" width="3414" height="900" data-path="images/integrations/exa-slack/dashboard-install.png" />

2. Se abrirá el flujo de OAuth de Slack. Elige el espacio de trabajo en el que quieres tener Exa y haz clic en **Allow**.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/oauth-approval.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=81e3f3a144d7edfcd599cf26ac76b332" alt="Pantalla de aprobación de OAuth de Slack para la aplicación Exa, con el aviso &#x22;App is not approved by Slack&#x22;, el selector de espacio de trabajo, los permisos solicitados y el botón Allow" width="1820" height="1180" data-path="images/integrations/exa-slack/oauth-approval.png" />

<Note>
  El aviso rojo **«App is not approved by Slack»** es normal y puedes ignorarlo sin problema. Solo
  significa que Exa no está en el Slack Marketplace público, no que haya algún problema.
</Note>

3. Una vez instalada, invita a @Exa a un canal (o envíale un mensaje directo) y empieza a hacerle preguntas.

<div id="how-to-use-exa-from-slack">
  ## Cómo usar Exa desde Slack
</div>

En cualquier canal en el que se haya añadido Exa, menciona a @Exa junto con tu pregunta:

```text theme={null}
@Exa encuentra todas las startups fintech de Serie A en SF
```

Exa responde a tu pregunta en el mismo hilo.

<div id="follow-ups">
  ### Preguntas de seguimiento
</div>

Cuando Exa haya respondido en un hilo, basta con responder en ese mismo hilo para continuar la conversación. No hace falta volver a mencionar a @Exa. Exa recuerda la conversación, por lo que las preguntas de seguimiento parten de la respuesta anterior. Cualquier persona del hilo puede hacerlas.

<div id="direct-messages">
  ### Mensajes directos
</div>

También puedes escribirle a Exa por mensaje directo (DM). Ahí no hace falta mencionarla. Cada mensaje que envíes inicia una nueva solicitud, que se responde en un hilo debajo de ese mensaje. Responde en el hilo para continuar la conversación.

<div id="cancelling-a-run">
  ### Cancelar una ejecución
</div>

Mientras una ejecución está en curso, responde en el hilo y pídele a Exa que la detenga. No hace falta mencionarlo.

```text theme={null}
Detén la ejecución actual
```

<div id="exa-connect-providers">
  ### Proveedores de Exa Connect
</div>

Exa incluye automáticamente los proveedores de datos de [Exa Connect](/es/docs/agent/connect/overview) cuando son relevantes para tu pregunta. Para usar un proveedor específico, menciónalo en tu mensaje:

```text theme={null}
@Exa búscame todas las startups de infraestructura de IA que levantaron financiación este trimestre usando Fiber.ai
```

Para obtener la lista de todos los proveedores de datos disponibles, basta con preguntarle a Exa.

<div id="examples">
  ## Ejemplos
</div>

<div id="news-and-current-events">
  ### Noticias y actualidad
</div>

Entérate de lo último sobre cualquier tema.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/thread-answer.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9922bc4e50694de279554241b02c5e3f" alt="Exa respondiendo una pregunta sobre las últimas noticias de un tema en un hilo de Slack, con resultados fechados en una tabla" width="2594" height="944" data-path="images/integrations/exa-slack/thread-answer.png" />

<div id="large-list-building">
  ### Creación de listas extensas
</div>

Antepón `!max` a la solicitud para crear listas exhaustivas.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/max-list-building.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=1efbd746ac778aeac2039750e86bccb2" alt="Exa ejecutando una solicitud de creación de listas con !max en un hilo de Slack y devolviendo una tabla de resultados" width="1998" height="971" data-path="images/integrations/exa-slack/max-list-building.png" />

<div id="keywords">
  ## Palabras clave
</div>

Úsalas en un hilo en el que esté Exa. Los comandos pueden ir después de una mención `@Exa` o iniciar el mensaje directamente:

| Palabra clave     | Función                                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `!max <message>`  | Ejecuta esta solicitud con el máximo esfuerzo; pensado para crear listas muy grandes.                                       |
| `mute`            | Hace que Exa deje de responder a las respuestas sin mención en el hilo. Las menciones explícitas a @Exa siguen funcionando. |
| `unmute`          | Reanuda el seguimiento del hilo después de un `mute`.                                                                       |
| `sleep`           | Hace que Exa deje de trabajar por completo en el hilo. Menciona a @Exa para reactivarlo.                                    |
| `aside <message>` | Publica un comentario aparte que Exa ignora; útil para hablar con compañeros de equipo en un hilo que Exa está siguiendo.   |
| `help`            | Muestra las instrucciones de uso.                                                                                           |

<div id="permissions">
  ## Permisos
</div>

La aplicación de Exa para Slack solicita los siguientes ámbitos:

| Permiso                | Acceso en Slack                                                                  | Por qué lo necesita Exa                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `app_mentions:read`    | Ver mensajes que mencionan directamente a @Exa                                   | Iniciar una solicitud cuando alguien menciona a Exa en un canal o hilo                                                             |
| `assistant:write`      | Actuar como App Agent en Slack                                                   | Usar la experiencia de agente de Slack y transmitir respuestas en mensajes directos e hilos de canal                               |
| `channels:history`     | Ver mensajes en canales públicos a los que se ha añadido Exa                     | Recibir respuestas en hilos de canales públicos para que los seguimientos funcionen sin necesidad de otra mención                  |
| `channels:read`        | Ver información básica sobre canales públicos                                    | Encontrar canales públicos que ya incluyan a Exa al elegir dónde sincronizar una sesión web                                        |
| `chat:write`           | Enviar mensajes como la aplicación de Exa                                        | Publicar mensajes iniciales de hilo, respuestas, actualizaciones de progreso, confirmaciones y mensajes sincronizados desde la web |
| `chat:write.customize` | Personalizar el nombre y el avatar de un mensaje creado por la aplicación        | Mostrar el nombre y la imagen de perfil del participante web en los mensajes sincronizados desde la aplicación web                 |
| `files:read`           | Ver archivos compartidos en conversaciones a las que se ha añadido Exa           | Leer los archivos adjuntos a las preguntas                                                                                         |
| `files:write`          | Subir, editar y eliminar archivos como la aplicación de Exa                      | Adjuntar archivos de resultados, como tablas exportadas, a las respuestas                                                          |
| `groups:history`       | Ver mensajes en canales privados a los que se ha añadido Exa                     | Recibir respuestas en hilos de canales privados para que los seguimientos funcionen sin necesidad de otra mención                  |
| `groups:read`          | Ver información básica sobre canales privados a los que se ha añadido Exa        | Encontrar canales privados aptos y verificar la pertenencia al elegir un destino de sincronización de sesión web                   |
| `im:history`           | Ver mensajes en los mensajes directos con Exa                                    | Recibir solicitudes por mensaje directo y respuestas de seguimiento                                                                |
| `im:write`             | Iniciar mensajes directos                                                        | Abrir el mensaje directo de Exa de un usuario verificado cuando lo elige como destino de sincronización de sesión web              |
| `users:read`           | Ver personas y sus perfiles básicos de Slack                                     | Asociar las menciones con nombres y usar la imagen de perfil de Slack de un participante web en los mensajes sincronizados         |
| `users:read.email`     | Ver las direcciones de correo electrónico de los miembros del espacio de trabajo | Vincular cuentas de Slack y Exa para la atribución de equipo y las imágenes de perfil personalizadas en mensajes web               |

<Note>
  `channels:read`, `groups:read` e `im:write` permiten descubrir destinos para la sincronización de la web a Slack.
  Las instalaciones existentes pueden seguir usando sus hilos de Slack actuales sin estos ámbitos, pero
  deben volver a conectarse antes de usar el destino correspondiente. `chat:write.customize` es opcional en
  tiempo de ejecución: sin él, los mensajes sincronizados desde la web conservan la identidad estándar de la aplicación de Exa e incluyen el
  nombre del participante en el cuerpo del mensaje.
</Note>

Exa solo recibe mensajes de los canales a los que se le ha invitado explícitamente y de sus propios mensajes directos.

<div id="pricing">
  ## Precios
</div>

Las ejecuciones iniciadas desde Slack se facturan a tu equipo de Exa. Consulta los [precios](https://exa.ai/pricing) para más información.

<div id="privacy">
  ## Privacidad
</div>

Para más detalles sobre cómo Exa gestiona tus datos, consulta la [política de privacidad de Exa](https://exa.ai/privacy-policy).