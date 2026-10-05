
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from '../ui-components/parts/LoadingSpinner';
import CommentItem from './CommentItem';
import Pagination from './Pagination';
import { fetchComments } from '@/utils/forumApi';

interface Comment {
  _id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface CommentListProps {
  postId: string;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  const loadComments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchComments<Comment>(postId, page);
      setComments(response.items || []);
      setTotalPages(response.pages || 1);
    } catch (err) {
      console.error('Error fetching comments:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadComments();
  }, [postId, page]);
  
  if (isLoading && page === 1) {
    return (
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardContent className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="text-red-500 text-center">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (comments.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardContent className="p-4 text-center text-gray-500">
          No comments yet. Be the first to comment!
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem 
          key={comment._id} 
          comment={comment} 
          onCommentDeleted={loadComments} 
        />
      ))}
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={setPage} 
        />
      )}
    </div>
  );
};

export default CommentList;
