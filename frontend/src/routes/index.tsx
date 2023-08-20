// react router dom
import { AuthForm } from '../components/Auth';
import { BottomNavigation } from '../components/Navigation';
import { Page404 } from '../components/Page404/Page404';
import { PageHome } from '../components/PageHome';
import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'

export const pages = [
    { path: "/", exact: true, component: PageHome },
    { path: "/home", exact: true, component: PageHome },
    // posts
    // { path: "/posts", exact: true, component: PagePosts },
    // { path: "/posts/:id", exact: true, component: PagePost },
    // { path: "/posts/:id/edit", exact: true, component: PagePostEdit },
    // { path: "/posts/create", exact: true, component: PagePostCreate },
    // // users
    // { path: "/users", exact: true, component: PageUsers },
    // { path: "/users/:id", exact: true, component: PageUser },
    // { path: "/users/:id/edit", exact: true, component: PageUserEdit },

    // auth
    { path: "/auth", exact: true, component: AuthForm },

    // 404 for any other route
    { path: "*", component: Page404 },
];

const MyRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {pages.map(({ component, path }) => {
                    const Component = component;
                    return <Route key={path} element={<Component />} path={path} />;
                })}
                <Route element={<Page404 />} />
            </Routes>

            <BottomNavigation />
        </BrowserRouter>
    );
};

export default MyRoutes;
