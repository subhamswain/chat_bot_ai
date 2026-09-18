import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

function ChatMessage({ message }) {

  const isUser = message.role === "user";

  return (
    <div
      className={
        isUser
          ? "message-wrapper user-message-wrapper"
          : "message-wrapper"
      }
    >

      {!isUser && (
        <div className="assistant-avatar">
          ✦
        </div>
      )}

      <div className="message-content">

        <div
          className={
            isUser
              ? "message-bubble user-bubble"
              : "message-bubble assistant-bubble"
          }
        >

          {message.content.split("```").map((part, index) => {

            if (index % 2 === 1) {

              return (
                <pre className="code-block" key={index}>
                  <code>{part}</code>
                </pre>
              );

            }

            return (
              <p key={index}>
                {part}
              </p>
            );

          })}

        </div>

        {!isUser && (
          <div className="message-actions">

            <button>
              <Copy size={14} />
              Copy
            </button>

            <button>
              <ThumbsUp size={14} />
            </button>

            <button>
              <ThumbsDown size={14} />
            </button>

            <button>
              <RotateCcw size={14} />
              Regenerate
            </button>

            <button>
              <Bookmark size={14} />
              Save
            </button>

            <button>
              <MoreHorizontal size={14} />
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default ChatMessage;