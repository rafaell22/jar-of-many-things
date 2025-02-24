import Block from './classes/Block.js';
import Board from './classes/Board.js';
import Position from './classes/Position.js';

const toRawType = (value) => {
  let _toString = Object.prototype.toString;
  
  let str = _toString.call(value)

  return str.slice(8, -1)
}

class Validator {
  constructor(value) {
    this.value = value;
  }

  toBe(value) {
    if(value === undefined) {
      return this;
    }

    const result = Validator.isEqual(this.value, value);
    if(result) {
      return this;
    }

    throw new Error(`    Expected ${value}, but got ${this.value}`);
  }

  static isEqual(a, b) {
    switch(toRawType(a)) {
      case 'String':
      case 'Number':
      case 'Boolean':
      case 'Undefined':
      case 'Null':
      case 'Function': 
        return a === b;
      case 'Array':
      case 'Object':
        return JSON.stringify(a) === JSON.stringify(b);
    }

    return false;
  }
}

const expect = (value) => {
  return new Validator(value);
};

/**
 * @param {string} description
 * @param {Function} cb
 */
const describe = (description, cb) => {
  console.log(description);
  cb();
}

/**
 * @param {string} description
 * @param {Function} test
 */
const it = (description, test) => {
  console.log('|-' + description);
  try {
    test();
    console.log('| |-Passed');
  } catch(error) {
    console.log('| |-Failed');
    console.log(error);
  }
}

describe('Test Block', () => {
  it('.rotation: when rotating then get expected shape', () => {
    const block1 = new Block([[1, 1]], null, null, null);
    const block2 = new Block([[1, 1], [1, 0]], null, null, null);
    const block3 = new Block([
    [0, 1, 1], 
    [1, 1, 0], 
    [1, 0, 0]], null, null, null);

    block1.rotate(1);
    block2.rotate(1);
    block3.rotate(1);
    expect(block1.shape).toBe([[1], [1]]);
    expect(block2.shape).toBe([[1, 1], [0, 1]]);
    expect(block3.shape).toBe([
    [1, 1, 0], 
    [0, 1, 1], 
    [0, 0, 1]]);

    block1.rotate(1);
    expect(block1.shape).toBe([[1, 1]]);
  });
});

describe('Test Board', () => {
  it('creation: when new board is create then get expected grid', () => {
    const board1 = new Board(3, 3);
    const board2 = new Board(2, 4);

    expect(board1.grid).toBe([[0, 0, 0],[0, 0, 0],[0, 0, 0]]);
    expect(board2.grid).toBe([[0, 0],[0, 0],[0, 0], [0, 0]]);
  });

  it('.doesBlockFit: when blocks fit then return true', () => {
    const board = new Board(3, 4);
    const block1 = new Block([[1]]);
    const block2 = new Block([[0, 1, 1], [1, 1, 0]]);
    const block3 = new Block([[1, 0],[1, 0],[1, 1]]);

    expect(board.doesBlockFits(block1, new Position(0, 0))).toBe(true);
    expect(board.doesBlockFits(block1, new Position(0, 1))).toBe(true);
    expect(board.doesBlockFits(block1, new Position(1, 0))).toBe(true);
    expect(board.doesBlockFits(block1, new Position(1, 1))).toBe(true);
    expect(board.doesBlockFits(block1, new Position(2, 1))).toBe(true);
    expect(board.doesBlockFits(block2, new Position(0, 0))).toBe(true);
    expect(board.doesBlockFits(block3, new Position(0, 1))).toBe(true);

    board.addBlock(block1, new Position(2, 1));
    expect(board.doesBlockFits(block2, new Position(0, 0))).toBe(true);
  });

  it('.doesBlockFit: when blocks does not fit then return false', () => {
    const board = new Board(3, 4);
    const block1 = new Block([[1]]);
    const block2 = new Block([[0, 1, 1], [1, 1, 0]]);

    expect(board.doesBlockFits(block1, new Position(4, 3))).toBe(false);

    expect(board.doesBlockFits(block2, new Position(2, 0))).toBe(false);

    board.addBlock(block1, new Position(2, 0));
    board.addBlock(block2, new Position(0, 0))
    expect(board.doesBlockFits(block2, new Position(0, 0))).toBe(false);
  });

  describe('.addBlock: ', () => {
    it('when block is added and it fits, get expected grid', () => {
      const board = new Board(3, 4);
      const block = new Block([[0, 1, 1], [1, 1, 0]]);
      board.addBlock(block, new Position(0, 0));
      expect(board.grid).toBe([[0,1,1],[1,1,0],[0,0,0],[0,0,0]]);
    });

    it('when block is added, but does not fit, get expected grid', () => {
      const board = new Board(2, 2);
      const block = new Block([[0, 1, 1], [1, 1, 0]]);
      board.addBlock(block, new Position(0, 0));
      expect(board.grid).toBe([[0,0],[0,0]]);
    })
  });
})
