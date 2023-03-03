// import './app.scss'
import AppEntry from './App.svelte'

const app = new AppEntry({
    target: document.querySelector('root'),
})

export default app;
export const App = AppEntry;