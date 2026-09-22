> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="import-from-csv">
  # Importar desde CSV
</div>

> Convierte tus datos CSV existentes en un Webset

<br />

<div id="overview">
  ## Descripción general
</div>

La funcionalidad Importar desde CSV te permite convertir tus archivos CSV existentes con URLs en Websets totalmente funcionales. Es ideal cuando ya tienes una lista de sitios web, empresas o recursos que quieres enriquecer con datos adicionales o filtrar aplicando criteria de búsqueda.

<br />

<div id="how-it-works">
  ## Cómo funciona
</div>

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/import-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=6cf23e9e291fe7811942d18c3aa08b33" alt="Flujo de importación de CSV para crear un Webset" width="1512" height="857" data-path="images/websets/import-flow.png" />

1. Haz clic en «Start from CSV» para seleccionar tu archivo CSV
2. Selecciona la columna que contiene las URL que quieres analizar
3. Revisa cómo se importarán tus datos antes de continuar
4. Tus URL se convierten en un Webset con enrichments y metadatos

<br />

<div id="csv-preparation">
  ## Preparación del CSV
</div>

Asegúrate de que tu archivo CSV tenga una columna de URL

* Para búsquedas de personas: las URL deben ser URL de perfiles de LinkedIn (p. ej., [https://linkedin.com/in/username](https://linkedin.com/in/username))
* Para búsquedas de empresas: las URL deben ser URL de la página principal de la empresa (p. ej., [https://example.com](https://example.com))
* Para otras búsquedas: usa cualquier tipo de URL

Si no tienes URL, Websets intentará deducirlas a partir de la información de cada fila del CSV y de cualquier dato adicional que proporciones.

El número máximo de resultados que puedes importar depende de tu plan.

<div id="what-happens-next">
  ## ¿Qué sucede después?
</div>

Una vez importado, tu CSV se convierte en un Webset completo en el que puedes:

<div id="enrich-with-custom-columns">
  ### Enriquecer con columnas personalizadas
</div>

Añade toda la información que quieras sobre cada URL:

* Información de contacto (correos electrónicos, números de teléfono)
* Métricas de la empresa (ingresos, número de empleados)
* Análisis de contenido (sentimiento, temas, resúmenes)
* Datos personalizados propios de tu caso de uso

<div id="apply-search-criteria">
  ### Aplicar criteria de búsqueda
</div>

Filtra las URL importadas según criteria específicos:

* Etapa o tamaño de la empresa
* Industria o sector
* Ubicación geográfica
* Tipo de contenido o tema