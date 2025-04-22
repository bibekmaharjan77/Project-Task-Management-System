import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Providers } from './JotaiProvider.tsx'
import { ThemeProvider } from './components/Common/Context/theme-context.tsx'

createRoot(document.getElementById('root')!).render(
  <Providers>
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <App />
    </ThemeProvider>
  </Providers>,
)
