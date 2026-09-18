import {
  Sparkles,
} from "lucide-react";

function ChatButton({
  onClick,
}) {

  return (
    <button
      className="nova-floating-button"
      onClick={onClick}
      aria-label="Open Nova AI"
    >

      <span className="nova-button-ring" />

      <Sparkles size={25} />

      <span className="nova-floating-text">
        Nova
      </span>

      <span className="nova-online-dot" />

    </button>
  );
}

export default ChatButton;