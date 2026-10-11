---
name: "Anton Salvador"
description: "A relaxed outdoor home for engineering work, writing, and travel."
colors:
  ink: "#234c3e"
  ink-soft: "#496354"
  paper: "#fbf9f1"
  cream: "#f5efde"
  sage: "#edf4eb"
  orange: "#b84d27"
  line: "#d7ddd0"
  hero-sky: "#bfe5f6"
  travel-ground: "#eef2e4"
  primary-hover: "#17382d"
typography:
  display:
    fontFamily: "'Bricolage Grotesque Variable', sans-serif"
    fontSize: "clamp(2.7rem, 5.4vw, 5.1rem)"
    fontWeight: 750
    lineHeight: 1.07
    letterSpacing: "-.035em"
  headline:
    fontFamily: "'Bricolage Grotesque Variable', sans-serif"
    fontSize: "clamp(2.3rem, 4vw, 3.6rem)"
    fontWeight: 750
    lineHeight: 1.07
    letterSpacing: "-.035em"
  title:
    fontFamily: "'Bricolage Grotesque Variable', sans-serif"
    fontSize: "clamp(1.7rem, 2.2vw, 2.2rem)"
    fontWeight: 750
    lineHeight: 1.07
    letterSpacing: "-.035em"
  body:
    fontFamily: "'Bricolage Grotesque Variable', sans-serif"
    fontSize: "1.0625rem"
    lineHeight: 1.65
  label:
    fontFamily: "'Bricolage Grotesque Variable', sans-serif"
    fontSize: "1rem"
    fontWeight: 650
rounded:
  control: "8px"
  surface: "14px"
  compact-control: "6px"
spacing:
  column: "5rem"
  section: "6.5rem"
  section-tablet: "5rem"
  section-mobile: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: ".8rem 1.35rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  text-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  text-link-hover:
    textColor: "{colors.orange}"
  map-overview:
    textColor: "{colors.ink}"
    backgroundColor: "transparent"
    rounded: "{rounded.compact-control}"
    padding: ".45rem .75rem"
  photo-close:
    textColor: "{colors.paper}"
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.compact-control}"
    padding: ".5rem .85rem"
---

# Design System: Anton Salvador

## Overview

**Creative North Star: "The illustrated outdoor basecamp"**

Relaxed, distinctive, simple, and technical. Pale sky, evergreen lettering, warm ground, and campsite orange establish the outdoor character selected by Anton. Friendly substantial sans lettering and tactile but restrained controls carry that character into readable content.

Illustration supplies atmosphere; quiet lower sections give engineering evidence and writing room. The shared system is light, spacious, and grounded in real content. Homepage composition and the geographic travel concept remain in their surface brief rather than becoming requirements for every page.

**Key Characteristics:**

- Substantial evergreen typography on warm light surfaces.
- Quiet divided rows instead of a repeated card grid.
- Restrained rounded controls and selective, purposeful motion.

## Colors

The palette combines evergreen ink, warm paper, pale sage, and campsite orange. The frontmatter records canonical reused colors from the implementation.

### Primary

- **Evergreen ink:** main text, brand mark, primary actions, and unselected map pins. The deeper hover tone reinforces primary controls.
- **Campsite orange:** link hover, visible focus, and selected map pins; a small accent that connects controls to the illustration.

### Neutral

- **Soft evergreen:** supporting text, credentials, metadata, and captions.
- **Warm paper:** default page and floating-control background.
- **Sunlit cream:** contact/footer surfaces and photo placeholders.
- **Pale sage:** header, about section, code blocks, and menu hover.
- **Quiet boundary:** dividers between project and writing rows.
- **Open sky:** the hero background and readability wash.
- **Travel ground:** the travel section's light green ground.

The geographic map also has local water, land, boundary, and label colors in `TravelMap.astro`; these are map rendering details rather than global brand tokens.

## Typography

Display, body, and controls share self-hosted Bricolage Grotesque Variable with a sans-serif fallback. Heavy, tightly spaced balanced headings sit above open body copy; paragraphs are capped at 70ch. There is no separate label or monospaced brand face.

