// Google Apps Script backend: server-side validation, one master row per submission, de-duplication by ID.
const HEAD=['Submission ID','Timestamp','Full name','Email','Phone','Organisation','City','Country','Categories','Responses (JSON)','Consent','Status','Follow-up notes'];
const TABS={'Student Delegate':'Delegates','Hackathon Participant':'Hackathon Participants','Parallel Competition Participant':'Competition Participants','Speaker / Researcher':'Speakers','Technology Partner':'Technology Partners','Sponsor':'Sponsors','Mentor / Judge':'Mentors and Judges','Small Business Owner':'Small Businesses','University / Academic Institution':'Academic Institutions','General Enquiry':'General Enquiries'};
function setup(){const ss=SpreadsheetApp.getActive(),s=ss.getSheetByName('Submissions')||ss.insertSheet('Submissions');
  s.getRange(1,1,1,HEAD.length).setValues([HEAD]).setFontWeight('bold');s.setFrozenRows(1);
  for(const c in TABS){const t=ss.getSheetByName(TABS[c])||ss.insertSheet(TABS[c]);t.clear();
    t.getRange('A1').setFormula(`=QUERY(Submissions!A:M,"select * where I contains '${c}'",1)`)}} // read-only filtered views; edit notes in Submissions
function out(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
function doPost(e){const lock=LockService.getScriptLock();lock.waitLock(20000);
  try{const d=JSON.parse(e.postData.contents),p=d.person||{};
    if(!d.id||!/^AFG-[A-Z0-9-]+$/.test(d.id)||!p['Full name']||!/^\S+@\S+\.\S+$/.test(p['Email address']||'')||d.consent!==true||!d.categories||!d.categories.length)return out({ok:false,error:'invalid'});
    if(d.categories.some(c=>!(c in TABS)))return out({ok:false,error:'invalid category'});
    const s=SpreadsheetApp.getActive().getSheetByName('Submissions'),ids=s.getRange(2,1,Math.max(1,s.getLastRow()-1),1).getValues().flat();
    if(ids.includes(d.id))return out({ok:true,duplicate:true});
    const cl=v=>String(v||'').slice(0,2000).replace(/^[=+\-@]/,"'$&"); // block formula injection
    s.appendRow([d.id,new Date(),cl(p['Full name']),cl(p['Email address']),cl(p['Phone number (optional)']),cl(p['College / Organisation']),cl(p['City']),cl(p['Country']),d.categories.join(', '),cl(JSON.stringify(d.responses)),'Yes','New','']);
    return out({ok:true})}catch(err){return out({ok:false,error:'server'})}finally{lock.release()}}
