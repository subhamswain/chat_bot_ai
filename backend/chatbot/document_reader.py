import pymupdf


def read_pdf(file_path):

    pdf = pymupdf.open(file_path)

    text = ""

    for page in pdf:

        text += (
            f"\n--- Page {page.number + 1} ---\n"
        )

        text += page.get_text()

    pdf.close()

    return text