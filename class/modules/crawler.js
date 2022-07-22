import puppeteer from 'puppeteer-core'
import os from 'os'
import fs from 'fs'
import { addressParser } from './parser.js'

const macUrl = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const whidowsUrl = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
const currentOs = os.type()
const launchConfig = {
	headless: true,
	defaultViewport: null,
	ignoreDefaultArgs: ['--disable-extensions'],
	args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications', '--disable-extensions'],
	executablePath: currentOs == 'Darwin' ? macUrl : whidowsUrl
}

// 전역변수 global 
const pageSelector = 'body > table:nth-child(2) > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(5) > td > table:nth-child(5) > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(3)'
let browser = null
let page = null
let pageLength = 0
let finalData = []
let sido = null
let sigungu = null

// 실행 , init
const launch = async function ( arg1, arg2 ) {
	sido = arg1
	sigungu = arg2
	browser = await puppeteer.launch(launchConfig) //브라우저 실행
	// 지역변수	
	const pages = await browser.pages() // 현재 브라우저 페이지들
	page = pages[0]
}

const goto = async function (url) {
	return await page.goto(url)
}

const checkPopup = async function () {
	const pages = await browser.pages()

	await pages.at(-1).close()
}

const evalCode = async function () {
	console.log('evalCode :', sido)
	await page.evaluate(function (sido) {
		document.querySelector(`#continents > li.${sido} > a`).click()
	}, sido)
}

const evalCity = async function () {
	//해당 엘리먼트를 찾을때까지 기다림
	await page.waitForSelector(`#container #continents > li.${sigungu} > a`)

	await page.evaluate(function (sigungu) {
		document.querySelector(`#container #continents > li.${sigungu} > a`).click()
	}, sigungu)
}

const alertClose = async function () {
	return await page.on('dialog', async function (dialog) {
		await dialog.accept()
	})
}

const getPageLength = async function () {
	// 해당 셀렉터 기다림
	await page.waitForSelector(pageSelector)

	pageLength = await page.evaluate(function (pageSelector) {
		const result = document.querySelector(pageSelector).children.length // 7
		return result
	}, pageSelector)

	console.log(pageLength)
}

const getData = async function () {

	//페이지 수 만큼 반복
	for (let i = 1; i <= pageLength; i++) {
		
		await page.waitForSelector(pageSelector)

		const infoArr = await page.evaluate(function (i, sido, sigungu) {

			// 브라우저에서 돌아가는 코드
			var trArr = document.querySelectorAll("#printZone > table:nth-child(2) > tbody tr")
			var returnData = []

			for (var i = 0; i < trArr.length; i++) {
				var currentTr = trArr[i]

				var name = currentTr.querySelector('td')?.innerText.replaceAll('\n', '').replaceAll('\t', '')
				var address = currentTr.querySelectorAll('td')[2]?.innerText.replaceAll('\n', '').replaceAll('\t', '')
				var tel = currentTr.querySelectorAll('td')[3]?.innerText.replaceAll('\n', '').replaceAll('\t', '')
				var open = currentTr.querySelectorAll('td')[4]?.innerText.replaceAll('\n', '').replaceAll('\t', '')

				var jsonData = { name, address, tel, open, sido, sigungu }

				if (jsonData.address != undefined) {
					returnData.push(jsonData)
				}
			} // end for

			return returnData
		}, i, sido, sigungu) // end eval

		finalData = finalData.concat(infoArr)
		console.log(finalData.length)

		if(pageLength != i) {
			// 다음 페이지 이동
			await page.evaluate(function(i, pageSelector) {
				//eval
				document.querySelector(pageSelector).children[i].click()
			}, i, pageSelector) // end eval
			
			await page.waitForSelector('#printZone')
		}
	} // end for

	browser.close()
} // end getData

const writeFile = async function () {

	for(let i=0; i<finalData.length; i++) {
		finalData[i] = await addressParser(finalData[i])
	}

	const stringData = JSON.stringify(finalData) // 문자열로 변환

	// 해당 경로가 존재하는지 확인
	const exist = fs.existsSync(`./json/${sido}`)

	// 경로가 존재하지 않으면 폴더 생성
	if(!exist) {
		fs.mkdir(`./json/${sido}`, { recursive: true }, function(err) {
			console.log(err)
		} )
	}
	
	const filePath = `./json/${sido}/${sigungu}.json`
	await fs.writeFileSync(filePath, stringData)
}

export {
	launch,
	goto,
	checkPopup,
	evalCode,
	alertClose,
	evalCity,
	getPageLength,
	getData,
	writeFile
}