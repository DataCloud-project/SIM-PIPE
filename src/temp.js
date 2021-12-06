function one() {
    return new Promise(resolve => {
      return 10;
      resolve();
    });
  }
  
  function two(num) {
    return new Promise(resolve => {
      console.log(num);
      return 5;
      resolve();
    });
  }
  
  function three(num){
     console.log(num);
  }

  async function run() {
    await one();
    await two(num);
    three(num);
  }
  run();
