import request from '../util/request'
// ---抽奖
export function clearTestCache() {
    return request({
        url:'http://192.168.1.148:8090/appstore/record/clear',
        method: 'get'
    })
}
export function fetchLotteryDetail(params) {
    return request({
        url:'appstore/web/api/detail',
        method: 'get',
        params
    })
}
export function fetchLotteryMyAwards(params) {
    return request({
        url:'appstore/web/api/myawards',
        method: 'get',
        params
    })
}
export function fetchLotteryRecords(params) {
    return request({
        url:'appstore/web/api/records',
        method: 'get',
        params
    })
}