# 소담(SODAM) 고도화된 API 명세서

## 개요

소상공인을 위한 상권 진단 및 사업 추천 플랫폼의 완전한 API 명세서입니다.
기존 기본 기능에 더해 **핵심 진단 지표**, **리스크 분류**, **전략 카드**, **지원 도구**, **지도 시각화** 기능이 추가되었습니다.

## 기본 정보

- **Base URL**: `http://localhost:5000/api/v1`
- **Content-Type**: `application/json`
- **인증**: JWT Bearer Token

---

## 🆕 새로 추가된 핵심 기능

### 1. 상권 진단 핵심 지표 API (`/core-diagnosis`)

#### 1.1 유동인구 변화량 분석

**GET** `/core-diagnosis/foot-traffic/<market_code>`

**Query Parameters:**

- `period_months` (optional): 분석 기간 (기본값: 12개월)

**Response:**

```json
{
  "success": true,
  "data": {
    "market_code": "10000",
    "current_monthly_traffic": 195000,
    "average_monthly_change": 2.59,
    "total_change_period": 30.0,
    "trend": "증가",
    "grade": "B",
    "monthly_data": [
      { "month": "2024-01", "traffic": 150000 },
      { "month": "2024-02", "traffic": 145000 }
    ],
    "analysis": "유동인구가 월평균 2.6% 증가하여 양호한 성장세를 보입니다."
  }
}
```

#### 1.2 카드매출 추이 분석

**GET** `/core-diagnosis/card-sales/<market_code>`

**Response:**

```json
{
  "success": true,
  "data": {
    "market_code": "10000",
    "current_monthly_sales": 2950000000,
    "average_monthly_change": 1.6,
    "total_change_period": 18.0,
    "trend": "증가",
    "grade": "B",
    "analysis": "카드매출이 월평균 1.6% 증가하여 양호한 소비 트렌드를 보입니다."
  }
}
```

#### 1.3 동일업종 수 분석

**GET** `/core-diagnosis/same-industry/<market_code>`

**Query Parameters:**

- `industry` (optional): 특정 업종 분석

**Response:**

```json
{
  "success": true,
  "data": {
    "market_code": "10000",
    "industry": "식음료업",
    "business_count": 45,
    "total_businesses": 132,
    "industry_ratio": 34.09,
    "competition_level": "매우 높음",
    "grade": "D",
    "analysis": "동일업종 비율이 34.1%로 경쟁이 매우 치열합니다. 차별화 전략이 필수입니다."
  }
}
```

#### 1.4 창업·폐업 비율 분석

**GET** `/core-diagnosis/business-rates/<market_code>`

**Response:**

```json
{
  "success": true,
  "data": {
    "market_code": "10000",
    "startup_rate": 12.5,
    "closure_rate": 8.3,
    "survival_rate": 91.7,
    "total_score": 66.78,
    "grade": "D",
    "health_status": "우려",
    "analysis": "창업·폐업 비율에 우려가 있어 상권 활력 제고가 필요합니다."
  }
}
```

#### 1.5 체류시간 분석

**GET** `/core-diagnosis/dwell-time/<market_code>`

**Response:**

```json
{
  "success": true,
  "data": {
    "market_code": "10000",
    "average_dwell_time": 45,
    "peak_hours": ["12:00-14:00", "18:00-20:00"],
    "weekend_ratio": 1.3,
    "grade": "B",
    "time_quality": "우수",
    "analysis": "평균 체류시간이 45분으로 우수한 편입니다."
  }
}
```

#### 1.6 상권 건강 점수 종합 산정

**POST** `/core-diagnosis/health-score/<market_code>`

**Request Body:**

```json
{
  "industry": "식음료업"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "market_code": "10000",
    "industry": "식음료업",
    "total_score": 72.69,
    "final_grade": "C",
    "health_status": "보통",
    "score_breakdown": {
      "foot_traffic": { "score": 80, "grade": "B", "weight": 0.25 },
      "card_sales": { "score": 80, "grade": "B", "weight": 0.25 },
      "business_rates": { "score": 66.78, "grade": "D", "weight": 0.25 },
      "dwell_time": { "score": 80, "grade": "B", "weight": 0.15 }
    },
    "recommendations": [
      "상권 상태가 보통 수준입니다. 개선 여지가 있습니다.",
      "유동인구 증가를 위한 마케팅 전략을 검토하세요.",
      "고객 체류시간 연장을 위한 서비스 개선을 고려하세요."
    ]
  }
}
```

