import React, { useState, useEffect, useMemo } from 'react';
import { fetchAuditLogs, fetchUsers } from '../../services/api';
import { AuditLog, User } from '../../types';

const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({ user: '', action: '', startDate: '', endDate: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const [logsData, usersData] = await Promise.all([fetchAuditLogs(), fetchUsers()]);
        setLogs(logsData);
        setUsers(usersData);
        setIsLoading(false);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const logDate = new Date(log.timestamp);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            if (startDate && logDate < startDate) return false;
            if (endDate && logDate > endDate) return false;
            if (filters.user && log.userId !== filters.user) return false;
            if (filters.action && !log.action.toLowerCase().includes(filters.action.toLowerCase())) return false;
            
            return true;
        });
    }, [logs, filters]);

    const exportToCSV = () => {
        const headers = ['Timestamp', 'User', 'Action', 'Details'];
        const rows = filteredLogs.map(log => [
            log.timestamp,
            log.userName,
            log.action,
            `"${log.details.replace(/"/g, '""')}"`
        ]);
        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'audit_logs.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Audit Logs</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700">
                <input type="text" name="action" placeholder="Filter by action..." value={filters.action} onChange={handleFilterChange} className="p-1.5 border rounded dark:bg-gray-600 dark:border-gray-500 text-xs"/>
                <select name="user" value={filters.user} onChange={handleFilterChange} className="p-1.5 border rounded dark:bg-gray-600 dark:border-gray-500 text-xs">
                    <option value="">All Users</option>
                    {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                </select>
                <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="p-1.5 border rounded dark:bg-gray-600 dark:border-gray-500 text-xs"/>
                <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="p-1.5 border rounded dark:bg-gray-600 dark:border-gray-500 text-xs"/>
                <button onClick={exportToCSV} className="bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 text-xs">
                    Export CSV
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-4 py-2">Timestamp</th>
                            <th scope="col" className="px-4 py-2">User</th>
                            <th scope="col" className="px-4 py-2">Action</th>
                            <th scope="col" className="px-4 py-2">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-4 py-3">{log.userName}</td>
                                <td className="px-4 py-3"><span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full text-[10px]">{log.action}</span></td>
                                <td className="px-4 py-3">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;
