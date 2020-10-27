import React from 'react';
import { Layout } from 'antd';
import Regular from '../Regular';

export default function() {
    return (
        <Layout>
            <Layout.Header>
                <h1 style={{ color: 'white' }}>regular expr</h1>
            </Layout.Header>
            <Layout.Content
                style={{
                    boxSizing: 'border-box',
                    height: 'calc(100vh - 64px)',
                    padding: '20px'
                }}
            >
                <Regular />
            </Layout.Content>
        </Layout>
    )
}