#### 1.7 종합 상권 진단

**POST** `/core-diagnosis/comprehensive/<market_code>`

**Request Body:**

```json
{
  "industry": "식음료업"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "market_code": "10000",
    "industry": "식음료업",
    "analysis_timestamp": "2024-01-01T00:00:00Z",
    "indicators": {
      "foot_traffic": {
        /* 유동인구 분석 결과 */
      },
      "card_sales": {
        /* 카드매출 분석 결과 */
      },
      "same_industry": {
        /* 동일업종 분석 결과 */
      },
      "business_rates": {
        /* 창업·폐업 분석 결과 */
      },
      "dwell_time": {
        /* 체류시간 분석 결과 */
      }
    },
    "health_score": {
      /* 건강 점수 결과 */
    },
    "summary": {
      "overall_grade": "C",
      "health_status": "보통",
      "total_score": 72.69,
      "key_insights": [
        "유동인구 변화율: 2.6%",
        "카드매출 변화율: 1.6%",
        "생존률: 91.7%",
        "평균 체류시간: 45분"
      ]
    }
  }
}
```

---

### 2. 리스크 분류 시스템 API (`/risk-classification`)

#### 2.1 4가지 리스크 유형 자동 분류

**POST** `/risk-classification/classify/<market_code>`

**Request Body:**

```json
{
  "industry": "식음료업"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "market_code": "10000",
    "industry": "식음료업",
    "primary_risk_type": "과포화 경쟁형",
    "primary_risk_score": 58.2,
    "risk_level": "보통",
    "risk_breakdown": {
      "유입 저조형": 0.0,
      "과포화 경쟁형": 58.2,
      "소비력 약형": 14.0,
      "성장 잠재형": 0.0
    },
    "secondary_risks": [{ "type": "소비력 약형", "score": 14.0 }],
    "analysis": "동일업종 사업체가 과도하게 많아 경쟁이 치열한 상태입니다. (리스크 점수: 58.2)",
    "recommendations": [
      "차별화된 상품 및 서비스 개발",
      "니치 마켓 타겟팅 전략 수립",
      "고객 충성도 향상 프로그램 도입",
      "경쟁사 분석을 통한 우위 요소 발굴"
    ]
  }
}
```

#### 2.2 특정 리스크 유형 상세 분석

**POST** `/risk-classification/detailed-analysis/<market_code>`

**Request Body:**

```json
{
  "risk_type": "과포화 경쟁형",
  "industry": "식음료업"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "risk_type": "과포화 경쟁형",
    "market_code": "10000",
    "industry": "식음료업",
    "risk_factors": [
      {
        "factor": "동일업종 과밀",
        "impact": "매우 높음",
        "description": "동일업종 사업체가 과도하게 많아 경쟁이 치열합니다.",
        "mitigation": "차별화된 상품 및 서비스 개발을 통한 경쟁 우위 확보"
      }
    ],
    "success_cases": [
      {
        "location": "명동 상권",
        "solution": "브랜드 차별화 및 고급화 전략",
        "result": "평균 단가 30% 상승, 고객 충성도 40% 향상"
      }
    ],
    "action_plan": [
      "1단계: 경쟁사 분석 및 차별화 포인트 발굴 (1개월)",
      "2단계: 차별화 전략 수립 및 실행 (2-3개월)",
      "3단계: 고객 충성도 향상 프로그램 도입 (3-4개월)",
      "4단계: 시장 점유율 확대 및 브랜드 강화 (6개월 후)"
    ]
  }
}
```

#### 2.3 리스크 유형 목록

**GET** `/risk-classification/risk-types`

**Response:**

```json
{
  "success": true,
  "data": {
    "total_risk_types": 4,
    "risk_types": [
      {
        "type": "유입 저조형",
        "description": "유동인구와 매출 증가율이 낮아 상권 활성화가 저조한 상태",
        "key_indicators": ["유동인구 감소", "매출 증가율 둔화", "접근성 부족"],
        "severity_levels": ["낮음", "보통", "높음", "매우 높음"]
      },
      {
        "type": "과포화 경쟁형",
        "description": "동일업종 사업체가 과도하게 많아 경쟁이 치열한 상태",
        "key_indicators": ["동일업종 과밀", "가격 경쟁 심화", "고객 분산"],
        "severity_levels": ["낮음", "보통", "높음", "매우 높음"]
      }
    ]
  }
}
```

