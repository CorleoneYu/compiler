import styled from "styled-components";

export const GameContainer = styled.div`
  position: relative;
  display: flex;
  height: 100%;

  & > div {
    width: 50%;
  }

  .debug {
    position: absolute;
    bottom: 10px;

    button {
      margin-left: 10px;
    }
  }
`;