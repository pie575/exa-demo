> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="agent-skills">
  # Agent Skills
</div>

> Installez les skills Exa dans Claude Code, Codex et d&#39;autres coding agents.

Les skills Exa apprennent aux coding agents à effectuer des recherches, à récupérer du contenu et à développer avec les API d&#39;Exa. Retrouvez-les dans le repository open source [exa-labs/agent-skills](https://github.com/exa-labs/agent-skills).

Chaque skill contient des fichiers markdown conformes au standard ouvert [Agent Skills](https://agentskills.io) : les mêmes fichiers s&#39;installent donc dans n&#39;importe quel agent compatible.

<div id="install">
  ## Installation
</div>

Installez toutes les skills Exa en une seule fois :

```bash theme={null}
npx skills add exa-labs/agent-skills
```

<Card title="Obtenez votre clé API Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé dans le dashboard. Les nouveaux comptes bénéficient de crédits gratuits.
</Card>

<Note>
  Définissez votre clé sous le nom `EXA_API_KEY` dans l&#39;environnement de votre agent.
</Note>

Vous pouvez aussi ouvrir l&#39;une des pages de skill ci-dessous et copier son setup prompt dans votre agent. Le prompt installe le skill correspondant et vérifie votre clé API sans l&#39;afficher.

<div id="skills">
  ## Skills
</div>

Chaque page de skill comprend une description en une ligne, un setup prompt à copier et un lien vers le fichier source `SKILL.md` brut.

<Columns cols={3}>
  <Card title="Développer avec Exa" icon="rocket" href="/fr/docs/get-started/agent-skills/build-with-exa" cta="Ouvrir le skill" arrow="true">
    Créez des applications et des agents avec l&#39;ensemble de la plateforme d&#39;API Exa.
  </Card>

  <Card title="Exa Search" icon="search" href="/fr/docs/get-started/agent-skills/exa-search" cta="Ouvrir le skill" arrow="true">
    Appelez Exa Search directement en cURL ou en raw HTTP.
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/fr/docs/get-started/agent-skills/exa-contents" cta="Ouvrir le skill" arrow="true">
    Appelez Exa Contents directement en cURL ou en raw HTTP.
  </Card>
</Columns>

<div id="related">
  ## Ressources connexes
</div>

<Columns cols={2}>
  <Card title="Repository des skills" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Voir le code source" arrow="true">
    La source de chaque skill, y compris les fichiers `SKILL.md` bruts.
  </Card>

  <Card title="Exa MCP" icon="plug" href="/fr/docs/get-started/exa-mcp" cta="Ouvrir le guide" arrow="true">
    Connectez Claude, Cursor, VS Code et d&#39;autres clients à Exa via MCP.
  </Card>
</Columns>