<template>
  <div
    v-if="defaultIcon || $slots.default"
    aria-hidden="true"
    class="d-notice__icon"
  >
    <!-- @slot Slot for the main content -->
    <slot>
      <component
        :is="defaultIcon"
        size="400"
      />
    </slot>
  </div>
</template>

<script>
import {
  DtIconInfo,
  DtIconCheckCircle,
  DtIconAlertTriangle,
  DtIconAlertCircle,
  DtIconBell,
} from '@dialpad/dialtone-icons/vue2';
import { NOTICE_KINDS } from './notice_constants.js';

const kindToIcon = new Map([
  ['info', DtIconInfo],
  ['success', DtIconCheckCircle],
  ['warning', DtIconAlertTriangle],
  ['error', DtIconAlertCircle],
  ['base', DtIconBell],
]);

export default {
  name: 'DtNoticeIcon',

  components: {
    DtIconInfo,
    DtIconCheckCircle,
    DtIconAlertTriangle,
    DtIconAlertCircle,
    DtIconBell,
  },

  props: {
    /**
     * Kind of icon
     * @values base, error, info, success, warning
     */
    kind: {
      type: String,
      default: 'base',
      validate (kind) {
        return NOTICE_KINDS.includes(kind);
      },
    },
  },

  computed: {
    defaultIcon () {
      return kindToIcon.get(this.kind);
    },
  },
};
</script>
