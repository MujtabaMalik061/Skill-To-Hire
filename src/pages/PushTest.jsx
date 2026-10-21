import { useState } from "react";
import { getToken } from "dev-push-notification";
import { sendPush } from "../utils/Push.Helper.js";
import "./PushTest.css";

const PushTest = () => {
  const [type, setType] = useState("push");
  const [title, setTitle] = useState("New Update");
  const [body, setBody] = useState("Version 2.0 released");
  const [fcmTokens, setFcmTokens] = useState("");
  const [from, setFrom] = useState("Skill To Hire");
  const [mails, setMails] = useState("");
  const [subject, setSubject] = useState("Announcement");
  const [htmlContent, setHtmlContent] = useState(
    "<h2>Important Update</h2>\n<p>Thank you for using our service.</p>",
  );
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [gettingToken, setGettingToken] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [deviceToken, setDeviceToken] = useState("");

  const handleGetToken = async () => {
    setGettingToken(true);
    setTokenError("");
    try {
      const tokenData = await getToken(import.meta.env.VITE_Push_Notification);
      if (!tokenData?.token) {
        throw new Error("Could not get a device token. Check browser notification permission and API key.");
      }
      setDeviceToken(tokenData.token);
      setFcmTokens((currentTokens) => {
        const tokens = currentTokens.split(/[\n,]+/).map((value) => value.trim()).filter(Boolean);
        return tokens.includes(tokenData.token) ? currentTokens : [...tokens, tokenData.token].join("\n");
      });
    } catch (tokenRequestError) {
      setTokenError(tokenRequestError instanceof Error ? tokenRequestError.message : String(tokenRequestError));
    } finally {
      setGettingToken(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setError("");
    setResult(null);

    try {
      const response = await sendPush({
        type,
        title,
        body,
        fcmTokens: fcmTokens.split(/[\n,]+/).map((value) => value.trim()).filter(Boolean),
        from,
        mails: mails.split(/[\n,]+/).map((value) => value.trim()).filter(Boolean),
        subject,
        htmlContent,
      });
      setResult(response);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : String(sendError));
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="push-test-page">
      <a className="back-link" href="/">← Skill To Hire</a>
      <section className="test-card">
        <div className="test-heading">
          <span className="eyebrow">DEVELOPER TOOL</span>
          <h1>Send a test</h1>
          <p>Send a push notification or email using your notification API key.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Message type</span>
            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option value="push">Push notification</option>
              <option value="mail">Email</option>
            </select>
          </label>

          {type === "push" ? (
            <>
              <label className="field">
                <span>Title</span>
                <input value={title} onChange={(event) => setTitle(event.target.value)} required />
              </label>
              <label className="field">
                <span>Body</span>
                <textarea value={body} onChange={(event) => setBody(event.target.value)} required rows={3} />
              </label>
              <label className="field">
                <span>FCM tokens <small>Separate tokens with commas or new lines</small></span>
                <textarea value={fcmTokens} onChange={(event) => setFcmTokens(event.target.value)} required rows={3} placeholder="Paste one or more device tokens" />
              </label>
              <div className="token-tools">
                <button className="token-button" type="button" onClick={handleGetToken} disabled={gettingToken}>
                  {gettingToken ? "Getting token…" : "Get device token"}
                </button>
                {deviceToken && <span className="token-success">Token added to the recipients field.</span>}
              </div>
              {tokenError && <p className="token-error" role="alert">{tokenError}</p>}
            </>
          ) : (
            <>
              <label className="field">
                <span>From</span>
                <input value={from} onChange={(event) => setFrom(event.target.value)} required />
              </label>
              <label className="field">
                <span>Recipients <small>Separate addresses with commas or new lines</small></span>
                <textarea value={mails} onChange={(event) => setMails(event.target.value)} required rows={3} placeholder="name@example.com" />
              </label>
              <label className="field">
                <span>Subject</span>
                <input value={subject} onChange={(event) => setSubject(event.target.value)} required />
              </label>
              <label className="field">
                <span>Email HTML</span>
                <textarea className="code-input" value={htmlContent} onChange={(event) => setHtmlContent(event.target.value)} required rows={6} />
              </label>
            </>
          )}

          <button className="send-button" type="submit" disabled={sending}>
            {sending ? "Sending…" : `Send ${type === "push" ? "notification" : "email"}`}
          </button>
        </form>

        {error && <pre className="response response-error">{error}</pre>}
        {result && <pre className="response">{JSON.stringify(result, null, 2)}</pre>}
      </section>
    </main>
  );
};

export default PushTest;
