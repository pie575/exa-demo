> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="verifying-signatures">
  # 署名の検証
</div>

> webhook の署名を安全に検証し、リクエストが Exa から送信されたものであることを確認する方法を説明します

Exa から webhook を受信した際は、データの完全性と真正性を確保するため、それが Exa から送信されたものであることを検証してください。Exa は、webhook エンドポイントごとに固有のシークレットキーを使用して、すべての webhook ペイロードに署名しています。

<div id="how-webhook-signatures-work">
  ## Webhook 署名の仕組み
</div>

Exa は HMAC SHA256 を使用して webhook のペイロードに署名します。署名は `Exa-Signature` ヘッダーに含まれ、次の情報で構成されます。

* webhook の送信日時を示すタイムスタンプ (`t=`)
* タイムスタンプとペイロードから算出された 1 つ以上の署名 (`v1=`)

署名の形式は次のとおりです。

```text theme={null}
Exa-Signature: t=1234567890,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```

<div id="verification-process">
  ## 検証プロセス
</div>

Webhook の署名を検証するには、次の手順に従います。

1. `Exa-Signature` ヘッダーからタイムスタンプと署名を取り出します
2. タイムスタンプ、ピリオド (.) 、生のリクエストボディを連結して、署名対象のペイロードを作成します
3. Webhook シークレットを使用して、HMAC SHA256 で期待される署名を計算します
4. 計算した署名を、ヘッダーで提供された署名と比較します

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
          # 署名ヘッダーを解析する
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

          # 任意: タイムスタンプが直近 (5分以内) のものか確認する
          current_time = int(time.time())
          if abs(current_time - int(timestamp)) > 300:
              print("Warning: Webhook timestamp is more than 5 minutes old")

          # 署名対象のペイロードを作成する
          signed_payload = f"{timestamp}.{payload}"

          # 期待される署名を計算する
          expected_signature = hmac.new(
              webhook_secret.encode('utf-8'),
              signed_payload.encode('utf-8'),
              hashlib.sha256
          ).hexdigest()

          # 受信した署名と比較する
          return any(hmac.compare_digest(expected_signature, sig) for sig in signatures)

      except Exception as e:
          print(f"Error verifying signature: {e}")
          return False

  # Flask の Webhook エンドポイントでの使用例
  from flask import Flask, request, jsonify
  import os

  app = Flask(__name__)

  @app.route('/webhook', methods=['POST'])
  def handle_webhook():
      # 生のペイロードと署名を取得する
      payload = request.get_data(as_text=True)
      signature_header = request.headers.get('Exa-Signature', '')
      webhook_secret = os.environ.get('WEBHOOK_SECRET')

      # 署名を検証する
      if not verify_webhook_signature(payload, signature_header, webhook_secret):
          return jsonify({'error': 'Invalid signature'}), 400

      # Webhook を処理する
      webhook_data = request.get_json()
      print(f"Received {webhook_data['type']} event")

      return jsonify({'status': 'success'}), 200
  ```

  ```javascript JavaScript/Node.js theme={null}
  const crypto = require('crypto');

  function verifyWebhookSignature(payload, signatureHeader, webhookSecret) {
      /**
       * webhookペイロードの署名を検証します。
       *
       * @param {string} payload - 文字列形式の生のリクエストボディ
       * @param {string} signatureHeader - Exa-Signatureヘッダーの値
       * @param {string} webhookSecret - webhookシークレット
       * @returns {boolean} 署名が有効な場合はtrue、それ以外の場合はfalse
       */
      try {
          // 署名ヘッダーを解析する
          const pairs = signatureHeader.split(',').map(pair => pair.split('='));
          const timestamp = pairs.find(([key]) => key === 't')?.[1];
          const signatures = pairs
              .filter(([key]) => key === 'v1')
              .map(([, value]) => value);

          if (!timestamp || signatures.length === 0) {
              return false;
          }

          // 任意: タイムスタンプが5分以内のものかを確認する
          const currentTime = Math.floor(Date.now() / 1000);
          if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
              console.warn('Warning: Webhook timestamp is more than 5 minutes old');
          }

          // 署名対象のペイロードを作成する
          const signedPayload = `${timestamp}.${payload}`;

          // 期待される署名を計算する
          const expectedSignature = crypto
              .createHmac('sha256', webhookSecret)
              .update(signedPayload)
              .digest('hex');

          // タイミングセーフな比較で受信した署名と照合する
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

  // Express.jsのwebhookエンドポイントでの使用例
  const express = require('express');
  const app = express();

  // 重要: webhookの検証にはrawボディパーサーを使用すること
  app.use('/webhook', express.raw({ type: 'application/json' }));

  app.post('/webhook', (req, res) => {
      const payload = req.body.toString();
      const signatureHeader = req.headers['exa-signature'] || '';
      const webhookSecret = process.env.WEBHOOK_SECRET;

      // 署名を検証する
      if (!verifyWebhookSignature(payload, signatureHeader, webhookSecret)) {
          return res.status(400).json({ error: 'Invalid signature' });
      }

      // webhookを処理する
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
      * webhookペイロードの署名を検証します。
      *
      * @param payload 生のリクエストボディ(文字列)
      * @param signatureHeader Exa-Signatureヘッダーの値
      * @param webhookSecret webhookシークレット
      * @return 署名が有効な場合はtrue、それ以外の場合はfalse
      */
      public static boolean verifyWebhookSignature(String payload, String signatureHeader, String webhookSecret) {
          try {
              // 署名ヘッダーを解析する
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

              // 任意: タイムスタンプが5分以内かを確認する
              long currentTime = Instant.now().getEpochSecond();
              long webhookTime = Long.parseLong(timestamp);
              if (Math.abs(currentTime - webhookTime) > 300) {
                  System.out.println("Warning: Webhook timestamp is more than 5 minutes old");
              }

              // 署名対象のペイロードを作成する
              String signedPayload = timestamp + "." + payload;

              // 期待される署名を計算する
              String expectedSignature = computeHmacSha256(signedPayload, webhookSecret);

              // タイミングセーフな比較で、受信した署名と照合する
              return signatures.stream().anyMatch(sig -> timingSafeEquals(expectedSignature, sig));

          } catch (Exception e) {
              System.err.println("Error verifying signature: " + e.getMessage());
              return false;
          }
      }

      /**
      * HMAC SHA256署名を計算します。
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
      * バイト配列を16進文字列に変換します。
      */
      private static String bytesToHex(byte[] bytes) {
          StringBuilder result = new StringBuilder();
          for (byte b : bytes) {
              result.append(String.format("%02x", b));
          }
          return result.toString();
      }

      /**
      * タイミング攻撃を防ぐため、タイミングセーフな方法で文字列を比較します。
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

      // 使用例とテスト
      public static void main(String[] args) {
          System.out.println("🚀 === Exa Webhook Signature Verification Test ===\n");

          // 既知のペイロードと署名でテストする
          String testPayload = "{\"type\":\"webset.created\",\"data\":{\"id\":\"ws_test\"}}";
          String testSecret = "test_webhook_secret";
          String testTimestamp = String.valueOf(Instant.now().getEpochSecond());

          try {
              // テスト用の署名を作成する
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

              // 検証をテストする
              boolean isValid = verifyWebhookSignature(testPayload, testHeader, testSecret);
              System.out.println("   ✓ Valid signature verification: " + (isValid ? "✅ PASSED" : "❌ FAILED"));

              // 無効な署名でテストする
              String invalidHeader = "t=" + testTimestamp + ",v1=invalid_signature";
              boolean isInvalid = verifyWebhookSignature(testPayload, invalidHeader, testSecret);
              System.out.println("   ✓ Invalid signature rejection: " + (!isInvalid ? "✅ PASSED" : "❌ FAILED"));

              // タイムスタンプがない場合をテストする
              String noTimestampHeader = "v1=" + testSignature;
              boolean noTimestamp = verifyWebhookSignature(testPayload, noTimestampHeader, testSecret);
              System.out.println("   ✓ Missing timestamp rejection: " + (!noTimestamp ? "✅ PASSED" : "❌ FAILED"));

              // 空のヘッダーでテストする
              boolean emptyHeader = verifyWebhookSignature(testPayload, "", testSecret);
              System.out.println("   ✓ Empty header rejection: " + (!emptyHeader ? "✅ PASSED" : "❌ FAILED"));

              // 不正な形式のヘッダーでテストする
              boolean malformedHeader = verifyWebhookSignature(testPayload, "invalid-header-format", testSecret);
              System.out.println("   ✓ Malformed header rejection: " + (!malformedHeader ? "✅ PASSED" : "❌ FAILED"));

              System.out.println();

              // webhook処理の例
              if (isValid) {
                  System.out.println("🎉 === Processing Valid Webhook ===");
                  System.out.println("   Processing webhook payload: " + testPayload);
                  // 実際にはここでJSONを解析し、webhookイベントを処理します
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
  ## セキュリティのベストプラクティス
</div>

以下のプラクティスに従うことで、webhook の実装を安全かつ堅牢にできます。

* **必ず署名を検証する** - webhook のデータを処理する前に、必ず署名を検証してください。これにより、攻撃者が偽の webhook をエンドポイントに送信するのを防げます。

* **タイミングセーフな比較を使用する** - 署名を比較する際は、タイミング攻撃を防ぐため、Python の `hmac.compare_digest()` や Node.js の `crypto.timingSafeEqual()` などの関数を使用してください。

* **タイムスタンプの鮮度を確認する** - リプレイ攻撃を防ぐため、タイムスタンプが古すぎる webhook(例: 5 分以上前のもの)は拒否することを検討してください。

* **シークレットを安全に保管する** - webhook シークレットは、環境変数または安全なシークレット管理システムに保管してください。アプリケーションにハードコードしてはいけません。**重要**: webhook シークレットは [webhook を作成](/ja/docs/websets/api/webhooks/create-a-webhook) したときにしか返されません。後から取得できないため、必ず安全な場所に保存してください。

* **HTTPS を使用する** - 転送中のデータを暗号化するため、webhook には必ず HTTPS エンドポイントを使用してください。

* **最終的な URL を登録する** - webhook の配信は HTTP リダイレクト(3xx レスポンス)に追従しません。エンドポイントがリダイレクトを返すと、その配信は失敗として扱われます。ペイロードを直接処理する URL を必ず登録してください。

***

<br />

<div id="troubleshooting">
  ## トラブルシューティング
</div>

<div id="invalid-signature-errors">
  ### 無効な署名エラー
</div>

署名検証に失敗する場合は、次の点を確認してください。

1. **生のペイロードを確認する**: パース済みの JSON オブジェクトではなく、生のリクエストボディを使用しているか確認してください
2. **シークレットを確認する**: webhook の作成時に発行された正しい webhook シークレットを使用しているか確認してください
3. **ヘッダーの解析を確認する**: ヘッダーからタイムスタンプと署名を正しく抽出できているか確認してください
4. **エンコーディングの問題**: 検証プロセス全体で UTF-8 エンコーディングを一貫して使用しているか確認してください

<div id="testing-signatures-locally">
  ### ローカルでの署名のテスト
</div>

webhookシークレットとサンプルのペイロードを使って、署名検証ロジックをテストできます。

```python Python theme={null}
# 既知のペイロードと署名でテスト
test_payload = '{"type":"webset.created","data":{"id":"ws_test"}}'
test_timestamp = "1234567890"
test_secret = "your_webhook_secret"

# テスト用の署名を作成
import hmac
import hashlib

signed_payload = f"{test_timestamp}.{test_payload}"
test_signature = hmac.new(
    test_secret.encode('utf-8'),
    signed_payload.encode('utf-8'),
    hashlib.sha256
).hexdigest()

test_header = f"t={test_timestamp},v1={test_signature}"

# 正しく動作するか確認
is_valid = verify_webhook_signature(test_payload, test_header, test_secret)
print(f"Test signature valid: {is_valid}")  # True が出力されれば成功
```

***

<br />

<div id="whats-next">
  ## 次のステップ
</div>

* [Webhook イベント](/ja/docs/websets/api/events/types)とそのペイロードについて確認する
* [Webhook の再試行と監視](/ja/docs/websets/api/webhooks/attempts/list-webhook-attempts)を設定する
* [Webhook 管理用エンドポイント](/ja/docs/websets/api/webhooks/create-a-webhook)を確認する