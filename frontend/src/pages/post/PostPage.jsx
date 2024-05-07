import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import Post from "../../components/common/Post";

const PostPage = () => {
    const { id } = useParams(); // Get the post ID from the URL
    const { data: post, isLoading, error } = useQuery({
        queryKey: ["post", id], // Use a unique key for caching this specific post
        queryFn: async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Something went wrong");
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    if (error) {
        toast.error("Failed to fetch the post: " + error.message);
    }

    return (
        <>
            <div className='flex-[4_4_0] border-r border-gray-700 min-h-screen pt-16 md:pt-0'>
                <div className='flex justify-between items-center p-4 border-b border-gray-700'>
                    <p className='font-bold'>Post</p>
                </div>
                {isLoading ? (
                    <div className='flex justify-center h-full items-center'>
                        <LoadingSpinner size='lg' />
                    </div>
                ) : (
                    <div>
                        {post && <Post post={post} />}
                    </div>
                )}
            </div>
        </>
    );
};

export default PostPage;