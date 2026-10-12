---
name: "Anton Salvador"
description: "A quiet personal engineering website with monochrome ASCII photography."
colors:
  ink: "#252332"
  ink-soft: "#605c6e"
  paper: "#faf9f6"
  cream: "#f0eef3"
  orange: "#6751a5"
  line: "#dedbe3"
typography:
  display:
    fontFamily: "'Bricolage Grotesque Variable', sans-serif"
    fontSize: "clamp(2rem, 3vw, 2.65rem)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-.025em"
  headline:
    fontFamily: "'Bricolage Grotesque Variable', sans-serif"
    fontSize: "1.45rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-.025em"
  title:
    fontFamily: "'Bricolage Grotesque Variable', sans-serif"
    fontSize: "1.12rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-.025em"
  body:
    fontFamily: "'Bricolage Grotesque Variable', sans-serif"
    fontSize: "1rem"
    lineHeight: 1.65
  label:
    fontFamily: "'Bricolage Grotesque Variable', sans-serif"
    fontSize: ".88rem"
rounded:
  surface: "8px"
  compact-control: "6px"
spacing:
  column: "3rem"
  column-tablet: "2rem"
  section: "2.6rem"
  section-mobile: "1.8rem"
components:
  text-link:
    textColor: "{colors.orange}"
    typography: "{typography.label}"
  motion-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    padding: ".5rem 0"
  map-overview:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.compact-control}"
    padding: ".45rem .75rem"
  photo-close:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.compact-control}"
    padding: ".5rem .85rem"
---

# Design System: Anton Salvador

## Overview

**Creative North Star: "The quiet personal engineering website"**

Off-white ground, charcoal text, muted violet links, and compact sans typography establish a relaxed, simple, technical identity. Thin dividers and open columns give real engineering work and personal interests room without oversized slogans or decorative cards. This approved world replaces the illustrated outdoor identity.

Monochrome ASCII photography supplies the distinctive personal texture. Its movement is restrained and optional; live text, links, and content remain readable independently. Homepage composition belongs to the approved surface brief.

**Key Characteristics:**

- Compact charcoal typography and muted violet interaction accents.
- Open columns, fine dividers, and flat off-white surfaces.
- Personal photographs expressed as character data with optional motion.

## Colors

The frontmatter is the normative palette extracted from the shared stylesheet.

### Primary

- **Muted violet:** links, keyboard focus, navigation hover, and selected map pins. The existing CSS variable name `--orange` now holds violet; it does not describe the current hue.

### Neutral

- **Charcoal ink:** headings, brand name, content, and filled photo-close controls.
- **Soft charcoal:** supporting copy, navigation, metadata, and animation controls.
- **Off-white paper:** page ground, navigation panel, map land, and photo dialog.
- **Pale lilac:** code blocks, thumbnail placeholders, and mobile menu hover.
- **Quiet boundary:** shared header, section, and column dividers.

The retained map and gallery contain local map-water, boundary, label, shadow, and backdrop colors, including some earlier green details. These are component rendering details, not additional global brand accents.

## Typography

All page typography uses self-hosted Bricolage Grotesque Variable from `@fontsource-variable/bricolage-grotesque`, with a sans-serif fallback. Moderate weight and slightly tight headings support conversational, compact copy. The frontmatter records the base hierarchy; paragraphs cap at 70ch.

The introduction uses the display role for Anton's name, with supporting copy at .94rem and a 46ch measure. Project stories use .93rem; metadata and technology lists step down to .82rem and .76rem. Article summaries use 1.18rem with a 1.5 line height. The ASCII artwork alone uses bold monospace glyphs; this is an image rendering technique, not a second editorial typeface.

## Layout

Shared content and the header cap at 1120px with 4rem total horizontal subtraction. The introduction is a centered split grid with .9fr copy and 1.1fr artwork, a 3.5rem gap, and 3.8rem/3rem vertical padding. Its artwork has a 4:3 aspect ratio.

