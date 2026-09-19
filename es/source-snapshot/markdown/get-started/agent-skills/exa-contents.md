> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de explorar más a fondo.

<div id="exa-contents-skill">
  # Skill de Exa Contents
</div>

> Extrae el contenido de páginas con Exa Contents cuando ya tienes las URL.

Usa esta skill para enseñarle a tu agente a llamar a Exa Contents con cURL o HTTP sin procesar, siguiendo las mejores prácticas.

<Card title="Obtén tu Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas empiezan con credits gratuitos.
</Card>

<Note>
  Define tu key como `EXA_API_KEY` en el entorno de tu agente.
</Note>

<div id="setup">
  ## Configuración
</div>

**Opción A: Instala esta skill directamente:**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "exa-contents"
```

**Opción B: copia este prompt en tu agente de programación.**

El siguiente prompt instala la skill y verifica tu API key sin mostrarla:

```text Copy this setup prompt into your agent theme={null}
Configura la skill de agente exa-contents de Exa en esta máquina.

Objetivo:
- Instalar la skill exa-contents para que mi agente de programación pueda usarla y llamar a Exa Contents directamente con cURL o HTTP sin procesar.
- Conseguir que funcione una Exa API key SIN exponer, imprimir ni pegar nunca la key en este chat.

Agente seleccionado:
- Claude Code, Codex, Cursor o cualquier agente compatible con Agent Skills
- Directorios de instalación globales: ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / otros)
- Directorios de instalación locales del proyecto: .claude/skills (Claude Code), .agents/skills (Codex / Cursor / otros)

Origen de la skill:
- URL de SKILL.md: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md

Qué hacer:
1. Instala la skill PRIMERO, antes de configurar cualquier key. Prefiere una instalación local del proyecto cuando trabajes dentro de un repositorio; si no, usa el directorio global correspondiente de la lista anterior. Crea el directorio de skills elegido y descarga la skill:
   mkdir -p <skills-dir>/exa-contents && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" -o <skills-dir>/exa-contents/SKILL.md
   Después verifica que exista <skills-dir>/exa-contents/SKILL.md.
2. Comprueba si ya hay una Exa API key disponible DESDE TU PROPIO ENTORNO DE EJECUCIÓN DE COMANDOS — usa la misma herramienta/shell con la que ejecutarás la skill, no me pidas que la muestre con echo. La skill resuelve la key primero desde EXA_API_KEY y luego desde el archivo ~/.config/exa/key, así que comprueba ambos sin imprimir nunca un valor:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   Es probable que tu shell sea no interactiva y NO cargue automáticamente perfiles interactivos como ~/.zshrc o ~/.bashrc, por lo que una key que yo haya definido ahí puede parecer presente para mí pero estar vacía para ti. Si no aparece ninguna, la key podría estar en un perfil interactivo que tu shell omite: averigua en qué archivo está SIN imprimir su valor con `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` (solo lista nombres — NUNCA ejecutes un `grep`/`cat`/`echo` simple sobre un perfil, ya que una línea `export EXA_API_KEY=...` filtraría el secreto a nuestro chat). Luego haz `source` de ese archivo dentro de tu comando y repite la prueba de presencia anterior; si aparece, antepón ese mismo `source ...;` a cada comando posterior que necesite la key.
3. Solo si no se puede resolver ninguna key en ningún sitio, configura una SIN editar a mano ningún perfil de shell y SIN pegar la key en este chat. Dime que cree o copie una key en https://dashboard.exa.ai/api-keys y que luego, en mi propia terminal, exporte yo mismo EXA_API_KEY o la escriba en ~/.config/exa/key con permisos 600 — nunca me pidas que pegue la key en el chat. Después espera a que confirme que está hecho antes de continuar.
4. Haz una prueba rápida de la key desde tu propia shell — resuélvela desde la variable de entorno o el archivo e imprime solo el código de estado:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/contents \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"urls":["https://exa.ai"],"text":true}'
   Mantén el endpoint, los encabezados y el cuerpo exactamente como están escritos (no adivines el esquema). Debe devolver 200, no 401/429. Si en el paso 2 necesitaste un prefijo `source ...;` para ver una key de entorno, antepónlo aquí también.
5. Dime cómo reiniciar o volver a escanear mi agente para que detecte la skill.

Regla estricta en todo momento: la key es un secreto. Inspecciónala únicamente mediante una comprobación de presencia o longitud (`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) o un código de estado HTTP — nunca imprimas, hagas `echo`, `cat` ni `grep` con salida de ningún archivo o variable que pueda contenerla, y nunca intentes "censurar" un archivo de key con una expresión regular. Si alguna vez se expone una key, dime que la rote en https://dashboard.exa.ai/api-keys.
```

<div id="view-source">
  ## Ver código fuente
</div>

<Card title="exa-contents/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" cta="Ver código fuente" arrow="true">
  Lee la definición de la skill exa-contents antes de instalarla.
</Card>

<div id="related">
  ## Contenido relacionado
</div>

<Columns cols={2}>
  <Card title="Todas las skills de Agent" icon="layers" href="/es/docs/get-started/agent-skills/overview" cta="Ver skills" arrow="true">
    Explora todas las skills de Exa e instálalas de una sola vez.
  </Card>

  <Card title="Repositorio de skills" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Ver código fuente" arrow="true">
    Código fuente de cada skill, incluidos los archivos `SKILL.md` sin procesar.
  </Card>
</Columns>