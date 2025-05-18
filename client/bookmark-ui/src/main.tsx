import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
// import CssBaseline from '@mui/material/CssBaseline' // Removed CssBaseline import
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql', //  GraphQL endpoint
  cache: new InMemoryCache(),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      {/* <CssBaseline /> Removed CssBaseline component */}
      <App />
    </ApolloProvider>
  </StrictMode>,
)
