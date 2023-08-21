import { PostCardSkeleton } from '../components/Posts/PostCardSkeleton';
import { PostCard } from '../components/Posts/PostCard';
import { useObservedQuery } from '../hooks/useObservedQuery';
import { IPosts } from 'types';

export const Posts: React.FC = () => {
    const { data, hasNextPage, isLoading, isFetchingNextPage } = useObservedQuery();

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

            {isLoading && renderLoading()}
            {isFetchingNextPage && <div>Fetching...</div>}
            {!hasNextPage && <div>No more posts</div>}
        </>
    );
}