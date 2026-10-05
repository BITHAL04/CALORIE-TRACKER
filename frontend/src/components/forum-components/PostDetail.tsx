import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Edit, MessageSquare, Tag, Trash2, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from '../ui-components/parts/LoadingSpinner';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

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

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchPost = async () => {
    if (!postId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure the URL has the proper protocol
      const apiUrl = new URL(`/forum/posts/${postId}`, import.meta.env.VITE_API_URL).toString();
      
      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setPost(response.data);
    } catch (err) {
      console.error('Error fetching post:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'Failed to load post');
        toast({
          title: "Error",
          description: err.response.data.detail || 'Failed to load post',
          variant: "destructive"
        });
      } else {
        setError('An unexpected error occurred');
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPost();
  }, [postId]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleDelete = async () => {
    if (!post || !user) return;
    
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      // Ensure the URL has the proper protocol
      const apiUrl = new URL(`/forum/posts/${post._id}`, import.meta.env.VITE_API_URL).toString();
      
      // Pass user_id as a query parameter
      await axios.delete(`${apiUrl}?user_id=${user.id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      
      navigate('/forum');
    } catch (error) {
      console.error('Error deleting post:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
      }
      
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };
  
  const handleEdit = () => {
    navigate(`/forum/edit/${post?._id}`);
  };
  
  const handleCommentAdded = () => {
    // Refresh the post to update comment count
    fetchPost();
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
                onClick={() => fetchPost()} 
                variant="outline"
              >
                Try Again
              </Button>
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
  
  const isAuthor = user?.id === post.user_id;
  
  return (
    <div className="space-y-6">
      <Button 
        onClick={() => navigate('/forum')}
        variant="ghost"
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Forum
      </Button>
      
      {isLoading ? (
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardContent className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </CardContent>
        </Card>
      ) : error || !post ? (
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-red-500 text-center">
              <p>{error || "Post not found"}</p>
              <div className="mt-4 flex justify-center space-x-4">
                <Button 
                  onClick={() => fetchPost()} 
                  variant="outline"
                >
                  Try Again
                </Button>
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
      ) : (
        <>
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-nexafit-navbar">{post.title}</h1>
                
                {user?.id === post.user_id && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleEdit}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-4 mt-2">
                <User className="h-4 w-4 mr-1" />
                <span>Author ID: {post.user_id}</span>
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(post.created_at)}</span>
                
                {post.created_at !== post.updated_at && (
                  <span className="ml-2 text-gray-400">(edited)</span>
                )}
              </div>
              
              <div className="prose max-w-none mt-4 mb-6">
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 mt-6">
                  <Tag className="h-4 w-4 mr-1 text-gray-500" />
                  {post.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-nexafit-accent/10 text-nexafit-accent hover:bg-nexafit-accent/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-nexafit-navbar" />
              <h2 className="text-xl font-semibold text-nexafit-navbar">
                Comments ({post.comment_count})
              </h2>
            </div>
            
            {user ? (
              <CommentForm postId={post._id} onCommentAdded={handleCommentAdded} />
            ) : (
              <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
                <CardContent className="p-4 text-center text-gray-500">
                  Please sign in to leave a comment
                </CardContent>
              </Card>
            )}
            
            <CommentList postId={post._id} />
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetail;
