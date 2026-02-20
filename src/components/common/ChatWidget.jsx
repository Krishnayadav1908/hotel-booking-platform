// This component injects a third-party chat widget (e.g., Crisp)
import { useEffect } from "react";

export default function ChatWidget() {
  useEffect(() => {
    // Replace with your Crisp/Tawk.to/other widget code
    if (window.$crisp) return; // Prevent duplicate
    window.$crisp = [];
    (function () {
      var d = document;
      var s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  }, []);
  return null;
}
