import { action } from '@storybook/addon-actions';
import { DtCollapsible } from './';
import { createRenderConfig } from '@/common/storybook_utils';

import DtCollapsibleDefaultStory from './collapsible_default.story.vue';

export const argsData = {
  anchorText: 'Click me to toggle Content',
  onOpened: action('opened'),
};

const argTypesData = {
  // Slots
  anchor: {
    control: 'text',
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

  // Props
  anchorText: {
    description: 'Text on the anchor if slot is unused.',
    table: {
      type: { summary: 'string' },
    },
    control: {
      type: 'text',
    },
  },

  id: {
    table: {
      defaultValue: { summary: 'generated unique ID' },
    },
  },

  open: {
    control: {
      type: 'boolean',
    },
  },

  // Action Event Handlers
  onOpened: {
    table: {
      disable: true,
    },
  },

  opened: {
    description: 'Emitted whenever the content is collapsed or expanded.',
    table: {
      type: { summary: 'event' },
    },
  },
  'update:open': {
    table: {
      disable: true,
    },
  },
};

export default {
  title: 'Components/Collapsible',
  component: DtCollapsible,
  argTypes: argTypesData,
  args: argsData,
  excludeStories: /.Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DtCollapsible, DtCollapsibleDefaultStory, argsData),

  args: {
    maxWidth: '512px',
  },
};
