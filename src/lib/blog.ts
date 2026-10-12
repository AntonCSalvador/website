import { getCollection } from 'astro:content';
import { publishedPosts } from './publication';

const files = import.meta.glob('/src/content/blog/**/*.md');

export async function getBlogPosts() {
  return Object.keys(files).length ? publishedPosts(await getCollection('blog')) : [];
}
