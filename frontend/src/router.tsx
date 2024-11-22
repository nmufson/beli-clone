import BookIcon from './components/icons/BookIcon';
import Book from './pages/Book/Book';
import Layout from './components/Layout/Layout';
import Feed from './pages/Feed/Feed';
import Search from './pages/Search/Search';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
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
    ],
  },
]);

export default router;
