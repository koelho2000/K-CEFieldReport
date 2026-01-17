
import React from 'react';
import { ReportState } from '../../types';
import { Map, Compass, Navigation, Globe, Upload } from 'lucide-react';

interface Props {
  report: ReportState;
  onUpdate: (updates: Partial<ReportState>) => void;
}

const EditorLocalizacao: React.FC<Props> = ({ report, onUpdate }) => {
  const handleChange = (field: keyof typeof report.location, value: string) => {
    onUpdate({
      location: { ...report.location, [field]: value }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onUpdate({
          location: { ...report.location, googleEarthImage: ev.target?.result as string }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <Map size={20} />
            <h3 className="font-bold">Coordenadas</h3>
          </div>
          <input 
            type="text" 
            placeholder="Latitude; Longitude"
            value={report.location.coords}
            onChange={(e) => handleChange('coords', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="bg-white p-6 border rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-green-600">
            <Navigation size={20} />
            <h3 className="font-bold">Altitude & Concelho</h3>
          </div>
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Altitude (m)"
              value={report.location.altitude}
              onChange={(e) => handleChange('altitude', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <input 
              type="text" 
              placeholder="Concelho"
              value={report.location.concelho}
              onChange={(e) => handleChange('concelho', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="bg-white p-6 border rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-orange-600">
            <Compass size={20} />
            <h3 className="font-bold">Orientação predominante</h3>
          </div>
          <select
            value={report.location.orientation}
            onChange={(e) => handleChange('orientation', e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option>Norte</option>
            <option>Nordeste</option>
            <option>Este</option>
            <option>Sudeste</option>
            <option>Sul</option>
            <option>Sudoeste</option>
            <option>Oeste</option>
            <option>Noroeste</option>
          </select>
        </div>
      </div>

      <div className="bg-white border p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-800">
            <Globe size={20} className="text-blue-500" />
            <h3 className="font-bold">Imagem Google Earth</h3>
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition font-semibold text-sm">
            <Upload size={16} /> Carregar Imagem
            <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
          </label>
        </div>
        
        <div className="bg-gray-100 min-h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 overflow-hidden">
          {report.location.googleEarthImage ? (
            <img src={report.location.googleEarthImage} className="w-full h-full object-cover" />
          ) : (
             "Screenshot do Google Earth não carregado"
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorLocalizacao;
