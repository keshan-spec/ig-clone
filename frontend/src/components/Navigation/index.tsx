export const BottomNavigation: React.FC = () => {
    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-20 bg-zinc-900 ">
            <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-zinc-50 dark:hover:bg-zinc-800 group">
                    <svg className="w-5 h-5 mb-2 text-zinc-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-500">Home</span>
                </button>
                <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-zinc-50 dark:hover:bg-zinc-800 group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-5 h-5 mb-2 text-zinc-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-500" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-500">Post</span>
                </button>
                <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-zinc-50 dark:hover:bg-zinc-800 group">
                    <svg className="w-5 h-5 mb-2 text-zinc-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
                    </svg>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-500">Settings</span>
                </button>
                <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-zinc-50 dark:hover:bg-zinc-800 group">
                    <svg className="w-5 h-5 mb-2 text-zinc-500 dark:text-zinc-400 group-hover:tesxt-red-600 dark:group-hover:text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-500">Profile</span>
                </button>
            </div>
        </div>

    );
}