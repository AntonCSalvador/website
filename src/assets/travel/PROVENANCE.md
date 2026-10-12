# Travel map and hiker

Geography is Natural Earth's public-domain 1:110m Admin 0 country geometry, fetched 2026-10-11 from [the Natural Earth vector repository](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson). [Terms of use](https://www.naturalearthdata.com/about/terms-of-use/) permit modification and redistribution without permission or mandatory attribution. Original GeoJSON SHA256: `6866c877d39cba9c357620878839b336d569f8c662d3cfab4cb1dbe2d39c977f`.

`geography.json` retains only country names and polygons intersecting longitude -100 to -10, latitude 20 to 72 (23,119 bytes). `TravelMap.astro` builds SVG paths locally, rounding projected coordinates to 0.1 SVG units. The source data and projection are never loaded by the browser. The equirectangular projection maps this frame to 1000 × 760 units; markers use the same projection. Low-resolution country outlines provide context, not navigation or specific visited addresses. The SVG viewport clips the outer edges. No routes between destinations are inferred.

Representative destination coordinates, verified against primary sources on 2026-10-11:

- Boston: 42.3581, -71.0636 — [City of Boston Open Space Plan 2015–2021, page 3-1](https://www.cityofboston.gov/images_documents/Section%203%20OSP1521%20Community%20Setting_tcm3-48291.pdf).
- Cincinnati: 39.1412561, -84.5060260 — [US Census ACS26 Ohio places, Cincinnati centroid](https://tigerweb.geo.census.gov/tigerwebmain/Files/acs26/tigerweb_acs26_incplace_oh.html).
- Orlando: 28.4772289, -81.3368558 — [US Census BVP20 Florida places, Orlando centroid](https://tigerweb.geo.census.gov/tigerwebmain/Files/tab20/tigerweb_tab20_incplace_2020_fl.html).
- Toronto: 43.65, -79.3833333 — [City of Toronto geography](https://www.toronto.ca/city-government/data-research-maps/toronto-at-a-glance/), converting 43°39′N, 79°23′W to decimal degrees.
- Iceland: 64.779286, -18.673711 — Natural Earth's `LABEL_Y`, `LABEL_X`, marking the country rather than claiming a specific visited stop.

The hiker is an original decorative character generated with OpenAI's built-in image generation on 2026-10-11. It is not a photograph or depiction of Anton. The source PNG, original embedded prompt, and controller provenance remain locally in `.impeccable/assets/`. `hiker.webp` is trimmed to transparent bounds and resized to 168px height with existing Sharp, WebP quality 82. Its exact prompt is embedded in EXIF ImageDescription and recorded by Impeccable's WebP sidecar fallback (`hiker.webp.json`). Astro serves the optimized original directly, preserving its metadata. Display size is 56px tall; all movement stays inside the destination panel and lasts 500ms.

To prepare updated assets, run `node scripts/prepare-travel-assets.mjs`, then `impeccable embed-prompt src/assets/travel/hiker.webp --prompt <exact source prompt>`. Ordinary site builds need no network access.
