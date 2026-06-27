from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import re

def generate_pdf_from_html(html_content: str) -> BytesIO:
    # A very basic HTML to PDF converter using ReportLab
    # Since we can't easily parse complex HTML into ReportLab primitives without a library like xhtml2pdf,
    # we will strip simple tags and map them to Paragraphs.
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    Story = []
    
    # Split by common block tags
    blocks = re.split(r'<(h1|h2|p|li)[^>]*>', html_content)
    
    for i in range(1, len(blocks), 2):
        tag = blocks[i]
        content = blocks[i+1].split(f'</{tag}>')[0]
        # Clean inner html tags
        clean_text = re.sub(r'<[^>]+>', '', content).strip()
        
        if not clean_text:
            continue
            
        if tag == 'h1':
            Story.append(Paragraph(clean_text, styles['Heading1']))
        elif tag == 'h2':
            Story.append(Paragraph(clean_text, styles['Heading2']))
        else:
            Story.append(Paragraph(clean_text, styles['BodyText']))
            
        Story.append(Spacer(1, 0.2 * 72))
        
    doc.build(Story)
    buffer.seek(0)
    return buffer
