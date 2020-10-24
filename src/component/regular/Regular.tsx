import React, { useState, useCallback } from 'react';
import { Input, Button } from 'antd';
import Lexer from '../../core/regular-exp/src/Lexer';

const lexer = new Lexer();

const Regular = () => {
    const [input, setInput] = useState<string>('[0-9]+');

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInput(value);
    }, [setInput]);

    const handleLexer = useCallback(() => {
        const tokens = lexer.lexer(input);
        console.log('tokens', tokens);
    }, [input]);

    return (
        <div>
            <Input defaultValue={input} onChange={handleInputChange} />
            <Button type="primary" onClick={handleLexer}>Lexer</Button>
        </div>
    )
};

export default Regular;
