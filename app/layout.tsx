import type {Metadata} from 'next';
import '@fontsource/manrope/400.css';import '@fontsource/manrope/500.css';import '@fontsource/manrope/600.css';import '@fontsource/manrope/700.css';import '@fontsource/manrope/800.css';import '@fontsource/dm-sans/400.css';import '@fontsource/dm-sans/500.css';import '@fontsource/dm-sans/600.css';
import 'leaflet/dist/leaflet.css';import './globals.css';
export const metadata:Metadata={title:'Neer — Every street, heard',description:'Citizen-led drainage priorities for healthier neighbourhoods. A Uttar Pradesh demonstration.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
