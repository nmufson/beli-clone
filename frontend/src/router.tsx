import BookIcon from './components/icons/BookIcon';
import Book from './pages/Book/Book';
import Layout from './components/Layout/Layout';
import Feed from './pages/Feed/Feed';
import Search from './pages/Search/Search';
import LogIn from './pages/LogIn/LogIn';
import SignUp from './pages/SignUp/SignUp';
import Home from './pages/Home/Home';
import UserProfile from './pages/UserProfile/UserProfile';

import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,

    children: [
      {
        // have backend redirect to /feed if logged in
        index: true,
        element: <Home />,
      },
      {
        path: 'home/',
        element: <Home />,
      },
      {
        path: 'feed/:type',
        element: <Feed />,
      },
      {
        path: 'search/:authorSlug',
        element: <Search />,
      },
      {
        path: 'book/:bookIdParam/:slug',
        element: <Book />,
      },
      {
        path: 'user/:userIdParam/:slug',
        element: <UserProfile />,
      },
      {
        path: 'login/',
        element: <LogIn />,
      },
      {
        path: 'signup/',
        element: <SignUp />,
      },
    ],
  },
]);

export default router;
