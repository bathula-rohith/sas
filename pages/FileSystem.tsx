import React, { useState, useEffect } from 'react';
import { fetchFiles, deleteFile } from '../services/api';
import { TenantFile } from '../types';
import { useSettingsStore } from '../store/settingsStore';

const FileIcon: React.FC<{ type: string }> = ({ type }) => {
    let icon;
    if (type.startsWith('image/')) {
        icon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
    } else if (type === 'application/pdf') {
        icon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
    } else {
        icon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>;
    }
    return <span className="text-gray-500">{icon}</span>;
};

const FileSystem: React.FC = () => {
    const [files, setFiles] = useState<TenantFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [previewingFile, setPreviewingFile] = useState<TenantFile | null>(null);
    const { primaryColor } = useSettingsStore();

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        setIsLoading(true);
        const filesData = await fetchFiles();
        setFiles(filesData);
        setIsLoading(false);
    };

    const handleDelete = async (fileId: string) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            await deleteFile(fileId);
            loadFiles();
        }
    };
    
    const handlePreview = (file: TenantFile) => {
        setPreviewingFile(file);
    };

    const closePreview = () => {
        setPreviewingFile(null);
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };
    
    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="bg-surface p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">File System</h2>
                <label style={{ backgroundColor: primaryColor }} className="text-white px-4 py-2 rounded-md hover:opacity-90 cursor-pointer text-sm">
                    Upload File
                    <input type="file" className="hidden" onChange={() => alert('Mock file upload!')} />
                </label>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Size</th>
                            <th scope="col" className="px-6 py-3">Uploaded</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map(file => (
                            <tr key={file.id} className="bg-surface border-b dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="flex items-center space-x-3">
                                        <FileIcon type={file.type} />
                                        <span>{file.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{formatBytes(file.size)}</td>
                                <td className="px-6 py-4">{new Date(file.uploadedAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 space-x-4">
                                    <button onClick={() => handlePreview(file)} className="text-indigo-600 hover:underline">Preview</button>
                                    <button onClick={() => handleDelete(file.id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {previewingFile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface p-5 rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-border-default">
                            <h3 className="text-lg font-semibold text-text-primary">{previewingFile.name}</h3>
                            <button onClick={closePreview} className="text-text-secondary hover:text-text-primary text-2xl leading-none">&times;</button>
                        </div>
                        <div className="flex-1 overflow-auto">
                            {previewingFile.type.startsWith('image/') ? (
                                <img 
                                    src={`https://picsum.photos/seed/${previewingFile.id}/1200/800`} 
                                    alt={`Preview of ${previewingFile.name}`} 
                                    className="w-full h-auto object-contain rounded"
                                />
                            ) : previewingFile.type === 'application/pdf' ? (
                                <div className="text-center p-10 bg-background rounded-lg flex flex-col items-center justify-center h-full">
                                    <p className="text-lg font-medium text-text-primary">PDF Preview</p>
                                    <p className="text-sm text-text-secondary mt-2">In a real application, the PDF would be rendered here.</p>
                                    <a href={previewingFile.url} download style={{ backgroundColor: primaryColor }} className="mt-4 inline-block text-white px-4 py-2 rounded-md text-sm hover:opacity-90">
                                        Download PDF
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center p-10 bg-background rounded-lg flex flex-col items-center justify-center h-full">
                                    <p className="text-lg font-medium text-text-primary">Preview not available</p>
                                    <p className="text-sm text-text-secondary mt-2">File type: {previewingFile.type}</p>
                                    <a href={previewingFile.url} download style={{ backgroundColor: primaryColor }} className="mt-4 inline-block text-white px-4 py-2 rounded-md text-sm hover:opacity-90">
                                        Download File
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileSystem;