import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BlogPost as BlogPostType } from "@shared/schema";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Categories from the schema
const categories = [
  { label: "All Categories", value: "all" },
  { label: "Nail Art", value: "nail_art" },
  { label: "Business Tips", value: "business_tips" },
  { label: "Trends", value: "trends" },
  { label: "Self-Care", value: "self_care" },
  { label: "Tutorials", value: "tutorials" },
];

export default function Blog() {
  const { t } = useTranslation();
  const [category, setCategory] = useState("all");
  
  // Query blog posts with category filter
  const { data: posts, isLoading } = useQuery<BlogPostType[]>({
    queryKey: ["/api/blog/posts", { category }],
    queryFn: async () => {
      const url = new URL("/api/blog/posts", window.location.origin);
      if (category && category !== "all") {
        url.searchParams.append("category", category);
      }
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json();
    },
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Extract excerpt or create one from content
  const getExcerpt = (post: BlogPostType) => {
    if (post.excerpt) return post.excerpt;
    
    // Strip markdown and limit to ~150 chars
    const text = post.content.replace(/[#*_`]/g, '').split('\n').join(' ');
    return text.length > 150 ? text.substring(0, 147) + '...' : text;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('blog.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('blog.description')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('blog.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Post */}
        {posts && posts.length > 0 && posts.some(post => post.featured) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('blog.featuredPost')}</h2>
            {(() => {
              const featuredPost = posts.find(post => post.featured);
              if (!featuredPost) return null;
              
              return (
                <Card className="overflow-hidden">
                  {featuredPost.coverImage && (
                    <div className="h-72 overflow-hidden">
                      <img 
                        src={featuredPost.coverImage} 
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="secondary">{categories.find(c => c.value === featuredPost.category)?.label || featuredPost.category}</Badge>
                      <span className="text-sm text-gray-500">{formatDate(featuredPost.createdAt)}</span>
                    </div>
                    <CardTitle className="text-2xl">{featuredPost.title}</CardTitle>
                    <CardDescription>{getExcerpt(featuredPost)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {featuredPost.viewCount} {t('blog.views')}
                        </span>
                      </div>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        <Button variant="outline">{t('blog.readMore')}</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        )}

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts && posts.length > 0 ? (
            posts
              .filter(post => !post.featured)
              .map((post) => (
                <Card key={post.id} className="flex flex-col">
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.coverImage} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="secondary">{categories.find(c => c.value === post.category)?.label || post.category}</Badge>
                      <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                    </div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>{getExcerpt(post)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {post.viewCount} {t('blog.views')}
                        </span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline">{t('blog.readMore')}</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-lg text-gray-500">{t('blog.noPosts')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}