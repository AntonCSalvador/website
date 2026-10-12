type Post = { data: { draft: boolean; publicationDate: Date } };

export function publishedPosts<T extends Post>(posts: T[]): T[] {
  return posts.filter((post) => !post.data.draft)
    .sort((a, b) => b.data.publicationDate.getTime() - a.data.publicationDate.getTime());
}
