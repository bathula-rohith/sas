import React, { useState, useEffect } from 'react';
import { fetchRoles, updateRole } from '../../services/api';
import { Role, Permission } from '../../types';
import { useForm, Controller } from 'react-hook-form';
import { useSettingsStore } from '../../store/settingsStore';

const permissionGroups = {
    'User Management': [Permission.VIEW_USERS, Permission.MANAGE_USERS],
    'Role Management': [Permission.VIEW_ROLES, Permission.MANAGE_ROLES],
    'Audit Logs': [Permission.VIEW_AUDIT_LOGS, Permission.EXPORT_AUDIT_LOGS],
    'Settings': [Permission.VIEW_SETTINGS, Permission.MANAGE_SETTINGS],
    'File System': [Permission.VIEW_FILES, Permission.MANAGE_FILES],
    'Dashboard': [Permission.VIEW_DASHBOARD],
    'Profile': [Permission.MANAGE_OWN_PROFILE],
};

const Roles: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const { handleSubmit, control, reset, setValue } = useForm<Role>();
    const { primaryColor } = useSettingsStore();

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        setIsLoading(true);
        const rolesData = await fetchRoles();
        setRoles(rolesData);
        setIsLoading(false);
    };
    
    const openModal = (role: Role) => {
        setEditingRole(role);
        reset(role);
        setValue('permissions', role.permissions); // ensure permissions are set for Controller
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRole(null);
        reset();
    };

    const onSubmit = async (data: Role) => {
        if (editingRole) {
            await updateRole({ ...editingRole, permissions: data.permissions });
        }
        closeModal();
        loadRoles();
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Roles & Permissions</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-4 py-2">Role</th>
                            <th scope="col" className="px-4 py-2">Description</th>
                            <th scope="col" className="px-4 py-2">Permissions</th>
                            <th scope="col" className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map(role => (
                            <tr key={role.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{role.name}</td>
                                <td className="px-4 py-3">{role.description}</td>
                                <td className="px-4 py-3">{role.permissions.length} permissions</td>
                                <td className="px-4 py-3">
                                    <button onClick={() => openModal(role)} className="text-indigo-600 hover:underline">Manage Permissions</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && editingRole && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
                        <h3 className="text-lg font-bold mb-4">Manage Permissions for {editingRole.name}</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                             <Controller
                                name="permissions"
                                control={control}
                                defaultValue={editingRole.permissions}
                                render={({ field }) => (
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {Object.entries(permissionGroups).map(([groupName, permissions]) => (
                                            <div key={groupName}>
                                                <h4 className="font-semibold mb-2 text-sm">{groupName}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {permissions.map(p => (
                                                        <label key={p} className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded text-indigo-600 focus:ring-indigo-500"
                                                                checked={field.value.includes(p)}
                                                                onChange={e => {
                                                                    const newPermissions = e.target.checked
                                                                        ? [...field.value, p]
                                                                        : field.value.filter(perm => perm !== p);
                                                                    field.onChange(newPermissions);
                                                                }}
                                                            />
                                                            <span className="capitalize text-xs">{p.replace(/[:_]/g, ' ')}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />
                            <div className="flex justify-end space-x-2 mt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-sm">Cancel</button>
                                <button type="submit" style={{ backgroundColor: primaryColor }} className="px-4 py-2 rounded text-white text-sm">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Roles;
