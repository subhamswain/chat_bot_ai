from django.db import models


class Document(models.Model):
    file = models.FileField(upload_to="documents/")
    file_name = models.CharField(max_length=255)
    extracted_text = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name
    
class DocumentChunk(models.Model):
    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name="chunks"
    )
    chunk_index = models.IntegerField()
    content = models.TextField()

    def __str__(self):
        return f"{self.document.file_name} - Chunk {self.chunk_index}"