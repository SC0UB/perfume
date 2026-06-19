import { createRoot } from 'react-dom/client';

import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource-variable/hanken-grotesk';

import './styles/tokens.css';
import './styles/global.css';

import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
