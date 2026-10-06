/**
 * Memegames Help — DIY contact forwarder (Google Apps Script).
 * Real inbox stays off the public HTML. Deploy as Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 * Paste the /exec URL into help/contact-proxy-config.js
 *
 * Optional: set FORWARD_TO in Script Properties instead of hardcoding.
 */
// Set Script property FORWARD_TO to your real inbox (never commit the address).
var FORWARD_TO_DEFAULT = '';

function doPost(e) {
  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Honeypot — bots fill "company"
    if (data.company) {
      return json_({ ok: true, ignored: true });
    }

    var name = String(data.name || '').slice(0, 120);
    var phone = String(data.phone || '').slice(0, 40);
    var msg = String(data.message || '').slice(0, 4000);
    var when = String(data.when || '').slice(0, 200);
    var os = String(data.os || '').slice(0, 80);

    if (!msg || msg.length < 5) {
      return json_({ ok: false, error: 'message required' }, 400);
    }

    var to = PropertiesService.getScriptProperties().getProperty('FORWARD_TO') || FORWARD_TO_DEFAULT;
    if (!to) {
      return json_({ ok: false, error: 'FORWARD_TO not configured' });
    }
    var body =
      'Memegames Help booking (via contact proxy)\n\n' +
      'Name: ' + name + '\n' +
      'Phone/text: ' + phone + '\n' +
      'OS: ' + os + '\n' +
      'When free: ' + when + '\n\n' +
      msg + '\n';

    MailApp.sendEmail({
      to: to,
      subject: 'REMOTE HELP booking' + (name ? ' — ' + name : ''),
      body: body,
      replyTo: phone && phone.indexOf('@') >= 0 ? phone : undefined
    });

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) }, 500);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Memegames Help contact proxy is up. Use POST.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function json_(obj, status) {
  // Apps Script web apps don't set HTTP status reliably for all clients;
  // body.ok is the real signal.
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
