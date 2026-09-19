> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 받아보세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="verifying-signatures">
  # 서명 검증하기
</div>

> 요청이 Exa에서 보낸 것임을 확인할 수 있도록 webhook 서명을 안전하게 검증하는 방법을 알아보세요

Exa로부터 webhook을 받으면 데이터의 무결성과 진위를 확인하기 위해 해당 요청이 실제로 Exa에서 온 것인지 검증해야 합니다. Exa는 모든 webhook payload를 webhook endpoint별로 고유한 secret key로 서명합니다.

<div id="how-webhook-signatures-work">
  ## Webhook 서명 동작 방식
</div>

Exa는 HMAC SHA256을 사용해 webhook payload에 서명합니다. 서명은 `Exa-Signature` header에 포함되며, 다음 값으로 구성됩니다:

* webhook이 전송된 시각을 나타내는 timestamp(`t=`)
* timestamp와 payload로 계산한 하나 이상의 서명(`v1=`)

서명 형식은 다음과 같습니다:

```text theme={null}
Exa-Signature: t=1234567890,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```

<div id="verification-process">
  ## 검증 프로세스
</div>

webhook 서명을 검증하는 방법은 다음과 같습니다.

1. `Exa-Signature` header에서 timestamp와 서명을 추출합니다
2. timestamp, 마침표, 원시 요청 본문을 차례로 이어 붙여 서명 대상 payload를 만듭니다
3. webhook secret으로 HMAC SHA256을 적용해 예상 서명을 계산합니다
4. 계산한 서명을 전달받은 서명과 비교합니다

