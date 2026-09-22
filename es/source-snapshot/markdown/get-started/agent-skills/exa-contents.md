> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="exa-contents-skill">
  # Exa Contents Skill
</div>

> Extrae el contenido de las páginas con Exa Contents cuando ya tienes las URL.

Usa esta skill para enseñar a tu agente a llamar a Exa Contents con cURL o HTTP sin procesar, aplicando las mejores prácticas.

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas incluyen créditos gratuitos.
</Card>

<Note>
  Define tu key como `EXA_API_KEY` en el entorno de tu agente.
</Note>

<div id="setup">
  ## Configuración
</div>

**Opción A: instala esta skill directamente:**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "exa-contents"
```

**Opción B: copia este prompt en tu agente de programación.**

El siguiente prompt instala la skill y verifica tu API key sin mostrarla:

```text Copy this setup prompt into your agent theme={null}
Configura la skill de agente exa-contents de Exa en esta máquina.

Objetivo:
- Instalar la skill exa-contents para que mi agente de programación pueda usarla y llamar a Exa Contents directamente con cURL o HTTP sin procesar.
- Conseguir que funcione una API key de Exa SIN exponer, imprimir ni pegar nunca la key en este chat.

Agente seleccionado:
- Claude Code, Codex, Cursor o cualquier agente compatible con Agent Skills
- Directorios de instalación global: ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / otros)
- Directorios de instalación local del proyecto: .claude/skills (Claude Code), .agents/skills (Codex / Cursor / otros)

Origen de la skill:
- URL de SKILL.md: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md

Qué hacer:
1. Instala PRIMERO la skill, antes de configurar cualquier key. Prefiere una instalación local del proyecto cuando trabajes dentro de un repo; si no, usa el directorio global correspondiente de la lista anterior. Crea el directorio de skills elegido y descarga la skill:
   mkdir -p <skills-dir>/exa-contents && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" -o <skills-dir>/exa-contents/SKILL.md
   Después verifica que exista <skills-dir>/exa-contents/SKILL.md.
2. Comprueba si ya hay una API key de Exa disponible DESDE TU PROPIO ENTORNO DE EJECUCIÓN DE COMANDOS: usa la misma herramienta o shell con la que ejecutarás la skill, y no me pidas que la muestre con echo. La skill resuelve la key primero desde EXA_API_KEY y después desde el archivo ~/.config/exa/key, así que comprueba ambos sin imprimir nunca un valor:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   Es probable que tu shell no sea interactiva y que NO cargue automáticamente perfiles interactivos como ~/.zshrc o ~/.bashrc, por lo que una key que yo defina ahí puede parecerme presente a mí y estar vacía para ti. Si no aparece ninguna, puede que la key siga estando en un perfil interactivo que tu shell omite: averigua en qué archivo está SIN imprimir su valor usando `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` (solo lista nombres; NUNCA ejecutes un `grep`/`cat`/`echo` simple sobre un perfil, ya que una línea `export EXA_API_KEY=...` filtraría el secreto a nuestro chat). Luego aplica `source` a ese archivo dentro de tu comando y repite la prueba de presencia anterior; si aparece, antepón ese mismo `source ...;` a todos los comandos posteriores que necesiten la key.
3. Solo si no se puede resolver ninguna key en ningún sitio, configura una SIN editar a mano ningún perfil de shell y SIN pegar la key en este chat. Dime que cree o copie una key en https://dashboard.exa.ai/api-keys y que después, en mi propia terminal, exporte yo mismo EXA_API_KEY o la escriba en ~/.config/exa/key con permisos 600; nunca me pidas que pegue la key en el chat. Luego espera a que yo confirme que está hecho antes de continuar.
4. Haz una prueba rápida de la key desde tu propia shell: resuélvela desde la variable de entorno o el archivo e imprime únicamente el código de estado:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/contents \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"urls":["https://exa.ai"],"text":true}'
   Mantén el endpoint, los encabezados y el cuerpo exactamente como están escritos (no adivines el esquema). Debe devolver 200, no 401/429. Si en el paso 2 necesitaste un prefijo `source ...;` para ver una key de entorno, anteponlo también aquí.
5. Dime cómo reiniciar o volver a escanear mi agente para que descubra la skill.

Regla estricta en todo momento: la key es un secreto. Inspecciónala únicamente mediante una comprobación de presencia o longitud (`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) o un código de estado HTTP; nunca imprimas, ni uses `echo`, `cat` o `grep` con salida sobre ningún archivo o variable que pueda contenerla, y nunca intentes "censurar" un archivo de key con una expresión regular. Si alguna vez se expone una key, dime que la rote en https://dashboard.exa.ai/api-keys.
```

<div id="view-source">
  ## Ver código fuente
</div>

<Card title="exa-contents/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" cta="Ver código fuente" arrow="true">
  Lee la definición del skill exa-contents antes de instalarlo.
</Card>

<div id="related">
  ## Relacionado
</div>

<Columns cols={2}>
  <Card title="Todas las skills de agente" icon="layers" href="/es/docs/get-started/agent-skills/overview" cta="Explorar skills" arrow="true">
    Explora todas las skills de Exa e instálalas de una sola vez.
  </Card>

  <Card title="Repositorio de skills" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Ver código fuente" arrow="true">
    Código fuente de cada skill, incluidos los archivos `SKILL.md` sin procesar.
  </Card>
</Columns>