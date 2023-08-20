import React from 'react'

export const Page404: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full">
            <h1 className="text-3xl font-bold underline">404</h1>
            <div className="flex flex-col items-center justify-center w-1/3">
                <p className="text-2xl font-bold">Page Not Found</p>
            </div>
        </div>
    );
}
