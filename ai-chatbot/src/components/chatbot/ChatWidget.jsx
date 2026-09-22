import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  X,
  Minus,
  Paperclip,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  FileText,
  ExternalLink,
  Clock3,
  MessageSquareWarning,
} from "lucide-react";

import NovaAvatar from "./NovaAvatar";
import { sendChatMessage,uploadDocument,
   } from "../../services/api";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* =====================================================
   LANGUAGES
===================================================== */

const LANGUAGES = {
  en: {
    label: "English",
    speech: "en-IN",

    greeting:
      "Hello Satyabrata! 👋 Good morning! How can I help you today?",

    welcome:
      "I can help you with applications, grievances, policies, documents and investor services.",

    placeholder:
      "Type your message...",

    online:
      "Online • Available 24/7",

    listening:
      "Listening...",

    speaking:
      "Speaking...",

    quickActions: [
      "Check application status",
      "Track grievance",
      "Find a policy",
      "Investor services",
    ],
  },

  hi: {
    label: "हिंदी",
    speech: "hi-IN",

    greeting:
      "नमस्ते सत्यब्रत! 👋 सुप्रभात! मैं आपकी कैसे सहायता कर सकता हूँ?",

    welcome:
      "मैं आवेदन, शिकायत, नीति, दस्तावेज़ और निवेशक सेवाओं में आपकी सहायता कर सकता हूँ।",

    placeholder:
      "अपना संदेश लिखें...",

    online:
      "ऑनलाइन • 24/7 उपलब्ध",

    listening:
      "सुन रहा हूँ...",

    speaking:
      "बोल रहा हूँ...",

    quickActions: [
      "आवेदन की स्थिति देखें",
      "शिकायत ट्रैक करें",
      "नीति खोजें",
      "निवेशक सेवाएं",
    ],
  },

  nl: {
    label: "Nederlands",
    speech: "nl-NL",

    greeting:
      "Hallo Satyabrata! 👋 Goedemorgen! Hoe kan ik u vandaag helpen?",

    welcome:
      "Ik kan u helpen met aanvragen, klachten, beleid, documenten en beleggersdiensten.",

    placeholder:
      "Typ uw bericht...",

    online:
      "Online • 24/7 beschikbaar",

    listening:
      "Ik luister...",

    speaking:
      "Ik spreek...",

    quickActions: [
      "Aanvraagstatus controleren",
      "Klacht volgen",
      "Beleid zoeken",
      "Beleggersdiensten",
    ],
  },

  ko: {
    label: "한국어",
    speech: "ko-KR",

    greeting:
      "안녕하세요 Satyabrata님! 👋 좋은 아침입니다! 오늘 무엇을 도와드릴까요?",

    welcome:
      "신청, 민원, 정책, 문서 및 투자자 서비스에 대해 도와드릴 수 있습니다.",

    placeholder:
      "메시지를 입력하세요...",

    online:
      "온라인 • 24시간 이용 가능",

    listening:
      "듣고 있습니다...",

    speaking:
      "말하고 있습니다...",

    quickActions: [
      "신청 상태 확인",
      "민원 추적",
      "정책 찾기",
      "투자자 서비스",
    ],
  },

  zh: {
    label: "中文",
    speech: "zh-CN",

    greeting:
      "您好 Satyabrata！👋 早上好！今天我可以为您提供什么帮助？",

    welcome:
      "我可以帮助您处理申请、投诉、政策、文件和投资者服务。",

    placeholder:
      "请输入您的消息...",

    online:
      "在线 • 全天候可用",

    listening:
      "正在聆听...",

    speaking:
      "正在说话...",

    quickActions: [
      "查询申请状态",
      "跟踪投诉",
      "查找政策",
      "投资者服务",
    ],
  },

  ja: {
    label: "日本語",
    speech: "ja-JP",

    greeting:
      "こんにちは Satyabrataさん！👋 おはようございます！今日はどのようにお手伝いできますか？",

    welcome:
      "申請、苦情、ポリシー、書類、投資家サービスについてサポートできます。",

    placeholder:
      "メッセージを入力してください...",

    online:
      "オンライン • 24時間対応",

    listening:
      "聞いています...",

    speaking:
      "話しています...",

    quickActions: [
      "申請状況を確認",
      "苦情を追跡",
      "ポリシーを検索",
      "投資家サービス",
    ],
  },

  es: {
    label: "Español",
    speech: "es-ES",

    greeting:
      "¡Hola Satyabrata! 👋 ¡Buenos días! ¿Cómo puedo ayudarte hoy?",

    welcome:
      "Puedo ayudarte con solicitudes, reclamaciones, políticas, documentos y servicios para inversores.",

    placeholder:
      "Escribe tu mensaje...",

    online:
      "En línea • Disponible 24/7",

    listening:
      "Escuchando...",

    speaking:
      "Hablando...",

    quickActions: [
      "Consultar estado de solicitud",
      "Seguir reclamación",
      "Buscar una política",
      "Servicios para inversores",
    ],
  },
};


