
import React from 'react';
import * as Icons from 'lucide-react';

interface Props {
  title: string;
  icon: string;
  children: React.ReactNode;
}

const EditorGeneric: React.FC<Props> = ({ title, icon, children }) => {
  const LucideIcon = (Icons as any)[icon];
  
  return (
    <div className="bg-white border rounded-xl p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b pb-4 mb-4">
        {LucideIcon && <LucideIcon className="text-blue-600" size={24} />}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default EditorGeneric;
