
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { deleteComment, formatDate } from '@/utils/forumApi';

interface Comment {
  _id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface CommentItemProps {
  comment: Comment;
  onCommentDeleted: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onCommentDeleted }) => {
  const { user } = useUser();
  const { toast } = useToast();
  
  const isAuthor = user?.id === comment.user_id;
  const wasEdited = comment.created_at !== comment.updated_at;
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      if (!user) {
        throw new Error("User is not authenticated");
      }
      
      await deleteComment(comment._id, user.id);
      
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
      
      onCommentDeleted();
    } catch (error) {
      console.error('Error deleting comment:', error);
      
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <User className="h-4 w-4 mr-1" />
            <span className="font-medium">User: {comment.user_id}</span>
            <span className="mx-2">•</span>
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(comment.created_at, true)}</span>
            
            {wasEdited && (
              <span className="ml-2 text-gray-400">(edited)</span>
            )}
          </div>
          
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
        
        <div className="mt-2">
          {comment.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-2">{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentItem;
