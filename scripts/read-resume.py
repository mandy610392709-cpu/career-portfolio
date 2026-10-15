"""Read local text/DOCX/PDF without uploading. Scans need the Agent's vision capability."""
from pathlib import Path
import argparse,zipfile,xml.etree.ElementTree as ET
p=argparse.ArgumentParser();p.add_argument('source');p.add_argument('--out',required=True);a=p.parse_args()
source=Path(a.source);suffix=source.suffix.lower()
if suffix in ('.txt','.md'):
    text=source.read_text(encoding='utf-8')
elif suffix=='.docx':
    with zipfile.ZipFile(source) as z:
        info=z.getinfo('word/document.xml')
        if info.file_size>20_000_000:raise SystemExit('DOCX XML exceeds safe read limit')
        root=ET.fromstring(z.read(info))
    ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    text='\n'.join(''.join(t.text or '' for t in para.findall('.//w:t',ns)) for para in root.findall('.//w:p',ns))
elif suffix=='.pdf':
    try:from pypdf import PdfReader
    except ImportError:raise SystemExit('PDF reading needs existing pypdf or the Agent PDF reader; no package was installed.')
    text='\n\n'.join(page.extract_text() or '' for page in PdfReader(source).pages)
else:raise SystemExit('Use the Agent vision/file reader for this format. Supported here: TXT, MD, DOCX, PDF.')
if len(text.strip())<30:raise SystemExit('No reliable resume text extracted. Use vision/OCR for scans; do not infer missing experience.')
out=Path(a.out);out.parent.mkdir(parents=True,exist_ok=True);out.write_text(text,encoding='utf-8');print(f'Saved {len(text)} characters to {out}')
