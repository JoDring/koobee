<template>
    <router-view></router-view>
</template>
<script>
    export default {
        name: 'Lottery',
        data() {
            return {}
        }
    }
</script>
<style lang="less">
    @primary: #ffeeef;
    @secondary: #db1517;
    @success: #05a0ac;

    @btn-color: #db1517;
    @bg: #da151a;

    /*rem 适配wexin ui css fix*/
    .award-dialog {
        width: 100%;
        height: 100%;
        .weui-dialog {
            overflow-x: hidden;
            overflow-y: scroll;
        }
        .close {
            position: absolute;
            top: (30/@rem)*1rem;;
            right: (30/@rem)*1rem;
            fill: #fff;
        }
        /*实物*/
        .form-big {
            width: (720/@rem)*1rem;
            height: (1000/@rem)*1rem;
            background: url('../../static/images/lottery/snow/award-bgs/form-big.webp') no-repeat center;
            background-size: (720/@rem)*1rem;
            position: relative;
            top: 0;
            bottom: 0;
            margin: auto;
            .btn-c {
                width: 100%;
                padding: 0 2.2rem;
                position: absolute;
                top: 10.56rem;
                box-sizing: border-box;
                opacity: 0;
                .weui-btn_primary {
                    background: #fd4f7e;
                    &:active {
                        background: lighten(#fd4f7e, 5%);
                    }
                }
                &.hasSubmit {
                    opacity: 1;
                }
            }

            &.form-sm {
                background-image: url('../../static/images/lottery/snow/award-bgs/form-sm.webp');
                .btn-c {
                    top: 8.90rem;
                }
            }
            &.note {
                background-image: url('../../static/images/lottery/snow/award-bgs/note.webp');
                top: 1.3rem;
                .btn-c {
                    top: 8.20rem;
                }
            }
            &.integral {
                background-image: url('../../static/images/lottery/snow/award-bgs/integral.webp');
                top: 1.3rem;
                .btn-c {
                    top: 7.7rem;
                }
            }
            &.none {
                background-image: url('../../static/images/lottery/snow/award-bgs/none.webp');
                top: 1.3rem;
                .btn-c {
                    top: 7.50rem;
                }
            }
        }

        //表格
        .dialog-form {
            position: absolute;
            width: (440/@rem)*1rem;
            top: (400/@rem)*1rem;
            left: 50%;
            transform: translate(-50%, 0);
            .weui-cells, .weui-cell {
                margin: 0;
                background: transparent;
                &::before, &::after {
                    display: none;
                }
            }
            .weui-cell {
                padding: 0 0 (15/@rem)*1rem 0;
                &.weui-cell_warn {
                    .weui-cell__bd {
                        border-color: #ff5252;
                    }
                }
            }
            .weui-cell__bd {
                //border: 1px solid @success;
                border-color: transparent;
                border-radius: (9/@rem)*1rem;
                overflow: hidden;
                padding: 0 6px;
                background: #fff;
                color: #666;
            }
            .weui-input {
                height: (52/@rem)*1rem;
                line-height: (54/@rem)*1rem;
                font-size: (28/@rem)*1rem;
            }
            .dialog-form-title {
                color: #ff5252;
                font-size: (36/@rem)*1rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding-bottom: (18/@rem)*1rem;
            }
            .dialog-form-label {
                display: inline-block;
                width: (150/@rem)*1rem;
                text-align: left;
                color: @success;
                font-size: (30/@rem)*1rem;
                white-space: nowrap;
                line-height: .75rem
            }
            .star {
                color: #ea416d;
                padding-right: 1px;
                font-size: 12px;
            }
        }
    }
</style>

