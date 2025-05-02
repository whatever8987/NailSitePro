import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BlogPost as BlogPostType, BlogComment as BlogCommentType, insertBlogCommentSchema } from "@shared/schema";
import { useParams, Link } from "wouter";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { queryClient, apiRequest } from "@/lib/queryClient";

type CommentFormData = z.infer<typeof insertBlogCommentSchema>;

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showCommentForm, setShowCommentForm] = useState(false);
  
  // Query blog post by slug
  const { data: post, isLoading: isPostLoading } = useQuery<BlogPostType>({
    queryKey: [`/api/blog/posts/slug/${slug}`],
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts/slug/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch blog post");
      return res.json();
    },
  });
  
  // Query approved comments for this post
  const { data: comments, isLoading: isCommentsLoading } = useQuery<BlogCommentType[]>({
    queryKey: [`/api/blog/posts/${post?.id}/comments`],
    queryFn: async () => {
      if (!post?.id) return [];
      const res = await fetch(`/api/blog/posts/${post.id}/comments`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json();
    },
    enabled: !!post?.id,
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
  
  // Comment form
  const form = useForm<CommentFormData>({
    resolver: zodResolver(insertBlogCommentSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
    },
  });
  
  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (data: CommentFormData) => {
      if (!post?.id) throw new Error("No post ID available");
      const response = await apiRequest("POST", `/api/blog/posts/${post.id}/comments`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('blog.commentSubmitted'),
        description: t('blog.commentPendingApproval'),
      });
      form.reset();
      setShowCommentForm(false);
    },
    onError: (error: Error) => {
      toast({
        title: t('blog.commentError'),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: CommentFormData) {
    addCommentMutation.mutate(data);
  }
  
  if (isPostLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('blog.postNotFound')}</h1>
        <p className="mb-8">{t('blog.postNotFoundDescription')}</p>
        <Link href="/blog">
          <Button>{t('blog.backToBlog')}</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="link" className="pl-0">{t('blog.backToBlog')}</Button>
          </Link>
        </div>
        
        {/* Post Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Badge variant="secondary">
              {post.category.charAt(0).toUpperCase() + post.category.slice(1).replace('_', ' ')}
            </Badge>
            <span className="text-sm text-gray-500">
              {formatDate(post.createdAt)}
            </span>
            <span className="text-sm text-gray-500">
              {post.viewCount} {t('blog.views')}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
          )}
          
          {post.coverImage && (
            <div className="rounded-lg overflow-hidden mb-8">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
        
        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-16">
          {/* Render markdown content */}
          <div dangerouslySetInnerHTML={{ 
            __html: post.content
              .replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>')
              .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
              .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
              .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
              .replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
              .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>')
              .replace(/\n\n/g, '</p><p>')
              .replace(/^(?!<h|<p|<\/p)(.+)$/gm, '$1<br/>')
              .replace(/^(.+)$/gm, '<p>$1</p>')
              .replace(/<p><\/p>/g, '')
          }} />
        </div>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-medium mb-3">{t('blog.tags')}</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Separator className="my-12" />
        
        {/* Comments Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {comments?.length || 0} {t('blog.comments')}
            </h2>
            {!showCommentForm && (
              <Button onClick={() => setShowCommentForm(true)}>
                {t('blog.addComment')}
              </Button>
            )}
          </div>
          
          {/* Comment Form */}
          {showCommentForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{t('blog.addComment')}</CardTitle>
                <CardDescription>
                  {t('blog.commentsModerated')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('blog.name')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('blog.namePlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('blog.email')}</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder={t('blog.emailPlaceholder')} {...field} />
                            </FormControl>
                            <FormDescription>
                              {t('blog.emailPrivacy')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('blog.comment')}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t('blog.commentPlaceholder')}
                              rows={5}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCommentForm(false)}
                      >
                        {t('blog.cancel')}
                      </Button>
                      <Button 
                        type="submit"
                        disabled={addCommentMutation.isPending}
                      >
                        {addCommentMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t('blog.submitComment')}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          
          {/* Comments List */}
          {isCommentsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {comment.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{comment.name}</CardTitle>
                        <CardDescription>
                          {formatDate(comment.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{t('blog.noComments')}</p>
              {!showCommentForm && (
                <Button 
                  variant="link" 
                  onClick={() => setShowCommentForm(true)}
                  className="mt-2"
                >
                  {t('blog.beFirstToComment')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}