> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="exa-search-skill">
  # Skill de Exa Search
</div>

> Encuentra páginas web relevantes y obtén contenido sintetizado en menos de dos segundos con Exa Search.

Usa este skill para enseñarle a tu agente a invocar Exa Search mediante cURL o HTTP directo, siguiendo las mejores prácticas.

<Card title="Obtén tu Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el dashboard. Las cuentas nuevas incluyen credits gratuitos.
</Card>

<Note>
  Define tu key como `EXA_API_KEY` en el entorno de tu agente.
</Note>

<div id="setup">
  ## Configuración
</div>

**Opción A: Instala esta skill directamente:**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "exa-search"
```

**Opción B: copia este prompt en tu agente de programación.**

El siguiente prompt instala la skill y verifica tu API key sin mostrarla:

```text Copy this setup prompt into your agent theme={null}
Configura la skill de agente exa-search de Exa en esta máquina.

Objetivo:
- Instalar la skill exa-search para que mi agente de código pueda usarla y llamar a Exa Search directamente con cURL o HTTP directo.
- Lograr que una API key de Exa funcione SIN exponer, imprimir ni pegar nunca la key en este chat.

Agente seleccionado:
- Claude Code, Codex, Cursor o cualquier agente compatible con Agent Skills
- Directorios de instalación global: ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / otros)
- Directorios de instalación local del proyecto: .claude/skills (Claude Code), .agents/skills (Codex / Cursor / otros)

Origen de la skill:
- URL de SKILL.md: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md

Qué hacer:
1. Instala la skill PRIMERO, antes de configurar cualquier key. Prefiere una instalación local del proyecto cuando trabajes dentro de un repositorio; de lo contrario, usa el directorio global correspondiente de la lista anterior. Crea el directorio de skills elegido y descarga la skill:
   mkdir -p <skills-dir>/exa-search && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md" -o <skills-dir>/exa-search/SKILL.md
   Luego verifica que exista <skills-dir>/exa-search/SKILL.md.
2. Comprueba si ya hay una API key de Exa disponible DESDE TU PROPIO ENTORNO DE EJECUCIÓN DE COMANDOS: usa la misma herramienta o shell con la que ejecutarás la skill, en lugar de pedirme que la imprima. La skill resuelve la key primero desde EXA_API_KEY y luego desde el archivo ~/.config/exa/key, así que comprueba ambos sin imprimir nunca un valor:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   Es probable que tu shell no sea interactiva y NO cargue automáticamente perfiles interactivos como ~/.zshrc o ~/.bashrc, así que una key que yo defina ahí puede parecer presente para mí pero estar vacía para ti. Si no aparece ninguna, la key todavía puede estar en un perfil interactivo que tu shell omite: averigua en qué archivo está SIN imprimir su valor usando `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` (solo lista nombres; NUNCA ejecutes un `grep`/`cat`/`echo` sin más sobre un perfil, ya que una línea `export EXA_API_KEY=...` filtraría el secreto en nuestro chat). Después, aplica `source` a ese archivo dentro de tu comando y repite la prueba de presencia anterior; si aparece, antepón ese mismo `source ...;` a todos los comandos posteriores que necesiten la key.
3. Solo si la key no se puede resolver en ningún sitio, configura una SIN editar a mano ningún perfil de shell y SIN pegar la key en este chat. Indícame que cree o copie una key en https://dashboard.exa.ai/api-keys y que luego, en mi propia terminal, exporte EXA_API_KEY yo mismo o la escriba en ~/.config/exa/key con permisos 600; nunca me pidas que pegue la key en el chat. Después, espera a que yo confirme que está hecho antes de continuar.
4. Haz una prueba rápida de la key desde tu propia shell: resuélvela desde la variable de entorno o el archivo e imprime únicamente el código de estado:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/search \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"query":"exa.ai","numResults":1}'
   Mantén el endpoint, los encabezados y el cuerpo exactamente como están escritos (no adivines el esquema). Debe devolver 200, no 401/429. Si en el paso 2 necesitaste el prefijo `source ...;` para ver una key de entorno, anteponlo aquí también.
5. Dime cómo reiniciar o volver a escanear mi agente para que detecte la skill.

Regla estricta en todo momento: la key es un secreto. Inspecciónala únicamente mediante una comprobación de presencia o longitud (`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) o un código de estado HTTP; nunca imprimas, hagas `echo`, `cat` o `grep` con salida sobre ningún archivo o variable que pueda contenerla, y nunca intentes «censurar» un archivo de key con una expresión regular. Si alguna vez se expone una key, indícame que la rote en https://dashboard.exa.ai/api-keys.
```

<div id="view-source">
  ## Ver código fuente
</div>

<Card title="exa-search/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md" cta="Ver código fuente" arrow="true">
  Lee la definición de la skill exa-search antes de instalarla.
</Card>

<div id="related">
  ## Relacionado
</div>

<Columns cols={2}>
  <Card title="Todas las skills de agente" icon="layers" href="/es/docs/get-started/agent-skills/overview" cta="Explorar skills" arrow="true">
    Explora todas las skills de Exa e instálalas de una sola vez.
  </Card>

  <Card title="Repositorio de skills" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Ver el código fuente" arrow="true">
    Código fuente de todas las skills, incluidos los archivos `SKILL.md` sin procesar.
  </Card>
</Columns>