/* =====================================================
   MOCK DATA
===================================================== */

const MOCK_APPLICATIONS = [

  {
    id: "APP-2026-001245",
    service: "Investor Certificate",
    status: "Under Review",
    date: "12 Sep 2026",
    pendingAction: "No action required",
  },

  {
    id: "APP-2026-001178",
    service: "Account Update",
    status: "Pending",
    date: "08 Sep 2026",
    pendingAction: "Upload address proof",
  },

];


const MOCK_GRIEVANCES = [

  {
    id: "GRV-2026-00087",
    subject: "Document verification issue",
    status: "In Progress",
    date: "10 Sep 2026",
    priority: "Medium",
  },

];


const MOCK_POLICIES = [

  {
    title: "Investor Service Guidelines",
    clause: "Clause 4.2",
    page: "Page 18",

    description:
      "Requests requiring investor verification must include the prescribed supporting documents.",
  },

  {
    title: "Grievance Redressal Policy",
    clause: "Clause 7.1",
    page: "Page 24",

    description:
      "Investors can track grievance status using their registered application reference.",
  },

];


/* =====================================================
   LOCAL RESPONSE
===================================================== */

function getLocalResponse(
  text,
  language,
  isLoggedIn
) {

  const value =
    text.toLowerCase();


  /* APPLICATION */

  if (
    value.includes("application") ||
    value.includes("आवेदन") ||
    value.includes("अर्ज")
  ) {

    return {

      type: "application",

      text:
        language === "hi"

          ? "मैं आपके आवेदन की जानकारी दिखा सकता हूँ। नीचे आपके हाल के आवेदन हैं।"

          : language === "mr"

            ? "मी तुमच्या अर्जाची माहिती दाखवू शकतो. खाली तुमचे अलीकडील अर्ज आहेत."

            : "I found your recent applications. You can review their current status below.",

    };

  }


  /* STATUS */

  if (
    value.includes("status") ||
    value.includes("स्थिति") ||
    value.includes("स्थिती")
  ) {

    return {

      type: "application",

      text:
        language === "hi"

          ? "आपके हाल के आवेदन नीचे दिए गए हैं।"

          : language === "mr"

            ? "तुमचे अलीकडील अर्ज खाली दिले आहेत."

            : "Here is the current status of your recent applications.",

    };

  }


  /* GRIEVANCE */

  if (
    value.includes("grievance") ||
    value.includes("complaint") ||
    value.includes("शिकायत") ||
    value.includes("तक्रार")
  ) {

    return {

      type: "grievance",

      text:
        language === "hi"

          ? "मैंने आपकी हाल की शिकायत ढूँढ ली है।"

          : language === "mr"

            ? "मला तुमची अलीकडील तक्रार सापडली आहे."

            : "I found your recent grievance details.",

    };

  }


  /* POLICY */

  if (
    value.includes("policy") ||
    value.includes("clause") ||
    value.includes("rule") ||
    value.includes("guideline") ||
    value.includes("नीति") ||
    value.includes("नियम") ||
    value.includes("धोरण")
  ) {

    return {

      type: "policy",

      text:
        language === "hi"

          ? "संबंधित नीति का क्लॉज़ और पेज नीचे दिया गया है।"

          : language === "mr"

            ? "संबंधित धोरणातील कलम आणि पृष्ठ खाली दिले आहे."

            : "I found relevant policy references. The clause and page are shown below.",

    };

  }


  /* DOCUMENT */

  if (
    value.includes("document") ||
    value.includes("certificate") ||
    value.includes("दस्तावेज") ||
    value.includes("दस्तऐवज")
  ) {

    return {

      type: "text",

      text:
        language === "hi"

          ? "मैं आपको दस्तावेज़, प्रमाणपत्र और डाउनलोड विकल्पों में सहायता कर सकता हूँ।"

          : language === "mr"

            ? "मी तुम्हाला कागदपत्रे, प्रमाणपत्रे आणि डाउनलोड पर्यायांमध्ये मदत करू शकतो."

            : "I can help you find documents, certificates and available download options.",

    };

  }


  /* GREETING */

  if (
    value.includes("hello") ||
    value.includes("hi") ||
    value.includes("hey") ||
    value.includes("नमस्ते") ||
    value.includes("नमस्कार")
  ) {

    return {

      type: "text",

      text:
        language === "hi"

          ? "नमस्ते! मैं Nova हूँ। आज मैं आपकी किस चीज़ में सहायता करूँ?"

          : language === "mr"

            ? "नमस्कार! मी Nova आहे. आज मी तुमची कशामध्ये मदत करू?"

            : "Hello! I'm Nova. What would you like help with today?",

    };

  }


  /* LOGGED OUT */

  if (!isLoggedIn) {

    return {

      type: "text",

      text:
        language === "hi"

          ? "आप लॉगिन नहीं हैं। मैं सामान्य सेवाओं, नीतियों और FAQs में सहायता कर सकता हूँ।"

          : language === "mr"

            ? "तुम्ही लॉगिन केलेले नाही. मी सामान्य सेवा, धोरणे आणि FAQs मध्ये मदत करू शकतो."

            : "You are currently not logged in. I can help with public services, policies and FAQs.",

    };

  }


  /* DEFAULT */

  return {

    type: "text",

    text:
      language === "hi"

        ? "मैं आपकी सहायता कर सकता हूँ। आप आवेदन स्थिति, शिकायत, नीति, दस्तावेज़ या किसी निवेशक सेवा के बारे में पूछ सकते हैं।"

        : language === "mr"

          ? "मी तुमची मदत करू शकतो. तुम्ही अर्जाची स्थिती, तक्रार, धोरण, कागदपत्र किंवा गुंतवणूकदार सेवांबद्दल विचारू शकता."

          : "I can help you with application status, grievances, policies, documents or investor services.",

  };

}


