import _ from 'lodash';

import { User } from '../contrib/aidbox';

interface Role<P extends keyof User['data']> extends User {
    data: User['data'] & Required<Pick<User['data'], P>>;
}

export type SuperAdminUser = Role<'superAdmin'>;


export function isSuperAdmin(user: User): user is SuperAdminUser {
    // TODO: create a separated superadmin user
    return (_.isPlainObject(user.data) && _.isPlainObject(user.data!.superAdmin)) || user.id === 'admin';
}


export function isUnprivileged(user: User) {
    // TODO: create a separated superadmin user
    return (
        !_.some(
            [
                isSuperAdmin,
            ],
            (fn) => fn(user)
        ) && user.id !== 'admin'
    );
}

export enum UserRole {
    SuperAdminRole = 'Super Admin',
    UnprivilegedRole = 'Unprivileged',
}

export const userRoles = [
    UserRole.SuperAdminRole,
];

export function getUserRole(user: User) {
    if (isSuperAdmin(user)) {
        return UserRole.SuperAdminRole;
    // } else if (isAdmin(user)) {
    //     return UserRole.AdminRole;
    } else {
        return UserRole.UnprivilegedRole;
    }
}

const mapping = {
    [UserRole.SuperAdminRole]: 'superAdmin',
    [UserRole.UnprivilegedRole]: '',
};

export function getUserRoleDataKey(userRole: UserRole) {
    return mapping[userRole];
}

export function getUserRoleList(): Array<string> {
    return Object.values(mapping);
}

export function getUserRoleResourceType(userRole: UserRole) {
    const mapping = {
        [UserRole.SuperAdminRole]: 'Practitioner',
        [UserRole.UnprivilegedRole]: '',
    };

    return mapping[userRole];
}
