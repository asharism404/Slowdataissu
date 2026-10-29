/* Asharchives — shared subject list for Flashcards, Notes and Focus.
   Mirrors the topics in lecture.js. If you rename or add a lecture topic there, update it here too. */
window.ASH_SUBJECTS = [
  {"id":"anatomy","name":"Anatomy","year":1,"icon":"🦴","color":"blue","topics":[]},
  {"id":"physiology","name":"Physiology","year":1,"icon":"🫀","color":"pink","topics":[]},
  {"id":"biochemistry","name":"Biochemistry","year":1,"icon":"🧬","color":"purple","topics":[]},
  {"id":"pathology","name":"Pathology","year":2,"icon":"🔬","color":"yellow","topics":[]},
  {"id":"pharmacology","name":"Pharmacology","year":2,"icon":"💊","color":"green","topics":[]},
  {"id":"microbiology","name":"Microbiology","year":2,"icon":"🦠","color":"cyan","topics":[]},
  {"id":"forensic-medicine","name":"Forensic Medicine","year":2,"icon":"⚖️","color":"orange","topics":[]},
  {"id":"community-medicine","name":"Community Medicine","year":2,"icon":"🌍","color":"green","topics":[]},
  {"id":"ent","name":"ENT","year":3,"icon":"👂","color":"pink","topics":[]},
  {"id":"ophthalmology","name":"Ophthalmology","year":3,"icon":"👁️","color":"blue","topics":[]},
  {"id":"general-medicine","name":"General Medicine","year":3,"icon":"🩺","color":"cyan","topics":[]},
  {"id":"general-surgery","name":"General Surgery","year":3,"icon":"🩹","color":"yellow","topics":[]},
  {"id":"obgyn","name":"Obstetrics & Gynaecology","year":3,"icon":"🤰","color":"pink","topics":[]},
  {"id":"paediatrics","name":"Paediatrics","year":3,"icon":"🧸","color":"purple","topics":[]},
  {"id":"orthopaedics","name":"Orthopaedics","year":4,"icon":"🦴","color":"orange","topics":[]},
  {"id":"dermatology","name":"Dermatology","year":4,"icon":"🧴","color":"rose","topics":[]},
  {"id":"psychiatry","name":"Psychiatry","year":4,"icon":"🧠","color":"purple","topics":[]},
  {"id":"anaesthesia","name":"Anaesthesia","year":4,"icon":"💉","color":"blue","topics":[]},
  {"id":"radiology","name":"Radiology","year":4,"icon":"🩻","color":"cyan","topics":[]}
];
(window.ASH_SUBJECTS||[]).forEach(s=>{const k=Object.keys((window.ASHARCHIVES_VIDEOS||{})[s.id]||{});if(k.length)s.topics=k;});
