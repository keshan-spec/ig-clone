import { Posts } from "../../pages/Posts";

export const PageHome: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen h-full  py-2 w-full bg-zinc-950">
            <Posts />
        </div>
    );
}