/* =====================================================
   CHAT WIDGET
===================================================== */

function ChatWidget({
  onClose,
  isLoggedIn,
}) {


  /* =================================================
     STATES
  ================================================= */

  const [language, setLanguage] =
    useState("en");

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [isListening, setIsListening] =
    useState(false);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [voiceEnabled, setVoiceEnabled] =
    useState(true);

  const [isTyping, setIsTyping] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [documentSuggestions, setDocumentSuggestions] =
  useState([]);
  /* =================================================
     REFS
  ================================================= */

  const messagesEndRef =
    useRef(null);

  const fileInputRef =
    useRef(null);

  const recognitionRef =
    useRef(null);


  /* =================================================
     CURRENT LANGUAGE
  ================================================= */

  const currentLanguage =
    LANGUAGES[language];


  /* =================================================
     LOAD BROWSER VOICES
     
     IMPORTANT:
     This useEffect is INSIDE ChatWidget.
  ================================================= */

  useEffect(() => {

    if (
      !("speechSynthesis" in window)
    ) {
      return;
    }


    const loadVoices = () => {

      const voices =
        window.speechSynthesis.getVoices();


      console.log(
        "Loaded speech voices:",
        voices.map(
          (voice) => ({
            name: voice.name,
            lang: voice.lang,
            default:
              voice.default,
          })
        )
      );

    };


    loadVoices();


    window.speechSynthesis.onvoiceschanged =
      loadVoices;


    return () => {

      window.speechSynthesis.onvoiceschanged =
        null;

      window.speechSynthesis.cancel();

    };

  }, []);


  /* =================================================
     INITIAL CHAT
  ================================================= */

  useEffect(() => {

    const savedMessages =
      localStorage.getItem(
        "nova-chat-history"
      );


    if (savedMessages) {

      try {

        const parsed =
          JSON.parse(
            savedMessages
          );

        setMessages(parsed);

        return;

      } catch {
        // Invalid storage
      }

    }


    setMessages([

      {
        id: Date.now(),

        sender: "assistant",

        type: "text",

        text:
          currentLanguage.greeting,
      },

      {
        id: Date.now() + 1,

        sender: "assistant",

        type: "text",

        text:
          currentLanguage.welcome,
      },

    ]);

  }, []);


  /* =================================================
     SAVE CHAT
  ================================================= */

  useEffect(() => {

    if (
      messages.length > 0
    ) {

      localStorage.setItem(
        "nova-chat-history",
        JSON.stringify(messages)
      );

    }

  }, [messages]);


  /* =================================================
     AUTO SCROLL
  ================================================= */

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );

  }, [
    messages,
    isTyping,
  ]);


  /* =================================================
     LANGUAGE CHANGE
  ================================================= */

  useEffect(() => {

    if (
      messages.length === 0
    ) {
      return;
    }


    setMessages(
      (previous) => {

        const withoutGreeting =
          previous.filter(
            (item) =>
              !item.isGreeting
          );


        return [

          {
            id: Date.now(),

            sender: "assistant",

            type: "text",

            text:
              currentLanguage.greeting,

            isGreeting: true,
          },

          ...withoutGreeting,

        ];

      }
    );

  }, [language]);


  /* =================================================
     TEXT TO SPEECH
     
     Marathi voice FIX
  ================================================= */

