"""
Chunk PDF manuals into 400-token chunks and save to Firestore
"""
import os
import asyncio
from firestore_client import FirestoreClient
import logging
import PyPDF2

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page_num, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                text += f"\n[Page {page_num + 1}]\n{page_text}"
            return text
    except Exception as e:
        logger.error(f"Error extracting text from {pdf_path}: {e}")
        return ""


def chunk_text(text, chunk_size=400):
    """Split text into chunks of approximately chunk_size words"""
    words = text.split()
    chunks = []
    current_chunk = []
    current_word_count = 0
    
    for word in words:
        current_chunk.append(word)
        current_word_count += 1
        
        if current_word_count >= chunk_size:
            chunks.append(' '.join(current_chunk))
            current_chunk = []
            current_word_count = 0
    
    # Add remaining words
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks


async def process_manuals():
    """Process all PDF manual files and save chunks to Firestore"""
    fs = FirestoreClient()
    
    if not fs.db:
        logger.error("❌ Firestore not initialized")
        return
    
    manuals_dir = "manuals"
    
    if not os.path.exists(manuals_dir):
        logger.error(f"❌ Directory {manuals_dir} not found")
        return
    
    chunk_id = 0
    total_chunks = 0
    
    for filename in os.listdir(manuals_dir):
        if not filename.endswith('.pdf'):
            continue
        
        filepath = os.path.join(manuals_dir, filename)
        logger.info(f"📄 Processing {filename}...")
        
        # Extract text from PDF
        content = extract_text_from_pdf(filepath)
        
        if not content:
            logger.warning(f"⚠️  No text extracted from {filename}")
            continue
        
        # Extract make from filename
        make = filename.split('_')[0].capitalize()
        
        # Chunk the content
        chunks = chunk_text(content, chunk_size=400)
        logger.info(f"   Created {len(chunks)} chunks from {filename}")
        
        for i, chunk in enumerate(chunks):
            # Skip very short chunks
            if len(chunk.split()) < 20:
                continue
            
            chunk_data = {
                'chunk_id': f"{make}_{chunk_id}",
                'make': make,
                'source': filename,
                'chunk_index': i,
                'text': chunk,
                'word_count': len(chunk.split())
            }
            
            # Save to Firestore
            try:
                fs.db.collection('manual_chunks').document(chunk_data['chunk_id']).set(chunk_data)
                logger.info(f"   ✅ Saved chunk {chunk_data['chunk_id']} ({chunk_data['word_count']} words)")
                chunk_id += 1
                total_chunks += 1
            except Exception as e:
                logger.error(f"   ❌ Error saving chunk: {e}")
    
    logger.info(f"\n✅ Processing complete!")
    logger.info(f"📊 Total chunks saved: {total_chunks}")


if __name__ == "__main__":
    asyncio.run(process_manuals())
