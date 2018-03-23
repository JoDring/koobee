import request from '../util/request'

export function fetchHome(data) {
    return request({
        url:'appstore/html/api/home',
        method: 'post',
        data
    })
}
export function fetchNeed(data) {
    return request({
        url:'appstore/html/api/need',
        method: 'post',
        data
    })
}
export function fetchGame(data) {
    return request({
        url:'appstore/html/api/game',
        method: 'post',
        data
    })
}
export function fetchRank(data) {
    return request({
        url:'appstore/html/api/rank',
        method: 'post',
        data
    })
}
export function fetchCategory(data) {
    return request({
        url:'appstore/html/api/category',
        method: 'post',
        data
    })
}
export function fetchCategoryList(data) {
    return request({
        url:'appstore/html/api/category/list',
        method: 'post',
        data
    })
}
// 搜索结果
export function fetchSearchResult(data) {
    return request({
        url:'appstore/html/api/search/result',
        method: 'post',
        data
    })
}
// 下拉提示
export function fetchSearchMatch(data) {
    return request({
        url:'appstore/html/api/search/match',
        method: 'post',
        data
    })
}
export function fetchSearchHotWords() {
    return request({
        url:'appstore/html/api/search/hotwords',
        method: 'post'
    })
}
// 资讯
export function fetchInformationList(data) {
    return request({
        url:'appstore/html/api/information/list',
        method: 'post',
        data
    })
}
export function fetchInformationDetail(data) {
    return request({
        url:'appstore/html/api/information/detail',
        method: 'post',
        data
    })
}