import { createRenderConfig } from '@/common/storybook_utils';
import { ICON_SIZE_MODIFIERS } from '@/components/icon/icon_constants';
import DtEmojiTextWrapper from './emoji_text_wrapper.vue';

import DtEmojiTextWrapperDefaultTemplate from './emoji_text_wrapper_default.story.vue';
import DtEmojiTextWrapperVariantsTemplate from './emoji_text_wrapper_variants.story.vue';

// Default Prop Values
export const argsData = {
  size: '500',
};

/**
 * example prop description decorator
 */
export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'string | VNode',
      },
    },
  },

  // Props
  size: {
    options: Object.keys(ICON_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  elementType: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'div' },
    },
    control: {
      type: 'text',
    },
  },
};

// Story Collection
export default {
  title: 'Components/Emoji Text Wrapper',
  component: DtEmojiTextWrapper,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DtEmojiTextWrapper, DtEmojiTextWrapperDefaultTemplate, argsData),

  args: {
    default:
      'Some text with :invalid-emoji: :smile: :cry: and 😄, and custom emojis :octocat: :shipit:',
  },
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtEmojiTextWrapper, DtEmojiTextWrapperVariantsTemplate, argsData),

  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
