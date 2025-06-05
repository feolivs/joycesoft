import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Documents from './pages/Documents';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/documentos" element={<Documents />} />
              <Route path="/configuracoes" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
