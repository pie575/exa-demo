> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="build-with-exa-skill">
  # Skill Build with Exa
</div>

> Un skill de agente para ayudar a los desarrolladores a implementar cualquier parte de la plataforma de APIs de Exa.

Usa este skill para enseñarle a tu agente a crear aplicaciones y agentes con las APIs de Exa siguiendo las mejores prácticas.

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas incluyen créditos gratuitos.
</Card>

<Note>
  Define tu key como `EXA_API_KEY` en el entorno de tu agente.
</Note>

<div id="setup">
  ## Configuración
</div>

**Opción A: instala este skill directamente:**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "build-with-exa"
```

**Opción B: copia este prompt en tu agente de programación.**

El siguiente prompt instala la skill y verifica tu API key sin mostrarla:

```text Copy this setup prompt into your agent theme={null}
Configura el skill de agente build-with-exa de Exa en esta máquina.

Objetivo:
- Instalar el skill build-with-exa para que mi agente de programación pueda usarlo y crear aplicaciones y agentes con toda la plataforma de API de Exa.
- Conseguir que una API key de Exa funcione SIN exponer, imprimir ni pegar nunca la key en este chat.

Agente seleccionado:
- Claude Code, Codex, Cursor o cualquier agente compatible con Agent Skills
- Directorios de instalación global: ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / otros)
- Directorios de instalación local al proyecto: .claude/skills (Claude Code), .agents/skills (Codex / Cursor / otros)

Origen del skill:
- URL de SKILL.md: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md

Qué hacer:
1. Instala el skill PRIMERO, antes de configurar cualquier key. Prefiere una instalación local al proyecto cuando trabajes dentro de un repo; si no, usa el directorio global correspondiente de la lista anterior. Crea el directorio de skills elegido y descarga el skill:
   mkdir -p <skills-dir>/build-with-exa && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md" -o <skills-dir>/build-with-exa/SKILL.md
   Después verifica que exista <skills-dir>/build-with-exa/SKILL.md.
2. Comprueba si ya hay una API key de Exa disponible DESDE TU PROPIO ENTORNO DE EJECUCIÓN DE COMANDOS — usa la misma herramienta o shell con la que ejecutarás el skill, en lugar de pedirme que la muestre con echo. El skill resuelve la key primero desde EXA_API_KEY y después desde el archivo ~/.config/exa/key, así que comprueba ambos sin imprimir nunca un valor:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   Es probable que tu shell sea no interactivo y que NO cargue automáticamente perfiles interactivos como ~/.zshrc o ~/.bashrc, por lo que una key que yo defina ahí puede parecer presente para mí pero estar vacía para ti. Si no aparece ninguna, la key puede seguir estando en un perfil interactivo que tu shell omite: averigua en qué archivo está SIN imprimir su valor con `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` (solo lista nombres — NUNCA ejecutes un `grep`/`cat`/`echo` simple sobre un perfil, ya que una línea `export EXA_API_KEY=...` filtraría el secreto a nuestro chat). Después haz `source` de ese archivo dentro de tu comando y repite la comprobación de presencia anterior; si aparece, antepón ese mismo `source ...;` a cada comando posterior que necesite la key.
3. Solo si no se puede resolver ninguna key en ningún sitio, configura una SIN editar a mano ningún perfil de shell y SIN pegar la key en este chat. Indícame que cree o copie una key en https://dashboard.exa.ai/api-keys y que después, en mi propia terminal, exporte yo mismo EXA_API_KEY o la escriba en ~/.config/exa/key con permisos 600 — nunca me pidas que pegue la key en el chat. Luego espera a que confirme que está hecho antes de continuar.
4. Haz una prueba rápida de la key desde tu propio shell — resuélvela desde la variable de entorno o el archivo e imprime únicamente el código de estado:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/search \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"query":"exa.ai","numResults":1}'
   Mantén el endpoint, los encabezados y el cuerpo exactamente como están escritos (no adivines el esquema). Debe devolver 200, no 401/429. Si en el paso 2 necesitaste un prefijo `source ...;` para ver una key de entorno, anteponlo también aquí.
5. Dime cómo reiniciar o volver a escanear mi agente para que detecte el skill.

Regla estricta en todo momento: la key es un secreto. Inspecciónala únicamente mediante una comprobación de presencia o longitud (`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) o un código de estado HTTP — nunca imprimas ni uses `echo`, `cat` o `grep` con salida sobre ningún archivo o variable que pueda contenerla, y nunca intentes "censurar" un archivo de key con una expresión regular. Si una key queda expuesta alguna vez, indícame que la rote en https://dashboard.exa.ai/api-keys.
```

<div id="view-source">
  ## Ver código fuente
</div>

<Card title="build-with-exa/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md" cta="Ver código fuente" arrow="true">
  Lee la definición de la skill build-with-exa antes de instalarla.
</Card>

<div id="related">
  ## Relacionado
</div>

<Columns cols={2}>
  <Card title="Todos los skills de agente" icon="layers" href="/es/docs/get-started/agent-skills/overview" cta="Explorar skills" arrow="true">
    Explora todos los skills de Exa e instálalos de una sola vez.
  </Card>

  <Card title="Repositorio de skills" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Ver código fuente" arrow="true">
    Código fuente de cada skill, incluidos los archivos `SKILL.md` sin procesar.
  </Card>
</Columns>