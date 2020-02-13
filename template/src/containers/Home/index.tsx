import React from "react";
import {Button} from "antd";

interface Props {
    logout: () => void
}

export function Home({ logout }: Props) {
    return (
        <>
            <h2>Home page</h2>
            <Button onClick={() => logout()}>Logout</Button>
        </>
    )
}