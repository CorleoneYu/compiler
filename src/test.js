let a = 1;

function bar() {
  console.log(a);
}

function fn() {
  let a = 2;
  
  function fo() {
    console.log(a);
  }
  
  fo();
  bar();
}

fn();