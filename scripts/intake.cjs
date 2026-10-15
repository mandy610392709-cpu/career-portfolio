const fs=require('fs'),path=require('path'),crypto=require('crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const normalize=s=>String(s).replace(/\s+/g,'');
function args(argv){const o={command:argv[0]};for(let i=1;i<argv.length;i+=2){if(!argv[i].startsWith('--')||argv[i+1]===undefined)throw Error('Expected --option value');o[argv[i].slice(2)]=argv[i+1]}return o}
function readState(workspace){const file=path.join(path.resolve(workspace),'.portfolio-workflow.json');if(!fs.existsSync(file))throw Error('No intake record; read the resume and initialize first.');const s=JSON.parse(fs.readFileSync(file,'utf8'));if(s.schema_version!==1)throw Error('Unsupported intake version');return {file,state:s}}
function ready(workspace){const {state:s}=readState(workspace);if(!['materials_received','no_more_materials'].includes(s.status)||!s.questions?.some(q=>q.type==='materials')||!s.response?.text?.trim())throw Error('MATERIALS_REPLY_REQUIRED: ask resume-specific material questions and wait for the user response before generating.');if(!fs.existsSync(s.resume.path)||hash(fs.readFileSync(s.resume.path))!==s.resume.sha256)throw Error('Resume changed or missing; start a new intake.');return s}
function main(){const a=args(process.argv.slice(2));if(!a.workspace)throw Error('--workspace is required');const dir=path.resolve(a.workspace),file=path.join(dir,'.portfolio-workflow.json');fs.mkdirSync(dir,{recursive:true});let s;
 if(a.command==='init'){
  if(fs.existsSync(file))throw Error('This workspace already has an intake. Use a new workspace for a new resume.');
  const resume=path.resolve(a.resume||'');if(!a.resume||!fs.statSync(resume).isFile())throw Error('A readable resume file is required');
  const textFile=a.text?path.resolve(a.text):resume;if(!a.text&&!/\.(txt|md)$/i.test(resume))throw Error('Extract the resume first and provide --text');
  const text=fs.readFileSync(textFile,'utf8').trim();if(text.length<30)throw Error('Resume text is too short or empty; use vision/OCR for scans');
  s={schema_version:1,status:'resume_received',created_at:new Date().toISOString(),resume:{path:resume,sha256:hash(fs.readFileSync(resume)),text},questions:[]};
 }else{
  s=readState(dir).state;
  if(a.command==='ask'){
   if(!['resume_received','awaiting_materials'].includes(s.status))throw Error('Material response already recorded. Do not overwrite the original interaction.');
   const qs=JSON.parse(fs.readFileSync(path.resolve(a.questions||''),'utf8'));
   if(!Array.isArray(qs)||qs.length<2||qs.length>5||!qs.some(q=>q.type==='materials'))throw Error('Ask 2-5 questions, including at least one materials question');
   for(const q of qs){if(typeof q.question!=='string'||q.question.trim().length<8||typeof q.resume_excerpt!=='string'||normalize(q.resume_excerpt).length<4||!normalize(s.resume.text).includes(normalize(q.resume_excerpt)))throw Error('Each question must quote a real resume excerpt');}
   s.questions=qs;s.status='awaiting_materials';s.asked_at=new Date().toISOString();
  }else if(a.command==='respond'){
   if(s.status!=='awaiting_materials')throw Error('Record and actually ask material questions before recording a response');
   if(!['supplied','none'].includes(a.decision))throw Error('--decision must be supplied or none');
   const text=fs.readFileSync(path.resolve(a.reply||''),'utf8').trim();if(!text)throw Error('A real, non-empty user response is required');
   s.response={text,decision:a.decision,received_at:new Date().toISOString()};s.status=a.decision==='none'?'no_more_materials':'materials_received';
  }else if(a.command==='status'){console.log(JSON.stringify({status:s.status,questions:s.questions},null,2));return}
  else throw Error('Use init, ask, respond or status');
 }
 fs.writeFileSync(file,JSON.stringify(s,null,2)+'\n');console.log(JSON.stringify({status:s.status,workspace:dir,questions:a.command==='ask'?s.questions:undefined},null,2));
}
module.exports={ready,readState,hash};if(require.main===module){try{main()}catch(e){console.error(e.message);process.exit(1)}}
