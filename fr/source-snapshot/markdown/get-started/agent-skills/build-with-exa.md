> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="build-with-exa-skill">
  # Développer avec la skill Exa
</div>

> Une agent skill pour aider les développeurs à implémenter n&#39;importe quelle partie de la plateforme d&#39;API Exa.

Utilisez cette skill pour apprendre à votre agent à créer des applications et des agents avec les API d&#39;Exa, en suivant les bonnes pratiques.

<Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une key dans le dashboard. Les nouveaux comptes bénéficient de credits gratuits.
</Card>

<Note>
  Définissez votre key dans la variable `EXA_API_KEY` de l&#39;environnement de votre agent.
</Note>

<div id="setup">
  ## Configuration
</div>

**Option A : installer ce skill directement :**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "build-with-exa"
```

**Option B : copiez ce prompt dans votre agent de code.**

Le prompt suivant installe la skill et vérifie votre API key sans l&#39;afficher :

```text Copy this setup prompt into your agent theme={null}
Configure la build-with-exa agent skill d'Exa sur cette machine.

Objectif :
- Installer la build-with-exa skill pour que mon agent de code puisse s'en servir afin de créer des applications et des agents avec l'ensemble de la plateforme d'API d'Exa.
- Obtenir une API key Exa fonctionnelle SANS jamais exposer, afficher ni coller la key dans cette conversation.

Agent sélectionné :
- Claude Code, Codex, Cursor ou tout agent compatible Agent-Skills
- Répertoires d'installation globaux : ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / autre)
- Répertoires d'installation locaux au projet : .claude/skills (Claude Code), .agents/skills (Codex / Cursor / autre)

Source de la skill :
- URL du SKILL.md : https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md

Marche à suivre :
1. Installe la skill EN PREMIER, avant toute configuration de key. Privilégie une installation locale au projet si tu travailles dans un dépôt ; sinon, utilise le répertoire global correspondant indiqué ci-dessus. Crée le répertoire de skills choisi et télécharge la skill :
   mkdir -p <skills-dir>/build-with-exa && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md" -o <skills-dir>/build-with-exa/SKILL.md
   Vérifie ensuite que <skills-dir>/build-with-exa/SKILL.md existe.
2. Vérifie si une API key Exa est déjà disponible DEPUIS TON PROPRE ENVIRONNEMENT D'EXÉCUTION DE COMMANDES — utilise le même outil/shell avec lequel tu exécuteras la skill, et ne me demande pas de l'afficher. La skill résout la key d'abord depuis EXA_API_KEY, puis depuis le fichier ~/.config/exa/key : vérifie les deux sans jamais afficher de valeur :
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   Ton shell est probablement non interactif et ne charge PAS automatiquement les profils interactifs comme ~/.zshrc ou ~/.bashrc : une key que j'y ai définie peut donc me sembler présente alors qu'elle est vide pour toi. Si aucun des deux n'apparaît, la key réside peut-être dans un profil interactif que ton shell ignore : trouve le fichier concerné SANS afficher sa valeur avec `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` (liste uniquement les noms — n'exécute JAMAIS un simple `grep`/`cat`/`echo` sur un profil, car une ligne `export EXA_API_KEY=...` divulguerait le secret dans notre conversation). Applique ensuite `source` à ce fichier dans ta commande et relance le test de présence ci-dessus ; s'il aboutit, préfixe ce même `source ...;` à toutes les commandes ultérieures nécessitant la key.
3. Uniquement si aucune key n'est résoluble nulle part, configures-en une SANS modifier à la main le moindre profil shell et SANS coller la key dans cette conversation. Demande-moi de créer/copier une key sur https://dashboard.exa.ai/api-keys, puis, dans mon propre terminal, d'exporter moi-même EXA_API_KEY ou de l'écrire dans ~/.config/exa/key avec le mode 600 — ne me demande jamais de coller la key dans la conversation. Attends ensuite que je confirme avant de poursuivre.
4. Teste rapidement la key depuis ton propre shell — résous-la depuis la variable d'environnement ou le fichier, et n'affiche que le code de statut :
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/search \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"query":"exa.ai","numResults":1}'
   Conserve l'endpoint, les headers et le corps exactement tels quels (ne devine pas le schema). La réponse doit être 200, pas 401/429. Si tu as eu besoin d'un préfixe `source ...;` à l'étape 2 pour voir une key d'environnement, ajoute-le également ici.
5. Explique-moi comment redémarrer mon agent ou relancer son analyse pour qu'il découvre la skill.

Règle absolue tout du long : la key est un secret. Ne l'inspecte jamais autrement que par un test de présence/longueur (`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) ou un code de statut HTTP — n'affiche jamais, avec `echo`, `cat` ou `grep` avec sortie, un fichier ou une variable susceptible de la contenir, et n'essaie jamais de « masquer » un fichier de key avec une expression régulière. Si une key venait à être exposée, demande-moi de la renouveler sur https://dashboard.exa.ai/api-keys.
```

<div id="view-source">
  ## Voir la source
</div>

<Card title="build-with-exa/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md" cta="Voir la source" arrow="true">
  Consultez la définition de la skill build-with-exa avant de l&#39;installer.
</Card>

<div id="related">
  ## Ressources associées
</div>

<Columns cols={2}>
  <Card title="Toutes les agent skills" icon="layers" href="/fr/docs/get-started/agent-skills/overview" cta="Parcourir les skills" arrow="true">
    Parcourez l&#39;ensemble des skills Exa et installez-les en une seule fois.
  </Card>

  <Card title="Repository des skills" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Voir la source" arrow="true">
    Code source de chaque skill, y compris les fichiers `SKILL.md` bruts.
  </Card>
</Columns>