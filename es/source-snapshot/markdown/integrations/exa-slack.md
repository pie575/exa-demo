> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Exa in Slack {#exa-in-slack}

> Instala Exa en Slack y menciona a @Exa en cualquier canal o hilo para obtener respuestas con fuentes citadas sobre investigación, creación de listas y enrichment.

Lleva Exa al Slack de tu equipo. Menciona a **@Exa** en cualquier canal o hilo con una pregunta de investigación, una tarea de creación de listas o una solicitud de enrichment. Exa busca en la web, lee las fuentes y responde en el hilo con respuestas citadas.

## Primeros pasos {#get-started}

### Instalación {#installation}

1. Ve a [Dashboard &gt; Management &gt; Exa in Slack](https://dashboard.exa.ai/integrations/slack) y haz clic en **Install**.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/dashboard-install.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5c4f876b2618cb7c86126aa8d7c6b8a1" alt="La página de Exa in Slack en el Exa Dashboard, con el botón Install" width="3414" height="900" data-path="images/integrations/exa-slack/dashboard-install.png" />

2. Se abrirá el flujo de OAuth de Slack. Elige el espacio de trabajo en el que quieres usar Exa y haz clic en **Allow**.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/oauth-approval.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=81e3f3a144d7edfcd599cf26ac76b332" alt="Pantalla de aprobación de OAuth de Slack para la aplicación de Exa, que muestra el aviso &#x22;App is not approved by Slack&#x22;, un selector de espacio de trabajo, los permisos solicitados y el botón Allow" width="1820" height="1180" data-path="images/integrations/exa-slack/oauth-approval.png" />

<Note>
  El aviso rojo **&quot;App is not approved by Slack&quot;** es normal y puedes ignorarlo sin problema. Solo significa
  que Exa no está en el Slack Marketplace público, no que ocurra algún error.
</Note>

3. Una vez instalada, invita a @Exa a un canal (o escríbele por mensaje directo) y empieza a hacer preguntas.

## Cómo usar Exa desde Slack {#how-to-use-exa-from-slack}

En cualquier canal al que se haya añadido Exa, menciona a @Exa junto con tu pregunta:

```text theme={null}
@Exa encuentra todas las startups fintech de Serie A en SF
```

Exa responde a tu pregunta en el hilo.

### Follow-ups {#follow-ups}

Una vez que Exa haya respondido en un hilo, basta con responder en ese mismo hilo para continuar la conversación. No hace falta volver a mencionar a @Exa. Exa recuerda la conversación, así que los follow-ups parten de la respuesta anterior. Cualquier persona del hilo puede enviar un follow-up.

### Mensajes directos {#direct-messages}

También puedes escribirle a Exa directamente por DM. Ahí no hace falta ninguna mención. Cada mensaje que envíes inicia una nueva solicitud, que se responde en un hilo debajo de ese mensaje. Responde en el hilo para continuar esa conversación.

### Cancelar un run {#cancelling-a-run}

Mientras un run está en curso, responde en el hilo y pídele a Exa que lo detenga. No hace falta mencionarlo.

```text theme={null}
Detén el run actual
```

### Proveedores de Exa Connect {#exa-connect-providers}

Exa incluye automáticamente los proveedores de datos de [Exa Connect](/es/docs/agent/connect/overview) cuando son relevantes para tu pregunta. Para usar un proveedor específico, menciónalo en tu mensaje:

```text theme={null}
@Exa búscame todas las startups de infraestructura de IA que hayan levantado financiación este trimestre usando Fiber.ai
```

Para obtener una lista de todos los proveedores de datos disponibles, solo pregúntale a Exa.

## Ejemplos {#examples}

### Noticias y actualidad {#news-and-current-events}

Infórmate de lo último sobre cualquier tema.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/thread-answer.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9922bc4e50694de279554241b02c5e3f" alt="Exa respondiendo una pregunta sobre las últimas noticias de un tema en un hilo de Slack, con resultados fechados en una tabla" width="2594" height="944" data-path="images/integrations/exa-slack/thread-answer.png" />

### Creación de listas extensas {#large-list-building}

Antepón `!max` a la solicitud para una creación de listas exhaustiva.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/max-list-building.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=1efbd746ac778aeac2039750e86bccb2" alt="Exa ejecutando una solicitud de creación de listas con !max en un hilo de Slack y devolviendo una tabla de resultados" width="1998" height="971" data-path="images/integrations/exa-slack/max-list-building.png" />

## Palabras clave {#keywords}

Úsalas en un hilo en el que esté Exa. Los comandos pueden ir después de una mención a `@Exa` o iniciar el mensaje
directamente:

| Palabra clave     | Función                                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `!max <message>`  | Ejecuta esta solicitud con el máximo effort; pensado para crear listas muy grandes.                                         |
| `mute`            | Hace que Exa deje de responder a las respuestas sin mención en el hilo. Las menciones explícitas a @Exa siguen funcionando. |
| `unmute`          | Reanuda los follow-up en el hilo tras un `mute`.                                                                            |
| `sleep`           | Hace que Exa deje de trabajar por completo en el hilo. Menciona a @Exa para reactivarlo.                                    |
| `aside <message>` | Publica un comentario aparte que Exa ignora; útil para hablar con compañeros de equipo en un hilo que Exa está siguiendo.   |
| `help`            | Muestra las instrucciones de uso.                                                                                           |

## Permisos {#permissions}

La aplicación de Exa para Slack solicita los siguientes scopes:

| Permiso                | Acceso en Slack                                                       | Por qué lo necesita Exa                                                                                                       |
| ---------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `app_mentions:read`    | Ver mensajes que mencionan directamente a @Exa                        | Iniciar una solicitud cuando alguien menciona a Exa en un canal o hilo                                                        |
| `assistant:write`      | Actuar como App Agent en Slack                                        | Usar la experiencia de agente de Slack y transmitir respuestas en mensajes directos e hilos de canales                        |
| `channels:history`     | Ver mensajes en canales públicos a los que se añadió Exa              | Recibir respuestas en hilos de canales públicos para que los follow-ups funcionen sin otra mención                            |
| `channels:read`        | Ver información básica sobre canales públicos                         | Encontrar canales públicos que ya incluyan a Exa al elegir dónde sincronizar una sesión web                                   |
| `chat:write`           | Enviar mensajes como la aplicación de Exa                             | Publicar mensajes raíz de hilo, respuestas, actualizaciones de progreso, confirmaciones y mensajes sincronizados desde la web |
| `chat:write.customize` | Personalizar el nombre y el avatar de un mensaje creado por la app    | Mostrar el nombre y la imagen de perfil del participante web en los mensajes sincronizados desde la aplicación web            |
| `files:read`           | Ver archivos compartidos en conversaciones a las que se añadió Exa    | Leer los archivos adjuntos a las preguntas                                                                                    |
| `files:write`          | Subir, editar y eliminar archivos como la aplicación de Exa           | Adjuntar archivos de resultados, como tablas exportadas, a las respuestas                                                     |
| `groups:history`       | Ver mensajes en canales privados a los que se añadió Exa              | Recibir respuestas en hilos de canales privados para que los follow-ups funcionen sin otra mención                            |
| `groups:read`          | Ver información básica sobre canales privados a los que se añadió Exa | Encontrar canales privados aptos y verificar la pertenencia al elegir un destino de sincronización de sesión web              |
| `im:history`           | Ver mensajes en mensajes directos con Exa                             | Recibir solicitudes por mensaje directo y respuestas de follow-up                                                             |
| `im:write`             | Iniciar mensajes directos                                             | Abrir el mensaje directo con Exa de un usuario verificado cuando lo elija como destino de sincronización de sesión web        |
| `users:read`           | Ver personas y sus perfiles básicos de Slack                          | Convertir menciones en nombres y usar la imagen de perfil de Slack de un participante web en los mensajes sincronizados       |
| `users:read.email`     | Ver las direcciones de correo de los miembros del espacio de trabajo  | Vincular cuentas de Slack y Exa para la atribución de equipo y personalizar las imágenes de perfil de los mensajes web        |

<Note>
  `channels:read`, `groups:read` e `im:write` habilitan el descubrimiento de destinos para la sincronización de la web a Slack.
  Las instalaciones existentes pueden seguir usando sus hilos de Slack actuales sin estos scopes, pero
  deben volver a conectarse antes de usar el destino correspondiente. `chat:write.customize` es opcional en
  tiempo de ejecución: sin él, los mensajes sincronizados desde la web conservan la identidad estándar de la aplicación de Exa e incluyen el
  nombre del participante en el cuerpo del mensaje.
</Note>

Exa solo recibe mensajes de los canales a los que se la ha invitado explícitamente y de sus propios mensajes directos.

## Precios {#pricing}

Los runs iniciados desde Slack se facturan a tu equipo de Exa. Consulta los [precios](https://exa.ai/pricing) para más detalles.

## Privacidad {#privacy}

Para conocer más detalles sobre cómo Exa trata tus datos, consulta la [política de privacidad de Exa](https://exa.ai/privacy-policy).