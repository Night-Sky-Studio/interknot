import { Title } from "@mantine/core";
import React from "react";

export default function HomePage(): React.ReactElement {
    return (
        <div>
            <Title order={1}>Welcome to Inter-Knot</Title>
            <p>A place for proxies to share their agents' builds.</p>
        </div>
    );
}