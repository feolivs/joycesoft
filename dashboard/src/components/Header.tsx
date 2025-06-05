import { motion } from 'framer-motion';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export function Header() {
  const handleLogout = () => {
    // Implementar lógica de logout
    console.log('Logout');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed right-0 top-0 z-10 flex h-16 w-[calc(100%-16rem)] items-center justify-between bg-white px-6 shadow-sm"
    >
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-gray-800">Bem-vindo(a), Joyce</h2>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50"
      >
        <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
        <span>Sair</span>
      </button>
    </motion.header>
  );
} 