#### 2.4 리스크 완화 전략

**GET** `/risk-classification/mitigation-strategies`

**Query Parameters:**

- `risk_type` (optional): 특정 리스크 유형의 전략만 조회

**Response:**

```json
{
  "success": true,
  "data": {
    "risk_type": "과포화 경쟁형",
    "strategies": [
      {
        "strategy": "차별화 전략",
        "description": "경쟁 우위 확보를 위한 차별화된 상품/서비스 개발",
        "effectiveness": "높음",
        "cost": "높음",
        "duration": "3-6개월"
      }
    ]
  }
}
```

---

### 3. 전략 카드 시스템 API (`/strategy-cards`)

#### 3.1 맞춤형 전략 카드 생성

**POST** `/strategy-cards/generate`

**Request Body:**

```json
{
  "market_code": "10000",
  "industry": "식음료업",
  "risk_type": "과포화 경쟁형",
  "user_profile": {
    "userType": "ENTREPRENEUR",
    "businessStage": "PLANNING",
    "capital": 10000000,
    "riskTolerance": "medium",
    "experience": "beginner"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "market_code": "10000",
    "industry": "식음료업",
    "risk_type": "과포화 경쟁형",
    "user_profile": {
      /* 사용자 프로필 */
    },
    "strategy_cards": [
      {
        "strategy_id": "customer_loyalty",
        "strategy_name": "고객 충성도",
        "category": "고객관리",
        "description": "고객 충성도 향상 프로그램",
        "difficulty": "중간",
        "duration": "2-4개월",
        "cost_level": "중간",
        "expected_impact": "재방문율 40-50% 향상",
        "priority": 5,
        "action_tips": [
          "SNS 계정을 활발히 운영하여 브랜드 인지도 향상",
          "지역 이벤트에 참여하여 커뮤니티와의 관계 구축"
        ],
        "success_probability": 70,
        "next_steps": [
          "1. 타겟 고객 분석 및 페르소나 설정",
          "2. 마케팅 예산 계획 수립",
          "3. SNS 계정 개설 및 브랜드 아이덴티티 개발"
        ]
      }
    ],
    "total_strategies": 2,
    "priority_order": ["customer_loyalty", "price_optimization"]
  }
}
```

#### 3.2 전략별 체크리스트

**GET** `/strategy-cards/checklist/<strategy_id>`

**Response:**

```json
{
  "success": true,
  "data": {
    "strategy_id": "marketing_boost",
    "strategy_name": "마케팅 부스터",
    "checklist": [
      {
        "step": 1,
        "task": "타겟 고객 분석 및 페르소나 설정",
        "duration": "1주",
        "status": "pending"
      },
      {
        "step": 2,
        "task": "브랜드 아이덴티티 및 메시지 개발",
        "duration": "2주",
        "status": "pending"
      }
    ],
    "estimated_duration": "2-3개월",
    "difficulty": "중간",
    "required_resources": ["마케팅 예산", "디자인 리소스", "SNS 계정"]
  }
}
```

#### 3.3 성공 사례 조회

**GET** `/strategy-cards/success-cases`

**Query Parameters:**

- `industry` (optional): 업종별 필터
- `strategy_type` (optional): 전략 유형별 필터

**Response:**

```json
{
  "success": true,
  "data": {
    "total_cases": 3,
    "success_cases": [
      {
        "id": "case_001",
        "title": "강남역 카페 '커피앤북' 성공 사례",
        "industry": "식음료업",
        "strategy_type": "differentiation",
        "location": "강남역 상권",
        "challenge": "과포화된 카페 시장에서 차별화 필요",
        "solution": "독서 카페 컨셉으로 전환, 도서 대여 서비스 추가",
        "results": {
          "revenue_increase": "45%",
          "customer_retention": "60%",
          "average_dwell_time": "90분"
        },
        "key_factors": ["독특한 컨셉", "고객 체류시간 연장", "부가 서비스"],
        "duration": "6개월",
        "investment": "500만원"
      }
    ]
  }
}
```

#### 3.4 전략 템플릿 목록

**GET** `/strategy-cards/templates`

**Query Parameters:**

- `category` (optional): 카테고리별 필터
- `difficulty` (optional): 난이도별 필터

**Response:**

