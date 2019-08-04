import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  .container__div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 4px 11px;
    line-height: 1.5;

    .key-word {
      color: red;
    }
  }

  .container__input {
    background: transparent;
    color: transparent;
    caret-color: black;
  }
`