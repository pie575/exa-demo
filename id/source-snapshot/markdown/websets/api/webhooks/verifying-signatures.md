> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Memverifikasi signature {#verifying-signatures}

> Pelajari cara memverifikasi signature webhook secara aman untuk memastikan permintaan benar-benar berasal dari Exa

Saat menerima webhook dari Exa, sebaiknya Anda memverifikasi bahwa webhook tersebut memang berasal dari kami untuk memastikan integritas dan keaslian datanya. Exa menandatangani semua payload webhook dengan secret key yang unik untuk setiap endpoint webhook Anda.

## Cara Kerja Signature Webhook {#how-webhook-signatures-work}

Exa menggunakan HMAC SHA256 untuk menandatangani payload webhook. Signature disertakan dalam header `Exa-Signature`, yang berisi:

* Timestamp (`t=`) yang menunjukkan kapan webhook dikirim
* Satu atau beberapa signature (`v1=`) yang dihitung menggunakan timestamp dan payload

Berikut format signature-nya:

```text theme={null}
Exa-Signature: t=1234567890,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```

## Proses Verifikasi {#verification-process}

Untuk memverifikasi signature webhook:

1. Ekstrak timestamp dan signature dari header `Exa-Signature`
2. Buat signed payload dengan menggabungkan timestamp, sebuah titik, dan raw request body
3. Hitung signature yang diharapkan menggunakan HMAC SHA256 dengan webhook secret Anda
4. Bandingkan signature hasil perhitungan Anda dengan signature yang diberikan

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
          # Parsing header signature
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

          # Opsional: Periksa apakah timestamp masih baru (dalam 5 menit terakhir)
          current_time = int(time.time())
          if abs(current_time - int(timestamp)) > 300:
              print("Warning: Webhook timestamp is more than 5 minutes old")

          # Buat payload yang ditandatangani
          signed_payload = f"{timestamp}.{payload}"

          # Hitung signature yang diharapkan
          expected_signature = hmac.new(
              webhook_secret.encode('utf-8'),
              signed_payload.encode('utf-8'),
              hashlib.sha256
          ).hexdigest()

          # Bandingkan dengan signature yang diberikan
          return any(hmac.compare_digest(expected_signature, sig) for sig in signatures)

      except Exception as e:
          print(f"Error verifying signature: {e}")
          return False

  # Contoh penggunaan pada endpoint webhook Flask
  from flask import Flask, request, jsonify
  import os

  app = Flask(__name__)

  @app.route('/webhook', methods=['POST'])
  def handle_webhook():
      # Ambil payload mentah dan signature
      payload = request.get_data(as_text=True)
      signature_header = request.headers.get('Exa-Signature', '')
      webhook_secret = os.environ.get('WEBHOOK_SECRET')

      # Verifikasi signature
      if not verify_webhook_signature(payload, signature_header, webhook_secret):
          return jsonify({'error': 'Invalid signature'}), 400

      # Proses webhook
      webhook_data = request.get_json()
      print(f"Received {webhook_data['type']} event")

      return jsonify({'status': 'success'}), 200
  ```

  ```javascript JavaScript/Node.js theme={null}
  const crypto = require('crypto');

  function verifyWebhookSignature(payload, signatureHeader, webhookSecret) {
      /**
       * Memverifikasi signature dari payload webhook.
       *
       * @param {string} payload - Raw request body dalam bentuk string
       * @param {string} signatureHeader - Nilai header Exa-Signature
       * @param {string} webhookSecret - Webhook secret Anda
       * @returns {boolean} True jika signature valid, false jika tidak
       */
      try {
          // Parsing header signature
          const pairs = signatureHeader.split(',').map(pair => pair.split('='));
          const timestamp = pairs.find(([key]) => key === 't')?.[1];
          const signatures = pairs
              .filter(([key]) => key === 'v1')
              .map(([, value]) => value);

          if (!timestamp || signatures.length === 0) {
              return false;
          }

          // Opsional: Periksa apakah timestamp masih baru (dalam 5 menit terakhir)
          const currentTime = Math.floor(Date.now() / 1000);
          if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
              console.warn('Warning: Webhook timestamp is more than 5 minutes old');
          }

          // Membuat payload yang ditandatangani
          const signedPayload = `${timestamp}.${payload}`;

          // Menghitung signature yang diharapkan
          const expectedSignature = crypto
              .createHmac('sha256', webhookSecret)
              .update(signedPayload)
              .digest('hex');

          // Membandingkan dengan signature yang diterima menggunakan perbandingan timing-safe
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

  // Contoh penggunaan pada endpoint webhook Express.js
  const express = require('express');
  const app = express();

  // Penting: Gunakan raw body parser untuk verifikasi webhook
  app.use('/webhook', express.raw({ type: 'application/json' }));

  app.post('/webhook', (req, res) => {
      const payload = req.body.toString();
      const signatureHeader = req.headers['exa-signature'] || '';
      const webhookSecret = process.env.WEBHOOK_SECRET;

      // Verifikasi signature
      if (!verifyWebhookSignature(payload, signatureHeader, webhookSecret)) {
          return res.status(400).json({ error: 'Invalid signature' });
      }

      // Memproses webhook
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
      * Verifikasi signature dari payload webhook.
      *
      * @param payload Raw request body dalam bentuk string
      * @param signatureHeader Nilai header Exa-Signature
      * @param webhookSecret Webhook secret Anda
      * @return true jika signature valid, false jika tidak
      */
      public static boolean verifyWebhookSignature(String payload, String signatureHeader, String webhookSecret) {
          try {
              // Parsing header signature
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

              // Opsional: Periksa apakah timestamp masih baru (dalam 5 menit terakhir)
              long currentTime = Instant.now().getEpochSecond();
              long webhookTime = Long.parseLong(timestamp);
              if (Math.abs(currentTime - webhookTime) > 300) {
                  System.out.println("Warning: Webhook timestamp is more than 5 minutes old");
              }

              // Buat signed payload
              String signedPayload = timestamp + "." + payload;

              // Hitung signature yang diharapkan
              String expectedSignature = computeHmacSha256(signedPayload, webhookSecret);

              // Bandingkan dengan signature yang diberikan menggunakan perbandingan timing-safe
              return signatures.stream().anyMatch(sig -> timingSafeEquals(expectedSignature, sig));

          } catch (Exception e) {
              System.err.println("Error verifying signature: " + e.getMessage());
              return false;
          }
      }

      /**
      * Hitung signature HMAC SHA256.
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
      * Konversi array byte menjadi string heksadesimal.
      */
      private static String bytesToHex(byte[] bytes) {
          StringBuilder result = new StringBuilder();
          for (byte b : bytes) {
              result.append(String.format("%02x", b));
          }
          return result.toString();
      }

      /**
      * Perbandingan string timing-safe untuk mencegah timing attack.
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

      // Contoh penggunaan dan pengujian
      public static void main(String[] args) {
          System.out.println("🚀 === Exa Webhook Signature Verification Test ===\n");

          // Uji dengan payload dan signature yang sudah diketahui
          String testPayload = "{\"type\":\"webset.created\",\"data\":{\"id\":\"ws_test\"}}";
          String testSecret = "test_webhook_secret";
          String testTimestamp = String.valueOf(Instant.now().getEpochSecond());

          try {
              // Buat signature untuk pengujian
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

              // Uji verifikasi
              boolean isValid = verifyWebhookSignature(testPayload, testHeader, testSecret);
              System.out.println("   ✓ Valid signature verification: " + (isValid ? "✅ PASSED" : "❌ FAILED"));

              // Uji dengan signature tidak valid
              String invalidHeader = "t=" + testTimestamp + ",v1=invalid_signature";
              boolean isInvalid = verifyWebhookSignature(testPayload, invalidHeader, testSecret);
              System.out.println("   ✓ Invalid signature rejection: " + (!isInvalid ? "✅ PASSED" : "❌ FAILED"));

              // Uji tanpa timestamp
              String noTimestampHeader = "v1=" + testSignature;
              boolean noTimestamp = verifyWebhookSignature(testPayload, noTimestampHeader, testSecret);
              System.out.println("   ✓ Missing timestamp rejection: " + (!noTimestamp ? "✅ PASSED" : "❌ FAILED"));

              // Uji dengan header kosong
              boolean emptyHeader = verifyWebhookSignature(testPayload, "", testSecret);
              System.out.println("   ✓ Empty header rejection: " + (!emptyHeader ? "✅ PASSED" : "❌ FAILED"));

              // Uji dengan header berformat salah
              boolean malformedHeader = verifyWebhookSignature(testPayload, "invalid-header-format", testSecret);
              System.out.println("   ✓ Malformed header rejection: " + (!malformedHeader ? "✅ PASSED" : "❌ FAILED"));

              System.out.println();

              // Contoh pemrosesan webhook
              if (isValid) {
                  System.out.println("🎉 === Processing Valid Webhook ===");
                  System.out.println("   Processing webhook payload: " + testPayload);
                  // Di sini Anda akan mem-parsing JSON dan menangani event webhook
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

## Praktik Terbaik Keamanan {#security-best-practices}

Mengikuti praktik berikut akan membantu memastikan implementasi webhook Anda aman dan andal:

* **Selalu Verifikasi Signature** - Jangan pernah memproses data webhook tanpa memverifikasi signature terlebih dahulu. Ini mencegah penyerang mengirim webhook palsu ke endpoint Anda.

* **Gunakan Perbandingan Timing-Safe** - Saat membandingkan signature, gunakan fungsi seperti `hmac.compare_digest()` di Python atau `crypto.timingSafeEqual()` di Node.js untuk mencegah timing attack.

* **Periksa Kebaruan Timestamp** - Pertimbangkan untuk menolak webhook dengan timestamp yang terlalu lama (misalnya, lebih dari 5 menit) untuk mencegah serangan replay.

* **Simpan Secret dengan Aman** - Simpan webhook secret Anda di variabel lingkungan atau sistem pengelolaan secret yang aman. Jangan pernah menuliskannya secara hardcode di aplikasi Anda. **Penting**: webhook secret hanya dikembalikan saat Anda [membuat webhook](/id/docs/websets/api/webhooks/create-a-webhook) - pastikan Anda menyimpannya dengan aman karena nilainya tidak dapat diambil lagi di kemudian hari.

* **Gunakan HTTPS** - Selalu gunakan endpoint HTTPS untuk webhook Anda agar data terenkripsi selama pengiriman.

* **Daftarkan URL Final** - Deliveries webhook tidak mengikuti pengalihan HTTP (response 3xx). Jika endpoint Anda melakukan pengalihan, pengiriman akan dianggap gagal. Selalu daftarkan URL yang langsung menangani payload.

***

<br />

## Pemecahan Masalah {#troubleshooting}

### Error Invalid Signature {#invalid-signature-errors}

Jika verifikasi signature Anda gagal:

1. **Periksa payload mentah**: Pastikan Anda menggunakan raw request body, bukan objek JSON yang sudah di-parse
2. **Verifikasi secret**: Pastikan Anda menggunakan webhook secret yang benar, yaitu yang diberikan saat webhook dibuat
3. **Periksa parsing header**: Pastikan Anda mengekstrak timestamp dan signature dari header dengan benar
4. **Masalah encoding**: Pastikan encoding UTF-8 konsisten di sepanjang proses verifikasi

### Menguji Signature Secara Lokal {#testing-signatures-locally}

Anda dapat menguji logika verifikasi signature dengan menggunakan webhook secret dan contoh payload:

```python Python theme={null}
# Uji dengan payload dan signature yang sudah diketahui
test_payload = '{"type":"webset.created","data":{"id":"ws_test"}}'
test_timestamp = "1234567890"
test_secret = "your_webhook_secret"

# Buat signature untuk pengujian
import hmac
import hashlib

signed_payload = f"{test_timestamp}.{test_payload}"
test_signature = hmac.new(
    test_secret.encode('utf-8'),
    signed_payload.encode('utf-8'),
    hashlib.sha256
).hexdigest()

test_header = f"t={test_timestamp},v1={test_signature}"

# Pastikan berfungsi
is_valid = verify_webhook_signature(test_payload, test_header, test_secret)
print(f"Test signature valid: {is_valid}")  # Seharusnya mencetak True
```

***

<br />

## Selanjutnya {#whats-next}

* Pelajari [events webhook](/id/docs/websets/api/events/types) dan payload-nya
* Siapkan [percobaan ulang dan pemantauan webhook](/id/docs/websets/api/webhooks/attempts/list-webhook-attempts)
* Jelajahi [endpoint pengelolaan webhook](/id/docs/websets/api/webhooks/create-a-webhook)