```json
{
  "success": true,
  "data": {
    "total_templates": 6,
    "templates": [
      {
        "id": "marketing_boost",
        "name": "마케팅 부스터",
        "category": "마케팅",
        "description": "유동인구 증가를 위한 마케팅 전략",
        "target_risks": ["유입 저조형"],
        "target_industries": ["식음료업", "의류업", "생활용품"],
        "difficulty": "중간",
        "duration": "2-3개월",
        "cost_level": "중간",
        "expected_impact": "유동인구 20-30% 증가"
      }
    ]
  }
}
```

---

### 4. 실행 지원 도구 API (`/support-tools`)

#### 4.1 소상공인지원센터 정보

**GET** `/support-tools/support-centers`

**Query Parameters:**

- `region` (optional): 지역별 필터
- `service_type` (optional): 서비스 유형별 필터

**Response:**

```json
{
  "success": true,
  "data": {
    "total_centers": 3,
    "support_centers": [
      {
        "id": "center_001",
        "name": "대전광역시 소상공인지원센터",
        "region": "대전광역시",
        "address": "대전광역시 중구 중앙로 101",
        "phone": "042-123-4567",
        "email": "daejeon@sbc.or.kr",
        "website": "https://daejeon.sbc.or.kr",
        "services": ["창업상담", "자금지원", "교육프로그램", "마케팅지원"],
        "operating_hours": "평일 09:00-18:00",
        "specialties": ["창업지원", "자금조달", "경영컨설팅"]
      }
    ]
  }
}
```

#### 4.2 전문가 상담 예약 정보

**GET** `/support-tools/expert-consultation`

**Query Parameters:**

- `region` (optional): 지역별 필터
- `expertise` (optional): 전문 분야별 필터

**Response:**

```json
{
  "success": true,
  "data": {
    "total_experts": 3,
    "experts": [
      {
        "id": "expert_001",
        "name": "김창업",
        "title": "창업컨설턴트",
        "organization": "대전광역시 소상공인지원센터",
        "region": "대전광역시",
        "expertise": ["창업상담", "사업계획서작성", "자금조달"],
        "experience": "15년",
        "specialties": ["식음료업", "의류업"],
        "consultation_available": true,
        "next_available": "2024-01-15 14:00",
        "rating": 4.8,
        "consultation_count": 150
      }
    ],
    "consultation_types": [
      { "type": "온라인 상담", "duration": "30분", "cost": "무료" },
      { "type": "방문 상담", "duration": "1시간", "cost": "무료" },
      { "type": "전화 상담", "duration": "20분", "cost": "무료" }
    ]
  }
}
```

#### 4.3 맞춤 창업 지원 정책 추천

**POST** `/support-tools/policy-recommendations`

**Request Body:**

```json
{
  "userType": "ENTREPRENEUR",
  "businessStage": "PLANNING",
  "preferredAreas": ["대전광역시"],
  "interestedBusinessTypes": ["식음료업"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user_profile": {
      /* 사용자 프로필 */
    },
    "total_policies": 4,
    "recommended_policies": [
      {
        "id": "policy_001",
        "name": "대전광역시 창업지원금",
        "region": "대전광역시",
        "organization": "대전광역시청",
        "support_amount": "최대 1000만원",
        "support_type": "자금지원",
        "target_business": ["식음료업", "의류업", "생활용품"],
        "target_stage": ["PLANNING", "STARTUP"],
        "application_period": "2024-01-01 ~ 2024-12-31",
        "priority": 95,
        "description": "창업 초기 자금 지원을 위한 정책",
        "requirements": ["사업자등록증", "사업계획서", "재정상태증명서"],
        "contact": "042-123-4567"
      }
    ],
    "application_guide": [
      {
        "step": 1,
        "title": "정책 조회 및 검토",
        "description": "본인에게 해당하는 정책을 찾고 자격 요건을 확인합니다.",
        "duration": "1-2일"
      }
    ],
    "deadline_alerts": [
      {
        "policy_name": "대전광역시 창업지원금",
        "deadline": "2024-12-31",
        "days_remaining": 30,
        "urgency": "high"
      }
    ]
  }
}
```

#### 4.4 성공 사례 브라우징

**GET** `/support-tools/success-cases`

**Query Parameters:**

- `industry` (optional): 업종별 필터
- `region` (optional): 지역별 필터
- `strategy_type` (optional): 전략 유형별 필터

**Response:**

