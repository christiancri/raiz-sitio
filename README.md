# raizweb.com — sitio

Sitio estático de Raíz. HTML, CSS y JS a mano, sin paso de compilación:
lo que hay en este repo es exactamente lo que se publica.

## Despliegue

Cloudflare Pages, proyecto **`raiz-web`** (Direct Upload, sin conexión a Git).
Dominios: `raizweb.com`, `www.raizweb.com`, `raiz-web.pages.dev`.

```bash
npx wrangler pages deploy . --project-name raiz-web
```

## Estructura

```
index.html  nosotros.html  servicios.html  proceso.html
trabajos.html  contacto.html  404.html
blog/           índice y dos artículos
css/raiz.css    702 líneas: tokens → base → layout → secciones → responsive
js/raiz.js
assets/img/paginas/   imágenes de contenido (.jpg + .webp)
assets/img/og/        imágenes para redes, una por página
assets/video/         vídeo del hero (.mp4 + .webm)
assets/icons/         favicon
robots.txt  sitemap.xml  site.webmanifest
```

Cloudflare Pages sirve las páginas sin la extensión: `nosotros.html` responde
en `/nosotros` y redirige `/nosotros.html` con un 308. Los enlaces internos
del sitio usan la forma con `.html`.

## Procedencia

Reconstruido el **9 de septiembre de 2026** descargando el sitio publicado.

El código original se perdió: vivía en una carpeta del Escritorio que
desapareció, no estaba en ningún respaldo (ni el del 3 ni el del 6 de
septiembre, ni el disco externo) y el proyecto de Cloudflare es Direct Upload,
así que tampoco había repositorio detrás.

La recuperación salió limpia porque el sitio se sirve sin minificar y con los
comentarios intactos — lo descargado *es* el fuente. Los 15 archivos de texto
se compararon byte a byte contra el sitio publicado: idénticos.

Una salvedad: Cloudflare inyecta en el borde el script de Web Analytics
(`static.cloudflareinsights.com/beacon.min.js`). Venía en el HTML descargado
y se quitó, porque no es parte del código — Cloudflare lo vuelve a poner solo
al servir. No lo añadas a mano. Lo único que no se puede
descartar es que se hubiera perdido algún archivo que ninguna página
enlazaba: borradores, imágenes sin usar. Todo lo que el sitio referencia
está aquí y verificado.
