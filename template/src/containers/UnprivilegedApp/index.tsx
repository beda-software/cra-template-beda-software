import React from 'react';
import { Button } from 'antd';

interface Props {
    logout: () => void;
}

export function UnprivilegedApp({ logout }: Props) {
    return (
        <>
            <h2>UnprivilegedApp</h2>
            <Button onClick={() => logout()}>Logout</Button>
        </>
    );
}