The frontmatter defines the general heading hierarchy. The illustrated hero uses its own display clamp (`clamp(3.5rem, 5.4vw, 4.9rem)`) and a 15ch measure; below the phone breakpoint it becomes `clamp(2.8rem, 10vw, 4rem)`. Article titles use `clamp(2.7rem, 5.5vw, 4.5rem)` and an 18ch measure. Larger conversational copy uses `clamp(1.5rem, 2.4vw, 2rem)`, a 1.4 line height, and weight 600. Controls use weight 650; navigation uses weight 600.

## Layout

Content sits in a centered container capped at 1180px, with 5rem total horizontal subtraction on wide screens. The header independently caps at 1320px. At 900px the horizontal subtraction becomes 3rem; at 680px it becomes 2.5rem. Section spacing follows the wide/tablet/phone steps in the frontmatter.

Section headings, project rows, about, and writing use two equal columns with the column spacing token, reducing to a 3rem gap at 900px and one column at 680px. Project rows use top dividers and generous vertical padding. Articles and the blog index cap at 900px, with prose capped at 70ch.

The travel atlas places the map beside a narrower destination panel, then stacks at 680px. Photo thumbnails use an auto-fit grid with a 140px minimum constrained to the available width. Header navigation becomes a native disclosure menu at 680px; contact links and footer content wrap. The hero separates live copy from deliberately cropped landscape artwork on phones.

## Elevation & Depth

Most content is flat: colored section grounds and fine dividers establish hierarchy. Shadows are confined to floating navigation, the motion control, map pins, the photo dialog, and the illustrated campfire glow. Their exact values are in the sidecar; there is no general raised-card treatment. The dialog uses a dark evergreen translucent backdrop. The hero uses layered artwork and a sky wash to preserve readable live text.

## Shapes

Controls and photo thumbnails use the control radius; the map, menu, and photo dialog use the surface radius. Small map and gallery controls use the compact-control radius. Project stories stay open, separated by straight rules. Circular destination dots and the mountain brand mark are recurring small signatures. Focus uses a 3px orange outline with a 5px offset and 3px corners; map pins use circular focus with zero offset.

## Components

**Primary actions and text links.** Filled evergreen actions carry warm paper text, a 52px minimum height, and the frontmatter padding. Primary hover deepens the fill; underlined text actions turn orange and have a 44px minimum height. Both retain the global focus treatment. No general animated button lift is implemented.

**Navigation.** The name and mountain mark anchor a pale sage header. Desktop links have compact semibold type and orange hover; the contact link has a fine border and rounded corners. The phone menu uses native `details`/`summary`, with a floating paper panel and sage item hover. There is no separate persistent active-page style.

**Content rows.** Project titles and context occupy the left column, evidence and story the right. Technology labels are plain slash-separated text, not pill chips. Writing lists share the restrained divider vocabulary. No input fields or reusable card library are implemented.

**Geographic travel selector.** Real map pins have 44px targets and text labels. Hover/selection turns the pin orange; selected labels use paper on orange. The parallel destination list supports selection without relying on map positioning. The overview control is an outlined transparent button. Trip content remains available without the scripted enhancement.

**Photo gallery.** Rounded 3:2 thumbnails open a native dialog; an orange outline marks hover. The paper dialog fits within the viewport and uses a compact evergreen close button. Empty galleries say "Photos coming soon"; failed photos expose a retry instruction. Actual trip photographs remain content, not decorative stock imagery.

**Ambient motion.** Cloud drift and campfire flicker run only when allowed by motion preference and the page/hero visibility controls. A labeled pause control persists the choice during scrolling. Map transitions last 500ms with `cubic-bezier(.16, 1, .3, 1)` when reduced motion is not requested; the decorative hiker does not delay ready content.

## Do's and Don'ts

### Do:

- Do use substantial evergreen headings, warm light surfaces, and restrained orange interaction accents.
- Do keep project evidence and prose readable through open rows, clear dividers, and the established content measures.
- Do retain visible keyboard focus, disclosure navigation, direct destination links, and reduced-motion behavior.
- Do use real geographic destination positions and honest empty galleries.

### Don't:

- Don't turn the open project rows into a general raised-card grid.
- Don't bake headings, credentials, or actions into illustration assets.
- Don't present placeholder travel images as Anton's photographs or imply a route or chronology that the content does not establish.
- Don't delay available content to play a decorative travel transition.
