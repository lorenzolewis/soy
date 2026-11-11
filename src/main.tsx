import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Counterscale from '@counterscale/tracker'
import './index.css'
import App from './App.tsx'

Counterscale.init({
  siteId: 'lorenzo.soy',
  reporterUrl: 'https://counterscale.lorenzo-lewis.workers.dev/collect',
  autoTrackPageviews: true,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
