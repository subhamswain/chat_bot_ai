import os
import re
import requests

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Document
from .document_reader import read_document


# ============================================================
# DOCUMENT TEXT SEARCH
# ============================================================

def split_pages(document_text):
    """
    Split extracted PDF text into individual pages.

    Expected format from document_reader.py:

    --- Page 1 ---
    content...

    --- Page 2 ---
    content...
    """

    if not document_text:
        return []

    pages = re.split(
        r"(?=--- Page \d+ ---)",
        document_text
    )

    return [
        page.strip()
        for page in pages
        if page.strip()
    ]


def get_page_number(page_text):
    """
    Extract page number from:

    --- Page 2 ---
    """

    match = re.search(
        r"--- Page (\d+) ---",
        page_text
    )

    if match:
        return int(match.group(1))

    return None


def get_relevant_text(
    document_text,
    question,
    max_chars=12000
):
    """
    Intelligent document retrieval.

    Handles:

    1. Specific page questions
    2. Complete document questions
    3. API-specific questions
    4. Normal document questions
    """

    if not document_text:
        return ""

    question_lower = question.lower().strip()

    pages = split_pages(document_text)

    if not pages:
        return ""

    # ========================================================
    # 1. SPECIFIC PAGE REQUEST
    #
    # Example:
    # "What is on page 2?"
    # "Show page 4"
    # ========================================================

    page_match = re.search(
        r"\bpage\s*(\d+)\b",
        question_lower
    )

    if page_match:

        page_number = int(
            page_match.group(1)
        )

        for page in pages:

            current_page = get_page_number(page)

            if current_page == page_number:

                print(
                    f"PAGE REQUEST DETECTED: Page {page_number}"
                )

                return page

        return (
            f"Page {page_number} was not found "
            "in the uploaded document."
        )

    # ========================================================
    # 2. COMPLETE DOCUMENT REQUEST
    #
    # Example:
    # "Explain this document"
    # "What is in this PDF?"
    # "Give me complete information"
    # ========================================================

    full_document_keywords = [
        "complete document",
        "entire document",
        "whole document",
        "all information",
        "all details",
        "full details",
        "full information",
        "everything in the document",
        "everything in this pdf",
        "explain this document",
        "explain the document",
        "summarize this document",
        "summary of this document",
        "what is in this document",
        "what is in the document",
        "what is in this pdf",
        "tell me about this document",
        "tell me everything",
    ]

    if any(
        keyword in question_lower
        for keyword in full_document_keywords
    ):

        print(
            "FULL DOCUMENT REQUEST DETECTED"
        )

        return document_text

    # ========================================================
    # 3. API-SPECIFIC REQUEST
    #
    # Example:
    # "Explain API 1"
    # "Give me AITechSave details"
    # ========================================================

    api_keywords = [
        "maitriuserregistration",
        "aitechsave",
        "aitechsavedoc",
        "aitechsavpayment",
        "aitechsavpayment",
        "aitechsav",
        "api 1",
        "api 2",
        "api 3",
        "api 4",
    ]

    requested_api_keywords = [
        keyword
        for keyword in api_keywords
        if keyword in question_lower
    ]

    if requested_api_keywords:

        matched_pages = []

        for page in pages:

            page_lower = page.lower()

            if any(
                keyword in page_lower
                for keyword in requested_api_keywords
            ):
                matched_pages.append(page)

        if matched_pages:

            print(
                "API-SPECIFIC RETRIEVAL"
            )

            return "\n\n".join(
                matched_pages
            )

    # ========================================================
    # 4. NORMAL QUESTION
    #
    # Find pages containing the most relevant words.
    # ========================================================

    question_words = {
        word.lower()
        for word in re.findall(
            r"\b\w+\b",
            question_lower
        )
        if len(word) > 2
    }

    scored_pages = []

    for page in pages:

        page_lower = page.lower()

        score = 0

        for word in question_words:

            # Exact word occurrence
            occurrences = page_lower.count(word)

            score += occurrences

        scored_pages.append(
            (score, page)
        )

    scored_pages.sort(
        key=lambda x: x[0],
        reverse=True
    )

    selected_pages = []

    total_length = 0

    for score, page in scored_pages:

        if score <= 0:
            continue

        page_length = len(page)

        if (
            total_length + page_length
            > max_chars
        ):
            continue

        selected_pages.append(page)

        total_length += page_length

        # Enough context
        if len(selected_pages) >= 4:
            break

    if selected_pages:

        print(
            "RELEVANT PAGE RETRIEVAL:",
            len(selected_pages)
        )

        return "\n\n".join(
            selected_pages
        )

    # ========================================================
    # 5. FALLBACK
    # ========================================================

    return document_text[:max_chars]


