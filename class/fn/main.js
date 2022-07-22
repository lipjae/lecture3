/**
 * 
 * @param { string } any 
 */
function trashBucket (anything) {
	console.log(`${anything} 를(을) 버립니다.`)
}
// const trashBucket = function () {
// 	console.log(`${anything} 를(을) 버립니다.`)
// }



/**
 * americano
 * mocha
 * greenTea
 * choco
 */
/**
 * 
 * @param { string } type 커피종류
 * @param { isHot } isHot 아이스 or 핫
 */
function instantCoffeeMachine (type, isHot) {
	const desc = isHot ? 'hot' : 'cold'

	const result = `선택한 ${type}(${desc}) 음료가 나왔습니다.`

	return result
}

/**
 * 
 * @param { string } type 커피종류
 * @param { boolean } isHot 아이스 or 핫
 * @param { callback } complete 커피나왔습니다~
 */
function coffeeMachine (type, isHot, complete) {
	const start = 3
	const end = 10
	const completeTime = Math.floor((Math.random() * (end-start+1)) + start) * 1000

	setTimeout(function(){

		const desc = isHot ? 'hot' : 'cold'
		complete(`선택한 ${type}(${desc}) 음료가 나왔습니다.`)

	}, completeTime)
}





