<script lang="ts">
  import {Vue} from 'vue-property-decorator'

  export default Vue.extend({
    name: 'yj-aside-title',
    functional: true,
    props: {icon: String, title: String},
    render(h, context) {
      const {icon, title} = context.props
      const vnodes = []
      if (icon) {
        vnodes.push(h('i', {class: ['yj-icon-area', icon]}))
      }
      if (title) {
        vnodes.push(h('span', {class: ['yj-aside-title'], slot: 'title'}, title))
      }
      return vnodes
    }
  })
</script>
