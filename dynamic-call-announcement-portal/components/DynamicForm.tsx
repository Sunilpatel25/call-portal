
import React, { useState, useEffect, useRef } from 'react';
import { FieldDefinition, FieldType } from '../types';

interface DynamicFormProps {
  fields: FieldDefinition[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>, files: { [fieldId: string]: File }) => void;
  onCancel: () => void;
  title: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, initialData = {}, onSubmit, onCancel, title }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<{ [key: string]: File }>({});
  const [dragActive, setDragActive] = useState<{ [key: string]: boolean }>({});
  const prevInitialDataRef = useRef<string>('');

  // Sync formData with initialData when it changes (for editing)
  // Use JSON.stringify to compare objects and prevent infinite loops
  useEffect(() => {
    const currentInitialDataStr = JSON.stringify(initialData || {});
    
    // Only update if initialData actually changed
    if (prevInitialDataRef.current !== currentInitialDataStr) {
      prevInitialDataRef.current = currentInitialDataStr;
      
      if (initialData && Object.keys(initialData).length > 0) {
        setFormData({ ...initialData });
        // Clear files when initialData changes (new form)
        setFiles({});
      } else {
        setFormData({});
        setFiles({});
      }
    }
  }, [initialData]);

  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (id: string, file: File | null) => {
    if (file) {
      console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed');
        return;
      }
      setFiles(prev => {
        const newFiles = { ...prev, [id]: file };
        console.log('Files state updated:', newFiles);
        return newFiles;
      });
      setFormData(prev => ({ ...prev, [id]: file.name }));
    } else {
      const newFiles = { ...files };
      delete newFiles[id];
      setFiles(newFiles);
      const newData = { ...formData };
      delete newData[id];
      setFormData(newData);
    }
  };

  const handleDrag = (e: React.DragEvent, fieldId: string, isDragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [fieldId]: isDragging }));
  };

  const handleDrop = (e: React.DragEvent, fieldId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [fieldId]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(fieldId, e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    console.log('Form submitted with files:', files);
    onSubmit(formData, files);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-gradient-to-br from-white to-slate-50 p-5 rounded-xl border border-slate-200 shadow-xl">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </span>
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 ml-10">Fill in the required details below to publish the announcement</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div 
            key={field.id} 
            className={`${(field.type === FieldType.TEXTAREA || field.type === 'TEXTAREA' || field.type === 'textarea') ? "md:col-span-2" : ""} group`}
          >
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
              <span className="flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-red-500 text-base">*</span>}
              </span>
              {!field.required && (
                <span className="text-xs text-slate-400 font-normal">(Optional)</span>
              )}
            </label>
            
            {(field.type === FieldType.TEXTAREA || field.type === 'TEXTAREA' || field.type === 'textarea') ? (
              <textarea
                required={field.required}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px] resize-y bg-white hover:border-slate-300 text-slate-800 placeholder-slate-400 text-sm"
              />
            ) : (field.type === FieldType.SELECT || field.type === 'SELECT' || field.type === 'select') ? (
              <div className="space-y-2">
                <div className="relative">
                  <select
                    required={field.required}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white hover:border-slate-300 text-slate-800 cursor-pointer font-medium text-sm"
                  >
                    <option value="" className="text-slate-400">-- Select {field.label} --</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt} className="text-slate-800">{opt}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
                {formData[field.id] === 'Other' && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                      <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                      Please specify {field.label.toLowerCase()}
                    </label>
                    <input
                      type="text"
                      required={field.required}
                      value={formData[`${field.id}_custom`] || ''}
                      onChange={(e) => handleChange(`${field.id}_custom`, e.target.value)}
                      placeholder={`Type your custom ${field.label.toLowerCase()}...`}
                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-blue-50 hover:border-blue-300 text-slate-800 placeholder-slate-400 font-medium text-sm"
                    />
                  </div>
                )}
              </div>
            ) : (field.type === FieldType.DATE || field.type === 'DATE' || field.type === 'date') ? (
              <div className="relative">
                <input
                  type="date"
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-slate-300 text-slate-800 font-medium cursor-pointer text-sm"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
            ) : (field.type === FieldType.NUMBER || field.type === 'NUMBER' || field.type === 'number') ? (
              <input
                type="number"
                required={field.required}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-slate-300 text-slate-800 placeholder-slate-400 text-sm"
              />
            ) : (field.type === FieldType.FILE || field.type === 'FILE' || field.type === 'file') ? (
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="file"
                    id={field.id}
                    name={field.id}
                    required={field.required}
                    accept=".pdf"
                    onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
                    className="hidden absolute"
                  />
                  <label
                    htmlFor={field.id}
                    onDragEnter={(e) => handleDrag(e, field.id, true)}
                    onDragLeave={(e) => handleDrag(e, field.id, false)}
                    onDragOver={(e) => handleDrag(e, field.id, true)}
                    onDrop={(e) => handleDrop(e, field.id)}
                    className={`w-full px-3 py-2 border-2 border-dashed rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      dragActive[field.id]
                        ? 'border-blue-500 bg-blue-100 scale-[1.01]'
                        : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <svg className={`w-5 h-5 ${dragActive[field.id] ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    <div className="text-center">
                      <span className={`text-xs font-semibold ${dragActive[field.id] ? 'text-blue-700' : 'text-slate-700'}`}>
                        {files[field.id] ? files[field.id].name : dragActive[field.id] ? 'Drop PDF file here' : 'Click or drag & drop PDF file'}
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        PDF files only {field.required && '(Required)'}
                      </p>
                    </div>
                  </label>
                </div>
                {files[field.id] && (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span className="text-xs font-medium text-green-800">{files[field.id].name}</span>
                      <span className="text-xs text-green-600">({(files[field.id].size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFileChange(field.id, null)}
                      className="text-red-600 hover:text-red-800 p-0.5"
                      title="Remove file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="text"
                required={field.required}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-slate-300 text-slate-800 placeholder-slate-400 text-sm"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t-2 border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border-2 border-slate-300 hover:bg-slate-50 rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
          </svg>
          Publish Announcement
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