# ============================================================
# CHAT API
# ============================================================

class ChatView(APIView):

    def post(self, request):

        message = request.data.get(
            "message",
            ""
        ).strip()

        document_id = request.data.get(
            "document_id"
        )

        # ----------------------------------------------------
        # Validate message
        # ----------------------------------------------------

        if not message:

            return Response(
                {
                    "error": "Message is required"
                },
                status=400
            )

        print("\n")
        print("======================================")
        print("NOVA CHAT REQUEST")
        print("======================================")

        print(
            "USER QUESTION:",
            message
        )

        print(
            "DOCUMENT ID:",
            document_id
        )

        document_text = ""

        # ====================================================
        # LOAD DOCUMENT
        # ====================================================

        if document_id:

            try:

                document = Document.objects.get(
                    id=document_id
                )

            except Document.DoesNotExist:

                return Response(
                    {
                        "error":
                            "Document not found"
                    },
                    status=404
                )

            document_text = (
                document.extracted_text or ""
            )

            print(
                "DOCUMENT NAME:",
                document.file_name
            )

            print(
                "TOTAL DOCUMENT CHARACTERS:",
                len(document_text)
            )

            # ------------------------------------------------
            # Check extraction
            # ------------------------------------------------

            if not document_text.strip():

                return Response(
                    {
                        "error":
                            "No readable text was extracted from this PDF."
                    },
                    status=422
                )

        # ====================================================
        # RETRIEVE DOCUMENT CONTENT
        # ====================================================

        relevant_text = get_relevant_text(
            document_text,
            message,
            max_chars=12000
        )

        print(
            "TEXT SENT TO OLLAMA:",
            len(relevant_text)
        )

        # ====================================================
        # DOCUMENT PROMPT
        # ====================================================

        if document_text:

            prompt = f"""
You are Nova, an intelligent AI document assistant.

Your job is to answer the user's question using
ONLY the uploaded document content.

==================================================
DOCUMENT CONTENT
==================================================

{relevant_text}

==================================================
USER QUESTION
==================================================

{message}

==================================================
RESPONSE INSTRUCTIONS
==================================================

1. Answer ONLY from the provided document.

2. Do NOT invent, assume, or add information
   that is not present in the document.

3. Give a detailed and useful answer when the
   document contains detailed information.

4. Use Markdown formatting.

5. Use headings when appropriate.

6. Use **bold text** for important terms.

7. Use bullet points for lists.

8. Use numbered lists when explaining steps
   or workflows.

9. Use Markdown tables when the document
   contains parameter/value information.

10. If the document contains JSON request or
    response examples, show them inside a
    code block.

11. Preserve API names, parameter names,
    field names and values exactly as they
    appear in the document.

12. If the user asks about a specific page,
    answer specifically from that page.

13. If the user asks about an API, explain
    the API using the information available
    in the document.

14. If the user asks about the complete
    document, organize the answer section
    by section instead of dumping raw text.

15. If tables are present in the document,
    convert them into readable Markdown tables.

16. If a value comes from another API,
    clearly explain where it comes from and
    where it is used.

17. Mention page numbers when they are
    available and useful.

18. If the requested information does not
    exist in the document, say:

    "I could not find this information in
    the uploaded document."

19. Do not say that you searched the internet.

20. Return ONLY the final answer in Markdown.

==================================================
FINAL ANSWER
==================================================
"""

        else:

            prompt = f"""
You are Nova, an AI digital assistant.

Answer the user's question clearly.

USER QUESTION:
{message}

Use Markdown formatting where useful.
"""

        # ====================================================
        # CALL OLLAMA
        # ====================================================

        try:

            print(
                "CALLING OLLAMA..."
            )

            ollama_response = requests.post(

                "http://127.0.0.1:11434/api/generate",

                json={

                    "model":
                        "llama3.2:3b",

                    "prompt":
                        prompt,

                    "stream":
                        False,

                    "options": {

                        # More detailed answer
                        "num_predict":
                            800,

                        # More deterministic
                        "temperature":
                            0.2,

                        # Context window
                        "num_ctx":
                            8192
                    }
                },

                timeout=180
            )

            print(
                "OLLAMA STATUS:",
                ollama_response.status_code
            )

            ollama_response.raise_for_status()

            result = (
                ollama_response.json()
            )

            answer = (
                result.get(
                    "response",
                    ""
                )
                .strip()
            )

            if not answer:

                answer = (
                    "I could not generate a response."
                )

            print(
                "OLLAMA ANSWER LENGTH:",
                len(answer)
            )

            print(
                "======================================"
            )

            print(
                "OLLAMA SUCCESS"
            )

            print(
                "======================================"
            )

            return Response(
                {

                    "message":
                        message,

                    "response":
                        answer,

                    "document_id":
                        document_id
                }
            )

        # ----------------------------------------------------
        # Timeout
        # ----------------------------------------------------

        except requests.exceptions.Timeout:

            print(
                "OLLAMA TIMEOUT"
            )

            return Response(
                {
                    "error":
                        "Ollama response timed out"
                },
                status=504
            )

        # ----------------------------------------------------
        # Connection error
        # ----------------------------------------------------

        except requests.exceptions.ConnectionError as error:

            print(
                "OLLAMA CONNECTION ERROR:",
                error
            )

            return Response(
                {
                    "error":
                        "Could not connect to Ollama",

                    "details":
                        str(error)
                },
                status=503
            )

        # ----------------------------------------------------
        # Request error
        # ----------------------------------------------------

        except requests.exceptions.RequestException as error:

            print(
                "OLLAMA REQUEST ERROR:",
                error
            )

            return Response(
                {
                    "error":
                        "Ollama request failed",

                    "details":
                        str(error)
                },
                status=503
            )

        # ----------------------------------------------------
        # Unexpected error
        # ----------------------------------------------------

        except Exception as error:

            print(
                "UNEXPECTED ERROR:",
                error
            )

            return Response(
                {
                    "error":
                        "Unexpected chatbot error",

                    "details":
                        str(error)
                },
                status=500
            )


