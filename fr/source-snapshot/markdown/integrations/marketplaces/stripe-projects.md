> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="stripe-projects">
  # Stripe Projects
</div>

> Intégrez Exa depuis votre terminal grâce à la CLI Stripe Projects.

[Stripe Projects](https://projects.dev) vous permet, à vous et à vos agents de code, de provisionner des services tiers depuis le terminal, sans tableau de bord ni copier-coller de clés. Une seule commande crée un compte Exa et synchronise une API key dans votre projet.

<div id="prerequisites">
  ## Prérequis
</div>

Installez la CLI Stripe et le plugin Projects :

```bash theme={null}
brew install stripe/stripe-cli/stripe && stripe plugin install projects
```

Pour les autres plateformes et la configuration complète de la CLI, consultez [Stripe Projects](https://projects.dev).

<div id="get-started">
  ## Démarrer
</div>

Depuis le répertoire de votre projet, initialisez un projet, ajoutez Exa et récupérez les credentials :

```bash theme={null}
stripe projects init
stripe projects add exa/api
stripe projects env --pull
```

Votre `.env` contient désormais une `EXA_API_KEY`. Les [SDK Exa](/fr/docs/sdks/quickstart) et le [Quickstart](/fr/docs/search/quickstart) lisent cette variable automatiquement : votre code fonctionne donc sans aucune modification.

<Info>
  La clé est provisionnée dans un compte Exa qui vous appartient. Gérez à tout moment l&#39;utilisation, les clés et la facturation depuis l&#39;[Exa Dashboard](https://dashboard.exa.ai).
</Info>

<div id="link-an-existing-exa-team">
  ## Lier une équipe Exa existante
</div>

Vous avez déjà un compte Exa ? Connectez-le d&#39;abord pour que l&#39;API key soit provisionnée sur votre équipe existante :

```bash theme={null}
stripe projects link exa
stripe projects add exa/api
```

`stripe projects link` ouvre Exa pour vous permettre de vous authentifier et d&#39;associer votre équipe à votre compte Stripe. Vous pouvez ouvrir à tout moment l&#39;Exa Dashboard lié avec `stripe projects open exa`.

<div id="provision-from-your-coding-agent">
  ## Provisionner depuis votre agent de code
</div>

`stripe projects init` ajoute une [Agent Skill](https://projects.dev) Stripe Projects à votre projet, ce qui permet à votre agent (Claude Code, Cursor, Codex et autres) d&#39;exécuter le flow à votre place :

```text theme={null}
Utilise Stripe Projects pour ajouter Exa et brancher l'API key.
```

<div id="next-steps">
  ## Étapes suivantes
</div>

* [Quickstart](/fr/docs/search/quickstart) : lancez votre première Exa search avec nos SDK.
* [Documentation Stripe Projects](https://docs.stripe.com/projects) : référence CLI complète, environnements et facturation.
* [Exa Dashboard](https://dashboard.exa.ai) : gérez vos API keys, votre utilisation et votre facturation.
* [Catalogue de providers](https://projects.dev) : parcourez l&#39;ensemble des providers Stripe Projects.