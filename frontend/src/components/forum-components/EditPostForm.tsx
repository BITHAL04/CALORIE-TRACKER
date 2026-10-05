import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Tag, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from '../ui-components/parts/LoadingSpinner';

interface Post {
  _id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  comment_count: number;
  created_at: string;
  updated_at: string;
}

const EditPostForm: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchPost = async () => {
    if (!postId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = new URL(`/forum/posts/${postId}`, import.meta.env.VITE_API_URL).toString();
      
      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const fetchedPost = response.data;
      
      if (user?.id !== fetchedPost.user_id) {
        setError("You don't have permission to edit this post");
        return;
      }
      
      setPost(fetchedPost);
      setTitle(fetchedPost.title);
      setContent(fetchedPost.content);
      setTags(fetchedPost.tags || []);
    } catch (err) {
      console.error('Error fetching post:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'Failed to load post');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchPost();
    }
  }, [postId, user]);
  
  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (!trimmedTag) return;
    
    if (!tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    
    setCurrentTag('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Post title cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (!postId || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const apiUrl = new URL(`/forum/posts/${postId}?user_id=${user.id}`, import.meta.env.VITE_API_URL).toString();
      
      await axios.put(
        apiUrl,
        {
          title,
          content,
          tags
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      
      navigate(`/forum/post/${postId}`);
    } catch (error) {
      console.error('Error updating post:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
      }
      
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardContent className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }
  
  if (error || !post) {
    return (
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-red-500 text-center">
            <p>{error || "Post not found"}</p>
            <div className="mt-4 flex justify-center space-x-4">
              <Button 
                onClick={() => navigate('/forum')}
                variant="default"
                className="bg-nexafit-accent hover:bg-nexafit-accent/90 text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Forum
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Button 
        onClick={() => navigate(`/forum/post/${postId}`)}
        variant="ghost"
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Post
      </Button>
      
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-nexafit-navbar">Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-200 focus:border-nexafit-accent focus:ring-nexafit-accent"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-40 border-gray-200 focus:border-nexafit-accent focus:ring-nexafit-accent"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex">
                <Input
                  id="tags"
                  placeholder="Add a tag (press Enter)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-gray-200 focus:border-nexafit-accent focus:ring-nexafit-accent rounded-r-none"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-nexafit-accent hover:bg-nexafit-accent/90 text-white rounded-l-none"
                  disabled={isSubmitting || !currentTag.trim()}
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-nexafit-accent/10 text-nexafit-accent px-3 py-1 rounded-full flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-nexafit-accent hover:text-nexafit-accent/70"
                        disabled={isSubmitting}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-nexafit-accent hover:bg-nexafit-accent/90 text-white"
                disabled={isSubmitting || !title.trim() || !content.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPostForm;
