import dateFormat from '@/index';
import { Calendar } from '@/Calendar';
import enUS from '../locale/en-US.json';

dateFormat.install(
  {
    prototype: {}
  },
  {
    locale: enUS.code,
    locales: [enUS]
  }
);

describe('Date Format', () => {
  const date = new Date('2020-12-27T08:06:10.941Z');

  it('G - Era designator', async () => {
    expect(dateFormat.format('G GG GGG GGGG GGGGG', date)).toBe('A AD Anno Domini Anno Domini Anno Domini');
  });

  it('y - Year', async () => {
    expect(dateFormat.format('y yy yyy yyyy yyyyy', date)).toBe('2020 20 2020 2020 02020');
  });

  it('Y - Week year', async () => {
    expect(dateFormat.format('Y YY YYY YYYY YYYYY', date)).toBe('2020 20 2020 2020 02020');
    expect(dateFormat.format('Y YY YYY YYYY YYYYY', new Date('2021-01-03T08:06:10.941Z'))).toBe(
      '2020 20 2020 2020 02020'
    );
    expect(dateFormat.format('Y YY YYY YYYY YYYYY', new Date('2021-01-04T08:06:10.941Z'))).toBe(
      '2021 21 2021 2021 02021'
    );
  });

  it('M - Month in year', async () => {
    expect(dateFormat.format('M MM MMM MMMM MMMMM', date)).toBe('12 12 D Dec December');
  });

  it('w - Week in year', async () => {
    // default ISO 8601
    expect(dateFormat.format('w ww www wwww wwwww', new Date('2021-01-06'))).toBe('1 01 001 0001 00001');
    // gregorian
    expect(
      dateFormat.format('w ww www wwww wwwww', new Date('2021-01-06'), {
        minimalDaysInFirstWeek: 1
      })
    ).toBe('2 02 002 0002 00002');
    expect(
      dateFormat.format('w ww www wwww wwwww', new Date('2020-02-29'), {
        minimalDaysInFirstWeek: 1
      })
    ).toBe('9 09 009 0009 00009');
    expect(
      dateFormat.format('w ww www wwww wwwww', new Date('2020-02-29'), {
        minimalDaysInFirstWeek: 1,
        firstDayOfWeek: Calendar.SUNDAY
      })
    ).toBe('9 09 009 0009 00009');
  });

  it('W - Week in month', async () => {
    expect(dateFormat.format('W WW WWW WWWW WWWWW', new Date('2021-01-18'))).toBe('4 04 004 0004 00004');
  });

  it('D - Day in year', async () => {
    expect(dateFormat.format('D DD DDD DDDD DDDDD', date)).toBe('362 362 362 0362 00362');
  });

  it('d - Day in month', async () => {
    expect(dateFormat.format('d dd ddd dddd ddddd', date)).toBe('27 27 027 0027 00027');
  });

  it('F - Day of week in month', async () => {
    expect(dateFormat.format('F FF FFF FFFF FFFFF', date)).toBe('4 04 004 0004 00004');
    expect(dateFormat.format('F FF FFF FFFF FFFFF', new Date('2020-12-07'))).toBe('1 01 001 0001 00001');
    expect(dateFormat.format('F FF FFF FFFF FFFFF', new Date('2020-08-06'))).toBe('1 01 001 0001 00001');
    expect(
      dateFormat.format('F FF FFF FFFF FFFFF', new Date('2020-08-04'), {
        firstDayOfWeek: Calendar.SUNDAY
      })
    ).toBe('1 01 001 0001 00001');
  });

  it('E - Day name in week', async () => {
    expect(dateFormat.format('E EE EEE EEEE EEEEE', date)).toBe('S Sun Sunday Sunday Sunday');
  });

  it('u - Day number of week', async () => {
    expect(dateFormat.format('u uu uuu uuuu uuuuu', date)).toBe('7 07 007 0007 00007');
    expect(
      dateFormat.format('u uu uuu uuuu uuuuu', date, {
        firstDayOfWeek: Calendar.SUNDAY
      })
    ).toBe('1 01 001 0001 00001');
  });

  it('a - Am/pm marker', async () => {
    expect(dateFormat.format('a aa aaa aaaa aaaaa', date)).toBe('PM PM PM PM PM');
    expect(dateFormat.format('a aa aaa aaaa aaaaa', new Date('2020-12-27T01:06:10.941Z'))).toBe('AM AM AM AM AM');
  });

  it('H - Hour in day', async () => {
    expect(dateFormat.format('H HH HHH HHHH HHHHH', date)).toBe('15 15 015 0015 00015');
    expect(dateFormat.format('H HH HHH HHHH HHHHH', new Date('2020-12-27T17:06:10.941Z'))).toBe('0 00 000 0000 00000');
  });

  it('k - Hour in day (1-24)', async () => {
    expect(dateFormat.format('k kk kkk kkkk kkkkk', date)).toBe('15 15 015 0015 00015');
    expect(dateFormat.format('k kk kkk kkkk kkkkk', new Date('2020-12-27T17:06:10.941Z'))).toBe('24 24 024 0024 00024');
  });

  it('K - Hour in am/pm (0-11)', async () => {
    expect(dateFormat.format('K KK KKK KKKK KKKKK', date)).toBe('3 03 003 0003 00003');
    expect(dateFormat.format('K KK KKK KKKK KKKKK', new Date('2020-12-27T06:06:10.941Z'))).toBe('1 01 001 0001 00001');
  });

  it('h - Hour in am/pm (1-12)', async () => {
    expect(dateFormat.format('h hh hhh hhhh hhhhh', date)).toBe('3 03 003 0003 00003');
    expect(dateFormat.format('h hh hhh hhhh hhhhh', new Date('2020-12-27T05:06:10.941Z'))).toBe('12 12 012 0012 00012');
  });

  it('m - Minute in hour', async () => {
    expect(dateFormat.format('m mm mmm mmmm mmmmm', date)).toBe('6 06 006 0006 00006');
  });

  it('s - Second in minute', async () => {
    expect(dateFormat.format('s ss sss ssss sssss', date)).toBe('10 10 010 0010 00010');
  });

  it('S - Millisecond', async () => {
    expect(dateFormat.format('S SS SSS SSSS SSSSS', date)).toBe('941 941 941 0941 00941');
  });

  it('z - General time zone', async () => {
    expect(dateFormat.format('z zz zzz zzzz zzzzz', date)).toBe('GMT+7 GMT+7 GMT+7 Indochina Time Indochina Time');
    expect(
      dateFormat.format('z zz zzz zzzz zzzzz', date, {
        timeZone: 'UTC'
      })
    ).toBe('UTC+0 UTC+0 UTC+0 Coordinated Universal Time Coordinated Universal Time');
    expect(
      dateFormat.format('z zz zzz zzzz zzzzz', date, {
        timeZone: 25200000
      })
    ).toBe('UTC+7 UTC+7 UTC+7 Coordinated Universal Time Coordinated Universal Time');
  });

  it('Z - RFC 2822 time zone', async () => {
    expect(dateFormat.format('Z ZZ ZZZ ZZZZ ZZZZZ', date)).toBe('+0700 +0700 +0700 +0700 +0700');
  });

  it('X - ISO 8601 time zone', async () => {
    expect(dateFormat.format('X XX XXX', date)).toBe('+07 +0700 +07');
  });
});
