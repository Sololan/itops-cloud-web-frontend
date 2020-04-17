<template>
    <div class="yj-list">
        <div class="yj-list-header">
            <span class="yj-title">{{title}}</span>
        </div>
        <div class="yj-list-body">
            <template v-if="data && data.length">
                <div class="list-body-scroll">
                    <ul class="yj-list-ul">
                        <template v-for="dataInfo in data">
                            <li class="yj-list-li" :class="{'yj-active': selectedItem[dataValue] === dataInfo[dataValue]}"
                                @click="handleItemClick(dataInfo)">
                                <span class="yj-label" :title="dataInfo[dataLabel]">{{dataInfo[dataLabel]}}</span>
                            </li>
                        </template>
                    </ul>
                </div>
            </template>
            <template v-else>
                <div class="yj-empty">
                    <span>暂无数据</span>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class YjList extends Vue {
        @Prop() value!: any
        @Prop() title!: string
        @Prop() data!: any[]
        @Prop() dataLabel!: string
        @Prop() dataValue!: string

        get selectedItem() {
            return this.value
        }

        set selectedItem(val) {
            this.$emit('input', val)
        }

        handleItemClick(dataInfo: any): void {
            this.selectedItem = dataInfo
            this.$emit('change', dataInfo)
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .yj-list {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05);

        &-header {
            flex: none;
            height: 60px;
            padding: 0 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #EAEDF4;

            .yj-title {
                font-size: 16px;
                font-weight: bold;
                @include overflow-ellipsis;
            }
        }

        &-body {
            flex: auto;
            height: 0;
            background-color: #fff;

            .list-body-scroll {
                height: 100%;
                overflow-x: hidden;
                overflow-y: auto;
            }

            .yj-list-ul {
                margin: 0;
                padding: 0;
                list-style: none;
            }

            .yj-list-li {
                height: 60px;
                padding: 0 40px;
                display: flex;
                align-items: center;

                &:nth-child(even) {
                    background-color: #FAFAFA;
                }

                &.yj-active {
                    background-color: $-table-current-row-background-color;
                }

                &:hover {
                    background-color: $-table-row-hover-background-color;
                }
            }

            .yj-label {
                @include overflow-ellipsis
            }
        }
    }
</style>
