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
        <div className="bg-surface p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                <button onClick={() => openModal()} style={{ backgroundColor: primaryColor }} className="text-white px-4 py-2 rounded-md hover:opacity-90 text-sm">
                    Add User
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Joined</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-surface border-b dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 space-x-4">
                                    <button onClick={() => openModal(user)} className="text-indigo-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-surface p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input {...register('name', { required: true })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm mt-1"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input type="email" {...register('email', { required: true })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm mt-1"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Role</label>
                                <select {...register('role', { required: true })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm mt-1">
                                    {roles.map(role => <option key={role.id} value={role.name}>{role.name}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-sm">Cancel</button>
                                <button type="submit" style={{backgroundColor: primaryColor}} className="px-4 py-2 rounded text-white text-sm">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;