import { IPosts } from 'types';

import { useObservedQuery } from '../hooks/useObservedQuery';
import { PostCardSkeleton } from '../components/Posts/PostCardSkeleton';
import { PostCard } from '../components/Posts/PostCard';

import noPosts from '../components/Posts/noPosts.json';
import Lottie from 'lottie-react';

export const Posts: React.FC = () => {
    const { data, isLoading, isFetchingNextPage, error } = useObservedQuery();

    const renderLoading = () => {
        // 3 post card skeletons
        return (
            <>
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
            </>
        );
    }

    const renderFetching = () => {
        return (
            <div className="flex justify-center items-center mb-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
        );
    }

    if (error instanceof Error) return (
        <div className="text-center text-red-500">
            <h1>Something went wrong.</h1>
        </div>
    );
    console.log(data);


    return (
        <>
            {(data && data.pages) && data.pages.map((posts: { data: IPosts[] }) => {
                return posts.data.map((p: IPosts) => {
                    return <PostCard key={p._id} post={
                        {
                            _id: p._id,
                            username: p.username,
                            description: p.description,
                            imageUrl: p.imageUrl,
                            likes: p.likes || [],
                            createdAt: p.createdAt,
                            ownerId: p.ownerId
                        }
                    } />
                })
            })}

            {/* no posts */}
            {(!data || data.pages[0].data.length === 0) && !isLoading && (
                <div className="text-center text-white/80 text-4xl font-semibold">
                    <h1>No posts found</h1>
                    <Lottie
                        autoPlay={true}
                        loop={true}
                        animationData={noPosts}
                        className='w-1/2 mx-auto pr-20'
                    />
                </div>
            )}

            {isLoading && renderLoading()}
            {isFetchingNextPage && renderFetching()}
        </>
    );
}