import assert from 'node:assert/strict';
import { test } from 'node:test';
import { publishedPosts } from '../src/lib/publication.ts';

// Removing the draft filter would expose an unpublished post to both consumers.
test('unpublished posts are excluded and published posts are newest first', () => {
  const posts = [
    { id: 'older', data: { draft: false, publicationDate: new Date('2026-01-01') } },
    { id: 'private', data: { draft: true, publicationDate: new Date('2026-10-01') } },
    { id: 'newer', data: { draft: false, publicationDate: new Date('2026-08-01') } },
  ];
  assert.deepEqual(publishedPosts(posts).map((post) => post.id), ['newer', 'older']);
  assert.deepEqual(publishedPosts([]), []);
});
