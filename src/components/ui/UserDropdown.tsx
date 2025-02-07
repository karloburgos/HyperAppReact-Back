import React from 'react';
import { UserCog, HelpCircle, Settings, LogOut } from 'lucide-react';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { icon: UserCog, label: 'Cambiar rol', action: () => console.log('Change role clicked') },
    { icon: HelpCircle, label: 'Ayuda / Soporte', action: () => console.log('Help clicked') },
    { icon: Settings, label: 'Configuración', action: () => console.log('Settings clicked') },
    { icon: LogOut, label: 'Cerrar sesión', action: () => console.log('Logout clicked') },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <img
          src="https://media.istockphoto.com/id/1320651997/photo/young-woman-close-up-isolated-studio-portrait.jpg?s=612x612&w=0&k=20&c=lV6pxz-DknISGT2jjiSvUmSaw0hpMDf-dBpT8HTSAUI="
          alt="User avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="text-left">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Marisela Félix
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            Administrador
          </span>
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-2">
              {menuItems.map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={() => {
                    action();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}