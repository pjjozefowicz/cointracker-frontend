
function roundNumber(num) {
    num = parseFloat(num)
    return Math.round((num + Number.EPSILON) * 100) / 100
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function percent_of_total(num, total) {
    if (total === 0) {
        return 0
    } else {
        return num / total * 100
    }
}

function percent_change(from, to) {
    if (from === 0) {
        return 0
    } else {
        return (to - from) / from * 100
    }
}

function number_after_prc_change(number, prc_change) {
    return ((prc_change / 100) * number) + number
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export { roundNumber, numberWithCommas, percent_of_total, percent_change, number_after_prc_change, capitalizeFirstLetter }