const speakText = (text) => {
  if (!text || !voiceEnabled) {
    return;
  }

  if (!("speechSynthesis" in window)) {
    alert(
      "Text-to-speech is not supported in this browser."
    );
    return;
  }

  window.speechSynthesis.cancel();

  const languageCode =
    currentLanguage.speech;

  const speak = () => {
    const voices =
      window.speechSynthesis.getVoices();

    console.log(
      "Available voices:",
      voices.map((voice) => ({
        name: voice.name,
        lang: voice.lang,
      }))
    );

    let selectedVoice = null;

    /*
     * 1. Exact language
     */
    selectedVoice = voices.find(
      (voice) =>
        voice.lang.toLowerCase() ===
        languageCode.toLowerCase()
    );

    /*
     * 2. Base language
     */
    if (!selectedVoice) {
      const baseLanguage =
        languageCode
          .split("-")[0]
          .toLowerCase();

      selectedVoice = voices.find(
        (voice) =>
          voice.lang
            .toLowerCase()
            .startsWith(baseLanguage)
      );
    }

    console.log(
      "Selected language:",
      languageCode
    );

    console.log(
      "Selected voice:",
      selectedVoice
    );

    /*
     * No voice available
     */
    if (!selectedVoice) {
      alert(
        `No ${currentLanguage.label} voice is available in this browser.`
      );

      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang =
      languageCode;

    utterance.voice =
      selectedVoice;

    /*
     * Speech speed
     */
    utterance.rate =
      language === "ko"
        ? 0.9
        : language === "ja"
          ? 0.9
          : language === "zh"
            ? 0.9
            : language === "nl"
              ? 0.95
              : language === "es"
                ? 0.95
                : 0.95;

    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error(
        "Speech synthesis error:",
        event
      );

      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(
      utterance
    );
  };

  const voices =
    window.speechSynthesis.getVoices();

  if (voices.length === 0) {
    const handleVoicesChanged =
      () => {
        window.speechSynthesis
          .removeEventListener(
            "voiceschanged",
            handleVoicesChanged
          );

        speak();
      };

    window.speechSynthesis
      .addEventListener(
        "voiceschanged",
        handleVoicesChanged
      );
  } else {
    speak();
  }
};


  /* =================================================
     VOICE INPUT
  ================================================= */

  const startVoiceInput = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

      alert(
        "Voice recognition is not supported in this browser. Please use Google Chrome."
      );

      return;

    }


    if (isListening) {

      recognitionRef.current?.stop();

      return;

    }


    const recognition =
      new SpeechRecognition();


    /* ============================================
       LANGUAGE
    ============================================ */

    recognition.lang =
  language === "hi"
    ? "hi-IN"
    : language === "nl"
      ? "nl-NL"
      : language === "ko"
        ? "ko-KR"
        : language === "zh"
          ? "zh-CN"
          : language === "ja"
            ? "ja-JP"
            : language === "es"
              ? "es-ES"
              : "en-IN";


    recognition.continuous =
      false;

    recognition.interimResults =
      true;


    /* ============================================
       START
    ============================================ */

    recognition.onstart =
      () => {

        setIsListening(true);

      };


    /* ============================================
       RESULT
    ============================================ */

    recognition.onresult =
      (event) => {

        let transcript = "";


        for (
          let i =
            event.resultIndex;

          i <
          event.results.length;

          i++
        ) {

          transcript +=
            event.results[i][0]
              .transcript;

        }


        setMessage(
          transcript
        );

      };


    /* ============================================
       ERROR
    ============================================ */

    recognition.onerror =
      (event) => {

        console.error(
          "Speech recognition error:",
          event.error
        );

        setIsListening(false);

      };


    /* ============================================
       END
    ============================================ */

    recognition.onend =
      () => {

        setIsListening(false);

      };


    recognitionRef.current =
      recognition;


    recognition.start();

  };


  /* =================================================
     ASSISTANT RESPONSE
  ================================================= */

  const addAssistantResponse = (
    response
  ) => {

    const assistantMessage = {

      id:
        Date.now() + 2,

      sender:
        "assistant",

      type:
        response.type,

      text:
        response.text,

      data:
        response.type ===
        "application"

          ? MOCK_APPLICATIONS

          : response.type ===
            "grievance"

            ? MOCK_GRIEVANCES

            : response.type ===
              "policy"

              ? MOCK_POLICIES

              : null,

    };


    setMessages(
      (previous) => [

        ...previous,

        assistantMessage,

      ]
    );


    speakText(
      response.text
    );

  };


  /* =================================================
     SEND MESSAGE
  ================================================= */

