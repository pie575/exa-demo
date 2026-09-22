> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="exa-for-google-sheets">
  # Exa para Google Sheets
</div>

> Usa Exa Agent y las fórmulas de Exa dentro de Google Sheets.

<Warning>
  **Varias cuentas de Google:** el add-on debe ejecutarse con la primera cuenta de Google (la predeterminada) de tu perfil del navegador. Si tienes la sesión iniciada en varias cuentas, es posible que no puedas guardar ni cargar tu API key. Para solucionarlo, abre Sheets en una ventana de incógnito con una sola cuenta, o cierra sesión en las cuentas adicionales para que la cuenta que quieres usar sea la predeterminada. [Más información](https://developers.google.com/apps-script/guides/projects#fix_issues_with_multiple_google_accounts).
</Warning>

Usa Exa dentro de Google Sheets para investigar en la web, generar tablas y completar datos faltantes.

El add-on te ofrece dos formas de trabajar:

* **Exa Agent** para tablas completas y tareas de varias celdas
* **`=EXA(...)`** para obtener una respuesta en una sola celda

<div id="install">
  ## Instalación
</div>

<Steps>
  <Step title="Instala el add-on">
    Ve al [add-on de Exa AI](https://workspace.google.com/marketplace/app/exa_ai/465545439521) en el Google Workspace Marketplace y haz clic en **Install**.
  </Step>

  <Step title="Abre una hoja de Google Sheets">
    Abre una spreadsheet nueva o existente.
  </Step>

  <Step title="Abre el sidebar">
    Ve a **Extensions → Exa AI → Open Sidebar**.
  </Step>

  <Step title="Añade tu API key">
    <Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Crea una key en el panel. Las cuentas nuevas incluyen créditos gratuitos.
    </Card>

    Pega la key en el sidebar.
  </Step>

  <Step title="Empieza a usar Exa">
    Abre **Exa Agent** y empieza a usar Exa en tu sheet.
  </Step>
</Steps>

<div id="exa-agent">
  ## Exa Agent
</div>

Exa Agent te permite usar Exa en varias celdas de Google Sheets.

Úsalo cuando quieras:

* generar una tabla completa a partir de un solo prompt
* completar las celdas vacías de una tabla existente
* ampliar una tabla añadiendo nuevas filas
* enriquecer una lista con datos de la web

<div id="generate-a-table">
  ### Generar una tabla
</div>

Usa **Generate table** cuando quieras que Exa cree una tabla nueva.

1. Abre el sidebar.
2. Ve a **Exa Agent**.
3. Elige **Generate table**.
4. Escribe lo que necesitas.
5. Haz clic en **Generate table**.

Ejemplo de prompt:

```text theme={null}
Encuentra las 40 principales empresas de IA y devuelve el nombre de la empresa, la URL del sitio web, el CEO, la fecha de fundación, la sede y una breve descripción.
```

Exa investiga en la web y escribe la tabla en tu hoja.

De forma predeterminada, la tabla comienza en la celda seleccionada. Puedes elegir otra celda de inicio en **Más opciones**.

<div id="fill-cells">
  ### Fill cells
</div>

Usa **Fill cells** cuando ya tengas una tabla y quieras que Exa complete los datos que faltan.

1. Selecciona las celdas vacías de tu hoja.
2. Abre **Exa Agent**.
3. Elige **Fill cells**.
4. Haz clic en **Fill selected cells**.

Exa analiza la tabla que rodea tu selección y rellena los huecos.

Antes de usar **Fill cells**, selecciona celdas vacías en una tabla que ya tenga encabezados claros.

Ejemplo:

| Empresa | Sitio web                                | CEO           | Sede          |
| ------- | ---------------------------------------- | ------------- | ------------- |
| Apple   | [https://apple.com](https://apple.com)   |               |               |
| Google  | [https://google.com](https://google.com) | Sundar Pichai | Mountain View |

Selecciona las celdas vacías de Apple y luego haz clic en **Fill selected cells**. Exa usa el nombre de la empresa y las filas cercanas como contexto.

<div id="continue-rows">
  ### Continuar filas
</div>

También puedes seleccionar filas en blanco debajo de una tabla.

Si tu tabla termina en la posición 55 y seleccionas las dos filas en blanco siguientes, Exa puede continuar la tabla con las posiciones 56 y 57.

Exa usa las filas existentes como ejemplos, mantiene las mismas columnas y evita repetir elementos que ya figuran en la tabla.

<div id="exa">
  ## `=EXA(...)`
</div>

Usa `=EXA(...)` cuando quieras obtener una única respuesta en una celda. Busca en la web, lee los principales resultados y devuelve una respuesta concisa.

```text theme={null}
=EXA("what you want", cell)
```

| Parámetro | Obligatorio | Descripción                                                                          |
| --------- | ----------- | ------------------------------------------------------------------------------------ |
| `prompt`  | Sí          | La información que quieres obtener (p. ej., `"Return only the CEO name"`).           |
| `context` | No          | Referencia de celda o texto a enriquecer (p. ej., el nombre de una empresa en `A2`). |

Ejemplos:

```text theme={null}
=EXA("Return only the company website URL", A2)
=EXA("Return only the CEO name", A2)
=EXA("Return only the headquarters", A2)
=EXA("Return the Amazon rating of this product", A2)
```

El segundo argumento es el contexto. Puedes arrastrar la fórmula hacia abajo en una columna para ejecutarla en muchas filas.

Usa `=EXA(...)` para respuestas simples de una sola celda. Usa **Exa Agent** cuando quieras crear o completar una tabla completa.

<div id="exa_answer">
  ## `=EXA_ANSWER(...)`
</div>

Respuestas avanzadas con IA y control total sobre el formato del output. Úsala cuando necesites prompts de sistema, output JSON estructurado, citas o un tipo de búsqueda específico.

```text theme={null}
=EXA_ANSWER(prompt, [prefix], [suffix], [includeCitations], [systemPrompt], [outputSchema], [returnRawJson], [type])
```

| Parámetro          | Obligatorio | Valor predeterminado | Descripción                                                                                                   |
| ------------------ | ----------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `prompt`           | Sí          | —                    | La pregunta o el prompt principal.                                                                            |
| `prefix`           | No          | `""`                 | Texto añadido antes del prompt.                                                                               |
| `suffix`           | No          | `""`                 | Texto añadido después del prompt.                                                                             |
| `includeCitations` | No          | `FALSE`              | Si es `TRUE`, añade citas numeradas de las fuentes.                                                           |
| `systemPrompt`     | No          | `""`                 | Instrucciones de sistema para controlar el formato de salida (por ejemplo, `"only return a number"`).         |
| `outputSchema`     | No          | `""`                 | Esquema JSON para la salida estructurada. [Genera esquemas aquí](https://dashboard.exa.ai/playground/answer). |
| `returnRawJson`    | No          | `FALSE`              | Si es `TRUE` y se define `outputSchema`, devuelve el JSON completo en lugar de extraer el valor.              |
| `type`             | No          | `"deep"`             | Tipo de búsqueda: `"auto"`, `"neural"`, `"fast"` o `"deep"`.                                                  |

Ejemplos:

```text theme={null}
=EXA_ANSWER("OpenAI CEO", "", "", FALSE, "only return a name")
=EXA_ANSWER("Modal AI headcount", "", "", FALSE, "only return a number")
=EXA_ANSWER("ceo of exa.ai", "", "", FALSE, "", "{""type"":""object"",""properties"":{""name"":{""type"":""string""}}}")
```

<div id="exa_search">
  ## `=EXA_SEARCH(...)`
</div>

Busca en la web y devuelve una lista vertical de URL. Admite filtrado por dominio, filtrado por categoría, highlights del contenido y output sintetizado mediante `outputSchema`.

```text theme={null}
=EXA_SEARCH(query, [numResults], [searchType], [prefix], [suffix], [includeDomainsStr], [excludeDomainsStr], [category], [highlightsMaxChars], [outputSchemaJson])
```

| Parámetro            | Obligatorio | Valor por defecto | Descripción                                                                                                                                                                       |
| -------------------- | ----------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query`              | Sí          | —                 | La consulta de búsqueda.                                                                                                                                                          |
| `numResults`         | No          | `1`               | Número de resultados (1–10).                                                                                                                                                      |
| `searchType`         | No          | `"auto"`          | `"auto"`, `"neural"` o `"keyword"`.                                                                                                                                               |
| `prefix`             | No          | `""`              | Texto que se añade antes de la consulta.                                                                                                                                          |
| `suffix`             | No          | `""`              | Texto que se añade después de la consulta.                                                                                                                                        |
| `includeDomainsStr`  | No          | `""`              | Dominios separados por comas que se deben incluir (por ejemplo, `"linkedin.com,crunchbase.com"`).                                                                                 |
| `excludeDomainsStr`  | No          | `""`              | Dominios separados por comas que se deben excluir.                                                                                                                                |
| `category`           | No          | `""`              | Filtrar por tipo: `"company"`, `"publication"`, `"news"`, `"personal site"`, `"financial report"`, `"people"`.                                                                    |
| `highlightsMaxChars` | No          | `0`               | Si es &gt; 0, solicita highlights del contenido con este límite de caracteres por resultado.                                                                                      |
| `outputSchemaJson`   | No          | `""`              | Cadena JSON para `outputSchema` (por ejemplo, `"{""type"":""text"",""description"":""summarize""}"`). Si se especifica, devuelve el texto del output sintetizado en lugar de URL. |

Ejemplos:

```text theme={null}
=EXA_SEARCH("AI startups", 5, "auto", "", "", "linkedin.com,crunchbase.com")
=EXA_SEARCH("transformer architecture", 5, "auto", "", "", "", "", "publication")
```

<div id="exa_contents">
  ## `=EXA_CONTENTS(...)`
</div>

Extrae el contenido de texto de una URL.

```text theme={null}
=EXA_CONTENTS(url)
```

| Parámetro | Obligatorio | Descripción                                           |
| --------- | ----------- | ----------------------------------------------------- |
| `url`     | Sí          | La URL completa (debe comenzar con `http` o `https`). |

<div id="exa_findsimilar">
  ## `=EXA_FINDSIMILAR(...)`
</div>

Encuentra URL similares a una URL de referencia, con filtros opcionales de dominio y texto.

```text theme={null}
=EXA_FINDSIMILAR(url, [numResults], [includeDomainsStr], [excludeDomainsStr], [includeTextStr], [excludeTextStr])
```

| Parámetro           | Obligatorio | Valor por defecto | Descripción                                   |
| ------------------- | ----------- | ----------------- | --------------------------------------------- |
| `url`               | Sí          | —                 | La URL de referencia.                         |
| `numResults`        | No          | `1`               | Número de resultados (1–10).                  |
| `includeDomainsStr` | No          | `""`              | Dominios a incluir, separados por comas.      |
| `excludeDomainsStr` | No          | `""`              | Dominios a excluir, separados por comas.      |
| `includeTextStr`    | No          | `""`              | Frase que debe aparecer en los resultados.    |
| `excludeTextStr`    | No          | `""`              | Frase que no debe aparecer en los resultados. |

<div id="batch">
  ## Batch
</div>

Usa **Batch** cuando quieras trabajar con muchas celdas con fórmulas de Exa a la vez.

Batch puede:

* actualizar las celdas seleccionadas que tengan fórmulas de Exa
* convertir las fórmulas de Exa seleccionadas en valores normales

Convierte las fórmulas en valores cuando quieras conservar los resultados actuales e impedir que las fórmulas se vuelvan a ejecutar.

<div id="when-to-use-what">
  ## Cuándo usar cada cosa
</div>

| Tarea                                                             | Usar                        |
| ----------------------------------------------------------------- | --------------------------- |
| Crear una tabla completa a partir de un prompt                    | Exa Agent → Generate table  |
| Rellenar celdas vacías de una tabla                               | Exa Agent → Fill cells      |
| Continuar una tabla con filas nuevas                              | Exa Agent → Fill cells      |
| Obtener un valor en una celda                                     | `=EXA(...)`                 |
| Obtener una respuesta con prompt de sistema o salida estructurada | `=EXA_ANSWER(...)`          |
| Buscar y obtener una lista de URL                                 | `=EXA_SEARCH(...)`          |
| Extraer texto de una URL                                          | `=EXA_CONTENTS(...)`        |
| Encontrar páginas similares a una URL                             | `=EXA_FINDSIMILAR(...)`     |
| Actualizar muchas fórmulas de Exa                                 | Batch                       |
| Guardar los resultados de las fórmulas como texto plano           | Batch → Convertir a valores |

<div id="notes">
  ## Notas
</div>

* Las solicitudes a la API de Exa se descuentan de tu cuota de uso. Usa **Batch → Convertir a valores** para fijar los resultados e impedir que las fórmulas se recalculen.
* El add-on reintenta automáticamente hasta 3 veces con exponential backoff cuando se alcanza el límite de tasa (HTTP 429).
* Empieza con batches pequeños (10–20 filas) antes de escalar a cientos.

<div id="links">
  ## Enlaces
</div>

* [Instalar Exa AI para Google Sheets](https://workspace.google.com/marketplace/app/exa_ai/465545439521)
* [Obtener una API key de Exa](https://dashboard.exa.ai/api-keys)
* [Repositorio de GitHub](https://github.com/exa-labs/exa-for-sheets)
* [Política de privacidad](https://exa.ai/exa-for-sheets/privacy-policy)