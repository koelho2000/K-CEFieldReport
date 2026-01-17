
import React from 'react';
import { ReportState, HourlyProfile } from '../../types';
import { Clock, Calendar } from 'lucide-react';

interface Props {
  title: string;
  profile: HourlyProfile;
  onChange: (newProfile: HourlyProfile) => void;
}

const EditorPerfis: React.FC<Props> = ({ title, profile, onChange }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ["2ª", "3ª", "4ª", "5ª", "6ª", "Sab", "Dom"];

  const toggleHour = (h: number) => {
    const newDaily = [...profile.daily];
    newDaily[h] = newDaily[h] === 1 ? 0 : 1;
    onChange({ ...profile, daily: newDaily });
  };

  const toggleDay = (d: number) => {
    const newWeekly = [...profile.weekly];
    newWeekly[d] = newWeekly[d] === 1 ? 0 : 1;
    onChange({ ...profile, weekly: newWeekly });
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-8">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-4 flex items-center gap-2">
        <Clock className="text-blue-600" /> {title}
      </h2>

      {/* Perfil Diário */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
            <Clock size={16} /> Perfil Diário (24h)
          </h3>
          <div className="flex gap-2">
            <button onClick={() => onChange({...profile, daily: Array(24).fill(1)})} className="text-[10px] bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">Ligar Tudo</button>
            <button onClick={() => onChange({...profile, daily: Array(24).fill(0)})} className="text-[10px] bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">Desligar Tudo</button>
          </div>
        </div>
        
        <div className="flex h-32 items-end gap-1 bg-slate-50 p-4 rounded-lg border border-dashed">
          {profile.daily.map((val, h) => (
            <div 
              key={h} 
              onClick={() => toggleHour(h)}
              className={`flex-1 transition-all cursor-pointer rounded-t-sm ${val === 1 ? 'bg-blue-500 hover:bg-blue-400 h-full' : 'bg-slate-200 hover:bg-slate-300 h-2'}`}
              title={`${h}h: ${val === 1 ? 'Ativo' : 'Inativo'}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-gray-400 font-bold px-4">
          <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>23h</span>
        </div>
      </div>

      {/* Perfil Semanal */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
          <Calendar size={16} /> Perfil Semanal (2ª a Dom)
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => (
            <button
              key={day}
              onClick={() => toggleDay(i)}
              className={`p-4 rounded-xl border-2 transition-all font-bold text-sm ${profile.weekly[i] === 1 ? 'bg-blue-600 border-blue-700 text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorPerfis;
