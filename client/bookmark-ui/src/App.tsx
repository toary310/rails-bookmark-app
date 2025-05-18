import { gql, useQuery } from '@apollo/client';
import styles from './App.module.css'; // Import CSS Modules

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

// Define a type for the bookmark data
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

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error :( {error.message}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bookmarks</h1>
      {data && data.bookmarks.length > 0 ? (
        <div className={styles.gridContainer}>
          {data.bookmarks.map((bookmark) => (
            <div className={styles.card} key={bookmark.id}>
              <div> {/* Content wrapper for flex spacing */}
                <h2 className={styles.cardTitle}>{bookmark.title || 'N/A'}</h2>
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className={styles.cardUrl}>
                  {bookmark.url}
                </a>
              </div>
              {bookmark.notes && (
                <p className={styles.cardNotes}>{bookmark.notes}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noBookmarks}>No bookmarks yet!</p>
      )}
    </div>
  );
}

export default App;
