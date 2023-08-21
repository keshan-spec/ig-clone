export interface IPosts {
    _id: string;
    description: string;
    imageUrl: string;
    createdAt: string;
    ownerId: number;
    username: string;
    likes: string[]
}