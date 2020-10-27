import React, { useState, useCallback } from 'react';
import { Input, Button } from 'antd';
import Graph from './graph';
import Lexer from '../../core/regular-exp/src/Lexer';
import Parser from '../../core/regular-exp/src/Parser';
import NFAManager from '../../core/regular-exp/src/NFA';

import { InputBox } from './style';

const lexer = new Lexer();
const parser = new Parser();

const Regular = () => {
    const [input, setInput] = useState<string>('[1-9][0-9]*\\.[0-9]+');
    const [nfa, setNFA] = useState<NFAManager | null>(null);
    const [str, setStr] = useState<string>('');

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setInput(value);
        },
        [setInput],
    );

    const handleStrChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setStr(value);
    }, []);

    const handleParse = useCallback(() => {
        const tokens = lexer.lexer(input);
        console.log('tokens', tokens);
        const nfaManager = parser.parse(tokens);
        setNFA(nfaManager);
    }, [input]);

    const handleTest = useCallback(() => {
        if (!nfa || !nfa.head || !nfa.tail) {
            return;
        }

        const isMatch = nfa.match(str);
        console.log('isMatch', isMatch);
    }, [str, nfa]);

    return (
        <div className="regular">
            <InputBox>
                <Input className="regular-input input" defaultValue={input} onChange={handleInputChange} />
                <Button className="parse-btn btn" type="primary" onClick={handleParse}>
                    parse
                </Button>
                <Input className="test-input input" defaultValue={str} onChange={handleStrChange} />
                <Button className="test-btn btn" onClick={handleTest}>test</Button>
            </InputBox>
            {nfa && <Graph edges={nfa.edgeNodeList} nodes={nfa.NFANodeList} />}
        </div>
    );
};

export default Regular;
