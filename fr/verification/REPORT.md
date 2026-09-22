<div id="verification-against-exa-production">
  # Vérification par rapport à Exa en production
</div>

Snapshot de production : 18 septembre 2026. Aperçu local : http://localhost:3000/docs.

| Vérification                           | Résultat                                                                                                                                      | Preuve                                               |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Inventaire des sources et navigation   | 159 pages sur 159 ; aucune page manquante ni superflue                                                                                        | [Audit de contenu](content-audit.json)               |
| Rendu HTTP des pages                   | 159 routes sur 159 s&#39;affichent                                                                                                            | [Audit des routes](route-audit.json)                 |
| Contenu API complet rendu              | 69 sur 69 correspondent à la production après normalisation des espaces                                                                       | [Comparaison des API](api-content-audit.json)        |
| Liens internes et références d&#39;API | 378 liens rédigés et les 69 chemins/méthodes de schéma passent                                                                                | [Audit de contenu](content-audit.json)               |
| Téléchargements publiés                | Les 9 exports Markdown, LLM et de schéma testés se résolvent avec des payloads correspondants                                                 | [Audit des exports](exports-report.json)             |
| Comportement interactif                | Les 11 vérifications navigateur passent, aucune erreur de page                                                                                | [Audit d&#39;interaction](interaction-audit.json)    |
| Mise en page bureau                    | Les 159 routes correspondent à la géométrie mesurée et à la hauteur totale du contenu ; aucune erreur d&#39;exécution ni image visible cassée | [Synthèse visuelle](visual-summary.json)             |
| Mobile et mode sombre                  | 10 comparaisons sur 5 routes représentatives ; les mises en page mesurées correspondent, aucun débordement horizontal ni image visible cassée | [Comparaison mobile/thème](mobile-theme/report.json) |
| Build et liens Mintlify                | `pnpm validate` et `pnpm check:links` passent                                                                                                 | Commandes reproductibles ci-dessous                  |

Les vérifications d&#39;interaction couvrent tous les sélecteurs d&#39;exemples de la page d&#39;accueil, la
recherche plein texte locale et la navigation au clavier, les résultats vides, la touche Échap, la copie dans le presse-papiers, le changement de
thème, le rendu des schémas d&#39;API, les sept onglets de la feuille de calcul Agent ainsi que la
navigation et la recherche sur mobile.

<div id="blind-visual-review">
  ## Revue visuelle à l&#39;aveugle
</div>

[Ouvrez la galerie de comparaison A/B de 159 pages](blind/index.html). Les deux
captures d&#39;écran de chaque page sont mélangées indépendamment. La galerie enregistre les préférences A/B/égalité
dans le navigateur. Les quatre paires représentatives ordinateur/mobile ont également été examinées
sans consulter la clé d&#39;identité : [revue finale](blind/final-review.md).
Les revues indépendantes antérieures et les captures d&#39;écran correspondantes sont archivées dans
`blind/review-round-2/`.

Les revues représentatives finales n&#39;ont révélé aucun avantage esthétique notable pour
l&#39;une ou l&#39;autre version. Deux des paires représentatives finales sont identiques au bitmap près ; les deux
autres ne diffèrent respectivement que de 8 et 1 pixels au seuil enregistré
([mesures de pixels](representative-pixel-comparison.json)). Il s&#39;agit de vérifications
portant sur les fenêtres d&#39;affichage capturées, et non d&#39;une affirmation d&#39;identité universelle des pixels ou
d&#39;équivalence du service hébergé. Sur l&#39;ensemble des 159 pages, le corps du texte correspond sur 158 ; la
seule différence restante est l&#39;horodatage de la vérification de la page de statut en direct.

<div id="fidelity-details">
  ## Détails de fidélité
</div>

L&#39;import préserve le thème de production, la navigation, les styles et scripts
personnalisés, les polices, les métadonnées des pages, les spécifications d&#39;API
et les composants MDX d&#39;origine. Il restaure également la feuille de calcul
Agent Examples absente de l&#39;export Markdown, ainsi que les 85 libellés de
modification publiés omis par le moteur de rendu local. Les réponses originales
et les sommes de contrôle sont conservées dans `source-snapshot/`.

L&#39;assistant IA hébergé d&#39;Exa n&#39;est pas disponible dans l&#39;aperçu local de
Mintlify. Ses contrôles locaux ouvrent à la place une recherche fonctionnelle
dans la documentation. Les tableaux de bord externes et les destinations du
playground d&#39;API restent externes. Les URL de téléchargement Markdown et de
schéma passent par des redirections vers des payloads `.txt` identiques, car le
serveur de développement natif ne sert pas directement ces extensions de
fichier. Les horodatages de statut en direct et les médias animés peuvent
varier d&#39;une capture à l&#39;autre.

<div id="reproduce">
  ## Reproduire
</div>

```sh
pnpm validate
pnpm check:links
pnpm audit:content
pnpm dev
# Dans un autre terminal, pendant que l'aperçu s'exécute :
python3 verification/audit-content.py --url http://localhost:3000 --output verification/route-audit.json
python3 verification/check-exports.py
node verification/audit-interactions.mjs
node verification/audit-api-content.mjs
node verification/compare-all.mjs
node verification/mobile-theme-check.mjs
node verification/build-blind-gallery.mjs
```

Les vérifications de navigateur nécessitent Google Chrome et utilisent le package Playwright installé.
Les captures d&#39;écran de toutes les pages sont des artefacts générés localement, exclus de Git ;
régénérez-les avant d&#39;utiliser la galerie dans un nouveau checkout.