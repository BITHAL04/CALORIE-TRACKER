
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { createComment } from '@/utils/forumApi';

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Comment content cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to comment",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createComment(postId, content, user.id);
      
      setContent('');
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
      
      onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
      
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-3 min-h-24 border-gray-200 focus:border-nexafit-accent focus:ring-nexafit-accent"
            disabled={isSubmitting}
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit"
              className="bg-nexafit-accent hover:bg-nexafit-accent/90 text-white"
              disabled={isSubmitting || !content.trim()}
            >
              <SendHorizontal className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommentForm;
