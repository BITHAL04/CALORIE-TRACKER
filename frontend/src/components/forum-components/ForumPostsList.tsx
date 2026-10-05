import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CreatePostModal from './CreatePostModal';
import PostItem from './PostItem';
import { MessageSquare, Calendar, Tag } from 'lucide-react';

interface ForumPost {
  _id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  comment_count: number;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  items: ForumPost[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface ForumPostsListProps {
  selectedTag: string | null;
}

const ForumPostsList: React.FC<ForumPostsListProps> = ({ selectedTag }) => {
  const { isSignedIn, user } = useUser();
  const { toast } = useToast();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('size', '10');
      
      if (selectedTag) {
        params.append('tag', selectedTag);
      }
      
      // Ensure the URL has the proper protocol
      const apiUrl = new URL(`/forum/posts?${params.toString()}`, import.meta.env.VITE_API_URL).toString();
      
      const response = await axios.get<PaginatedResponse>(apiUrl, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setPosts(response.data.items);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load forum posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedTag]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostDeleted = () => {
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-nexafit-navbar">
          {selectedTag ? `Posts tagged with "${selectedTag}"` : "Recent Discussions"}
        </h2>
        <Button 
          onClick={() => {
            if (!isSignedIn) {
              toast({
                title: "Authentication Required",
                description: "You must be logged in to create a post",
                variant: "destructive"
              });
              return;
            }
            setIsCreateModalOpen(true);
          }}
          className="bg-nexafit-accent hover:bg-nexafit-accent/90"
        >
          Start Discussion
        </Button>
      </div>

      {loading ? (
        // Loading skeleton
        Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-1/4" />
            </CardFooter>
          </Card>
        ))
      ) : posts.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No posts found.</p>
          {selectedTag && (
            <p className="mt-2">
              Try selecting a different tag or{" "}
              <button 
                onClick={() => {
                  if (!isSignedIn) {
                    toast({
                      title: "Authentication Required",
                      description: "You must be logged in to create a post",
                      variant: "destructive"
                    });
                    return;
                  }
                  setIsCreateModalOpen(true);
                }}
                className="text-nexafit-accent hover:underline"
              >
                start a new discussion
              </button>
            </p>
          )}
        </Card>
      ) : (
        <>
          {posts.map((post) => (
            <PostItem 
              key={post._id} 
              post={post} 
              onPostDeleted={handlePostDeleted} 
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ))
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="flex items-center px-3">...</span>
                    )}
                    <Button
                      variant={page === currentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className={page === currentPage ? "bg-nexafit-accent hover:bg-nexafit-accent/90" : ""}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={fetchPosts}
      />
    </div>
  );
};

export default ForumPostsList;
