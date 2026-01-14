<template>
  <div style="width: 100%; padding: 2rem">
    <div class="hbox it-center jus">
      <div class="q-mb-sm flex1"></div>
      <div class="text-caption">
        State :<q-chip outline size="1rem" color="grey-4" text-color="white"
          >미작성</q-chip
        ><q-chip outline size="1rem" color="blue-9" text-color="white"
          >작업중</q-chip
        ><q-chip outline size="1rem" color="orange-9" text-color="white"
          >수정중</q-chip
        ><q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
      </div>
    </div>
    <table class="q-mb-xl">
      <caption>
        초소형전기차 화면
      </caption>
      <thead>
        <tr>
          <th style="width: 150px">1Depth</th>
          <th style="width: 150px">2Depth</th>
          <th style="width: 150px">3Depth</th>
          <th style="width: 150px">4Depth</th>
          <th style="width: 150px">5Depth</th>
          <th style="width: 150px">Route</th>
          <th style="width: 60px">State</th>
          <th style="width: 150px">Comment</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>스플래시</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-001"
              >PDRT-FO-001.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td>앱 실행 시 처음 노출되는 화면</td>
        </tr>
        <tr>
          <td></td>
          <td>권한안내<span class="sub-txt">(+pop)</span></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-002"
              >PDRT-FO-002.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>홈</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-003"
              >PDRT-FO-003.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" outline color="blue-9" text-color="white"
              >진행중</q-chip
            >
          </td>
          <td>디자인 작업 전</td>
        </tr>
        <tr>
          <td></td>
          <td>전화번호 인증</td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-004"
              >PDRT-FO-004.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>인증번호 입력</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-005"
              >PDRT-FO-005.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>휴대폰 본인확인</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-chip size="1rem" outline color="grey-4" text-color="white"
              >미작성</q-chip
            >
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>약관동의</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-008"
              >PDRT-FO-008.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>약관상세</td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-009"
              >PDRT-FO-009.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" outline color="grey-4" text-color="white"
              >미작성</q-chip
            >
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>회원가입완료</td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-010"
              >PDRT-FO-010.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" outline color="grey-4" text-color="white"
              >미작성</q-chip
            >
          </td>
          <td>디자인 작업 전</td>
        </tr>

        <tr>
          <td>메인</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>

          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-011"
              >PDRT-FO-011.vue</q-btn
            >
          </td>
          <td>
            <q-chip outline size="1rem" color="blue-9" text-color="white"
              >작업중</q-chip
            >
          </td>
          <td>디자인 작업 전</td>
        </tr>
        <tr>
          <td></td>
          <td>지도</td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-012"
              >PDRT-FO-012.vue</q-btn
            >
          </td>
          <td>
            <q-chip outline size="1rem" color="orange-9" text-color="white"
              >수정중</q-chip
            >
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>주차장상세</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-201"
              >PDRT-FO-201.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td>장소검색</td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-013"
              >PDRT-FO-013.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" outline color="grey-4" text-color="white"
              >미작성</q-chip
            >
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td>길찾기 결과</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-014"
              >PDRT-FO-014.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" outline color="grey-4" text-color="white"
              >미작성</q-chip
            >
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>경로상세</td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-015"
              >PDRT-FO-015.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" outline color="grey-4" text-color="white"
              >미작성</q-chip
            >
          </td>
          <td></td>
        </tr>

        <tr>
          <td>메뉴</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-100"
              >PDRT-FO-100.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td>포인트관리</td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-101"
              >PDRT-FO-101.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td>포인트관리</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-102"
              >PDRT-FO-102.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td>이용내역</td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-103"
              >PDRT-FO-103.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td>예약 세부 사항</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-104"
              >PDRT-FO-104.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td>이용 내역 상세</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-105"
              >PDRT-FO-105.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td>결제수단 관리</td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-106"
              >PDRT-FO-106.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td>결제 비밀번호</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-107"
              >PDRT-FO-107.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>결제 비밀번호 변경</td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-111"
              >PDRT-FO-111.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td>결제 수단</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-108"
              >PDRT-FO-108.vue</q-btn
            >
          </td>
          <td>
            <q-chip outline size="1rem" color="blue-9" text-color="white"
              >작업중</q-chip
            >
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>결제 카드 등록</td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-109"
              >PDRT-FO-109.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>결제 비밀번호 설정</td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-110"
              >PDRT-FO-110.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td>이벤트</td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-112"
              >PDRT-FO-112.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td>이벤트 상세</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-113"
              >PDRT-FO-113.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td>공지사항</td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-114"
              >PDRT-FO-114.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td>공지사항 상세</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-115"
              >PDRT-FO-115.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td>설정</td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-116"
              >PDRT-FO-116.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td>버전정보</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-117"
              >PDRT-FO-117.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td>이용 약관 및 정책</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-118"
              >PDRT-FO-118.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>약관상세</td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-119"
              >PDRT-FO-119.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td>내용없음</td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td>회사소개</td>
          <td></td>
          <td></td>
          <td>
            <q-btn
              flat
              class="q-pa-none"
              clickable
              tag="a"
              target="_blank"
              to="/pub/Sample-FO-120"
              >PDRT-FO-120.vue</q-btn
            >
          </td>
          <td>
            <q-chip size="1rem" color="grey-9" text-color="white">완료</q-chip>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref } from "vue";
</script>
<style lang="scss" scoped>
html {
  font-size: 10px;
}
table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border: 1px solid #cdcdcd;
  caption {
    overflow: hidden;
    position: absolute;
    top: -1px;
    left: -1px;
    width: 1px;
    height: 1px;
    font-size: 0;
  }
  td,
  th {
    padding: 0.5rem;
    border: 1px solid #cdcdcd;
    font-size: 1.2rem;
    text-align: center;
  }
  thead {
    background-color: #686868;
    color: #fff;
    th {
      font-weight: 500;
    }
  }
  tbody {
    td:last-child {
      font-size: 1rem;
      text-align: left;
    }
    .tbl-hr {
      padding-left: 2rem;
      background: #efefef;
      text-align: left;
      font-weight: 700;
    }
    .q-btn {
      color: $light-blue-9;
      text-decoration: underline;
      font-size: 1.2rem;
      font-weight: 400;
      text-transform: none;
    }
    .left {
      text-align: left !important;
    }
  }
}
.q-drawer-container {
  display: none;
  aside {
    display: none;
    width: 0 !important;
  }
}
.sub-txt {
  display: block;
  font-size: 1.1rem;
}
</style>
