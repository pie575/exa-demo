> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="exa-contents-skill">
  # Skill Exa Contents
</div>

> Extrayez le contenu des pages avec Exa Contents lorsque vous disposez déjà des URL.

Utilisez cette skill pour apprendre à votre agent à appeler Exa Contents en cURL ou en raw HTTP, selon les bonnes pratiques.

<Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé dans le tableau de bord. Les nouveaux comptes bénéficient de crédits gratuits.
</Card>

<Note>
  Définissez votre clé dans la variable `EXA_API_KEY` de l&#39;environnement de votre agent.
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
Configure l'agent skill Exa exa-contents sur cette machine.

Objectif :
- Installer la skill exa-contents afin que mon agent de code puisse l'utiliser pour appeler Exa Contents directement avec cURL ou en raw HTTP.
- Faire fonctionner une API key Exa SANS jamais exposer, afficher ou coller la clé dans ce chat.

Agent sélectionné :
- Claude Code, Codex, Cursor, ou tout agent compatible Agent Skills
- Répertoires d'installation globaux : ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / autre)
- Répertoires d'installation locaux au projet : .claude/skills (Claude Code), .agents/skills (Codex / Cursor / autre)

Source de la skill :
- URL du SKILL.md : https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md

À faire :
1. Installer la skill EN PREMIER, avant toute configuration de clé. Privilégie une installation locale au projet lorsque tu travailles dans un repo ; sinon, utilise le répertoire global correspondant listé ci-dessus. Crée le répertoire de skills choisi et télécharge la skill :
   mkdir -p <skills-dir>/exa-contents && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" -o <skills-dir>/exa-contents/SKILL.md
   Vérifie ensuite que <skills-dir>/exa-contents/SKILL.md existe.
2. Vérifie si une API key Exa est déjà disponible DEPUIS TON PROPRE ENVIRONNEMENT D'EXÉCUTION DE COMMANDES — utilise le même outil/shell avec lequel tu exécuteras la skill, sans me demander de l'afficher. La skill résout la clé d'abord depuis EXA_API_KEY, puis depuis le fichier ~/.config/exa/key : vérifie les deux sans jamais afficher de valeur :
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   Ton shell est probablement non interactif et ne source PAS automatiquement les profils interactifs comme ~/.zshrc ou ~/.bashrc : une clé que j'y définis peut donc me sembler présente alors qu'elle est vide pour toi. Si aucun des deux n'apparaît, la clé peut encore se trouver dans un profil interactif que ton shell ignore : repère le fichier concerné SANS en afficher la valeur avec `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` (n'affiche que les noms — n'exécute JAMAIS un simple `grep`/`cat`/`echo` sur un profil, car une ligne `export EXA_API_KEY=...` divulguerait le secret dans notre chat). Fais ensuite un `source` de ce fichier dans ta commande et relance le test de présence ci-dessus ; s'il s'affiche, ajoute ce même `source ...;` en préfixe de chaque commande ultérieure nécessitant la clé.
3. Uniquement si aucune clé n'est résoluble nulle part, configures-en une SANS éditer à la main le moindre profil shell et SANS coller la clé dans ce chat. Dis-moi de créer/copier une clé sur https://dashboard.exa.ai/api-keys, puis, dans mon propre terminal, soit d'exporter moi-même EXA_API_KEY, soit de l'écrire dans ~/.config/exa/key avec le mode 600 — ne me demande jamais de coller la clé dans le chat. Attends ensuite que je confirme que c'est fait avant de continuer.
4. Teste rapidement la clé depuis ton propre shell — résous-la depuis la variable d'environnement ou le fichier, et n'affiche que le code de statut :
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/contents \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"urls":["https://exa.ai"],"text":true}'
   Conserve l'endpoint, les headers et le corps exactement tels quels (ne devine pas le schéma). Cela doit renvoyer 200, pas 401/429. Si tu as eu besoin d'un préfixe `source ...;` à l'étape 2 pour voir une clé d'environnement, ajoute-le également ici.
5. Explique-moi comment redémarrer mon agent ou relancer son analyse pour qu'il découvre la skill.

Règle absolue tout du long : la clé est un secret. Ne l'inspecte jamais autrement que par un test de présence/longueur (`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) ou un code de statut HTTP — n'affiche jamais, et n'utilise jamais `echo`, `cat` ou `grep` avec sortie sur un fichier ou une variable susceptible de la contenir, et n'essaie jamais de « masquer » un fichier de clé avec une regex. Si une clé venait à être exposée, dis-moi de la renouveler sur https://dashboard.exa.ai/api-keys.
```

<div id="view-source">
  ## Voir la source
</div>

<Card title="exa-contents/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" cta="Voir la source" arrow="true">
  Consultez la définition de la skill exa-contents avant de l&#39;installer.
</Card>

<div id="related">
  ## Ressources associées
</div>

<Columns cols={2}>
  <Card title="Toutes les agent skills" icon="layers" href="/fr/docs/get-started/agent-skills/overview" cta="Parcourir les skills" arrow="true">
    Parcourez l&#39;ensemble des skills Exa et installez-les en une seule fois.
  </Card>

  <Card title="Repository des skills" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Voir la source" arrow="true">
    Source de chaque skill, y compris les fichiers `SKILL.md` bruts.
  </Card>
</Columns>