import { gql, useQuery } from '@apollo/client';
import './App.css';

// Define the GraphQL query
const GET_BOOKMARKS = gql`
  query GetBookmarks {
    bookmarks {
      id
      url
      title
      notes
    }
  }
`;

// Define a type for the bookmark data (optional but good practice)
interface Bookmark {
  id: string;
  url: string;
  title?: string | null;
  notes?: string | null;
}

interface BookmarksData {
  bookmarks: Bookmark[];
}

function App() {
  const { loading, error, data } = useQuery<BookmarksData>(GET_BOOKMARKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  return (
    <>
      <h1>My Bookmarks</h1>
      {data && data.bookmarks.length > 0 ? (
        <ul>
          {data.bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <p>
                <strong>Title:</strong> {bookmark.title || 'N/A'}
              </p>
              <p>
                <strong>URL:</strong> <a href={bookmark.url} target="_blank" rel="noopener noreferrer">{bookmark.url}</a>
              </p>
              {bookmark.notes && (
                <p>
                  <strong>Notes:</strong> {bookmark.notes}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookmarks yet!</p>
      )}
    </>
  );
}

export default App;
