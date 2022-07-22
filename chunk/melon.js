var trList = document.querySelectorAll("#frm > div > table > tbody tr")
var returnData = []
trList.forEach(el => {
    const tdArr = el.querySelectorAll('td')
    const regx = /[^0-9]/g
    returnData.push({
        'rank': tdArr[1].innerText.replaceAll('\n', ''),
        'img': tdArr[3].querySelector('img').src,
        'title': tdArr[5].querySelector('.ellipsis.rank01').innerText,
        'subTitle': tdArr[5].querySelector('.ellipsis.rank02').innerText,
        'album': tdArr[6].querySelector('.ellipsis.rank03').innerText,
        'likeCount': Number(tdArr[7].querySelector('.cnt').innerText.replace(regx, ''))
    })
})

console.log(returnData)