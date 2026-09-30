import type {Metadata} from 'next';
import '@fontsource/manrope/400.css';import '@fontsource/manrope/500.css';import '@fontsource/manrope/600.css';import '@fontsource/manrope/700.css';import '@fontsource/manrope/800.css';import '@fontsource/dm-sans/400.css';import '@fontsource/dm-sans/500.css';import '@fontsource/dm-sans/600.css';
import 'leaflet/dist/leaflet.css';import './globals.css';
export const metadata:Metadata={title:'Jan Seva — Local voices. Better communities.',description:'Solving for India: Hindi and English civic reporting, AI-assisted summaries and transparent infrastructure planning. Starting with a Uttar Pradesh demonstration pilot.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