```json
{
  "success": true,
  "data": {
    "total_cases": 3,
    "success_cases": [
      {
        "id": "case_001",
        "title": "대전역 카페 '커피앤북' 성공 사례",
        "industry": "식음료업",
        "region": "대전광역시 동구",
        "strategy_type": "differentiation",
        "market_code": "10000",
        "challenge": "과포화된 카페 시장에서 차별화 필요",
        "solution": "독서 카페 컨셉으로 전환, 도서 대여 서비스 추가",
        "results": {
          "revenue_increase": "45%",
          "customer_retention": "60%",
          "average_dwell_time": "90분"
        },
        "key_factors": ["독특한 컨셉", "고객 체류시간 연장", "부가 서비스"],
        "duration": "6개월",
        "investment": "500만원",
        "lessons_learned": "차별화된 컨셉이 고객 유치의 핵심",
        "contact_info": "owner@coffeeandbook.com",
        "relevance_score": 95
      }
    ],
    "case_categories": [
      { "category": "업종별", "count": 5, "description": "업종별 성공 사례" },
      { "category": "지역별", "count": 3, "description": "지역별 성공 사례" }
    ]
  }
}
```

#### 4.5 전문가 상담 예약

**POST** `/support-tools/consultation-booking`

**Request Body:**

```json
{
  "expert_id": "expert_001",
  "consultation_type": "온라인 상담",
  "preferred_date": "2024-01-15",
  "preferred_time": "14:00",
  "user_info": {
    "name": "홍길동",
    "phone": "010-1234-5678",
    "email": "hong@example.com",
    "business_type": "식음료업"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "상담 예약이 접수되었습니다.",
    "booking_info": {
      "booking_id": "BK20240115000000",
      "expert_id": "expert_001",
      "consultation_type": "온라인 상담",
      "preferred_date": "2024-01-15",
      "preferred_time": "14:00",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z",
      "estimated_duration": "30분",
      "cost": "무료"
    },
    "next_steps": [
      "예약 확인을 위해 담당자가 연락드릴 예정입니다.",
      "상담 1일 전에 리마인더 메시지를 발송드립니다.",
      "상담 당일 준비사항을 안내드립니다."
    ]
  }
}
```

#### 4.6 정책 신청

**POST** `/support-tools/policy-application`

**Request Body:**

```json
{
  "policy_id": "policy_001",
  "user_info": {
    "name": "홍길동",
    "phone": "010-1234-5678",
    "email": "hong@example.com"
  },
  "business_info": {
    "business_name": "홍길동 카페",
    "business_type": "식음료업",
    "business_stage": "PLANNING"
  },
  "required_documents": ["사업자등록증", "사업계획서", "재정상태증명서"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "정책 신청이 접수되었습니다.",
    "application_info": {
      "application_id": "APP20240115000000",
      "policy_id": "policy_001",
      "status": "submitted",
      "submitted_at": "2024-01-01T00:00:00Z",
      "estimated_review_time": "14-30일",
      "contact_info": "042-123-4567"
    },
    "next_steps": [
      "신청서 검토 및 보완 요청 (필요시)",
      "심사 과정 진행",
      "선정 결과 통보"
    ]
  }
}
```

---

### 5. 지도 기반 시각화 API (`/map-visualization`)

#### 5.1 상권 히트맵 데이터

**GET** `/map-visualization/heatmap`

**Query Parameters:**

- `region` (optional): 지역별 필터
- `analysis_type` (optional): 분석 유형 (health_score, foot_traffic, competition, growth_potential)

**Response:**

```json
{
  "success": true,
  "data": {
    "analysis_type": "health_score",
    "region": null,
    "total_markets": 5,
    "heatmap_data": [
      {
        "lat": 36.3316,
        "lng": 127.4342,
        "intensity": 1.0,
        "color": "#00FF00",
        "market_code": "10000",
        "market_name": "대전역 상권",
        "health_score": 85.5,
        "grade": "A"
      }
    ],
    "legend": {
      "high": {
        "color": "#00FF00",
        "range": "80-100",
        "description": "매우 건강"
      },
      "medium": { "color": "#FFFF00", "range": "70-79", "description": "건강" },
      "low": { "color": "#FFA500", "range": "60-69", "description": "보통" },
      "poor": { "color": "#FF0000", "range": "0-59", "description": "주의" }
    }
  }
}
```

#### 5.2 반경별 분석 결과

**POST** `/map-visualization/radius-analysis`

**Request Body:**

