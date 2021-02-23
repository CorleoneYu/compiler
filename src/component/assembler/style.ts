import styled from 'styled-components';

export const AssemblerBox = styled.div`
    .header {
        margin-bottom: 10px;
    }

    .body {
        position: relative;
        display: flex;
        justify-content: space-between;

        .content {
            box-sizing: border-box;
            width: 49%;

            .file-content {
                color: rgba(0, 0, 0, 0.65);
            }
        }
    }
`;
