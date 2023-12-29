const order: unknown[] = [];
const failuresLeft = [1, 2, 0];

const B = 'B';
const b = 'b';
const a = 'a';
const A = 'A';

jest.retryTimes(2);

describe('Hooks', () => {
  beforeAll(() => {
    order.push(B);
  });

  beforeEach(() => {
    order.push(b);
  });

  test.each([[1], [2], [3]])('test %i', (i) => {
    const fails = failuresLeft[i - 1];
    if (fails > 0) {
      order.push(-i);
      failuresLeft[i - 1] = fails - 1;
      throw new Error(`Flaky${i}`);
    } else {
      order.push(i);
    }
  });

  afterEach(() => {
    order.push(a);
  });

  afterAll(() => {
    order.push(A);
  });
});

afterAll(() => {
  if (countOf(1) === 1 && countOf(2) === 1 && countOf(3) === 1) {
    /* eslint-disable prettier/prettier */
    expect(order).toEqual([
      B, b, -1, a, A,
      B, b, -2, a, A,
      B, b,  3, a,
         b,  1, a,
         b, -2, a, A,
      B, b,  2, a, A,
    ]);
    /* eslint-enable prettier/prettier */
  }
});

function countOf(value: unknown) {
  return order.filter((v) => v === value).length;
}
