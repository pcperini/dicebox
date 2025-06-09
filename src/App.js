import { Router, Link } from "wouter";
import './App.css';

import PageRouter from "./components/PageRouter";

function App() {
    return (
        <Router>
            <main role="main" className="wrapper">
                <div className="content">
                    {/* Router specifies which component to insert here as the main content */}
                    <PageRouter />
                </div>
            </main>
            {/* Footer links to Home and About, Link elements matched in router.jsx */}
            <footer className="footer">
                <div className="links">
                    <Link href="/d20">D20</Link>
                    <span className="divider">|</span>
                    <Link href="/pbta">PbtA</Link>
                    <span className="divider">|</span>
                    <Link href="/kids">Kids On</Link>
                    <span className="divider">|</span>
                    <Link href="/resistance">Resistance</Link>
                </div>
            </footer>
        </Router>
    );
}

export default App;