<CodeGroup>
  ```python Python theme={null}
  import hmac
  import hashlib
  import time

  def verify_webhook_signature(payload, signature_header, webhook_secret):
      """
      Verify the signature of a webhook payload.

      Args:
          payload (str): The raw request body as a string
          signature_header (str): The Exa-Signature header value
          webhook_secret (str): Your webhook secret

      Returns:
          bool: True if signature is valid, False otherwise
      """
      try:
          # 서명 header 파싱
          pairs = [pair.split('=', 1) for pair in signature_header.split(',')]
          timestamp = None
          signatures = []

          for key, value in pairs:
              if key == 't':
                  timestamp = value
              elif key == 'v1':
                  signatures.append(value)

          if not timestamp or not signatures:
              return False

          # 선택 사항: timestamp가 최근(5분 이내)인지 확인
          current_time = int(time.time())
          if abs(current_time - int(timestamp)) > 300:
              print("Warning: Webhook timestamp is more than 5 minutes old")

          # 서명 대상 payload 생성
          signed_payload = f"{timestamp}.{payload}"

          # 예상 서명 계산
          expected_signature = hmac.new(
              webhook_secret.encode('utf-8'),
              signed_payload.encode('utf-8'),
              hashlib.sha256
          ).hexdigest()

          # 전달받은 서명과 비교
          return any(hmac.compare_digest(expected_signature, sig) for sig in signatures)

      except Exception as e:
          print(f"Error verifying signature: {e}")
          return False

  # Flask webhook endpoint에서의 사용 예시
  from flask import Flask, request, jsonify
  import os

  app = Flask(__name__)

  @app.route('/webhook', methods=['POST'])
  def handle_webhook():
      # 원본 payload와 서명 가져오기
      payload = request.get_data(as_text=True)
      signature_header = request.headers.get('Exa-Signature', '')
      webhook_secret = os.environ.get('WEBHOOK_SECRET')

      # 서명 검증
      if not verify_webhook_signature(payload, signature_header, webhook_secret):
          return jsonify({'error': 'Invalid signature'}), 400

      # webhook 처리
      webhook_data = request.get_json()
      print(f"Received {webhook_data['type']} event")

      return jsonify({'status': 'success'}), 200
  ```

  ```javascript JavaScript/Node.js theme={null}
  const crypto = require('crypto');

  function verifyWebhookSignature(payload, signatureHeader, webhookSecret) {
      /**
       * webhook payload의 서명을 검증합니다.
       *
       * @param {string} payload - 문자열 형태의 원본 요청 본문
       * @param {string} signatureHeader - Exa-Signature header 값
       * @param {string} webhookSecret - 사용자의 webhook secret
       * @returns {boolean} 서명이 유효하면 true, 그렇지 않으면 false
       */
      try {
          // 서명 header 파싱
          const pairs = signatureHeader.split(',').map(pair => pair.split('='));
          const timestamp = pairs.find(([key]) => key === 't')?.[1];
          const signatures = pairs
              .filter(([key]) => key === 'v1')
              .map(([, value]) => value);

          if (!timestamp || signatures.length === 0) {
              return false;
          }

          // 선택 사항: timestamp가 최근 값인지 확인 (5분 이내)
          const currentTime = Math.floor(Date.now() / 1000);
          if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
              console.warn('Warning: Webhook timestamp is more than 5 minutes old');
          }

          // 서명 대상 payload 생성
          const signedPayload = `${timestamp}.${payload}`;

          // 예상 서명 계산
          const expectedSignature = crypto
              .createHmac('sha256', webhookSecret)
              .update(signedPayload)
              .digest('hex');

          // 타이밍 공격에 안전한 방식으로 전달된 서명과 비교
          return signatures.some(sig =>
              crypto.timingSafeEqual(
                  Buffer.from(expectedSignature, 'hex'),
                  Buffer.from(sig, 'hex')
              )
          );

      } catch (error) {
          console.error('Error verifying signature:', error);
          return false;
      }
  }

  // Express.js webhook endpoint에서의 사용 예시
  const express = require('express');
  const app = express();

  // 중요: webhook verification에는 raw body 파서를 사용하세요
  app.use('/webhook', express.raw({ type: 'application/json' }));

  app.post('/webhook', (req, res) => {
      const payload = req.body.toString();
      const signatureHeader = req.headers['exa-signature'] || '';
      const webhookSecret = process.env.WEBHOOK_SECRET;

      // 서명 검증
      if (!verifyWebhookSignature(payload, signatureHeader, webhookSecret)) {
          return res.status(400).json({ error: 'Invalid signature' });
      }

      // webhook 처리
      const webhookData = JSON.parse(payload);
      console.log(`Received ${webhookData.type} event`);

      res.json({ status: 'success' });
  });
  ```

  ```java Java theme={null}
  import javax.crypto.Mac;
  import javax.crypto.spec.SecretKeySpec;
  import java.nio.charset.StandardCharsets;
  import java.security.InvalidKeyException;
  import java.security.NoSuchAlgorithmException;
  import java.time.Instant;
  import java.util.ArrayList;
  import java.util.List;

  public class WebhookTest {

      /**
      * webhook payload의 서명을 검증합니다.
      *
      * @param payload 문자열 형태의 원본 요청 본문
      * @param signatureHeader Exa-Signature header 값
      * @param webhookSecret 사용자의 webhook secret
      * @return 서명이 유효하면 true, 그렇지 않으면 false
      */
      public static boolean verifyWebhookSignature(String payload, String signatureHeader, String webhookSecret) {
          try {
              // 서명 header 파싱
              String[] pairs = signatureHeader.split(",");
              String timestamp = null;
              List<String> signatures = new ArrayList<>();

              for (String pair : pairs) {
                  String[] keyValue = pair.split("=", 2);
                  if (keyValue.length == 2) {
                      String key = keyValue[0];
                      String value = keyValue[1];

                      if ("t".equals(key)) {
                          timestamp = value;
                      } else if ("v1".equals(key)) {
                          signatures.add(value);
                      }
                  }
              }

              if (timestamp == null || signatures.isEmpty()) {
                  return false;
              }

              // 선택 사항: timestamp가 최근(5분 이내)인지 확인
              long currentTime = Instant.now().getEpochSecond();
              long webhookTime = Long.parseLong(timestamp);
              if (Math.abs(currentTime - webhookTime) > 300) {
                  System.out.println("Warning: Webhook timestamp is more than 5 minutes old");
              }

              // 서명 대상 payload 생성
              String signedPayload = timestamp + "." + payload;

              // 예상 서명 계산
              String expectedSignature = computeHmacSha256(signedPayload, webhookSecret);

              // 타이밍 공격에 안전한 방식으로 전달된 서명과 비교
              return signatures.stream().anyMatch(sig -> timingSafeEquals(expectedSignature, sig));

          } catch (Exception e) {
              System.err.println("Error verifying signature: " + e.getMessage());
              return false;
          }
      }

      /**
      * HMAC SHA256 서명을 계산합니다.
      */
      private static String computeHmacSha256(String data, String key)
              throws NoSuchAlgorithmException, InvalidKeyException {
          Mac mac = Mac.getInstance("HmacSHA256");
          SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
          mac.init(secretKeySpec);
          byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
          return bytesToHex(hash);
      }

      /**
      * 바이트 배열을 16진수 문자열로 변환합니다.
      */
      private static String bytesToHex(byte[] bytes) {
          StringBuilder result = new StringBuilder();
          for (byte b : bytes) {
              result.append(String.format("%02x", b));
          }
          return result.toString();
      }

      /**
      * 타이밍 공격을 방지하는 타이밍 안전 문자열 비교입니다.
      */
      private static boolean timingSafeEquals(String a, String b) {
          if (a.length() != b.length()) {
              return false;
          }

          int result = 0;
          for (int i = 0; i < a.length(); i++) {
              result |= a.charAt(i) ^ b.charAt(i);
          }
          return result == 0;
      }

      // 사용 예시 및 테스트
      public static void main(String[] args) {
          System.out.println("🚀 === Exa Webhook Signature Verification Test ===\n");

          // 알려진 payload와 서명으로 테스트
          String testPayload = "{\"type\":\"webset.created\",\"data\":{\"id\":\"ws_test\"}}";
          String testSecret = "test_webhook_secret";
          String testTimestamp = String.valueOf(Instant.now().getEpochSecond());

          try {
              // 테스트용 서명 생성
              String signedPayload = testTimestamp + "." + testPayload;
              String testSignature = computeHmacSha256(signedPayload, testSecret);
              String testHeader = "t=" + testTimestamp + ",v1=" + testSignature;

              System.out.println("📋 Test Data:");
              System.out.println("   • Payload: " + testPayload);
              System.out.println("   • Secret: " + testSecret);
              System.out.println("   • Timestamp: " + testTimestamp);
              System.out.println("   • Generated Signature: " + testSignature);
              System.out.println("   • Header: " + testHeader);
              System.out.println();

              System.out.println("🧪 Running Tests...");

              // verification 테스트
              boolean isValid = verifyWebhookSignature(testPayload, testHeader, testSecret);
              System.out.println("   ✓ Valid signature verification: " + (isValid ? "✅ PASSED" : "❌ FAILED"));

              // 유효하지 않은 서명으로 테스트
              String invalidHeader = "t=" + testTimestamp + ",v1=invalid_signature";
              boolean isInvalid = verifyWebhookSignature(testPayload, invalidHeader, testSecret);
              System.out.println("   ✓ Invalid signature rejection: " + (!isInvalid ? "✅ PASSED" : "❌ FAILED"));

              // timestamp가 없는 경우 테스트
              String noTimestampHeader = "v1=" + testSignature;
              boolean noTimestamp = verifyWebhookSignature(testPayload, noTimestampHeader, testSecret);
              System.out.println("   ✓ Missing timestamp rejection: " + (!noTimestamp ? "✅ PASSED" : "❌ FAILED"));

              // 빈 header로 테스트
              boolean emptyHeader = verifyWebhookSignature(testPayload, "", testSecret);
              System.out.println("   ✓ Empty header rejection: " + (!emptyHeader ? "✅ PASSED" : "❌ FAILED"));

              // 형식이 잘못된 header로 테스트
              boolean malformedHeader = verifyWebhookSignature(testPayload, "invalid-header-format", testSecret);
              System.out.println("   ✓ Malformed header rejection: " + (!malformedHeader ? "✅ PASSED" : "❌ FAILED"));

              System.out.println();

              // webhook 처리 예시
              if (isValid) {
                  System.out.println("🎉 === Processing Valid Webhook ===");
                  System.out.println("   Processing webhook payload: " + testPayload);
                  // 여기에서 JSON을 파싱하고 webhook 이벤트를 처리하면 됩니다
                  System.out.println("   Webhook processed successfully!");
                  System.out.println();
                  System.out.println("🔒 Security verification complete! Your webhook signature verification is working correctly.");
              }

          } catch (Exception e) {
              System.err.println("❌ Test failed with error: " + e.getMessage());
              e.printStackTrace();
          }
      }
  }
  ```
