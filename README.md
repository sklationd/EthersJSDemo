# Ethers.js

## Features

- 메타마스크 지갑 연결
- 보유 ETH 확인
- 보유 WETH(ERC-20 Token) 확인

## To-Do

- [x] 메타마스크 지갑 연결
  - [x] 지갑 변경 시 업데이트
  - [x] 네트워크 변경 시 업데이트
  - [ ] 지갑 여러개 사용 시 계정 전환 안정성
  - [x] 연결 완료 되면 연결 버튼 비활성화
- [ ] 최근 트랜잭션
- [ ] ETH 관련 가격
  - [ ] 현재 USD / ETH 가격 ( Chainlink ? )
  - [x] 보유 ETH 확인
  - [ ] ETH 전송
- [ ] ERC-20 관련 기능
  - [ ] 가능 한 경우 현재 USD / Token 가격 ( Chainlink ? )
  - [ ] 이름, 심볼 직접 입력하지 말고 읽어와서 출력, 기타 메타데이터도 출력
  - [ ] ERC-20 Approve
  - [ ] ERC-20 Transfer
  - [x] 보유 토큰 확인
- [x] ERC-721 관련 기능
  - [x] 보유한 ERC-721 리스트 업
- [ ] UI/UX 개선
  - [ ] **React + Material UI로 마이그레이션**
  - [ ] 버튼 누르면 로딩하는거 보여주기
  - [ ] navigation 추가
- [ ] ENS를 이용해서 컨트랙트 불러오기?
  - [ ] 불러온다면 어떤 포맷으로?
- [ ] MVC 패턴으로 변경하기

## Reference

- [Ethers.js Official Docs](https://docs.ethers.io/v5)
- [MetaMask Docs](https://docs.metamask.io/guide)
- [MetaMask Detect Provider](https://github.com/MetaMask/detect-provider)
- [ENS](https://ens.domains/ko/)
- [Pinata](https://docs.pinata.cloud/)
- [IPFS](https://ipfs.io/)
- [ERC-721](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721)
- [ERC-20](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20)
- [OpenZeppelin Wizard](https://wizard.openzeppelin.com/)
