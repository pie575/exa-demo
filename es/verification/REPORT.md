# Verificación frente a producción de Exa {#verification-against-exa-production}

Instantánea de producción: 18 de septiembre de 2026. Vista previa local: http://localhost:3000/docs.

| Comprobación                             | Resultado                                                                                                                                      | Evidencia                                          |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Inventario de fuentes y navegación       | 159 de 159 páginas; no falta ni sobra ninguna                                                                                                  | [Auditoría de contenido](content-audit.json)       |
| Renderizado HTTP de páginas              | 159 de 159 rutas se renderizan                                                                                                                 | [Auditoría de rutas](route-audit.json)             |
| Contenido completo renderizado de la API | 69 de 69 coinciden con producción tras normalizar los espacios en blanco                                                                       | [Comparación de la API](api-content-audit.json)    |
| Enlaces internos y referencias de la API | 378 enlaces creados y las 69 rutas/métodos del esquema pasan                                                                                   | [Auditoría de contenido](content-audit.json)       |
| Descargas publicadas                     | Los 9 exports probados de Markdown, LLM y esquema se resuelven con payloads coincidentes                                                       | [Auditoría de exports](exports-report.json)        |
| Comportamiento interactivo               | Las 11 comprobaciones en el navegador pasan, sin errores de página                                                                             | [Auditoría de interacción](interaction-audit.json) |
| Diseño de escritorio                     | Las 159 rutas coinciden con la geometría medida y la altura total del contenido; sin errores en tiempo de ejecución ni imágenes visibles rotas | [Resumen visual](visual-summary.json)              |
| Móvil y modo oscuro                      | 10 comparaciones en 5 rutas representativas; los diseños medidos coinciden, sin desbordamiento horizontal ni imágenes visibles rotas           | [Comparación móvil/tema](mobile-theme/report.json) |
| Compilación y enlaces de Mintlify        | `pnpm validate` y `pnpm check:links` pasan                                                                                                     | Comandos reproducibles a continuación              |

Las comprobaciones de interacción incluyen todos los selectores de ejemplo de la página de inicio, la
búsqueda local de texto completo y la navegación por teclado, los resultados vacíos, la tecla Escape, el copiado al portapapeles, el cambio
de tema, el renderizado del esquema de la API, las siete pestañas de la hoja de cálculo de Agent y la navegación
y búsqueda en móvil.

## Revisión visual a ciegas {#blind-visual-review}

[Abre la galería de comparación A/B de 159 páginas](blind/index.html). Las dos
capturas de pantalla de cada página se barajan de forma independiente. La galería guarda las preferencias A/B/empate
en el navegador. Los cuatro pares representativos de escritorio/móvil también se revisaron
sin consultar la key de identidad: [revisión final](blind/final-review.md).
Las revisiones independientes anteriores y sus capturas correspondientes están archivadas en
`blind/review-round-2/`.

Las revisiones representativas finales no detectaron ninguna ventaja estética relevante en
ninguna de las dos versiones. Dos de los pares representativos finales son idénticos a nivel de mapa de bits; los otros
dos difieren en solo 8 y 1 píxeles respectivamente con el umbral registrado
([mediciones de píxeles](representative-pixel-comparison.json)). Se trata de comprobaciones
de las áreas visibles capturadas, no de una afirmación de identidad total de píxeles ni de
equivalencia del servicio alojado. De las 159 páginas, el texto del cuerpo coincide en 158; la
única diferencia es el timestamp de comprobación de la Página de estado en vivo.

## Detalles de fidelidad {#fidelity-details}

El import conserva el tema de producción, la navegación, los estilos y scripts
personalizados, las fuentes, los metadatos de página, las especificaciones de API
y los componentes MDX originales. También restaura la hoja de cálculo Agent Examples
omitida en el export de Markdown y las 85 etiquetas de modificación publicadas que
omitía el renderizador local. Las respuestas originales y las sumas de verificación
se conservan en `source-snapshot/`.

El asistente de IA alojado de Exa no está disponible en la vista previa local de
Mintlify. Sus controles locales abren, en su lugar, una búsqueda funcional de la
documentación. Los paneles externos y los destinos del playground de API siguen
siendo externos. Las URL de descarga de Markdown y de esquemas usan redirecciones
a payloads `.txt` idénticos, ya que el servidor de desarrollo nativo no sirve
directamente esas extensiones de archivo. Las marcas de tiempo del estado en vivo
y el contenido multimedia animado pueden variar entre capturas.

## Reproducir {#reproduce}

```sh
pnpm validate
pnpm check:links
pnpm audit:content
pnpm dev
# En otra terminal, con la vista previa en ejecución:
python3 verification/audit-content.py --url http://localhost:3000 --output verification/route-audit.json
python3 verification/check-exports.py
node verification/audit-interactions.mjs
node verification/audit-api-content.mjs
node verification/compare-all.mjs
node verification/mobile-theme-check.mjs
node verification/build-blind-gallery.mjs
```

Las comprobaciones del navegador requieren Google Chrome y usan el paquete de Playwright instalado.
Las capturas de pantalla de todas las páginas son artefactos generados localmente y excluidos de Git;
vuelve a generarlas antes de usar la galería en un checkout nuevo.