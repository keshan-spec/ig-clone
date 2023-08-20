import React, { useState } from 'react'

export const AuthForm: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    const renderLogin = () => {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full">
                <h1 className="text-3xl font-bold underline">Login</h1>
                <div className="flex flex-col items-center justify-center w-1/3">
                    <input className="w-full mb-2 p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500" placeholder="Email" />
                    <input className="w-full mb-2 p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500" placeholder="Password" />
                    <button className="w-full mb-2 p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500">Login</button>
                    <button className="w-full mb-2 p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500" onClick={() => setIsLogin(false)}>Register</button>
                </div>
            </div>
        );
    }

    const renderRegister = () => {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full">
                <h1 className="text-3xl font-bold underline">Register</h1>
                <div className="flex flex-col items-center justify-center w-1/3">
                    <input className="w-full mb-2 p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500" placeholder="Email" />
                    <input className="w-full mb-2 p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500" placeholder="Password" />
                    <input className="w-full mb-2 p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500" placeholder="Confirm Password" />
                    <button className="w-full mb-2 p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500">Register</button>
                    <button className="w-full mb-2 p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500"
                        onClick={() => setIsLogin(true)}>Login</button>
                </div>
            </div >
        );

    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full">
            {isLogin ? renderLogin() : renderRegister()}
        </div>
    );
}