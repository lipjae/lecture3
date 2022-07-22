import { 
	launch, goto, checkPopup, alertClose, 
	evalCode, evalCity, getPageLength, getData, writeFile 
} from './modules/crawler.js'

async function main () {
	// 브라우저 실행
	await launch('jeju', 'jeju')
	//페이지 이동
	await goto('https://www.pharm114.or.kr/main.asp')

	await checkPopup()

	await evalCode()

	await evalCity()

	await alertClose()

	await getPageLength()
	
	await getData()

	await writeFile()

	process.exit(1)
}

main()