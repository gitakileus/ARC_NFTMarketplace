import Footer from 'components/Footer';
import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const routes = [
  { path: '/collections', component: lazy(() => import('pages/Collections/index')) },
  { path: '/collections/create', component: lazy(() => import('pages/Collections/Create')) },
  { path: '/collections/:url', component: lazy(() => import('pages/Collections/Detail')) },
  { path: '/collections/:url/edit', component: lazy(() => import('pages/Collections/Edit')) },
  { path: '/collections/id/:id', component: lazy(() => import('pages/Collections/Detail')) },
  { path: '/collections/id/:id/edit', component: lazy(() => import('pages/Collections/Edit')) },
  { path: '/explore', component: lazy(() => import('pages/Explore')) },
  { path: '/rewards', component: lazy(() => import('pages/Reward')) },
  { path: '/items/create', component: lazy(() => import('pages/NFTItem/Create')) },
  { path: '/items/:contract/:index', component: lazy(() => import('pages/NFTItem')) },
  { path: '/items/:contract/:index/edit', component: lazy(() => import('pages/NFTItem/Edit')) },
  { path: '/profile', component: lazy(() => import('pages/Profile/Overview')) },
  { path: '/profile/share/:wallet', component: lazy(() => import('pages/Profile/Overview/share')) },
  { path: '/profile/import', component: lazy(() => import('pages/Profile/ImportListing')) },
  { path: '/search', component: lazy(() => import('pages/SearchMobile')) },
  { path: '/', component: lazy(() => import('pages/Home')) },
];

function ComposeRoutes() {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        {routes.map(({ component, path }, i) => {
          const PageComponent = component;
          return <Route key={i} path={path} element={<PageComponent />} />;
        })}
      </Routes>
      <Footer />
    </Suspense>
  );
}

export default ComposeRoutes;
export { ComposeRoutes };
