import LottoMachine, { ERROR_MESSAGE_LACK_MONEY } from '../src/domain/LottoMachine';

describe('로또 머신에 대한 테스트 케이스', () => {
  test('금액에 해당하는 만큼 로또를 발행한다.', () => {
    //given
    const machine = new LottoMachine();

    //when
    const lottos = machine.createLottos(7000);

    //then
    expect(lottos.length).toBe(7);
  });

  test('로또 1장의 가격은 1000원이다. 금액이 작을 경우 예외처리 발생', () => {
    //given
    const machine = new LottoMachine();

    //then
    expect(() => {
      machine.createLottos(700);
    }).toThrow(ERROR_MESSAGE_LACK_MONEY);
  });
});
