> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="exa-snapshot">
  # Exa Snapshot
</div>

> Fija Search y Contents a una versión almacenada de una página en la fecha y hora que elijas.

Exa Snapshot conserva versiones almacenadas de las páginas que Exa ha rastreado. Envía `snapshotAsOf` para fijar la solicitud a una fecha y hora concretas.

Úsalo para hacer backtesting de agentes, ejecutar evaluaciones reproducibles y comparar versiones anteriores de documentación, páginas de precios, políticas y presentaciones regulatorias.

<Info>
  Exa Snapshot está disponible con pago por uso a 10 QPS, con una ventana de índice móvil de 5 meses.
  Tras 100 solicitudes, [habla con el equipo de ventas](https://exa.ai/contact/sales) para continuar.
</Info>

<div id="search-at-a-datetime">
  ## Búsqueda en una fecha y hora
</div>

En `/search`, coloca `snapshotAsOf` dentro de `contents`.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "latest stable Python release notes",
      num_results=3,
      contents={
          "snapshot_as_of": "2026-07-01T00:00:00Z",
          "highlights": True,
      },
  )

  for r in result.results:
      print(r.title, r.url)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search("latest stable Python release notes", {
    numResults: 3,
    contents: {
      snapshotAsOf: "2026-07-01T00:00:00Z",
      highlights: true
    }
  });

  for (const r of result.results) {
    console.log(r.title, r.url);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "latest stable Python release notes",
      "numResults": 3,
      "contents": {
        "snapshotAsOf": "2026-07-01T00:00:00Z",
        "highlights": true
      }
    }'
  ```
</CodeGroup>

Exa descubre las URL candidatas y luego conserva únicamente las páginas que tengan una versión almacenada en la fecha de `snapshotAsOf` o anterior.

<Accordion title="Ejemplo de respuesta">
  ```json theme={null}
  {
    "requestId": "211fc1f57b87a792de082309ef3bce95",
    "results": [
      {
        "id": "https://docs.python.org/3/whatsnew/changelog.html",
        "url": "https://docs.python.org/3/whatsnew/changelog.html",
        "title": "Changelog — Python 3.14.6 documentation",
        "highlights": [
          "Changelog — Python 3.14.6 documentation\n...\n## Python 3.14.6 final¶\n...\nRelease date: 2026-06-10"
        ],
        "image": "https://docs.python.org/3.14/_images/social_previews/..."
      },
      {
        "id": "https://docs.python.org/3/whatsnew/index.html",
        "url": "https://docs.python.org/3/whatsnew/index.html",
        "title": "What's New in Python — Python 3.14.6 documentation",
        "highlights": ["What's new in Python\n...\n- Python 3.14.6 final\n- Python 3.14.5 final"]
      },
      {
        "id": "https://docs.python.org/3/whatsnew/3.14.html",
        "url": "https://docs.python.org/3/whatsnew/3.14.html",
        "title": "What's new in Python 3.14 — Python 3.14.6 documentation",
        "highlights": ["Python 3.14 is the latest stable release of the Python programming language..."]
      }
    ]
  }
  ```
</Accordion>

<div id="pin-contents-to-a-datetime">
  ## Fijar contents a una fecha y hora
</div>

Agrega `snapshotAsOf` en el nivel superior de una solicitud a `/contents`.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.get_contents(
      ["https://en.wikipedia.org/wiki/2026"],
      snapshot_as_of="2026-06-01T00:00:00Z",
      text=True,
  )

  print(result.results[0].text[:300])
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.getContents(
    ["https://en.wikipedia.org/wiki/2026"],
    {
      snapshotAsOf: "2026-06-01T00:00:00Z",
      text: true
    }
  );

  console.log(result.results[0].text.slice(0, 300));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://en.wikipedia.org/wiki/2026"],
      "snapshotAsOf": "2026-06-01T00:00:00Z",
      "text": true
    }'
  ```
</CodeGroup>

Exa devuelve la versión almacenada más reciente correspondiente a esa fecha y hora o anterior.

<Accordion title="Ejemplo de respuesta">
  ```json theme={null}
  {
    "requestId": "c05151f7df9cd9d8785e0acf0935355d",
    "results": [
      {
        "id": "https://en.wikipedia.org/wiki/2026",
        "url": "https://en.wikipedia.org/wiki/2026",
        "title": "2026",
        "author": null,
        "text": "2026\n\n2026 (MMXXVI) is the current year, and is a common year starting on Thursday of the Gregorian calendar...",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/..."
      }
    ],
    "statuses": [
      {
        "id": "https://en.wikipedia.org/wiki/2026",
        "status": "success",
        "source": "cached"
      }
    ]
  }
  ```
</Accordion>

<Tip>
  Los ID que no tengan ninguna versión válida se omiten de `results` y se informan en `statuses` con
  `"status": "error"` y `"tag": "CONTENT_NOT_CACHED"`.
</Tip>

<div id="how-snapshots-work">
  ## Cómo funcionan las instantáneas
</div>

| Campo          | Dónde     | Significado                                                                                        |
| -------------- | --------- | -------------------------------------------------------------------------------------------------- |
| `snapshotAsOf` | Solicitud | Fecha y hora de corte. Exa devuelve la versión almacenada más reciente en ese instante o anterior. |

Para ambos endpoints:

* El contenido de página devuelto proviene de esa versión almacenada.
* El título, el autor, la fecha de publicación, el texto, los highlights y los resúmenes se generan únicamente a partir de esa versión.
* Se omiten las páginas que no tengan una versión válida dentro de la ventana de 5 meses.

<Note>
  En Search, el corte acota el contenido, no el ranking. Exa sigue usando las señales de recuperación
  actuales para descubrir URL candidatas. Usa los resultados como evidencia acotada por `snapshotAsOf`, y no como una
  reconstrucción exacta del ranking que habría devuelto una search en ese momento.
</Note>

<div id="limits-and-compatibility">
  ## Límites y compatibilidad
</div>

<AccordionGroup>
  <Accordion title="Acceso, límite de solicitudes y ventana histórica">
    El plan de pago por uso incluye 10 QPS y acceso a los últimos 5 meses del índice. Se rechaza cualquier `snapshotAsOf`
    anterior a esa ventana. Después de 100 solicitudes, [habla con ventas](https://exa.ai/contact/sales)
    para continuar.
  </Accordion>

  <Accordion title="Las solicitudes históricas usan contenido almacenado">
    No combines `snapshotAsOf` con opciones que puedan acceder a la web en vivo o extenderse a otras páginas.
    Omite por completo `livecrawl`, `livecrawlTimeout`, `maxAgeHours` y `subpages`; las solicitudes que incluyan
    cualquiera de ellos junto con `snapshotAsOf` se rechazan con `INVALID_REQUEST`.
  </Accordion>

  <Accordion title="Solicitudes de Search compatibles">
    Exa Snapshot en Search admite `auto`, `fast` e `instant`. No admite
    `deep-lite`, `deep` ni `deep-reasoning`.

    Exa Snapshot no admite el parámetro `category` en Search.
  </Accordion>
</AccordionGroup>

<div id="common-uses">
  ## Usos habituales
</div>

Usa Exa Snapshot cuando la tarea dependa de lo que Exa tenía almacenado en una fecha y hora concretas:

* Hacer backtesting de un agente sin exponerlo a actualizaciones posteriores de las páginas.
* Ejecutar una evaluación sobre un límite de contenido reproducible.
* Comparar versiones anteriores de documentación, precios, políticas o presentaciones regulatorias.