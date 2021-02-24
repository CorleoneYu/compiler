import React, { useCallback, useState } from 'react';
import { Input, Button, Layout } from 'antd';
import Parser from '../../core/assembler';
import { AssemblerBox } from './style';

const Assembler = () => {
    const [input, changeInput] = useState<string>('');
    const [result, changeResult] = useState<string>('');
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files[0]) {
            return;
        }

        const file = event.target.files[0];
        const reader = new FileReader();

        // @ts-ignore
        reader.onloadend = (ev: ProgressEvent<FileReader>) => {
            if (!ev.target || ev.target.readyState !== FileReader.DONE) {
                return;
            }
            changeInput((ev.target.result as string) || '');
        };
        reader.readAsText(file);
    }, []);

    const handleParser = useCallback(() => {
        const parser = new Parser();
        const res = parser.parse(input);
        changeResult(res);
    }, [input]);

    return (
        <Layout>
            <Layout.Header>
                <h1 style={{ color: 'white' }}>assembler</h1>
            </Layout.Header>
            <Layout.Content
                style={{
                    boxSizing: 'border-box',
                    height: 'calc(100vh - 64px)',
                    padding: '20px',
                }}
            >
                <AssemblerBox>
                    <div className="header operate">
                        <input type="file" onChange={handleChange} />
                        <Button type="primary" className="parser-btn" onClick={handleParser}>
                            编译
                        </Button>
                    </div>
                    <div className="body">
                        <div className="content left">
                            <Input.TextArea className="file-content" rows={20} disabled value={input} />
                        </div>
                        <div className="content right">
                            <Input.TextArea className="file-content" rows={20} value={result} />
                        </div>
                    </div>
                </AssemblerBox>
            </Layout.Content>
        </Layout>
    );
};

export default Assembler;
