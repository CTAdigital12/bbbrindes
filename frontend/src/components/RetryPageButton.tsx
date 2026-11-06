"use client";

export default function RetryPageButton() {
  return <button type="button" className="btn btn-deep" onClick={() => window.location.reload()}>Tentar novamente</button>;
}
