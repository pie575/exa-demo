> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Aperçu de la sécurité {#security-overview}

> Informations sur la sécurité, la conformité et l&#39;accès régional d&#39;Exa.

***

Exa prend très au sérieux la sécurité et la confidentialité des données. Nous sommes fiers d&#39;être certifiés SOC 2 Type II, ce qui témoigne de notre engagement à maintenir des pratiques et des contrôles rigoureux en matière de sécurité de l&#39;information.

Contactez-nous à l&#39;adresse [sales@exa.ai](mailto:sales@exa.ai) pour envisager un plan Enterprise si vous êtes intéressé par le [Zero Data Retention](/fr/docs/admin/security/zero-data-retention), la [conformité HIPAA](/fr/docs/admin/security/hipaa) ou d&#39;autres solutions de sécurité des données sur mesure.

Consultez notre [Trust Center](https://trust.exa.ai) pour accéder à nos rapports SOC 2, à notre accord de traitement des données et à nos autres documentations relatives à la sécurité.

## Restrictions d&#39;accès régionales {#regional-access-restrictions}

Pour se conformer aux sanctions et aux restrictions commerciales, Exa bloque l&#39;accès à l&#39;API depuis les pays et régions sous sanctions ou soumis à d&#39;autres restrictions, notamment la Crimée, Cuba, l&#39;Iran, la Corée du Nord, la Russie, la Syrie, l&#39;Ukraine et le Venezuela.

Les requêtes provenant de ces zones peuvent être bloquées par Cloudflare avant d&#39;atteindre Exa. Dans ce cas, la réponse peut être une page de blocage du WAF Cloudflare accompagnée d&#39;un Ray ID, au lieu du JSON d&#39;erreur standard de l&#39;API Exa.

Si vous pensez que votre trafic est géolocalisé de manière incorrecte, contactez [hello@exa.ai](mailto:hello@exa.ai) en indiquant votre adresse IP source, votre pays ou région, l&#39;horodatage de la requête et le Ray ID Cloudflare.