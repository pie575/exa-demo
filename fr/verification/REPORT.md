<div id="verification-against-exa-production">
  # Vérification par rapport à la production Exa
</div>

Instantané de production : 18 septembre 2026. Aperçu local : http://localhost:3000/docs.

| Vérification                           | Résultat                                                                                                                                      | Preuves                                              |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Inventaire des sources et navigation   | 159 pages sur 159 ; aucune page manquante ou superflue                                                                                        | [Audit de contenu](content-audit.json)               |
| Rendu HTTP des pages                   | 159 routes sur 159 rendues                                                                                                                    | [Audit des routes](route-audit.json)                 |
| Contenu d&#39;API complet rendu        | 69 sur 69 correspondent à la production après normalisation des espaces                                                                       | [Comparaison d&#39;API](api-content-audit.json)      |
| Liens internes et références d&#39;API | 378 liens rédigés et l&#39;ensemble des 69 chemins/méthodes de schema validés                                                                 | [Audit de contenu](content-audit.json)               |
| Téléchargements publiés                | Les 9 exports Markdown, LLM et schema testés se résolvent avec des payloads correspondants                                                    | [Audit des exports](exports-report.json)             |
| Comportement interactif                | Les 11 vérifications navigateur réussissent, aucune erreur de page                                                                            | [Audit des interactions](interaction-audit.json)     |
| Mise en page bureau                    | Les 159 routes correspondent à la géométrie mesurée et à la hauteur totale du contenu ; aucune erreur d&#39;exécution ni image visible cassée | [Synthèse visuelle](visual-summary.json)             |
| Mobile et mode sombre                  | 10 comparaisons sur 5 routes représentatives ; les mises en page mesurées correspondent, aucun débordement horizontal ni image visible cassée | [Comparaison mobile/thème](mobile-theme/report.json) |
| Build et liens Mintlify                | `pnpm validate` et `pnpm check:links` réussissent                                                                                             | Commandes reproductibles ci-dessous                  |

Les vérifications d&#39;interaction couvrent tous les sélecteurs d&#39;exemples de la page d&#39;accueil, la
search plein texte locale et la navigation au clavier, les résultats vides, la touche Échap, la copie dans le presse-papiers, le
changement de thème, le rendu des schemas d&#39;API, les sept onglets du tableur Agent ainsi que la
navigation et la search sur mobile.

<div id="blind-visual-review">
  ## Revue visuelle à l&#39;aveugle
</div>

[Ouvrir la galerie de comparaison A/B de 159 pages](blind/index.html). Les deux
captures d&#39;écran de chaque page sont mélangées indépendamment. La galerie
enregistre les préférences A/B/égalité dans le navigateur. Les quatre paires
représentatives desktop/mobile ont également été examinées sans consulter la clé
d&#39;identité : [revue finale](blind/final-review.md).
Les revues indépendantes antérieures et les captures d&#39;écran correspondantes
sont archivées dans `blind/review-round-2/`.

Les revues représentatives finales n&#39;ont révélé aucun avantage esthétique
notable pour l&#39;une ou l&#39;autre version. Deux des paires représentatives finales
sont identiques bitmap pour bitmap ; les deux autres ne diffèrent que de 8 et
1 pixels respectivement au seuil enregistré
([mesures de pixels](representative-pixel-comparison.json)). Il s&#39;agit de
vérifications portant sur les fenêtres d&#39;affichage capturées, et non d&#39;une
affirmation d&#39;identité universelle au pixel près ni d&#39;équivalence des services
hébergés. Sur l&#39;ensemble des 159 pages, le corps du texte correspond sur 158 ;
la seule différence restante est le timestamp de vérification de la status page
en direct.

<div id="fidelity-details">
  ## Détails de fidélité
</div>

L&#39;import préserve le thème de production, la navigation, les styles et scripts
personnalisés, les polices, les métadonnées de page, les spécifications d&#39;API et
les composants MDX d&#39;origine. Il restaure également la feuille de calcul Agent
Examples omise de l&#39;export Markdown, ainsi que les 85 étiquettes de modification
publiées omises par le moteur de rendu local. Les réponses et les sommes de
contrôle d&#39;origine sont conservées dans `source-snapshot/`.

L&#39;assistant IA hébergé d&#39;Exa n&#39;est pas disponible dans l&#39;aperçu local de
Mintlify. Ses contrôles locaux ouvrent à la place une recherche fonctionnelle
dans la documentation. Les dashboards externes et les destinations du playground
d&#39;API restent externes. Les URL de téléchargement du Markdown et des schémas
passent par des redirections vers des payloads `.txt` identiques, car le serveur
de développement natif ne sert pas directement ces extensions de fichier. Les
timestamps de status en direct et les médias animés peuvent varier d&#39;une
capture à l&#39;autre.

<div id="reproduce">
  ## Reproduire
</div>

```sh
pnpm validate
pnpm check:links
pnpm audit:content
pnpm dev
# Dans un autre terminal, l'aperçu étant en cours d'exécution :
python3 verification/audit-content.py --url http://localhost:3000 --output verification/route-audit.json
python3 verification/check-exports.py
node verification/audit-interactions.mjs
node verification/audit-api-content.mjs
node verification/compare-all.mjs
node verification/mobile-theme-check.mjs
node verification/build-blind-gallery.mjs
```

Les vérifications navigateur nécessitent Google Chrome et utilisent le package Playwright installé.
Les captures d&#39;écran de toutes les pages sont des artefacts générés localement et exclus de Git ;
régénérez-les avant d&#39;utiliser la galerie dans un nouveau checkout.