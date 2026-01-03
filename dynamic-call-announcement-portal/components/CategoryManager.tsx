
import React, { useState } from 'react';
import { Category, CallType, FieldDefinition, FieldType } from '../types';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (cat: Category) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAddCategory }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState<Partial<Category>>({
    type: CallType.FACULTY,
    fields: []
  });

  const handleAddField = () => {
    const field: FieldDefinition = {
      id: `f-${Date.now()}`,
      name: `field_${newCat.fields?.length || 0}`,
      label: 'New Field',
      type: FieldType.TEXT,
      required: false
    };
    setNewCat(prev => ({ ...prev, fields: [...(prev.fields || []), field] }));
  };

  const handleUpdateField = (id: string, updates: Partial<FieldDefinition>) => {
    setNewCat(prev => ({
      ...prev,
      fields: prev.fields?.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  };

  const handleSave = () => {
    if (newCat.name && newCat.fields?.length) {
      onAddCategory({
        id: `cat-${Date.now()}`,
        name: newCat.name,
        type: newCat.type || CallType.FACULTY,
        description: newCat.description || '',
        fields: newCat.fields
      });
      setIsAdding(false);
      setNewCat({ type: CallType.FACULTY, fields: [] });
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Category Definitions</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-all shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          Add New Category
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-indigo-200 shadow-lg animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
              <input 
                value={newCat.name || ''} 
                onChange={e => setNewCat({...newCat, name: e.target.value})}
                placeholder="e.g. A.2 Event Grant"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Call Type</label>
              <select 
                value={newCat.type} 
                onChange={e => setNewCat({...newCat, type: e.target.value as CallType})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value={CallType.FACULTY}>Faculty</option>
                <option value={CallType.STUDENT}>Student</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-slate-800">Fields Schema</h4>
              <button 
                onClick={handleAddField}
                className="text-indigo-600 text-sm hover:underline font-medium"
              >
                + Add Data Field
              </button>
            </div>
            
            <div className="space-y-3">
              {newCat.fields?.map(field => (
                <div key={field.id} className="flex gap-3 items-end p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Label</label>
                    <input 
                      value={field.label} 
                      onChange={e => handleUpdateField(field.id, { label: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Type</label>
                    <select 
                      value={field.type} 
                      onChange={e => handleUpdateField(field.id, { type: e.target.value as FieldType })}
                      className="w-full px-2 py-1 border rounded"
                    >
                      {Object.values(FieldType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <input 
                      type="checkbox" 
                      checked={field.required} 
                      onChange={e => handleUpdateField(field.id, { required: e.target.checked })}
                    />
                    <label className="text-xs font-bold text-slate-500">Required</label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold shadow">Define Category</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${cat.type === CallType.FACULTY ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                {cat.type}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {cat.id.slice(-4)}</span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{cat.name}</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{cat.description}</p>
            <div className="flex flex-wrap gap-1">
              {cat.fields.map(f => (
                <span key={f.id} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