</CodeGroup>

***

<br />

<div id="security-best-practices">
  ## 보안 모범 사례
</div>

다음 사례를 따르면 webhook 구현을 안전하고 견고하게 유지할 수 있습니다:

* **항상 서명을 검증하세요** - 서명을 먼저 검증하지 않은 채로 webhook 데이터를 처리해서는 안 됩니다. 이렇게 하면 공격자가 위조된 webhook을 endpoint로 보내는 것을 막을 수 있습니다.

* **타이밍 안전 비교를 사용하세요** - 서명을 비교할 때는 Python의 `hmac.compare_digest()`나 Node.js의 `crypto.timingSafeEqual()` 같은 함수를 사용해 타이밍 공격을 방지하세요.

* **timestamp의 freshness를 확인하세요** - replay 공격을 막기 위해 timestamp가 너무 오래된(예: 5분 이상 경과) webhook은 거부하는 방안을 고려하세요.

* **secret을 안전하게 저장하세요** - webhook secret은 환경 변수나 안전한 secret 관리 시스템에 저장하세요. 애플리케이션에 하드코딩해서는 안 됩니다. **중요**: webhook secret은 [webhook을 생성](/ko/docs/websets/api/webhooks/create-a-webhook)할 때만 반환되며 이후에는 다시 조회할 수 없으므로, 반드시 안전하게 저장해 두세요.

