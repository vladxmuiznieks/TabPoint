import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const rolesPermissions = {
    manager: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canView: true,
        canManageCategories: true,
        canAddItem: true,
    },
    staff: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true,
        canManageCategories: false,
        canAddItem: false,
    },
};

export function checkPermission(user, action) {
    if (user && rolesPermissions[user.role]) {
        return rolesPermissions[user.role][action] === true;
    }
    return false;
}


export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    function checkPermission(action) {
        if (currentUser && rolesPermissions[currentUser.role]) {
            return rolesPermissions[currentUser.role][action] === true;
        }
        return false;
    }

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, checkPermission }}>
            {children}
        </UserContext.Provider>
    );
};

