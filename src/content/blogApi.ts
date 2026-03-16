export type BlogPost = {
  slug: string;
  title: string;
  url: string;
  date: string | null;
  summary: string;
  html: string;
};

export type BlogData = {
  feedUrl: string;
  updatedAt: string;
  posts: BlogPost[];
};

export async function fetchBlog(): Promise<BlogData> {
  const res = await fetch("/api/blog");
  if (!res.ok) throw new Error(`Blog API error: ${res.status}`);
  return res.json() as Promise<BlogData>;
}
