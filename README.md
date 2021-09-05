<p align="center">
  <a href="https://vue-formily.netlify.app/plugins/date-format" target="_blank">
    <img width="320" src="./.github/logo.png">
  </a>
</p>
<br>

Simple date format plugin for [**vue-formily**](https://vue-formily.netlify.app).

## Links
- [📚 &nbsp; Documentation](https://vue-formily.netlify.app/plugins/date-format)

## Installation
### NPM
```sh
# install with yarn
yarn add @vue-formily/date-format

# install with npm
npm install @vue-formily/date-format --save
```

### CDN
You can use **date-format** plugin with a script tag and a CDN, import the library like this:

```html
<script src="https://unpkg.com/@vue-formily/date-format@latest"></script>
```

This will inject a `DateFormatPlugin` global object, which you will use to access the various methods exposed by the plugin or register to [**vue-formily**](https://vue-formily.netlify.app).

If you are using native ES Modules, there is also an ES Modules compatible build:

```html
<script type="module">
  import dateFormat from 'https://unpkg.com/@vue-formily/date-format@latest/dist/date-format-plugin.esm.js'
</script>
```

For locales:
```html
<!-- Get the en-US locale -->
<script src="https://unpkg.com/@vue-formily/date-format@latest/dist/locale/en-US.json"></script>
```

### Set Up

```typescript
import Vue from 'vue';
import VueFormily from '@vue-formily/formily';
import dateFormat from '@vue-formily/date-format';

VueFormily.plug(dateFormat, {} as DateFormatOptions);
Vue.use(VueFormily);
```

## Options
```typescript
type Locale = {
  code: string;
  localize?: Record<string, any>;
}

type DateFormatOptions = {
  // 1 -> 7 ~ monday -> sunday
  firstDayOfWeek?: number;
  // 1 -> 7
  minimalDaysInFirstWeek?: number;
  timeZone?: string | number;
  locale?: string;
  locales?: Locale[];
};
```

## Basic Usage
### Stand Along
```typescript
import dateFormat from '@vue-formily/date-format';
import enUS from '@vue-formily/date-format/locale/en-US';

// Set locale to en-US
dateFormat.options.locale = enUS.code;
// Register global locales
dateFormat.options.locales = [enUS];

const date = new Date('2020-12-27T08:06:10.941Z');

dateFormat.format("yyyy.MM.dd G 'at' HH:mm:ss z", date); // 2020.12.27 A at 15:06:10 GMT+7
dateFormat.format('yyyyy.MMMMM.dd GGG hh:mm aaa', date); // 02020.December.27 Anno Domini 03:06 PM
dateFormat.format("EEE, MMMM d, ''yy", date); // Sunday, Dec 27, '20
dateFormat.format("h:mm a", date); // 3:06 PM
dateFormat.format("hh 'o''clock' a, zzzz", date); // 03 o'clock PM, Indochina Time
dateFormat.format("K:mm a, z", date); // 3:06 PM, GMT+7
dateFormat.format("yyyy-MM-dd'T'HH:mm:ss.SSSZ", date); // 2020-12-27T15:06:10.941+0700
dateFormat.format("yyyy-MM-dd'T'HH:mm:ss.SSSXXX", date); // 2020-12-27T15:06:10.941+07
```

### In Vue Formily's [Field](https://vue-formily.netlify.app/api/field)
After installing **Date Format Plugin**, we can use the `format` option in the [FieldSchema](https://vue-formily.netlify.app/api/field#constructor).  Note that the **schema's type** has to be `date`.

```typescript
// Sample schema
{
  formId: 'time',
  // Type has te be date
  type: 'date',
  format: 'K:mm a, z'
}
```

For a deeper understanding, please check the [formatting example](https://vue-formily.netlify.app/examples/formatting).

## Contributing
You are welcome to contribute to this project, but before you do, please make sure you read the [Contributing Guide](https://github.com/vue-formily/formily/blob/main/.github/CONTRIBUTING.md).

## License
[MIT](./LICENSE)
