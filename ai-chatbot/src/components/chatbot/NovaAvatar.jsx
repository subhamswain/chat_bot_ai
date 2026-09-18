import { Sparkles } from "lucide-react";

function NovaAvatar({
  speaking = false,
  listening = false,
}) {

  return (
    <div
      className={`nova-avatar ${
        speaking ? "speaking" : ""
      } ${
        listening ? "listening" : ""
      }`}
    >

      <div className="avatar-glow" />

      <div className="avatar-head">

        <div className="avatar-hair" />

        <div className="avatar-face">

          <div className="avatar-eyes">

            <span />
            <span />

          </div>

          <div className="avatar-nose" />

          <div className="avatar-mouth" />

        </div>

        <div className="avatar-neck" />

      </div>

      <div className="avatar-sparkle">
        <Sparkles size={16} />
      </div>

    </div>
  );
}

export default NovaAvatar;