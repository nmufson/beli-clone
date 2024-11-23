import BookIcon from './components/icons/BookIcon';
import Book from './pages/Book/Book';
import Layout from './components/Layout/Layout';
import Feed from './pages/Feed/Feed';
import Search from './pages/Search/Search';
import LogIn from './pages/LogIn/LogIn';
import SignUp from './pages/SignUp/SignUp';
import Home from './pages/Home/Home';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        // should this depend on whether logged in or not?
        index: true,
        element: <Feed />,
      },
      {
        path: 'feed/',
        element: <Feed />,
      },
      {
        path: 'search/',
        element: <Search />,
      },
      {
        path: 'book/:bookId/:slug',
        element: <Book />,
      },
      {
        path: 'login/',
        element: <LogIn />,
      },
      {
        path: 'signup/',
        element: <SignUp />,
      },
      {
        path: 'home/',
        element: <Home />,
      },
    ],
  },
]);

export default router;
