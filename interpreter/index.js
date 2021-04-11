const STOP = 'STOP'
const ADD = 'ADD'
const PUSH = 'PUSH'
const MUL = 'MUL'
const DIV = 'DIV'
const SUB = 'SUB'
const LT = 'LT'
const GT = 'GT'
const EQ = 'EQ'
const OR = 'OR'
const AND = 'AND'
const JUMP = 'JUMP'
const JUMPI = 'JUMPI'

const OPCODE_MAP = {
  STOP,
  ADD,
  PUSH,
  MUL,
  DIV,
  SUB,
  LT,
  GT,
  EQ,
  OR,
  AND,
  JUMP,
  JUMPI,
};

const EXECUTION_COMPLETE = 'Execution complete';
const EXECUTION_LIMIT = 10000

class Interpreter{
  constructor(){
    this.state = {
      programCounter: 0,
      stack: [],
      code: [],
      executionCount: 0
    }
  }

  jump(){
    const destination = this.state.stack.pop();

    if (destination < 0
      || destination > this.state.stack.length
      ){
        throw new Error(`Invalid destination: ${destination}`);
      }


    this.state.programCounter = destination;
    this.state.programCounter--;

  }

  runCode(code){
    this.state.code = code

    while (this.state.programCounter < this.state.code.length){
      this.state.executionCount++;

      if (this.state.executionCount > EXECUTION_LIMIT){
        throw new Error(`Exceeded execution count ${EXECUTION_LIMIT}`);
      }

      const opCode = this.state.code[this.state.programCounter];

      try {
        switch (opCode){
          case STOP:
            throw new Error(EXECUTION_COMPLETE);
          case PUSH:
            this.state.programCounter++;
            const value = this.state.code[this.state.programCounter];
            this.state.stack.push(value)
            break;
          case ADD:
          case SUB:
          case MUL:
          case DIV:
          case LT:
          case GT:
          case EQ:
          case OR:
          case AND:

            const a = this.state.stack.pop();
            const b = this.state.stack.pop();

            let result;

            if (opCode === ADD) result = a + b;
            if (opCode === SUB) result = a - b;
            if (opCode === MUL) result = a * b;
            if (opCode === DIV) result = a / b;
            if (opCode === LT) result = a < b ? 1 : 0;
            if (opCode === GT) result = a > b ? 1 : 0;
            if (opCode === EQ) result = a === b ? 1 : 0;
            if (opCode === OR) result = a || b;
            if (opCode === AND) result = a && b;

            this.state.stack.push(result);
            break;
          case JUMP:
            this.jump(); 
            break;
          case JUMPI:
            const condition = this.state.stack.pop();

            if (condition === 1){
              this.jump()
            }
            break;
          default:
            break;

        }
      } catch(error){
        if (error.message === EXECUTION_COMPLETE){
          return this.state.stack[this.state.stack.length-1];
        }
        throw error;
      }

      this.state.programCounter++;
    }
  }
}

Interpreter.OPCODE_MAP = OPCODE_MAP
module.exports = Interpreter;

//const code = [PUSH, 1, PUSH, 0, PUSH, 4, PUSH, 99, JUMP]
//const code = [PUSH, 4, PUSH, 3, EQ, PUSH, 2, PUSH, 3, LT, OR, 0, JUMP, STOP];
//const interpreter = new Interpreter();
//const ans = interpreter.runCode(code);
//console.log(ans)