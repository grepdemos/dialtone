<template>
  <dt-stack gap="600">
    <div>
      <h3>
        With user status
      </h3>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="active"
        avatar-seed="JN"
        avatar-alt="Avatar person"
        :avatar-src="$attrs.avatarSrc"
        user-status="Good Morning! :smile:"
        call-button-tooltip="Call"
      />
    </div>
    <div>
      <h3>
        with away presence
      </h3>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="away"
        avatar-seed="JN"
        avatar-alt="Avatar person"
        presence-text="Away"
        user-status="Out for a bit"
        :avatar-src="$attrs.avatarSrc"
        call-button-tooltip="Call"
      />
    </div>
    <div>
      <h3>
        with busy presence
      </h3>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="busy"
        avatar-seed="JN"
        avatar-alt="Avatar person"
        presence-text="In a meeting"
        user-status="Meetings all day"
        :avatar-src="$attrs.avatarSrc"
        call-button-tooltip="Call"
      />
    </div>
    <div>
      <h3>
        With unread count
      </h3>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="active"
        avatar-seed="JN"
        avatar-alt="Avatar person"
        :avatar-src="$attrs.avatarSrc"
        unread-count="5"
        unread-count-tooltip="55 unread messages"
        :has-unreads="true"
        call-button-tooltip="Call"
      />
    </div>
    <div>
      <h3>
        Selected
      </h3>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="active"
        avatar-seed="JN"
        avatar-alt="Avatar person"
        :avatar-src="$attrs.avatarSrc"
        :selected="true"
        call-button-tooltip="Call"
      />
    </div>
    <div>
      <h3>
        With initial
      </h3>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="active"
        avatar-seed="JN"
        avatar-alt="Avatar person"
        call-button-tooltip="Call"
      />
    </div>
    <div>
      <h3>
        With icon
      </h3>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="active"
        avatar-seed="JN"
        avatar-alt="Avatar person"
        call-button-tooltip="Call"
        :no-initials="true"
      />
    </div>
    <div>
      <h3>
        With emojis in the name
      </h3>
      <dt-recipe-contact-row
        name=":smile: :fire: Jaqueline Nackos"
        avatar-presence="active"
        avatar-seed="JN"
        avatar-alt="Avatar person"
        :avatar-src="$attrs.avatarSrc"
        user-status="Good Morning! :smile:"
        call-button-tooltip="Call"
      />
    </div>
  </dt-stack>
</template>

<script>
import DtRecipeContactRow from './contact_row.vue';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtRecipeContactRowVariants',
  components: { DtRecipeContactRow, DtStack },
};
</script>
