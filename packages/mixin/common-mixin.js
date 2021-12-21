import { v4 as uuidv4 } from "uuid";

export default {
  props: {
    prop: {
      type: Object,
      default() {
        return {};
      },
    },
    platform: {
      type: String,
      default: 'web'
    }
  },
  data() {
    return {
      id: "",
    };
  },
  beforeMount() {
    this.id = "cid_" + uuidv4();
  },
};