const sendMessage = async (customMessage = null) => {

  const text = customMessage ?? message;

  if (!text.trim()) {
    return;
  }

  const userText = text.trim();

  // Add user message
  setMessages((previous) => [
    ...previous,
    {
      id: Date.now(),
      sender: "user",
      type: "text",
      text: userText,
    },
  ]);

  setMessage("");
  setIsTyping(true);

  try {

    let documentId = null;

    // Use already uploaded document
    if (selectedFile?.documentId) {

      documentId = selectedFile.documentId;

      console.log(
        "USING EXISTING DOCUMENT ID:",
        documentId
      );
    }

    console.log(
      "FINAL DOCUMENT ID:",
      documentId
    );

    // Send question + document ID to Django
    const data = await sendChatMessage(
      userText,
      documentId
    );

    console.log(
      "CHAT RESPONSE:",
      data
    );

    // Show AI response
    setMessages((previous) => [
      ...previous,
      {
        id: Date.now() + 1,
        sender: "assistant",
        type: "text",
        text:
          data.response ||
          "I could not generate a response.",
      },
    ]);

    if (data.response) {
      speakText(data.response);
    }

  } catch (error) {

    console.error(
      "CHAT ERROR:",
      error
    );

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now() + 1,
        sender: "assistant",
        type: "text",
        text:
          "Sorry, I could not process your request.",
      },
    ]);

  } finally {

    setIsTyping(false);

  }
};


  /* =================================================
     QUICK ACTION
  ================================================= */

  const handleQuickAction =
    (action) => {

      sendMessage(action);

    };


  /* =================================================
     FILE
  ================================================= */

