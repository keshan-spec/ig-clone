import React, { useState } from 'react'
import { IPosts } from 'types';
import Lottie from "lottie-react";

export interface PostCardProps {
    post: IPosts;
}

// import likeAnimation from "./LikeAnim-lottie.json";
import likeAnimation2 from "./likeAnim-lottie-2.json";

export const PostCard: React.FC<PostCardProps> = ({
    post
}) => {
    const [isLiked, setIsLiked] = useState<string[]>(post.likes);

    const likePost = async (postId: string) => {
        // Optimistic UI
        if (isLiked.includes(postId)) {
            // unlike
            setIsLiked(isLiked.filter((id) => id !== postId));
        } else {
            setIsLiked([...isLiked, postId]);
        }
    }

    return (
        <div className="p-4 max-w-md w-full">
            <div className="rounded-xl bg-white dark:bg-zinc-900 h-full cursor-pointer"
                // double click to like
                onDoubleClick={() => likePost(post._id)}
            >
                <div className="flex items-center px-4 py-3">
                    <img className="h-8 w-8 rounded-full" src="https://picsum.photos/id/1027/150/150" />
                    <div className="ml-3">
                        <span className="text-sm font-semibold antialiased block leading-tight dark:text-white mb-1">{post.username}</span>
                        <span className="text-[.6rem] font-semibold antialiased block leading-tight dark:text-gray-400">{new Date(post.createdAt).toDateString()}</span>
                    </div>
                </div>
                {typeof post.imageUrl === 'string' && <img src={post.imageUrl} alt={post.description} className='w-full' />}
                <div className="flex items-center mx-4 mt-3 mb-2">
                    {/* like button */}
                    <div className="flex my-3 cursor-pointer relative" onClick={() => likePost(post._id)}>
                        {
                            isLiked.includes(post._id) ?
                                <Lottie animationData={likeAnimation2}
                                    loop={false}
                                    className="w-14 h-14 absolute -top-7 -left-[1.2rem]"
                                />
                                :
                                <i className="far fa-heart fa-lg text-black dark:text-white"></i>
                        }
                    </div>
                    <div className={`font-semibold text-sm dark:text-white ${isLiked.includes(post._id) ? "ml-8" : "ml-3"}`}>{post.likes.length} likes</div>
                </div>

                <div className="font-semibold text-sm mx-4 mt-2 mb-4 dark:text-white flex items-center pb-5">
                    <span className="text-sm mr-1.5 font-semibold antialiased leading-tight dark:text-white">{post.username}</span>
                    <span className="font-normal truncate antialiased leading-tight">
                        {post.description}
                    </span>
                </div>
            </div>
        </div>
    );
}