> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# HIPAA {#hipaa}

> Utilisez le mode de conformité HIPAA pour les requests de récupération depuis le cache éligibles.

<Info>
  La conformité HIPAA est disponible pour les clients Enterprise une fois qu&#39;Exa l&#39;a activée pour votre équipe. Contactez [sales@exa.ai](mailto:sales@exa.ai) pour discuter de l&#39;accès Enterprise, des exigences liées au BAA et de l&#39;activation.
</Info>

Le mode HIPAA se contrôle requête par requête via un `compliance` field de premier niveau :

```json theme={null}
{
  "compliance": "hipaa"
}
```

Lorsque ce field est présent sur une équipe éligible, Exa traite la requête avec les contrôles de conformité HIPAA. Si votre équipe n&#39;est pas activée, l&#39;API renvoie `403 FEATURE_DISABLED`.

Le mode HIPAA inclut le [Zero Data Retention](/fr/docs/admin/security/zero-data-retention) pour ces requests : Exa ne conserve aucune PHI.

## Endpoints pris en charge {#supported-endpoints}

Le field `compliance` est reconnu sur :

* [`/search`](/fr/docs/reference/search)
* [`/contents`](/fr/docs/reference/get-contents)

Les autres endpoints rejettent ce field.

## Prérequis {#requirements}

Le mode HIPAA prend uniquement en charge la récupération depuis le cache. Requests compatibles :

* Sur `/search`, définissez `type` sur `instant` ou `fast`
* Demandez `text` ou `highlights` (pas `summary`)
* Utilisez du contenu provenant uniquement du cache : omettez les fields de fraîcheur, ou définissez `maxAgeHours: -1` sur `/contents`

Les requests incompatibles renvoient `400 INVALID_REQUEST_BODY`, notamment :

* `summary` sur `/contents`, ou `contents.summary` sur `/search`
* Les paramètres de fraîcheur qui nécessitent une récupération en direct, comme `maxAgeHours: 0` ou une valeur positive de `maxAgeHours`
* Les requests de recherche qui omettent `type` ou qui utilisent un type autre que `instant` ou `fast`

## Exemple {#example}

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "urls": ["https://example.com/article"],
      "compliance": "hipaa",
      "highlights": true,
      "maxAgeHours": -1
    }'
  ```
</CodeGroup>

## Accès {#access}

Pour activer le mode HIPAA sur votre équipe, contactez [sales@exa.ai](mailto:sales@exa.ai). Consultez le [Trust Center](https://trust.exa.ai) pour accéder à la documentation de sécurité d&#39;Exa.