# ============================================================
# DOCUMENT UPLOAD API
# ============================================================

class DocumentUploadView(APIView):

    def post(self, request):

        print("\n")
        print("======================================")
        print("DOCUMENT UPLOAD REQUEST")
        print("======================================")

        # ----------------------------------------------------
        # Get uploaded file
        # ----------------------------------------------------

        uploaded_file = request.FILES.get("file")

        if not uploaded_file:

            return Response(
                {
                    "error": "No file uploaded"
                },
                status=400
            )

        print("FILE NAME:", uploaded_file.name)
        print("FILE TYPE:", uploaded_file.content_type)
        print("FILE SIZE:", uploaded_file.size)

        # ----------------------------------------------------
        # Supported file types
        # ----------------------------------------------------

        SUPPORTED_EXTENSIONS = {
            ".pdf",
            ".docx",
            ".xlsx",
            ".xlsm",
            ".pptx",
            ".txt",
            ".csv",
        }

        file_extension = os.path.splitext(
            uploaded_file.name
        )[1].lower()

        print(
            "FILE EXTENSION:",
            file_extension
        )

        if file_extension not in SUPPORTED_EXTENSIONS:

            return Response(
                {
                    "error": "Unsupported file type.",
                    "supported_files": sorted(
                        SUPPORTED_EXTENSIONS
                    ),
                },
                status=400
            )

        document = None

        try:

            # ------------------------------------------------
            # Save document
            # ------------------------------------------------

            document = Document.objects.create(
                file=uploaded_file,
                file_name=uploaded_file.name
            )

            print(
                "DOCUMENT DATABASE ID:",
                document.id
            )

            print(
                "SAVED FILE:",
                document.file.path
            )

            # ------------------------------------------------
            # Extract document text
            # ------------------------------------------------

            extracted_text = read_document(
                document.file.path
            )

            print(
                "EXTRACTED TEXT LENGTH:",
                len(extracted_text)
            )

            # ------------------------------------------------
            # Check extraction
            # ------------------------------------------------

            if not extracted_text.strip():

                document.delete()

                return Response(
                    {
                        "error":
                            "The document was uploaded, but no readable text was found.",

                        "details":
                            "The file may contain scanned images and may require OCR."
                    },
                    status=422
                )

            # ------------------------------------------------
            # Save extracted text
            # ------------------------------------------------

            document.extracted_text = extracted_text
            document.save()

            print(
                "DOCUMENT TEXT SAVED SUCCESSFULLY"
            )

            print(
                "======================================"
            )

            return Response(
                {
                    "message":
                        "Document uploaded and read successfully",

                    "document_id":
                        document.id,

                    "file_name":
                        document.file_name,

                    "text_length":
                        len(extracted_text),

                    "preview":
                        extracted_text[:1000]
                },
                status=201
            )

        except Exception as error:

            print(
                "DOCUMENT PROCESSING ERROR:",
                error
            )

            # ------------------------------------------------
            # Cleanup database/file
            # ------------------------------------------------

            try:

                if document:
                    document.delete()

            except Exception:
                pass

            return Response(
                {
                    "error":
                        "Unable to process document",

                    "details":
                        str(error)
                },
                status=500
            )