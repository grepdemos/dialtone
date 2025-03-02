import DtIcon from './icon.vue';
import { mount } from '@vue/test-utils';

const baseProps = { name: 'accessibility' };

let mockProps = {};

describe('DtIcon Tests', () => {
  let wrapper;
  let icon;

  const updateWrapper = async () => {
    wrapper = mount(DtIcon, {
      props: { ...baseProps, ...mockProps },
    });
    await vi.dynamicImportSettled();

    icon = wrapper.find('[data-qa="dt-icon"]');
  };

  beforeEach(async () => {
    await updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the accessibility icon', () => {
      expect(wrapper).toBeDefined();
      expect(icon.classes().includes('d-icon--accessibility')).toBe(true);
    });

    describe('When size prop is not set', () => {
      it('Should have default class', () => {
        expect(icon.classes().includes('d-icon--size-500')).toBe(true);
      });
    });

    describe('When size prop is set', () => {
      it('Should have correct class', async () => {
        mockProps = { size: '800' };

        await updateWrapper();

        expect(icon.classes().includes('d-icon--size-800')).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When ariaLabel prop is set', () => {
      beforeEach(async () => {
        mockProps = { ariaLabel: 'icon description' };

        await updateWrapper();
      });

      it('sets the aria-label attribute', () => {
        expect(icon.attributes()['aria-label']).toBe('icon description');
      });

      it('sets aria-hidden to false', () => {
        expect(icon.attributes()['aria-hidden']).toBe('false');
      });
    });
  });
});