Projects, community/writing, and gaming use equal columns, the column gap token, and fine vertical dividers. Shared sections use the frontmatter spacing with a top divider and 2rem inner top padding. Article and blog containers cap at 850px; article headings cap at 24ch.

At 900px, introduction and content gaps reduce to 2rem. At 680px, horizontal subtraction becomes 2.5rem, introduction and content grids stack, vertical dividers become horizontal rules, and section inner top padding becomes 1.5rem. Intro text precedes artwork. Navigation becomes a native disclosure menu, contact content stacks, and the footer wraps.

The retained geographic atlas uses a 2.15fr map beside a narrower trip panel, adjusts to 1.9fr at 900px, and stacks at 680px. Its map changes from 1000:760 to 1:1.03 on phones. Destination links become two columns; photo thumbnails use an auto-fit grid with a 140px minimum constrained to available width.

## Elevation & Depth

The shared interface is flat. Fine rules and pale surface changes convey structure; neither the header nor the mobile menu has a shadow. The retained travel component confines shadows to destination dots and the enlarged-photo dialog, whose translucent backdrop supplies modal depth. Exact local shadows are recorded in the sidecar. ASCII glyph displacement is the introduction's only animated depth cue.

## Shapes

Shared dividers are straight and thin. Map windows, mobile menus, photo thumbnails, and photo dialogs use the surface radius; map overview and photo-close controls use the compact-control radius. Destination dots remain circular. Global keyboard focus uses a 3px violet outline, a 5px offset, and 3px corners; map pins use circular focus with zero offset.

## Components

**Text actions and navigation.** Violet underlined links use a 44px minimum height where implemented as text actions; hover thickens the underline. Desktop navigation uses .84rem soft charcoal text with violet underline on hover. The phone disclosure opens an off-white panel with a thin boundary and pale lilac item hover. Primary homepage actions are text links.

**Open content columns.** Compact project headings precede role, story, outcome, and plain slash-separated technologies. Community and writing share the same open-column vocabulary. Honest empty writing content remains visible. There is no reusable card or input library.

**ASCII photograph.** Seven supplied photographs become precomputed 144-column by 108-row tone strings. A 840 by 630 Canvas2D surface renders monochrome glyphs with a soft diagonal disassembly/reassembly wave: 1800ms transition and 3600ms hold, drawing at up to 30fps during transitions. Play/pause and next-photo controls have 44px targets. Reduced motion disables automatic animation and allows immediate manual advancement; scrolling offscreen and hidden tabs pause animation. Without JavaScript or a canvas context, the first photograph remains visible as accessible SVG text. Only derived character data ships, not the private originals or their metadata.

**2026 geographic travel selector.** The functioning map retains real destination positions, 44px pin targets, violet hover/selection, direct destination links, overview control, and decorative hiker. Map transitions use 500ms with `cubic-bezier(.16, 1, .3, 1)` only when motion is allowed. Trip content stays available without scripted enhancement, and decoration does not delay ready content.

**Photo gallery.** Rounded 3:2 thumbnails open a native off-white dialog with a charcoal close action. Hover uses a violet outline. Empty galleries say "Photos coming soon"; failed photos expose a retry instruction. Photographs remain content, not decorative stock imagery.

## Do's and Don'ts

### Do:

- Do use compact charcoal headings, off-white surfaces, and muted violet links.
- Do preserve readable content measures, open columns, and fine dividers.
- Do retain visible keyboard focus, disclosure navigation, manual photo controls, and reduced-motion behavior.
- Do keep ASCII data separate from private source photographs and retain the SVG text fallback.
- Do use real geographic destination positions and honest empty galleries.

### Don't:

- Don't restore the discarded illustrated outdoor hero or oversized slogans.
- Don't turn open content columns into a raised-card grid.
- Don't bake biography, credentials, or actions into artwork.
- Don't present placeholder travel images as Anton's photographs or infer routes or chronology.
- Don't delay available content to play a decorative transition.
