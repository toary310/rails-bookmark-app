import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
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
      <App />
    </ApolloProvider>
  </StrictMode>,
)
