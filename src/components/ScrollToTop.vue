<template>
    <div class="scrollToTop"
         v-show="scrollTop > 150"
         @click="handleClick">
        <x-icon type="arrow-up-a" size="30" style="fill:#009def;"></x-icon>
    </div>
</template>

<script>
    export default {
        name: 'scroll-to-top',
        data() {
            return {
            }
        },
        props: {
            scroller: {
                type: Object,
                required: true
            },
            scrollTop: {
                type: Number,
                default: 0
            }
        },
        methods: {
            handleClick() {
                if (this.scroller) {
                    this.scroller.scrollTo(0, 0, false)
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .scrollToTop {
        position: fixed;
        z-index: 9999;
        right: 20px;
        background: #fff;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 1px 1px 1px #ccc;
        bottom: 60px;
    }
</style>
