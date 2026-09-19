> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="exa-contents-skill">
  # Skill Exa Contents
</div>

> Extrayez le contenu des pages avec Exa Contents lorsque vous disposez déjà des URL.

Utilisez cette skill pour apprendre à votre agent à appeler Exa Contents en cURL ou en raw HTTP, selon les bonnes pratiques.

<Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une key dans le dashboard. Les nouveaux comptes bénéficient de credits gratuits.
</Card>

<Note>
  Définissez votre key dans la variable `EXA_API_KEY` de l&#39;environnement de votre agent.
</Note>

<div id="setup">
  ## Configuration
</div>

**Option A : installez directement cette skill :**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "exa-contents"
```

**Option B : copiez ce prompt dans votre agent de code.**

Le prompt suivant installe la skill et vérifie votre API key sans l&#39;afficher :

```text Copy this setup prompt into your agent theme={null}
Installe l'agent skill Exa exa-contents sur cette machine.

Objectif :
- Installer la skill exa-contents afin que mon agent de code puisse s'en servir pour appeler Exa Contents directement avec cURL ou en raw HTTP.
- Faire fonctionner une API key Exa SANS jamais exposer, afficher ni coller la key dans cette conversation.

Agent sélectionné :
- Claude Code, Codex, Cursor, ou tout agent compatible Agent Skills
- Répertoires d'installation globaux : ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / autre)
- Répertoires d'installation locaux au projet : .claude/skills (Claude Code), .agents/skills (Codex / Cursor / autre)

Source de la skill :
- URL du SKILL.md : https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md

Marche à suivre :
1. Installe la skill EN PREMIER, avant toute configuration de key. Privilégie une installation locale au projet si tu travailles dans un dépôt ; sinon, utilise le répertoire global correspondant listé ci-dessus. Crée le répertoire de skills choisi et télécharge la skill :
   mkdir -p <skills-dir>/exa-contents && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" -o <skills-dir>/exa-contents/SKILL.md
   Vérifie ensuite que <skills-dir>/exa-contents/SKILL.md existe.
2. Vérifie si une API key Exa est déjà disponible DEPUIS TON PROPRE ENVIRONNEMENT D'EXÉCUTION DE COMMANDES — utilise le même outil/shell avec lequel tu exécuteras la skill, et non en me demandant de l'afficher. La skill résout la key d'abord depuis EXA_API_KEY, puis depuis le fichier ~/.config/exa/key : vérifie les deux sans jamais afficher de valeur :
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   Ton shell est probablement non interactif et ne source PAS automatiquement les profils interactifs comme ~/.zshrc ou ~/.bashrc : une key que j'y ai définie peut donc me sembler présente alors qu'elle est vide pour toi. Si aucun des deux n'apparaît, la key peut malgré tout se trouver dans un profil interactif que ton shell ignore : repère le fichier concerné SANS afficher sa valeur avec `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` (n'affiche que des noms — n'exécute JAMAIS un simple `grep`/`cat`/`echo` sur un profil, car une ligne `export EXA_API_KEY=...` divulguerait le secret dans notre conversation). Fais ensuite un `source` de ce fichier dans ta commande et relance le test de présence ci-dessus ; s'il apparaît, ajoute ce même `source ...;` en préfixe de toutes les commandes ultérieures qui ont besoin de la key.
3. Uniquement si aucune key n'est résoluble nulle part, configures-en une SANS éditer à la main un profil shell et SANS coller la key dans cette conversation. Demande-moi de créer/copier une key sur https://dashboard.exa.ai/api-keys, puis, dans mon propre terminal, d'exporter EXA_API_KEY moi-même ou de l'écrire dans ~/.config/exa/key avec le mode 600 — ne me demande jamais de coller la key dans la conversation. Attends ensuite que je confirme que c'est fait avant de continuer.
4. Teste la key depuis ton propre shell — résous-la depuis la variable d'environnement ou le fichier, et n'affiche que le code de statut :
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/contents \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"urls":["https://exa.ai"],"text":true}'
   Conserve l'endpoint, les headers et le corps exactement tels quels (ne devine pas le schema). La réponse doit être 200, pas 401/429. Si tu as eu besoin d'un préfixe `source ...;` à l'étape 2 pour voir une key d'environnement, ajoute-le ici aussi.
5. Explique-moi comment redémarrer mon agent ou relancer sa détection pour qu'il découvre la skill.

Règle absolue tout du long : la key est un secret. Ne l'inspecte jamais autrement que par un test de présence/longueur (`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) ou par un code de statut HTTP — n'affiche jamais, n'utilise jamais `echo`, `cat` ni `grep` avec sortie sur un fichier ou une variable susceptible de la contenir, et n'essaie jamais de « masquer » un fichier de key avec une regex. Si une key vient à être exposée, demande-moi de la renouveler sur https://dashboard.exa.ai/api-keys.
```

<div id="view-source">
  ## Voir la source
</div>

<Card title="exa-contents/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" cta="Voir la source" arrow="true">
  Consultez la définition du skill exa-contents avant de l&#39;installer.
</Card>

<div id="related">
  ## Ressources associées
</div>

<Columns cols={2}>
  <Card title="Toutes les agent skills" icon="layers" href="/fr/docs/get-started/agent-skills/overview" cta="Parcourir les skills" arrow="true">
    Parcourez toutes les skills Exa et installez-les en une seule fois.
  </Card>

  <Card title="Repository des skills" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Voir la source" arrow="true">
    Le code source de chaque skill, y compris les fichiers `SKILL.md` bruts.
  </Card>
</Columns>