```json
{
  "center_lat": 36.3316,
  "center_lng": 127.4342,
  "radius_km": 2.0,
  "analysis_type": "comprehensive"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "center": { "lat": 36.3316, "lng": 127.4342 },
    "radius_km": 2.0,
    "analysis_summary": {
      "total_markets": 3,
      "average_health_score": 78.5,
      "average_foot_traffic": 150000,
      "average_growth_potential": 75.0
    },
    "competition_analysis": {
      "distribution": { "high": 1, "medium": 2, "low": 0 },
      "dominant_level": "medium",
      "competition_intensity": "보통"
    },
    "recommended_markets": [
      {
        "market_code": "10000",
        "market_name": "대전역 상권",
        "health_score": 85.5,
        "distance_km": 0.0,
        "reason": "건강 점수 85.5점으로 우수"
      }
    ],
    "market_opportunities": [
      {
        "market_code": "20000",
        "market_name": "유성온천역 상권",
        "opportunity_type": "저경쟁 고성장",
        "reason": "경쟁이 낮고 성장 잠재력이 높음"
      }
    ],
    "risk_factors": []
  }
}
```

#### 5.3 상권 클러스터 분석

**GET** `/map-visualization/cluster-analysis`

**Query Parameters:**

- `region` (optional): 지역별 필터
- `cluster_type` (optional): 클러스터 유형 (performance, characteristics, growth_stage)

**Response:**

```json
{
  "success": true,
  "data": {
    "cluster_type": "performance",
    "total_markets": 5,
    "clusters": {
      "high_performance": {
        "count": 1,
        "markets": [
          {
            "market_code": "10000",
            "market_name": "대전역 상권",
            "performance_score": 85.5
          }
        ],
        "characteristics": "높은 건강 점수와 유동인구를 보유한 우수 상권"
      },
      "medium_performance": {
        "count": 3,
        "markets": [
          /* 중간 성과 상권들 */
        ],
        "characteristics": "보통 수준의 성과를 보이는 상권"
      },
      "low_performance": {
        "count": 1,
        "markets": [
          /* 저성과 상권들 */
        ],
        "characteristics": "개선이 필요한 상권"
      }
    },
    "cluster_insights": [
      "고성과 상권들의 공통점을 분석하여 성공 요인을 파악하세요.",
      "저성과 상권들의 개선점을 분석하여 발전 방안을 모색하세요."
    ]
  }
}
```

#### 5.4 유동인구 흐름 분석

**GET** `/map-visualization/traffic-flow/<market_code>`

**Query Parameters:**

- `time_period` (optional): 시간 주기 (daily, weekly)

**Response:**

```json
{
  "success": true,
  "data": {
    "market_code": "10000",
    "time_period": "daily",
    "traffic_flow": [
      {
        "time": 0,
        "traffic": 500,
        "direction": "inbound"
      },
      {
        "time": 1,
        "traffic": 300,
        "direction": "outbound"
      }
    ],
    "peak_hours": [
      {
        "time": 12,
        "traffic": 2000,
        "peak_type": "afternoon"
      }
    ],
    "flow_patterns": {
      "inbound_traffic": 15000,
      "outbound_traffic": 12000,
      "net_flow": 3000,
      "flow_balance": "positive",
      "peak_inbound_time": 12,
      "peak_outbound_time": 18
    },
    "recommendations": [
      "오후 시간대 유동인구가 높으므로 점심 메뉴나 쇼핑 서비스를 강화하세요."
    ]
  }
}
```

#### 5.5 접근성 분석

**GET** `/map-visualization/accessibility/<market_code>`

**Response:**

```json
{
  "success": true,
  "data": {
    "market_code": "10000",
    "accessibility_score": 82.5,
    "transportation": {
      "subway": {
        "available": true,
        "stations": ["대전역", "중앙로역"],
        "walking_time": "5분",
        "frequency": "3-5분"
      },
      "bus": {
        "available": true,
        "routes": ["101", "102", "201", "202"],
        "walking_time": "2분",
        "frequency": "5-10분"
      }
    },
    "parking": {
      "public_parking": {
        "available": true,
        "capacity": 150,
        "cost": "시간당 1,000원",
        "distance": "100m"
      },
      "accessibility_score": 75
    },
    "pedestrian": {
      "sidewalks": {
        "available": true,
        "width": "3m",
        "condition": "good"
      },
      "accessibility_score": 85
    },
    "improvement_suggestions": ["주차 시설 확충 및 접근성 개선이 필요합니다."]
  }
}
```

