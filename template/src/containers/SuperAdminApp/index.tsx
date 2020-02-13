import React from "react";
import {Button} from "antd";

interface Props {
    logout: () => void
}

export function SuperAdminApp({ logout }: Props) {
    return (
        <>
            <h2>SuperAdminApp</h2>
            <Button onClick={() => logout()}>Logout</Button>
        </>
    )
}