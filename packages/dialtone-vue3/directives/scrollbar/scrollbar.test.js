import { mount } from '@vue/test-utils';
import { DtScrollbarDirective } from './scrollbar.js';
import { OverlayScrollbars } from 'overlayscrollbars';

const WrapperComponent = {
  name: 'wrapper-component',
  template: `
    <div v-dt-scrollbar><div id="viewport"></div></div>
  `,
};

describe('DtScrollbarDirective Tests', () => {
  let wrapper;
  let viewportElement;

  const updateWrapper = () => {
    wrapper = mount(WrapperComponent, {
      global: {
        plugins: [DtScrollbarDirective],
      },
    });

    viewportElement = wrapper.find('#viewport').element;
  };

  afterEach(() => {
    wrapper.unmount();
  });

  beforeEach(() => {
    OverlayScrollbars.mockClear();
  });

  beforeAll(() => {
    // Mock the overlayscrollbars plugin
    vi.mock('overlayscrollbars', () => {
      const mockPlugin = vi.fn(); // Mock the plugin method
      const OverlayScrollbarsMock = vi.fn().mockImplementation(() => ({}));
      OverlayScrollbarsMock.plugin = mockPlugin;
      return {
        OverlayScrollbars: OverlayScrollbarsMock,
        ClickScrollPlugin: vi.fn(),
      };
    });
  });

  describe('Presentation Tests', () => {
    describe('when scrollbars directive is present', () => {
      beforeEach(() => {
        updateWrapper();
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should setup directive', () => {
        expect(OverlayScrollbars).toHaveBeenCalledWith(
          {
            target: wrapper.element,
            elements: {
              viewport: viewportElement,
            },
          },
          { scrollbars: { autoHide: 'leave', clickScroll: true, autoHideDelay: '0' } });
        expect(OverlayScrollbars).toHaveBeenCalledTimes(1);
        expect(wrapper.element.getAttribute('data-overlayscrollbars-initialize')).toBe('true');
        expect(wrapper.element.classList.contains('d-scrollbar')).toBe(true);
      });
    });
  });
});
