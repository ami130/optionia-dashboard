import { IPages } from "../../../Pages/types/pagesType";
import { ICategories } from "../../Categories/types/categoriesType";
import { ITags } from "../../Tag/types/tagsType";

// ✅ enum/blog-type.enum.ts
export enum BlogType {
  ARTICLE = "Article",
  NEWS_ARTICLE = "NewsArticle",
  BLOG_POSTING = "BlogPosting",
}

// ✅ interfaces/blog.interface.ts
export interface IMetaData {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  metaImage?: string;
}

export interface IAuthor {
  id?: number;
  username: string;
  email: string;
  profileImage?: string;
}

export interface IBlog {
  id?: number;
  title: string;
  slug?: string;
  subtitle?: string;
  content: string;
  thumbnailUrl?: string;
  image?: string[];
  readingTime?: number;
  wordCount?: number;
  featured?: boolean;
  blogType?: BlogType;
  status?: string;
  metaData?: IMetaData;
  pageId: number;
  categoryId: number;
  authorIds?: number[];
  tagIds?: number[];

  // Populated relationships
  page?: IPages;
  category?: ICategories;
  authors?: IAuthor[];
  tags?: ITags[];

  createdBy?: IAuthor;
  createdAt?: Date;
  updatedAt?: Date;

  // Optional SEO metadata
  openGraph?: {
    title: string;
    description: string;
    url: string;
    type: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
  };
}

export const blogTypeOptions = [
  { value: "Article", label: "ARTICLE" },
  { value: "NewsArticle", label: "NEWS ARTICLE" },
  { value: "BlogPosting", label: "BLOG POSTING" },
];
