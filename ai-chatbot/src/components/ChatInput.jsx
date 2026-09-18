import { useState } from "react";

import {
  Paperclip,
  Mic,
  Globe,
  AtSign,
  ArrowUp,
  Brain,
  FileText,
  Code2,
} from "lucide-react";

function ChatInput({
  onSend,
  webSearch,
  setWebSearch,
  deepThink,
  setDeepThink,
  useDocuments,
  setUseDocuments,
}) {

  const [text, setText] = useState("");

  const send = () => {

    if (!text.trim()) return;

    onSend(text);

    setText("");

  };


  const handleKeyDown = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      send();

    }

  };


  return (
    <div className="composer-wrapper">

      <div className="composer">

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Nova anything..."
          rows={1}
        />

        <div className="composer-actions">

          <button title="Attach file">
            <Paperclip size={18} />
          </button>

          <button title="Mention">
            <AtSign size={17} />
          </button>

          <button title="Voice">
            <Mic size={18} />
          </button>

          <button
            className={
              webSearch
                ? "composer-tool active"
                : "composer-tool"
            }
            onClick={() => setWebSearch(!webSearch)}
          >
            <Globe size={16} />
          </button>

          <button
            className={
              useDocuments
                ? "composer-tool active"
                : "composer-tool"
            }
            onClick={() => setUseDocuments(!useDocuments)}
          >
            <FileText size={16} />
          </button>

          <button
            className={
              deepThink
                ? "composer-tool active"
                : "composer-tool"
            }
            onClick={() => setDeepThink(!deepThink)}
          >
            <Brain size={16} />
          </button>

          <button
            className="send-button"
            disabled={!text.trim()}
            onClick={send}
          >
            <ArrowUp size={19} />
          </button>

        </div>

      </div>


      <div className="composer-options">

        <button
          className={webSearch ? "option active" : "option"}
          onClick={() => setWebSearch(!webSearch)}
        >
          <Globe size={13} />
          Web Search
        </button>

        <button
          className={deepThink ? "option active" : "option"}
          onClick={() => setDeepThink(!deepThink)}
        >
          <Brain size={13} />
          Deep Think
        </button>

        <button
          className={useDocuments ? "option active" : "option"}
          onClick={() => setUseDocuments(!useDocuments)}
        >
          <FileText size={13} />
          Use my documents
        </button>

        <button className="option">
          <Code2 size={13} />
          Code Mode
        </button>

        <span className="keyboard-hint">
          Enter to send · Shift + Enter for new line
        </span>

      </div>

    </div>
  );
}

export default ChatInput;