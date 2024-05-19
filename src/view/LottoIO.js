import readline from 'readline';
import {
  MESSAGE_PURCHASE_PRICE,
  MESSAGE_WINNING_NUMBERS,
  MESSAGE_RESTART_OR_NOT,
  RADIX_INTEGER,
  LOTTO_5TH_PRIZE_WINNER,
  LOTTO_4TH_PRIZE_WINNER,
  LOTTO_3RD_PRIZE_WINNER,
  LOTTO_SECOND_PRIZE_WINNER,
  LOTTO_FIRST_PRIZE_WINNER,
  MESSAGE_BONUS_NUMBER,
} from '../constants';
import { filterArray } from '../utils';
import LottoValidator from '../domain/LottoValidator';

class LottoIO {
  constructor() {
    this.validator = new LottoValidator();
  }

  readLineAsync(query) {
    return new Promise((resolve, reject) => {
      try {
        this.validator.validateArguments(arguments);
        this.validator.validateQuery(query, 'string');
      } catch (error) {
        reject(error);
        return;
      }

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(query, (input) => {
        rl.close();
        resolve(input);
      });
    });
  }
  async inputPurchasePrice(retry) {
    while (retry !== 0) {
      try {
        const price = await this.readLineAsync(MESSAGE_PURCHASE_PRICE);
        this.validator.validInputNumber(price);
        retry = 0;
        return parseInt(price, RADIX_INTEGER);
      } catch (error) {
        console.log(error.message);
        retry--;
      }
    }
  }

  async inputWinningNumbers(retry) {
    while (retry === 0) {
      try {
        const numbers = await this.readLineAsync(MESSAGE_WINNING_NUMBERS);
        this.validator.validWinningNumberSplitComma(numbers);
        const splitNumbers = numbers.split(',').map((number) => {
          this.validator.validInputNumber(number);
          return parseInt(number, RADIX_INTEGER);
        });
        return splitNumbers;
      } catch (error) {
        console.log(error.message);
        retry--;
      }
    }
  }

  async inputBonusNumber(retry) {
    while (retry !== 0) {
      try {
        const number = await this.readLineAsync(MESSAGE_BONUS_NUMBER);
        this.validator.validInputNumber(number);
        return parseInt(number, RADIX_INTEGER);
      } catch (error) {
        console.log(error.message);
        retry--;
      }
    }
  }

  async inputRestartOrNot(retry) {
    while (retry !== 0) {
      try {
        const restart = await this.readLineAsync(MESSAGE_RESTART_OR_NOT);
        this.validator.validateLottoRestart(restart);
        return restart.toLowerCase();
      } catch (error) {
        console.log(error.message);
        retry--;
      }
    }
  }

  outputPurchasedLottos(lottos) {
    lottos.forEach((lotto) => {
      console.log('lottos', lotto);
    });
  }

  outputLottosResult(lottoResult, percent) {
    console.log('당첨 통계');
    console.log('--------------------');

    const result_5th = filterArray(lottoResult, LOTTO_5TH_PRIZE_WINNER);
    const result_4th = filterArray(lottoResult, LOTTO_4TH_PRIZE_WINNER);
    const result_3rd = filterArray(lottoResult, LOTTO_3RD_PRIZE_WINNER);
    const result_sec = filterArray(lottoResult, LOTTO_SECOND_PRIZE_WINNER);
    const result_first = filterArray(lottoResult, LOTTO_FIRST_PRIZE_WINNER);

    console.log(`3개 일치 (5,000원) - ${result_5th}개`);
    console.log(`4개 일치 (50,000원) - ${result_4th}개`);
    console.log(`5개 일치 (1,500,000원) - ${result_3rd}개`);
    console.log(`5개 일치, 보너스 볼 일치 (30,000,000원) - ${result_sec}개`);
    console.log(`6개 일치 (2,000,000,000원) - ${result_first}개`);

    console.log(`총 수익률은 ${percent}% 입니다.`);
  }
}

export default LottoIO;