> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 본격적으로 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# signature 검증 {#verifying-signatures}

> 요청이 Exa에서 온 것인지 확인할 수 있도록 웹훅 signature를 안전하게 검증하는 방법을 알아보세요

Exa로부터 웹훅을 수신하면 데이터의 무결성과 진위를 보장하기 위해 해당 요청이 Exa에서 발송된 것인지 검증해야 합니다. Exa는 모든 웹훅 payload를 웹훅 엔드포인트별로 고유한 secret 키로 서명합니다.

## 웹훅 signature 작동 방식 {#how-webhook-signatures-work}

Exa는 HMAC SHA256을 사용해 웹훅 payload에 서명합니다. signature는 `Exa-Signature` header에 포함되며, 다음으로 구성됩니다:

* 웹훅이 전송된 시점을 나타내는 timestamp(`t=`)
* timestamp와 payload를 사용해 계산된 하나 이상의 signature(`v1=`)

signature 형식은 다음과 같습니다:

```text theme={null}
Exa-Signature: t=1234567890,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```

## Verification 과정 {#verification-process}

웹훅 signature를 verification하려면 다음 단계를 따르세요:

1. `Exa-Signature` header에서 timestamp와 signature를 추출합니다
2. timestamp, 마침표, 원본 요청 본문을 이어 붙여 서명 대상 payload를 생성합니다
3. 웹훅 secret으로 HMAC SHA256을 사용해 예상 signature를 계산합니다
4. 계산한 signature를 전달받은 signature와 비교합니다

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
          # signature header 파싱
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

          # 선택 사항: timestamp가 최근인지 확인 (5분 이내)
          current_time = int(time.time())
          if abs(current_time - int(timestamp)) > 300:
              print("Warning: Webhook timestamp is more than 5 minutes old")

          # 서명 대상 payload 생성
          signed_payload = f"{timestamp}.{payload}"

          # 예상 signature 계산
          expected_signature = hmac.new(
              webhook_secret.encode('utf-8'),
              signed_payload.encode('utf-8'),
              hashlib.sha256
          ).hexdigest()

          # 전달받은 signature와 비교
          return any(hmac.compare_digest(expected_signature, sig) for sig in signatures)

      except Exception as e:
          print(f"Error verifying signature: {e}")
          return False

  # Flask 웹훅 엔드포인트 사용 예시
  from flask import Flask, request, jsonify
  import os

  app = Flask(__name__)

  @app.route('/webhook', methods=['POST'])
  def handle_webhook():
      # 원본 payload와 signature 가져오기
      payload = request.get_data(as_text=True)
      signature_header = request.headers.get('Exa-Signature', '')
      webhook_secret = os.environ.get('WEBHOOK_SECRET')

      # signature 검증
      if not verify_webhook_signature(payload, signature_header, webhook_secret):
          return jsonify({'error': 'Invalid signature'}), 400

      # 웹훅 처리
      webhook_data = request.get_json()
      print(f"Received {webhook_data['type']} event")

      return jsonify({'status': 'success'}), 200
  ```

  ```javascript JavaScript/Node.js theme={null}
  const crypto = require('crypto');

  function verifyWebhookSignature(payload, signatureHeader, webhookSecret) {
      /**
       * 웹훅 payload의 signature를 검증합니다.
       *
       * @param {string} payload - 문자열 형태의 raw request body
       * @param {string} signatureHeader - Exa-Signature header 값
       * @param {string} webhookSecret - 사용 중인 webhook secret
       * @returns {boolean} signature가 유효하면 true, 아니면 false
       */
      try {
          // signature header 파싱
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

          // 예상 signature 계산
          const expectedSignature = crypto
              .createHmac('sha256', webhookSecret)
              .update(signedPayload)
              .digest('hex');

          // 타이밍 공격에 안전한 방식으로 전달받은 signature와 비교
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

  // Express.js 웹훅 엔드포인트에서의 사용 예시
  const express = require('express');
  const app = express();

  // 중요: 웹훅 verification에는 raw body 파서를 사용하세요
  app.use('/webhook', express.raw({ type: 'application/json' }));

  app.post('/webhook', (req, res) => {
      const payload = req.body.toString();
      const signatureHeader = req.headers['exa-signature'] || '';
      const webhookSecret = process.env.WEBHOOK_SECRET;

      // signature 검증
      if (!verifyWebhookSignature(payload, signatureHeader, webhookSecret)) {
          return res.status(400).json({ error: 'Invalid signature' });
      }

      // 웹훅 처리
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
      * 웹훅 payload의 signature를 검증합니다.
      *
      * @param payload 문자열 형태의 raw request body
      * @param signatureHeader Exa-Signature header 값
      * @param webhookSecret 사용자의 웹훅 secret
      * @return signature가 유효하면 true, 그렇지 않으면 false
      */
      public static boolean verifyWebhookSignature(String payload, String signatureHeader, String webhookSecret) {
          try {
              // signature header 파싱
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

              // 선택 사항: timestamp가 최근인지(5분 이내) 확인
              long currentTime = Instant.now().getEpochSecond();
              long webhookTime = Long.parseLong(timestamp);
              if (Math.abs(currentTime - webhookTime) > 300) {
                  System.out.println("Warning: Webhook timestamp is more than 5 minutes old");
              }

              // 서명 대상 payload 생성
              String signedPayload = timestamp + "." + payload;

              // 예상 signature 계산
              String expectedSignature = computeHmacSha256(signedPayload, webhookSecret);

              // 타이밍 공격에 안전한 방식으로 전달된 signature와 비교
              return signatures.stream().anyMatch(sig -> timingSafeEquals(expectedSignature, sig));

          } catch (Exception e) {
              System.err.println("Error verifying signature: " + e.getMessage());
              return false;
          }
      }

      /**
      * HMAC SHA256 signature를 계산합니다.
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
      * 타이밍 공격을 방지하기 위한 타이밍 안전 문자열 비교입니다.
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

          // 알려진 payload와 signature로 테스트
          String testPayload = "{\"type\":\"webset.created\",\"data\":{\"id\":\"ws_test\"}}";
          String testSecret = "test_webhook_secret";
          String testTimestamp = String.valueOf(Instant.now().getEpochSecond());

          try {
              // 테스트용 signature 생성
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

              // 유효하지 않은 signature로 테스트
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

              // 웹훅 처리 예시
              if (isValid) {
                  System.out.println("🎉 === Processing Valid Webhook ===");
                  System.out.println("   Processing webhook payload: " + testPayload);
                  // 여기에서 JSON을 파싱하고 웹훅 이벤트를 처리합니다
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

## 보안 모범 사례 {#security-best-practices}

다음 사례를 따르면 웹훅 구현을 안전하고 견고하게 유지할 수 있습니다:

* **항상 signature를 검증하세요** - signature를 검증하기 전에는 웹훅 데이터를 처리하지 마세요. 이를 통해 공격자가 엔드포인트로 위조된 웹훅을 보내는 것을 막을 수 있습니다.

* **타이밍 안전 비교를 사용하세요** - signature를 비교할 때는 Python의 `hmac.compare_digest()`나 Node.js의 `crypto.timingSafeEqual()` 같은 함수를 사용해 타이밍 공격을 방지하세요.

* **timestamp의 최신성을 확인하세요** - 재전송 공격을 방지하기 위해 timestamp가 너무 오래된(예: 5분 이상 경과) 웹훅은 거부하는 것을 고려하세요.

* **secret을 안전하게 저장하세요** - 웹훅 secret은 환경 변수나 안전한 secret 관리 시스템에 저장하세요. 애플리케이션에 하드코딩하지 마세요. **중요**: 웹훅 secret은 [웹훅을 생성할 때](/ko/docs/websets/api/webhooks/create-a-webhook)만 반환되며 이후에는 다시 조회할 수 없으므로, 반드시 안전하게 보관하세요.

* **HTTPS를 사용하세요** - 데이터가 전송 중에 암호화되도록 웹훅에는 항상 HTTPS 엔드포인트를 사용하세요.

* **최종 URL을 등록하세요** - 웹훅 전송은 HTTP 리다이렉트(3xx response)를 따라가지 않습니다. 엔드포인트가 리다이렉트하는 경우 해당 전송은 실패로 처리됩니다. 항상 payload를 직접 처리하는 URL을 등록하세요.

***

<br />

## 문제 해결 {#troubleshooting}

### 유효하지 않은 서명 오류 {#invalid-signature-errors}

서명 검증이 실패하는 경우:

1. **원본 payload 확인**: 파싱된 JSON 객체가 아니라 원본 요청 본문을 사용하고 있는지 확인하세요
2. **secret 확인**: 웹훅 생성 시 발급받은 올바른 웹훅 secret을 사용하고 있는지 확인하세요
3. **header 파싱 확인**: header에서 timestamp와 signature를 올바르게 추출하고 있는지 확인하세요
4. **인코딩 문제**: verification 과정 전반에 걸쳐 UTF-8 인코딩이 일관되게 적용되는지 확인하세요

### 로컬에서 signature 테스트하기 {#testing-signatures-locally}

웹훅 secret과 샘플 payload를 사용해 서명 검증 로직을 테스트할 수 있습니다:

```python Python theme={null}
# 알려진 payload와 signature로 테스트
test_payload = '{"type":"webset.created","data":{"id":"ws_test"}}'
test_timestamp = "1234567890"
test_secret = "your_webhook_secret"

# 테스트용 signature 생성
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

## 다음 단계 {#whats-next}

* [웹훅 이벤트](/ko/docs/websets/api/events/types)와 그 payload 알아보기
* [웹훅 재시도 및 모니터링](/ko/docs/websets/api/webhooks/attempts/list-webhook-attempts) 설정하기
* [웹훅 관리 엔드포인트](/ko/docs/websets/api/webhooks/create-a-webhook) 살펴보기