<template>
  <dt-stack gap="600">
    <div>
      <h3 class="d-mb8">
        Channel with unread messages
      </h3>
      <dt-recipe-general-row
        type="channels"
        description="Channel name 😄"
        unread-count="29"
        unread-count-tooltip="29 unread messages"
      />
      <div class="d-mt8 d-fc-secondary d-fs-100">
        <strong>Note:</strong> the unread count is not limited to 99 or any number so make sure to add the necessary
        logic to limit the number of unread messages if needed.
      </div>
    </div>
    <div>
      <h3 class="d-mb8">
        Contact Center
      </h3>
      <dt-recipe-general-row
        type="contact center"
        description="Contact Center name"
        color="magenta-200"
      />
    </div>
    <div>
      <h3 class="d-mb8">
        Dialbot
      </h3>
      <dt-recipe-general-row
        type="dialbot"
        description="Dialbot"
      />
    </div>
    <div>
      <h3>
        Channel with unread messages
      </h3>
      <dt-recipe-general-row
        type="channels"
        unread-count="1"
        :has-unreads="true"
        description="Channel name"
      />
    </div>
    <div>
      <h3>
        Channel only show unread mentioned count with 'always' setting
      </h3>
      <dt-recipe-general-row
        type="channels"
        unread-mention-count="1"
        channel-setting="always"
        :has-unreads="true"
        description="Channel name"
      />
    </div>
    <div>
      <h3>
        Channel show unread mentioned count with other than 'always' setting
      </h3>
      <dt-recipe-general-row
        type="channels"
        unread-mention-count="1"
        channel-setting="mention"
        :has-unreads="true"
        description="Channel name"
      />
    </div>
    <div>
      <h3>
        Channel show both unread and unread mention count
      </h3>
      <dt-recipe-general-row
        type="channels"
        unread-count="4"
        :has-unreads="true"
        unread-mention-count="1"
        description="Channel name"
      />
    </div>
    <div>
      <h3>
        Contact Center with DND and unread count
      </h3>
      <dt-recipe-general-row
        type="contact center"
        dnd-text="DND"
        unread-count="1"
        :has-unreads="true"
        description="Long contact center name"
        color="magenta-200"
      />
    </div>
    <div>
      <h3>
        Contact Center with active voice chat
      </h3>
      <dt-recipe-general-row
        :active-voice-chat="true"
        description="Long contact center name :smile: with emoji"
        color="magenta-200"
      />
    </div>
  </dt-stack>
</template>

<script>
import DtRecipeGeneralRow from './general_row.vue';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtRecipeGeneralRowVariants',
  components: { DtRecipeGeneralRow, DtStack },
};
</script>
