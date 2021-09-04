import { isPlainObject, get } from '@vue-formily/util';
import { Calendar, CalendarOptions, parseTime } from './Calendar';

export type Locale = {
  code: string;
  localize?: Record<string, any>;
};
export type DateFormatOptions = CalendarOptions & {
  locales?: Locale[];
};

// - (\w)\1* matches any sequences of the same letter
// - '' matches two quote characters in a row
// - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
//   except a single quote symbol, which ends the sequence.
const formattingTokensRegExp = /(\w)\1*|''|'(''|[^'])+('|$)|./g;
const escapedStringRegExp = /^'([^]*?)'?$/;
const doubleQuoteRegExp = /''/g;

function zeroPad(input: string | number, targetLength: number) {
  const num = +input;
  const sign = num < 0 ? '-' : '';
  const length = ('' + Math.abs(num)).length;

  return targetLength > length
    ? `${sign}${Array(targetLength)
        .concat([Math.abs(num)])
        .join('0')
        .slice(-targetLength)}`
    : '' + input;
}

function cleanEscapedString(input: string) {
  const match = input.match(escapedStringRegExp);
  return match ? match[1].replace(doubleQuoteRegExp, "'") : input;
}

function formatYear(input: number, token: string) {
  const length = token.length;

  return zeroPad(length === 2 ? ('' + input).slice(-2) : input, length) + '';
}

const _lengthNames = ['narrow', 'short', 'long'];

function getLengthName(length: number) {
  return _lengthNames[Math.min(2, length > 0 ? length - 1 : 0)];
}

function weekInMonth(cal: Calendar) {
  const dow = cal.getDayOfWeek();
  const remain = cal.day - dow;

  return Math.floor(remain > 0 ? 1 + remain / 7 + (remain % 7 !== 0 ? 1 : 0) : 1);
}

function localize(path: string, { locales = [], locale }: DateFormatOptions = {}) {
  const _locale = locales.find(loc => loc.code === locale) || ({} as any);
  const value = get(path, _locale.localize);

  return value !== undefined ? '' + value : path;
}

const formatters: Record<string, any> = {
  // Era designator, e.g, AD
  G(cal: Calendar, token: string) {
    return `era_${getLengthName(token.length)}[${cal.year < 0 ? 1 : 0}]`;
  },
  // Year, e.g, 2021; 21
  y(cal: Calendar, token: string) {
    return formatYear(cal.year, token);
  },
  // Week year, e.g, 2009; 09
  Y(cal: Calendar, token: string) {
    return formatYear(cal.getWeekYear(), token);
  },
  // Month in year, e.g, July; Jul; 07
  M(cal: Calendar, token: string) {
    const length = token.length;

    if (length === 1) {
      return '' + cal.month;
    } else if (length === 2) {
      return zeroPad(cal.month, 2);
    }

    return `month_${getLengthName(token.length - 2)}[${cal.month - 1}]`;
  },
  // Week in year, e.g, 27
  w(cal: Calendar, token: string) {
    return zeroPad(cal.getWeekInYear(), token.length);
  },
  // Week in month, e.g, 2
  W(cal: Calendar, token: string) {
    return zeroPad(weekInMonth(cal), token.length);
  },
  // Day in year, e.g, 231
  D(cal: Calendar, token: string) {
    return zeroPad(cal.getDayInYear(), token.length);
  },
  // Day in month, e.g, 12
  d(cal: Calendar, token: string) {
    return zeroPad(cal.day, token.length);
  },
  // Day of week in month, e.g, 2 (2nd thursday in month)
  F(cal: Calendar, token: string) {
    const wim = weekInMonth(cal);
    const dow = cal.getDayOfWeek();
    const firstDowInMonth = new Calendar(new Date(cal.year, cal.month - 1, 1), {
      firstDayOfWeek: cal.firstDayOfWeek
    }).getDayOfWeek();

    return zeroPad(wim - (dow < firstDowInMonth ? 1 : 0), token.length);
  },
  // Day name in week, e.g, Tuesday; Tue
  E(cal: Calendar, token: string) {
    return `weekday_${getLengthName(token.length)}[${cal.getDayOfWeek() - 1}]`;
  },
  // Day number of week (1 = Monday, ..., 7 = Sunday)
  u(cal: Calendar, token: string) {
    return zeroPad(cal.getDayOfWeek(), token.length);
  },
  // Am/pm marker
  a(cal: Calendar) {
    return cal.hour < 12 ? 'AM' : 'PM';
  },
  // Hour in day (0-23)
  H(cal: Calendar, token: string) {
    return zeroPad(cal.hour, token.length);
  },
  // Hour in day (1-24)
  k(cal: Calendar, token: string) {
    return zeroPad(cal.hour === 0 ? 24 : cal.hour, token.length);
  },
  // Hour in am/pm (0-11)
  K(cal: Calendar, token: string) {
    return zeroPad(cal.hour % 12, token.length);
  },
  // Hour in am/pm (1-12)
  h(cal: Calendar, token: string) {
    const h = cal.hour % 12;
    return zeroPad(h === 0 ? 12 : h, token.length);
  },
  // Minute in hour
  m(cal: Calendar, token: string) {
    return zeroPad(cal.minute, token.length);
  },
  // Second in minute
  s(cal: Calendar, token: string) {
    return zeroPad(cal.second, token.length);
  },
  // Millisecond
  S(cal: Calendar, token: string) {
    return zeroPad(cal.millisecond, token.length);
  },
  // General time zone, e.g, Pacific Standard Time; PST; GMT-08:00
  z(cal: Calendar, token: string) {
    const length = token.length;
    const isShort = length < 4;
    const format: 'long' | 'short' = isShort ? 'short' : 'long';
    let name = cal.getTimeZoneName({ format });

    if (cal.timeZone === 'UTC' && isShort) {
      const { hours, minutes, sign } = parseTime(cal.offset);
      name += `${sign}${hours}${minutes > 0 ? `:${minutes}` : ''}`;
    }

    return name;
  },
  // RFC 2822 time zone, e.g, -0800
  Z(cal: Calendar) {
    const offset = cal.offset;
    const { sign, hours, minutes } = parseTime(offset);

    return `${sign}${zeroPad(hours, 2)}${zeroPad(minutes, 2)}`;
  },
  // ISO 8601 time zone, e.g, -08; -0800; -08:00
  X(cal: Calendar, token: string) {
    const offset = cal.offset;

    if (offset === 0) {
      return 'Z';
    }

    const { sign, hours, minutes } = parseTime(offset);
    const length = token.length;
    const lead = `${sign}${zeroPad(hours, 2)}`;

    if (length === 1) {
      return lead;
    } else if (length === 2) {
      return `${lead}${zeroPad(minutes, 2)}`;
    } else if (length === 3) {
      return `${lead}${minutes > 0 ? `:${zeroPad(minutes, 2)}` : ''}`;
    }

    throw new RangeError(`invalid ISO 8601 format: length=${length}`);
  }
};

function formatDate(format: string, date: number | Date, options?: DateFormatOptions) {
  return format.replace(formattingTokensRegExp, (token: string) => {
    if (token === "''") {
      return "'";
    }

    const firstCharacter = token[0];

    if (firstCharacter === "'") {
      return cleanEscapedString(token);
    }

    const formatter = formatters[firstCharacter];

    if (formatter) {
      return localize(formatter(new Calendar(date, options), token), options);
    }

    return token;
  });
}

function mergeOptions(defaultOtions: Record<string, any>, options?: Record<string, any>) {
  return { ...defaultOtions, ...options };
}

export default {
  name: 'date-format',
  format(format: string, date: number | Date | Record<string, any>, options?: DateFormatOptions) {
    if (isPlainObject(date) && (date as any).formType === 'field') {
      const { value, options = {} } = date as any;
      return formatDate(format, value, mergeOptions(this.options, options.i18n));
    }

    return formatDate(format, date as number | Date, mergeOptions(this.options, options));
  },
  install(Objeto: any, options = {}) {
    this.options = mergeOptions(this.options, options);

    Objeto.prototype.$dateFormat = this;
  },
  options: {} as DateFormatOptions
};
