export interface ToastProps {
    message: string;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {

    return (
        <div
            id="toast-simple"
            className="fixed top-10 left-0 right-0 z-50 mx-auto w-full max-w-xs p-4 space-x-4 text-zinc-500 bg-white divide-x 
        divide-zinc-200 rounded-lg shadow dark:text-zinc-400 dark:divide-zinc-700 space-x 
        dark:bg-zinc-800 transition-opacity duration-300 from-opacity-0 to-opacity-100"
            role="alert"
        >
            <div className="pl-4 text-sm font-normal">{message}</div>
        </div>
    );

};
