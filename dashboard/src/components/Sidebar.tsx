import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const links = [
  { to: '/', icon: HomeIcon, label: 'Dashboard' },
  { to: '/clientes', icon: UserGroupIcon, label: 'Clientes' },
  { to: '/documentos', icon: DocumentTextIcon, label: 'Documentos' },
  { to: '/configuracoes', icon: Cog6ToothIcon, label: 'Configurações' },
];

export function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-white shadow-lg"
    >
      <div className="flex h-16 items-center justify-center border-b">
        <h1 className="text-xl font-bold text-primary-600">ContaSys</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  );
} 