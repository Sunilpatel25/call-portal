
import React, { useState, useEffect } from 'react';
import { CallType, Category, CallAnnouncement, AppState, FieldType } from './types';
import { categoriesApi, callsApi } from './src/services/api';
import CategoryManager from './components/CategoryManager';
import DynamicForm from './components/DynamicForm';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'categories' | 'create'>('dashboard');
  const [categories, setCategories] = useState<Category[]>([]);
  const [calls, setCalls] = useState<CallAnnouncement[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [viewingCall, setViewingCall] = useState<CallAnnouncement | null>(null);
  const [editingCall, setEditingCall] = useState<CallAnnouncement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from MongoDB on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesData, callsData] = await Promise.all([
          categoriesApi.getAll(),
          callsApi.getAll()
        ]);
        setCategories(categoriesData);
        setCalls(callsData);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Make sure the server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddCategory = async (newCat: Category) => {
    try {
      const savedCategory = await categoriesApi.create(newCat);
      setCategories(prev => [...prev, savedCategory]);
      setActiveTab('dashboard');
    } catch (err) {
      alert('Failed to create category');
      console.error(err);
    }
  };

  const handleCreateCall = async (data: Record<string, any>, files: { [fieldId: string]: File }) => {
    const category = categories.find(c => c.id === selectedCategoryId);
    if (!category) return;

    console.log('handleCreateCall - Data:', data);
    console.log('handleCreateCall - Files:', files);

    try {
      // Get the PDF file if exists
      const pdfFile = files['attachment'];
      console.log('PDF File:', pdfFile);
      
      if (editingCall) {
        // Update existing call
        const updatedCallData = {
          ...editingCall,
          data,
          title: (data.funding_agency || data.organization || 'Updated') + ' - ' + category.name,
        };
        const updatedCall = await callsApi.update(editingCall.id, updatedCallData, pdfFile);
        setCalls(prev => prev.map(call => 
          call.id === editingCall.id ? updatedCall : call
        ));
        setEditingCall(null);
      } else {
        // Create new call
        const newCall: CallAnnouncement = {
          id: `call-${Date.now()}`,
          categoryId: selectedCategoryId,
          title: (data.funding_agency || data.organization || 'New Announcement') + ' - ' + category.name,
          createdAt: new Date().toISOString(),
          status: 'Published',
          data,
        };
        const savedCall = await callsApi.create(newCall, pdfFile);
        setCalls(prev => [savedCall, ...prev]);
      }

      setActiveTab('dashboard');
      setSelectedCategoryId('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save call announcement';
      alert(`Failed to save call announcement: ${errorMessage}`);
      console.error('Error saving call:', err);
    }
  };

  const handleViewCall = (call: CallAnnouncement) => {
    setViewingCall(call);
  };

  const handleEditCall = (call: CallAnnouncement) => {
    setEditingCall(call);
    setSelectedCategoryId(call.categoryId);
    setActiveTab('create');
  };

  const handleDeleteCall = async (callId: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await callsApi.delete(callId);
        setCalls(prev => prev.filter(call => call.id !== callId));
      } catch (err) {
        alert('Failed to delete call announcement');
        console.error(err);
      }
    }
  };

  const handleCloseView = () => {
    setViewingCall(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Posted Announcements</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab('create')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Create New Announcement
                </button>
              </div>
            </div>

            {/* Table View */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                        Date Posted
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Files
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {calls.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-3 py-8 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p className="text-sm font-semibold">No announcements yet</p>
                            <p className="text-xs">Create your first announcement to get started</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      calls.map((call, index) => {
                        const category = categories.find(c => c.id === call.categoryId);
                        return (
                          <tr key={call.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-slate-900">
                              {index + 1}
                            </td>
                            <td className="px-3 py-3 text-sm text-slate-900 font-medium max-w-xs">
                              <div className="truncate">{call.title}</div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                {category?.name || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                category?.type === CallType.FACULTY 
                                  ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                                  : 'bg-green-50 text-green-700 border border-green-200'
                              }`}>
                                {category?.type || 'N/A'}
                              </span>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-xs text-slate-600">
                              {new Date(call.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-xs font-bold text-green-700 uppercase">{call.status}</span>
                              </span>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              {(() => {
                                const attachments = call.data?.attachment;
                                if (attachments && Array.isArray(attachments) && attachments.length > 0) {
                                  const firstAttachment = attachments[0];
                                  const fileName = firstAttachment?.fileName || firstAttachment?.name || 'Unknown file';
                                  return (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full">
                                        {attachments.length} {attachments.length === 1 ? 'file' : 'files'}
                                      </span>
                                      <a
                                        href={`http://localhost:5000/api/calls/download/${encodeURIComponent(fileName)}`}
                                        download={fileName}
                                        className="text-green-600 hover:text-green-800"
                                        title="Download PDF"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                        </svg>
                                      </a>
                                     
                                    </div>
                                  );
                                }
                                return <span className="text-xs text-slate-400 italic">No files</span>;
                              })()}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-1.5">
                                <button 
                                  onClick={() => handleViewCall(call)}
                                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                  title="View Details"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => handleEditCall(call)}
                                  className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
                                  title="Edit"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => handleDeleteCall(call.id)}
                                  className="text-red-600 hover:text-red-800 font-medium transition-colors"
                                  title="Delete"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'categories':
        return <CategoryManager categories={categories} onAddCategory={handleAddCategory} />;

      case 'create':
        const selectedCat = editingCall 
          ? categories.find(c => c.id === editingCall.categoryId)
          : categories.find(c => c.id === selectedCategoryId);
        
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {editingCall ? 'Edit Announcement' : 'Step 1: Choose Call Type'}
              </h2>
              
              {!editingCall && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedCategoryId === cat.id 
                          ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-50' 
                          : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <p className={`text-[10px] font-bold uppercase mb-1 ${cat.type === CallType.FACULTY ? 'text-orange-600' : 'text-green-600'}`}>{cat.type}</p>
                      <p className="font-bold text-slate-800">{cat.name}</p>
                    </button>
                  ))}
                </div>
              )}

              {selectedCat && (
                <div className="space-y-8">
                  {!editingCall && <h2 className="text-2xl font-bold text-slate-800 mb-6">Step 2: Announcement Details</h2>}

                  <DynamicForm 
                    title={editingCall ? `Edit: ${selectedCat.name}` : `New Announcement: ${selectedCat.name}`}
                    fields={selectedCat.fields}
                    initialData={editingCall?.data}
                    onCancel={() => { 
                      setSelectedCategoryId(''); 
                      setEditingCall(null); 
                      setActiveTab('dashboard'); 
                    }}
                    onSubmit={handleCreateCall}
                  />
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-56 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-4">
          <h1 className="text-lg font-black tracking-tighter text-blue-400">CALL<span className="text-white">PORTAL</span></h1>
          <p className="text-[8px] uppercase font-bold text-slate-500 tracking-widest mt-0.5">Admin Console</p>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all text-xs ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span className="font-semibold">Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all text-xs ${activeTab === 'categories' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
            <span className="font-semibold">Categories</span>
          </button>

         
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-xs shadow-lg">A</div>
            <div>
              <p className="text-[10px] font-bold">Admin</p>
              <p className="text-[9px] text-slate-500">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-0.5">System Overview</p>
              <h1 className="text-2xl font-extrabold text-slate-900">
                {activeTab === 'dashboard' ? 'Portal Management' : activeTab === 'categories' ? 'Categories' : 'New Announcement'}
              </h1>
            </div>
            <div className="flex gap-3">
              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Total Calls</span>
                <span className="text-lg font-bold text-slate-800">{calls.length}</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Categories</span>
                <span className="text-lg font-bold text-slate-800">{categories.length}</span>
              </div>
            </div>
          </header>

          <div className="pb-20">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* View Modal */}
      {viewingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3" onClick={handleCloseView}>
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 flex justify-between items-start flex-shrink-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold truncate">{viewingCall.title || 'Untitled Announcement'}</h2>
                <p className="text-[10px] text-blue-100 mt-0.5">
                  {categories.find(c => c.id === viewingCall.categoryId)?.name || 'Unknown Category'}
                </p>
              </div>
              <button 
                onClick={handleCloseView}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                {(() => {
                  const category = categories.find(c => c.id === viewingCall.categoryId);
                  const categoryType = category?.type;
                  return (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      categoryType === CallType.FACULTY
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {categoryType || 'N/A'}
                    </span>
                  );
                })()}
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-semibold text-green-700">{viewingCall.status || 'Published'}</span>
                </span>
                <span className="text-[10px] text-slate-500 ml-auto">
                  Posted: {viewingCall.createdAt ? new Date(viewingCall.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) : 'Unknown date'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {(() => {
                  const category = categories.find(c => c.id === viewingCall.categoryId);
                  if (!category || !category.fields) {
                    return <div className="col-span-3 text-sm text-slate-500">No fields found for this category.</div>;
                  }
                  
                  const nonFileFields = category.fields.filter(f => {
                    const fieldType = f.type;
                    return fieldType !== FieldType.FILE && 
                           fieldType !== 'FILE' && 
                           fieldType !== 'file';
                  });
                  
                  if (nonFileFields.length === 0) {
                    return <div className="col-span-3 text-sm text-slate-500">No fields to display.</div>;
                  }
                  
                  return nonFileFields.map(field => {
                    const fieldType = field.type;
                    const isTextarea = fieldType === FieldType.TEXTAREA || 
                                     fieldType === 'TEXTAREA' || 
                                     fieldType === 'textarea';
                    
                    return (
                      <div 
                        key={field.id} 
                        className={`${isTextarea ? 'md:col-span-3' : ''} bg-slate-50 p-2 rounded-lg border border-slate-200`}
                      >
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                          {field.label}
                        </label>
                        <div className="text-xs text-slate-800 font-medium">
                          {(viewingCall.data && (viewingCall.data[field.id] || viewingCall.data[`${field.id}_custom`])) ? (
                            viewingCall.data[field.id] || viewingCall.data[`${field.id}_custom`]
                          ) : (
                            <span className="text-slate-400 italic">Not provided</span>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Attachments Section */}
              {viewingCall.data && viewingCall.data.attachment && Array.isArray(viewingCall.data.attachment) && viewingCall.data.attachment.length > 0 && (
                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                    </svg>
                    Attached Files
                  </h4>
                  <div className="space-y-1.5">
                    {viewingCall.data.attachment.map((file, idx) => {
                      const field = categories.find(c => c.id === viewingCall.categoryId)?.fields.find(f => f.id === file.fieldId);
                      const fileName = file?.fileName || file?.name || 'Unknown file';
                      const isPdf = fileName.toLowerCase().endsWith('.pdf');
                      return (
                        <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              {isPdf ? (
                                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
                                </svg>
                              ) : (
                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-800 truncate">{fileName}</p>
                              <p className="text-[10px] text-slate-500">{field?.label || 'Document'}</p>
                            </div>
                          </div>
                          <a
                            href={`http://localhost:5000/api/calls/download/${encodeURIComponent(fileName)}`}
                            download={fileName}
                            className="flex-shrink-0 p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Download file"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t flex-shrink-0">
                <button
                  onClick={handleCloseView}
                  className="px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-semibold transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEditCall(viewingCall);
                    handleCloseView();
                  }}
                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
