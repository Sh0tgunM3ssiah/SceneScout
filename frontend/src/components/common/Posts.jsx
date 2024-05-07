import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, sceneId, username, userId }) => {
    const getPostEndpoint = () => {
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/posts/all`; // Default URL
        switch (feedType) {
            case "forYou":
                url += sceneId ? `?sceneId=${sceneId}` : ""; // Append sceneId if present
                break;
            case "following":
                url = `${import.meta.env.VITE_BACKEND_URL}/api/posts/following`;
                break;
            case "posts":
                url = `${import.meta.env.VITE_BACKEND_URL}/api/posts/user/${username}`;
                break;
            case "likes":
                url = `${import.meta.env.VITE_BACKEND_URL}/api/posts/likes/${userId}`;
                break;
        }
        return url;
    };

    const POST_ENDPOINT = getPostEndpoint();

    const {
        data: posts,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["posts", feedType, sceneId], // Include sceneId in the query key
        queryFn: async () => {
            try {
                const res = await fetch(POST_ENDPOINT, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    useEffect(() => {
        refetch();
    }, [feedType, sceneId, refetch]);

    return (
        <>
            {(isLoading || isRefetching) && <PostSkeleton count={3} />}
            {(!isLoading && !isRefetching && posts?.length === 0) && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
            {(!isLoading && !isRefetching && posts) && posts.map((post) => <Post key={post._id} post={post} />)}
        </>
    );
};

export default Posts;
