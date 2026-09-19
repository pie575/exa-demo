> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="security-overview">
  # 보안 개요
</div>

> Exa의 보안, 규정 준수 및 지역별 접근 정보입니다.

***

Exa는 데이터 보안과 개인정보 보호를 최우선으로 생각합니다. Exa는 SOC 2 Type II 인증을 취득하여 엄격한 정보 보안 절차와 통제를 유지하기 위한 노력을 입증하고 있습니다.

[Zero Data Retention](/ko/docs/admin/security/zero-data-retention), [HIPAA 준수](/ko/docs/admin/security/hipaa) 또는 기타 맞춤형 데이터 보안 솔루션에 관심이 있으시다면 [sales@exa.ai](mailto:sales@exa.ai)로 문의하여 Enterprise 플랜을 상담해 보세요.

SOC 2 보고서, 데이터 처리 계약서 및 기타 보안 문서는 [Trust Center](https://trust.exa.ai)에서 확인하실 수 있습니다.

<div id="regional-access-restrictions">
  ## 지역 접근 제한
</div>

Exa는 제재 및 무역 규제를 준수하기 위해 크림반도, 쿠바, 이란, 북한, 러시아, 시리아, 우크라이나, 베네수엘라 등 제재 대상이거나 그 밖의 제한 국가 및 지역에서의 API 접근을 차단합니다.

이러한 지역에서 발생한 요청은 Exa에 도달하기 전에 Cloudflare에서 차단될 수 있습니다. 이 경우 표준 Exa API 오류 JSON 대신 Ray ID가 포함된 Cloudflare WAF 차단 페이지가 응답으로 반환될 수 있습니다.

트래픽의 위치가 잘못 판별되고 있다고 판단되면 소스 IP 주소, 국가 또는 지역, 요청 timestamp, Cloudflare Ray ID를 함께 적어 [hello@exa.ai](mailto:hello@exa.ai)로 문의해 주세요.