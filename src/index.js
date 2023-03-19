import AuthProvider from "./app/context/CreateContextGlobal/Authprovider.js"
import ReactDOM from 'react-dom/client'
import App from './app/app.js'
import "./index.css"
import { Provider } from 'react-redux'
import { store } from './app/redux/store';

const root = ReactDOM.createRoot(document.getElementById("root"))

// Render Root 
root.render(
    <Provider store={store}>
        <AuthProvider>
            <App />
        </AuthProvider>
    </Provider>
)