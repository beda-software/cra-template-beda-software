import * as React from 'react';
import { User } from 'src/contrib/aidbox';
import { UserRole } from 'src/services/role';

interface SessionContextModel {
    user: User;
    role: UserRole;
}

export const SessionContext = React.createContext<SessionContextModel>({} as any);
