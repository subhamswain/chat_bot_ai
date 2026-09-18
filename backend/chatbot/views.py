import requests

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Document
from .document_reader import read_pdf


# ============================================================
# DOCUMENT TEXT SEARCH
# ============================================================

def get_relevant_text(document_text, question, max_chars=3000):
    """
    Find the most relevant parts of the uploaded document
    based on words from the user's question.
    """

    if not document_text:
        return ""

    # Split document into small chunks
    chunk_size = 1000

    chunks = [
        document_text[i:i + chunk_size]
        for i in range(
            0,
            len(document_text),
            chunk_size
        )
    ]

    # Clean question words
    question_words = {
        word.lower().strip(
            ".,?!:;()[]{}\"'"
        )
        for word in question.split()
        if len(word) > 2
    }

    scored_chunks = []

    # Score each document chunk
    for chunk in chunks:

        chunk_lower = chunk.lower()

        score = 0

        for word in question_words:

            if word in chunk_lower:
                score += 1

        scored_chunks.append(
            (score, chunk)
        )

    # Highest score first
    scored_chunks.sort(
        key=lambda item: item[0],
        reverse=True
    )

    selected = []

    total_length = 0

    for score, chunk in scored_chunks:

        if total_length + len(chunk) > max_chars:
            break

        selected.append(chunk)

        total_length += len(chunk)

    # If no keyword matched,
    # use beginning of document
    if not selected:

        return document_text[:max_chars]

    return "\n\n".join(selected)


# ============================================================
# CHAT API
# ============================================================

class ChatView(APIView):

    def post(self, request):

        message = request.data.get("message")
        document_id = request.data.get("document_id")

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
        print("USER QUESTION:", message)
        print("DOCUMENT ID:", document_id)

        # ----------------------------------------------------
        # Default prompt
        # ----------------------------------------------------

        prompt = message

        relevant_text = ""

        # ----------------------------------------------------
        # DOCUMENT CONTEXT
        # ----------------------------------------------------

        if document_id:

            try:

                document = Document.objects.get(
                    id=document_id
                )

            except Document.DoesNotExist:

                print(
                    "DOCUMENT NOT FOUND:",
                    document_id
                )

                return Response(
                    {
                        "error": "Document not found"
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

            # Check whether text was actually extracted
            if not document_text.strip():

                print(
                    "DOCUMENT HAS NO EXTRACTED TEXT"
                )

                return Response(
                    {
                        "error":
                            "No readable text was extracted from this PDF.",

                        "details":
                            "The PDF may contain scanned images instead of selectable text."
                    },
                    status=422
                )

            # ------------------------------------------------
            # Find relevant document content
            # ------------------------------------------------

            relevant_text = get_relevant_text(
                document_text,
                message,
                max_chars=3000
            )

            print(
                "TEXT SENT TO OLLAMA:",
                len(relevant_text)
            )

            # ------------------------------------------------
            # Create document-aware prompt
            # ------------------------------------------------

            prompt = f"""
You are Nova, an AI digital assistant.

The user has uploaded a document.

Your job is to answer the user's question using
ONLY the document context provided below.

DOCUMENT CONTEXT
================
{relevant_text}
================

USER QUESTION
=============
{message}

IMPORTANT RULES:

1. Use the document context to answer the question.

2. Do NOT guess information.

3. Do NOT use the filename to determine the answer.

4. Do NOT invent APIs, endpoints, parameters,
   names, dates, or other information.

5. If the requested information is not available
   in the supplied document context, respond:

"I could not find this information in the uploaded document."

6. If the user asks about an API endpoint, provide
   the endpoint only if it appears in the document.

7. Keep the response clear and structured.

8. If possible, mention the relevant page number
   when the document context contains page information.
"""

        else:

            print(
                "NO DOCUMENT ATTACHED"
            )

        # ====================================================
        # OLLAMA
        # ====================================================

        try:

            print(
                "CALLING OLLAMA..."
            )

            ollama_url = (
                "http://127.0.0.1:11434/api/generate"
            )

            ollama_response = requests.post(

                ollama_url,

                json={
                    "model": "llama3:latest",

                    "prompt": prompt,

                    "stream": False,

                    "options": {
                        "num_predict": 300,
                        "temperature": 0.2
                    }
                },

                timeout=300
            )

            print(
                "OLLAMA STATUS:",
                ollama_response.status_code
            )

            ollama_response.raise_for_status()

            data = ollama_response.json()

            answer = data.get(
                "response",
                ""
            ).strip()

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
                    "message": message,

                    "response": answer,

                    "document_id": document_id
                }
            )

        # ----------------------------------------------------
        # Ollama timeout
        # ----------------------------------------------------

        except requests.exceptions.Timeout:

            print(
                "OLLAMA TIMEOUT"
            )

            return Response(
                {
                    "error":
                        "Ollama took too long to respond.",

                    "details":
                        "The local Llama 3 model did not respond within 300 seconds."
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
                        "Unable to connect to Ollama.",

                    "details":
                        "Make sure Ollama is running on port 11434."
                },
                status=503
            )

        # ----------------------------------------------------
        # Other request error
        # ----------------------------------------------------

        except requests.exceptions.RequestException as error:

            print(
                "OLLAMA REQUEST ERROR:",
                error
            )

            return Response(
                {
                    "error":
                        "Ollama request failed.",

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
                "UNEXPECTED CHAT ERROR:",
                error
            )

            return Response(
                {
                    "error":
                        "Unexpected chatbot error.",

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

            print(
                "NO FILE RECEIVED"
            )

            return Response(
                {
                    "error": "No file uploaded"
                },
                status=400
            )

        print(
            "FILE NAME:",
            uploaded_file.name
        )

        print(
            "FILE TYPE:",
            uploaded_file.content_type
        )

        print(
            "FILE SIZE:",
            uploaded_file.size
        )

        # ----------------------------------------------------
        # Currently PDF only
        # ----------------------------------------------------

        if not uploaded_file.name.lower().endswith(
            ".pdf"
        ):

            return Response(
                {
                    "error":
                        "Only PDF files are supported currently."
                },
                status=400
            )

        # ----------------------------------------------------
        # Save and extract text
        # ----------------------------------------------------

        try:

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
            # Read PDF
            # ------------------------------------------------

            extracted_text = read_pdf(
                document.file.path
            )

            print(
                "EXTRACTED TEXT LENGTH:",
                len(extracted_text)
            )

            # ------------------------------------------------
            # Check extracted text
            # ------------------------------------------------

            if not extracted_text.strip():

                document.delete()

                return Response(
                    {
                        "error":
                            "The PDF was uploaded, but no readable text was found.",

                        "details":
                            "If this is a scanned/image-only PDF, OCR will be required."
                    },
                    status=422
                )

            # ------------------------------------------------
            # Save extracted text
            # ------------------------------------------------

            document.extracted_text = (
                extracted_text
            )

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
                        "PDF uploaded and read successfully",

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

        # ----------------------------------------------------
        # PDF reading error
        # ----------------------------------------------------

        except Exception as error:

            print(
                "DOCUMENT PROCESSING ERROR:",
                error
            )

            # Delete database record if created
            try:

                if document:
                    document.delete()

            except Exception:
                pass

            return Response(
                {
                    "error":
                        "Unable to read PDF",

                    "details":
                        str(error)
                },
                status=500
            )