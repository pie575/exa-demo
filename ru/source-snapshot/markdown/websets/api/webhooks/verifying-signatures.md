> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать документацию дальше.

<div id="verifying-signatures">
  # Проверка подписей
</div>

> Узнайте, как безопасно проверять подписи webhook, чтобы убедиться, что запросы приходят от Exa

Получив webhook от Exa, следует убедиться, что он пришёл именно от нас, — это гарантирует целостность и подлинность данных. Exa подписывает все полезные нагрузки webhook секретным ключом, уникальным для вашего эндпоинта webhook.

<div id="how-webhook-signatures-work">
  ## Как работают подписи webhook
</div>

Exa использует HMAC SHA256 для подписи полезной нагрузки webhook. Подпись передаётся в заголовке `Exa-Signature`, который содержит:

* Метку времени (`t=`) — момент отправки webhook
* Одну или несколько подписей (`v1=`), вычисленных на основе метки времени и полезной нагрузки

Формат подписи выглядит так:

```text theme={null}
Exa-Signature: t=1234567890,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```

<div id="verification-process">
  ## Процесс проверки
</div>

Чтобы проверить подпись webhook:

1. Извлеките метку времени и подписи из заголовка `Exa-Signature`
2. Сформируйте подписываемую строку, объединив метку времени, точку и необработанное тело запроса
3. Вычислите ожидаемую подпись по алгоритму HMAC SHA256, используя секрет вашего webhook
4. Сравните вычисленную подпись с подписями из заголовка

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
          # Разбираем заголовок с подписью
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

          # Опционально: проверяем, что метка времени свежая (не старше 5 минут)
          current_time = int(time.time())
          if abs(current_time - int(timestamp)) > 300:
              print("Warning: Webhook timestamp is more than 5 minutes old")

          # Формируем подписываемые данные
          signed_payload = f"{timestamp}.{payload}"

          # Вычисляем ожидаемую подпись
          expected_signature = hmac.new(
              webhook_secret.encode('utf-8'),
              signed_payload.encode('utf-8'),
              hashlib.sha256
          ).hexdigest()

          # Сравниваем с переданными подписями
          return any(hmac.compare_digest(expected_signature, sig) for sig in signatures)

      except Exception as e:
          print(f"Error verifying signature: {e}")
          return False

  # Пример использования в endpoint для webhook на Flask
  from flask import Flask, request, jsonify
  import os

  app = Flask(__name__)

  @app.route('/webhook', methods=['POST'])
  def handle_webhook():
      # Получаем исходное тело запроса и подпись
      payload = request.get_data(as_text=True)
      signature_header = request.headers.get('Exa-Signature', '')
      webhook_secret = os.environ.get('WEBHOOK_SECRET')

      # Проверяем подпись
      if not verify_webhook_signature(payload, signature_header, webhook_secret):
          return jsonify({'error': 'Invalid signature'}), 400

      # Обрабатываем webhook
      webhook_data = request.get_json()
      print(f"Received {webhook_data['type']} event")

      return jsonify({'status': 'success'}), 200
  ```

  ```javascript JavaScript/Node.js theme={null}
  const crypto = require('crypto');

  function verifyWebhookSignature(payload, signatureHeader, webhookSecret) {
      /**
       * Проверяет подпись полезной нагрузки webhook.
       *
       * @param {string} payload - Необработанное тело запроса в виде строки
       * @param {string} signatureHeader - Значение заголовка Exa-Signature
       * @param {string} webhookSecret - Ваш секрет webhook
       * @returns {boolean} true, если подпись верна, иначе false
       */
      try {
          // Разбираем заголовок подписи
          const pairs = signatureHeader.split(',').map(pair => pair.split('='));
          const timestamp = pairs.find(([key]) => key === 't')?.[1];
          const signatures = pairs
              .filter(([key]) => key === 'v1')
              .map(([, value]) => value);

          if (!timestamp || signatures.length === 0) {
              return false;
          }

          // Необязательно: проверяем, что метка времени свежая (не старше 5 минут)
          const currentTime = Math.floor(Date.now() / 1000);
          if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
              console.warn('Warning: Webhook timestamp is more than 5 minutes old');
          }

          // Формируем подписываемую полезную нагрузку
          const signedPayload = `${timestamp}.${payload}`;

          // Вычисляем ожидаемую подпись
          const expectedSignature = crypto
              .createHmac('sha256', webhookSecret)
              .update(signedPayload)
              .digest('hex');

          // Сравниваем с переданными подписями, используя сравнение с защитой от атак по времени
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

  // Пример использования в эндпоинте webhook на Express.js
  const express = require('express');
  const app = express();

  // Важно: для проверки webhook используйте парсер необработанного тела запроса
  app.use('/webhook', express.raw({ type: 'application/json' }));

  app.post('/webhook', (req, res) => {
      const payload = req.body.toString();
      const signatureHeader = req.headers['exa-signature'] || '';
      const webhookSecret = process.env.WEBHOOK_SECRET;

      // Проверяем подпись
      if (!verifyWebhookSignature(payload, signatureHeader, webhookSecret)) {
          return res.status(400).json({ error: 'Invalid signature' });
      }

      // Обрабатываем webhook
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
      * Проверяет подпись полезной нагрузки webhook.
      *
      * @param payload Исходное тело запроса в виде строки
      * @param signatureHeader Значение заголовка Exa-Signature
      * @param webhookSecret Ваш секрет webhook
      * @return true, если подпись корректна, иначе false
      */
      public static boolean verifyWebhookSignature(String payload, String signatureHeader, String webhookSecret) {
          try {
              // Разбираем заголовок с подписью
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

              // Опционально: проверяем, что метка времени свежая (не старше 5 минут)
              long currentTime = Instant.now().getEpochSecond();
              long webhookTime = Long.parseLong(timestamp);
              if (Math.abs(currentTime - webhookTime) > 300) {
                  System.out.println("Warning: Webhook timestamp is more than 5 minutes old");
              }

              // Формируем подписываемую строку
              String signedPayload = timestamp + "." + payload;

              // Вычисляем ожидаемую подпись
              String expectedSignature = computeHmacSha256(signedPayload, webhookSecret);

              // Сравниваем с переданными подписями с помощью сравнения, устойчивого к атакам по времени
              return signatures.stream().anyMatch(sig -> timingSafeEquals(expectedSignature, sig));

          } catch (Exception e) {
              System.err.println("Error verifying signature: " + e.getMessage());
              return false;
          }
      }

      /**
      * Вычисляет подпись HMAC SHA256.
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
      * Преобразует массив байтов в шестнадцатеричную строку.
      */
      private static String bytesToHex(byte[] bytes) {
          StringBuilder result = new StringBuilder();
          for (byte b : bytes) {
              result.append(String.format("%02x", b));
          }
          return result.toString();
      }

      /**
      * Сравнение строк, устойчивое к атакам по времени.
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

      // Пример использования и тест
      public static void main(String[] args) {
          System.out.println("🚀 === Exa Webhook Signature Verification Test ===\n");

          // Тест с известной полезной нагрузкой и подписью
          String testPayload = "{\"type\":\"webset.created\",\"data\":{\"id\":\"ws_test\"}}";
          String testSecret = "test_webhook_secret";
          String testTimestamp = String.valueOf(Instant.now().getEpochSecond());

          try {
              // Создаём тестовую подпись
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

              // Проверка подписи
              boolean isValid = verifyWebhookSignature(testPayload, testHeader, testSecret);
              System.out.println("   ✓ Valid signature verification: " + (isValid ? "✅ PASSED" : "❌ FAILED"));

              // Тест с некорректной подписью
              String invalidHeader = "t=" + testTimestamp + ",v1=invalid_signature";
              boolean isInvalid = verifyWebhookSignature(testPayload, invalidHeader, testSecret);
              System.out.println("   ✓ Invalid signature rejection: " + (!isInvalid ? "✅ PASSED" : "❌ FAILED"));

              // Тест с отсутствующей меткой времени
              String noTimestampHeader = "v1=" + testSignature;
              boolean noTimestamp = verifyWebhookSignature(testPayload, noTimestampHeader, testSecret);
              System.out.println("   ✓ Missing timestamp rejection: " + (!noTimestamp ? "✅ PASSED" : "❌ FAILED"));

              // Тест с пустым заголовком
              boolean emptyHeader = verifyWebhookSignature(testPayload, "", testSecret);
              System.out.println("   ✓ Empty header rejection: " + (!emptyHeader ? "✅ PASSED" : "❌ FAILED"));

              // Тест с некорректно сформированным заголовком
              boolean malformedHeader = verifyWebhookSignature(testPayload, "invalid-header-format", testSecret);
              System.out.println("   ✓ Malformed header rejection: " + (!malformedHeader ? "✅ PASSED" : "❌ FAILED"));

              System.out.println();

              // Пример обработки webhook
              if (isValid) {
                  System.out.println("🎉 === Processing Valid Webhook ===");
                  System.out.println("   Processing webhook payload: " + testPayload);
                  // Здесь следует разобрать JSON и обработать событие webhook
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
  ## Рекомендации по безопасности
</div>

Соблюдение этих рекомендаций поможет сделать вашу реализацию webhook безопасной и надёжной:

* **Всегда проверяйте подписи** — никогда не обрабатывайте данные webhook, не проверив предварительно подпись. Это не позволит злоумышленникам отправлять на ваш эндпоинт поддельные webhook.

* **Используйте сравнение, устойчивое к атакам по времени** — при сравнении подписей применяйте функции вроде `hmac.compare_digest()` в Python или `crypto.timingSafeEqual()` в Node.js, чтобы предотвратить атаки по времени.

* **Проверяйте актуальность метки времени** — рассмотрите возможность отклонять webhook со слишком старыми метками времени (например, старше 5 минут), чтобы предотвратить атаки повторного воспроизведения.

* **Храните секреты безопасно** — храните секреты webhook в переменных окружения или в защищённой системе управления секретами. Никогда не задавайте их жёстко в коде приложения. **Важно**: секрет webhook возвращается только при [создании webhook](/ru/docs/websets/api/webhooks/create-a-webhook) — обязательно сохраните его в надёжном месте, так как получить его позже будет невозможно.

* **Используйте HTTPS** — всегда используйте HTTPS-эндпоинты для webhook, чтобы данные передавались в зашифрованном виде.

* **Регистрируйте конечный URL** — доставка webhook не следует HTTP-перенаправлениям (ответы 3xx). Если ваш эндпоинт выполняет перенаправление, доставка будет считаться неудачной. Всегда регистрируйте URL, который напрямую обрабатывает полезную нагрузку.

***

<br />

<div id="troubleshooting">
  ## Устранение неполадок
</div>

<div id="invalid-signature-errors">
  ### Ошибки недействительной подписи
</div>

Если проверка подписи не проходит:

1. **Проверьте исходные данные запроса**: убедитесь, что используете необработанное тело запроса, а не разобранный JSON-объект
2. **Проверьте секрет**: убедитесь, что используете правильный секрет webhook, полученный при его создании
3. **Проверьте разбор заголовка**: убедитесь, что корректно извлекаете метку времени и подписи из заголовка
4. **Проблемы с кодировкой**: используйте единую кодировку UTF-8 на всех этапах проверки

<div id="testing-signatures-locally">
  ### Локальное тестирование подписей
</div>

Вы можете протестировать логику проверки подписи, используя секрет webhook и пример полезной нагрузки:

```python Python theme={null}
# Тест с известной полезной нагрузкой и подписью
test_payload = '{"type":"webset.created","data":{"id":"ws_test"}}'
test_timestamp = "1234567890"
test_secret = "your_webhook_secret"

# Создаём тестовую подпись
import hmac
import hashlib

signed_payload = f"{test_timestamp}.{test_payload}"
test_signature = hmac.new(
    test_secret.encode('utf-8'),
    signed_payload.encode('utf-8'),
    hashlib.sha256
).hexdigest()

test_header = f"t={test_timestamp},v1={test_signature}"

# Проверяем, что всё работает
is_valid = verify_webhook_signature(test_payload, test_header, test_secret)
print(f"Test signature valid: {is_valid}")  # Должно вывести True
```

***

<br />

<div id="whats-next">
  ## Что дальше?
</div>

* Изучите [события webhook](/ru/docs/websets/api/events/types) и их полезную нагрузку
* Настройте [повторные попытки доставки и мониторинг webhook](/ru/docs/websets/api/webhooks/attempts/list-webhook-attempts)
* Ознакомьтесь с [эндпоинтами управления webhook](/ru/docs/websets/api/webhooks/create-a-webhook)