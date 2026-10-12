export function initializeGalleries(): void {
  for (const gallery of document.querySelectorAll<HTMLElement>('[data-photo-gallery]')) {
    const dialog = gallery.querySelector<HTMLDialogElement>('dialog');
    const image = gallery.querySelector<HTMLImageElement>('.photo-enlarged');
    const caption = gallery.querySelector<HTMLElement>('.photo-caption');
    const error = gallery.querySelector<HTMLElement>('.photo-error');
    if (!dialog || !image || !caption || !error || typeof dialog.showModal !== 'function') continue;
    let opener: HTMLAnchorElement | null = null;
    const observer = new MutationObserver(() => {
      if (gallery.closest('[hidden]')) dialog.close();
    });

    image.addEventListener('error', () => { image.hidden = true; error.hidden = false; });
    dialog.querySelector('button')!.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      observer.disconnect();
      image.removeAttribute('src');
      if (opener?.isConnected && !opener.closest('[hidden]')) opener.focus({ preventScroll: true });
    });
    for (const link of gallery.querySelectorAll<HTMLAnchorElement>('.photo-link')) {
      link.addEventListener('click', (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
        const thumbnail = link.querySelector('img');
        const source = link.getAttribute('href')?.trim();
        if (!thumbnail || !source || gallery.closest('[hidden]')) return;
        event.preventDefault();
        opener = link;
        image.hidden = false;
        error.hidden = true;
        image.alt = thumbnail.alt;
        image.width = thumbnail.width;
        image.height = thumbnail.height;
        caption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent ?? '';
        caption.hidden = !caption.textContent;
        image.src = source;
        dialog.showModal();
        const panel = gallery.closest('[data-trip-panel]');
        if (panel) observer.observe(panel, { attributes: true, attributeFilter: ['hidden'] });
      });
    }
  }
}
