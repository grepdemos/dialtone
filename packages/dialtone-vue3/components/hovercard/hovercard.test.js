import { mount } from '@vue/test-utils';
import DtHovercard from './hovercard.vue';

const MOCK_DEFAULT_SLOT_MESSAGE = 'Message';
const MOCK_HEADER_CONTENT = 'Hovercard Title';
const MOCK_FOOTER_CONTENT = 'Hovercard Footer';

const baseProps = { id: 'hovercard-1' };
const baseAttrs = {};
const baseSlots = {
  anchor: '<template #anchor="slotProps">' +
            '<button data-qa="dt-button" v-bind="slotProps">Hover me</button>' +
          '</template>',
  content: MOCK_DEFAULT_SLOT_MESSAGE,
  headerContent: MOCK_HEADER_CONTENT,
  footerContent: MOCK_FOOTER_CONTENT,
};

describe('DtHovercard Tests', () => {
  let anchor;
  let hovercardWindow;
  let content;
  let button;
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtHovercard, {
      props: { ...baseProps },
      attrs: { ...baseAttrs },
      slots: { ...baseSlots },
      global: {
        stubs: {
          transition: false,
        },
      },
      attachTo: document.body,
    });

    hovercardWindow = wrapper.find('[data-qa="dt-hovercard"]');
    anchor = wrapper.find('[data-qa="dt-hovercard-anchor"]');
    button = wrapper.find('[data-qa="dt-button"]');
  };

  // Since tippy appends the element to the body, the assertion is done in
  // document insted of the wrapper
  const getHovercardContent = () => document.querySelector('[data-qa="dt-hovercard-content"]');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.runAllTimers();
    updateWrapper();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
    wrapper.unmount();
  });

  describe('Presentation Tests', () => {
    describe('When mouseenter on anchor', () => {
      beforeEach(async () => {
        vi.useFakeTimers();
        await anchor.trigger('mouseenter');
        vi.runAllTimers();
      });

      it('should render the hovercard content', () => {
        content = getHovercardContent();

        expect(content.textContent).toBe(MOCK_DEFAULT_SLOT_MESSAGE);
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should render the anchor slot', () => {
        expect(anchor.text()).toBe('Hover me');
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When mouse leave on anchor', () => {
      it('hovercard is not displayed', async () => {
        vi.useFakeTimers();
        await anchor.trigger('mouseenter');
        await vi.runAllTimers();
        await anchor.trigger('mouseleave');
        await vi.runAllTimers();

        content = getHovercardContent();

        expect(content).toBeNull();
      });
    });

    describe('When mouse enter on hovercard', () => {
      it('should still display the hovercard', async () => {
        await anchor.trigger('mouseenter');
        await hovercardWindow.trigger('mouseenter');
        await vi.runAllTimers();

        content = getHovercardContent();

        expect(content.textContent).toBe(MOCK_DEFAULT_SLOT_MESSAGE);
      });
    });

    describe('When focusin on anchor', () => {
      it('hovercard is not displayed', async () => {
        await anchor.trigger('focusin');

        content = getHovercardContent();

        expect(content).toBeNull();
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When hovercard is open', () => {
      beforeEach(async () => {
        vi.useFakeTimers();
        await anchor.trigger('mouseenter');
      });

      it('shows correct role', () => {
        hovercardWindow = wrapper.find('[data-qa="dt-hovercard__dialog"]');

        expect(hovercardWindow.attributes('role')).toBe('dialog');
      });

      it('aria-controls should be set correctly on the anchor', () => {
        expect(button.attributes('aria-controls')).toBe('hovercard-1');
      });

      it('aria-haspopup should be set correctly on the anchor', () => {
        expect(button.attributes('aria-haspopup')).toBe('dialog');
      });
    });
  });
});