const handleFileSelect = async (event) => {

    const file = event.target.files?.[0];

    if (!file) {
        return;
    }

    console.log("SELECTED FILE:", file.name);

    // Currently support PDF
    if (file.type !== "application/pdf") {

        alert("Currently only PDF files are supported.");

        event.target.value = "";

        return;
    }

    try {

        setIsTyping(true);

        console.log("UPLOADING DOCUMENT...");

        const data = await uploadDocument(file);

        console.log("DOCUMENT UPLOADED:", data);

        setSelectedFile({
            file: file,
            documentId: data.document_id,
            fileName: data.file_name,
        });

        setMessages((prev) => [
            ...prev,
            {
                sender: "assistant",
                text:
                    `I've successfully read "${data.file_name}". ` +
                    `You can now ask me questions about this document.`,
            },
        ]);

    } catch (error) {

        console.error(
            "DOCUMENT UPLOAD ERROR:",
            error
        );

        setMessages((prev) => [
            ...prev,
            {
                sender: "assistant",
                text:
                    `I couldn't read "${file.name}". ` +
                    `Please try uploading the PDF again.`,
            },
        ]);

    } finally {

        setIsTyping(false);

        event.target.value = "";
    }
};
const handleFileChange = async (event) => {

  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  console.log("SELECTED FILE:", file.name);

  // Supported file extensions
  const supportedExtensions = [
    ".pdf",
    ".docx",
    ".xlsx",
    ".xlsm",
    ".pptx",
    ".txt",
    ".csv",
  ];

  const fileName = file.name.toLowerCase();

  const isSupported =
    supportedExtensions.some(
      (extension) =>
        fileName.endsWith(extension)
    );

  if (!isSupported) {

    alert(
      "Unsupported file type.\n\nSupported files: PDF, DOCX, XLSX, XLSM, PPTX, TXT, CSV"
    );

    event.target.value = "";

    return;
  }

  try {

    setIsTyping(true);

    console.log(
      "UPLOADING DOCUMENT..."
    );

    // Upload immediately
    const data =
      await uploadDocument(file);

    console.log(
      "DOCUMENT UPLOADED:",
      data
    );

    // Store file + document ID
    setSelectedFile({
      file: file,
      name: data.file_name,
      documentId: data.document_id,
    });

    // Show success message
    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        sender: "assistant",
        type: "text",
        text:
          `I've successfully read **${data.file_name}**.\n\n` +
          `You can now ask me questions about this document.`,
      },
    ]);

  } catch (error) {

    console.error(
      "DOCUMENT UPLOAD ERROR:",
      error
    );

    setSelectedFile(null);

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        sender: "assistant",
        type: "text",
        text:
          `I couldn't read **${file.name}**.\n\n` +
          `Please check the file and try again.`,
      },
    ]);

  } finally {

    setIsTyping(false);

    event.target.value = "";
  }
};


  /* =================================================
     CLEAR CHAT
  ================================================= */

  const clearChat = () => {

    localStorage.removeItem(
      "nova-chat-history"
    );


    setMessages([

      {
        id: Date.now(),

        sender:
          "assistant",

        type:
          "text",

        text:
          currentLanguage.greeting,
      },

      {
        id:
          Date.now() + 1,

        sender:
          "assistant",

        type:
          "text",

        text:
          currentLanguage.welcome,
      },

    ]);

  };


  /* =================================================
     APPLICATION CARD
  ================================================= */

  const renderApplicationCard =
    (data) => {

      return (

        <div className="nova-result-card">

          <div className="nova-result-card-header">

            <div className="nova-result-icon">

              <FileText
                size={16}
              />

            </div>


            <div>

              <strong>
                Application Status
              </strong>

              <span>
                Recent applications
              </span>

            </div>

          </div>


          {data.map(
            (application) => (

              <div
                className="nova-application-item"
                key={application.id}
              >

                <div className="application-main">

                  <strong>
                    {application.service}
                  </strong>

                  <span>
                    {application.id}
                  </span>

                </div>


                <div
                  className={`application-status ${
                    application.status
                      .toLowerCase()
                      .replaceAll(
                        " ",
                        "-"
                      )
                  }`}
                >
                  {application.status}
                </div>


                <div className="application-date">

                  Submitted{" "}
                  {application.date}

                </div>


                {application.pendingAction !==
                  "No action required" && (

                  <div className="pending-action">

                    <Clock3
                      size={13}
                    />

                    {
                      application.pendingAction
                    }

                  </div>

                )}

              </div>

            )
          )}


          <button
            className="result-link"
          >

            View all applications

            <ExternalLink
              size={13}
            />

          </button>

        </div>

      );

    };


  /* =================================================
     GRIEVANCE CARD
  ================================================= */

  const renderGrievanceCard =
    (data) => {

      return (

        <div className="nova-result-card">

          <div className="nova-result-card-header">

            <div className="nova-result-icon grievance">

              <MessageSquareWarning
                size={16}
              />

            </div>


            <div>

              <strong>
                Grievance Status
              </strong>

              <span>
                Recent grievance
              </span>

            </div>

          </div>


          {data.map(
            (item) => (

              <div
                className="nova-grievance-item"
                key={item.id}
              >

                <div className="grievance-top">

                  <strong>
                    {item.subject}
                  </strong>

                  <span className="grievance-status">
                    {item.status}
                  </span>

                </div>


                <div className="grievance-number">

                  {item.id}

                </div>


                <div className="grievance-details">

                  <span>
                    {item.date}
                  </span>

                  <span>
                    Priority:{" "}
                    {item.priority}
                  </span>

                </div>

              </div>

            )
          )}


          <button
            className="result-link"
          >

            View grievance history

            <ExternalLink
              size={13}
            />

          </button>

        </div>

      );

    };


  /* =================================================
     POLICY CARD
  ================================================= */

  const renderPolicyCard =
    (data) => {

      return (

        <div className="nova-result-card">

          <div className="nova-result-card-header">

            <div className="nova-result-icon policy">

              <FileText
                size={16}
              />

            </div>


            <div>

              <strong>
                Relevant Policy
              </strong>

              <span>
                Clause-level reference
              </span>

            </div>

          </div>


          {data.map(
            (item) => (

              <div
                className="nova-policy-item"
                key={item.clause}
              >

                <strong>
                  {item.title}
                </strong>


                <div className="policy-reference">

                  <span>
                    {item.clause}
                  </span>

                  <span>
                    {item.page}
                  </span>

                </div>


                <p>
                  {item.description}
                </p>


                <button
                  className="policy-open-button"
                >

                  Open document

                  <ExternalLink
                    size={13}
                  />

                </button>

              </div>

            )
          )}

        </div>

      );

    };


  /* =================================================
     MESSAGE CONTENT
  ================================================= */

  const renderMessageContent =
    (item) => {

      return (

        <>

          <div className="nova-message-text">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
  >
    {item.text}
  </ReactMarkdown>
</div>


          {item.type ===
            "application" &&

            renderApplicationCard(
              item.data
            )
          }


          {item.type ===
            "grievance" &&

            renderGrievanceCard(
              item.data
            )
          }


          {item.type ===
            "policy" &&

            renderPolicyCard(
              item.data
            )
          }

        </>

      );

    };


  /* =================================================
     UI
  ================================================= */

  return (

    <div className="nova-widget">


      {/* HEADER */}

      <div className="nova-header">

        <div className="nova-header-left">

          <div className="nova-mini-avatar">

            <Sparkles
              size={17}
            />

          </div>


          <div>

            <div className="nova-title">
              Nova AI
            </div>


            <div className="nova-status">

              <span />

              {
                currentLanguage.online
              }

            </div>

          </div>

        </div>


        <div className="nova-header-actions">

          <button
            title="Clear chat"
            onClick={clearChat}
          >
            <Minus
              size={17}
            />
          </button>


          <button
            title="Close"
            onClick={onClose}
          >
            <X
              size={18}
            />
          </button>

        </div>

      </div>


      {/* LANGUAGE */}

      <div className="nova-language-tabs">

        {Object.entries(
          LANGUAGES
        ).map(
          ([key, item]) => (

            <button
              key={key}
              className={
                language === key
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLanguage(key)
              }
            >
              {item.label}
            </button>

          )
        )}

      </div>


      {/* AVATAR */}

      <div className="nova-avatar-section">

        <NovaAvatar
          speaking={
            isSpeaking
          }
          listening={
            isListening
          }
        />


        <div className="nova-avatar-info">

          <strong>
            Nova
          </strong>


          <span>

            {isListening

              ? currentLanguage.listening

              : isSpeaking

                ? currentLanguage.speaking

                : "Digital Assistant"}

          </span>

        </div>


        <button
          className={`avatar-voice-status ${
            voiceEnabled
              ? "active"
              : ""
          }`}
          onClick={() =>
            setVoiceEnabled(
              (previous) =>
                !previous
            )
          }
        >

          {voiceEnabled ? (

            <Volume2
              size={16}
            />

          ) : (

            <VolumeX
              size={16}
            />

          )}

        </button>

      </div>


      {/* MESSAGES */}

      <div className="nova-messages">

        {messages.map(
          (item) => (

            <div
              key={item.id}
              className={`nova-message ${
                item.sender
              }`}
            >

              {item.sender ===
                "assistant" && (

                <div className="nova-message-avatar">

                  <Sparkles
                    size={13}
                  />

                </div>

              )}


              <div className="nova-message-content">

                {renderMessageContent(
                  item
                )}


                {item.sender ===
                  "assistant" && (

                  <button
                    className="message-speaker"
                    onClick={() =>
                      speakText(
                        item.text
                      )
                    }
                    title="Listen"
                  >

                    <Volume2
                      size={12}
                    />

                  </button>

                )}

              </div>

            </div>

          )
        )}


        {/* TYPING */}

        {isTyping && (

          <div className="nova-message assistant">

            <div className="nova-message-avatar">

              <Sparkles
                size={13}
              />

            </div>


            <div className="nova-typing">

              <span />
              <span />
              <span />

            </div>

          </div>

        )}


        <div
          ref={messagesEndRef}
        />

      </div>


      {/* QUICK ACTIONS */}

      <div className="nova-quick-actions">

        <div className="quick-action-title">

          Quick actions

        </div>


        <div className="quick-action-list">

          {currentLanguage.quickActions.map(
            (action) => (

              <button
                key={action}
                onClick={() =>
                  handleQuickAction(
                    action
                  )
                }
              >
                {action}
              </button>

            )
          )}

        </div>

      </div>


      {/* SELECTED FILE */}

      {selectedFile && (

        <div className="nova-selected-file">

          <FileText
            size={14}
          />


          <span>
            {selectedFile.name}
          </span>


          <button
            onClick={() =>
              setSelectedFile(
                null
              )
            }
          >

            <X
              size={13}
            />

          </button>

        </div>

      )}

      {/* DOCUMENT SUGGESTIONS */}

{selectedFile &&
  documentSuggestions.length > 0 && (

    <div className="nova-document-suggestions">

      <div className="nova-document-suggestions-title">
        Ask Nova about this document
      </div>

      <div className="nova-document-suggestions-list">

        {documentSuggestions.map(
          (suggestion) => (

            <button
              key={suggestion}
              onClick={() =>
                sendMessage(suggestion)
              }
            >
              {suggestion}
            </button>

          )
        )}

      </div>

    </div>

)}


      {/* INPUT */}

      <div className="nova-input-area">

        <input
  ref={fileInputRef}
  type="file"
  hidden
  accept=".pdf,.docx,.xlsx,.xlsm,.pptx,.txt,.csv"
  onChange={handleFileChange}
/>


        <button
          className="nova-input-icon"
          title="Attach file"
          onClick={() =>
            fileInputRef.current?.click()
          }
        >

          <Paperclip
            size={18}
          />

        </button>


        <input
          className="nova-text-input"
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value
            )
          }
          onKeyDown={(event) => {

            if (
              event.key ===
              "Enter"
            ) {

              sendMessage();

            }

          }}
          placeholder={
            currentLanguage.placeholder
          }
        />


        {/* MICROPHONE */}

        <button
          className={`nova-input-icon voice ${
            isListening
              ? "listening"
              : ""
          }`}
          title="Voice input"
          onClick={
            startVoiceInput
          }
        >

          {isListening ? (

            <MicOff
              size={18}
            />

          ) : (

            <Mic
              size={18}
            />

          )}

        </button>


        {/* SEND */}

        <button
          className="nova-send-button"
          onClick={() =>
            sendMessage()
          }
          disabled={
            !message.trim()
          }
        >

          <Send
            size={17}
          />

        </button>

      </div>


      {/* FOOTER */}

      <div className="nova-footer-text">

        <span>
          ✦ Nova AI
        </span>

        <span>
          Information may require verification
        </span>

      </div>

    </div>

  );

}


export default ChatWidget;