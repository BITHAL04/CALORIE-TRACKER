import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Calendar, Tag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

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

interface PostItemProps {
  post: Post;
  onPostDeleted: () => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onPostDeleted }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  
  const isAuthor = user?.id === post.user_id;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
  const handleClick = () => {
    navigate(`/forum/post/${post._id}`);
  };
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      if (!user) {
        throw new Error("User is not authenticated");
      }
      
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
      
      onPostDeleted();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card 
      className="backdrop-blur-sm bg-white/90 border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-nexafit-navbar mb-2">{post.title}</h3>
          {isAuthor && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <p className="text-gray-600 mb-4">{truncateContent(post.content)}</p>
        
        <div className="flex flex-wrap items-center text-sm text-gray-500">
          <div className="flex items-center mr-4">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          
          <div className="flex items-center mr-4">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}</span>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <Tag className="h-4 w-4 mr-1" />
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-nexafit-accent/10 text-nexafit-accent hover:bg-nexafit-accent/20">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostItem;
