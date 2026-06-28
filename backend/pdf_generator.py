from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import re

def generate_pdf_from_html(html_content: str) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    Story = []
    
    # Pre-process HTML to ensure block elements are on new lines
    text = html_content
    text = text.replace('</h1>', '\n</h1>\n')
    text = text.replace('</h2>', '\n</h2>\n')
    text = text.replace('</p>', '\n</p>\n')
    text = text.replace('</li>', '\n</li>\n')
    text = text.replace('<br>', '\n')
    text = text.replace('<br/>', '\n')
    
    lines = text.split('\n')
    for line in lines:
        clean = re.sub(r'<[^>]+>', '', line).strip()
        if not clean:
            continue
            
        if '<h1>' in line:
            Story.append(Paragraph(clean, styles['Heading1']))
        elif '<h2>' in line:
            Story.append(Paragraph(clean, styles['Heading2']))
        elif '<li>' in line:
            Story.append(Paragraph("• " + clean, styles['BodyText']))
        else:
            Story.append(Paragraph(clean, styles['BodyText']))
            
        Story.append(Spacer(1, 0.1 * 72))
        
    doc.build(Story)
    buffer.seek(0)
    return buffer
