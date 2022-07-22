import puppeteer from 'puppeteer-core'
import os from 'os'
import fs from 'fs'

const macUrl = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const whidowsUrl = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
const currentOs = os.type()
const launchConfig = {
	headless: false,
	defaultViewport: null,
	ignoreDefaultArgs: ['--disable-extensions'],
	args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications', '--disable-extensions'],
	executablePath: currentOs == 'Darwin' ? macUrl : whidowsUrl
}

const kangList = ['cheolwon','hwacheon','inje','yanggu','goseoung','sokcho','hongcheon','chuncheon','yangyang','gangneung','hwingseong','wonju','pyeongchang','jeongseon','donghae','yeongwol','samcheok','taebaek',]
let browser = null

async function init () {
	console.log('start')
	browser = await puppeteer.launch(launchConfig)

	let promiseArr = []

	kangList.forEach((sigungu) => {
		promiseArr.push(task(sigungu))
	})

	await Promise.all(promiseArr)
	console.log('end')
}


async function task( sigungu ) {
	
	const page = await browser.newPage()
	await page.on('dialog', async function (dialog) {
		await dialog.accept()
	})

	await page.goto('https://www.pharm114.or.kr/common_files/sub2_page2.asp?addr1=%B0%AD%BF%F8%B5%B5')
	
	await page.waitForTimeout(3000)
	await page.waitForSelector(`#container li.${sigungu} a`)

	await page.evaluate((sigungu) => {
		document.querySelector(`#container li.${sigungu} a`).click()
	}, sigungu)

	// TODO

	const waitSec = Math.floor((Math.random() * (10-3+1)) + 3) * 1000


	await page.waitForTimeout(waitSec)

	await page.close()
	console.log(sigungu, 'END')
}



init()

