import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { fetchUsers, createUser, updateUser, deleteUser, fetchRoles } from '../../services/api';
import { User, Role } from '../../types';
import { useSettingsStore } from '../../store/settingsStore';

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm<User>();
    const { primaryColor } = useSettingsStore();
    const inputClasses = "w-full mt-1 p-2 border border-border-default rounded-md bg-transparent text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow";

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const [usersData, rolesData] = await Promise.all([fetchUsers(), fetchRoles()]);
        setUsers(usersData);
        setRoles(rolesData);
        setIsLoading(false);
    };

    const openModal = (user: User | null = null) => {
        setEditingUser(user);
        reset(user || {});
        if (user) {
            setValue('name', user.name);
            setValue('email', user.email);
            setValue('role', user.role);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        reset();
    };

    const onSubmit = async (data: User) => {
        if (editingUser) {
            await updateUser({ ...editingUser, ...data });
        } else {
            await createUser(data);
        }
        closeModal();
        loadData();
    };

    const handleDelete = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await deleteUser(userId);
            loadData();
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="bg-surface p-6 rounded-lg shadow-sm border border-border-default">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">User Management</h2>
                <button onClick={() => openModal()} style={{ backgroundColor: primaryColor }} className="text-white px-4 py-2 rounded-md hover:opacity-90 text-sm font-semibold">
                    Add User
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-text-secondary">
                    <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border-default">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-semibold">Name</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Role</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Joined</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-surface border-b border-border-default hover:bg-background transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full" />
                                        <div>
                                            <div className="font-medium text-text-primary">{user.name}</div>
                                            <div className="text-xs text-text-secondary">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">{user.role}</span>
                                </td>
                                <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 space-x-4">
                                    <button onClick={() => openModal(user)} className="font-medium text-primary hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(user.id)} className="font-medium text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface p-6 rounded-lg w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input {...register('name', { required: true })} className={inputClasses} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input type="email" {...register('email', { required: true })} className={inputClasses}/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Role</label>
                                <select {...register('role', { required: true })} className={inputClasses}>
                                    {roles.map(role => <option key={role.id} value={role.name}>{role.name}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-sm font-semibold">Cancel</button>
                                <button type="submit" style={{backgroundColor: primaryColor}} className="px-4 py-2 rounded-md text-white text-sm font-semibold">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;