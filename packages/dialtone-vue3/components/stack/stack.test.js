import { shallowMount } from '@vue/test-utils';
import DtStack from './stack.vue';

const baseSlots = {
  default: `<div data-qa="default-content">Test 1</div> <div>Test 2</div>`,
};

let mockSlots = {};

describe('DtStack Tests', () => {
  let wrapper;
  let defaultContent;

  const updateWrapper = () => {
    wrapper = shallowMount(DtStack, {
      slots: { ...baseSlots, ...mockSlots },
    });

    defaultContent = wrapper.find('[data-qa="default-content"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When stack renders', () => {
      it('stack exist', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('content should exist', () => {
        expect(defaultContent.exists()).toBe(true);
      });
    });
  });

  describe('When `direction` prop is provided with', () => {
    describe('expected string value', () => {
      it('should set the proper class and override the default value', async () => {
        await wrapper.setProps({ direction: 'row' });

        expect(wrapper.classes('d-stack', 'd-stack--row')).toBe(true);
      },
      );
    });

    describe('non expected string value', () => {
      it('should do not add inexistent class', async () => {
        await wrapper.setProps({ direction: 'invalid' });

        expect(wrapper.classes().includes('d-stack--invalid')).toBe(false);
      });
    });

    describe('expected object value', () => {
      it('should set proper responsive classes', async () => {
        await wrapper.setProps({
          direction: {
            sm: 'column',
            lg: 'column-reverse',
            md: 'row-reverse',
            xl: 'row',
          },
        });

        expect(wrapper.classes(
          'd-stack--sm-column',
          'd-stack--md-row-reverse',
          'd-stack--lg-column-reverse',
          'd-stack--xl-row',
        )).toBe(true);
      });

      describe('When `default` is provided', () => {
        it('should override the default value', async () => {
          await wrapper.setProps({ direction: { default: 'row-reverse' } });

          expect(wrapper.classes('d-stack', 'd-stack--row')).toBe(true);
        });
      });
    });

    describe('non expected object value', () => {
      describe('When is provided with non expected breakpoint value', () => {
        it('should do not add inexistent breakpoint class', async () => {
          await wrapper.setProps({ direction: { invalid: 'column' } });

          expect(wrapper.classes().includes('d-stack--invalid-column')).toBe(false);
        });
      });

      describe('When `default` is provided with non expected direction value', () => {
        it('should do not add inexistent direction class', async () => {
          await wrapper.setProps({ direction: { default: 'roww' } });

          expect(wrapper.classes().includes('d-stack--roww')).toBe(false);
        });
      });
    });
  });

  describe('When `as` prop is provided', () => {
    it('should use it as the HTML element of stack', async () => {
      await wrapper.setProps({ as: 'section' });

      expect(wrapper.element.tagName).toBe('SECTION');
    });
  });

  describe('When `gap` prop is provided with', () => {
    describe('valid string value', () => {
      it('should set proper gap class', async () => {
        await wrapper.setProps({ gap: '300' });

        expect(wrapper.classes().includes('d-stack--gap-300')).toBe(true);
      });
    });

    describe('non valid string value', () => {
      it('should not set gap class', async () => {
        await wrapper.setProps({ gap: '123' });

        expect(wrapper.classes().includes('d-stack--gap-123')).toBe(false);
      });
    });

    describe('expected object value', () => {
      it('should set proper responsive classes', async () => {
        await wrapper.setProps({
          gap: {
            sm: '200',
            md: '400',
            lg: '500',
            xl: '600',
          },
        });

        expect(wrapper.classes(
          'd-stack--sm-gap-200',
          'd-stack--md-gap-400',
          'd-stack--lg-gap-500',
          'd-stack--xl-gap-600',
        )).toBe(true);
      });

      describe('When `default` is provided', () => {
        it('should override the default value', async () => {
          await wrapper.setProps({ gap: { default: '500' } });

          expect(wrapper.classes('d-stack', 'd-stack--gap-500')).toBe(true);
        });
      });
    });

    describe('non expected object value', () => {
      describe('When is provided with non expected breakpoint value', () => {
        it('should do not add inexistent breakpoint class', async () => {
          await wrapper.setProps({ gap: { invalid: '400' } });

          expect(wrapper.classes().includes('d-stack--invalid-gap-400')).toBe(false);
        });
      });

      describe('When `default` is provided with non expected direction value', () => {
        it('should do not add inexistent direction class', async () => {
          await wrapper.setProps({ gap: { default: '900' } });

          expect(wrapper.classes().includes('d-stack--gap-900')).toBe(false);
        });
      });
    });
  });
});
