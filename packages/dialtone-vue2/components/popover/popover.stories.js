import {
  DtPopover,
  POPOVER_PADDING_CLASSES,
  POPOVER_ROLES,
  POPOVER_CONTENT_WIDTHS,
  POPOVER_INITIAL_FOCUS_STRINGS,
} from './';
import PopoverDefault from './popover_default.story.vue';
import PopoverVariants from './popover_variants.story.vue';
import PopoverIframe from './popover_iframe.story.vue';
import { createRenderConfig } from '@/common/storybook_utils';

import { action } from '@storybook/addon-actions';
import { POPOVER_DIRECTIONS, POPOVER_STICKY_VALUES } from './popover_constants';

// Default Props for all variations
export const argsData = {
  placement: 'bottom-end',
  contentWidth: null,
  sticky: false,
  offset: [0, 4],
  appendTo: 'body',
  onOpened: action('opened'),
  visuallyHiddenCloseLabel: 'Close popover',
};

export const argTypesData = {
  // Slots
  anchor: {
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  content: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  headerContent: {
    name: 'headerContent',
    description: 'Slot for popover header content',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },
  footerContent: {
    name: 'footerContent',
    description: 'Slot for popover footer content',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  padding: {
    options: Object.keys(POPOVER_PADDING_CLASSES),
    control: {
      type: 'select',
    },
  },
  initialFocusElement: {
    options: [...Object.values(POPOVER_INITIAL_FOCUS_STRINGS), '#content-close'],
    control: {
      type: 'select',
    },
  },
  role: {
    options: POPOVER_ROLES,
    control: {
      type: 'select',
    },
  },
  placement: {
    options: POPOVER_DIRECTIONS,
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'bottom-end',
      },
    },
  },
  contentWidth: {
    options: POPOVER_CONTENT_WIDTHS,
    control: {
      type: 'select',
    },
  },
  sticky: {
    options: POPOVER_STICKY_VALUES,
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'false',
      },
    },
  },
  transition: {
    options: ['', 'fade', 'pop', 'shake'],
    control: {
      type: 'select',
    },
  },
  appendTo: {
    table: {
      defaultValue: {
        summary: 'body',
      },
    },
  },
  hideOnClick: {
    control: {
      type: 'boolean',
    },
  },
  modal: {
    control: {
      type: 'boolean',
    },
  },
  open: {
    control: {
      type: 'boolean',
    },
  },
  openOnContext: {
    control: {
      type: 'boolean',
    },
  },
  openWithArrowKeys: {
    control: {
      type: 'boolean',
    },
  },
  showCloseButton: {
    control: {
      type: 'boolean',
    },
  },
  tether: {
    control: {
      type: 'boolean',
    },
  },
  visuallyHiddenClose: {
    control: {
      type: 'boolean',
    },
  },

  // Events
  onOpened: {
    table: {
      disable: true,
    },
  },

  'update:open': {
    table: {
      disable: true,
    },
  },

  opened: {
    description: `emitted when popover is shown or hidden.`,
    table: {
      type: {
        summary: 'event',
      },
    },
  },
};

export default {
  title: 'Components/Popover',
  component: DtPopover,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DtPopover, PopoverDefault, argsData),

  args: {},

  decorators: [
    () => ({
      template: `<div class="d-d-flex d-jc-center d-ai-center d-h332"><story /></div>`,
    }),
  ],

  parameters: {},
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtPopover, PopoverVariants, argsData),

  args: {},

  parameters: {
    options: {
      showPanel: false,
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-allowed-attr',
            enabled: false,
          },
        ],
      },
    },

    percy: {
      args: {
        open: true,
      },
    },
  },
};

export const IframeTest = {
  render: (argsData) => createRenderConfig(DtPopover, PopoverIframe, argsData),

  args: {
    placement: 'top-end',
  },

  parameters: {
    options: {
      showPanel: false,
    },

    percy: {
      args: {
        open: true,
      },
    },
  },
};
