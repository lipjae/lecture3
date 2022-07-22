import axios from "axios"


async function addressParser(address) {
	const res = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
		params: {
			query: '(63510) 제주특별자치도 서귀포시 대정읍 상모로 321 삼성약국',
		},
		headers: {
			Authorization: 'KakaoAK afa8e1b4fe3c001d95c4fe4adf91176a'
		}
	})

    let x, y = 0

    if(res.data.documents.length > 0) {
      x = res.data.documents[0].address.x
      y = res.data.documents[0].address.y
    }

    return { x, y }
}

addressParser()