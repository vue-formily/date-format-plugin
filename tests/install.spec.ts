import { createLocalVue, mount } from '@vue/test-utils';
import VueFormily, { createFormily } from '@vue-formily/formily';
import dateFormat from '@/.';
import vi from '../locale/vi.json';

describe('Installation', () => {
  let localVue: any;

  beforeEach(() => {
    localVue = createLocalVue();
  });

  const date = new Date('2020-12-27T08:06:10.941Z');

  it('Should install by vue-formily `plug` method successfully', async () => {
    const formily = createFormily();

    formily.plug(dateFormat);

    localVue.use(formily);

    const wrapper = mount(
      {
        template: '<div></div>'
      },
      {
        localVue
      }
    );

    const vm = wrapper.vm as any;

    vm.$formily.addForm({
      formId: 'test',
      fields: [
        {
          formId: 'a',
          type: 'date',
          value: date,
          format: 'yyyy',
          on: {
            validated(field: any) {
              expect(field.formatted).toBe('2020');
            }
          }
        }
      ]
    });
  });

  test('Install with options successfully', async () => {
    const formily = createFormily();

    formily.plug(dateFormat, {
      locales: [vi],
      locale: 'vi'
    });

    localVue.use(formily);

    const wrapper = mount(
      {
        template: '<div></div>'
      },
      {
        localVue
      }
    );

    const vm = wrapper.vm as any;

    vm.$formily.addForm({
      formId: 'test',
      fields: [
        {
          formId: 'a',
          type: 'date',
          value: date,
          format: 'MMMMM',
          on: {
            validated(field: any) {
              expect(field.formatted).toBe('Tháng Mười Hai');
            }
          }
        }
      ]
    });
  });

  test('Set options in schema', async () => {
    const formily = createFormily();

    formily.plug(dateFormat, {
      locales: [vi]
    });

    localVue.use(formily);

    const wrapper = mount(
      {
        template: '<div></div>'
      },
      {
        localVue
      }
    );

    const vm = wrapper.vm as any;

    vm.$formily.addForm({
      formId: 'test',
      fields: [
        {
          formId: 'a',
          type: 'date',
          value: date,
          format: 'MMMMM',
          options: {
            dateFormat: {
              locale: 'vi'
            }
          },
          on: {
            validated(field: any) {
              expect(field.formatted).toBe('Tháng Mười Hai');
            }
          }
        }
      ]
    });
  });
});
