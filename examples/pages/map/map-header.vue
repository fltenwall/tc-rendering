<template>
  <div class="map-header">
    <van-dropdown-menu
      active-color="#323233"
      class="dropdown"
      :value="activeDropdown"
    >
      <van-dropdown-item
        title-class="dropdown-title"
        :title="activeAreaName"
        ref="area"
        @open="toggleDropdown('area', true)"
        @close="toggleDropdown('area', false)"
      >
        <div class="select">
          <div class="select-country">
            <span>全国</span>
          </div>
          <van-tree-select
            :items="cityList"
            :active-id.sync="activeCityId"
            :main-active-index="activeIndex"
            @click-nav="clickNav"
          />
        </div>
        <div class="btn-box">
          <van-button class="btn" type="default" @click="clearAll('area')"
            >清空</van-button
          >
          <van-button class="btn" type="info" @click="confirm('area')"
            >确定</van-button
          >
        </div>
      </van-dropdown-item>
      <van-dropdown-item
        title-class="dropdown-title"
        title="项目类型"
        ref="project"
        @open="toggleDropdown('project', true)"
        @close="toggleDropdown('project', false)"
      >
        <van-checkbox-group v-model="projectResult" @change="projectChange">
          <van-checkbox
            v-for="item in projectList"
            :key="item.key"
            :name="item.key"
          >
            <template #icon="props">
              <span
                class="checkbox-item"
                :class="props.checked ? 'checkbox-item--checked' : ''"
                >{{ item.name }}</span
              >
            </template>
          </van-checkbox>
        </van-checkbox-group>
        <div class="btn-box">
          <van-button class="btn" type="default" @click="clearAll('project')"
            >清空</van-button
          >
          <van-button class="btn" type="info" @click="confirm('project')"
            >确定</van-button
          >
        </div>
      </van-dropdown-item>
    </van-dropdown-menu>
    <van-icon name="search" size="20px" />
  </div>
</template>

<script>
export default {
  name: "map-header",
  props: {
    dataList: {
      type: Array,
      default() {
        return [];
      },
    },
    projectList: {
      type: Array,
      default() {
        return [];
      },
    },
    activeId: {
      type: String,
      require: true,
    },
    selectProject: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      activeDropdown: "",
    };
  },
  computed: {
    cityList() {
      return this.dataList.reduce(
        (pre, current) => {
          const result = {
            id: current.name,
            text: current.name,
            className: "tree-select-item",
            children: (current.children || []).reduce(
              (pre, current) => {
                const result = {
                  id: current.name,
                  text: current.name,
                };
                return pre.concat(result);
              },
              [
                {
                  id: current.name,
                  text: "不限",
                },
              ]
            ),
          };
          return pre.concat(result);
        },
        [
          {
            id: "0",
            text: "不限",
            className: "tree-select-item",
            children: [
              {
                id: "0-n",
                text: "不限",
              },
            ],
          },
        ]
      );
    },
    activeAreaName() {
      console.log(this.activeId, '-------')
      // let activeArr = this.activeId.split("-");
      // if (activeArr[1] === "n") {
      //   if (activeArr[0] === "0") return "全国";
      //   return this.dataList[activeArr[0] - 1].name;
      // } else {
      //   return this.dataList[activeArr[0] - 1].children[activeArr[1]].name;
      // }
      return this.activeId
    },
    activeCityId: {
      get() {
        return this.activeId;
      },
      set(val) {
        console.log(val, '-----set----')
        this.$emit("update:activeId", val);
      },
    },
    projectResult: {
      get() {
        return this.selectProject;
      },
      set(val) {
        this.$emit("update:selectProject", val);
      },
    },
    activeIndex() {
      return 0
    },
  },
  methods: {
    clearAll(type) {
      this.$refs[type].toggle();
      this.$emit("clearAll");
    },
    clickNav(index) {
      this.activeCityId = this.cityList[index].text;
    },
    confirm(type) {
      this.$refs[type].toggle();
      this.$emit("confirm", this.activeDropdown);
    },
    projectChange() {
      if (this.projectResult.length > 1) {
        if (this.projectResult[0] === "all") return this.projectResult.shift();
        if (this.projectResult[this.projectResult.length - 1] === "all") {
          this.projectResult.splice(0, this.projectResult.length - 1);
        }
      }
    },
    toggleDropdown(type, bool) {
      this.$emit('toggleDropdown', bool)
      if (bool) {
        this.activeDropdown = type
      } else {
        this.activeDropdown = ''
      }
    }
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.map-header {
  display: flex;
  align-items: center;
  padding-right: 10px;
  justify-content: space-between;
  // position: absolute;
  // top: 0;
  // left: 0;
  // width: 100%;
  box-sizing: border-box;
  background: #fff;
  padding-top: 15px;
  .dropdown {
    width: 45%;
    @{deep} {
      .van-dropdown-menu__bar {
        box-shadow: none;
        height: 40px;
      }
      .van-dropdown-menu__title::after {
        display: none;
      }
      .van-dropdown-menu__title::before {
        position: absolute;
        top: 50%;
        right: -4px;
        opacity: 0.8;
        border: 3px solid;
        content: "";
        border-color: transparent transparent currentColor currentColor;
        transform: rotate(270deg);
      }
      .van-overlay {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
  @{deep} {
    .van-tree-select {
      flex: 1;
    }
    .van-sidebar {
      background: #fafafa;
      width: 150px;
      padding-left: 5px;
    }
    .tree-select-item {
      width: 100%;
      height: 49px;
      text-align: center;
      background: none;
      border-bottom: 1px solid #ebedf0;
      &::before {
        display: none;
      }
    }
    .van-sidebar-item--select {
      background: none;
      color: #1989fa;
    }
    .van-tree-select__item--active {
      color: #1989fa;
    }
    .van-tree-select__content {
      padding-left: 5px;
      .van-ellipsis {
        border-bottom: 1px solid #ebedf0;
      }
    }
    .van-checkbox__icon {
      height: 100%;
    }
    .van-checkbox-group {
      padding-right: 5px;
      height: 300px;
      display: flex;
      flex-wrap: wrap;
    }
  }
  .select {
    display: flex;
    .select-country {
      width: 70px;
      height: 300px;
      text-align: center;
      font-size: 14px;
      line-height: 30px;
      color: #1989fa;
      box-sizing: border-box;
      padding-top: 10px;
      background-color: #f7f8fa;
      span {
        position: relative;
        &::before {
          content: "·";
          position: absolute;
          top: -5px;
          font-size: 30px;
          right: -12px;
        }
      }
    }
  }
  .btn-box {
    display: flex;
    border-top: 1px solid #ebedf0;
    padding: 10px 15px;
    justify-content: space-between;
    .btn {
      width: 150px;
      height: 32px;
      border-radius: 6px;
    }
  }
  .checkbox-item {
    display: inline-block;
    width: 50px;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 4px;
    margin-left: 5px;
    background-color: #e9e3e3;
    &--checked {
      background-color: #4fa1f3;
      color: #fff;
    }
  }
}
</style>
