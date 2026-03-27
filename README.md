# 구독 정산 API

구독 플랜 등록부터 청구서 생성, 정산 처리, 실패 재처리까지 구독형 서비스의 백엔드 정산 흐름을 구현한 REST API 서버입니다.

## 기술 스택

- **Framework**: NestJS (TypeScript)
- **Database**: MySQL (TypeORM)
- **Auth**: JWT
- **Docs**: Swagger (OpenAPI 3.0)
- **Infra**: Docker (로컬 DB)

## 구현 배경

바이크뱅크 재직 시절 구독형 자동결제 시스템과 가상계좌 기반 대량 정산 처리를 직접 구현한 경험을 바탕으로, NestJS 생태계로 재구현했습니다. 실무에서 겪었던 다음 문제들을 반영했습니다.

- 플랫폼사별 정산 방식이 달라 건별 트랜잭션 분리 및 실패 재처리 구조 필요
- 청구 금액 계산 오류 시 고객 청구에 직접 영향을 미치는 리스크
- 미처리 건 일괄 정산 및 합계 검증 구조 필요

## API 구조
```
Auth          POST /auth/register        회원가입
              POST /auth/login           로그인

Plans         GET  /plans                플랜 목록 조회
              POST /plans                플랜 생성
              GET  /plans/:id            플랜 상세 조회
              DELETE /plans/:id          플랜 비활성화

Subscriptions POST /subscriptions        구독 등록
              GET  /subscriptions/my     내 구독 목록
              GET  /subscriptions/:id    구독 상세
              PATCH /subscriptions/:id/plan  플랜 변경
              DELETE /subscriptions/:id  구독 해지

Billing       POST /billing              청구서 생성
              GET  /billing/:id          청구서 상세
              GET  /billing/subscription/:id  구독별 청구서 목록
              GET  /billing/pending/all  미처리 청구서 목록

Settlement    POST /settlement/process/:billId  단건 정산
              POST /settlement/batch            일괄 정산
              POST /settlement/retry/:id        실패 건 재처리
              GET  /settlement                  전체 정산 내역
              GET  /settlement/bill/:billId     청구서별 정산 내역
```

## 로컬 실행 방법

**1. 레포지토리 클론**
```bash
git clone https://github.com/woodycode-dev/subscription-settlement-api.git
cd subscription-settlement-api
```

**2. 패키지 설치**
```bash
npm install
```

**3. 환경변수 설정**
```bash
cp .env.example .env
# .env 파일 수정
```

**4. MySQL 실행 (Docker)**
```bash
docker compose up -d
```

**5. 서버 실행**
```bash
npm run start:dev
```

**6. Swagger 문서 확인**
```
http://localhost:3000/api-docs
```

## 환경변수

| 변수 | 설명 | 예시 |
|------|------|------|
| DB_HOST | DB 호스트 | localhost |
| DB_PORT | DB 포트 | 3306 |
| DB_USERNAME | DB 유저명 | settlement_user |
| DB_PASSWORD | DB 비밀번호 | settlement1234 |
| DB_DATABASE | DB 이름 | settlement_db |
| JWT_SECRET | JWT 시크릿 키 | your-secret-key |
| JWT_EXPIRES_IN | JWT 만료 시간 | 7d |