#### 5.6 분석 유형 목록

**GET** `/map-visualization/analysis-types`

**Response:**

```json
{
  "success": true,
  "data": {
    "analysis_types": {
      "heatmap": [
        {
          "type": "health_score",
          "name": "건강 점수",
          "description": "상권의 종합적인 건강 상태를 점수로 표시",
          "color_scheme": "녹색(우수) → 노란색(보통) → 빨간색(주의)"
        }
      ],
      "radius_analysis": [
        {
          "type": "comprehensive",
          "name": "종합 분석",
          "description": "반경 내 상권들의 종합적인 분석 결과"
        }
      ],
      "cluster_analysis": [
        {
          "type": "performance",
          "name": "성과별 클러스터",
          "description": "상권의 성과 수준에 따른 그룹화"
        }
      ]
    }
  }
}
```

---

## 기존 API (참고용)

### 인증 API (`/auth`)

- **POST** `/auth/register` - 회원가입
- **POST** `/auth/login` - 로그인

### 상권 진단 API (`/market-diagnosis`)

- **GET** `/market-diagnosis/markets` - 상권 목록 조회
- **GET** `/market-diagnosis/markets/<market_code>` - 상권 상세 정보
- **GET** `/market-diagnosis/districts` - 구/군별 상권 통계

### 업종별 분석 API (`/industry-analysis`)

- **GET** `/industry-analysis/survival-rates` - 생존율 분석
- **GET** `/industry-analysis/closure-rates` - 폐업율 분석
- **GET** `/industry-analysis/risk-analysis` - 리스크 분석

### 지역별 분석 API (`/regional-analysis`)

- **GET** `/regional-analysis/population` - 인구 통계
- **GET** `/regional-analysis/rent-rates` - 임대료 정보
- **GET** `/regional-analysis/market-density` - 상권 밀도

### 종합 점수 계산 API (`/scoring`)

- **POST** `/scoring/calculate` - 종합 점수 계산
- **POST** `/scoring/compare` - 위치 비교

### 추천 시스템 API (`/recommendations`)

- **POST** `/recommendations/personalized` - 개인화 추천
- **GET** `/recommendations/industry-based` - 업종별 추천
- **GET** `/recommendations/region-based` - 지역별 추천

---

## 🎯 핵심 개선사항 요약

### ✅ 완성된 기능들

1. **상권 진단 핵심 지표**

   - 유동인구 변화량, 카드매출 추이, 동일업종 수, 창업·폐업 비율, 체류시간 분석
   - 종합 건강 점수 산정 로직
   - 실시간 데이터 기반 분석

2. **리스크 분석 시스템**

   - 4가지 리스크 유형 자동 분류 (유입 저조형, 과포화 경쟁형, 소비력 약형, 성장 잠재형)
   - 리스크 요인별 구체적 진단 및 해결책 제안
   - 성공 사례 기반 완화 전략

3. **전략 카드 시스템**

   - 맞춤형 전략 제안 기능
   - 체크리스트, 실행 팁, 실제 사례 제공
   - "지금 실행하기" 중심의 UX 구조

4. **실행 지원 도구**

   - 소상공인지원센터 연계 전문가 상담 예약 시스템
   - 지역 기반 맞춤 창업 지원 정책 추천
   - 유사 상권 성공 사례 브라우징 기능

5. **지도 기반 시각화**
   - 상권 데이터의 지도상 시각화 API
   - 반경별 분석 결과 표시 기능
   - 히트맵, 클러스터 분석, 접근성 분석

### 🔧 기술적 특징

- **실제 데이터 기반**: CSV 파일을 통한 실제 상권 데이터 활용
- **종합적 분석**: 다각도 지표를 통한 상권 건강도 평가
- **개인화 추천**: 사용자 프로필 기반 맞춤형 전략 제안
- **실행 중심**: 이론이 아닌 실제 실행 가능한 솔루션 제공
- **시각화 지원**: 지도 기반 직관적 데이터 표현

### 📊 데이터 소스

- **상권 현황 데이터**: 실제 상권 정보 및 좌표
- **관광 소비액 데이터**: 지역별 관광 소비 트렌드
- **업종별 지출 데이터**: 업종별 소비 패턴 분석
- **지역별 지출 데이터**: 지역별 경제 지표

모든 기능이 완전히 구현되어 있으며, 실제 데이터를 기반으로 동작합니다! 🎉


