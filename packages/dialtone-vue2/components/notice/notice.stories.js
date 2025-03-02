import { action } from '@storybook/addon-actions';
import DtNotice from './notice.vue';
import { NOTICE_KINDS, NOTICE_ROLES } from './notice_constants';
import NoticeDefault from './notice_default.story.vue';

import { createRenderConfig, getIconNames } from '@/common/storybook_utils';

const iconsList = getIconNames();

// Default Prop Values
export const argsData = {
  onClose: action('close'),
  onClick: action('click'),
  visuallyHiddenCloseLabel: 'Close Notice',
  show: undefined,
};

const argsDataLongText = {
  title: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
  default: `Duis aute irure dolor in reprehenderit in voluptate velit
      esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
};

export const argTypesData = {
  // Slots
  titleOverride: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  icon: {
    options: iconsList,
    table: {
      type: { summary: 'component' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  default: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  action: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },

  // Props
  kind: {
    options: NOTICE_KINDS,
    control: {
      type: 'select',
    },
  },
  role: {
    options: NOTICE_ROLES,
    control: {
      type: 'select',
    },
  },
  show: {
    table: {
      disable: true,
    },
  },
  hideClose: {
    control: {
      type: 'boolean',
    },
  },
  hideIcon: {
    control: {
      type: 'boolean',
    },
  },
  hideAction: {
    control: {
      type: 'boolean',
    },
  },
  important: {
    control: {
      type: 'boolean',
    },
  },
  visuallyHiddenClose: {
    control: {
      type: 'boolean',
    },
  },
  truncateText: {
    control: {
      type: 'boolean',
    },
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },
  onClose: {
    table: {
      disable: true,
    },
  },

  close: {
    description: 'Close button click event',
    table: {
      type: { summary: 'event' },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Notice',
  component: DtNotice,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DtNotice, NoticeDefault, argsData),

  args: {
    title: 'Base title (optional)',
    kind: 'base',
  },
};

export const Error = {
  render: (argsData) => createRenderConfig(DtNotice, NoticeDefault, argsData),

  args: {
    ...Default.args,
    title: 'Error title (optional)',
    kind: 'error',
  },
};

export const Info = {
  render: (argsData) => createRenderConfig(DtNotice, NoticeDefault, argsData),

  args: {
    ...Default.args,
    title: 'Info title (optional)',
    kind: 'info',
  },
};

export const Success = {
  render: (argsData) => createRenderConfig(DtNotice, NoticeDefault, argsData),

  args: {
    ...Default.args,
    title: 'Success title (optional)',
    kind: 'success',
  },
};

export const Warning = {
  render: (argsData) => createRenderConfig(DtNotice, NoticeDefault, argsData),

  args: {
    ...Default.args,
    title: 'Warning title (optional)',
    kind: 'warning',
  },
};

export const Important = {
  render: (argsData) => createRenderConfig(DtNotice, NoticeDefault, argsData),

  args: {
    ...Default.args,
    important: true,
  },
};

export const TruncateContent = {
  render: (argsData) => createRenderConfig(DtNotice, NoticeDefault, argsData),

  args: {
    ...Default.args,
    truncateText: true,
    title: argsDataLongText.title,
    default: argsDataLongText.default,
  },
};
