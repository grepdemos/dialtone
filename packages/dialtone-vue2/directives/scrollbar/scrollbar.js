import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';

export const DtScrollbarDirective = {
  name: 'dt-scrollbar-directive',
  install (Vue) {
    OverlayScrollbars.plugin(ClickScrollPlugin);
    Vue.directive('dt-scrollbar', {
      inserted (el, binding) {
        OverlayScrollbars({
          target: el,
          elements: {
            viewport: el.children[0],
          },
        }, {
          scrollbars: {
            autoHide: `${binding.arg || 'leave'}`,
            clickScroll: true,
            autoHideDelay: `${!binding.arg || binding.arg === 'leave' ? 0 : 1300}`,
          },
        });
        el.setAttribute('data-overlayscrollbars-initialize', true);
        el.classList.add('d-scrollbar');
      },
    });
  },
};

export default DtScrollbarDirective;
