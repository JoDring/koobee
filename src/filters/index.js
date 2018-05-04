/* 数字 格式化*/
/*export function formatSize(num, digits) {
    const si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'k' }
    ]
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
        }
    }
    return num.toString()
}*/

export function formatSize(val, digits = 2) {
    let fm = '';
    let u = 0;
    while (u < 4 && val > 1024) {
        u++;
        val /= 1024;
    }
    let unit = 'Byte';
    switch (u) {
        case 1:
            unit = 'KB';
            break;
        case 2:
            unit = 'MB';
            break;
        case 3:
            unit = 'GB';
            break;
        case 4:
            unit = 'TB';
    }
    fm += val.toFixed(digits) + unit;
    return fm;
}