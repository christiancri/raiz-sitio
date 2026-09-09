# raizweb.com — el sitio

Sitio estático de **Raíz**, el estudio de diseño web y SEO. HTML, CSS y JS a mano,
sin paso de compilación: lo que hay en este repo es exactamente lo que se publica.

El `README.md` explica el despliegue, la estructura de archivos y de dónde salió este
código. Esto de aquí es lo otro: la marca y las reglas para no romperla.

## La carpeta de al lado

`~/Desktop/Proyectos Claude/raiz-negocio/` es el **negocio**: diagnósticos de prospectos,
marketing y los expedientes de clientes. Ahí está el `CLAUDE.md` con los precios, los
niveles y el método.

**Las dos carpetas están separadas a propósito y no se juntan.** Esta se publica; aquella
contiene cotizaciones internas, argumentos de venta y notas sobre negocios reales con
nombre y apellido. Nunca copiar nada de allá para acá.

**Nunca ejecutar `wrangler` desde la carpeta del negocio.** Publica el directorio en el
que estás parado, y desde allá subiría los expedientes de clientes a raizweb.com.

## Publicar

`git push` **no publica nada**. Cloudflare Pages tiene el proyecto como *Direct Upload*,
sin conexión al repositorio. Para que un cambio se vea en raizweb.com, desde esta carpeta:

```
npx wrangler pages deploy . --project-name raiz-web
```

Subir a GitHub y publicar son dos actos distintos: hay que hacer los dos.

## Posicionamiento

> **"Lo que se ve arriba depende de lo que crece abajo."**

La idea central es **la línea del suelo**: casi todos los sitios se diseñan sólo por
encima. Raíz trabaja las dos mitades. Esa división —**superficie** y **subsuelo**—
organiza el sitio entero y hay que respetarla al escribir o maquetar secciones nuevas.

**Tono:** técnico pero llano, directo, sin jerga decorativa, metáforas de tierra y
crecimiento. Nunca alarmista, nunca vendedor. El sitio promete diagnósticos *honestos* y
*sin llamada de ventas*: cualquier texto nuevo tiene que cumplir las dos cosas.

## Identidad visual

Todo vive en `css/raiz.css` (~700 líneas, un solo archivo: tokens → base → layout →
secciones → responsive). **Usar los tokens, nunca escribir un color a mano.**

```
--paper #F0EEE8   fondo principal        --ink   #17170F   negro verdoso de marca
--arena #E4DFD3   secciones cálidas      --verde #2E3B27   verde raíz
--crema #EFEDE7   texto sobre ink        --verde-claro #5A6B4E
--texto #46463C   cuerpo                 --verde-terminal #7E8C71
--texto-suave #6E6E62                    --linea #C9C3B4   hairline sobre paper
```

**Tipografía** — tres familias, cada una con su trabajo:

| Token | Familia | Para qué |
|---|---|---|
| `--serif` | Newsreader | Títulos (`h1`–`h4`) y el logotipo |
| `--sans` | Helvetica Neue | Cuerpo de texto |
| `--mono` | IBM Plex Mono | Etiquetas, numeración y bloques de datos, a 11px |

Los títulos van en **`font-weight: 400`**, nunca en negrita: el peso lo da el tamaño y la
serif, no el grosor. La escala es fluida con `clamp()` (`--t-display`, `--t-h2`…): para
cambiar un tamaño se toca el token, no la regla suelta.

**Elemento firma — el bloque "terminal"** (`.terminal`): fondo `--ink`, texto mono en
`--verde-terminal`, líneas que empiezan con `>`. Aparece también en los informes de
diagnóstico del otro repo. Es lo más reconocible de la marca; no diluirlo.

**Movimiento:** `--ease: cubic-bezier(.2,.7,.2,1)` y `--dur: .4s`. Discreto y corto.

## Ojo con la identidad vieja

Si algo dice **"Servicios Web — Christian Macías"**, usa paleta **roja** o tipografía
**Kanit**, es material anterior: la marca es Raíz desde 2026. No copiar ese estilo ni
resucitarlo "por consistencia" con un PDF viejo.

Raíz tampoco tiene que ver con `christianmacias.com` ni `takingmoments.com`, que son el
negocio de fotografía. Otra marca, otro repo, otra identidad.

## El JavaScript

`js/raiz.js`, sin dependencias, todo dentro de un IIFE. Tres comportamientos, enganchados
por atributos `data-*`, no por clases:

- `[data-excavacion]` — el tirador que descubre el subsuelo (puntero y teclado).
- `[data-menu-boton]` / `[data-menu-movil]` — menú móvil, con Escape y foco atrapado.
- `[data-hero-video]` — el vídeo del hero, que aparece al `canplay`.

Si añades interacción, sigue el patrón: atributo `data-`, sin librerías, y que funcione
con teclado.

## Reglas al trabajar aquí

- **Nada de inventar cifras.** Ni posiciones de Google, ni reseñas, ni velocidades, ni
  número de clientes. Si no está verificado, no se escribe.
- **Los precios se verifican** contra el `CLAUDE.md` del repo de negocio antes de tocarlos
  en `servicios.html`. No de memoria.
- Cloudflare sirve las páginas sin extensión (`/nosotros`), pero **los enlaces internos
  usan `.html`**. Mantener esa forma para no generar redirecciones de más.
- Al publicar, revisar que `sitemap.xml` siga cuadrando si añadiste o quitaste páginas.
- **No borrar `.assetsignore`.** Cloudflare Pages publica *todo* lo que hay en la carpeta:
  sin ese archivo, `README.md` y `CLAUDE.md` quedan legibles en `raizweb.com/README.md`.
  Si añades documentación nueva que no sea `.md`, súmala ahí.