* **HTTPS를 사용하세요** - 전송 중 데이터가 암호화되도록 webhook에는 항상 HTTPS endpoint를 사용하세요.

* **최종 URL을 등록하세요** - webhook 전송은 HTTP 리디렉션(3xx 응답)을 따르지 않습니다. endpoint에서 리디렉션이 발생하면 해당 전송은 실패로 처리됩니다. 항상 payload를 직접 처리하는 URL을 등록하세요.

***

<br />

<div id="troubleshooting">
  ## 문제 해결
</div>

<div id="invalid-signature-errors">
  ### 유효하지 않은 서명 오류
</div>

서명 검증에 실패하는 경우 다음을 확인하세요:

1. **원본 payload 확인**: 파싱된 JSON 객체가 아닌 원본 요청 본문을 사용하고 있는지 확인하세요
2. **secret 확인**: webhook을 생성할 때 발급된 올바른 webhook secret을 사용하고 있는지 확인하세요
3. **header 파싱 확인**: header에서 timestamp와 서명을 올바르게 추출하고 있는지 확인하세요
4. **인코딩 문제**: 검증 과정 전반에서 UTF-8 인코딩이 일관되게 유지되는지 확인하세요

<div id="testing-signatures-locally">
  ### 로컬에서 서명 테스트하기
</div>

webhook secret과 샘플 payload를 사용해 서명 검증 로직을 테스트할 수 있습니다:

```python Python theme={null}
# 이미 알고 있는 payload와 서명으로 테스트
test_payload = '{"type":"webset.created","data":{"id":"ws_test"}}'
test_timestamp = "1234567890"
test_secret = "your_webhook_secret"

# 테스트용 서명 생성
import hmac
import hashlib

signed_payload = f"{test_timestamp}.{test_payload}"
test_signature = hmac.new(
    test_secret.encode('utf-8'),
    signed_payload.encode('utf-8'),
    hashlib.sha256
).hexdigest()

test_header = f"t={test_timestamp},v1={test_signature}"

# 정상 동작하는지 확인
is_valid = verify_webhook_signature(test_payload, test_header, test_secret)
print(f"Test signature valid: {is_valid}")  # True가 출력되어야 함
```

***

<br />

<div id="whats-next">
  ## 다음 단계
</div>

* [webhook 이벤트](/ko/docs/websets/api/events/types)와 payload 알아보기
* [webhook 재시도 및 모니터링](/ko/docs/websets/api/webhooks/attempts/list-webhook-attempts) 설정하기
* [webhook 관리 endpoint](/ko/docs/websets/api/webhooks/create-a-webhook) 살펴보기