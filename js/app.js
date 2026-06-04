let teamAPlayers = [];
let teamBPlayers = [];
let currentMatchData = null;


window.onload = () => {
      loadPage('home');

};

/** toggle Menu */
// function toggleMenu() {
//   const sidebar = document.getElementById('sidebar');
//   const overlay = document.getElementById('overlay');

//   sidebar.classList.toggle('-translate-x-full');
//   overlay.classList.toggle('hidden');
// }

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    // तुझ्या HTML मध्ये आयडी 'overlay' असेल तर तोच ठेव, मी इथे 'overlay' वापरला आहे
    const overlay = document.getElementById('overlay'); 

    sidebar.classList.toggle('-translate-x-full');
    
    if (overlay) {
        overlay.classList.toggle('hidden');
        // जर तुला ब्लर नको असेल, तर तुझ्या HTML मधून 'backdrop-blur-sm' काढून टाक
    }
}


function setActiveNav(pageId) {
    // १. बॉटम नेव्हिगेशनची सर्व बटणे पकडा
    const navButtons = document.querySelectorAll('.fixed.bottom-0 button');
    
    navButtons.forEach(btn => {
        // २. सर्वांचा ऑरेंज कलर काढा आणि ग्रे (Gray) करा
        btn.classList.remove('text-orange-500');
        btn.classList.add('text-gray-500');
    });

    // ३. फक्त ज्या पेजवर आपण आहोत, त्याला ऑरेंज करा
    const activeBtn = document.getElementById(`nav-${pageId}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-gray-500');
        activeBtn.classList.add('text-orange-500');
    }
}


/** 
function loadPage(page) {
  const app = document.getElementById('app');

  if (page === 'home') {
    app.innerHTML = "<h2 class='text-xl'>🏠 Home</h2>";
  }

  if (page === 'matches') {
    app.innerHTML = "<h2 class='text-xl'>🎯 Matches</h2>";
  }

  if (page === 'teams') {
    app.innerHTML = "<h2 class='text-xl'>👥 Teams</h2>";
  }

  if (page === 'tournaments') {
    app.innerHTML = "<h2 class='text-xl'>🏆 Tournaments</h2>";
  }

  if (page === 'profile') {
    app.innerHTML = "<h2 class='text-xl'>👤 Profile</h2>";
  }
    // 🔥 NEW: auto close menu
  closeMenu();
}
*/
/** loadPage async */

// async function loadPage(page) {
//   // 🚨 [YOUR SMART TRACKER]: जर युझर स्कोअरिंगवर आहे आणि दुसऱ्या पेजवर क्लिक करतोय
//   if (typeof matchSetupData !== 'undefined' && matchSetupData && matchSetupData.mId && page !== 'scoring') {
      
//       console.log(`%c🛑 [Navigation Block]: युझर स्कोअरिंग सोडून "${page}" वर जाण्याचा प्रयत्न करत आहे. वॉर्निंग दाखवत आहे...`, "color: #ef4444; font-weight: bold;");

//       const result = await Swal.fire({
//           title: 'स्कोअरिंग सोडून बाहेर जायचे का?',
//           text: "चालू मॅचचा टायमर पॉज केला जाईल आणि संपूर्ण रेड इतिहास सुरक्षित सेव्ह केला जाईल.",
//           icon: 'warning',
//           showCancelButton: true,
//           confirmButtonText: 'हो, बाहेर पडा',
//           cancelButtonText: 'नाही, इथेच राहा',
//           background: '#111',
//           color: '#fff',
//           confirmButtonColor: '#ef4444',
//           cancelButtonColor: '#4b5563'
//       });

//       // ❌ जर युझरने 'नाही' (Cancel) क्लिक केले, तर पेज बदलू नका, इथल्या इथेच फ्लो थांबवा!
//       if (!result.isConfirmed) {
//           console.log("😇 [Navigation Cancelled]: युझर स्कोअरिंग स्क्रीनवरच थांबला.");
//           return; 
//       }

//       // ✅ जर युझरने 'हो' (Confirm) केले, तर डेटा सुरक्षित क्लाउडवर पाठवा!
//       console.log("☁️ [Exit Sync]: शिल्लक वेळ आणि रेड इतिहास क्लाउडवर सेव्ह करत आहे...");
      
//       if (window.matchInterval) clearInterval(window.matchInterval);
//       window.isMatchPaused = true;

//       // 🔒 लोकल मेमरी किंवा लोकल स्टोरेजमधून ताजी रेड समरी गोळा करा
//       let finalRaidsArray = window.activeRaidsList || [];
//       if (finalRaidsArray.length === 0) {
//           const storedData = localStorage.getItem(`raids_secure_log_${matchSetupData.mId}`);
//           if (storedData) {
//               try {
//                   finalRaidsArray = JSON.parse(decodeURIComponent(escape(atob(storedData))));
//               } catch (e) { console.error("Error decoding storage on exit:", e); }
//           }
//       }

//       try {
//           // ☁️ [ONE-TIME SYNC CALL]: सर्व डेटा एकाच वेळी 'raidsHistory' मध्ये जतन!
//           await db.collection("tournaments").doc(matchSetupData.tId)
//             .collection("matches").doc(matchSetupData.mId).update({
//                 savedMatchTime: matchTotalSeconds, // अचूक शिल्लक सेकंद
//                 isMatchPaused: true,
//                 raidsHistory: finalRaidsArray,    // 🎯 तुझा संपूर्ण रेड इतिहास एकाच फील्डमध्ये साठवला!
//                 lastUpdated: new Date().getTime()
//             });
//           console.log(`✅ [Exit Sync Success]: शिल्लक वेळ आणि एकूण ${finalRaidsArray.length} रेड्स क्लाउडवर जतन केल्या!`);
          
//           // 🧹 बाहेर पडताना चालू मेमरी साफ करा
//           matchSetupData = null; 
//           currentMatchData = null;
//           window.activeRaidsList = [];
          
//       } catch (err) {
//           console.error("🚨 [Exit Sync Error]: डेटाबेस अपडेट फेल झाले!", err);
//           Swal.fire("त्रुटी", "डेटा सेव्ह करताना अडचण आली, तरीही पेज बदलत आहे.", "error");
//       }
//   }

//   // -------------------------------------------------------------
//   // 🔥 इथून पुढे तुझा मूळ नेहमीचा पान लोड करण्याचा क्लीन कोड सुरू होतो
//   // -------------------------------------------------------------
//   const app = document.getElementById('app');
//   setActiveNav(page);   

//   const res = await fetch(`pages/${page}.html`);
//   const html = await res.text();

//   app.innerHTML = html;
//   initPage(page);
//   closeMenu();
// }


// async function loadPage(page) {
//   // 🚨 [YOUR SMART TRACKER]: जर युझर स्कोअरिंगवर आहे आणि दुसऱ्या पेजवर क्लिक करतोय
//   if (typeof matchSetupData !== 'undefined' && matchSetupData && matchSetupData.mId && page !== 'scoring') {
      
//       console.log(`%c🛑 [Navigation Block]: युझर स्कोअरिंग सोडून "${page}" वर जाण्याचा प्रयत्न करत आहे. वॉर्निंग दाखवत आहे...`, "color: #ef4444; font-weight: bold;");

//       const result = await Swal.fire({
//           title: 'स्कोअरिंग सोडून बाहेर जायचे का?',
//           text: "चालू मॅचचा टायमर पॉज केला जाईल आणि संपूर्ण रेड इतिहास सुरक्षित सेव्ह केला जाईल.",
//           icon: 'warning',
//           showCancelButton: true,
//           confirmButtonText: 'हो, बाहेर पडा',
//           cancelButtonText: 'नाही, इथेच राहा',
//           background: '#111',
//           color: '#fff',
//           confirmButtonColor: '#ef4444',
//           cancelButtonColor: '#4b5563'
//       });

//       // ❌ जर युझरने 'नाही' (Cancel) क्लिक केले, तर पेज बदलू नका, इथल्या इथेच फ्लो थांबवा!
//       if (!result.isConfirmed) {
//           console.log("😇 [Navigation Cancelled]: युझर स्कोअरिंग स्क्रीनवरच थांबला.");
//           return; 
//       }

//       // ✅ जर युझरने 'हो' (Confirm) केले, तर डेटा सुरक्षित क्लाउडवर पाठवा!
//       console.log("☁️ [Exit Sync]: शिल्लक वेळ, चालू स्कोअर आणि रेड इतिहास क्लाउडवर सेव्ह करत आहे...");
      
//       if (window.matchInterval) clearInterval(window.matchInterval);
//       window.isMatchPaused = true;

//       // 🔒 लोकल मेमरी किंवा लोकल स्टोरेजमधून ताजी रेड समरी गोळा करा
//       let finalRaidsArray = window.activeRaidsList || [];
//       if (finalRaidsArray.length === 0) {
//           const storedData = localStorage.getItem(`raids_secure_log_${matchSetupData.mId}`);
//           if (storedData) {
//               try {
//                   finalRaidsArray = JSON.parse(decodeURIComponent(escape(atob(storedData))));
//               } catch (e) { console.error("Error decoding storage on exit:", e); }
//           }
//       }

//       // 🎯 [LIVE SCORE CAPTURE]: स्क्रीनवरून आत्ताचा ताजा स्कोअर ओढून घेणे
//       const currentScoreA = parseInt(document.getElementById('scoreA')?.innerText) || 0;
//       const currentScoreB = parseInt(document.getElementById('scoreB')?.innerText) || 0;

//       try {
//           // ☁️ [ONE-TIME SYNC CALL]: स्कोअरसह सर्व डेटा एकाच वेळी जतन!
//           await db.collection("tournaments").doc(matchSetupData.tId)
//             .collection("matches").doc(matchSetupData.mId).update({
//                 savedMatchTime: matchTotalSeconds, // अचूक शिल्लक सेकंद
//                 isMatchPaused: true,
//                 scoreA: currentScoreA,             // 🟢 फिक्स: टीम A चा ताजा स्कोअर सेव्ह केला!
//                 scoreB: currentScoreB,             // 🟢 फिक्स: टीम B चा ताजा स्कोअर सेव्ह केला!
//                 raidsHistory: finalRaidsArray,     // संपूर्ण रेड इतिहास
//                 lastUpdated: new Date().getTime()
//             });
          
//           console.log(`✅ [Exit Sync Success]: स्कोअर (A:${currentScoreA} vs B:${currentScoreB}) आणि एकूण ${finalRaidsArray.length} रेड्स क्लाउडवर जतन केल्या!`);
          
//           // 🧹 बाहेर पडताना चालू मेमरी साफ करा
//           matchSetupData = null; 
//           currentMatchData = null;
//           window.activeRaidsList = [];
          
//       } catch (err) {
//           console.error("🚨 [Exit Sync Error]: डेटाबेस अपडेट फेल झाले!", err);
//           Swal.fire("त्रुटी", "डेटा सेव्ह करताना अडचण आली, तरीही पेज बदलत आहे.", "error");
//       }
//   }

//   // -------------------------------------------------------------
//   // 🔥 इथून पुढे तुझा मूळ नेहमीचा पान लोड करण्याचा क्लीन कोड सुरू होतो
//   // -------------------------------------------------------------
//   const app = document.getElementById('app');
//   setActiveNav(page);   

//   const res = await fetch(`pages/${page}.html`);
//   const html = await res.text();

//   app.innerHTML = html;
//   initPage(page);
//   closeMenu();
// }

/**
 * सुधारित loadPage फंक्शन (नव्या मास्टर ऑब्जेक्टसह)
आपण ठरवल्याप्रमाणे तुझा मूळचा स्वीटअलर्ट (Swal), बेस६४ डिकोडिंग लॉजिक, पेज फेचिंग (fetch) आणि 
मेमरी क्लीनअपचा कडक फ्लो जसाच्या तसा सुरक्षित ठेवला आहे. 
फक्त स्कोअर गोळा करताना आणि फायरबेस अपडेट करताना आपण आपला मास्टर scoreCard ऑब्जेक्ट तिथे बसवला आहे.
 */

async function loadPage(page) {
  // 🚨 [YOUR SMART TRACKER]: जर युझर स्कोअरिंगवर आहे आणि दुसऱ्या पेजवर क्लिक करतोय
  if (typeof matchSetupData !== 'undefined' && matchSetupData && matchSetupData.mId && page !== 'scoring') {
      
      console.log(`%c🛑 [Navigation Block]: युझर स्कोअरिंग सोडून "${page}" वर जाण्याचा प्रयत्न करत आहे. वॉर्निंग दाखवत आहे...`, "color: #ef4444; font-weight: bold;");

      const result = await Swal.fire({
          title: 'स्कोअरिंग सोडून बाहेर जायचे का?',
          text: "चालू मॅचचा टायमर पॉज केला जाईल आणि संपूर्ण रेड इतिहास सुरक्षित सेव्ह केला जाईल.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'हो, बाहेर पडा',
          cancelButtonText: 'नाही, इथेच राहा',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#4b5563'
      });

      // ❌ जर युझरने 'नाही' (Cancel) क्लिक केले, तर पेज बदलू नका, इथल्या इथेच फ्लो थांबवा!
      if (!result.isConfirmed) {
          console.log("😇 [Navigation Cancelled]: युझर स्कोअरिंग स्क्रीनवरच थांबला.");
          return; 
      }

      // ✅ जर युझरने 'हो' (Confirm) केले, तर डेटा सुरक्षित क्लाउडवर पाठवा!
      console.log("☁️ [Exit Sync]: शिल्लक वेळ, चालू स्कोअर आणि रेड इतिहास क्लाउडवर सेव्ह करत आहे...");
      
      if (window.matchInterval) clearInterval(window.matchInterval);
      window.isMatchPaused = true;

      // 🔒 लोकल मेमरी किंवा लोकल स्टोरेजमधून ताजी रेड समरी गोळा करा
      let finalRaidsArray = window.activeRaidsList || [];
      if (finalRaidsArray.length === 0) {
          const storedData = localStorage.getItem(`raids_secure_log_${matchSetupData.mId}`);
          if (storedData) {
              try {
                  finalRaidsArray = JSON.parse(decodeURIComponent(escape(atob(storedData))));
              } catch (e) { console.error("Error decoding storage on exit:", e); }
          }
      }

      // 🎯 [💥 MASTER SCORECARD EXIT CAPTURE]
      // बाहेर पडताना लोकल स्टोरेजमधून ताजी आणि अधिकृत स्कोअरकार्डची प्रत ओढणे
      let localCard = localStorage.getItem('global_score_card');
      let currentScoreCard = localCard ? JSON.parse(localCard) : {
          mainMatch:  { teamA: 0, teamB: 0 },
          fiveRaid:   { teamA: 0, teamB: 0 },
          goldenRaid: { teamA: 0, teamB: 0 }
      };

      try {
          // ☁️ [ONE-TIME SYNC CALL]: जुन्या फील्ड्स काढून थेट मास्टर scoreCard एकाच वेळी जतन!
          await db.collection("tournaments").doc(matchSetupData.tId)
            .collection("matches").doc(matchSetupData.mId).update({
                savedMatchTime: matchTotalSeconds, // अचूक शिल्लक सेकंद
                isMatchPaused: true,
                raidsHistory: finalRaidsArray,     // संपूर्ण रेड इतिहास
                lastUpdated: new Date().getTime(),
                
                // 🎯 [SINGLE SOURCE OF TRUTH]: डेटाबेसमध्ये मास्टर ऑब्जेक्ट ढकलला!
                scoreCard: currentScoreCard
            });
          
          console.log(`✅ [Exit Sync Success]: मास्टर scoreCard आणि एकूण ${finalRaidsArray.length} रेड्स क्लाउडवर यशस्वीरित्या जतन केल्या!`);
          console.dir(currentScoreCard);
          
          // 🧹 बाहेर पडताना चालू मेमरी साफ करा
          matchSetupData = null; 
          currentMatchData = null;
          window.activeRaidsList = [];
          
      } catch (err) {
          console.error("🚨 [Exit Sync Error]: डेटाबेस अपडेट फेल झाले!", err);
          Swal.fire("त्रुटी", "डेटा सेव्ह करताना अडचण आली, तरीही पेज बदलत आहे.", "error");
      }
  }

  // -------------------------------------------------------------
  // 🔥 इथून पुढे तुझा मूळ नेहमीचा पान लोड करण्याचा क्लीन कोड सुरू होतो
  // -------------------------------------------------------------
  const app = document.getElementById('app');
  if (typeof setActiveNav === "function") setActiveNav(page);   

  const res = await fetch(`pages/${page}.html`);
  const html = await res.text();

  app.innerHTML = html;
  if (typeof initPage === "function") initPage(page);
  if (typeof closeMenu === "function") closeMenu();
}

/** Pages */
async function initPage(page) {
    const user = firebase.auth().currentUser;
    let userRole = 'viewer';

    if (user) {
        userRole = await checkUserPermissions(user.email);
    }

    // 1. Navigation update kara
    handleNavigationUI(userRole);

    // 2. Viewer sathi Restricted Pages check
    // Viewer la fakta 'home' ani 'profile' chi parvaangi aahe
    const allowedPages = ['home', 'profile'];
    
    if (userRole === 'viewer' && !allowedPages.includes(page)) {
        console.warn("Unauthorized access! Redirecting to home...");
        loadPage('home'); 
        return;
    }

    // 3. Home Page Logic
    if (page === 'home') {
        if (userRole === 'viewer') {
            renderLiveMatchesForViewers(); 
        } else {
           // renderAdminDashboard();

            renderLiveMatchesForViewers(); 
        }
    }

    // Bakiche logic (Profile, Teams, etc.)
    if (page === 'profile' && user) updateProfileUI(user);

   // 'teams' पेजसाठी नवीन फंक्शन कॉल करा
if (page === 'teams' && userRole !== 'viewer') {
    console.log("[Navigation]: Loading Teams Page...");
    loadMasterTeamsList(); // हे नवीन प्रगत फंक्शन कॉल करा
}

    if (page === 'tournaments' && userRole !== 'viewer') renderTournaments();

}


/**२. व्हिटलिस्ट चेक करण्यासाठी फंक्शन (Helper Function) */
async function checkUserPermissions(email) {
  console.log("Fetching permissions from Firestore for:", email);
  try {
    const db = firebase.firestore();
    const docRef = db.collection('authorized_users').doc(email);
    const doc = await docRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      console.log("Firestore Data Found:", data);
      return data.role; // 'admin' किंवा 'scorer'
    } else {
      console.error("No document found in 'authorized_users' for this email!");
      return 'viewer';
    }
  } catch (error) {
    console.error("Firestore Error in checkUserPermissions:", error);
    return 'viewer';
  }
}


function updateProfileUI(user) {
    const profileName = document.getElementById('userDisplayName');
    const profilePic = document.getElementById('userProfilePic');
    const profileEmail = document.getElementById('userEmail');
    
    if (profileName) profileName.innerText = user.displayName;
    if (profilePic) profilePic.src = user.photoURL;
    if (profileEmail) profileEmail.innerText = user.email;
}


/** Close Menu */
function closeMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  sidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
}


/** teams */

let teams = [];

function openCreateTeam() {
  document.getElementById('teamModal').classList.remove('hidden');
}

function closeCreateTeam() {
  document.getElementById('teamModal').classList.add('hidden');
}

/** */
function createTeam() {
  const name = document.getElementById('teamName').value;

  if (!name) return alert("Enter team name");

  teams.push({ name });

  document.getElementById('teamName').value = "";
  closeCreateTeam();

  renderTeams();
}

function renderTeams() {
  const list = document.getElementById('teamList');

  list.innerHTML = "";

  masterTeams.forEach(team => {
    list.innerHTML += `
      <div class="bg-gray-900 p-3 rounded-xl flex justify-between">
        <span>${team.name} (${team.group})</span>
        <button onclick="addTeam(${team.id})" class="text-green-400">Add</button>
      </div>
    `;
  });
}

/** */
function deleteTeam(index) {
  teams.splice(index, 1);
  renderTeams();
}

function addTeam(id) {
  if (selectedTeams.includes(id)) {
    alert("Team already added");
    return;
  }

  selectedTeams.push(id);
  alert("Team added");
}



//------------------**Tournaments *-----------------------------//

let tournaments = [];
let selectedTeams = [];

function openTournamentModal() {
  document.getElementById('tournamentModal').classList.remove('hidden');
}

function closeTournamentModal() {
  document.getElementById('tournamentModal').classList.add('hidden');
}

function handleLevelChange() {
  const level = document.getElementById('tLevel').value;
  const assoc = document.getElementById('tAssociation');

  if (level === "District") {
    assoc.classList.remove('hidden');
  } else {
    assoc.classList.add('hidden');
  }
}

/**
 * जेव्हा तू नवीन टूर्नामेंट तयार करशील, तेव्हा 'सुरुवात' आणि 'शेवट' या तारखा आता डेटाबेसमध्ये (Firebase) सेव्ह होतील.
 * @createTournament 
 */

/**
 * renderTournaments
*/


async function createTournament() {
  console.log("[Process]: Starting tournament creation...");
  
  const tName = document.getElementById('tName')?.value.trim();
  const organizer = document.getElementById('tOrganizer')?.value.trim();
  const season = document.getElementById('tSeason')?.value;
  const startDate = document.getElementById('tStartDate')?.value;
  const endDate = document.getElementById('tEndDate')?.value;
  const level = document.getElementById('tLevel')?.value;
  const association = document.getElementById('tAssociation')?.value || "";
  const surface = document.getElementById('tSurface')?.value;
  const type = document.getElementById('tType')?.value;
  const category = document.getElementById('tCategory')?.value;
  const group = document.getElementById('tGroup')?.value;
  const format = document.getElementById('tFormat')?.value;
  const teamLimit = parseInt(document.getElementById('tLimit')?.value) || 16;

  // १. अनिवार्य व्हॅलिडेशन चेक
  if (!tName || !organizer || !season || !startDate || !endDate) {
    Swal.fire({ icon: 'warning', title: 'माहिती अपूर्ण!', text: 'कृपया स्पर्धेचे नाव, आयोजक, सीझन आणि तारखा अचूक भरा.' });
    return;
  }

  try {
    // २. युनिक नेम चेक
    const querySnapshot = await db.collection("tournaments").where("name", "==", tName).get();
    if (!querySnapshot.empty) {
      Swal.fire({ icon: 'error', title: 'ओहो...', text: 'या नावाची स्पर्धा आधीच तयार केली आहे!' });
      return;
    }

    // ३. लॉगिन असलेला करंट युजर मिळवा
    const user = firebase.auth().currentUser;
    if (!user) {
      Swal.fire({ icon: 'error', title: 'अथेंटिकेशन एरर!', text: 'कृपया सिस्टीममध्ये पुन्हा लॉगिन करा.' });
      return;
    }

    // 🟢 𝓕𝓘𝓧 [पायरी १]: कडक युनिक टूर्नामेंट आयडी (Tournament ID) तयार करणे
    // नावातील स्पेस काढून आणि शेवटी छोटा टाइमस्टॅम्प जोडून आयडी बनवला (उदा. KVC_CUP_43210)
    const cleanName = tName.replace(/\s+/g, '_').toUpperCase().slice(0, 15);
    const shortTimestamp = new Date().getTime().toString().slice(-5);
    const generatedTournamentId = `T_${cleanName}_${shortTimestamp}`;

    // ४. नवीन डेटा स्ट्रक्चर (tournamentId फील्डसह)
    const tData = {
      tournamentId: generatedTournamentId, // 🔐 डेटाबेसच्या आत शोधण्यासाठी युनिक आयडी
      name: tName,
      organizer: organizer,
      season: season,
      startDate: startDate, 
      endDate: endDate,     
      level: level,
      association: association,
      surface: surface,
      type: type,
      category: category,
      group: group,
      format: format,
      teamLimit: teamLimit,
      
      teams: [],                  
      createdBy: user.email,      
      assignedScorers: [],        
      createdAt: new Date().getTime()
    };

    // 🔍 [लाइव्ह कन्सोल चेक]: बॅकएंडला जाण्यापूर्वी आयडी काय बनला ते पहा
    console.log(`%c💾 [टूर्नामेंट निर्मिती]: नवीन कडक आयडी तयार झाला -> "${generatedTournamentId}"`, "color: #3b82f6; font-weight: bold;");
    console.log("[Firestore]: Saving tournament data...", tData);
    
    // 🟢 फिक्स: .add() ऐवजी आपण स्वतः बनवलेल्या आयडीचा वापर करून .doc().set() करत आहोत
    await db.collection("tournaments").doc(generatedTournamentId).set(tData);
    
    Swal.fire({
      icon: 'success',
      title: 'स्पर्धा तयार झाली!',
      text: `नवीन टूर्नामेंट (आयडी: ${generatedTournamentId}) यशस्वीरित्या जतन केली आहे.`,
      timer: 1500,
      showConfirmButton: false
    });

    closeTournamentModal();
    renderTournaments(); 

  } catch (error) {
    console.error("[Fatal Error] createTournament failed:", error);
    Swal.fire({ icon: 'error', title: 'चूक झाली!', text: 'डेटा जतन करताना तांत्रिक अडचण आली.' });
  }
}

/** */
async function renderTournaments() {
  const list = document.getElementById('tournamentList');
  if (!list) return;

  // मॉडर्न लोडिंग स्टेट (RAIDX थीम नुसार)
  list.innerHTML = `
    <div class="flex justify-center py-20 text-orange-500 animate-pulse text-[10px] font-black uppercase tracking-widest">
        टूर्नामेंट यादी लोड होत आहे...
    </div>`;

  try {
    const user = firebase.auth().currentUser;
    if (!user) {
        list.innerHTML = "<p class='text-center text-gray-500 text-xs py-10'>कृपया लॉगिन करा.</p>";
        return;
    }

    // रोल आणि परमिशन मिळवा
    const userRole = await checkUserPermissions(user.email); 
    
    let query;
    const dbRef = db.collection("tournaments");

    // रोलनुसार डेटा फिल्टर लॉजिक
    if (userRole === 'admin') {
        // ॲडमिनला त्याने स्वतः बनवलेल्या टूर्नामेंट्स दिसतील
        query = dbRef.where("createdBy", "==", user.email);
    } else if (userRole === 'scorer') {
        // स्कोअररला ज्या टूर्नामेंटमध्ये ॲड केले आहे तीच दिसेल
        query = dbRef.where("assignedScorers", "array-contains", user.email);
    } else {
        list.innerHTML = "<p class='text-center text-red-500 text-xs py-10 font-bold'>तुम्हाला डेटा पाहण्याची परवानगी नाही.</p>";
        return;
    }

    // डेटा फिल्टर करून 'createdAt' नुसार सॉर्ट करा
    const snapshot = await query.orderBy("createdAt", "desc").get();
    list.innerHTML = "";

    if (snapshot.empty) {
        list.innerHTML = `
            <div class="text-center py-20 bg-[#111] rounded-2xl border border-gray-800/50">
                <p class="text-gray-500 text-xs font-bold uppercase tracking-wider">कोणतीही टूर्नामेंट सापडली नाही</p>
                <p class="text-[9px] text-gray-600 mt-1">नवीन स्पर्धा तयार करण्यासाठी वरती '+ Create' वर क्लिक करा.</p>
            </div>`;
        return;
    }

    snapshot.forEach((doc) => {
      const t = doc.data();
      const tId = doc.id; 
      const registeredTeamsCount = t.teams ? t.teams.length : 0;

      // प्रत्येक टूर्नामेंट कार्डचा लुक नवीन डार्क-ऑरेंज थीममध्ये
      list.innerHTML += `
      <div onclick="viewTournamentDetails('${tId}')" 
           class="bg-[#111] p-4 rounded-2xl border border-gray-800 shadow-md mb-3 cursor-pointer hover:border-orange-500/40 active:scale-[0.99] transition-all relative overflow-hidden group">
          
          <div class="absolute top-0 left-0 w-1 h-full bg-orange-600 opacity-0 group-hover:opacity-100 transition-all"></div>

          <div class="flex justify-between items-start gap-2">
              <div class="space-y-1 max-w-[70%]">
                  <div class="font-black text-sm text-white uppercase tracking-tighter italic group-hover:text-orange-500 transition-colors leading-tight">${t.name}</div>
                  
                  <div class="text-[9px] text-gray-500 uppercase tracking-widest font-bold font-mono">
                      ${t.season} | <span class="text-gray-400">${t.level} (${t.association || 'No Assoc'})</span>
                  </div>
                  
                  <div class="flex items-center gap-1 text-[9px] text-orange-400 font-bold uppercase tracking-tighter pt-0.5">
                      <span>📅</span> ${t.startDate || 'TBD'} <span class="text-gray-600 font-normal">ते</span> ${t.endDate || 'TBD'}
                  </div>
                  
                  <div class="text-[8px] text-gray-500 uppercase tracking-wide font-medium flex flex-wrap gap-x-2 gap-y-0.5 pt-0.5">
                      <span>${t.type || 'Men'}</span> • <span>Group ${t.group || 'A'}</span> • <span>${t.surface || 'Ground'}</span>
                  </div>
              </div>
              
              <div class="flex flex-col items-end justify-between h-16 shrink-0">
                  <span class="bg-gray-950 text-orange-500/80 border border-gray-800 text-[8px] font-black uppercase px-2 py-0.5 rounded-lg shadow-inner tracking-widest italic">
                      ${t.format}
                  </span>
                  
                  ${userRole === 'admin' ? `
                    <button onclick="event.stopPropagation(); editTournament('${tId}')" 
                            class="bg-orange-600 hover:bg-orange-700 text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-xl text-white shadow-md active:scale-90 transition-all">
                        Edit
                    </button>
                  ` : ''}
              </div>
          </div>
          
          <div class="mt-3 pt-2 border-t border-gray-800/40 flex justify-between items-center text-[9px]">
              <span class="text-gray-500 italic">Registered Status:</span>
              <span class="font-bold text-gray-400 uppercase tracking-tighter">
                  🛡️ ${registeredTeamsCount} <span class="text-gray-600 font-normal">/ ${t.teamLimit || '16'} Teams</span>
              </span>
          </div>
      </div>
      `;
    });
  } catch (error) {
    console.error("[Fatal Error] renderTournaments failed:", error);
    list.innerHTML = `
        <div class="text-center py-10 bg-[#111] rounded-2xl border border-red-900/30">
            <p class="text-red-500 text-xs font-bold">डेटा लोड करताना चूक झाली.</p>
            <p class="text-[9px] text-gray-600 mt-1">Firestore Index किंवा नेटवर्क तपासा.</p>
        </div>`;
  }
}
/**
 * viewTournamentDetails
 * हे फंक्शन नवीन पेज लोड करेल आणि त्या विशिष्ट टूर्नामेंटचा डेटा खेचून (Fetch) तिथे दाखवेल:
 */
async function viewTournamentDetails(id) {
    currentTid = id;
    localStorage.setItem('lastTournamentId', id); // आयडी सेव्ह करा

  // १. आधी डिटेल्स पेज लोड करा
  await loadPage('tournament_details');

  try {
    // २. Firebase मधून डेटा मिळवा
    const doc = await db.collection("tournaments").doc(id).get();
    if (!doc.exists) return;
    const t = doc.data();

    // ३. पेजवर माहिती भरा
    document.getElementById('viewTName').innerText = t.name;
    
    
    // डिटेल्स टॅबमध्ये माहिती दाखवण्यासाठी (डिफॉल्ट)
    renderDetailsTab(t, id);

  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 *  *'Details' टॅब रेंडर करणे
    या टॅबमध्येच आपण "Generate Fixtures" चे बटण देऊया:
 */
function renderDetailsTab(t, id) {
    const content = document.getElementById('tabContent');
    window.currentTournamentTeams = t.teams || []; 

    const raidxLogo = "assets/logo/raidx-menu.png"; 
    const splashBanner = "assets/logo/splash screen.jpg"; 

    content.innerHTML = `
    <div class="flex flex-col gap-3 animate-fadeIn h-full">
        
        <div class="relative h-32 w-full rounded-2xl overflow-hidden border border-gray-800 shrink-0 shadow-lg">
            <img src="${splashBanner}" class="w-full h-full object-cover opacity-60 grayscale-[0.3]">
            
            <img src="${raidxLogo}" class="absolute right-3 top-3 h-12 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
            
            <div class="absolute bottom-4 left-4">
                <div class="flex items-center gap-2 mb-1">
                    <span class="bg-orange-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-md">RAIDX LIVE</span>
                    <p class="text-[9px] text-orange-400 font-bold uppercase tracking-tighter drop-shadow-md">
                        📅 ${t.startDate} - ${t.endDate}
                    </p>
                </div>
                <h2 class="text-lg font-black text-white italic uppercase tracking-tighter leading-none drop-shadow-lg">${t.name}</h2>
            </div>
        </div>

        <div class="bg-[#111] p-2 rounded-2xl border border-gray-800 shadow-xl shrink-0">
            <div class="flex justify-around items-end py-1">
                <div class="text-center scale-[0.65] origin-bottom opacity-40">
                    <div class="w-12 h-12 bg-gray-900 rounded-full border border-gray-700 mx-auto flex items-center justify-center">
                         <span class="text-gray-600 text-[10px]">TBD</span>
                    </div>
                    <p class="text-[9px] font-black text-white mt-1 uppercase italic">Runner</p>
                </div>

                <div class="text-center scale-[0.85] origin-bottom">
                    <div class="relative">
                        <div class="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-600 text-[6px] px-2 py-0.5 rounded-full text-white font-black z-20 shadow-lg uppercase">Winner</div>
                        <div class="w-16 h-16 bg-orange-600/10 rounded-full border-2 border-orange-600 mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                             <span class="text-orange-500 text-xl">🏆</span>
                        </div>
                    </div>
                    <p class="text-[10px] font-black text-white mt-1 uppercase italic tracking-tighter">Pending</p>
                </div>

                <div class="text-center scale-[0.65] origin-bottom opacity-40">
                    <div class="w-12 h-12 bg-gray-900 rounded-full border border-gray-700 mx-auto flex items-center justify-center">
                         <span class="text-gray-600 text-[10px]">TBD</span>
                    </div>
                    <p class="text-[9px] font-black text-white mt-1 uppercase italic">Best Player</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-2 shrink-0">
            <div class="bg-[#111] p-2.5 rounded-xl border border-gray-800">
                <p class="text-[7px] text-gray-500 uppercase font-black mb-0.5">Organizer</p>
                <p class="text-[11px] font-bold text-white truncate">${t.organizer}</p>
            </div>
            <div class="bg-[#111] p-2.5 rounded-xl border border-gray-800">
                <p class="text-[7px] text-gray-500 uppercase font-black mb-0.5">Teams</p>
                <p class="text-[11px] font-bold text-white">${t.teams.length} <span class="text-orange-500">/ ${t.teamLimit}</span></p>
            </div>
            <div class="bg-[#111] p-2.5 rounded-xl border border-gray-800">
                <p class="text-[7px] text-gray-500 uppercase font-black mb-0.5">Level</p>
                <p class="text-[11px] font-bold text-white truncate">${t.level} | ${t.group}</p>
            </div>
            <div class="bg-[#111] p-2.5 rounded-xl border border-gray-800">
                <p class="text-[7px] text-gray-500 uppercase font-black mb-0.5">Surface</p>
                <p class="text-[11px] font-bold text-white uppercase tracking-tighter italic">${t.surface}</p>
            </div>
        </div>

        <div class="mt-auto pt-1 pb-2">
            <button onclick="handleFixtureGeneration('${id}')" 
                class="w-full bg-orange-600 hover:bg-orange-700 py-3.5 rounded-xl text-white font-black text-xs uppercase shadow-lg active:scale-95 transition-all tracking-tighter italic">
                Generate Fixtures (मॅचेस लावा)
            </button>
        </div>
    </div>
    `;
}

/**
 * Fixture Generator (मॅचेस लावण्याचे लॉजिक)
* जेव्हा युजर बटण दाबतो, तेव्हा आपण रँडमली जोड्या लावून मॅचेस 'Pending' म्हणून सेव्ह करूया
* handleFixtureGeneration
 */
// async function handleFixtureGeneration(tId) {
//   const targetId = tId || currentTid;
  
//   try {
//     const tDoc = await db.collection("tournaments").doc(targetId).get();
//     const limit = parseInt(tDoc.data().teamLimit) || 16;
    
//     // १. जवळची 'Power of 2' शोधा (उदा. २० साठी ३२)
//     const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(limit)));
    
//     // २. पहिल्या राऊंडमध्ये किती टीम्स खेळतील?
//     // सूत्र: (Total Teams - (Power of 2 / 2)) * 2
//     // २० टीम्ससाठी: (20 - 16) * 2 = 8 टीम्स (म्हणजे ४ मॅचेस)
//     const teamsInRound1 = (limit - (powerOfTwo / 2)) * 2;
//     const round1Matches = teamsInRound1 > 0 ? teamsInRound1 / 2 : 0;

//     // ३. एकूण मॅचेस = (Limit - 1)
//     const totalActualMatches = limit - 1;

//     const check = await db.collection("tournaments").doc(targetId).collection("matches").limit(1).get();
//     if (!check.empty) {
//       Swal.fire("माहिती", "फिक्स्चर्स आधीच तयार आहेत.", "info");
//       return;
//     }

//     Swal.fire({
//       title: 'ऑटोमेटेड फिक्स्चर!',
//       text: `${limit} टीम्ससाठी ${totalActualMatches} मॅचेस तयार होतील. (BYE वगळून)`,
//       icon: 'info',
//       showCancelButton: true,
//       confirmButtonText: 'हो, तयार करा'
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         const batch = db.batch();
//         let matchCounter = 1;

//         // --- ROUND 1 (फक्त आवश्यक मॅचेस) ---
//         for (let i = 1; i <= round1Matches; i++) {
//           createMatchEntry(batch, targetId, matchCounter++, "Round 1");
//         }

//         // --- ROUND 2 (Pre-Quarter / Round of 16) ---
//         for (let i = 1; i <= 8; i++) {
//           createMatchEntry(batch, targetId, matchCounter++, (limit <= 16 && matchCounter <= 8) ? "Round 1" : "Pre-Quarter");
//         }

//         // --- QUARTER, SEMI, FINAL ---
//         const rounds = [
//           { name: "Quarter Final", count: 4 },
//           { name: "Semi Final", count: 2 },
//           { name: "FINAL", count: 1 }
//         ];

//         rounds.forEach(r => {
//           for (let i = 1; i <= r.count; i++) {
//             // जर एकूण मॅचेसच्या बाहेर जात असेल तर थांबा
//             if (matchCounter <= totalActualMatches) {
//               createMatchEntry(batch, targetId, matchCounter++, r.name);
//             }
//           }
//         });

//         await batch.commit();
//         Swal.fire("यशस्वी!", "सर्व मॅचेस तयार झाल्या!", "success");
//         switchTab('fixtures', targetId);
//       }
//     });
//   } catch (err) { console.error(err); }
// }


// मॅच एन्ट्री तयार करण्यासाठी फ्युचर-प्रूफ हेल्पपर फंक्शन
// function createMatchEntry(batch, tId, mNo, roundName) {
//   const mRef = db.collection("tournaments").doc(tId).collection("matches").doc(`M${mNo}`);
  
//   batch.set(mRef, {
//     matchNo: mNo,
//     teamA: "TBD",
//     teamB: "TBD",
//     teamA_id: "TBD", // 🟢 नवीन युनिक आयडी फील्ड भविष्यातील सुरक्षेसाठी
//     teamB_id: "TBD", // 🟢 नवीन युनिक आयडी फील्ड भविष्यातील सुरक्षेसाठी
//     status: "Pending",
//     scoreA: 0,
//     scoreB: 0,
//     round: roundName
//   });
// }

/** scoreCard object
 * handleFixtureGeneration चे नवीन डिझाईन (डायनॅमिक गणितासह)
आता या मुख्य फंक्शनमध्ये मॅथेमॅटिकल गणितानुसार लूप्स चालवूया. जर संघ संख्या कमी असेल (उदा. ४ किंवा ८), 
तर नको असलेले राऊंड्स आपोआप गाळले (Skip) जातील आणि तंतोतंत अचूक मॅचेस तयार होतील.
 */
async function handleFixtureGeneration(tId) {
  const targetId = tId || currentTid;
  console.log("%c--- 📅 [DYNAMIC FIXTURE GENERATION START] ---", "color: #3b82f6; font-weight: bold;");
  
  try {
    const tDoc = await db.collection("tournaments").doc(targetId).get();
    const limit = parseInt(tDoc.data().teamLimit) || 16;
    
    // १. एकूण लागणाऱ्या मॅचेसचा अंतिम नियम: (Teams - 1)
    const totalActualMatches = limit - 1;
    
    // २. बाय (BYE) आणि राऊंड १ चे गणित
    const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(limit)));
    const teamsInRound1 = (limit - (powerOfTwo / 2)) * 2;
    const round1Matches = teamsInRound1 > 0 ? teamsInRound1 / 2 : 0;

    // आधीच फिक्स्चर बनले आहे का तपासणी
    const check = await db.collection("tournaments").doc(targetId).collection("matches").limit(1).get();
    if (!check.empty) {
      Swal.fire("माहिती", "फिक्स्चर्स आधीच तयार आहेत.", "info");
      return;
    }

    const result = await Swal.fire({
      title: 'ऑटोमेटेड फिक्स्चर!',
      text: `${limit} टीम्ससाठी अचूक ${totalActualMatches} मॅचेस तयार होतील.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'हो, तयार करा',
      background: '#111', color: '#fff', confirmButtonColor: '#f97316'
    });

    if (result.isConfirmed) {
      const batch = db.batch();

      console.log(`📊 [CALCULATING]: Total Matches to Create: ${totalActualMatches}`);

      // 🎯 [THE ULTIMATE DYNAMIC ROUND NAMING ENGINE]
      // प्रत्येक मॅच नंबरसाठी नाव काय असावं हे कॉम्प्युटर स्वतः मोजणार!
      for (let mNo = 1; mNo <= totalActualMatches; mNo++) {
        let roundName = "Round 1";

        // शेवटची मॅच नेहमी 'FINAL' असणार
        if (mNo === totalActualMatches) {
          roundName = "FINAL";
        }
        // शेवटच्या मॅचच्या आधीच्या २ मॅचेस नेहमी 'Semi Final' असणार
        else if (mNo === totalActualMatches - 1 || mNo === totalActualMatches - 2) {
          roundName = "Semi Final";
        }
        // त्याच्या आधीच्या ४ मॅचेस नेहमी 'Quarter Final' असणार (जर ८ किंवा जास्त टीम्स असतील तरच इथे नंबर येईल)
        else if (mNo >= totalActualMatches - 6 && mNo <= totalActualMatches - 3) {
          roundName = "Quarter Final";
        }
        // जर १६ किंवा २० टीम्स असतील तर क्वार्टरच्या आधीच्या मॅचेस 'Pre-Quarter' किंवा 'Round 1' असतील
        else {
          if (limit > 16 && mNo <= round1Matches) {
            roundName = "Round 1";
          } else {
            roundName = (limit <= 16) ? "Round 1" : "Pre-Quarter";
          }
        }

        // आता अचूक मोजलेल्या नावासह कोरी मॅच एंट्री तयार करा
        createMatchEntry(batch, targetId, mNo, roundName);
      }

      // सर्व मॅचेस एकाच वेळी फायरबेसवर जतन करणे
      await batch.commit();
      console.log(`%c✅ [SUCCESS]: एकूण ${totalActualMatches} मॅचेes नवीन scoreCard रचने सह सेव्ह झाल्या!`, "color: #22c55e; font-weight: bold;");
      
      await Swal.fire({ title: "यशस्वी!", text: "सर्व मॅचेस अचूक राऊंड नावासह तयार झाल्या!", icon: "success", background: '#111', color: '#fff' });
      switchTab('fixtures', targetId);
    }
  } catch (err) { 
    console.error("🚨 [Fixture Generation Error]:", err); 
  }
}

/** scoreCard object */

function createMatchEntry(batch, tId, mNo, roundName) {
  const mRef = db.collection("tournaments").doc(tId).collection("matches").doc(`M${mNo}`);
  
  batch.set(mRef, {
    matchNo: mNo,
    teamA: "TBD",
    teamB: "TBD",
    teamA_id: "TBD", 
    teamB_id: "TBD", 
    status: "Pending",
    round: roundName,
    lastUpdated: new Date().getTime(),

    // 🎯 [SINGLE SOURCE OF TRUTH]: कोऱ्या मॅचमध्ये सुरुवातीलाच नवीन मास्टर ऑब्जेक्ट लॉक केला!
    scoreCard: {
        mainMatch:  { teamA: 0, teamB: 0 },
        fiveRaid:   { teamA: 0, teamB: 0 },
        goldenRaid: { teamA: 0, teamB: 0 }
    }
  });
}

/** */
function getRoundName(matchNo, powerOfTwo) {
  let totalMatchesInBracket = powerOfTwo - 1;
  let currentRangeStart = 1;
  let currentTotalTeams = powerOfTwo;

  while (currentTotalTeams > 1) {
    let matchesInThisRound = currentTotalTeams / 2;
    let currentRangeEnd = currentRangeStart + matchesInThisRound - 1;

    if (matchNo >= currentRangeStart && matchNo <= currentRangeEnd) {
      if (currentTotalTeams === 2) return "FINAL";
      if (currentTotalTeams === 4) return "Semi Final";
      if (currentTotalTeams === 8) return "Quarter Final";
      if (currentTotalTeams === 16) return "Pre-Quarter";
      return `Round of ${currentTotalTeams}`;
    }

    currentRangeStart = currentRangeEnd + 1;
    currentTotalTeams = currentTotalTeams / 2;
  }
  return "Match";
}

let currentTid = null; // ग्लोबल व्हेरिएबल
/**switchTab फंक्शन (app.js मध्ये जोडा)
हे फंक्शन टॅब बदलण्याचे आणि त्या टॅबनुसार डेटा दाखवण्याचे काम करेल
 */

/** */
async function switchTab(tabName, tId) {
  console.log(`[Navigation]: Switching to tab -> ${tabName}`);
  
  // १. आयडी मॅनेजमेंट
  if (tId) {
    currentTid = tId;
    localStorage.setItem('lastTournamentId', tId);
  } else {
    currentTid = localStorage.getItem('lastTournamentId');
  }

  const targetId = currentTid;
  const content = document.getElementById('tabContent');

  if (!targetId || !content) {
    console.error("[Error]: Tournament ID or Content Container missing!");
    return;
  }

  // २. मॉडर्न स्टाईल रिसेट (Orange-Black Theme)
  // आपण बनवलेल्या नवीन ID-based बटन स्टाईलिंगचा वापर
  const tabNames = ['details', 'teams', 'fixtures', 'points'];
  
  tabNames.forEach(t => {
    // कॅपिटलाइज्ड आयडी मिळवण्यासाठी (उदा. btnTabDetails)
    const btnId = `btnTab${t.charAt(0).toUpperCase() + t.slice(1)}`;
    const btn = document.getElementById(btnId);
    
    if (btn) {
      if (t === tabName.toLowerCase()) {
        // ऍक्टिव्ह टॅब स्टाईल
        btn.classList.add('bg-orange-600', 'text-white', 'shadow-lg');
        btn.classList.remove('text-gray-500');
      } else {
        // इन-ऍक्टिव्ह टॅब स्टाईल
        btn.classList.remove('bg-orange-600', 'text-white', 'shadow-lg');
        btn.classList.add('text-gray-500');
      }
    }
  });

  // ३. डेटा लोड करा आणि टॅबनुसार रेंडर करा
  content.innerHTML = `<div class="flex justify-center py-20 text-orange-500 animate-pulse text-[10px] font-bold uppercase tracking-widest">लोड होत आहे...</div>`;

  try {
    const doc = await db.collection("tournaments").doc(targetId).get();
    if (!doc.exists) {
        content.innerHTML = `<p class="text-center text-gray-500 py-20">टूर्नामेंट सापडली नाही.</p>`;
        return;
    }
    
    const tData = doc.data();
    // हेडरमधील नाव अपडेट करा
    const tNameHeader = document.getElementById('viewTName');
    if (tNameHeader) tNameHeader.innerText = tData.name || "Tournament";

    // टॅबनुसार योग्य रेंडर फंक्शन कॉल करा
    if (tabName === 'details') {
      renderDetailsTab(tData, targetId);
    } 
    else if (tabName === 'fixtures') {
      renderFixturesTab(targetId);
    } 
    else if (tabName === 'teams') {
      renderTeamsTab(tData, targetId); 
    }
    else if (tabName === 'points') {
      // जर पॉईंट टेबल असेल तर इथे रेंडर करा
      if (typeof renderPointsTab === "function") renderPointsTab(tData, targetId);
    }

  } catch (error) {
    console.error("[Fatal Error]: Tab switch process failed!", error);
    content.innerHTML = `<p class="text-center text-red-500 py-20 text-xs">डेटा लोड करताना चूक झाली.</p>`;
  }
}

/**नवीन renderTeamsTab फंक्शन (UI आराखडा) 🛠️
आता हे नवीन फंक्शन आपण तयार करूया, जे स्कोअरर किंवा ॲडमिनला सहभागी टीम्स दाखवेल */
function renderTeamsTab(tData, tId) {
    console.log(`[UI]: Rendering Teams Tab for Tournament ID: ${tId}`);
    console.log("[Data]: Tournament Object:", tData);

    const content = document.getElementById('tabContent');
    const teamCount = tData.teams ? tData.teams.length : 0;

    content.innerHTML = `
    <div class="space-y-4 animate-fadeIn">
      <div class="flex justify-between items-center bg-[#111] p-3 rounded-xl border border-gray-800 shadow-lg">
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-tight">सहभागी संघ (Teams)</h3>
          <p class="text-[10px] text-gray-500 font-medium">एकूण: ${teamCount} / ${tData.teamLimit || '16'}</p>
        </div>
        <button onclick="openGlobalTeamSelector('${tId}')" 
          class="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-xl text-[10px] text-white font-black uppercase shadow-lg active:scale-95 transition-all">
          + Add Team
        </button>
      </div>

      <div id="tournamentTeamList" class="grid grid-cols-3 gap-2">
        <p class="text-gray-500 text-[10px] col-span-3 text-center py-10 tracking-widest uppercase">माहिती लोड होत आहे...</p>
      </div>
    </div>
  `;

    // पुढचे फंक्शन कॉल करण्यापूर्वी लॉग द्या
    console.log(`[Process]: Passing ${teamCount} teams to displayTournamentTeams()`);
    displayTournamentTeams(tData.teams, tId);
}

/**टीम्सची कार्डे दाखवणे (displayTournamentTeams) 👤
हे फंक्शन फक्त टीम्सची नावे आणि छोटे लोगो (असल्यास) दाखवेल: */
// async function displayTournamentTeams(teamsList, tId) {
//     console.log("%c----------------------------------------", "color: #f97316; font-weight: bold;");
//     console.log("[Process]: Rendering Team Grid with Full-Card Click Logic...");
//     const listContainer = document.getElementById('tournamentTeamList');
    
//     if (!listContainer) {
//         console.error("[Display Teams Error]: Element #tournamentTeamList NOT found in DOM!");
//         return;
//     }

//     if (!teamsList || teamsList.length === 0) {
//         console.warn("[Warning]: No teams found in teamsList array.");
//         listContainer.innerHTML = `<p class="text-gray-500 text-[10px] col-span-3 text-center py-10 uppercase tracking-tighter">अजून एकही टीम जोडली नाही.</p>`;
//         return;
//     }

//     console.log(`[Data]: Mapping ${teamsList.length} teams to Full-Click UI cards...`);
    
//     // युजरला प्रोग्रेस दिसावी म्हणून तात्पुरती लोडिंग飾 State
//     listContainer.innerHTML = `<p class="text-gray-500 text-[9px] col-span-3 text-center py-5 uppercase tracking-widest animate-pulse">डेटाबेस आयडी मॅप होत आहेत...</p>`;

//     try {
//         let cardsHTML = "";

//         for (const teamName of teamsList) {
//             let resolvedTeamId = "UNKNOWN";
//             let teamLogo = "";

//             // master_teams मधून या नावाचा डेटा गोळा करा
//             const snapshot = await db.collection("master_teams").where("teamName", "==", teamName).get();
            
//             if (!snapshot.empty) {
//                 const teamDoc = snapshot.docs[0];
//                 resolvedTeamId = teamDoc.id; 
//                 teamLogo = teamDoc.data().teamLogo || "";
//             } else {
//                 console.warn(`[ID Resolution Warning]: Team "${teamName}" not found in master_teams collection!`);
//             }

//             // लोगो किंवा लेटर अवतार मॅनेजमेंट
//             let logoHTML = "";
//             if (teamLogo) {
//                 logoHTML = `<img src="${teamLogo}" class="w-10 h-10 rounded-full object-contain bg-black/40 border border-gray-800 shadow-inner mb-1">`;
//             } else {
//                 logoHTML = `
//                 <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-black text-sm mb-1 shadow-inner font-mono italic">
//                     ${teamName.charAt(0).toUpperCase()}
//                 </div>`;
//             }

//             // 🟢 प्रॉपर फिक्स: संपूर्ण बॉक्सवर (div) 'onclick' दिला आहे आणि पॅडिंग 'p-3 py-4' करून क्लिक एरिया वाढवला आहे
//             cardsHTML += `
//                 <div onclick="viewTeamPlayers('${resolvedTeamId}', '${tId}')" 
//                      class="relative bg-[#111] border border-gray-800 p-3 py-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg cursor-pointer active:bg-gray-900 group hover:border-orange-500/40 transition-all">
                  
//                   <button onclick="event.stopPropagation(); removeTeamFromTournament('${teamName}')" 
//                     class="absolute top-1.5 right-1.5 text-gray-700 hover:text-red-500 p-1 transition-colors active:scale-75 z-10">
//                     <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
//                       <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
//                     </svg>
//                   </button>

//                   <div class="shrink-0 pointer-events-none">${logoHTML}</div>

//                   <h4 class="text-[10px] font-black text-gray-200 uppercase tracking-tighter truncate w-full px-1 leading-tight group-hover:text-orange-500 transition-colors mt-1 pointer-events-none">${teamName}</h4>
                  
//                   </div>
//             `;
//         }

//         listContainer.innerHTML = cardsHTML;
//         console.log("[UI]: Full-Card Click grid rendering complete.");
//         console.log("%c----------------------------------------", "color: #f97316; font-weight: bold;");

//     } catch (error) {
//         console.error("[Fatal Error in displayTournamentTeams]:", error);
//         listContainer.innerHTML = `<p class="text-red-500 text-[10px] col-span-3 text-center py-10 uppercase font-bold">यादी रेंडर करताना तांत्रिक अडचण आली.</p>`;
//     }
// }

// add Teams in Torunamnet
/**यामध्ये आपण जुना डेटा (केवळ नाव असलेली स्ट्रिंग) आणि नवीन डेटा (पूर्ण ऑब्जेक्ट) दोन्ही सुरक्षितपणे मॅनेज केले आहेत */


async function displayTournamentTeams(teamsList, tId) {
    console.log("%c----------------------------------------", "color: #f97316; font-weight: bold;");
    console.log("[Process]: Rendering Team Grid with Full-Card Click Logic...");
    const listContainer = document.getElementById('tournamentTeamList');
    
    if (!listContainer) {
        console.error("[Display Teams Error]: Element #tournamentTeamList NOT found in DOM!");
        return;
    }

    if (!teamsList || teamsList.length === 0) {
        console.warn("[Warning]: No teams found in teamsList array.");
        listContainer.innerHTML = `<p class="text-gray-500 text-[10px] col-span-3 text-center py-10 uppercase tracking-tighter">अजून एकही टीम जोडली नाही.</p>`;
        return;
    }

    console.log(`[Data]: Mapping ${teamsList.length} teams to Full-Click UI cards...`);
    listContainer.innerHTML = `<p class="text-gray-500 text-[9px] col-span-3 text-center py-5 uppercase tracking-widest animate-pulse">डेटाबेस आयडी मॅप होत आहेत...</p>`;

    try {
        let cardsHTML = "";

        for (const t of teamsList) {
            if (!t) continue;

            // 🟢 [स्मार्ट मॅपिंग]: ऑब्जेक्ट असेल तर डेटा घ्या, स्ट्रिंग असेल तर बॅकअप ठेवा
            const teamName = (typeof t === 'object') ? t.teamName : t;
            const savedId = (typeof t === 'object') ? t.regId : null; // टूर्नामेंटच्या ॲरेमध्ये सेव्ह झालेला आयडी

            let resolvedTeamId = "UNKNOWN";
            let teamLogo = "";

            // 🔥 [महत्त्वाचा फिक्स १]: आधी थेट 'master_teams' मध्ये तो आयडी दस्तऐवज (Document) आहे का ते पहा (TM_... पॅटर्न)
            if (savedId && savedId !== "TBD_ID") {
                console.log(`[चेक]: master_teams मध्ये थेट आयडी शोधत आहे: "${savedId}"`);
                const teamDoc = await db.collection("master_teams").doc(savedId).get();
                
                if (teamDoc.exists) {
                    resolvedTeamId = teamDoc.id; // 🔐 इथे मिळाला खरा "TM_JAY_BHARAT_SEVA_005"
                    teamLogo = teamDoc.data().teamLogo || "";
                } else {
                    // 🔥 [बॅकअप फिक्स २]: जर तो थेट डॉक्युमेंट आयडी नसेल आणि चुकून मॅन्युअल regId ('MSKALG...') सेव्ह झाला असेल
                    console.log(`⚠️ [बॅकअप]: थेट डॉक्युमेंट सापडलं नाही. regId == "${savedId}" साठी क्वेरी मारत आहे...`);
                    const backupSnap = await db.collection("master_teams").where("regId", "==", savedId).get();
                    
                    if (!backupSnap.empty) {
                        resolvedTeamId = backupSnap.docs[0].id; // 🔐 मॅन्युअल नंबरवरून सुद्धा त्याचा खरा "TM_..." आयडी खेचून काढला!
                        teamLogo = backupSnap.docs[0].data().teamLogo || "";
                    }
                }
            }

            // जर वरील दोन्ही मार्गाने आयडी मिळाला नाही तर नावावरून शोधण्याचा अंतिम बॅकअप
            if (resolvedTeamId === "UNKNOWN") {
                const snapshot = await db.collection("master_teams").where("teamName", "==", teamName).get();
                if (!snapshot.empty) {
                    resolvedTeamId = snapshot.docs[0].id;
                    teamLogo = snapshot.docs[0].data().teamLogo || "";
                }
            }

            // 🔍 फ्रंटएंड कन्सोल ट्रॅकिंग - रेंडर होणारा फायनल आयडी तपासा
            console.log(`🏅 संघ: "${teamName}" | 🔑 UI ला पास होणारा फायनल सिस्टीम ID = "${resolvedTeamId}"`);

            // लोगो किंवा लेटर अवतार मॅनेजमेंट
            let logoHTML = "";
            if (teamLogo) {
                logoHTML = `<img src="${teamLogo}" class="w-10 h-10 rounded-full object-contain bg-black/40 border border-gray-800 shadow-inner mb-1">`;
            } else {
                const firstChar = teamName && teamName.length > 0 ? teamName.charAt(0).toUpperCase() : "?";
                logoHTML = `
                <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-black text-sm mb-1 shadow-inner font-mono italic">
                    ${firstChar}
                </div>`;
            }

            // कार्ड्सचे रेंडरिंग (नाव आणि खऱ्या सिस्टीम आयडीसह)
            cardsHTML += `
                <div onclick="viewTeamPlayers('${resolvedTeamId}', '${tId}')" 
                     class="relative bg-[#111] border border-gray-800 p-3 py-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg cursor-pointer active:bg-gray-900 group hover:border-orange-500/40 transition-all">
                  
                  <button onclick="event.stopPropagation(); removeTeamFromTournament('${teamName.replace(/'/g, "\\'")}', '${resolvedTeamId}')" 
                        class="absolute top-1.5 right-1.5 text-gray-700 hover:text-red-500 p-1 transition-colors active:scale-75 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </button>

                  <div class="shrink-0 pointer-events-none">${logoHTML}</div>

                  <h4 class="text-[10px] font-black text-gray-200 uppercase tracking-tighter truncate w-full px-1 leading-tight group-hover:text-orange-500 transition-colors mt-1 pointer-events-none">${teamName}</h4>
                  <p class="text-[7px] text-gray-500 font-mono tracking-widest mt-0.5 pointer-events-none">ID: ${resolvedTeamId}</p>
                  
                </div>
            `;
        }

        listContainer.innerHTML = cardsHTML;
        console.log("[UI]: Full-Card Click grid rendering complete.");
        console.log("%c----------------------------------------", "color: #f97316; font-weight: bold;");

    } catch (error) {
        console.error("🚨 [Fatal Error in displayTournamentTeams]:", error);
        listContainer.innerHTML = `<p class="text-red-500 text-[10px] col-span-3 text-center py-10 uppercase font-bold">यादी रेंडर करताना तांत्रिक अडचण आली.</p>`;
    }
}


/**
 * renderFixturesTab (मॅचेस दाखवण्यासाठी)
हे फंक्शन फायरबेसमधून त्या टूर्नामेंटच्या सर्व मॅचेस खेचून आणेल आणि कार्ड्सच्या स्वरूपात दाखवेल.
 */

// async function renderFixturesTab(tId) {
//   const content = document.getElementById('tabContent');
//   if (!content) return;

//   // प्रो-लेव्हल लोडिंग स्टेट
//   content.innerHTML = `
//     <div class="flex justify-center py-20 text-orange-500 animate-pulse text-[10px] font-black uppercase tracking-widest">
//         मॅचेस शोधत आहे (Loading Fixtures)...
//     </div>`;

//   try {
//     const snapshot = await db.collection("tournaments").doc(tId).collection("matches").orderBy("matchNo").get();
    
//     if (snapshot.empty) {
//       content.innerHTML = `
//         <div class="text-center py-16 bg-[#111] rounded-[2rem] border border-gray-800/60 px-4">
//           <p class="text-gray-500 mb-5 text-xs font-bold uppercase tracking-wider">अजून फिक्स्चर्स / मॅचेस तयार केल्या नाहीत.</p>
//           <button onclick="switchTab('details', '${tId}')" 
//               class="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-tighter shadow-lg active:scale-95 transition-all">
//               Details मध्ये जाऊन Template तयार करा
//           </button>
//         </div>
//       `;
//       return;
//     }

//     content.innerHTML = "";
//     snapshot.forEach(doc => {
//       const match = doc.data();
//       const mId = doc.id;

//       // १. दोन्ही टीम्स TBD किंवा BYE नसतील तरच स्टार्ट बटन दाखवण्यासाठी हा चेक:
//       const isReady = match.teamA !== "TBD" && match.teamB !== "TBD" && match.teamA !== "BYE" && match.teamB !== "BYE";

//       // २. मऊ डार्क ऑरेंज थीममधील मॅच कार्ड
//       content.innerHTML += `
//         <div class="bg-[#111] p-4 rounded-[2rem] border border-gray-800/80 mb-4 shadow-xl relative overflow-hidden group">
          
//           <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-800/40">
//             <div class="flex flex-col gap-0.5">
//               <span class="text-[8px] bg-gray-950 text-orange-500 border border-gray-800 px-2 py-0.5 rounded-full font-black w-fit uppercase tracking-widest italic">
//                 ${match.round || 'Tournament'}
//               </span>
//               <span class="text-[10px] text-gray-500 font-bold font-mono">Match #${match.matchNo}</span>
//             </div>
            
//             <button onclick="openMatchSetter('${tId}', '${mId}')" 
//                 class="text-[9px] bg-gray-900 hover:bg-orange-600/10 hover:text-orange-500 text-gray-400 border border-gray-800 px-3 py-1.5 rounded-xl font-bold uppercase tracking-tighter transition-all active:scale-95 shadow-md">
//               Set Team/Time
//             </button>
//           </div>

//           <div class="flex justify-between items-center text-center py-2 relative">
            
//             <div class="flex-1 min-w-[40%]">
//               <p class="text-xs font-black text-white uppercase tracking-tighter truncate px-1">${match.teamA}</p>
//               <p class="text-2xl font-black text-white mt-1.5 font-mono drop-shadow-md">${match.scoreA || 0}</p>
//             </div>
            
//             <div class="px-2 shrink-0">
//               <div class="text-[9px] bg-gray-950 text-orange-500/80 border border-gray-800 px-2.5 py-1 rounded-xl font-black uppercase tracking-wider shadow-inner group-hover:scale-110 transition-transform italic">
//                 VS
//               </div>
//             </div>
            
//             <div class="flex-1 min-w-[40%]">
//               <p class="text-xs font-black text-white uppercase tracking-tighter truncate px-1">${match.teamB}</p>
//               <p class="text-2xl font-black text-white mt-1.5 font-mono drop-shadow-md">${match.scoreB || 0}</p>
//             </div>
            
//           </div>

//           <div class="mt-4 pt-3 border-t border-gray-800/60 flex justify-between items-center">
//             <div class="text-[9px] text-gray-500 font-medium font-mono flex items-center gap-1">
//               <span>📅</span> ${match.matchDate || 'Date TBD'} <span class="text-gray-700">|</span> <span>⏰</span> ${match.matchTime || 'Time TBD'}
//             </div>
            
//             <div>
//               ${isReady ? `
//                 <button onclick="startScoring('${tId}', '${mId}')" 
//                     class="bg-orange-600 hover:bg-orange-700 text-white text-[10px] px-4 py-2 rounded-xl font-black shadow-[0_4px_12px_rgba(249,115,22,0.3)] transition-all active:scale-95 uppercase tracking-tighter italic">
//                   Start Scoring
//                 </button>
//               ` : `
//                 <span class="text-[8px] bg-orange-600/10 text-orange-500 border border-orange-500/20 px-2.5 py-1 rounded-lg font-black uppercase tracking-wider italic animate-pulse">
//                   ${match.teamA === "BYE" || match.teamB === "BYE" ? 'BYE Match' : 'Set Teams First'}
//                 </span>
//               `}
//             </div>
//           </div>
          
//         </div>
//       `;
//     });

//   } catch (error) {
//     console.error("[Fatal Error] renderFixturesTab failed:", error);
//     content.innerHTML = `
//       <div class='text-center text-red-500 py-16 bg-[#111] rounded-[2rem] border border-red-900/30 text-xs font-bold'>
//         फिक्स्चर्स लोड करताना तांत्रिक चूक झाली.
//       </div>`;
//   }
// }

// async function renderFixturesTab(tId) {
//   const content = document.getElementById('tabContent');
//   if (!content) return;

//   // प्रो-लेव्हल लोडिंग स्टेट
//   content.innerHTML = `
//     <div class="flex justify-center py-20 text-orange-500 animate-pulse text-[10px] font-black uppercase tracking-widest">
//         मॅचेस शोधत आहे (Loading Fixtures)...
//     </div>`;

//   try {
//     const snapshot = await db.collection("tournaments").doc(tId).collection("matches").orderBy("matchNo").get();
    
//     if (snapshot.empty) {
//       content.innerHTML = `
//         <div class="text-center py-16 bg-[#111] rounded-[2rem] border border-gray-800/60 px-4">
//           <p class="text-gray-500 mb-5 text-xs font-bold uppercase tracking-wider">अजून फिक्स्चर्स / मॅचेस तयार केल्या नाहीत.</p>
//           <button onclick="switchTab('details', '${tId}')" 
//               class="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-tighter shadow-lg active:scale-95 transition-all">
//               Details मध्ये जाऊन Template तयार करा
//           </button>
//         </div>
//       `;
//       return;
//     }

//     content.innerHTML = "";
//     snapshot.forEach(doc => {
//       const match = doc.data();
//       const mId = doc.id;

//       // 🚨 [💥 THE CRITICAL LOADING FIX & CONSOLE LOGS]: डेटाबेस स्टेटस तपासणे
//       const matchStatusFromDB = (match.status || match.match_status || "").trim();
//       console.log(`🔍 [FIXTURE CARD LOAD]: Match #${match.matchNo} (ID: ${mId}) ➔ Database Status: "${matchStatusFromDB}"`);

//       // १. दोन्ही टीम्स TBD किंवा BYE नसतील तरच स्टार्ट बटन दाखवण्यासाठी हा चेक
//       const isReady = match.teamA !== "TBD" && match.teamB !== "TBD" && match.teamA !== "BYE" && match.teamB !== "BYE";

//       // 🎯 स्टेटस 'Finished' असेल तर "START SCORING" ऐवजी "VIEW SUMMARY" दाखवण्याचे बटन लॉजिक
//       let actionButtonHtml = "";

//       if (matchStatusFromDB === "Finished") {
//          console.log(`✅ [FIXTURE BLOCK]: Match #${match.matchNo} आधीच संपली आहे. 'Start Scoring' बटण ब्लॉक केले!`);
//          actionButtonHtml = `
//             <button onclick="viewMatchSummary('${mId}')" 
//                 class="bg-slate-800 hover:bg-slate-750 text-zinc-400 border border-slate-700 text-[10px] px-4 py-2 rounded-xl font-black shadow-md transition-all active:scale-95 uppercase tracking-tighter">
//                 🏁 View Summary
//             </button>
//          `;
//       } else if (isReady) {
//          console.log(`🏃‍♂️ [FIXTURE LIVE]: Match #${match.matchNo} अजून चालू किंवा नवीन आहे. 'Start Scoring' बटण उपलब्ध आहे.`);
//          actionButtonHtml = `
//             <button onclick="startScoring('${tId}', '${mId}')" 
//                 class="bg-orange-600 hover:bg-orange-700 text-white text-[10px] px-4 py-2 rounded-xl font-black shadow-[0_4px_12px_rgba(249,115,22,0.3)] transition-all active:scale-95 uppercase tracking-tighter italic">
//               Start Scoring
//             </button>
//          `;
//       } else {
//          actionButtonHtml = `
//             <span class="text-[8px] bg-orange-600/10 text-orange-500 border border-orange-500/20 px-2.5 py-1 rounded-lg font-black uppercase tracking-wider italic animate-pulse">
//               ${match.teamA === "BYE" || match.teamB === "BYE" ? 'BYE Match' : 'Set Teams First'}
//             </span>
//          `;
//       }

//       // २. मऊ डार्क ऑरेंज थीममधील मॅच कार्ड (डिझाईन नो चेंज)
//       content.innerHTML += `
//         <div class="bg-[#111] p-4 rounded-[2rem] border border-gray-800/80 mb-4 shadow-xl relative overflow-hidden group">
          
//           <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-800/40">
//             <div class="flex flex-col gap-0.5">
//               <span class="text-[8px] bg-gray-950 text-orange-500 border border-gray-800 px-2 py-0.5 rounded-full font-black w-fit uppercase tracking-widest italic">
//                 ${match.round || 'Tournament'}
//               </span>
//               <span class="text-[10px] text-gray-500 font-bold font-mono">Match #${match.matchNo}</span>
//             </div>
            
//             <button onclick="openMatchSetter('${tId}', '${mId}')" 
//                 class="text-[9px] bg-gray-900 hover:bg-orange-600/10 hover:text-orange-500 text-gray-400 border border-gray-800 px-3 py-1.5 rounded-xl font-bold uppercase tracking-tighter transition-all active:scale-95 shadow-md">
//               Set Team/Time
//             </button>
//           </div>

//           <div class="flex justify-between items-center text-center py-2 relative">
            
//             <div class="flex-1 min-w-[40%]">
//               <p class="text-xs font-black text-white uppercase tracking-tighter truncate px-1">${match.teamA}</p>
//               <p class="text-2xl font-black text-white mt-1.5 font-mono drop-shadow-md">${match.scoreA || 0}</p>
//             </div>
            
//             <div class="px-2 shrink-0">
//               <div class="text-[9px] bg-gray-950 text-orange-500/80 border border-gray-800 px-2.5 py-1 rounded-xl font-black uppercase tracking-wider shadow-inner group-hover:scale-110 transition-transform italic">
//                 VS
//               </div>
//             </div>
            
//             <div class="flex-1 min-w-[40%]">
//               <p class="text-xs font-black text-white uppercase tracking-tighter truncate px-1">${match.teamB}</p>
//               <p class="text-2xl font-black text-white mt-1.5 font-mono drop-shadow-md">${match.scoreB || 0}</p>
//             </div>
            
//           </div>

//           <div class="mt-4 pt-3 border-t border-gray-800/60 flex justify-between items-center">
//             <div class="text-[9px] text-gray-500 font-medium font-mono flex items-center gap-1">
//               <span>📅</span> ${match.matchDate || 'Date TBD'} <span class="text-gray-700">|</span> <span>⏰</span> ${match.matchTime || 'Time TBD'}
//             </div>
            
//             <div>
//               ${actionButtonHtml} 
//             </div>
//           </div>
          
//         </div>
//       `;
//     });

//   } catch (error) {
//     console.error("[Fatal Error] renderFixturesTab failed:", error);
//     content.innerHTML = `
//       <div class='text-center text-red-500 py-16 bg-[#111] rounded-[2rem] border border-red-900/30 text-xs font-bold'>
//         फिक्स्चर्स लोड करताना तांत्रिक चूक झाली.
//       </div>`;
//   }
// }

/**
 * सुधारित renderFixturesTab फंक्शन (मास्टर ऑब्जेक्ट डिस्प्लेसह)
आपण ठरवल्याप्रमाणे तुझा प्रो-लेव्हल लोडिंग स्टेट, मऊ डार्क ऑरेंज थीम, "Start Scoring" चे बटन लॉजिक आणि कडक कन्सोल लॉग्स जसेच्या तसे सुरक्षित ठेवले आहेत. 
फक्त डिस्प्ले करताना स्कोअर कसा ओढायचा, तिथं आपण मास्टर ऑब्जेक्टचा कप्पा जोडला आहे.
 */
async function renderFixturesTab(tId) {
  // =========================================================================
  // 📂 SECTION 1: DOM CHECK & PRO-LEVEL INITIAL LOADING STATE
  // =========================================================================
  const content = document.getElementById('tabContent');
  if (!content) return;

  content.innerHTML = `
    <div class="flex justify-center py-20 text-orange-500 animate-pulse text-[10px] font-black uppercase tracking-widest">
        मॅचेस शोधत आहे (Loading Fixtures)...
    </div>`;

  try {
    // =========================================================================
    // 📂 SECTION 2: FIRESTORE FIXTURES FETCH & EMPTY CHECK
    // =========================================================================
    const snapshot = await db.collection("tournaments").doc(tId).collection("matches").orderBy("matchNo").get();
    
    if (snapshot.empty) {
      content.innerHTML = `
        <div class="text-center py-16 bg-[#111] rounded-[2rem] border border-gray-800/60 px-4">
          <p class="text-gray-500 mb-5 text-xs font-bold uppercase tracking-wider">अजून फिक्स्चर्स / मॅचेस तयार केल्या नाहीत.</p>
          <button onclick="switchTab('details', '${tId}')" 
              class="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-tighter shadow-lg active:scale-95 transition-all">
              Details मध्ये जाऊन Template तयार करा
          </button>
        </div>
      `;
      return;
    }

    content.innerHTML = "";

    // =========================================================================
    // 📂 SECTION 3: LOOPING MATCHES & MASTER SCORECARD DISPLAY RESOLUTION
    // =========================================================================
    snapshot.forEach(doc => {
      const match = doc.data();
      const mId = doc.id;

      // अ. डेटाबेस स्टेटस तपासणी आणि कन्सोल लॉग्स
      const matchStatusFromDB = (match.status || match.match_status || "").trim();
      console.log(`🔍 [FIXTURE CARD LOAD]: Match #${match.matchNo} (ID: ${mId}) ➔ Database Status: "${matchStatusFromDB}"`);

      // ब. मास्टर स्कोरकार्ड रेझोल्युशन (scoreCard ऑब्जेक्टमधून स्कोअर ओढणे)
      const card = match.scoreCard || {
          mainMatch: { teamA: Number(match.scoreA || 0), teamB: Number(match.scoreB || 0) }
      };
      
      const displayScoreA = card.mainMatch.teamA;
      const displayScoreB = card.mainMatch.teamB;

      // क. दोन्ही टीम्स TBD किंवा BYE नसतील तरच स्टार्ट बटण दाखवण्यासाठी चेक
      const isReady = match.teamA !== "TBD" && match.teamB !== "TBD" && match.teamA !== "BYE" && match.teamB !== "BYE";


      // =========================================================================
      // 📂 SECTION 4: DYNAMIC ACTION BUTTON LOGIC (🎯 THE CRITICAL tId FIX)
      // =========================================================================
      let actionButtonHtml = "";

      if (matchStatusFromDB === "Finished") {
         console.log(`✅ [FIXTURE BLOCK]: Match #${match.matchNo} आधीच संपली आहे. 'View Summary' उपलब्ध केले.`);
         
         // 🚨 [💥 THE EXACT FIX]: viewMatchSummary च्या आत '${tId}' आणि '${mId}' दोन्ही अचूक पास केले!
            // फिक्स्चर टॅबच्या आत Finished मॅचसाठी बटण असं असावं:
            actionButtonHtml = `
                <button onclick="openSummaryModal('${tId}', '${mId}')" 
                    class="bg-slate-800 hover:bg-slate-750 text-zinc-400 border border-slate-700 text-[10px] px-4 py-2 rounded-xl font-black shadow-md transition-all active:scale-95 uppercase tracking-tighter">
                    🏁 View Summary
                </button>
            `;
      } else if (isReady) {
         console.log(`🏃‍♂️ [FIXTURE LIVE]: Match #${match.matchNo} नवीन/चालू आहे. 'Start Scoring' उपलब्ध केले.`);
         actionButtonHtml = `
            <button onclick="startScoring('${tId}', '${mId}')" 
                class="bg-orange-600 hover:bg-orange-700 text-white text-[10px] px-4 py-2 rounded-xl font-black shadow-[0_4px_12px_rgba(249,115,22,0.3)] transition-all active:scale-95 uppercase tracking-tighter italic">
              Start Scoring
            </button>
         `;
      } else {
         actionButtonHtml = `
            <span class="text-[8px] bg-orange-600/10 text-orange-500 border border-orange-500/20 px-2.5 py-1 rounded-lg font-black uppercase tracking-wider italic animate-pulse">
              ${match.teamA === "BYE" || match.teamB === "BYE" ? 'BYE Match' : 'Set Teams First'}
            </span>
         `;
      }


      // =========================================================================
      // 📂 SECTION 5: PURE DYNAMIC ORANGE/DARK KABADDI CARD HTML TEMPLATE
      // =========================================================================
      content.innerHTML += `
        <div class="bg-[#111] p-4 rounded-[2rem] border border-gray-800/80 mb-4 shadow-xl relative overflow-hidden group">
          
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-800/40">
            <div class="flex flex-col gap-0.5">
              <span class="text-[8px] bg-gray-950 text-orange-500 border border-gray-800 px-2 py-0.5 rounded-full font-black w-fit uppercase tracking-widest italic">
                ${match.round || 'Tournament'}
              </span>
              <span class="text-[10px] text-gray-500 font-bold font-mono">Match #${match.matchNo}</span>
            </div>
            
            <button onclick="openMatchSetter('${tId}', '${mId}')" 
                class="text-[9px] bg-gray-900 hover:bg-orange-600/10 hover:text-orange-500 text-gray-400 border border-gray-800 px-3 py-1.5 rounded-xl font-bold uppercase tracking-tighter transition-all active:scale-95 shadow-md">
              Set Team/Time
            </button>
          </div>

          <div class="flex justify-between items-center text-center py-2 relative">
            
            <div class="flex-1 min-w-[40%]">
              <p class="text-xs font-black text-white uppercase tracking-tighter truncate px-1">${match.teamA}</p>
              <p class="text-2xl font-black text-white mt-1.5 font-mono drop-shadow-md">${displayScoreA}</p>
            </div>
            
            <div class="px-2 shrink-0">
              <div class="text-[9px] bg-gray-950 text-orange-500/80 border border-gray-800 px-2.5 py-1 rounded-xl font-black uppercase tracking-wider shadow-inner group-hover:scale-110 transition-transform italic">
                VS
              </div>
            </div>
            
            <div class="flex-1 min-w-[40%]">
              <p class="text-xs font-black text-white uppercase tracking-tighter truncate px-1">${match.teamB}</p>
              <p class="text-2xl font-black text-white mt-1.5 font-mono drop-shadow-md">${displayScoreB}</p>
            </div>
            
          </div>

          <div class="mt-4 pt-3 border-t border-gray-800/60 flex justify-between items-center">
            <div class="text-[9px] text-gray-500 font-medium font-mono flex items-center gap-1">
              <span>📅</span> ${match.matchDate || 'Date TBD'} <span class="text-gray-700">|</span> <span>⏰</span> ${match.matchTime || 'Time TBD'}
            </div>
            
            <div>
              ${actionButtonHtml} 
            </div>
          </div>
          
        </div>
      `;
    });

  } catch (error) {
    console.error("[Fatal Error] renderFixturesTab failed:", error);
    content.innerHTML = `
      <div class='text-center text-red-500 py-16 bg-[#111] rounded-[2rem] border border-red-900/30 text-xs font-bold'>
        फिक्स्चर्स लोड करताना तांत्रिक चूक झाली.
      </div>`;
  }
}


/**
 * startScoring फंक्शन (स्कोअरिंग स्क्रीनकडे नेण्यासाठी)
हे फंक्शन स्कोअरिंग स्क्रीन लोड करेल आणि कोणत्या मॅचचे स्कोअरिंग करायचे आहे त्याचा आयडी पाठवेल.
 */
let matchSetupData = null;

/******** */
// async function startScoring(tId, mId) {
//     console.log("%c==================================================", "color: #f97316; font-weight: bold;");
//     console.log(`%c🚀 [START SCORING TRIGGERED]: 🔐 युनिक आयडी हायब्रिड तपासणी सुरू...`, "color: #f97316; font-weight: bold;");
//     console.log(`👉 Tournament ID : ${tId} | Match ID : ${mId}`);
//     console.log("%c==================================================", "color: #f97316; font-weight: bold;");
    
//     matchSetupData = { tId, mId };
//     currentEditingMatch = { tId, mId }; 
//     localStorage.setItem('squad_editing_match', JSON.stringify(currentEditingMatch));
    
//     try {
//         const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
        
//         if (!mDoc.exists) {
//             console.error(`🚨 [CRITICAL ERROR]: फायरबेसमध्ये टूर्नामेंट "${tId}" अंतर्गत मॅच "${mId}" सापडली नाही!`);
//             Swal.fire("त्रुटी", "मॅचचा डेटा सापडला नाही!", "error");
//             return;
//         }

//         const match = mDoc.data();
//         console.log("📦 [Firestore Fetch Success]: फायरबेसमधून आलेला मूळ डेटा:", match);

//         const idA = match.teamA_id;
//         const idB = match.teamB_id;
//         const dbStatus = (match.status || match.match_status || "").trim();

//         // 🎯 [STAGE RESTORE]: ५-५ (`five_raid`) आणि सुवर्ण मोड (`golden_raid`) असतानाही थेट पॅनेल री-लोड करणे
//         if (dbStatus === "Live" || dbStatus === "1st_Half_End" || dbStatus === "five_raid" || dbStatus === "golden_raid" || (match.teamAPlayers && match.teamAPlayers.length > 0)) {
//             console.log(`%c[STAGE RESTORE DETECTED] ➔ मॅच आधीच '${dbStatus}' आहे. थेट स्कोअरिंग पॅनल री-लोड करत आहे... 🏁`, "color: #22c55e; font-weight: bold;");
            
//             matchSetupData = {
//                 tId: tId,
//                 mId: mId,
//                 roundName: match.round || match.roundName || "League Match",
//                 scoreA: match.scoreA !== undefined ? Number(match.scoreA) : 0,
//                 scoreB: match.scoreB !== undefined ? Number(match.scoreB) : 0,
//                 teamAName: match.teamA,
//                 teamBName: match.teamB
//             };

//             localStorage.setItem(`active_match_${tId}_${mId}`, JSON.stringify(match));
//             localStorage.setItem('liveScoreA', matchSetupData.scoreA);
//             localStorage.setItem('liveScoreB', matchSetupData.scoreB);
            
//             const dbSeconds = (match.savedMatchTime !== undefined) ? match.savedMatchTime : 1200;
//             matchTotalSeconds = dbSeconds;
//             localStorage.setItem('savedMatchTime', dbSeconds);
            
//             window.isMatchPaused = true;
//             window.isFirstTimeStart = (dbSeconds == 1200);

//             // ५-५ आणि गोल्डन मोडचे मेमरी फ्लॅग्ज जागेवर ऑन करणे
//             if (dbStatus === "five_raid") window.isFiveRaidModeOn = true;
//             if (dbStatus === "golden_raid") { window.isFiveRaidModeOn = false; window.isGoldenRaidActiveNow = true; }

//             if (typeof socket !== 'undefined' && socket && socket.connected) {
//                 const initialPayload = {
//                     matchId: mId,
//                     tournamentId: tId,
//                     round: matchSetupData.roundName,
//                     teamA: matchSetupData.teamAName,
//                     scoreA: matchSetupData.scoreA,
//                     teamB: matchSetupData.teamBName,
//                     scoreB: matchSetupData.scoreB,
//                     status: dbStatus || "Live",
//                     lastRaid: match.lastRaid || null
//                 };
                
//                 socket.emit('match_status_changed_or_updated', initialPayload);
//             }

//             goToScoring(tId, mId); 

//             setTimeout(() => {
//                 const elA = document.getElementById('scoreA');
//                 const elB = document.getElementById('scoreB');
//                 if (elA) elA.innerText = matchSetupData.scoreA;
//                 if (elB) elB.innerText = matchSetupData.scoreB;

//                 // 🚨 [THE MASTER RESTORE FIX]: जर मेनू बदलून युझर परत आला आणि सामना ५-५ मोडवर असेल, 
//                 // तर तुझ्या मूळ 'startFiveRaidsSystem' फंक्शनला पुन्हा कॉल करणे, जेणेकरून जुनी बटणे आपोआप लपतील!
//                 if (dbStatus === "five_raid" && typeof startFiveRaidsSystem === "function") {
//                     console.log("⚙️ [RE-LOAD SYNC]: ५-५ मोड सुरू आहे, जुनी बटणे लपवण्यासाठी सिस्टीम री-इश्यू करत आहे...");
//                     startFiveRaidsSystem(matchSetupData.scoreA, matchSetupData.scoreB);
//                 }
//             }, 300);

//             return; 
//         }

//         console.log("🆕 [New Match Setup]: नवीन सामना आहे, खेळाडू निवड मोडल उघडत आहे.");
//         const modal = document.getElementById('startMatchModal');
//         const tossSelect = document.getElementById('tossWinner');
//         if (modal && tossSelect) {
//             tossSelect.innerHTML = `<option value="${idA}">${match.teamA}</option><option value="${idB}">${match.teamB}</option>`;
//             document.getElementById('tabBtnA').innerText = match.teamA;
//             document.getElementById('tabBtnB').innerText = match.teamB;
//             await renderSmartSquadSelector('playerListA', idA, 'A');
//             await renderSmartSquadSelector('playerListB', idB, 'B');
//             modal.classList.remove('hidden');
//             modal.classList.add('flex');
//             switchPlayerTab('A');
//         }

//     } catch (e) {
//         console.error("🚨 [startScoring FATAL CRASH]:", e);
//         Swal.fire("त्रुटी", "डेटा लोड करताना तांत्रिक चूक झाली.", "error");
//     }
// }

/**
 * 
 */
async function startScoring(tId, mId) {
    console.log("%c==================================================", "color: #f97316; font-weight: bold;");
    console.log(`%c🚀 [START SCORING TRIGGERED]: 🔐 युनिक आयडी हायब्रिड तपासणी सुरू...`, "color: #f97316; font-weight: bold;");
    console.log(`👉 Tournament ID : ${tId} | Match ID : ${mId}`);
    console.log("%c==================================================", "color: #f97316; font-weight: bold;");
    
    matchSetupData = { tId, mId };
    currentEditingMatch = { tId, mId }; 
    localStorage.setItem('squad_editing_match', JSON.stringify(currentEditingMatch));
    
    try {
        const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
        
        if (!mDoc.exists) {
            console.error(`🚨 [CRITICAL ERROR]: फायरबेसमध्ये टूर्नामेंट "${tId}" अंतर्गत मॅच "${mId}" सापडली नाही!`);
            Swal.fire("त्रुटी", "मॅचचा डेटा सापडला नाही!", "error");
            return;
        }

        const match = mDoc.data();
        console.log("📦 [Firestore Fetch Success]: फायरबेसमधून आलेला मूळ डेटा:", match);

        const idA = match.teamA_id;
        const idB = match.teamB_id;
        const dbStatus = (match.status || match.match_status || "").trim();

        const currentScoreCard = match.scoreCard || {
            mainMatch:  { teamA: Number(match.scoreA || 0), teamB: Number(match.scoreB || 0) },
            fiveRaid:   { teamA: 0, teamB: 0 },
            goldenRaid: { teamA: 0, teamB: 0 }
        };

        // 🎯 [STAGE RESTORE]: सामने पुन्हा उघडतानाचा रिस्टोर फ्लो
        if (dbStatus === "Live" || dbStatus === "1st_Half_End" || dbStatus === "five_raid" || dbStatus === "golden_raid" || (match.teamAPlayers && match.teamAPlayers.length > 0)) {
            console.log(`%c[STAGE RESTORE DETECTED] ➔ मॅच आधीच '${dbStatus}' आहे. मास्टर ऑब्जेक्टसह री-लोड करत आहे... 🏁`, "color: #22c55e; font-weight: bold;");
            
            matchSetupData = {
                tId: tId,
                mId: mId,
                roundName: match.round || match.roundName || "League Match",
                teamAName: match.teamA,
                teamBName: match.teamB,
                scoreCard: currentScoreCard
            };

            localStorage.setItem(`active_match_${tId}_${mId}`, JSON.stringify(match));
            localStorage.setItem('global_score_card', JSON.stringify(currentScoreCard));
            
            const dbSeconds = (match.savedMatchTime !== undefined) ? match.savedMatchTime : 1200;
            matchTotalSeconds = dbSeconds;
            localStorage.setItem('savedMatchTime', dbSeconds);
            
            window.isMatchPaused = true;
            window.isFirstTimeStart = (dbSeconds == 1200);

            // ५-५ आणि गोल्डन मोडचे मेमरी फ्लॅग्ज ऑन करणे
            if (dbStatus === "five_raid") window.isFiveRaidModeOn = true;
            if (dbStatus === "golden_raid") { window.isFiveRaidModeOn = false; window.isGoldenRaidActiveNow = true; }

            if (typeof socket !== 'undefined' && socket && socket.connected) {
                const initialPayload = {
                    matchId: mId,
                    tournamentId: tId,
                    round: matchSetupData.roundName,
                    teamA: matchSetupData.teamAName,
                    teamB: matchSetupData.teamBName,
                    status: dbStatus || "Live",
                    lastRaid: match.lastRaid || null,
                    scoreCard: currentScoreCard
                };
                
                console.log("📤 [SOCKET OUTGOING]: रिस्टोर करताना मास्टर ऑब्जेक्ट锁 सॉकेटवर पाठवला.");
                socket.emit('match_status_changed_or_updated', initialPayload);
            }

            goToScoring(tId, mId); 

            // 🎯 [UI DISPLAY DYNAMICS]: सामना ज्या मोडवर आहे, त्यानुसार स्क्रीनवर अचूक स्कोअर दाखवणे
            setTimeout(() => {
                const elA = document.getElementById('scoreA');
                const elB = document.getElementById('scoreB');
                
                let displayScoreA = currentScoreCard.mainMatch.teamA;
                let displayScoreB = currentScoreCard.mainMatch.teamB;

                // if (dbStatus === "five_raid") {
                //     displayScoreA = currentScoreCard.fiveRaid.teamA;
                //     displayScoreB = currentScoreCard.fiveRaid.teamB;
                // } else if (dbStatus === "golden_raid") {
                //     displayScoreA = currentScoreCard.goldenRaid.teamA;
                //     displayScoreB = currentScoreCard.goldenRaid.teamB;
                // }

                if (elA) elA.innerText = displayScoreA;
                if (elB) elB.innerText = displayScoreB;

                console.log(`📊 [UI SUCCESS]: स्क्रीनवर ${dbStatus} मोडचा स्कोअर (${displayScoreA}-${displayScoreB}) यशस्वीरित्या लोड झाला!`);

                // =============================================================
                // 🎯 [💥 THE WATERPROOF HYBRID CHECK SYSTEM]
                // =============================================================
                const raidTimeline = match.timeline || match.raidsHistory || [];

                if (dbStatus === "five_raid" && typeof startFiveRaidsSystem === "function") {
                    console.log("%c⚙️ [5-5 RECOVERY ROUTER]: ५-५ डेटा पडताळणी सुरू...", "background: #eab308; color: #000; font-weight: bold;");

                    // १. टाइमलाइन वरून ५-५ च्या एकूण किती रेड्स झाल्या आहेत ते मोजणे
                    const completedFiveRaids = raidTimeline.filter(r => r.matchStatus === "five_raid" || r.status === "five_raid");
                    const totalRaidsCount = completedFiveRaids.length;

                    console.log(`📋 [TIMELINE MATRIX]: आत्तापर्यंत झालेल्या ५-५ रेड्स संख्या ➔ ${totalRaidsCount}`);

                    // २. लोकल स्टोरेजमधील सेव्ह केलेला सिंगल मास्टर ऑब्जेक्ट बाहेर काढणे
                    const savedOrderRaw = localStorage.getItem(`five_raid_order_setup_${mId}`);
                    
                    if (savedOrderRaw) {
                        const parsedOrder = JSON.parse(savedOrderRaw);
                        window.fiveRaidOrderTeamA = parsedOrder.teamA_order || [];
                        window.fiveRaidOrderTeamB = parsedOrder.teamB_order || [];
                        console.log("✅ [ORDER RECOVERED]: लोकल स्टोरेजमधील मास्टर ऑब्जेक्ट यशस्वीरीत्या मेमरीमध्ये रिस्टोर केला!", parsedOrder);
                    } else {
                        console.warn("⚠️ [ORDER NOT FOUND]: 'five_raid_order_setup' ऑब्जेक्ट सापडला नाही, फ्रेश विजार्ड दाखवावा लागेल.");
                    }

                    // ३. आत्तापर्यंत झालेल्या रेड्सचा आकडा तुझा जुन्या सिस्टीम फंक्शनला पास करणे
                    // (जर एकूण रेड्स ० पेक्षा जास्त असतील तर विंडो बायपास करून थेट स्कोरिंग ग्राउंड ऑन होईल)
                    if (typeof window.fiveRaidCount !== 'undefined') {
                        window.fiveRaidCount = totalRaidsCount + 1; // पुढची रेड सेट केली
                    }
                    
                    startFiveRaidsSystem(totalRaidsCount);
                } 
                
                else if (dbStatus === "golden_raid") {
                    console.log("%c⚙️ [GOLDEN RAID RECOVERY ROUTER]: सुवर्ण रेड पडताळणी सुरू...", "background: #ef4444; color: #fff; font-weight: bold;");
                    
                    const completedGoldenRaids = raidTimeline.filter(r => r.matchStatus === "golden_raid" || r.status === "golden_raid");
                    console.log(`📋 [TIMELINE MATRIX]: आत्तापर्यंत झालेल्या गोल्डन रेड्स संख्या ➔ ${completedGoldenRaids.length}`);
                    
                    // समजा तुझ्याकडे गोल्डन रेड सुरू करण्यासाठी 'startGoldenRaidSystem' असेल:
                    if (typeof startGoldenRaidSystem === "function") {
                        startGoldenRaidSystem(completedGoldenRaids.length);
                    }
                }
                // =============================================================
                
            }, 300);

            return; 
        }

        console.log("🆕 [New Match Setup]: नवीन सामना आहे, खेळाडू निवड मोडल उघडत आहे.");
        const modal = document.getElementById('startMatchModal');
        const tossSelect = document.getElementById('tossWinner');
        if (modal && tossSelect) {
            tossSelect.innerHTML = `<option value="${idA}">${match.teamA}</option><option value="${idB}">${match.teamB}</option>`;
            document.getElementById('tabBtnA').innerText = match.teamA;
            document.getElementById('tabBtnB').innerText = match.teamB;
            await renderSmartSquadSelector('playerListA', idA, 'A');
            await renderSmartSquadSelector('playerListB', idB, 'B');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            switchPlayerTab('A');
        }

    } catch (e) {
        console.error("🚨 [startScoring FATAL CRASH]:", e);
        Swal.fire("त्रुटी", "डेटा लोड करताना तांत्रिक चूक झाली.", "error");
    }
}

/**नवीन renderSmartSquadSelector फंक्शन (app.js)
 * हे फंक्शन तुझ्या app.js मध्ये जोडून घे. 
 * हे फंक्शन टीमच्या ३०-५० खेळाडूंना मास्टर कलेक्शनमधून गोळा करेल 
 * आणि स्क्रीनवर फक्त १२ जणांची मॅच स्क्वॉड निवडण्यासाठी एक कडक चेकबॉक्स लिस्ट दाखवेल: 
 */
// ग्लोबल ऑब्जेक्ट्स निवडलेले खेळाडू ट्रॅक करण्यासाठी
window.selectedMatchSquadA = [];
window.selectedMatchSquadB = [];

// async function renderSmartSquadSelector(containerId, teamId, teamPrefix) {
//     const container = document.getElementById(containerId);
//     if (!container) return;

//     // 🧡 ऑरेंज थीम लोडिंग टेक्स्ट
//     container.innerHTML = `<p class="text-orange-500 text-[10px] text-center py-5 uppercase tracking-widest animate-pulse font-mono font-bold">डेटाबेसमधून खेळाडू शोधत आहे...</p>`;

//     const currentSeason = window.currentLoadedTeamData?.season || "2026-2027";

//     try {
//         console.log(`%c[१. स्क्वॉड सिलेक्टर]: ID -> "${teamId}" साठी खेळाडूंचा शोध सुरू...`, "color: #f97316; font-weight: bold;");
        
//         // 🟢 पायरी १: आधी नेहमीप्रमाणे थेट 'teamId' फील्ड मॅच करून खेळाडू शोधा (नवीन सिस्टीम आयडी नियम)
//         let snapshot = await db.collection("master_players")
//             .where(`seasons.${currentSeason}.teamId`, "==", teamId).get();

//         // 🟢 पायरी २ [बॅकअप सक्रिय]: जर खेळाडू सापडले नाहीत, तर जुन्या डेटासाठी 'registerId' फील्डमध्ये शोध घ्या!
//         if (snapshot.empty) {
//             console.log(`%c⚠️ [बॅकअप सक्रिय]: "teamId == ${teamId}" मध्ये खेळाडू सापडले नाहीत. आता "registerId == ${teamId}" साठी शोधत आहे...`, "color: #eab308;");
            
//             snapshot = await db.collection("master_players")
//                 .where(`seasons.${currentSeason}.registerId`, "==", teamId).get();
//         }

//         if (snapshot.empty) {
//             console.warn(`🚨 [ERR]: संघ आयडी "${teamId}" साठी कोणत्याही फील्डमध्ये खेळाडू सापडले नाहीत!`);
//             container.innerHTML = `<p class="text-orange-500 text-[10px] text-center py-5 font-bold uppercase font-mono">⚠️ या संघात (ID: ${teamId}) एकही खेळाडू नोंदणीकृत नाही!</p>`;
//             return;
//         }

//         console.log(`%c✅ [यशस्वी]: डेटाबेसमधून एकूण ${snapshot.size} खेळाडू अचूक सापडले!`, "color: #22c55e; font-weight: bold;");

//         // 🎯 [RAID X PURE ORANGE UI]: डबा उभी जागा कमी खाईल आणि पूर्णपणे मॅच होईल
//         let html = `
//         <div class="p-2 mb-2 bg-orange-950/20 rounded-xl border border-orange-500/10 flex items-center justify-between px-3.5 shrink-0 shadow-sm">
//             <span class="text-[9px] text-orange-400 font-black uppercase tracking-tight font-mono">🎯 पायरी १: १२ खेळाडू निवडा</span>
//             <div class="text-[9px] text-gray-400 font-bold font-mono">
//                 निवडले: <span id="count_${teamPrefix}" class="text-orange-500 font-black text-xs">0</span> <span class="text-gray-600">/ 12</span>
//             </div>
//         </div>
//         <div class="space-y-1.5 max-h-[52vh] overflow-y-auto pr-1 custom-scrollbar">`;

//         snapshot.forEach(doc => {
//             const player = doc.data();
//             const pId = doc.id; // खेळाडूचा सिस्टीम आयडी (उदा. RXO0QN)

//             html += `
//             <label class="flex justify-between items-center bg-[#0d0d0d] p-3 rounded-xl border border-gray-900 hover:border-gray-800 cursor-pointer transition-all gap-2 group">
//                 <div class="flex items-center gap-3 min-w-0 flex-1">
//                     <input type="checkbox" name="squad_check_${teamPrefix}" value="${pId}" data-name="${player.name}"
//                         onchange="handleSquadSelection('${teamPrefix}')"
//                         class="w-4 h-4 rounded bg-gray-950 border-gray-800 text-orange-600 focus:ring-0 accent-orange-500 cursor-pointer">
//                     <div class="leading-tight truncate">
//                         <p class="text-xs font-bold text-gray-200 uppercase truncate group-hover:text-orange-400 transition-colors">${player.name}</p>
//                         <p class="text-[8px] text-gray-500 font-mono font-bold mt-0.5 tracking-tight">🔑 ID: ${pId} | 📞 ${player.mobile || '------'} | 🛡️ ${player.skill || 'NA'}</p>
//                     </div>
//                 </div>
//             </label>`;
//         });

//         html += `</div>
//         <div id="playingDecisionContainer_${teamPrefix}" class="mt-4 hidden space-y-2 border-t border-gray-900 pt-3">
//         </div>`;

//         container.innerHTML = html;

//     } catch (err) {
//         console.error("🚨 [सिएक्वेक्टर क्रिटिकल एरर]: खेळाडू लोड करताना अडचण आली:", err);
//         container.innerHTML = `<p class="text-red-500 text-[10px] text-center py-5 font-mono">खेळाडू लोड करताना एरर आला.</p>`;
//     }
// }


// 🎯 १. मास्टर खेळाडूंची यादी दाखवणारे अल्ट्रा-कॉम्पॅक्ट फंक्शन
async function renderSmartSquadSelector(containerId, teamId, teamPrefix) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`🚨 [DOM Error]: #${containerId} हा कंटेनर सापडला नाही!`);
        return;
    }

    // 🔍 [लॉग १]: डेटा ओढण्याची प्रोसेस सुरू
    console.log(`%c==================================================`, "color: #f97316; font-weight: bold;");
    console.log(`🏃‍♂️ [Squad Selector Initiated] ➔ टीम: "${teamPrefix}" | ID: "${teamId}" साठी खेळाडू गोळा करत आहे...`);
    console.log(`%c==================================================`, "color: #f97316; font-weight: bold;");

    container.innerHTML = `<p class="text-orange-500 text-[10px] text-center py-5 uppercase tracking-widest animate-pulse font-mono font-bold">लोड होत आहे...</p>`;
    const currentSeason = window.currentLoadedTeamData?.season || "2026-2027";

    try {
        let snapshot = await db.collection("master_players").where(`seasons.${currentSeason}.teamId`, "==", teamId).get();
        if (snapshot.empty) {
            console.log(`%cℹ️ [बॅकअप क्वेरी सक्रिय]: 'teamId' मध्ये डेटा नाही, आता 'registerId' तपासत आहे...`, "color: #eab308;");
            snapshot = await db.collection("master_players").where(`seasons.${currentSeason}.registerId`, "==", teamId).get();
        }

        if (snapshot.empty) {
            console.warn(`⚠️ [Data Warning]: संघ आयडी "${teamId}" साठी एकही खेळाडू सापडला नाही!`);
            container.innerHTML = `<p class="text-orange-500 text-[9px] text-center py-5 font-bold">⚠️ संघात खेळाडू सापडले नाहीत!</p>`;
            return;
        }

        console.log(`%c📊 [Data Success]: डेटाबेसमधून एकूण ${snapshot.size} खेळाडू अचूक मिळाले!`, "color: #22c55e; font-weight: bold;");
        let html = ``;

        snapshot.forEach(doc => {
            const player = doc.data();
            const pId = doc.id;
            const role = player.skill || player.role || "Raid";
            const roleIcon = role.toLowerCase().includes('raid') ? '🏃‍♂️' : '🛡️';

            html += `
            <div id="pcard_${pId}" class="flex justify-between items-center bg-[#0d0d0d] p-1 px-2.5 rounded-lg border border-gray-900 transition-all gap-2 hover:border-gray-800">
                <div class="min-w-0 flex-1 leading-none">
                    <p class="text-[10px] font-black text-gray-200 uppercase truncate">${player.name}</p>
                    <p class="text-[8px] text-gray-600 font-mono font-bold mt-0.5">${roleIcon} ${role.toUpperCase()}</p>
                </div>
                
                <div class="flex items-center gap-1 shrink-0">
                    <label class="cursor-pointer">
                        <input type="radio" name="status_${pId}" value="Playing" 
                               onchange="updateSquadLiveCounts('${teamPrefix}')" data-pid="${pId}" data-name="${player.name}"
                               class="peer hidden">
                        <span class="text-[8px] font-black px-2 py-1 rounded bg-black border border-gray-900 text-gray-600 peer-checked:bg-green-600/10 peer-checked:border-green-500/40 peer-checked:text-green-400 block transition-all font-mono">PLAY</span>
                    </label>
                    <label class="cursor-pointer">
                        <input type="radio" name="status_${pId}" value="Bench" 
                               onchange="updateSquadLiveCounts('${teamPrefix}')" data-pid="${pId}" data-name="${player.name}"
                               class="peer hidden">
                        <span class="text-[8px] font-black px-2 py-1 rounded bg-black border border-gray-900 text-gray-600 peer-checked:bg-orange-600/10 peer-checked:border-orange-500/40 peer-checked:text-orange-400 block transition-all font-mono">BENCH</span>
                    </label>
                    <button onclick="resetPlayerSelection('${pId}', '${teamPrefix}')" class="p-1 text-[8px] bg-black text-gray-700 border border-gray-900 rounded hover:text-red-500 transition-colors font-mono">✕</button>
                </div>
            </div>`;
        });

        container.innerHTML = html;
        
        // मोडल उघडताना सुरुवातीला वरचा प्रिव्ह्यू रेंडर रिसेट करा
        if(teamPrefix === 'A') {
            console.log("[Initial Render] Default Team A प्रिव्ह्यू लोड करत आहे...");
            updateSquadLiveCounts('A');
        }

    } catch (err) {
        console.error("🚨 [Smart Selector Critical Error]:", err);
    }
}

// 📊 २. [THE MASTER UX]: सिलेक्ट केलेल्या खेळाडूंना वरती टॅगच्या रूपात रेंडर करणे
function updateSquadLiveCounts(teamPrefix) {
    const container = document.getElementById(teamPrefix === 'A' ? 'playerListA' : 'playerListB');
    const rackPlaying = document.getElementById('rack_playing');
    const rackBench = document.getElementById('rack_bench');
    
    if (!container || !rackPlaying || !rackBench) {
        console.error("🚨 [UX Error]: रेंडरिंग रॅक्स किंवा प्लेयर लिस्ट DOM मध्ये सापडली नाही!");
        return;
    }

    // सर्व सिलेक्ट केलेले रेडिओ बट्स मिळवा
    const selectedRadios = container.querySelectorAll(`input[type="radio"]:checked`);
    
    console.log(`%c[Live Tracker Event]: Team ${teamPrefix} मधून बदल ट्रॅक झाला... 🎯`, "color: #06b6d4; font-weight: bold;");
    
    let playingHTML = "";
    let benchHTML = "";
    let pCount = 0;
    let bCount = 0;

    selectedRadios.forEach(radio => {
        const pId = radio.getAttribute('data-pid');
        const pName = radio.getAttribute('data-name');
        const val = radio.value; // "Playing" किंवा "Bench"

        if (val === 'Playing') {
            pCount++;
            playingHTML += `
                <div class="flex items-center bg-green-950/40 border border-green-500/30 px-1.5 py-0.5 rounded-md text-[9px] font-black text-gray-200 uppercase tracking-tighter animate-scaleIn">
                    ${pName}
                </div>`;
        } else if (val === 'Bench') {
            bCount++;
            benchHTML += `
                <div class="flex items-center bg-orange-950/40 border border-orange-500/30 px-1.5 py-0.5 rounded-md text-[9px] font-black text-gray-200 uppercase tracking-tighter animate-scaleIn">
                    ${pName}
                </div>`;
        }
    });

    // 🚨 [कडक नियम तपासणी - ७ Playing आणि ५ Bench मर्यादा व्हॅलिडेशन]
    if (window.event && window.event.target) {
        const clickedRadio = window.event.target;
        
        if (clickedRadio.value === 'Playing' && pCount > 7) {
            console.warn(`%c❌ [Denied]: Playing मर्यादा संपली! ७ पेक्षा जास्त खेळाडू निवडण्याचा प्रयत्न.`, "color: #ef4444; font-weight: bold;");
            Swal.fire({ icon: 'warning', title: 'प्लेइंग मर्यादा संपली!', text: 'तुम्ही ७ पेक्षा जास्त खेळाडू Playing निवडू शकत नाही.', timer: 1500, showConfirmButton: false });
            clickedRadio.checked = false; // अनचेक करा
            updateSquadLiveCounts(teamPrefix); // पुन्हा रिकलकुलेट
            return;
        }
        
        if (clickedRadio.value === 'Bench' && bCount > 5) {
            console.warn(`%c❌ [Denied]: Bench मर्यादा संपली! ५ पेक्षा जास्त खेळाडू निवडण्याचा प्रयत्न.`, "color: #ef4444; font-weight: bold;");
            Swal.fire({ icon: 'warning', title: 'बेंच मर्यादा संपली!', text: 'तुम्ही ५ पेक्षा जास्त खेळाडू Bench निवडू शकत नाही.', timer: 1500, showConfirmButton: false });
            clickedRadio.checked = false; // अनचेक करा
            updateSquadLiveCounts(teamPrefix); // पुन्हा रिकलकुलेट
            return;
        }
    }

    // 🔍 [लाईव्ह स्नॅपशॉट कन्सोल लॉग]: रॅकमध्ये डेटा जाण्यापूर्वीची लाईव्ह स्थिती
    console.log(`   ↳ 🟢 Playing Count: ${pCount} / 7 | 🟠 Bench Count: ${bCount} / 5 | 📈 एकूण: ${pCount + bCount} / 12`);

    // वरच्या रॅक्समध्ये लहान चिप्स रेंडर करा
    rackPlaying.innerHTML = pCount === 0 ? `<p class="text-[8px] text-gray-700 italic font-bold">७ खेळाडू निवडा...</p>` : playingHTML;
    rackBench.innerHTML = bCount === 0 ? `<p class="text-[8px] text-gray-700 italic font-bold">५ राखीव निवडा...</p>` : benchHTML;

    // मास्टर लेबल आणि कलर्स स्लिकली अपडेट करा
    const totalCount = pCount + bCount;
    const labelEl = document.getElementById('count_label');
    if (labelEl) {
        labelEl.innerHTML = `P: <span class="${pCount === 7 ? 'text-green-400' : 'text-white'} font-black">${pCount}/7</span> | B: <span class="${bCount === 5 ? 'text-orange-400' : 'text-white'} font-black">${bCount}/5</span> | एकूण: <span class="text-orange-500 font-black">${totalCount}/12</span>`;
    }
}

// 🧼 ३. खेळाडूची निवड अनसिलेक्ट (Reset) करण्याचे कडक फंक्शन
function resetPlayerSelection(pId, teamPrefix) {
    console.log(`%c🧹 [Reset Player]: ID ➔ "${pId}" ची निवड रद्द केली.`, "color: #eab308;");
    const radios = document.querySelectorAll(`input[name="status_${pId}"]`);
    radios.forEach(r => r.checked = false);
    
    // लाइव्ह मोजणी पुन्हा सुरू करा
    updateSquadLiveCounts(teamPrefix);
}

/** */

// 🏃‍♂️ [RAID X SQUAD TRACKER]: खेळाडू निवडल्यावर मोजणी आणि व्हॅलिडेशन करणारे फंक्शन
function handleSquadSelection(teamPrefix) {
    // १. चालू टॅबमधील सर्व सिलेक्टेड चेकबॉक्स गोळा करा
    const checkboxes = document.querySelectorAll(`input[name="squad_check_${teamPrefix}"]:checked`);
    const count = checkboxes.length;

    console.log(`%c[Squad Selection - Team ${teamPrefix}]: निवडलेले खेळाडू संख्या ➔ ${count}`, "color: #f97316; font-weight: bold;");

    // २. फ्रंटएंड स्क्रीनवर असलेला आकडा (Count) लाईव्ह अपडेट करा
    const countElement = document.getElementById(`count_${teamPrefix}`);
    if (countElement) {
        countElement.innerText = count;
        
        // जर बरोबर १२ खेळाडू झाले तर आकडा हिरवा करा, जास्त झाले तर लाल करा
        if (count === 12) {
            countElement.className = "text-green-500 font-black text-xs animate-pulse";
        } else if (count > 12) {
            countElement.className = "text-red-500 font-black text-sm";
        } else {
            countElement.className = "text-orange-500 font-black text-xs";
        }
    }

    // ३. 🚨 [कडक व्हॅलिडेशन]: जर स्कोररने चुकीने १२ पेक्षा जास्त खेळाडू निवडले, तर त्याला लगेच थांबवा!
    if (count > 12) {
        Swal.fire({
            icon: 'warning',
            title: 'मर्यादा संपली!',
            text: 'मॅच स्क्वॉडसाठी तुम्ही एका संघातून जास्तीत जास्त १२ खेळाडूच निवडू शकता.',
            confirmButtonColor: '#f97316'
        });
        
        // क्लिक केलेला शेवटचा चेकबॉक्स अनचेक (Uncheck) करा जेणेकरून संख्या १२ वरच राहील
        // (यासाठी इव्हेंट ट्रॅक न करता आपण थेट शेवटच्या चेकबॉक्सला अनचेक करू शकतो)
        if (window.event && window.event.target) {
            window.event.target.checked = false;
            // पुन्हा एकदा काउंट रिसेट करा
            const recalculatedCheckboxes = document.querySelectorAll(`input[name="squad_check_${teamPrefix}"]:checked`);
            if (countElement) countElement.innerText = recalculatedCheckboxes.length;
        }
    }
}


/** */
// जुनी नावे पुन्हा भरण्यासाठी सपोर्टिंग फंक्शन
function fillSavedPlayers(data) {
    if (data.playersA) {
        data.playersA.forEach((name, index) => {
            const input = document.querySelector(`#playerListA input:nth-child(${index + 1})`);
            if (input) input.value = name;
        });
    }
    if (data.playersB) {
        data.playersB.forEach((name, index) => {
            const input = document.querySelector(`#playerListB input:nth-child(${index + 1})`);
            if (input) input.value = name;
        });
    }
}

// टॅब बदलण्यासाठी
function switchPlayerTab(team) {
    const listA = document.getElementById('playerListA');
    const listB = document.getElementById('playerListB');
    const btnA = document.getElementById('tabBtnA');
    const btnB = document.getElementById('tabBtnB');

    if (team === 'A') {
        listA.classList.remove('hidden');
        listB.classList.add('hidden');
        btnA.classList.add('border-green-600', 'text-white');
        btnB.classList.remove('border-green-600', 'text-white');
        btnB.classList.add('text-gray-500');
    } else {
        listB.classList.remove('hidden');
        listA.classList.add('hidden');
        btnB.classList.add('border-green-600', 'text-white');
        btnA.classList.remove('border-green-600', 'text-white');
        btnA.classList.add('text-gray-500');
    }
   
}


// प्लेयर्स रेंडर करण्यासाठी (नंबर आणि नावासाठी वेगळे इनपुट)
function renderPlayerInputs(containerId, prefix) {
    const container = document.getElementById(containerId);
    if (!container) return; 
    container.innerHTML = "";
    
    console.log(`>>> [RENDER_SETUP] Generating 12 inputs for Team ${prefix}`);

    for (let i = 1; i <= 12; i++) {
        let defaultNo = (prefix === 'A') ? i : (i + 20);
        let isP7 = i <= 7;

        container.innerHTML += `
            <div class="flex items-center gap-2 bg-gray-800/30 p-1 rounded-lg border border-gray-800">
                <input type="checkbox" 
                    id="${prefix}P${i}_check" 
                    class="player-check-${prefix} w-4 h-4 ml-2" 
                    ${isP7 ? 'checked' : ''} 
                    onchange="handleSetupRoleChange('${prefix}', ${i})">
                
                <input type="number" id="${prefix}P${i}_no" 
                    value="${defaultNo}" 
                    class="w-12 bg-gray-900 text-white text-[11px] p-2 rounded-lg border border-gray-700 text-center font-bold">
                
                <input type="text" id="${prefix}P${i}_name" 
                    placeholder="Player Name" 
                    class="flex-1 bg-gray-900 text-white text-[11px] p-2 rounded-lg border border-gray-700">
                
                <span id="${prefix}P${i}_role_label" class="text-[8px] font-bold px-2 ${isP7 ? 'text-green-500' : 'text-gray-500'} w-8">
                    ${isP7 ? 'P7' : 'SUB'}
                </span>
            </div>
        `;
    }
    console.log(`    [SUCCESS] Finished rendering Team ${prefix}. Default P7 count: 7`);
}

function handleSetupRoleChange(prefix, index) {
    console.log(`--- [SETUP_CLICK] Team: ${prefix} | Index: ${index} ---`);
    
    const checkbox = document.getElementById(`${prefix}P${index}_check`);
    const label = document.getElementById(`${prefix}P${index}_role_label`);
    
    // सिलेक्ट केलेल्या खेळाडूंची मोजणी
    const checkedCount = document.querySelectorAll(`.player-check-${prefix}:checked`).length;
    console.log(`[COUNT_CHECK] Team ${prefix} checked count: ${checkedCount}`);

    if (checkedCount > 7 && checkbox.checked) {
        console.warn(`[RESTRICTION] User tried to select 8th player. Blocking!`);
        Swal.fire({
            title: "मर्यादा!",
            text: "एका टीममध्ये फक्त ७ 'Playing' खेळाडू असू शकतात.",
            icon: "warning",
            background: '#111',
            color: '#fff'
        });
        checkbox.checked = false;
        return;
    }

    // UI अपडेटचे लॉग्स
    if (checkbox.checked) {
        label.innerText = "P7";
        label.classList.replace('text-gray-500', 'text-green-500');
        console.log(`[ROLE_CHANGE] Player ${index} marked as P7`);
    } else {
        label.innerText = "SUB";
        label.classList.replace('text-green-500', 'text-gray-500');
        console.log(`[ROLE_CHANGE] Player ${index} marked as SUB`);
    }
}

/** */

function closeStartMatchModal() {
    document.getElementById('startMatchModal').classList.add('hidden');
}

/** */
// async function confirmStartMatch() {
//     console.log("%c--- 🚀 [START_MATCH_PROCESS] फायनल व्हॅलिडेशन सुरू ---", "color: #f97316; font-weight: bold;");
    
//     // १. चालू मॅचचा संदर्भ मिळवा
//     if (!currentEditingMatch) {
//         console.error("🚨 [मॅच सुरू एरर]: currentEditingMatch चा डेटा मेमरीमध्ये सापडला नाही!");
//         const backupMatch = localStorage.getItem('squad_editing_match');
//         if (backupMatch) {
//             currentEditingMatch = JSON.parse(backupMatch);
//             console.log("%c✅ [Backup Recovered]: LocalStorage मधून मॅच संदर्भ यशस्वीरित्या परत मिळवला!", "color: #22c55e; font-weight: bold;");
//         } else {
//             console.error("🚨 [Fatal Error]: कुठेही मॅचचा आयडी सापडला नाही!");
//             Swal.fire({
//                 icon: "error",
//                 title: "संदर्भ सापडला नाही!",
//                 text: "मॅचचा आयडी मेमरीमधून उडाला आहे. कृपया मोडल बंद करून पुन्हा 'Start Scoring' वर क्लिक करा.",
//                 background: '#111',
//                 color: '#fff',
//                 confirmButtonColor: '#f97316'
//             });
//             return;
//         }
//     }

//     const { tId, mId } = currentEditingMatch;

//     // २. [DATA COLLECTION]: दोन्ही टीमचा सिलेक्टेड डेटा मिळवा
//     const playersA = getPlayersData('A'); 
//     const playersB = getPlayersData('B');

//     // ३. [STRICT TOTAL COUNT CHECK - नियम १२ खेळाडूंचा]:
//     if (playersA.length !== 12 || playersB.length !== 12) {
//         console.warn(`❌ [DENIED]: मॅच ब्लॉक! खेळाडूंची संख्या १२ नाही. (A: ${playersA.length}, B: ${playersB.length})`);
//         Swal.fire({
//             title: "खेळाडू संख्या चुकीची!",
//             text: `PRO-KABADDI नियमांनुसार मॅच सुरू करण्यासाठी प्रत्येक संघातून तंतोतंत १२ खेळाडू निवडणे बंधनकारक आहे! (सध्या तुमच्या निवडीनुसार ➔ Team A: ${playersA.length}, Team B: ${playersB.length})`,
//             icon: "error",
//             background: '#111',
//             color: '#fff',
//             confirmButtonColor: '#f97316'
//         });
//         return;
//     }

//     // ४. [STRICT PLAYING & BENCH CHECK - नियम ७ प्लेइंग आणि ५ बेंच]:
//     const playingA = playersA.filter(p => p.playingStatus === "Playing").length;
//     const benchA = playersA.filter(p => p.playingStatus === "Bench").length;
    
//     const playingB = playersB.filter(p => p.playingStatus === "Playing").length;
//     const benchB = playersB.filter(p => p.playingStatus === "Bench").length;

//     if (playingA !== 7 || playingB !== 7 || benchA !== 5 || benchB !== 5) {
//         console.warn(`❌ [DENIED]: मॅच ब्लॉक! ७ Playing आणि ५ Bench चा कोटा मॅच होत नाहीये.`);
//         Swal.fire({
//             title: "स्क्वॉड रचना चुकली!",
//             text: `मॅचसाठी प्रत्येक संघात ७ Playing आणि ५ Bench खेळाडू असणे अनिवार्य आहे! (सध्या ➔ Team A: ${playingA} Playing + ${benchA} Bench | Team B: ${playingB} Playing + ${benchB} Bench)`,
//             icon: "error",
//             background: '#111',
//             color: '#fff',
//             confirmButtonColor: '#f97316'
//         });
//         return;
//     }

//     // ५. [STRICT NAME VALIDATION]: सर्व नावे भरलेली आहेत ना याची शेवटची तपासणी
//     const hasEmptyA = playersA.some(p => !p.name || p.name.trim() === "");
//     const hasEmptyB = playersB.some(p => !p.name || p.name.trim() === "");

//     if (hasEmptyA || hasEmptyB) {
//         console.warn("❌ [DENIED]: नावे रिकामी आहेत.");
//         Swal.fire({ title: "नावे अनिवार्य!", text: "निवडलेल्या सर्व १२ खेळाडूंची खरी नावे डेटाबेसमध्ये असणे आवश्यक आहे.", icon: "error", background: '#111', color: '#fff' });
//         return;
//     }

//     console.log("✅ [WHALIDATION SUCCESS]: दोन्ही टीम्सचे १२ खेळाडू (७ Playing + 5 Bench) शंभर टक्के चोख आहेत!");

//     // ६. टॉस आणि सिलेक्शन व्हॅल्यूज मिळवा
//     const tossWinner = document.getElementById('tossWinner').value;
//     const selection = document.getElementById('tossSelection').value;

//     if (tossWinner === "TBD") {
//         Swal.fire({ title: "टॉस विनर निवडा!", text: "मॅच सुरू करण्यापूर्वी टॉस कोणी जिंकला ते निवडणे आवश्यक आहे.", icon: "warning", background: '#111', color: '#fff', confirmButtonColor: '#f97316' });
//         return;
//     }

//     try {
//         console.log("☁️ [DATABASE]: फायरस्टोअरमधून मॅचचे मूळ तपशील मिळवत आहे...");
//         const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
//         const match = mDoc.data();
        
//         // पहिल्या रेडरचे कडक लॉजिक
//         let firstRaidBy = (selection === "Raid") ? tossWinner : (tossWinner === match.teamA ? match.teamB : match.teamA);

//         // ७. [HYBRID-DATA]: पूर्ण मॅच ऑब्जेक्ट तयार करा (Status "Live")
//         const updateData = {
//             tId: tId,
//             mId: mId,
//             teamAName: match.teamA,
//             teamBName: match.teamB,
//             teamA_id: match.teamA_id || "", 
//             teamB_id: match.teamB_id || "", 
//             status: "Live",        
//             savedMatchTime: 1200,          // ☁️ डेटाबेसमध्ये फ्रेश २० मिनिटे लॉक
//             isMatchPaused: true,           // सुरुवातीला टायमर पॉज असेल
//             isFirstTimeStart: true,         
//             tossWinner: tossWinner,
//             tossSelection: selection,
//             firstRaidBy: firstRaidBy,
//             currentRaider: firstRaidBy,
//             teamAPlayers: playersA,         
//             teamBPlayers: playersB,         
//             scoreA: 0,
//             scoreB: 0,
//             timeoutsA: 0,
//             timeoutsB: 0,
//             matchLog: [],
//             lastUpdated: new Date().getTime()
//         };

//         // ८. [HYBRID-SAVE]: LocalStorage मध्ये स्नॅपशॉट सेव्ह करा 📦
//         console.log("📦 [HYBRID-LOCAL]: सुरक्षिततेसाठी LocalStorage मध्ये डेटा जतन करत आहे...");
//         localStorage.setItem(`active_match_${mId}`, JSON.stringify(updateData));
        
//         // 🔐 [अल्टीमेट टायमर फिक्स]: जुना कचरा टाईम इथल्या इथे साफ करून कडकडीत १२०० सेकंद टाका!
//         localStorage.setItem('savedMatchTime', 1200);
        
//         // ग्लोबल मेमरी स्टेट्स सक्तीने फ्रेश मॅचसाठी री-सेट करा
//         window.isMatchPaused = true;
//         window.isFirstTimeStart = true;
//         if (typeof matchTotalSeconds !== 'undefined') matchTotalSeconds = 1200; // मुख्य टायमर रिसेट 🎯

//         // ९. [HYBRID-SAVE]: Firestore मध्ये सिंक करा ☁️
//         console.log("☁️ [HYBRID-CLOUD]: फायरस्टोअर क्लाउडमध्ये डेटा सिंक करत आहे...");
//         await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update(updateData);
        
//         // 🎯 [NEW SOCKET EMIT]: सामना सुरू झालाय, पूर्ण डेटा सर्व्हर मेमरीकडे रवाना करा (0 Reads Cost!)
//         if (typeof socket !== 'undefined' && socket && socket.connected) {
//             socket.emit('match_status_changed_or_updated', updateData);
//             console.log("%c🚀 [Socket Emit Success]: फ्रेश सामना सर्व्हरच्या मेमरीत लाईव्ह रजिस्टर्ड केला!", "color: #22c55e; font-weight: bold;");
//         }

//         console.log("%c--- 🎉 [MATCH_LIVE] मॅच अधिकृतपणे लाईव्ह झाली आहे आणि ठेवा सेटअप लॉक झाला! 🚀 ---", "background: #22c55e; color: #fff; font-weight: bold; padding: 4px;");
        
//         closeStartMatchModal();
        
//         await Swal.fire({
//             title: "Match Live! 🔥",
//             text: "१२ खेळाडूंची नावे नोंदवली आहेत. मॅच सुरू होत आहे!",
//             icon: "success",
//             background: '#111',
//             color: '#fff',
//             timer: 1500,
//             showConfirmButton: false
//         });

//         // १०. स्कोअरिंग स्क्रीनवर रिडायरेक्ट करा
//         console.log(`🏁 [REDIRECT]: स्कोअरिंग विंडो उघडत आहे (goToScoring)...`);
//         goToScoring(tId, mId);

//     } catch (e) {
//         console.error("🚨 [CRITICAL_ERROR] मॅच लाईव्ह करताना मोठी अडचण आली:", e);
//         Swal.fire({ title: "Error", text: "डेटा अपडेट करताना तांत्रिक अडचण आली.", icon: "error", background: '#111', color: '#fff' });
//     }
// }

/******** scoreA ** scoreB ** */
// async function confirmStartMatch() {
//     console.log("%c--- 🚀 [START_MATCH_PROCESS] फायनल व्हॅलिडेशन सुरू ---", "color: #f97316; font-weight: bold;");
    
//     if (!currentEditingMatch) {
//         const backupMatch = localStorage.getItem('squad_editing_match');
//         if (backupMatch) {
//             currentEditingMatch = JSON.parse(backupMatch);
//         } else {
//             Swal.fire({
//                 icon: "error", title: "संदर्भ सापडला नाही!",
//                 text: "मॅचचा आयडी मेमरीमधून उडाला आहे. कृपया पुन्हा 'Start Scoring' वर क्लिक करा.",
//                 background: '#111', color: '#fff', confirmButtonColor: '#f97316'
//             });
//             return;
//         }
//     }

//     const { tId, mId } = currentEditingMatch;

//     const playersA = getPlayersData('A'); 
//     const playersB = getPlayersData('B');

//     if (playersA.length !== 12 || playersB.length !== 12) {
//         Swal.fire({
//             title: "खेळाडू संख्या चुकीची!",
//             text: `PRO-KABADDI नियमांनुसार प्रत्येक संघातून १२ खेळाडू निवडणे बंधनकारक आहे! (Team A: ${playersA.length}, Team B: ${playersB.length})`,
//             icon: "error", background: '#111', color: '#fff', confirmButtonColor: '#f97316'
//         });
//         return;
//     }

//     const playingA = playersA.filter(p => p.playingStatus === "Playing").length;
//     const benchA = playersA.filter(p => p.playingStatus === "Bench").length;
//     const playingB = playersB.filter(p => p.playingStatus === "Playing").length;
//     const benchB = playersB.filter(p => p.playingStatus === "Bench").length;

//     if (playingA !== 7 || playingB !== 7 || benchA !== 5 || benchB !== 5) {
//         Swal.fire({
//             title: "स्क्वॉड रचना चुकली!",
//             text: `मॅचसाठी प्रत्येक संघात ७ Playing आणि ५ Bench खेळाडू असणे अनिवार्य आहे!`,
//             icon: "error", background: '#111', color: '#fff', confirmButtonColor: '#f97316'
//         });
//         return;
//     }

//     const tossWinner = document.getElementById('tossWinner').value;
//     const selection = document.getElementById('tossSelection').value;

//     if (tossWinner === "TBD") {
//         Swal.fire({ title: "टॉस विनर निवडा!", text: "मॅच सुरू करण्यापूर्वी टॉस निवडा.", icon: "warning", background: '#111', color: '#fff', confirmButtonColor: '#f97316' });
//         return;
//     }

//     try {
//         const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
//         const match = mDoc.data();
        
//         let firstRaidBy = (selection === "Raid") ? tossWinner : (tossWinner === match.teamA ? match.teamB : match.teamA);

//         const updateData = {
//             tId: tId, mId: mId,
//             teamAName: match.teamA, teamBName: match.teamB,
//             teamA_id: match.teamA_id || "", teamB_id: match.teamB_id || "", 
//             status: "Live", savedMatchTime: 1200, isMatchPaused: true, isFirstTimeStart: true,         
//             tossWinner: tossWinner, tossSelection: selection, firstRaidBy: firstRaidBy, currentRaider: firstRaidBy,
//             teamAPlayers: playersA, teamBPlayers: playersB, 
//             scoreA: 0, scoreB: 0, timeoutsA: 0, timeoutsB: 0, matchLog: [],
//             lastUpdated: new Date().getTime()
//         };

//         // 🚨 [HYBRID KEY SAVE]: फ्रेश मॅच सुरू होतानाच युनिक हायब्रिड की मध्ये डेटा जतन करणे!
//         localStorage.setItem(`active_match_${tId}_${mId}`, JSON.stringify(updateData));
//         localStorage.setItem('savedMatchTime', 1200);
        
//         window.isMatchPaused = true;
//         window.isFirstTimeStart = true;
//         if (typeof matchTotalSeconds !== 'undefined') matchTotalSeconds = 1200; 

//         await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update(updateData);
        
//         if (typeof socket !== 'undefined' && socket && socket.connected) {
//             socket.emit('match_status_changed_or_updated', updateData);
//         }

//         closeStartMatchModal();
        
//         await Swal.fire({ title: "Match Live! 🔥", text: "मॅच सुरू होत आहे!", icon: "success", background: '#111', color: '#fff', timer: 1500, showConfirmButton: false });

//         goToScoring(tId, mId);

//     } catch (e) {
//         console.error("🚨 [confirmStartMatch Error]:", e);
//     }
// }

/**
 *  यात आपण जुन्या scoreA: 0, scoreB: 0 या सुट्या दोन फील्ड्स काढून तिथं आपला कडक scoreCard ऑब्जेक्ट बसवला आहे, 
 * आणि सोबतच कन्सोल लॉग्स एकदम तंतोतंत ठेवले आहेत जेणेकरून Inspect -> Console मध्ये तुला प्रत्येक हालचाल स्वच्छ दिसेल.
 */

async function confirmStartMatch() {
    console.log("%c--- 🚀 [START_MATCH_PROCESS] फायनल व्हॅलिडेशन सुरू ---", "color: #f97316; font-weight: bold;");
    
    if (!currentEditingMatch) {
        const backupMatch = localStorage.getItem('squad_editing_match');
        if (backupMatch) {
            currentEditingMatch = JSON.parse(backupMatch);
        } else {
            Swal.fire({
                icon: "error", title: "संदर्भ सापडला नाही!",
                text: "मॅचचा आयडी मेमरीमधून उडाला आहे. कृपया पुन्हा 'Start Scoring' वर क्लिक करा.",
                background: '#111', color: '#fff', confirmButtonColor: '#f97316'
            });
            return;
        }
    }

    const { tId, mId } = currentEditingMatch;

    const playersA = getPlayersData('A'); 
    const playersB = getPlayersData('B');

    if (playersA.length !== 12 || playersB.length !== 12) {
        Swal.fire({
            title: "खेळाडू संख्या चुकीची!",
            text: `PRO-KABADDI नियमांनुसार प्रत्येक संघातून १२ खेळाडू निवडणे बंधनकारक आहे! (Team A: ${playersA.length}, Team B: ${playersB.length})`,
            icon: "error", background: '#111', color: '#fff', confirmButtonColor: '#f97316'
        });
        return;
    }

    const playingA = playersA.filter(p => p.playingStatus === "Playing").length;
    const benchA = playersA.filter(p => p.playingStatus === "Bench").length;
    const playingB = playersB.filter(p => p.playingStatus === "Playing").length;
    const benchB = playersB.filter(p => p.playingStatus === "Bench").length;

    if (playingA !== 7 || playingB !== 7 || benchA !== 5 || benchB !== 5) {
        Swal.fire({
            title: "स्क्वॉड रचना चुकली!",
            text: `मॅचसाठी प्रत्येक संघात ७ Playing आणि ५ Bench खेळाडू असणे अनिवार्य आहे!`,
            icon: "error", background: '#111', color: '#fff', confirmButtonColor: '#f97316'
        });
        return;
    }

    const tossWinner = document.getElementById('tossWinner').value;
    const selection = document.getElementById('tossSelection').value;

    if (tossWinner === "TBD") {
        Swal.fire({ title: "टॉस विनर निवडा!", text: "मॅच सुरू करण्यापूर्वी टॉस निवडा.", icon: "warning", background: '#111', color: '#fff', confirmButtonColor: '#f97316' });
        return;
    }

    try {
        const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
        const match = mDoc.data();
        
        let firstRaidBy = (selection === "Raid") ? tossWinner : (tossWinner === match.teamA ? match.teamB : match.teamA);

        // 🚨 [💥 STEP 1: NEW ARCHITECTURE] - जुन्या सुट्या फील्ड्स डिलीट करून मास्टर ऑब्जेक्ट तयार करणे
        const updateData = {
            tId: tId, mId: mId,
            teamAName: match.teamA, teamBName: match.teamB,
            teamA_id: match.teamA_id || "", teamB_id: match.teamB_id || "", 
            status: "Live", savedMatchTime: 1200, isMatchPaused: true, isFirstTimeStart: true,         
            tossWinner: tossWinner, tossSelection: selection, firstRaidBy: firstRaidBy, currentRaider: firstRaidBy,
            teamAPlayers: playersA, teamBPlayers: playersB, 
            timeoutsA: 0, timeoutsB: 0, matchLog: [],
            lastUpdated: new Date().getTime(),

            // 🎯 [SINGLE SOURCE OF TRUTH]: सर्व स्कोअर एकाच कप्प्यात लॉक केले!
            scoreCard: {
                mainMatch:  { teamA: 0, teamB: 0 },
                fiveRaid:   { teamA: 0, teamB: 0 },
                goldenRaid: { teamA: 0, teamB: 0 }
            }
        };

        console.log("%c📊 [INITIALIZING SCORECARD]: फ्रेश मॅचसाठी नवीन स्कोअरकार्ड ऑब्जेक्ट तयार झाला आहे!", "color: #22c55e; font-weight: bold;");
        console.dir(updateData.scoreCard);

        // 🚨 [HYBRID KEY SAVE]: नवीन हायब्रिड की मध्ये संपूर्ण मास्टर ऑब्जेक्टसह डेटा जतन करणे
        localStorage.setItem(`active_match_${tId}_${mId}`, JSON.stringify(updateData));
        localStorage.setItem('savedMatchTime', 1200);
        
        window.isMatchPaused = true;
        window.isFirstTimeStart = true;
        if (typeof matchTotalSeconds !== 'undefined') matchTotalSeconds = 1200; 

        // फायरबेस अपडेट (आता थेट डीबी मध्ये scoreCard चा मॅप जाईल)
        await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update(updateData);
        console.log("☁️ [Firebase Update Success]: नवीन scoreCard डेटाबेसमध्ये यशस्वीरित्या सिंक झाला!");
        
        if (typeof socket !== 'undefined' && socket && socket.connected) {
            console.log("📤 [SOCKET BROADCAST]: नवीन मास्टर ऑब्जेक्ट सॉकेट पाईपलाईनवर ब्रॉडकास्ट केला!");
            socket.emit('match_status_changed_or_updated', updateData);
        }

        closeStartMatchModal();
        
        await Swal.fire({ title: "Match Live! 🔥", text: "मॅच सुरू होत आहे!", icon: "success", background: '#111', color: '#fff', timer: 1500, showConfirmButton: false });

        goToScoring(tId, mId);

    } catch (e) {
        console.error("🚨 [confirmStartMatch Error]:", e);
    }
}

/** */
function getPlayersData(prefix) {
    console.log(`%c--- 📥 [डेटा गोळा करणे]: Team ${prefix} चा कस्टमाईज्ड स्क्वॉड डेटा गोळा करत आहे... ---`, "color: #3b82f6; font-weight: bold;");
    let data = [];
    
    const containerId = prefix === 'A' ? 'playerListA' : 'playerListB';
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`🚨 [डेटा एरर]: #${containerId} हा कंटेनर DOM मध्ये सापडला नाही!`);
        return data;
    }

    const selectedRadios = container.querySelectorAll(`input[type="radio"]:checked`);
    
    // 🔢 [स्मार्ट नंबरिंग फिक्स]: Team A साठी बेस १ (१, २, ३...) आणि Team B साठी बेस २१ (२१, २२, २३...) 🎯
    let index = prefix === 'A' ? 1 : 21;

    selectedRadios.forEach(radio => {
        const pId = radio.getAttribute('data-pid');
        const nameVal = radio.getAttribute('data-name') || "";
        const roleVal = radio.getAttribute('data-role') || "Raid";
        const userDecision = radio.value; // "Playing" किंवा "Bench"

        const playerObj = {
            pId: pId,                  
            no: index,                 // 🎯 आता Team A ला १ ते १२ आणि Team B ला २१ ते ३२ नंबर अचूक मिळतील!
            name: nameVal, 
            role: roleVal,
            playingStatus: userDecision, 
            status: userDecision === "Playing" ? "In" : "Out", 
            outTime: null,
            stats: { raids: 0, tackles: 0, points: 0 }
        };

        data.push(playerObj);
        index++; // नंबर १ ने पुढे वाढेल
    });

    const totalSelected = data.length;
    const playingCount = data.filter(p => p.playingStatus === "Playing").length;
    const benchCount = data.filter(p => p.playingStatus === "Bench").length;
    
    console.log(`%c📊 [जर्सी नंबरिंग समरी ${prefix}]: एकूण निवडलेले: ${totalSelected}/12 ➔ 🏃‍♂️ Playing: ${playingCount}/7 | 🪑 Bench: ${benchCount}/5`, "color: #22c55e; font-weight: bold;");
    
    return data;
}

/** Edit Tournaments */
let currentEditId = null; // सध्या कोणती टूर्नामेंट एडिट होत आहे त्याचा आयडी

async function editTournament(id) {
  console.log(`[Process]: Fetching tournament details for edit. ID: ${id}`);
  
  // मघाशी आपण मोडलमध्ये आयडी `saveTournamentBtn` दिला होता, तो वापरण्यासाठी
  editingTournamentId = id; 

  try {
    const doc = await db.collection("tournaments").doc(id).get();
    if (!doc.exists) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'स्पर्धेचा डेटा सापडला नाही!' });
      return;
    }

    const t = doc.data();

    // फॉर्ममधील सर्व इनपुट्समध्ये डेटा भरणे
    document.getElementById('tName').value = t.name || "";
    document.getElementById('tOrganizer').value = t.organizer || "";
    document.getElementById('tSeason').value = t.season || "";
    document.getElementById('tLevel').value = t.level || "";
    
    handleLevelChange(); // असोसिएशन फील्ड दाखवणे/लपवणे
    document.getElementById('tAssociation').value = t.association || "";
    
    document.getElementById('tSurface').value = t.surface || "";
    document.getElementById('tType').value = t.type || "";
    document.getElementById('tCategory').value = t.category || "";
    document.getElementById('tGroup').value = t.group || "";
    document.getElementById('tFormat').value = t.format || "";
    document.getElementById('tLimit').value = t.teamLimit || 16;
    document.getElementById('tStartDate').value = t.startDate || "";
    document.getElementById('tEndDate').value = t.endDate || "";

    // मोडलचे टायटल "Update" मध्ये बदलणे
    const modalTitle = document.querySelector('#tournamentModal h3');
    if (modalTitle) modalTitle.innerText = "स्पर्धा माहिती अपडेट करा";

    // बटणाचा टेक्स्ट आणि 'onclick' इव्हेंट बदलणे
    const saveBtn = document.getElementById('saveTournamentBtn');
    if (saveBtn) {
        saveBtn.innerText = "माहिती अपडेट करा (Update)";
        saveBtn.setAttribute("onclick", `handleUpdateTournament('${id}')`); // नवीन अपडेट फंक्शन कॉल होईल
    }

    // मोडल दाखवा (नवीन डार्क थीम नुसार)
    document.getElementById('tournamentModal').classList.replace('hidden', 'flex');

  } catch (error) {
    console.error("[Error] editTournament failed:", error);
    Swal.fire({ icon: 'error', title: 'Error', text: 'डेटा लोड करताना चूक झाली.' });
  }
}

/** updateTournament */
async function updateTournament() {
  if (!currentEditId) return;

  const t = {
    name: document.getElementById('tName').value,
    organizer: document.getElementById('tOrganizer').value,
    season: document.getElementById('tSeason').value,
    startDate: document.getElementById('tStartDate').value, // ही ओळ जोडा
    endDate: document.getElementById('tEndDate').value,     // ही ओळ जोडा
    level: document.getElementById('tLevel').value,
    association: document.getElementById('tAssociation').value,
    surface: document.getElementById('tSurface').value,
    type: document.getElementById('tType').value,
    category: document.getElementById('tCategory').value,
    group: document.getElementById('tGroup').value,
    format: document.getElementById('tFormat').value,
    teamLimit: parseInt(document.getElementById('tLimit').value),
    teams: tournamentTeams,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    await db.collection("tournaments").doc(currentEditId).update(t);
    
    Swal.fire("यशस्वी!", "टूर्नामेंट अपडेट झाली आहे!", "success");
    
    // मॉडेल रिसेट आणि क्लोज करा
    closeTournamentModal();
    resetTournamentForm(); // फॉर्म क्लिअर करण्यासाठी नवीन फंक्शन
    renderTournaments();
    
  } catch (error) {
    Swal.fire("ओहो...", "अपडेट करताना चूक झाली!", "error");
  }
}

// फॉर्म रिसेट फंक्शन (जेणेकरून पुन्हा Create करताना जुना डेटा दिसणार नाही)
function resetTournamentForm() {
    currentEditId = null;
    document.getElementById('tName').value = "";
    // ... सर्व फिल्ड्स रिकामी करा ...
    tournamentTeams = [];
    updateSelectedTeamsUI();
    
    const saveBtn = document.querySelector("#tournamentModal button[onclick='updateTournament()']");
    if(saveBtn) {
        saveBtn.innerText = "Create";
        saveBtn.setAttribute("onclick", "createTournament()");
    }
}

let masterTeams = [
  { id: 1, name: "Tigers (Mumbai)", group: "A" },
  { id: 2, name: "Warriors (Thane)", group: "B" },
  { id: 3, name: "Panthers (Pune)", group: "A" },
  { id: 4, name: "Lions (Nashik)", group: "C" }
];

let tournamentTeams = [];

function openTeamPopup() {
  document.getElementById('teamPopup').classList.remove('hidden');
  renderTeamPopup();
}

function closeTeamPopup() {
  document.getElementById('teamPopup').classList.add('hidden');
}

function renderTeamPopup() {
  const list = document.getElementById('teamPopupList');
  if (!list) return; // सेफ्टी चेक [cite: 395]
  list.innerHTML = "";

  masterTeams.forEach(team => {
    // नावावरून तपासणी करा की ही टीम आधीच निवडली आहे का [cite: 396]
    const isSelected = tournamentTeams.some(t => t.name === team.name);

    list.innerHTML += `
      <div class="flex justify-between items-center bg-gray-800 p-3 rounded-xl border border-gray-700">
        <span class="text-white text-sm">${team.name}</span>
        <button onclick="toggleMasterTeam('${team.name}')" 
          class="px-3 py-1 rounded-lg text-xs font-bold ${isSelected ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}">
          ${isSelected ? 'निवडले (Selected)' : 'निवडा (Add)'}
        </button>
      </div>
    `;
  });
}

function toggleMasterTeam(teamName) {
  const limit = parseInt(document.getElementById('tLimit').value) || 16; //[cite: 397]
  const isSelected = tournamentTeams.some(t => t.name === teamName); //[cite: 396]

  if (isSelected) {
    // आधीच असेल तर काढून टाका [cite: 398]
    tournamentTeams = tournamentTeams.filter(t => t.name !== teamName);
  } else {
    // लिमिट तपासा आणि जोडा [cite: 399]
    if (tournamentTeams.length >= limit) {
      Swal.fire({
        icon: 'warning',
        title: 'मर्यादा संपली!',
        text: `या टूर्नामेंटमध्ये तुम्ही जास्तीत जास्त ${limit} संघ घेऊ शकता.`
      });
      return;
    }
    tournamentTeams.push({ id: Date.now(), name: teamName }); //[cite: 400]
  }

  renderTeamPopup(); 
  updateSelectedTeamsUI(); 
}



function updateSelectedTeamsUI() {
  const countLabel = document.getElementById('selectedTeamsCount');
  const tagsContainer = document.getElementById('selectedTeamsTags');

  if (countLabel) {
    countLabel.innerText = `एकूण संघ: ${tournamentTeams.length}`; // [cite: 401]
  }

  if (tagsContainer) {
    tagsContainer.innerHTML = "";
    tournamentTeams.forEach((team, index) => {
      tagsContainer.innerHTML += `
        <span class="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
          ${team.name}
          <button onclick="removeTeam(${index})" class="text-white font-bold ml-1">×</button>
        </span>
      `;
    });
  }
}

function removeTeam(index) {
  tournamentTeams.splice(index, 1); //[cite: 305]
  renderTeamPopup();
  updateSelectedTeamsUI();
}

async function addNewTeamManual() {
  const newTeamName = document.getElementById('newTeamName').value.trim();
  const limit = parseInt(document.getElementById('tLimit').value) || 16;
  
  // १. नाव रिकामे नाही ना हे तपासणे
  if (!newTeamName) {
    Swal.fire("चूक!", "कृपया संघाचे नाव टाईप करा.", "error");
    return;
  }

  // २. टीम लिमिट तपासणे [cite: 399]
  if (tournamentTeams.length >= limit) {
    Swal.fire("मर्यादा संपली!", `तुम्ही जास्तीत जास्त ${limit} संघ घेऊ शकता.`, "warning");
    return;
  }

  // ३. सध्याच्या लिस्टमध्ये ही टीम आधीच आहे का ते तपासणे [cite: 323, 400]
  // आपण नावाची तुलना Case-Insensitive (लहान-मोठी अक्षरे) करूया
  const isDuplicate = tournamentTeams.some(t => t.name.toLowerCase() === newTeamName.toLowerCase());

  if (isDuplicate) {
    Swal.fire("ओहो...", "हा संघ आधीच निवडलेला आहे!", "info");
    return;
  }

  // ४. टीमला तात्पुरत्या ऍरेमध्ये (tournamentTeams) ऑब्जेक्ट स्वरूपात जोडणे [cite: 331]
  const newTeamObj = {
    id: Date.now(), // युनिक आयडीसाठी सध्याचा वेळ वापरू [cite: 331]
    name: newTeamName
  };

  tournamentTeams.push(newTeamObj);

  // ५. UI अपडेट करणे [cite: 400, 401]
  document.getElementById('newTeamName').value = ""; // इनपुट बॉक्स रिकामा करा
  renderTeamPopup(); 
  updateSelectedTeamsUI();

  Swal.fire({
    title: "यशस्वी!",
    text: `${newTeamName} संघ जोडला गेला.`,
    icon: "success",
    timer: 1500,
    showConfirmButton: false
  });
}


/**
 * २. Fixture Generator: मॅचेस कशा लावणार?
 * फिक्श्चर जनरेट करण्यासाठी आपण Knockout अल्गोरिदम वापरू. १६ टीम्स असतील तर ८ मॅचेस (Round 1) तयार होतील.
  */

// async function generateKnockoutFixtures(tId, teams) {
//   // १. टीम्सना रँडमली शफल करा [cite: 5]
//   const shuffled = teams.sort(() => Math.random() - 0.5);
//   const matches = [];

//   // २. जोड्या लावा (Team 1 vs Team 2) [cite: 5, 53]
//   for (let i = 0; i < shuffled.length; i += 2) {
//     if (shuffled[i + 1]) {
//       matches.push({
//         matchNo: (i / 2) + 1,
//         teamA: shuffled[i].name,
//         teamB: shuffled[i + 1].name,
//         status: "Pending", // Pending / Live / Completed 
//         scoreA: 0,
//         scoreB: 0,
//         round: 1
//       });
//     }
//   }

//   // ३. Firebase मध्ये एकाच वेळी मॅचेस सेव्ह करा
//   const batch = db.batch();
//   matches.forEach(m => {
//     const mRef = db.collection("tournaments").doc(tId).collection("matches").doc();
//     batch.set(mRef, m);
//   });
//   await batch.commit();
// }

/**
 * नवीन फ्लो (New Master Object Flow):
आता आपण हे सुटे कप्पे काढून, मॅच तयार होतानाच तिच्या पोटात आपला अधिकृत scoreCard चा मास्टर ऑब्जेक्ट डिफॉल्ट व्हॅल्यूसह (0-0 स्कोअर ठेवून) सेट करून टाकणार आहोत.
 */
async function generateKnockoutFixtures(tId, teams) {
  console.log("%c--- 📅 [KNOCKOUT FIXTURES PROCESS] नवीन सामने तयार करणे सुरू ---", "color: #3b82f6; font-weight: bold;");

  // १. टीम्सना रँडमली शफल करा
  const shuffled = teams.sort(() => Math.random() - 0.5);
  const matches = [];

  // २. जोड्या लावा (Team 1 vs Team 2)
  for (let i = 0; i < shuffled.length; i += 2) {
    if (shuffled[i + 1]) {
      
      // 🚨 [💥 NEW ARCHITECTURE]: मॅचचा पाया रचतानाच मास्टर ऑब्जेक्ट डिफॉल्ट सेट करणे
      const matchObject = {
        matchNo: (i / 2) + 1,
        teamA: shuffled[i].name,
        teamB: shuffled[i + 1].name,
        teamA_id: shuffled[i].id || shuffled[i].teamId || "", // भविष्यासाठी आयडी बॅकअप
        teamB_id: shuffled[i + 1].id || shuffled[i + 1].teamId || "",
        status: "Pending", // Pending / Live / Finished
        round: 1,
        lastUpdated: new Date().getTime(),

        // 🎯 [SINGLE SOURCE OF TRUTH]: सामने तयार होतानाच प्रत्येकाला फ्रेश स्कोअरकार्ड वाटप!
        scoreCard: {
            mainMatch:  { teamA: 0, teamB: 0 },
            fiveRaid:   { teamA: 0, teamB: 0 },
            goldenRaid: { teamA: 0, teamB: 0 }
        }
      };

      matches.push(matchObject);
    }
  }

  console.log(`📊 [FIXTURES GENERATED]: एकूण ${matches.length} सामन्यांचे आराखडे मास्टर ऑब्जेक्टसह तयार झाले!`);
  console.dir(matches);

  // ३. Firebase मध्ये एकाच वेळी मॅचेस सेव्ह करा
  const batch = db.batch();
  matches.forEach(m => {
    const mRef = db.collection("tournaments").doc(tId).collection("matches").doc();
    batch.set(mRef, m);
  });
  
  await batch.commit();
  console.log("%c☁️ [Firebase Batch Success]: सर्व सामने नवीन scoreCard रचनेसह डेटाबेसमध्ये जतन झाले!", "color: #22c55e; font-weight: bold;");
}

/**
 * Fixture Template लॉजिक (Manual Entry)
* जेव्हा युजर 'Generate Template' वर क्लिक करेल, तेव्हा आपण १६ टीम्ससाठी ८ रिकाम्या मॅचेस तयार करू. युजर नंतर 'Edit' बटण दाबून त्यात टीम्स आणि वेळ भरेल
 */

async function generateManualTemplate(tId, teamLimit) {
  const matches = [];
  const totalMatches = teamLimit / 2; // उदा. १६ टीम्स असतील तर ८ मॅचेस 

  for (let i = 1; i <= totalMatches; i++) {
    matches.push({
      matchNo: i,
      teamA: "TBD", // To Be Decided
      teamB: "TBD",
      matchDate: "",
      matchTime: "",
      status: "Pending",
      scoreA: 0,
      scoreB: 0,
      round: 1
    });
  }

  // Firebase मध्ये सेव्ह करा 
  const batch = db.batch();
  matches.forEach(m => {
    const mRef = db.collection("tournaments").doc(tId).collection("matches").doc(`M${m.matchNo}`);
    batch.set(mRef, m);
  });
  await batch.commit();
}


/**
 * openMatchSetter लॉजिक
 * हे फंक्शन मॅचमधील ड्रॉपडाउनमध्ये फक्त त्याच टूर्नामेंटच्या टीम्स दाखवेल
 * openMatchSetter फंक्शन आपण टूर्नामेंटच्या Fixtures (मॅचेस) मॅनेज करण्यासाठी बनवले होते. सोप्या भाषेत सांगायचे तर, "कोणती टीम कोणाविरुद्ध खेळणार" आणि "मॅच कधी होणार" हे ठरवण्यासाठीचा हा 'मॅच एडिटर' आहे.
 */

let currentEditingMatch = null;

async function openMatchSetter(tId, mId) {
  console.log(`%c--- 📂 [ओपन मॅच सेटर] चालू टूर्नामेंट: ${tId} | मॅच आयडी: ${mId} ---`, "color: #3b82f6; font-weight: bold; font-size: 11px;");
  currentEditingMatch = { tId, mId };

  const modal = document.getElementById('matchSetterModal');
  const selA = document.getElementById('mTeamA');
  const selB = document.getElementById('mTeamB');
  const inpDate = document.getElementById('mDate');
  const inpTime = document.getElementById('mTime');

  if (!modal || !selA || !selB) {
    console.error("🚨 [मॅच सेटर एरर]: HTML मधील एलिमेंट्स सापडले नाहीत!");
    Swal.fire("Error", "HTML मध्ये पॉपअप कोड सापडला नाही.", "error");
    return;
  }

  try {
    const tDoc = await db.collection("tournaments").doc(tId).get();
    const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
    
    const teams = tDoc.data().teams || []; 
    const currentMatch = mDoc.exists ? mDoc.data() : {};

    console.log("%c[१. टूर्नामेंट डेटा]: teams ॲरेची सध्याची रचना ->", "color: #a855f7; font-weight: bold;", teams);

    let options = `
      <option value="TBD" data-id="TBD" data-reg="TBD">निवडा (Select Team)</option>
      <option value="BYE" data-id="BYE" data-reg="BYE">BYE (पुढच्या फेरीसाठी पात्र)</option>
    `;

    teams.forEach((t, i) => {
      if (t) {
        const teamName = t.teamName || t.name || t;
        
        // 🟢 [महत्त्वाचा फिक्स]: ऑब्जेक्ट मधून दोन्ही आयडी वेगळे गोळा करणे
        // जर जुना डेटा असेल तर बॅकअप म्हणून नावालाच किंवा आयडीलाच व्हॅल्यू मानणे
        const teamIdValue = t.regId || t.id || t;  // हा आपला 'TM_...' वाला दस्तऐवज आयडी असेल
        const teamRegValue = t.manualRegId || t.regId || "N/A"; // हा मॅन्युअल 'MSKALG...' असेल

        // 🔍 प्रत्येक ऑप्शन बनताना काय मॅप होतंय ते कन्सोलमध्ये स्पष्ट दिसेल
        console.log(`   ↳ 🏅 संघ [${i+1}]: नाव = "${teamName}" | 🔑 सिस्टीम ID = "${teamIdValue}" | 🔑 नोंदणी ID = "${teamRegValue}"`);
        
        // 🎯 आपण दोन्ही आयडी ऑप्शनच्या पोटात 'data-id' आणि 'data-reg' म्हणून लपवून ठेवले
        options += `<option value="${teamName}" data-id="${teamIdValue}" data-reg="${teamRegValue}">${teamName}</option>`;
      }
    });

    selA.innerHTML = options;
    selB.innerHTML = options;

    selA.value = currentMatch.teamA || "TBD";
    selB.value = currentMatch.teamB || "TBD";
    
    if (inpDate) inpDate.value = currentMatch.matchDate || "";
    if (inpTime) inpTime.value = currentMatch.matchTime || "";

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
  } catch (err) {
    console.error("🚨 [मॅच सेटर क्रिटिकल एरर]:", err);
    Swal.fire("Error", "डेटा लोड करताना चूक झाली.", "error");
  }
}


function closeMatchSetter() {
  const modal = document.getElementById('matchSetterModal');
  if(modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/**मॅन्युअली टीम सेट करणे (Save Logic)
जेव्हा युजर पॉपअपमध्ये टीम्स निवडेल, तेव्हा त्या मॅचला अपडेट करण्यासाठी हे फंक्शन वापरा: */
async function saveMatchDetails() {
  if (!currentEditingMatch) {
    console.error("🚨 [सेव्ह एरर]: currentEditingMatch चा डेटा रिकामी आहे!");
    return;
  }
  const { tId, mId } = currentEditingMatch;

  const selA = document.getElementById('mTeamA');
  const selB = document.getElementById('mTeamB');

  const teamA = selA.value;
  const teamB = selB.value;
  const matchDate = document.getElementById('mDate').value;
  const matchTime = document.getElementById('mTime').value;

  if (teamA !== "TBD" && teamA !== "BYE" && teamA === teamB) {
    Swal.fire({ icon: 'error', title: 'चूक!', text: 'एकच संघ स्वतःविरुद्ध खेळू शकत नाही. कृपया वेगळा संघ निवडा.', confirmButtonColor: '#d33' });
    return;
  }

  // 🟢 [फिक्स २]: सिलेक्टेड ऑप्शन वरून 'data-id' (TM_...) आणि 'data-reg' (MSKALG...) दोन्ही बाहेर काढणे
  const teamA_id = selA.options[selA.selectedIndex]?.getAttribute('data-id') || teamA;
  const teamB_id = selB.options[selB.selectedIndex]?.getAttribute('data-id') || teamB;
  
  const teamA_regId = selA.options[selA.selectedIndex]?.getAttribute('data-reg') || "";
  const teamB_regId = selB.options[selB.selectedIndex]?.getAttribute('data-reg') || "";

  // 🔍 [अल्टीमेट लाईव्ह चेक]: हा डेटा आता थेट फायरस्टोअरच्या दस्तऐवजात जतन होणार आहे
  console.log("%c========================================", "color: #22c55e; font-weight: bold;");
  console.log(`%c💾 [डेटाबेस जतन तयारी]: मॅच अपडेट करण्यासाठी ऑब्जेक्ट सज्ज आहे!`, "color: #22c55e; font-weight: bold; font-size: 11px;");
  console.log(`🤝 संघ A (नाव)     : "${teamA}"`);
  console.log(`🔑 संघ A (teamA_id) : %c"${teamA_id}"`, "color: #3b82f6; font-weight: bold;");
  console.log(`🔑 संघ A (regId)    : %c"${teamA_regId}"`, "color: #eab308; font-weight: bold;");
  console.log(`🤝 संघ B (नाव)     : "${teamB}"`);
  console.log(`🔑 संघ B (teamB_id) : %c"${teamB_id}"`, "color: #3b82f6; font-weight: bold;");
  console.log(`🔑 संघ B (regId)    : %c"${teamB_regId}"`, "color: #eab308; font-weight: bold;");
  console.log("%c========================================", "color: #22c55e; font-weight: bold;");

  const data = {
    teamA: teamA,
    teamA_id: teamA_id,       // 🔐 इथे आता अचूक "TM_JAY_BHARAT_SEVA_005" बसेल, जो खेळाडू लोड करेल!
    teamA_regCode: teamA_regId, // भविष्यात रेकॉर्डसाठी मॅन्युअल रजिस्ट्रेशन नंबर पण राहू दे
    teamB: teamB,
    teamB_id: teamB_id,       // 🔐 इथे अचूक "TM_..." बसेल
    teamB_regCode: teamB_regId,
    matchDate: matchDate,
    matchTime: matchTime
  };

  try {
    await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update(data);
    
    console.log(`%c✅ [डेटाबेस यशस्वी]: फायरस्टोअर मॅच (${mId}) सुरक्षितपणे अपडेट झाली!`, "color: #22c55e; font-weight: bold;");
    
    closeMatchSetter();
    Swal.fire({ title: "यशस्वी!", text: "मॅच युनिक आयडीसह सुरक्षित झाली आहे.", icon: "success", timer: 1500, showConfirmButton: false });
    
    renderFixturesTab(tId); 
  } catch (error) {
    console.error("🚨 [डेटाबेस क्रॅश एरर]:", error);
    Swal.fire("Error", "डेटा अपडेट करताना तांत्रिक अडचण आली.", "error");
  }
}


/** */

function closeMatchSetter() {
  document.getElementById('matchSetterModal').classList.add('hidden'); // [cite: 299]
}

/**
 * हे फंक्शन 'मॅच एडमिन' कडून 'लाइव्ह स्कोअरर' कडे जाणारा मुख्य पूल (Bridge) आहे. 
 * या फंक्शनशिवाय स्कोअरिंग स्क्रीनला हे समजणारच नाही की नक्की कोणत्या टीमची आणि कोणत्या खेळाडूंची मॅच सुरू आहे.
 */


// async function goToScoring(tId, mId) {
//     console.log("--- [NAV] Loading Original Scoring Logic --- 🚀");
//     await loadPage('scoring'); 

//     try {
//         const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
//         const match = mDoc.data();
        
//         currentMatchData = match;
//         localStorage.setItem('currentTeamA', match.teamA);
//         localStorage.setItem('currentTeamB', match.teamB);
        
//         setupLiveMatchNames();
//         teamAPlayers = match.teamAPlayers || [];
//         teamBPlayers = match.teamBPlayers || [];

//         if(document.getElementById('scoreA')) document.getElementById('scoreA').innerText = match.scoreA || 0;
//         if(document.getElementById('scoreB')) document.getElementById('scoreB').innerText = match.scoreB || 0;

//         renderMiniPlayers();
//         if (typeof updateTimeoutUI === "function") updateTimeoutUI();

//         // ---------------------------------------------------------
//         // 🛠️ [STRICT RECOVERY LOGIC] - १२०० सेकंदाच्या निकषावर फिक्स 🚀
//         // ---------------------------------------------------------
//         const scoringArea = document.getElementById('scoringButtonsContainer'); 
//         const mainBtn = document.getElementById('mainMatchBtn'); 
//         const actionBtn = document.getElementById('mainActionBtn');
//         const halfTextElement = document.getElementById('matchHalfText') || document.getElementById('periodDisplay');
        
//         let dbSeconds = (match.savedMatchTime !== undefined) ? match.savedMatchTime : 1200;
//         matchTotalSeconds = dbSeconds; 
//         localStorage.setItem('savedMatchTime', dbSeconds);

//         window.isMatchPaused = true; 

//         // ⚙️ [STAGE RECOVERY]: '1st_Half_End' आणि वेळेच्या समीकरणावरून २रा हाफ अचूक ट्रॅक करा! 🔑
//         if (match.status === "1st_Half_End") {
//             if (dbSeconds === 0) {
//                 // 🛑 केस १: स्टेटस १स्त हाफ एंड आहे आणि वेळ ० आहे ➔ अजून २रा हाफ सुरू व्हायचा आहे!
//                 matchStage = "INTERVAL";
//                 console.log("%c⚙️ [Strict Sync]: स्टेज 'INTERVAL' (ब्रेक) रिकव्हर केली.", "color: #3b82f6; font-weight: bold;");
//             } else {
//                 // 🏃‍♂️ केस २: स्टेटस १स्त हाफ एंडच आहे, पण वेळ ० पेक्षा जास्त आहे ➔ २रा हाफ सुरू झाला होता आणि रिफ्रेश झालाय!
//                 matchStage = "2ND_HALF";
//                 console.log("%c⚙️ [Strict Sync]: स्टेज '2ND_HALF' ओळखली. २रा हाफ आधीच चालू होता.", "color: #a855f7; font-weight: bold;");
//             }
//         } else {
//             // 🟢 केस ३: फ्रेश मॅच किंवा पहिला हाफ चालू आहे
//             matchStage = "1ST_HALF";
//             console.log("%c⚙️ [Strict Sync]: स्टेज '1ST_HALF' ओळखीली.", "color: #eab308; font-weight: bold;");
//         }

//         // हेडर टेक्स्ट सेट करा ("1st Half" किंवा "2nd Half")
//         if (halfTextElement) {
//             halfTextElement.innerText = (matchStage === "2ND_HALF" || matchStage === "INTERVAL") ? "2nd Half" : "1st Half";
//         }

//         // 🟠 [CASE 2 RE-ENTRY FIX] - २रा हाफ सुरू व्हायच्या आधीची ब्रेक स्थिती
//         if (matchStage === "INTERVAL") {
//             console.log("%c[STRICT CASE 2]: १स्त हाफ संपलेला आढळला. डावे बटण डिसेबल करत आहे.", "color: #f97316; font-weight: bold;");
//             window.isFirstTimeStart = true;

//             if (scoringArea) {
//                 scoringArea.style.pointerEvents = "none";
//                 scoringArea.style.opacity = "0.4";
//             }
//             if (mainBtn) {
//                 mainBtn.classList.add('hidden'); // दोन बटणे एकत्र दिसू नये म्हणून डावे बटण लपवले 🧼
//             }
//             if (actionBtn) {
//                 actionBtn.innerText = "Start 2nd Half";
//                 actionBtn.className = "w-full bg-green-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase border border-green-500 shadow-xl active:scale-95";
//             }
//         }
//         // 🏃‍♂️ [CASE 1 & CASE 3]: चालू खेळ मधेच थांबला होता (Resume Mode)
//         else if (dbSeconds < 1200) {
//             console.log(`%c[STRICT RESUME]: मॅच मधेच थांबलीये (${dbSeconds} सेकंद). RESUME MODE!`, "color: #22c55e; font-weight: bold;");
//             window.isFirstTimeStart = false; 

//             if (scoringArea) {
//                 scoringArea.style.pointerEvents = "none";
//                 scoringArea.style.opacity = "0.4";
//             }
//             if (mainBtn) {
//                 mainBtn.classList.remove('hidden'); // मॅच रिझ्युम करायची आहे म्हणून डावे बटण समोर आणले
//                 mainBtn.innerText = "RESUME MATCH";
//                 mainBtn.className = "w-full bg-green-600 py-4 rounded-2xl text-[10px] font-black uppercase border border-green-500 shadow-xl text-white animate-pulse";
//             }
//             // 🎯 [THE ULTIMATE FIX]: जर २रा हाफ मधेच थांबून युझर परत आला असेल, तर उजवीकडे थेट "End Match" चे लाल बटन लावा!
//             if (actionBtn) {
//                 if (matchStage === "2ND_HALF") {
//                     actionBtn.innerText = "End Match";
//                     actionBtn.className = "w-full bg-red-900/20 text-red-500 py-4 rounded-2xl text-[10px] font-black uppercase border border-red-900/30 active:scale-95";
//                 } else {
//                     actionBtn.innerText = "End 1st Half";
//                     actionBtn.className = "w-full bg-red-900/20 text-red-500 py-4 rounded-2xl text-[10px] font-black uppercase border border-red-900/30 active:scale-95";
//                 }
//             }
//         } 
//         // 🟢 [FRESH MATCH] - नवीन कोरी मॅच
//         else { 
//             console.log("%c[STRICT FRESH]: नवीन फ्रेश मॅच चालू होत आहे.", "color: #eab308; font-weight: bold;");
//             window.isFirstTimeStart = true;

//             if (scoringArea) {
//                 scoringArea.style.pointerEvents = "none";
//                 scoringArea.style.opacity = "0.4";
//             }
//             if (mainBtn) {
//                 mainBtn.classList.remove('hidden');
//                 mainBtn.innerText = "Start Match";
//                 mainBtn.className = "w-full bg-gray-800 py-4 rounded-2xl text-[10px] font-black uppercase border border-gray-700 shadow-xl text-orange-500 animate-pulse";
//             }
//             if (actionBtn) {
//                 actionBtn.innerText = "End 1st Half";
//                 actionBtn.className = "w-full bg-red-900/20 text-red-500 py-4 rounded-2xl text-[10px] font-black uppercase border border-red-900/30 active:scale-95";
//             }
//         }

//         // ---------------------------------------------------------
//         // 🔄 [RAID HISTORY RESTORE]: एकाच फील्डमधून अख्खा इतिहास पुन्हा लोड करा 🚀
//         // ---------------------------------------------------------
//         console.log("🔄 [History Restore]: डेटाबेसवरून 'raidsHistory' इतिहासाची पुनर्रचना सुरू...");
        
//         raidCounter = 0; 
//         window.activeRaidsList = match.raidsHistory || []; 

//         const rFeed = document.getElementById('raidFeed');
//         const mList = document.getElementById('modalRaidList');
//         if (rFeed) rFeed.innerHTML = ""; 
//         if (mList) mList.innerHTML = "";

//         if (window.activeRaidsList && window.activeRaidsList.length > 0) {
//             console.log(`🎯 [History Restore]: ${window.activeRaidsList.length} जुन्या रेड्स सापडल्या! स्क्रीनवर रेंडर करत आहे...`);
            
//             window.activeRaidsList.forEach(r => {
//                 addRaidToSummary(r.team, r.raiderName, r.result, r.points, r.details, true);
//             });

//             const rawString = JSON.stringify(window.activeRaidsList);
//             const encodedData = btoa(unescape(encodeURIComponent(rawString)));
//             localStorage.setItem(`raids_secure_log_${mId}`, encodedData);
//         } else {
//             console.log("📝 [History Restore]: या मॅचमध्ये अजून एकही रेड झालेली नाही.");
//             if (rFeed) rFeed.innerHTML = `<div id="noRaidText" class="text-gray-500 text-[10px] italic p-2">No raids yet...</div>`;
//         }
//         // ---------------------------------------------------------

//         if (typeof updateMatchUI === "function") updateMatchUI();
//         console.log("Scoring Screen Ready for:", match.teamA, "vs", match.teamB);

//     } catch (e) {
//         console.error("Error loading scoring data:", e);
//     }
// }

/*** */

async function goToScoring(tId, mId) {
    console.log("%c==================================================", "color: #3b82f6; font-weight: bold;");
    console.log("--- 🚀 [NAV DIAGNOSTIC]: Loading Original Scoring Logic ---");
    console.log(`👉 Match ID: ${mId} | Tournament ID: ${tId}`);
    console.log("%c==================================================", "color: #3b82f6; font-weight: bold;");

    await loadPage('scoring'); 

    try {
        const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
        const match = mDoc.data();
        
        currentMatchData = match;
        localStorage.setItem('currentTeamA', match.teamA);
        localStorage.setItem('currentTeamB', match.teamB);
        
        setupLiveMatchNames();
        teamAPlayers = match.teamAPlayers || [];
        teamBPlayers = match.teamBPlayers || [];

        if(document.getElementById('scoreA')) document.getElementById('scoreA').innerText = match.scoreA || 0;
        if(document.getElementById('scoreB')) document.getElementById('scoreB').innerText = match.scoreB || 0;

        renderMiniPlayers();
        if (typeof updateTimeoutUI === "function") updateTimeoutUI();

        // ---------------------------------------------------------
        // 🛠️ [STRICT RECOVERY LOGIC] - १२०० सेकंदाच्या निकषावर फिक्स 🚀
        // ---------------------------------------------------------
        const scoringArea = document.getElementById('scoringButtonsContainer'); 
        const mainBtn = document.getElementById('mainMatchBtn'); 
        const actionBtn = document.getElementById('mainActionBtn');
        const halfTextElement = document.getElementById('matchHalfText') || document.getElementById('periodDisplay');
        
        let dbSeconds = (match.savedMatchTime !== undefined) ? match.savedMatchTime : 1200;
        matchTotalSeconds = dbSeconds; 
        localStorage.setItem('savedMatchTime', dbSeconds);

        window.isMatchPaused = true; 

        // =============================================================
        // 🎯 [THE CRITICAL REFERENCE FIX]: dbStatus व्हेरिएबल इथे तयार केला! 🔑
        // =============================================================
        const rawStatus = match.status || match.match_status || "";
        const dbStatus = rawStatus.trim(); 

        const currentScoreCard = match.scoreCard || {
            mainMatch:  { teamA: Number(match.scoreA || 0), teamB: Number(match.scoreB || 0) },
            fiveRaid:   { teamA: 0, teamB: 0 },
            goldenRaid: { teamA: 0, teamB: 0 }
        };

        console.log("%c🔍 [CHECKPOINT 1 - STATUS INTAKE]:", "background: #0f172a; color: #38bdf8; font-weight: bold; padding: 2px;");
        console.log("👉 Original DB Status From Firebase:", `"${rawStatus}"`);
        console.log("👉 Trimmed DB Status For Code Check:", `"${dbStatus}"`);

        // ⚙️ [STAGE RECOVERY]: स्टेटस पडताळणी
        if (dbStatus === "five_raid") {
            matchStage = "FIVE_RAID";
            console.log("%c🎯 [MATCH STAGE MATCHED] ➔ FIVE_RAID मोड परफेक्ट डिटेक्ट झाला! ⚔️", "color: #f59e0b; font-weight: bold;");
        } else if (dbStatus === "golden_raid") {
            matchStage = "GOLDEN_RAID";
            console.log("%c🎯 [MATCH STAGE MATCHED] ➔ GOLDEN_RAID मोड परफेक्ट डिटेक्ट झाला! 🔥", "color: #ef4444; font-weight: bold;");
        } else if (dbStatus === "1st_Half_End") {
            if (dbSeconds === 0) {
                matchStage = "INTERVAL";
                console.log("%c⚙️ [Strict Sync]: स्टेज 'INTERVAL' (ब्रेक) रिकव्हर केली.", "color: #3b82f6; font-weight: bold;");
            } else {
                matchStage = "2ND_HALF";
                console.log("%c⚙️ [Strict Sync]: स्टेज '2ND_HALF' ओळखली. २रा हाफ आधीच चालू होता.", "color: #a855f7; font-weight: bold;");
            }
        } else {
            matchStage = "1ST_HALF";
            console.log("%c⚙️ [Strict Sync]: स्टेज '1ST_HALF' ओळखीली.", "color: #eab308; font-weight: bold;");
        }

        // हेडर टेक्स्ट सेट करा ("1st Half", "2nd Half" किंवा "5-5 Raids")
        if (halfTextElement) {
            if (matchStage === "FIVE_RAID") {
                halfTextElement.innerText = "5-5 Raids";
            } else if (matchStage === "GOLDEN_RAID") {
                halfTextElement.innerText = "Golden Raid";
            } else {
                halfTextElement.innerText = (matchStage === "2ND_HALF" || matchStage === "INTERVAL") ? "2nd Half" : "1st Half";
            }
        }

        // 🟠 [CASE 2 RE-ENTRY FIX] - २रा हाफ सुरू व्हायच्या आधीची ब्रेक स्थिती
        if (matchStage === "INTERVAL") {
            window.isFirstTimeStart = true;
            if (scoringArea) {
                scoringArea.style.pointerEvents = "none";
                scoringArea.style.opacity = "0.4";
            }
            if (mainBtn) mainBtn.classList.add('hidden'); 
            if (actionBtn) {
                actionBtn.innerText = "Start 2nd Half";
                actionBtn.className = "w-full bg-green-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase border border-green-500 shadow-xl active:scale-95";
            }
        }
        // 🏃‍♂️ [RESUME MODE]: चालू खेळ मधेच थांबला होता (५-५ आणि गोल्डन सहित)
        else if (dbSeconds < 1200 || matchStage === "FIVE_RAID" || matchStage === "GOLDEN_RAID") {
            window.isFirstTimeStart = false; 
            if (scoringArea) {
                scoringArea.style.pointerEvents = "none";
                scoringArea.style.opacity = "0.4";
            }
            if (mainBtn) {
                mainBtn.classList.remove('hidden'); 
                mainBtn.innerText = "RESUME MATCH";
                mainBtn.className = "w-full bg-green-600 py-4 rounded-2xl text-[10px] font-black uppercase border border-green-500 shadow-xl text-white animate-pulse";
            }
            
            if (actionBtn) {
                if (matchStage === "2ND_HALF" || matchStage === "FIVE_RAID" || matchStage === "GOLDEN_RAID") {
                    actionBtn.innerText = "End Match";
                    actionBtn.className = "w-full bg-red-900/20 text-red-500 py-4 rounded-2xl text-[10px] font-black uppercase border border-red-900/30 active:scale-95";
                } else {
                    actionBtn.innerText = "End 1st Half";
                    actionBtn.className = "w-full bg-red-900/20 text-red-500 py-4 rounded-2xl text-[10px] font-black uppercase border border-red-900/30 active:scale-95";
                }
            }
        } else { 
            window.isFirstTimeStart = true;
            if (scoringArea) {
                scoringArea.style.pointerEvents = "none";
                scoringArea.style.opacity = "0.4";
            }
            if (mainBtn) {
                mainBtn.classList.remove('hidden');
                mainBtn.innerText = "Start Match";
                mainBtn.className = "w-full bg-gray-800 py-4 rounded-2xl text-[10px] font-black uppercase border border-gray-700 shadow-xl text-orange-500 animate-pulse";
            }
            if (actionBtn) {
                actionBtn.innerText = "End 1st Half";
                actionBtn.className = "w-full bg-red-900/20 text-red-500 py-4 rounded-2xl text-[10px] font-black uppercase border border-red-900/30 active:scale-95";
            }
        }

        // ---------------------------------------------------------
        // 🔄 [RAID HISTORY RESTORE]
        // ---------------------------------------------------------
        raidCounter = 0; 
        window.activeRaidsList = match.raidsHistory || []; 

        const rFeed = document.getElementById('raidFeed');
        const mList = document.getElementById('modalRaidList');
        if (rFeed) rFeed.innerHTML = ""; 
        if (mList) mList.innerHTML = "";

        if (window.activeRaidsList && window.activeRaidsList.length > 0) {
            window.activeRaidsList.forEach(r => {
                addRaidToSummary(
                    r.team, 
                    r.raiderName, 
                    r.result, 
                    r.points, 
                    r.details, 
                    true,                   
                    r.isFiveRaid || false,   
                    r.isGoldenRaid || false  
                );
            });

            const rawString = JSON.stringify(window.activeRaidsList);
            const encodedData = btoa(unescape(encodeURIComponent(rawString)));
            localStorage.setItem(`raids_secure_log_${mId}`, encodedData);
        } else {
            if (rFeed) rFeed.innerHTML = `<div id="noRaidText" class="text-gray-500 text-[10px] italic p-2">No raids yet...</div>`;
        }

        // =========================================================================
        // 📂 SECTION: FINAL HEADER SCORE OVERWRITE (THE ULTIMATE RESYNC) 🎯
        // =========================================================================
        // सर्व जुन्या रेड्स रेंडर झाल्यानंतर, हा तुकडा टॉप हेडरच्या स्कोरला कन्सोलच्या खऱ्या 'mainMatch' वर सक्तीने लॉक करेल!
        setTimeout(() => {
            console.log("%c================ 🎛️ [FINAL HEADER RESYNC] ================", "background: #15803d; color: #fff; font-weight: bold; padding: 2px;");
            
            const elA = document.getElementById('scoreA');
            const elB = document.getElementById('scoreB');
            
            // कन्सोलमधील खरा 'mainMatch' चा स्कोअर (उदा. 2 - 2)
            let realMainMatchScoreA = Number(currentScoreCard?.mainMatch?.teamA ?? match.scoreA ?? 0);
            let realMainMatchScoreB = Number(currentScoreCard?.mainMatch?.teamB ?? match.scoreB ?? 0);

            if (elA) elA.innerText = realMainMatchScoreA;
            if (elB) elB.innerText = realMainMatchScoreB;

            console.log(`📊 [SUCCESS]: टॉप हेडरवर मुख्य सामन्याचा खरा स्कोअर (${realMainMatchScoreA}-${realMainMatchScoreB}) सक्तीने सेट केला!`);
            console.log("%c================================================================", "color: #15803d;");
        }, 100);
        // =========================================================================

        if (typeof updateMatchUI === "function") updateMatchUI();
        console.log("Scoring Screen Ready for:", match.teamA, "vs", match.teamB);

    } catch (e) {
        console.error("🚨 [goToScoring FATAL CRASH]:", e);
    }
}

/*** */

function renderLivePlayers(players, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    // फक्त तेच खेळाडू दाखवा जे सध्या "In" आहेत
    players.filter(p => p.status === "In").forEach(p => {
        container.innerHTML += `
            <div class="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                <span class="w-6 h-6 flex items-center justify-center bg-gray-800 rounded text-[10px] font-black text-yellow-500 border border-yellow-500/20">${p.no}</span>
                <span class="text-[10px] font-bold truncate">${p.name}</span>
            </div>
        `;
    });
}

/**Scoring*/

function checkActiveRaider(team) {
    const raiderText = document.getElementById('activeRaider').innerText;
    if (raiderText.includes("Waiting") || raiderText.includes("None")) {
        // जर रेडर नसेल, तर आधी रेडर निवडायला भाग पाडा
        openRaiderSelectionModal(team); 
        return false; // रेडर नाहीये
    }
    return true; // रेडर आधीच सिलेक्टेड आहे
}

let raidInterval;
let raidTime = 30;

function startRaidTimer(team, isJustStarting = false) {
    // १. आधी टायमर थांबवा (जर आधीची रेड चुकून सुरू असेल तर) - [मूळ कोड तसाच आहे]
    clearInterval(raidInterval);
    
    // २. रेडर निवडण्यासाठी मोडल उघडा - [बदल: फक्त isJustStarting पुढे पास केला]
    openRaiderSelectionModal(team, isJustStarting);
}

/** */

function openRaiderSelectionModal(team, isJustStarting = false) {
    // STRICT LOG: हे सांगेल की हे मोडल नक्की कधी उघडलं - [मूळ कोड तसाच आहे]
    console.error(`[STRICT_LOG] 🚨 Raider Selection Modal OPENED at ${new Date().getTime()}`);
    
    const modal = document.getElementById('playerSelectModal');
    const grid = document.getElementById('playerModalGrid');
    const title = document.getElementById('playerModalTitle');
    
    if (!modal || !grid) return;

    let players = (team === 'A') ? teamAPlayers : teamBPlayers;
    title.innerText = `Select Raider (Team ${team})`;
    grid.innerHTML = "";
    
    const activeRaiders = players.filter(p => p.playingStatus === 'Playing' && p.status === 'In');
    
    activeRaiders.forEach(p => {
        // [बदल]: actuallyStartTimer मध्ये isJustStarting पॅरामीटर सुरक्षितपणे ॲड केला आहे
        grid.innerHTML += `
            <button onclick="actuallyStartTimer('${p.no}', '${p.name}', '${team}', ${isJustStarting})" 
                class="bg-gray-800 border border-gray-700 p-3 rounded-xl flex flex-col items-center active:bg-green-600 transition-all shadow-lg">
                <span class="text-xl font-black text-white">${p.no}</span>
                <span class="text-[8px] text-gray-500 font-bold uppercase truncate w-full text-center mt-1">${p.name}</span>
            </button>`;
    });

    modal.classList.replace('hidden', 'flex');
}

/**actuallyStartTimer (तुझे मूळ टायमर लॉजिक)
 * 
एकदा रेडर निवडला की हे फंक्शन तुझे टायमरचे काम पूर्ण करेल. */
/** */

function actuallyStartTimer(playerNo, playerName, team, isJustStarting = false) {
    const timestamp = Date.now();
    console.log(`[STRICT_LOG] 🏁 actuallyStartTimer START | Player: ${playerNo} | Team: ${team} | Time: ${timestamp} | JustStarting: ${isJustStarting}`);

    if (typeof closePlayerModal === "function") {
        console.log(`[STRICT_LOG] 🏠 Closing Player Modal...`);
        closePlayerModal();
    }

    const activeRaiderEl = document.getElementById('activeRaider');
    if (activeRaiderEl) {
        activeRaiderEl.innerText = `#${playerNo} ${playerName.toUpperCase()} (${team})`; 
        console.log(`[STRICT_LOG] 👤 Active Raider Set: ${playerName} (${team})`);
    }

    // 🎯 ग्लोबल मेमरीमध्ये अख्खा रायडरचा डेटा पॅकेज लॉक केला! 📦
    window.currentActiveRaider = {
        no: playerNo,
        name: playerName,
        team: team
    };

    console.log(`%c💾 [Global Raider Lock]: चालू रायडरचा पूर्ण डेटा साठवला:`, "color: #16a34a; font-weight: bold;", window.currentActiveRaider);

    // --- [SAFE GATE]: जर फक्त 'Start Raid' बटण दाबलं असेल ---
    if (isJustStarting === true) {
        console.log(`[STRICT_LOG] ⏱️ Just Starting: Manual Timer Start Triggered.`);
        
        const timerEl = document.getElementById('raidTimer');
        if (timerEl) timerEl.innerText = "30";

        let timeLeft = 30;
        
        if (typeof raidInterval !== 'undefined') clearInterval(raidInterval);

        raidInterval = setInterval(() => {
            timeLeft--;
            if (timerEl) timerEl.innerText = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(raidInterval);
                console.log("Raid Time Up!");
            }
        }, 1000);

        return; 
    }
    // -------------------------------------------------------------------------

    // १. बोनस चेक (हा सर्वात आधी व्हायला हवा)
    if (window.isBonusPending === true) {
        console.log(`[STRICT_LOG] 🎁 BONUS_PENDING Detected!`);
        window.isBonusPending = false; 

        emptyRaidCount[team] = 0;
        if (typeof updateEmptyDots === 'function') updateEmptyDots(team);

        if (typeof openBonusPointsModal === "function") {
            console.log(`[STRICT_LOG] 🔓 Opening Bonus Points Modal and STOPPING flow.`);
            openBonusPointsModal(team);
        }

        return; 
    }

    // २. इतर पेंडिंग ॲक्शन्स (Empty, Touch, Tackle)
    if (window.pendingAction) {
        const action = window.pendingAction;
        console.log(`[STRICT_LOG] 📦 Pending Action Found: ${action.type}`);
        window.pendingAction = null; 

        if (action.type === 'empty') {
            console.log(`[STRICT_LOG] ⚪ Processing Empty Raid...`);
            
            // 🚨 [THE GOLDEN DOUBLE-ENTRY FIX]: ३ऱ्या डू-ऑर-डायच्या वेळी इथून पडणारा चुुकीचा कॉल थांबवला! 🧼
            // जर सध्याचा काउंट २ असेल, तर पुढचा काउंट ३ होणार आहे (डू-ऑर-डाय आऊट). म्हणून फक्त काउंट २ पेक्षा कमी असेल तरच नॉर्मल समरी पाडा!
            if (typeof emptyRaidCount !== 'undefined' && emptyRaidCount[team] < 2) {
                if (typeof addRaidToSummary === "function") {
                    let cleanNameForSummary = `#${playerNo} ${playerName.toUpperCase()} [${team}]`;
                    let emptyDetails = `Successful Empty Raid (${emptyRaidCount[team] + 1}/3)`;
                    
                    console.log(`%c👉 [DEBUG actuallyStartTimer]: Normal Empty Raid (${emptyRaidCount[team] + 1}/3) समरी पाठवत आहे.`, "color: #22c55e; font-weight: bold;");
                    addRaidToSummary(action.team, cleanNameForSummary, 'Empty Raid', 0, emptyDetails);
                }
            } else {
                console.log(`%c🚨 [DEBUG actuallyStartTimer]: पुढचा काउंट ३ (Do-or-Die) होणार आहे! Double Entry टाळण्यासाठी सामान्य कार्ड इथून कडक ब्लॉक केले.`, "color: #ef4444; font-weight: bold;");
            }

            setTimeout(() => {
                if (typeof processEmptyRaidLogic === "function") {
                    processEmptyRaidLogic(action.team, "SELECTION_FLOW", playerNo);
                }
            }, 400);
            return; 
        }

        setTimeout(() => {
            console.log(`[STRICT_LOG] ⚡ Executing Delayed Action: ${action.type}`);
            if (action.type === 'touch') {
                handlePoint(action.team, action.points);
            } else {
                handleAction(action.team, action.type, action.points);
            }
        }, 300);
        return; 
    }

    // ३. काहीच पेंडिंग नसेल तर टायमर सुरू करा
    console.log(`[STRICT_LOG] ⏱️ Normal Flow: Starting Raid Timer.`);
    if (typeof startRaidTimer === "function") startRaidTimer(); 
}

/***** */

function stopRaidTimer() {
    clearInterval(raidInterval);
}

let currentAction = null; // { team: 'A', type: 'touch', points: 1 }

// १. टच पॉईंट बटण दाबल्यावर (Touch, Bonus+Touch साठी)
function handlePoint(team, points) {
    const ptsInt = parseInt(points);
    console.log(`>>> [TOUCH_START] Team: ${team} | Points: ${ptsInt}`);
    stopRaidTimer();

    const oppositeTeam = (team === 'A' ? 'B' : 'A');
    
    // १. मर्यादा तपासा (तुझे मूळ लॉजिक - सुरक्षित)
    const oppositePlayers = (oppositeTeam === 'A' ? teamAPlayers : teamBPlayers);
    const playersInCourt = oppositePlayers.filter(p => p.status === 'In').length;

    if (ptsInt > playersInCourt) {
        console.error(`[RESTRICTION] Only ${playersInCourt} players left. Cannot give ${ptsInt} points.`);
        Swal.fire({
            title: 'शक्य नाही!',
            text: `मैदानात फक्त ${playersInCourt} खेळाडू आहेत, त्यामुळे ${ptsInt} पॉईंट्स निवडता येणार नाहीत.`,
            icon: 'error',
            background: '#111',
            color: '#fff'
        });
        return;
    }

    const activeRaiderEl = document.getElementById('activeRaider');
    const raiderText = activeRaiderEl ? activeRaiderEl.innerText.trim().toUpperCase() : "";

    // २. रेडर चेक (जर रेडर नसेल तर पेंडिंग ठेवा - तुझे मूळ लॉजिक)
    if (raiderText === "" || raiderText.includes("WAITING")) {
        console.log(`    [FLOW] Raider missing. Storing pendingAction for Touch.`);
        window.pendingAction = { team: team, points: ptsInt, type: 'touch' };
        openRaiderSelectionModal(team);
        return;
    }

    // --- इथून पुढे समरी जोडली आहे ---
    
    // ३. समरी अपडेट (रेडर नाव काढून नोंद करणे)
    if (typeof addRaidToSummary === "function") {
        const raiderDisplayName = raiderText.split('(')[0].trim();
        console.log(`[STRICT_LOG] Adding Touch Point Summary: ${ptsInt} pts for ${raiderDisplayName}`);
     //   addRaidToSummary(team, raiderDisplayName, 'Touch Point', ptsInt, `${ptsInt} Players Out`);
    }

    // ४. टच पॉईंटसाठी डेटा सेट करा (तुझे मूळ लॉजिक)
    currentAction = { 
        team: team, 
        type: 'touch', 
        points: ptsInt 
    };

    window.requiredPlayers = ptsInt;
    window.selectedPlayersCount = 0;

    console.log(`    [DATA] currentAction set for Touch:`, currentAction);

    // ५. समोरच्या टीमचे लोक आऊट करण्यासाठी दाखवा
    openMultiPlayerModal(oppositeTeam, ptsInt, "Touch Points Out");
}

/** */

function openMorePointsModal(team) {
    console.log(`[STRICT_LOG] Opening More Points Modal for Team: ${team}`);
    
    Swal.fire({
        title: 'Select Points',
        background: '#111',
        html: `
            <div class="grid grid-cols-2 gap-3 mt-2">
                <button onclick="handlePoint('${team}', 4)" class="bg-gray-800 p-5 rounded-xl text-white font-black text-xl">4</button>
                <button onclick="handlePoint('${team}', 5)" class="bg-gray-800 p-5 rounded-xl text-white font-black text-xl">5</button>
                <button onclick="handlePoint('${team}', 6)" class="bg-gray-800 p-5 rounded-xl text-white font-black text-xl">6</button>
                <button onclick="handlePoint('${team}', 7)" class="bg-gray-800 p-5 rounded-xl text-white font-black text-xl">7</button>
            </div>
        `,
        showConfirmButton: false,
        showCancelButton: true
    });
}


// ३. मोडल उघडण्याचे मास्टर फंक्शन
function openMultiPlayerModal(teamToShow, count, headerText) {
    console.log(`>>> [MODAL_OPEN] Team: ${teamToShow} | Type: ${headerText}`);
    
    const modal = document.getElementById('playerSelectModal');
    const grid = document.getElementById('playerModalGrid');
    const title = document.getElementById('playerModalTitle');
    
    title.innerText = `Select ${count} ${headerText} (Team ${teamToShow})`;
    grid.innerHTML = "";
    
    let players = (teamToShow === 'A') ? teamAPlayers : teamBPlayers;

    players.filter(p => p.status === 'In').forEach(p => {
        // टॅकल असेल तर वेगळे फंक्शन, टच असेल तर वेगळे
        let clickFn = (currentAction.type === 'tackle' || currentAction.type === 'super_tackle') 
                      ? `selectDefenderForTackle('${p.no}', '${teamToShow}')`
                      : `selectMultiplePlayers('${p.no}', '${teamToShow}')`;

        grid.innerHTML += `
            <button id="p-btn-${p.no}" onclick="${clickFn}" 
                class="bg-gray-800 border border-gray-700 p-3 rounded-xl flex flex-col items-center active:bg-blue-600 transition-all">
                <span class="text-xl font-black text-white">${p.no}</span>
                <span class="text-[8px] text-gray-400 uppercase mt-1 truncate w-full text-center">${p.name}</span>
            </button>`;
    });

    modal.classList.replace('hidden', 'flex');
}

/** */
function startTouchSelection(team, count) {
    console.log(`[DATA] startTouchSelection: Team ${team}, Count ${count}`);
    
    // १. count ला सक्तीने नंबरमध्ये बदला (NaN टाळण्यासाठी)
    requiredPlayers = Number(count);
    selectedPlayersCount = 0;

    if (isNaN(requiredPlayers) || requiredPlayers <= 0) {
        console.error("[ERROR] Invalid count received:", count);
        requiredPlayers = 1; // डिफॉल्ट १ सेट करा जर काही चूक झाली तर
    }

    currentAction = { 
        team: team, 
        type: 'touch', 
        points: requiredPlayers 
    };

    console.log(`[MODAL] Asking to select ${requiredPlayers} players.`);
    
    // तुझे मूळ मोडल फंक्शन कॉल करा
    if (typeof openMultiPlayerModal === "function") {
        openMultiPlayerModal(team, requiredPlayers, "Touch");
    }
}


// २. प्लेयर निवडण्यासाठी मोडल उघडणे
function openPlayerModal(team, type) {
    const modal = document.getElementById('playerSelectModal');
    const grid = document.getElementById('playerModalGrid');
    
    let targetTeam;
    // १. टीम ठरवण्याचे तुझे मूळ लॉजिक
    if (type === 'out') {
        targetTeam = team; 
    } else if (type === 'tackle') {
        targetTeam = team; 
    } else {
        targetTeam = (team === 'A' ? 'B' : 'A'); 
    }

    console.log(`>>> [MODAL_OPEN] Type: ${type} | Team: ${targetTeam}`);
    
    let players = (targetTeam === 'A') ? teamAPlayers : teamBPlayers;
    grid.innerHTML = "";
    
    // २. फक्त 'In' असलेल्या खेळाडूंची लिस्ट दाखवणे
    players.filter(p => p.status === 'In').forEach(p => {
        grid.innerHTML += `
            <button onclick="selectPlayer('${p.no}', '${targetTeam}', '${type}')" 
                class="bg-gray-900 border border-gray-800 p-2.5 rounded-xl flex flex-col items-center active:bg-orange-600 transition-colors shadow-inner overflow-hidden">
                <span class="text-xl font-black text-white leading-tight">${p.no}</span>
                <span class="text-[8px] text-gray-500 font-bold uppercase truncate w-full text-center mt-0.5">
                    ${p.name}
                </span>
            </button>`;
    });

    modal.classList.replace('hidden', 'flex');
}
// ३. प्लेयर सिलेक्ट केल्यावर पॉईंट फायनल करणे
// selectPlayer मध्ये हा लॉजिक पार्ट चेक कर

function selectPlayer(playerNo, team, type) {
    console.log(`>>> [SELECT_PLAYER] No: ${playerNo} | Team: ${team} | Type: ${type}`);
    
    // 🚨 [CRITICAL MEMORY LOCK]: निवडलेल्या डिफेंडरचा नंबर ग्लोबल लिस्टमध्ये साठवला!
    // जेणेकरून पुढे चालू होणाऱ्या processPoints() ला खेळाडूचे नाव अचूक शोधता येईल.🎯
    window.selectedPlayersList = [playerNo];
    
    if (type === 'out' || type === 'tackle') {
        // १. खेळाडूला OUT करा
        updatePlayerStatus(playerNo, team, 'Out');
        
        // २. स्कोर अपडेट (जर टॅकल पॉईंट असेल तर)
        // 🚨 [BUG FIX]: बोनस+टॅकल (bonus_tackle) च्या वेळी स्कोर आधीच handleBonusTackle किंवा processPoints 
        // मधून अपडेट होतो. जर नॉर्मल टॅकल असेल, तरच इथून स्कोर अपडेट करा, अन्यथा डबल स्कोर वाढेल!
        if (window.currentAction && window.currentAction.team) {
            if (window.currentAction.type !== 'bonus_tackle') {
                updateScore(window.currentAction.team, 1);
                
                // ३. टॅकल झाल्यावर सुद्धा समोरच्याचा खेळाडू रिवाइव्ह (In) झाला पाहिजे
                if (typeof revivePlayers === "function") {
                    revivePlayers(window.currentAction.team, 1);
                }
            } else {
                console.log("ℹ️ [SELECT_PLAYER]: bonus_tackle प्रकार आढळला. स्कोर आणि रिवाइव्हल मॅनेजमेंट processPoints कडे सोपवली आहे.");
            }
            
            // 🚨 [CRITICAL ORDER FIX]: currentAction ला आत्ताच null करू नका! 
            // processPoints() पूर्ण झाल्यावर तो स्वतःहून शेवटी त्याला null करेल.
        }
    } else {
        updatePlayerStatus(playerNo, team, 'In');
    }

    // ३ऱ्या रेडच्या वेळी (Direct Out) आपण खालची फंक्शन्स थांबवतोय
    if (type !== 'out') {
        if (typeof processRaiderOutStatus === "function") processRaiderOutStatus(); 
        
        console.log(`🚀 [SELECT_PLAYER]: Calling processPoints() with Defender No: ${playerNo}`);
        if (typeof processPoints === "function") processPoints();
    }

    closePlayerModal();
    
    const raiderEl = document.getElementById('activeRaider');
    if (raiderEl) raiderEl.innerText = "WAITING FOR RAIDER...";
}

// रेडरला मॅन्युअली आऊट करण्यासाठी एक सपोर्ट फंक्शन
function processRaiderOutStatus() {
    const raiderName = document.getElementById('activeRaider').innerText;
    // इथे तुझं प्लेयरचा स्टेटस 'Out' करण्याचं लॉजिक टाक
    // उदा. शोधून काढा की कोणत्या टीमचा हा खेळाडू आहे आणि त्याला आऊट करा.
    console.log(`[STATUS] Raider ${raiderName} marked as OUT.`);
}

/** 
function processPoints99() {
    // १. सुरक्षा तपासणी: जर currentAction नसेल तर पुढे जाऊ नका
    if (!currentAction) {
        console.error(">>> [PROCESS_ERROR] No currentAction found to process!");
        return;
    }

    // २. [CRITICAL ORDER]: UI रिसेट करण्यापूर्वी सर्व आवश्यक डेटा व्हेरिएबल्समध्ये काढून घ्या
    const { team, type, points, raiderName } = currentAction;
    const oppositeTeam = (team === 'A' ? 'B' : 'A');

    // एक्टिव रेडरचे नाव मिळवा (UI वरून किंवा currentAction मधून)
    const activeRaiderEl = document.getElementById('activeRaider');
    const currentRaider = raiderName || (activeRaiderEl && activeRaiderEl.innerText !== "NONE (WAITING)" 
                         ? activeRaiderEl.innerText.split('(')[0].trim() 
                         : "Raider");

    console.log(`--- [PROCESS_START] ---`);
    console.log(`[ACTION_INFO] Processing ${type} for Team ${team} | Raider: ${currentRaider}`);

    // ३. [CLEANUP]: डेटा वाचून झाल्यावर आता UI रिसेट करा (जेणेकरून NONE चा प्रॉब्लेम येणार नाही)
    if (activeRaiderEl) {
        console.log(`[CLEANUP] Resetting activeRaider UI...`);
        activeRaiderEl.innerText = "NONE (WAITING)";
        activeRaiderEl.classList.remove('text-green-400', 'text-blue-400');
    }

    // 🚨 [NEW GLOBAL TRACK FIX]: रायडरचे नाव जर्सी नंबर आणि टीम प्रिफिक्ससह कडक फॉरमॅट करा!
    let raiderTeamPrefix = (team === 'A') ? 'A' : 'B'; // टच पॉईंट मारणाऱ्या रायडरची स्वतःची टीम
    let cleanRaiderHeader = "";
    if (window.currentActiveRaider) {
        cleanRaiderHeader = `#${window.currentActiveRaider.no} ${window.currentActiveRaider.name.toUpperCase()} [${raiderTeamPrefix}]`;
    } else {
        // जर ग्लोबल मेमरी नसेल तर जुन्या नावातून प्रिफिक्स लावा
        let raiderClean = currentRaider.replace(/[^a-zA-Z0-9 ]/g, "").trim();
        cleanRaiderHeader = `${raiderClean} [${raiderTeamPrefix}]`;
    }

    // ४. आऊट झालेल्या खेळाडूंची यादी तयार करा (टच आणि बोनस टचसाठी नाव-नंबर ट्रॅकरसह 🎯)
    let outPlayersInfo = "";
    if (window.selectedPlayersList && window.selectedPlayersList.length > 0) {
        let mappedOutPlayers = window.selectedPlayersList.map(no => {
            // जर्सी नंबरवरून बाद झालेल्या खेळाडूची मूळ टीम ओळखा (१ ते १२ = A, २१ ते ३२ = B)
            let pTeam = (parseInt(no) >= 21) ? 'B' : 'A';
            let pList = (pTeam === 'A') ? teamAPlayers : teamBPlayers;
            let pObj = pList.find(p => p.no == no);
            
            // फॉरमॅट ➔ #21 S. MAHADIK [B]
            return pObj ? `#${pObj.no} ${pObj.name.toUpperCase()} [${pTeam}]` : `#${no} [${pTeam}]`;
        });
        outPlayersInfo = "Out " + mappedOutPlayers.join(", ");
    } else {
        outPlayersInfo = points + " Players Out";
    }

    // ५. [LOGIC SECTION]: सर्व नियम आणि ब्युटीफिकेशन अचूक लागू केले आहे 🚀
    if (type === 'touch') {
        updateScore(team, points);
        addRaidToSummary(team, cleanRaiderHeader, 'TOUCH POINT', points, outPlayersInfo);
    } 
    else if (type === 'bonus_touch') {
        updateScore(team, points); 
        addRaidToSummary(team, cleanRaiderHeader, 'BONUS + TOUCH', points, outPlayersInfo);
    }
    else if (type === 'tackle') {
        updateScore(team, 1);
        
        // 🚨 पकडणाऱ्या डिफेंडरचा नंबर आणि नाव शोधणे
        let defenderNo = (window.selectedPlayersList && window.selectedPlayersList.length > 0) ? window.selectedPlayersList[0] : null;
        let defenderInfo = "Defender";
        if (defenderNo) {
            let defTeamList = (team === 'A') ? teamAPlayers : teamBPlayers;
            let pObj = defTeamList.find(p => p.no == defenderNo);
            defenderInfo = pObj ? `#${pObj.no} ${pObj.name.toUpperCase()} [${team}]` : `#${defenderNo} [${team}]`;
        }
        
        // 🚨 टॅकलमध्ये रायडर विरोधी संघातून येतो म्हणून oppositeTeam चा प्रिफिक्स लावणे
        let tackleRaiderHeader = "";
        if (window.currentActiveRaider) {
            tackleRaiderHeader = `#${window.currentActiveRaider.no} ${window.currentActiveRaider.name.toUpperCase()} [${oppositeTeam}]`;
        } else {
            tackleRaiderHeader = `${currentRaider} [${oppositeTeam}]`;
        }
        
        addRaidToSummary(team, tackleRaiderHeader, 'TACKLE', 1, `Caught by ${defenderInfo}`);
    }
    else if (type === 'super_tackle') {
        updateScore(team, 2);
        
        // 🚨 सर्व डिफेंडर्सचे नंबर आणि नावे एकत्र करणे
        let defendersInfo = "Defenders";
        if (window.selectedPlayersList && window.selectedPlayersList.length > 0) {
            let defTeamList = (team === 'A') ? teamAPlayers : teamBPlayers;
            let mapped = window.selectedPlayersList.map(no => {
                let pObj = defTeamList.find(p => p.no == no);
                return pObj ? `#${pObj.no} ${pObj.name.toUpperCase()} [${team}]` : `#${no} [${team}]`;
            });
            defendersInfo = mapped.join(', ');
        }
        
        let tackleRaiderHeader = "";
        if (window.currentActiveRaider) {
            tackleRaiderHeader = `#${window.currentActiveRaider.no} ${window.currentActiveRaider.name.toUpperCase()} [${oppositeTeam}]`;
        } else {
            tackleRaiderHeader = `${currentRaider} [${oppositeTeam}]`;
        }
        
        addRaidToSummary(team, tackleRaiderHeader, 'SUPER TACKLE', 2, `Caught by ${defendersInfo}`);
    }
    else if (type === 'bonus_tackle') {
        updateScore(team, 1);
        updateScore(oppositeTeam, 1);
        
        let tackleRaiderHeader = "";
        if (window.currentActiveRaider) {
            tackleRaiderHeader = `#${window.currentActiveRaider.no} ${window.currentActiveRaider.name.toUpperCase()} [${oppositeTeam}]`;
        } else {
            tackleRaiderHeader = `${currentRaider} [${oppositeTeam}]`;
        }
        
        addRaidToSummary(team, tackleRaiderHeader, 'BONUS + TACKLE', 1, 'Bonus scored but Tackled');
    }
    else if (type === 'self_out') {
        updateScore(team, points);
        addRaidToSummary(team, cleanRaiderHeader, 'SELF OUT', points, 'Raider went out of bounds');
    }
    else if (type === 'technical') {
        updateScore(team, points);
        addRaidToSummary(team, 'OFFICIALS', 'TECHNICAL POINT', points, 'Technical Violation');
    }

    // ६. [REVIVAL LOGIC]: रिवाइव्हलचे नियम (जुनेच आहेत)
    let pointsToRevive = 0;
    if (type === 'touch') pointsToRevive = points;
    else if (type === 'bonus_touch') pointsToRevive = points - 1;
    else if (type === 'tackle' || type === 'super_tackle' || type === 'bonus_tackle') pointsToRevive = 1;

    if (pointsToRevive > 0 && typeof revivePlayers === "function") {
        revivePlayers(team, pointsToRevive);
    }

    // ७. [EMPTY RAID RESET]: एम्प्टी रेड सिस्टिम रिसेट
    if (type === 'touch' || type === 'bonus_touch' || type === 'bonus_tackle') {
        if (typeof emptyRaidCount !== 'undefined') emptyRaidCount[team] = 0;
        if (typeof updateEmptyDots === "function") updateEmptyDots(team);
    }

    // ८. अंतिम क्लिनअप: मेमरी रिसेट करा
    window.selectedPlayersList = []; 
    currentAction = null;
    
    console.log(`--- [PROCESS_END] ---`);
}
*/

function processPoints() {
    // १. सुरक्षा तपासणी: जर currentAction नसेल तर पुढे जाऊ नका
    if (!currentAction) {
        console.error(">>> [PROCESS_ERROR] No currentAction found to process!");
        return;
    }

    // २. [CRITICAL ORDER]: UI रिसेट करण्यापूर्वी सर्व आवश्यक डेटा व्हेरिएबल्समध्ये काढून घ्या
    const { team, type, points, raiderName } = currentAction;
    const oppositeTeam = (team === 'A' ? 'B' : 'A');

    // एक्टिव रेडरचे नाव मिळवा (UI वरून किंवा currentAction मधून)
    const activeRaiderEl = document.getElementById('activeRaider');
    const currentRaider = raiderName || (activeRaiderEl && activeRaiderEl.innerText !== "NONE (WAITING)" 
                          ? activeRaiderEl.innerText.split('(')[0].trim() 
                          : "Raider");

    console.log(`--- [PROCESS_START] ---`);
    console.log(`[ACTION_INFO] Processing ${type} for Team ${team} | Raider: ${currentRaider}`);

    // ३. [CLEANUP]: डेटा वाचून झाल्यावर आता UI रिसेट करा (जेणेकरून NONE चा प्रॉब्लेम येणार नाही)
    if (activeRaiderEl) {
        console.log(`[CLEANUP] Resetting activeRaider UI...`);
        activeRaiderEl.innerText = "NONE (WAITING)";
        activeRaiderEl.classList.remove('text-green-400', 'text-blue-400');
    }

    // 🚨 [NEW GLOBAL TRACK FIX]: रायडरचे नाव जर्सी नंबर आणि टीम प्रिफिक्ससह कडक फॉरमॅट करा!
    let raiderTeamPrefix = (team === 'A') ? 'A' : 'B'; // टच पॉईंट मारणाऱ्या रायडरची स्वतःची टीम
    let cleanRaiderHeader = "";
    if (window.currentActiveRaider) {
        cleanRaiderHeader = `#${window.currentActiveRaider.no} ${window.currentActiveRaider.name.toUpperCase()} [${raiderTeamPrefix}]`;
    } else {
        // जर ग्लोबल मेमरी नसेल तर जुन्या नावातून प्रिफिक्स लावा
        let raiderClean = currentRaider.replace(/[^a-zA-Z0-9 ]/g, "").trim();
        cleanRaiderHeader = `${raiderClean} [${raiderTeamPrefix}]`;
    }

    // ४. आऊट झालेल्या खेळाडूंची यादी तयार करा (टच आणि बोनस टचसाठी नाव-नंबर ट्रॅकरसह 🎯)
    let outPlayersInfo = "";
    if (window.selectedPlayersList && window.selectedPlayersList.length > 0) {
        let mappedOutPlayers = window.selectedPlayersList.map(no => {
            // जर्सी नंबरवरून बाद झालेल्या खेळाडूची मूळ टीम ओळखा (१ ते १२ = A, २१ ते ३२ = B)
            let pTeam = (parseInt(no) >= 21) ? 'B' : 'A';
            let pList = (pTeam === 'A') ? teamAPlayers : teamBPlayers;
            let pObj = pList.find(p => p.no == no);
            
            // फॉरमॅट ➔ #21 S. MAHADIK [B]
            return pObj ? `#${pObj.no} ${pObj.name.toUpperCase()} [${pTeam}]` : `#${no} [${pTeam}]`;
        });
        outPlayersInfo = "Out " + mappedOutPlayers.join(", ");
    } else {
        outPlayersInfo = points + " Players Out";
    }

    // ५. [LOGIC SECTION]: सर्व नियम आणि ब्युटीफिकेशन अचूक लागू केले आहे 🚀
    if (type === 'touch') {
        updateScore(team, points);
        addRaidToSummary(team, cleanRaiderHeader, 'TOUCH POINT', points, outPlayersInfo);
    } 
    else if (type === 'bonus_touch') {
        updateScore(team, points); 
        addRaidToSummary(team, cleanRaiderHeader, 'BONUS + TOUCH', points, outPlayersInfo);
    }
// =========================================================================
    // 🎁 [BONUS ONLY LOGIC]: कन्सोल लॉग्जसह कडक नेमिंग ट्रॅकर पॅच
    // =========================================================================
    else if (type === 'bonus' || type === 'bonus_only') {
        updateScore(team, 1); 

        // 🎯 [🔍 CONSOLE LOG 1]: बोनस ॲक्शन सुरू होताच येणारा मूळ डेटा
        console.log(`%c📥 [DEBUG BONUS START]: Team: ${team} | Original Raider Text: "${currentRaider}"`, "color: #a855f7; font-weight: bold;");

        let raiderTeamPrefix = (team === 'A' ? 'A' : 'B');
        let cleanRaiderHeader = "";
        
        if (window.currentActiveRaider) {
            cleanRaiderHeader = `#${window.currentActiveRaider.no} ${window.currentActiveRaider.name.toUpperCase()} [${raiderTeamPrefix}]`;
            // 🎯 [🔍 CONSOLE LOG 2]: ग्लोबल मेमरीमधून डेटा कसा तयार झाला
            console.log(`%c✅ [DEBUG BONUS]: Global Memory मधून नाव तयार केले ➔ "${cleanRaiderHeader}"`, "color: #16a34a; font-weight: bold;");
        } else {
            let raiderClean = currentRaider.replace(/[^a-zA-Z0-9 ]/g, "").trim();
            cleanRaiderHeader = `${raiderClean} [${raiderTeamPrefix}]`;
            // 🎯 [🔍 CONSOLE LOG 3]: टेक्स्ट पार्सिंग करून डेटा कसा तयार झाला
            console.log(`%c🧠 [DEBUG BONUS]: Text Parsing करून नाव तयार केले ➔ "${cleanRaiderHeader}"`, "color: #3b82f6; font-weight: bold;");
        }

        let bonusDetails = "Scored 1 Bonus Point Successfully";

        // 🎯 [🔍 CONSOLE LOG 4]: फायनल डिलिव्हरी चेक - समरीला नक्की काय नाव जात आहे!
        console.log(`%c🚀 [DEBUG BONUS SEND]: addRaidToSummary ला पाठवले जाणारे नाव ➔ "${cleanRaiderHeader}"`, "color: #ff007f; font-weight: bold; padding: 2px;");
        
        // 🚨 [THE ACTUAL CRITICAL FIX]: इथे आपण 'currentRaider' ऐवजी 'cleanRaiderHeader' अधिकृतपणे पाठवला! 🦾
        addRaidToSummary(team, cleanRaiderHeader, 'BONUS POINT', 1, bonusDetails);
    }
    else if (type === 'tackle') {
        updateScore(team, 1);
        
        // 🚨 पकडणाऱ्या傾फेंडरचा नंबर आणि नाव शोधणे
        let defenderNo = (window.selectedPlayersList && window.selectedPlayersList.length > 0) ? window.selectedPlayersList[0] : null;
        let defenderInfo = "Defender";
        if (defenderNo) {
            let defTeamList = (team === 'A') ? teamAPlayers : teamBPlayers;
            let pObj = defTeamList.find(p => p.no == defenderNo);
            defenderInfo = pObj ? `#${pObj.no} ${pObj.name.toUpperCase()} [${team}]` : `#${defenderNo} [${team}]`;
        }
        
        // 🚨 टॅकलमध्ये रायडर विरोधी संघातून येतो म्हणून oppositeTeam चा प्रिफिक्स लावणे
        let tackleRaiderHeader = "";
        if (window.currentActiveRaider) {
            tackleRaiderHeader = `#${window.currentActiveRaider.no} ${window.currentActiveRaider.name.toUpperCase()} [${oppositeTeam}]`;
        } else {
            tackleRaiderHeader = `${currentRaider} [${oppositeTeam}]`;
        }
        
        addRaidToSummary(team, tackleRaiderHeader, 'TACKLE', 1, `Caught by ${defenderInfo}`);
    }
    else if (type === 'super_tackle') {
        updateScore(team, 2);
        
        // 🚨 सर्व डिफेंडर्सचे नंबर आणि नावे एकत्र करणे
        let defendersInfo = "Defenders";
        if (window.selectedPlayersList && window.selectedPlayersList.length > 0) {
            let defTeamList = (team === 'A') ? teamAPlayers : teamBPlayers;
            let mapped = window.selectedPlayersList.map(no => {
                let pObj = defTeamList.find(p => p.no == no);
                return pObj ? `#${pObj.no} ${pObj.name.toUpperCase()} [${team}]` : `#${no} [${team}]`;
            });
            defendersInfo = mapped.join(', ');
        }
        
        let tackleRaiderHeader = "";
        if (window.currentActiveRaider) {
            tackleRaiderHeader = `#${window.currentActiveRaider.no} ${window.currentActiveRaider.name.toUpperCase()} [${oppositeTeam}]`;
        } else {
            tackleRaiderHeader = `${currentRaider} [${oppositeTeam}]`;
        }
        
        addRaidToSummary(team, tackleRaiderHeader, 'SUPER TACKLE', 2, `Caught by ${defendersInfo}`);
    }
    // =========================================================================
    // 🛑 processPoints() च्या आतील BONUS + TACKLE चा कडक सिंक विभाग
    // =========================================================================
    else if (type === 'bonus_tackle') {
        updateScore(team, 1);          // टॅकल करणाऱ्या डिफेंडर टीमला १ गुण (Team B)
        updateScore(oppositeTeam, 1);  // बोनस मारणाऱ्या रायडर टीमला १ गुण (Team A)
        
        // 🚨 [MISSING NAME FIX]: डिफेंडरचा नंबर selectedPlayersList मधून किंवा थेट मेमरीमधून ट्रॅक करणे
        let defenderNo = (window.selectedPlayersList && window.selectedPlayersList.length > 0) ? window.selectedPlayersList[0] : null;
        
        // जर लिस्ट रिकामी असेल तर सिस्टीममध्ये नुकताच निवडलेला खेळाडू शोधण्याचा कडक बॅकअप
        if (!defenderNo && typeof currentSelectedPlayerNo !== 'undefined') {
            defenderNo = currentSelectedPlayerNo;
        }

        let defenderInfo = "DEFENDER";
        if (defenderNo) {
            let defTeamList = (team === 'A') ? teamAPlayers : teamBPlayers;
            let pObj = defTeamList.find(p => p.no == defenderNo);
            defenderInfo = pObj ? `#${pObj.no} ${pObj.name.toUpperCase()} [${team}]` : `#${defenderNo} [${team}]`;
        }
        
        // रायडरचे नाव जे आपण handleBonusTackle मधून पाठवले होते
        let tackleRaiderHeader = raiderName || cleanRaiderHeader || `${currentRaider} [${oppositeTeam}]`;
        
        let finalDetailsText = `Scored 1 Bonus, but beautifully Caught by ${defenderInfo}`;
        console.log(`%c✅ [BONUS_TACKLE SUCCESS]: Single Entry Generated ➔ Raider: ${tackleRaiderHeader} | Details: ${finalDetailsText}`, "color: #10b981; font-weight: bold;");

        // 🚨 फक्त आणि फक्त इथूनच एकमेव अधिकृत कार्ड मॅच टाईमलाईन आणि डेटाबेसला पाठवले जाईल!
        if (typeof addRaidToSummary === "function") {
            addRaidToSummary(oppositeTeam, tackleRaiderHeader, 'BONUS + TACKLE', 1, finalDetailsText);
        }
    }
    else if (type === 'self_out') {
        updateScore(team, points);
        addRaidToSummary(team, cleanRaiderHeader, 'SELF OUT', points, 'Raider went out of bounds');
    }
    else if (type === 'technical') {
        updateScore(team, points);
        addRaidToSummary(team, 'OFFICIALS', 'TECHNICAL POINT', points, 'Technical Violation');
    }

    // ६. [REVIVAL LOGIC]: रिवाइव्हलचे नियम (जुनेच आहेत)
    let pointsToRevive = 0;
    if (type === 'touch') pointsToRevive = points;
    else if (type === 'bonus_touch') pointsToRevive = points - 1;
    else if (type === 'tackle' || type === 'super_tackle' || type === 'bonus_tackle') pointsToRevive = 1;

    if (pointsToRevive > 0 && typeof revivePlayers === "function") {
        revivePlayers(team, pointsToRevive);
    }

    // ७. [EMPTY RAID RESET]: एम्प्टी領सिस्टिम रिसेट (🚨 बोनस इव्हेंट्स इथे ० रीसेटसाठी ॲड केले आहेत)
    if (type === 'touch' || type === 'bonus_touch' || type === 'bonus_tackle' || type === 'bonus' || type === 'bonus_only') {
        if (typeof emptyRaidCount !== 'undefined') emptyRaidCount[team] = 0;
        if (typeof updateEmptyDots === "function") updateEmptyDots(team);
    }

    // ८. अंतिम क्लिनअप: मेमरी रिसेट करा
    window.selectedPlayersList = []; 
    currentAction = null;
    
    console.log(`--- [PROCESS_END] ---`);
}
/*** */

function revivePlayers(team, count) {
    console.log(`>>> [REVIVE_START] Team: ${team} | Points to Revive: ${count}`);
    
    let players = (team === 'A' ? teamAPlayers : teamBPlayers);
    let currentInCount = players.filter(p => p.status === 'In').length;
    
    console.log(`    [CHECK] Current In-Court: ${currentInCount}/7`);

    if (currentInCount >= 7) {
        console.log(`    [SKIP] Already 7 players. No revival possible.`);
        return;
    }

    let maxCanRevive = 7 - currentInCount;
    let actualReviveCount = Math.min(count, maxCanRevive);

    // सॉर्टिंग आणि फिल्टरिंगचे स्टेप-बाय-स्टेप लॉक्स
    let outPlayers = players.filter(p => p.status === 'Out');
    console.log(`    [DEBUG] Total Out Players found: ${outPlayers.length}`);

    outPlayers.sort((a, b) => {
        let timeA = a.outTime || Infinity;
        let timeB = b.outTime || Infinity;
        console.log(`    [SORTING] Comparing No.${a.no} (Time: ${timeA}) vs No.${b.no} (Time: ${timeB})`);
        return timeA - timeB;
    });

    console.log(`    [FINAL_SEQUENCE] Order to Revive:`, outPlayers.map(p => `No.${p.no} (Time: ${p.outTime})`));

    for (let i = 0; i < actualReviveCount; i++) {
        if (outPlayers[i]) {
            console.log(`    [REVIVE_EXEC] Executing Revival for index ${i}: Player No.${outPlayers[i].no}`);
            updatePlayerStatus(outPlayers[i].no, team, 'In');
        }
    }
    updateVisualPlayers(); // नवीन बदल
}

/**
 * Bonus बटणाचे लॉजिक हे कबड्डी स्कोअरिंगमध्ये सर्वात आव्हानात्मक असते, पण तू सांगितलेली पद्धत एकदम 'User-Friendly' आहे.
यामध्ये आपण दोन गोष्टींची काळजी घेऊया:
जर 'Start Raid' विसरलो असेल, तर आधी रेडर कोण आहे ते विचारू.
त्यानंतर बोनससोबत किती टच पॉईंट्स आहेत (0 ते 7) त्याचा पॉपअप देऊ.
 * 
 */
let isBonusPending = false; // हे ग्लोबल व्हेरिएबल वरती डिक्लेअर कर

function handleBonus(team) {
    const ts = Date.now();
    console.log(`[BONUS_DEBUG] Step 1: handleBonus Clicked | Team: ${team} | TS: ${ts}`);
    
    if (typeof stopRaidTimer === "function") {
        stopRaidTimer();
        console.log(`[BONUS_DEBUG] Step 2: stopRaidTimer called`);
    }

    const activeRaiderEl = document.getElementById('activeRaider');
    const activeRaiderText = activeRaiderEl ? activeRaiderEl.innerText.trim().toUpperCase() : "";
    console.log(`[BONUS_DEBUG] Step 3: Raider Text found: "${activeRaiderText}"`);

    const isWaiting = activeRaiderText === "" || activeRaiderText.includes("WAITING") || activeRaiderText.includes("NONE");

    if (isWaiting) {
        console.log(`[BONUS_DEBUG] Step 4: Raider Missing. Setting isBonusPending = true`);
        window.isBonusPending = true; 

        Swal.fire({
            title: 'Select Raider First!',
            text: 'बोनस देण्यापूर्वी रेडर कोण आहे ते निवडा.',
            icon: 'warning',
            confirmButtonText: 'Select Raider'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(`[BONUS_DEBUG] Step 5: Swal Confirmed. Opening Selection Modal for ${team}`);
                openRaiderSelectionModal(team);
            }
        });
        return;
    }

    console.log(`[BONUS_DEBUG] Step 4: Raider already present. Opening Bonus Modal Directly.`);
    openBonusPointsModal(team);
}


/** */

function openBonusPointsModal(team) {
    Swal.fire({
        title: 'BONUS ACTION',
        background: '#111',
        html: `
            <div class="grid grid-cols-4 gap-3 mt-4">
                <button onclick="processBonus('${team}', 0)" class="bg-gray-800 py-4 rounded-xl text-white font-black">0</button>
                <button onclick="processBonus('${team}', 1)" class="bg-gray-800 py-4 rounded-xl text-white font-black">+1</button>
                <button onclick="processBonus('${team}', 2)" class="bg-gray-800 py-4 rounded-xl text-white font-black">+2</button>
                <button onclick="processBonus('${team}', 3)" class="bg-gray-800 py-4 rounded-xl text-white font-black">+3</button>
            </div>
            
            <div class="mt-4">
                <button onclick="handleBonusTackle('${team}')" 
                    class="w-full bg-red-900/40 border border-red-600 py-4 rounded-xl text-red-500 font-black uppercase text-xs">
                    Bonus + Tackle (Raider Out)
                </button>
            </div>
        `,
        showConfirmButton: false,
        showCancelButton: true
    });
}

//=========================================================================
//@BONUS
//=========================================================================

let selectedPlayersCount = 0;
let requiredPlayers = 0;

/** */
// =========================================================================
// 🎁 १. processBonus() - नुसता बोनस आणि बोनस+टचचा कडक नेमिंग पॅच 🎯
// =========================================================================
function processBonus(team, touchPoints) {
    const ts = Date.now();
    console.log(`[BONUS_DEBUG] processBonus Start | Team: ${team} | TouchPts: ${touchPoints} | TS: ${ts}`);
    
    Swal.close();
    
    const ptsInt = parseInt(touchPoints);
    window.requiredPlayers = ptsInt;
    window.selectedPlayersCount = 0;
    const oppositeTeam = (team === 'A' ? 'B' : 'A');

    const activeRaiderEl = document.getElementById('activeRaider');
    const raiderRawText = activeRaiderEl ? activeRaiderEl.innerText.trim() : "";
    const raiderName = activeRaiderEl ? activeRaiderEl.innerText.split('(')[0].trim() : "Raider";

    // 🚨 [PREFIX SECURITY GATE]: रायडरचे नाव जर्सी नंबर आणि [A]/[B] ब्रॅकेटसह कडक तयार करणे
    let raiderTeamPrefix = (team === 'A' ? 'A' : 'B');
    let cleanRaiderHeader = "";

    if (window.currentActiveRaider) {
        cleanRaiderHeader = `#${window.currentActiveRaider.no} ${window.currentActiveRaider.name.toUpperCase()} [${raiderTeamPrefix}]`;
    } else {
        let raiderClean = raiderName.replace(/[^a-zA-Z0-9 ]/g, "").replace("WAITING FOR RAIDER", "").trim();
        cleanRaiderHeader = raiderClean.includes("#") ? `${raiderClean} [${raiderTeamPrefix}]` : `${raiderClean} [${raiderTeamPrefix}]`;
    }

    if (ptsInt === 0) {
        // --- १. फक्त बोनस (+1) ---
        updateScore(team, 1);
        
        // एम्प्टी領डॉट्स रिसेट (तुझे मूळ लॉजिक सुरक्षित)
        if (typeof emptyRaidCount !== 'undefined') emptyRaidCount[team] = 0;
        if (typeof updateEmptyDots === "function") updateEmptyDots(team);
        
        // --- २. समरी अपडेट (🚨 इथे आपण 'cleanRaiderHeader' अधिकृतपणे पास केला!) ---
        if (typeof addRaidToSummary === "function") {
            console.log(`%c🚀 [BONUS_ENGINE_SEND]: addRaidToSummary ला पाठवलेले नाव ➔ "${cleanRaiderHeader}"`, "color: #10b981; font-weight: bold;");
            addRaidToSummary(team, cleanRaiderHeader, 'BONUS POINT', 1, 'Technical Bonus');
        }

        Swal.fire({ title: 'Bonus Only!', icon: 'success', toast: true, position: 'top', timer: 1500 });

        // --- ३. रेड क्लोज करणे आणि क्लीनअप ---
        if (activeRaiderEl) {
            console.log(`[CLEANUP] Resetting activeRaider after Only Bonus...`);
            activeRaiderEl.innerText = "NONE (WAITING)";
            activeRaiderEl.classList.remove('text-green-400', 'text-blue-400');
        }

        currentAction = null;
        window.selectedPlayersList = [];

    } else {
        // --- बोनस (+1) + टच पॉईंट्स (मूळ लॉजिक जसे आहे तसेच सुरक्षित) ---
        console.log(`[BONUS_DEBUG] Bonus + Touch points. Opening Modal for Team: ${oppositeTeam}`);
        
        const totalPoints = 1 + ptsInt;

        // 🚨 [CRITICAL]: इथे देखील 'cleanRaiderHeader' आपण ॲक्शनमध्ये पॅक केला, जेणेकरून 
        // processPoints ला पुढे जाताना ब्रॅकेट मॅचिंगमध्ये कोणतीही अडचण येणार नाही!
        currentAction = { 
            team: team, 
            type: 'bonus_touch', 
            points: totalPoints,
            raiderName: cleanRaiderHeader
        };

        // डिफेन्डर निवडण्यासाठी मोडल उघडा
        openMultiPlayerModal(oppositeTeam, ptsInt, "Bonus Touch Out"); 
    }
}

// =========================================================================
// 🛑 २. handleBonusTackle() - बोनस+टॅकलचा वॉटर-टाईट नेमिंग पॅच 🎯
// =========================================================================
function handleBonusTackle(raiderTeam) {
    console.log(`[STRICT_LOG] 🛑 handleBonusTackle START | Raider Team: ${raiderTeam}`);
    Swal.close();

    const defenderTeam = (raiderTeam === 'A' ? 'B' : 'A');
    const activeRaiderEl = document.getElementById('activeRaider');
    const raiderRaw = activeRaiderEl ? activeRaiderEl.innerText : "";
    const raiderName = raiderRaw.split('(')[0].trim();

    // 🚨 [PREFIX SECURITY GATE]: बोनस+टॅकलसाठी रायडरचे नाव ब्रॅकेटसह शुद्ध करणे
    let cleanRaiderHeader = "";
    if (window.currentActiveRaider) {
        cleanRaiderHeader = `#${window.currentActiveRaider.no} ${window.currentActiveRaider.name.toUpperCase()} [${raiderTeam}]`;
    } else {
        let raiderClean = raiderName.replace(/[^a-zA-Z0-9 ]/g, "").trim();
        cleanRaiderHeader = raiderClean.includes("#") ? `${raiderClean} [${raiderTeam}]` : `${raiderClean} [${raiderTeam}]`;
    }

    // १. एम्प्टी काउंट रिसेट करा
    if (typeof emptyRaidCount !== 'undefined') emptyRaidCount[raiderTeam] = 0; 
    if (typeof updateEmptyDots === 'function') updateEmptyDots(raiderTeam);

    // २. रायडरला आऊट करा
    let raiderNoMatch = raiderRaw.match(/\d+/); 
    let finalRaiderNo = raiderNoMatch ? raiderNoMatch[0] : null;
    
    if (finalRaiderNo) {
        console.log(`[STRICT_LOG] Raider ${finalRaiderNo} marked as Out in state.`);
        updatePlayerStatus(finalRaiderNo, raiderTeam, 'Out');
    }

    // 🚨 [THE DOUBLE-ENTRY FIX]: इथूनaddRaidToSummary चा जुना कॉल काढून टाकला आहे, 
    // जेणेकरून मोडलमधून डिफेंडर निवडायच्या आधीच चुकीचे कार्ड पडणार नाही! 🧼

    // ३. करंट ॲक्शन पॅकेज तयार करणे
    currentAction = { 
        team: defenderTeam, // पॉईंट मिळवणाऱ्या डिफेंडरची टीम
        type: 'bonus_tackle', 
        points: 1,
        raiderName: cleanRaiderHeader // मूळ बाद झालेला रायडर ब्रॅकेट प्रिफिक्ससह साठवला
    };

    console.log(`[FLOW] Opening Defender List for Team ${defenderTeam} to fix missing defender name...`);
    
    // तुझ्या प्रोजेक्ट रचनेनुसार सिंगल प्लेयर मोडल अचूकपणे ओपन करणे
    if (typeof openPlayerModal === "function") {
        openPlayerModal(defenderTeam, 'tackle'); 
    }

    Swal.fire({
        title: 'Bonus + Tackle!',
        text: 'आता टॅकल करणाऱ्या डिफेंडरला निवडा.',
        icon: 'success',
        toast: true, position: 'top', timer: 2000, showConfirmButton: false
    });
}


/** */
function renderMiniPlayers() {
    console.log(`>>> [RENDER_UI] Refreshing Mini Players and Out Lists...`);
    
    const containerA = document.getElementById('miniInA');
    const containerB = document.getElementById('miniInB');
    const outListA = document.getElementById('outListA'); 
    const outListB = document.getElementById('outListB');

    // Team A Logic
    const outA = teamAPlayers.filter(p => p.status === 'Out' && p.outTime !== null)
                             .sort((a, b) => a.outTime - b.outTime);
    if (outListA) {
        outListA.innerText = outA.length > 0 ? `OUT: ${outA.map(p => p.no).join(', ')}` : "OUT: -";
        console.log(`    [UI_UPDATE] Team A Out List: ${outListA.innerText}`);
    }

    // Team B Logic
    const outB = teamBPlayers.filter(p => p.status === 'Out' && p.outTime !== null)
                             .sort((a, b) => a.outTime - b.outTime);
    if (outListB) {
        outListB.innerText = outB.length > 0 ? `OUT: ${outB.map(p => p.no).join(', ')}` : "OUT: -";
        console.log(`    [UI_UPDATE] Team B Out List: ${outListB.innerText}`);
    }

    // आयकॉन्स रेंडरिंग (तुझा जुना कोड)
    if(containerA) {
        containerA.innerHTML = teamAPlayers.map(p => 
            `<span class="${p.status === 'In' ? 'text-green-500' : 'text-red-600'} text-xs">👤</span>`
        ).join('');
    }
    if(containerB) {
        containerB.innerHTML = teamBPlayers.map(p => 
            `<span class="${p.status === 'In' ? 'text-green-500' : 'text-red-600'} text-xs">👤</span>`
        ).join('');
    }
}

/*** */

function updatePlayerStatus(playerNo, teamPrefix, newStatus) {
    // 🎯 [📥 SCAN LOG 3]: फंक्शनच्या सुरुवातीला एंट्री झाली का आणि काय डेटा आला?
    console.log(`%c📥 [DEBUG updatePlayerStatus ENTER]: Received Player: ${playerNo} | Team: ${teamPrefix} | New Status: ${newStatus}`, "color: #06b6d4; font-weight: bold;");
    
    let targetList = (teamPrefix === 'A') ? teamAPlayers : teamBPlayers;
    let player = targetList.find(p => p.no == playerNo);
    
    if (player) {
        // 🎯 [✅ SCAN LOG 4]: खेळाडू मेमरीमध्ये सापडला!
        console.log(`%c✅ [DEBUG updatePlayerStatus]: Player No.${playerNo} found in Team ${teamPrefix}. Changing status from "${player.status}" ➔ "${newStatus}"`, "color: #16a34a; font-weight: bold;");
        
        player.status = newStatus;

        if (newStatus === 'Out') {
            player.outTime = Date.now(); 
            console.log(`    [OUT_LOG] Time set for Player ${playerNo}: ${player.outTime}`);
            
            // 🎯 [👉 SCAN LOG 5]: आउट सिक्वेन्स फंक्शन चालण्याच्या ठीक आधी
            console.log(`%c👉 [DEBUG updatePlayerStatus]: Calling updateOutSequence for Player #${playerNo}, Team ${teamPrefix}, Status: 'Out'`, "color: #ea580c; font-weight: bold;");
            
            // १. आउट सिक्वेन्स अपडेट करा
            updateOutSequence(playerNo, teamPrefix, 'Out');

            // २. ऑल आऊट चेक करा
            console.log(`    [CHECK] Checking if Team ${teamPrefix} is All Out...`);
            checkAllOut(teamPrefix); 
        } 
        else if (newStatus === 'In') {
            console.log(`    [IN_LOG] Clearing Time for Player ${playerNo}.`);
            player.outTime = null; 

            // 🎯 [👉 SCAN LOG 5 - IN]: इन सिक्वेन्स फंक्शन चालण्याच्या ठीक आधी
            console.log(`%c👉 [DEBUG updatePlayerStatus]: Calling updateOutSequence for Player #${playerNo}, Team ${teamPrefix}, Status: 'In'`, "color: #ea580c; font-weight: bold;");

            // ३. आउट सिक्वेन्स अपडेट करा
            updateOutSequence(playerNo, teamPrefix, 'In');
        }

        if (typeof renderMiniPlayers === "function") renderMiniPlayers();
    } else {
        // 🚨 जर खेळाडू लिस्टमध्ये सापडलाच नाही तर हा एरर येईल
        console.error(`%c❌ [DEBUG updatePlayerStatus ERROR]: Player ${playerNo} not found in Team ${teamPrefix} list!`, "color: #ef4444; font-weight: bold;");
    }

    if (typeof updateVisualPlayers === "function") {
        updateVisualPlayers(); 
    }
}

// १. प्लेयर सिलेक्शन मोडल बंद करण्यासाठी
function closePlayerModal() {
    const modal = document.getElementById('playerSelectModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// २. स्कोअर अपडेट करण्यासाठी (Local UI + Firebase)

// async function updateScore(teamPrefix, points) {
//     // 🚨 [DYNAMIC CHECK]: चालू मॅचचा डेटा पॅनेलमध्ये हजर आहे का ते पाहणे
//     if (typeof matchSetupData === 'undefined' || !matchSetupData || !matchSetupData.mId) {
//         console.error("%c🚨 [Fatal Error]: matchSetupData सापडला नाही! स्कोअर अपडेट करता येणार नाही.", "color: #dc2626; font-weight: bold;");
//         return;
//     }

//     const { tId, mId, roundName } = matchSetupData; 
//     const scoreEl = document.getElementById(`score${teamPrefix}`);

//     if (!scoreEl) {
//         console.error(`%c🚨 [DOM Error]: 'score${teamPrefix}' हा元素 स्क्रीनवर सापडला नाही!`, "color: #ef4444; font-weight: bold;");
//         return;
//     }

//     // 1️⃣ UI आणि स्क्रीनवरील आकडे तातडीने बदलणे
//     let currentScore = parseInt(scoreEl.innerText) || 0;
//     let newScore = currentScore + points;
//     scoreEl.innerText = newScore;

//     // 2️⃣ गोळा झालेले ताजे आकडे वेगाने ओढणे
//     const sA = document.getElementById('scoreA')?.innerText || "0";
//     const sB = document.getElementById('scoreB')?.innerText || "0";
//     const teamNameA = document.getElementById('teamAName')?.innerText || "Team A";
//     const teamNameB = document.getElementById('teamBName')?.innerText || "Team B";

//     // 3️⃣ लोकल स्टोरेज सेव्हिंग (तुझा मूळचा सेफ बॅकअप)
//     localStorage.setItem('liveScoreA', sA);
//     localStorage.setItem('liveScoreB', sB);

//     console.log(
//         `%c💾 [LocalStorage Updated]: Team ${teamPrefix} ➔ +${points} Pts | चालू स्कोअर ➔ A: ${sA} vs B: ${sB}`, 
//         "color: #10b981; font-weight: bold;"
//     );

//     // 4️⃣ ⚡ [PURE DYNAMIC PAYLOAD]: हार्डकोड पूर्णपणे साफ केला 🎯
//     const socketPayload = {
//         matchId: mId,
//         tournamentId: tId || "",
//         round: roundName || "League Match", // 🟢 जो राऊंड डेटाबेसमध्ये असेल, तोच थेट पुढे जाईल (No Hardcode)
//         teamA: teamNameA,
//         scoreA: Number(sA),
//         teamB: teamNameB,
//         scoreB: Number(sB),
//         status: "Live"
//     };

//     // 5️⃣ 🚀 Render सॉकेट सर्व्हरच्या पाईपमध्ये डेटा ढकलणे (0 Reads Cost)
//     try {
//         if (typeof socket !== 'undefined' && socket) {
//             if (socket.connected) {
                
//                 // सर्व्हरच्या नवीन स्केलेबल फंक्शननुसार इव्हेंटचे नाव
//                 socket.emit('match_status_changed_or_updated', socketPayload);
                
//                 console.log(
//                     `%c🚀 [Socket Sent Success]: डेटा Render सर्व्हरकडे रवाना! ID: ${socket.id}`, 
//                     "color: #f97316; font-weight: bold;", 
//                     socketPayload
//                 );
//             } else {
//                 console.warn(
//                     `%c⚠️ [Socket Offline]: सॉकेट इंजिन चालू आहे, पण सर्व्हरशी कनेक्टेड नाही. डेटा हवेत गेला नाही.`, 
//                     "color: #f59e0b; font-weight: bold;"
//                 );
//             }
//         } else {
//             console.error(
//                 `%c🚨 [Socket Missing]: 'socket' ऑब्जेक्ट 'app.js' मध्ये डिक्लेअर केलेला नाही!`, 
//                 "color: #dc2626; font-weight: bold;"
//             );
//         }
//     } catch (socketErr) {
//         console.error("🚨 [Socket Global Crash]: updateScore मधील ब्रॉडकास्ट इंजिन अपयशी:", socketErr);
//     }
// }


/**
 * सुधारित updateScore फंक्शन (फक्त मुख्य सामन्यासाठी)
तुझा मूळचा सॉकेटचा कडक फ्लो, कन्सोल लॉग्स आणि व्हॅलिडेशन १ टक्काही न विस्कटता हा सुधारित कोड बघून घे भावा:
 */
async function updateScore(teamPrefix, points) {
    // 🚨 [DYNAMIC CHECK]: चालू मॅचचा डेटा पॅनेलमध्ये हजर आहे का ते पाहणे
    if (typeof matchSetupData === 'undefined' || !matchSetupData || !matchSetupData.mId) {
        console.error("%c🚨 [Fatal Error]: matchSetupData सापडला नाही! स्कोअर अपडेट करता येणार नाही.", "color: #dc2626; font-weight: bold;");
        return;
    }

    const { tId, mId, roundName } = matchSetupData; 
    const scoreEl = document.getElementById(`score${teamPrefix}`);

    if (!scoreEl) {
        console.error(`%c🚨 [DOM Error]: 'score${teamPrefix}' हा元素 स्क्रीनवर सापडला नाही!`, "color: #ef4444; font-weight: bold;");
        return;
    }

    // 1️⃣ UI आणि स्क्रीनवरील आकडे तातडीने बदलणे
    let currentScore = parseInt(scoreEl.innerText) || 0;
    let newScore = currentScore + points;
    scoreEl.innerText = newScore;

    // 2️⃣ गोळा झालेले ताजे आकडे वेगाने ओढणे
    const sA = Number(document.getElementById('scoreA')?.innerText || 0);
    const sB = Number(document.getElementById('scoreB')?.innerText || 0);
    const teamNameA = document.getElementById('teamAName')?.innerText || "Team A";
    const teamNameB = document.getElementById('teamBName')?.innerText || "Team B";

    // 3️⃣ 🎯 [MASTER SCORECARD LOCAL SYNC]
    // लोकल स्टोरेजमधून जुना मास्टर ऑब्जेक्ट आणणे किंवा नवीन तयार करणे
    let localCard = localStorage.getItem('global_score_card');
    let currentScoreCard = localCard ? JSON.parse(localCard) : {
        mainMatch:  { teamA: 0, teamB: 0 },
        fiveRaid:   { teamA: 0, teamB: 0 },
        goldenRaid: { teamA: 0, teamB: 0 }
    };

    // 💥 फक्त मुख्य सामन्याचा (mainMatch) कप्पा अपडेट करणे!
    currentScoreCard.mainMatch.teamA = sA;
    currentScoreCard.mainMatch.teamB = sB;

    // नवीन मास्टर कार्ड लोकल स्टोरेजमध्ये लॉक करणे
    localStorage.setItem('global_score_card', JSON.stringify(currentScoreCard));

    console.log(
        `%c💾 [ScoreCard Updated]: Team ${teamPrefix} ➔ +${points} Pts | चालू मुख्य स्कोअर ➔ A: ${sA} vs B: ${sB}`, 
        "color: #10b981; font-weight: bold;"
    );

    // 4️⃣ ⚡ [PURE DYNAMIC PAYLOAD]: सॉकेट पेलोडमध्ये सुद्धा मास्टर ऑब्जेक्ट पाठवणे 🎯
    const socketPayload = {
        matchId: mId,
        tournamentId: tId || "",
        round: roundName || "League Match",
        teamA: teamNameA,
        teamB: teamNameB,
        status: "Live",
        scoreCard: currentScoreCard // 👈 जुन्या scoreA/scoreB ऐवजी अख्खा मास्टर ऑब्जेक्ट रवाना!
    };

    // 5️⃣ 🚀 Render सॉकेट सर्व्हरच्या पाईपमध्ये डेटा ढकलणे
    try {
        if (typeof socket !== 'undefined' && socket) {
            if (socket.connected) {
                socket.emit('match_status_changed_or_updated', socketPayload);
                console.log(
                    `%c🚀 [Socket Sent Success]: मास्टर स्कोअरकार्ड Render सर्व्हरकडे रवाना!`, 
                    "color: #f97316; font-weight: bold;"
                );
            } else {
                console.warn(`%c⚠️ [Socket Offline]: सर्व्हरशी कनेक्टेड नाही.`, "color: #f59e0b; font-weight: bold;");
            }
        } else {
            console.error(`%c🚨 [Socket Missing]: 'socket' ऑब्जेक्ट सापडला नाही!`, "color: #dc2626; font-weight: bold;");
        }
    } catch (socketErr) {
        console.error("🚨 [Socket Global Crash]: updateScore मधील ब्रॉडकास्ट इंजिन अपयशी:", socketErr);
    }
}


/** */

let outSequenceA = [];
let outSequenceB = [];

function updateOutSequence(playerNo, team, status) {
    console.log(`>>> [OUT_SEQ] Updating Team ${team} | Player ${playerNo} | Status ${status}`);
    
    let currentSeq = (team === 'A') ? outSequenceA : outSequenceB;
    const elementId = (team === 'A') ? 'outSequenceA' : 'outSequenceB';

    if (status === 'Out') {
        // खेळाडू आऊट झाला तर लिस्टच्या शेवटी टाका
        if (!currentSeq.includes(playerNo)) {
            currentSeq.push(playerNo);
        }
    } else if (status === 'In') {
        // खेळाडू जिवंत झाला तर लिस्ट मधून काढून टाका
        if (team === 'A') {
            outSequenceA = outSequenceA.filter(no => no != playerNo);
            currentSeq = outSequenceA;
        } else {
            outSequenceB = outSequenceB.filter(no => no != playerNo);
            currentSeq = outSequenceB;
        }
    }

    // UI अपडेट करा
    const displayEl = document.getElementById(elementId);
    if (displayEl) {
        displayEl.innerText = currentSeq.length > 0 ? currentSeq.join(', ') : 'NONE';
    }
    
    console.log(`    [SEQ_RESULT] Team ${team}:`, currentSeq);

    if (typeof updateVisualPlayers === "function") {
        updateVisualPlayers(); 
    }
}


/** Empty Raid */
let emptyRaidCount = { A: 0, B: 0 };

/** 
function handleEmptyRaid(team) {
    const activeRaiderEl = document.getElementById('activeRaider');
    const raiderText = activeRaiderEl ? activeRaiderEl.innerText.trim().toUpperCase() : "";

    if (raiderText === "" || raiderText.includes("WAITING") || !raiderText.includes(`(${team})`)) {
        window.pendingAction = { type: 'empty', team: team };
        openRaiderSelectionModal(team);
        return;
    }

    // १. रेडरचे नाव किंवा नंबर स्वच्छ करा (उदा. "PLAYER 23 (B)" -> "PLAYER 23")
    let raiderNo = raiderText.split(' ')[1] || raiderText.split('(')[0].trim();
    let displayName = raiderText.split('(')[0].trim(); 

    // २. रेड समरीमध्ये नोंद करा (पॉईंट्स ० कारण ही एम्टी रेड आहे)
    if (typeof addRaidToSummary === "function") {
        addRaidToSummary(team, displayName, 'Empty Raid', 0, 'Returned Safely');
    }
    
    // ३. मूळ लॉजिक चालू ठेवा
    processEmptyRaidLogic(team, "DIRECT_CLICK", raiderNo);
}

function processEmptyRaidLogic(team, source, raiderNo) {
    console.log(`[STRICT_LOG] 📥 processEmptyRaidLogic | Raider: ${raiderNo} | Team: ${team}`);
    
    emptyRaidCount[team]++;

    if (emptyRaidCount[team] === 3) {
        console.error(`[STRICT_LOG] 🎯 3rd Raid FAIL! Auto-Out Raider: ${raiderNo}`);
        
        let oppositeTeam = (team === 'A' ? 'B' : 'A');
        
        // १. रेडरला OUT करा (ज्याने रेड केली तो आऊट होईल)
        if (typeof updatePlayerStatus === "function") {
            updatePlayerStatus(raiderNo, team, 'Out');
        }

        // २. समोरच्या टीमला १ पॉईंट द्या
        if (typeof updateScore === "function") {
            updateScore(oppositeTeam, 1);
        }

        // ३. समोरच्या टीमचा खेळाडू रिवाइव्ह करा (आत आणा)
        // इथे तुझे 'revivePlayers' फंक्शन कॉल करा
        if (typeof revivePlayers === "function") {
            console.log(`[REVIVAL_CALL] Calling revivePlayers for Team ${oppositeTeam}`);
            revivePlayers(oppositeTeam, 1); 
        }

        // ४. काउंट रिसेट करा
        emptyRaidCount[team] = 0;
        
        const activeRaiderEl = document.getElementById('activeRaider');
        if (activeRaiderEl) activeRaiderEl.innerText = "WAITING FOR RAIDER...";
        
    } else {
        const activeRaiderEl = document.getElementById('activeRaider');
        if (activeRaiderEl) activeRaiderEl.innerText = "WAITING FOR RAIDER...";
    }
    
    if (typeof updateEmptyDots === 'function') updateEmptyDots(team);
}


function updateEmptyDots(team) {
    const dotsContainer = document.getElementById(`empty${team}`);
    
    if (!dotsContainer) {
        console.error(`[ERROR] Container 'empty${team}' not found in HTML!`);
        return;
    }

    const dots = dotsContainer.children;
    console.log(`[DOTS UPDATE] Found ${dots.length} dots for Team ${team}`);

    if (dots.length < 3) {
        console.error(`[ERROR] Container 'empty${team}' must have 3 span elements!`);
        return;
    }

    const count = emptyRaidCount[team];

    // सर्व डॉट्स रिसेट (Grey)
    for (let i = 0; i < 3; i++) {
        dots[i].className = "w-2.5 h-2.5 rounded-full bg-gray-700";
    }

    // रेड नुसार रंग बदलणे
    if (count >= 1) {
        dots[0].className = "w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_yellow]";
        console.log(`[DOT 1] Yellow`);
    }
    if (count >= 2) {
        dots[1].className = "w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_yellow]";
        console.log(`[DOT 2] Yellow - Do or Die Condition`);
    }
}
*/

function handleEmptyRaid(team) {
    // १. एम्प्टी रेड बटण क्लिक होताच चालू रेड टायमर थांबवणे! ⏱️🛑
    if (typeof stopRaidTimer === "function") {
        stopRaidTimer();
    }

    const activeRaiderEl = document.getElementById('activeRaider');
    const raiderText = activeRaiderEl ? activeRaiderEl.innerText.trim().toUpperCase() : "";

    // 🎯 [🔍 CONSOLE LOG 1]: एम्प्टी रेड बटन दाबताच स्क्रीनवर काय टेक्स्ट आहे ते तपासणे
    console.log(`%c📥 [DEBUG handleEmptyRaid ENTER]: UI Text found: "${raiderText}" | Team: ${team}`, "color: #a855f7; font-weight: bold;");

    if (raiderText === "" || raiderText.includes("WAITING") || (!raiderText.includes(`(${team})`) && !raiderText.includes(`[${team}]`))) {
        console.warn(`%c⚠️ [DEBUG handleEmptyRaid]: Raider योग्य नाही किंवा WAITING मोडवर आहे. Modal उघडत आहे.`, "color: #f97316; font-weight: bold;");
        window.pendingAction = { type: 'empty', team: team };
        openRaiderSelectionModal(team);
        return;
    }

    // 🚨 जर्सी नंबर मेमरीवरून किंवा टेक्स्टवरून अचूक काढणे
    let raiderNo = null;
    if (window.currentActiveRaider && window.currentActiveRaider.no) {
        raiderNo = window.currentActiveRaider.no;
        console.log(`%c✅ [DEBUG handleEmptyRaid]: Global Memory मधून नंबर सापडला ➔ #${raiderNo}`, "color: #16a34a; font-weight: bold;");
    } else {
        let noMatch = raiderText.match(/\d+/);
        raiderNo = noMatch ? noMatch[0] : (raiderText.split(' ')[1] || raiderText.split('(')[0].trim());
        console.log(`%c🧠 [DEBUG handleEmptyRaid]: Regex/Split मधून नंबर शोधला ➔ #${raiderNo}`, "color: #3b82f6; font-weight: bold;");
    }

    let displayName = raiderText.split('(')[0].trim(); 

    // 🎯 [THE DOUBLE ENTRY FIX]: समरीची पहिली एन्ट्री फक्त १ ल्या आणि २ ऱ्या रेडसाठीच द्या!
    console.log(`%c📊 [DEBUG handleEmptyRaid]: Current Count before increment: ${emptyRaidCount[team]}/3`, "color: #06b6d4; font-weight: bold;");
    
    if (emptyRaidCount[team] < 2) {
        if (typeof addRaidToSummary === "function") {
            let finalSummaryName = (window.currentActiveRaider) ? `#${window.currentActiveRaider.no} ${window.currentActiveRaider.name.toUpperCase()} [${team}]` : displayName;
            let emptyDetails = `Empty Raid (${emptyRaidCount[team] + 1}/3)`;
            
            console.log(`%c👉 [DEBUG handleEmptyRaid]: सलग ३री रेड नाहीये (${emptyRaidCount[team] + 1}/3). Normal Empty Raid समरी पाठवत आहे.`, "color: #22c55e; font-weight: bold;");
            addRaidToSummary(team, finalSummaryName, 'Empty Raid', 0, emptyDetails);
        }
    } else {
        console.log(`%c🚨 [DEBUG handleEmptyRaid]: पुढचा काउंट ३ होणार आहे! Double Entry टाळण्यासाठी सामान्य समरी इथून ब्लॉक केली.`, "color: #ef4444; font-weight: bold;");
    }
    
    // ३. मूळ लॉजिक चालू ठेवा (या टप्प्यातून ३ऱ्या रेडची अधिकृत सिंगल एन्ट्री जाईल)
    processEmptyRaidLogic(team, "DIRECT_CLICK", raiderNo);
}

/** */

function processEmptyRaidLogic(team, source, raiderNo) {
    // 🎯 [🔍 CONSOLE LOG 2]: मूळ लॉजिक फंक्शन चालू झाल्यावर डेटा तपासणे
    console.log(`%c📥 [DEBUG processEmptyRaidLogic ENTER]: Raider No: "${raiderNo}" | Team: ${team} | Source: ${source}`, "color: #0284c7; font-weight: bold;");
    
    emptyRaidCount[team]++;
    console.log(`%c📈 [DEBUG processEmptyRaidLogic]: Increment झालेला नवीन काउंट ➔ Team ${team}: ${emptyRaidCount[team]}/3`, "color: #0284c7; font-weight: bold;");

    if (emptyRaidCount[team] === 3) {
        console.error(`%c🎯 [DEBUG DO-OR-DIE ACTIVATED]: 3rd Empty Raid FAIL! Auto-Out Raider: #${raiderNo}`, "color: #fff; background: #ef4444; padding: 4px; font-weight: bold;");
        
        let oppositeTeam = (team === 'A' ? 'B' : 'A');
        
        // १. रेडरला OUT करा
        if (typeof updatePlayerStatus === "function" && raiderNo) {
            console.log(`%c🚀 [DEBUG processEmptyRaidLogic]: Calling updatePlayerStatus for Raider #${raiderNo} as 'Out'`, "color: #2563eb; font-weight: bold;");
            updatePlayerStatus(raiderNo, team, 'Out');
        }

        // २. समोरच्या टीमला १ पॉईंट द्या
        if (typeof updateScore === "function") {
            console.log(`%c🚀 [DEBUG processEmptyRaidLogic]: Adding +1 Point to Team ${oppositeTeam}`, "color: #2563eb; font-weight: bold;");
            updateScore(oppositeTeam, 1);
        }

        // ३. समोरच्या टीमचा खेळाडू रिवाइव्ह करा
        if (typeof revivePlayers === "function") {
            console.log(`%c🚀 [DEBUG processEmptyRaidLogic]: Calling revivePlayers for Team ${oppositeTeam}`, "color: #2563eb; font-weight: bold;");
            revivePlayers(oppositeTeam, 1); 
        }

        // ४. काउंट रिसेट करा
        emptyRaidCount[team] = 0;
        console.log(`%c🧹 [DEBUG processEmptyRaidLogic]: Counter Reset to 0 for Team ${team}`, "color: #64748b; font-weight: bold;");
        
        // 🎯 विरोधी संघाचा १ गुण कन्सोल आणि समरीमध्ये स्पष्ट रेंडर करणे!
        if (typeof addRaidToSummary === "function") {
            let raiderLabel = (window.currentActiveRaider) ? `#${window.currentActiveRaider.no} ${window.currentActiveRaider.name.toUpperCase()} [${team}]` : `Player #${raiderNo} [${team}]`;
            let doOrDieDetails = `🚨 DO-OR-DIE CRASHED! सलग ३ऱ्या एम्प्टी रेडमुळे रायडर बाद. (+1 Point to Team ${oppositeTeam})`;
            
            console.log(`%c👉 [DEBUG processEmptyRaidLogic]: Sending Single Do-or-Die Out summary...`, "color: #22c55e; font-weight: bold;");
            addRaidToSummary(oppositeTeam, raiderLabel, 'DO-OR-DIE OUT', 1, doOrDieDetails);
        }

        const activeRaiderEl = document.getElementById('activeRaider');
        if (activeRaiderEl) activeRaiderEl.innerText = "WAITING FOR RAIDER...";
        
    } else {
        console.log(`%c🟢 [DEBUG processEmptyRaidLogic]: ३ रेड पूर्ण नाहीत. फक्त खेळाडू रिसेट करत आहे.`, "color: #16a34a; font-weight: bold;");
        const activeRaiderEl = document.getElementById('activeRaider');
        if (activeRaiderEl) activeRaiderEl.innerText = "WAITING FOR RAIDER...";
    }
    
    if (typeof updateEmptyDots === 'function') updateEmptyDots(team);
    console.log(`%c--- [DEBUG processEmptyRaidLogic END] ---`, "color: #0284c7; font-weight: bold;");
}

/** */
function updateEmptyDots(team) {
    const dotsContainer = document.getElementById(`empty${team}`);
    
    if (!dotsContainer) {
        console.error(`[ERROR] Container 'empty${team}' not found in HTML!`);
        return;
    }

    const dots = dotsContainer.children;
    console.log(`[DOTS UPDATE] Found ${dots.length} dots for Team ${team}`);

    if (dots.length < 3) {
        console.error(`[ERROR] Container 'empty${team}' must have 3 span elements!`);
        return;
    }

    const count = emptyRaidCount[team];

    // सर्व डॉट्स रिसेट (Grey)
    for (let i = 0; i < 3; i++) {
        dots[i].className = "w-2.5 h-2.5 rounded-full bg-gray-700";
    }

    // रेड नुसार रंग बदलणे
    if (count >= 1) {
        dots[0].className = "w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_yellow]";
        console.log(`[DOT 1] Yellow`);
    }
    if (count >= 2) {
        dots[1].className = "w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_yellow]";
        console.log(`[DOT 2] Yellow - Do or Die Condition`);
    }
}

/** */
function handleAllOut(team) {
    // team = ज्या टीमने ऑल आऊट केलं आहे (जिचा स्कोअर वाढणार)
    const oppositeTeam = (team === 'A' ? 'B' : 'A');

    Swal.fire({
        title: 'ALL OUT!',
        text: `Team ${oppositeTeam} ऑल आऊट झाली आहे!`,
        icon: 'info',
        confirmButtonText: 'Revive All Players'
    }).then((result) => {
        if (result.isConfirmed) {
            // १. समोरच्या टीमला २ पॉईंट्स द्या
            updateScore(team, 2);

            // २. ऑल आऊट झालेल्या टीमच्या सर्व ७ खेळाडूंना 'In' करा
            let targetPlayers = (oppositeTeam === 'A' ? teamAPlayers : teamBPlayers);
            targetPlayers.forEach(p => p.status = 'In');

            // ३. आउट सीक्वेन्स रिसेट करा
            if (oppositeTeam === 'A') outSequenceA = [];
            else outSequenceB = [];

            // ४. स्क्रीन अपडेट करा
            renderMiniPlayers();
            updateOutSequenceDisplay(); 
        }
    });
}
/** */
function updateOutSequenceDisplay() {
    document.getElementById('outSequenceA').innerText = outSequenceA.join(', ') || 'None';
    document.getElementById('outSequenceB').innerText = outSequenceB.join(', ') || 'None';
}


/** */

function openRaiderSelectionForBonus(team) {
    console.log(`[DEBUG] Attempting to open raider list for Team: ${team}`);
    const modal = document.getElementById('playerSelectModal');
    const grid = document.getElementById('playerModalGrid');
    const title = document.getElementById('playerModalTitle');
    
    // डेटा चेक करा
    let players = (team === 'A') ? teamAPlayers : teamBPlayers;
    console.log(`[DEBUG] Players found:`, players);

    if (!players || players.length === 0) {
        Swal.fire("Error", "खेळाडूंची यादी सापडली नाही! कृपया मॅच पुन्हा सेटअप करा.", "error");
        return;
    }

    title.innerText = `Select Raider (Team ${team})`;
    grid.innerHTML = "";
    
    const inPlayers = players.filter(p => p.status === 'In');
    
    if (inPlayers.length === 0) {
        grid.innerHTML = "<p class='text-gray-500 text-center col-span-4 py-4 text-[10px]'>सर्व खेळाडू आऊट आहेत!</p>";
    } else {
        inPlayers.forEach(p => {
            grid.innerHTML += `
                <button onclick="setRaiderAndOpenBonus('${p.no}', '${p.name}', '${team}')" 
                    class="bg-gray-800 border border-gray-700 p-3 rounded-xl flex flex-col items-center active:bg-green-600">
                    <span class="text-xl font-black text-white">${p.no}</span>
                    <span class="text-[8px] text-gray-500 uppercase mt-1">${p.name}</span>
                </button>`;
        });
    }

    modal.classList.replace('hidden', 'flex');
}

/** */

function selectMultiplePlayers(playerNo, team) {
    console.log("--- [TOUCH_MODE_START] ---");

    // --- नवीन बदल: खेळाडूचा नंबर पिशवीत (List) टाका ---
    if (!window.selectedPlayersList) window.selectedPlayersList = [];
    if (!window.selectedPlayersList.includes(playerNo)) {
        window.selectedPlayersList.push(playerNo);
    }
    // ------------------------------------------------

    const btn = document.getElementById(`p-btn-${playerNo}`);
    if (btn) {
        if (btn.classList.contains('bg-green-600')) return; 
        btn.classList.remove('bg-gray-800');
        btn.classList.add('bg-green-600', 'border-white', 'scale-95');
        console.log(`[UI] Player No.${playerNo} highlighted.`);
    }

    updatePlayerStatus(playerNo, team, 'Out');
    
    window.selectedPlayersCount = (window.selectedPlayersCount || 0) + 1;
    console.log(`[PROGRESS] Selected: ${window.selectedPlayersCount} / Required: ${window.requiredPlayers}`);

    if (window.selectedPlayersCount >= window.requiredPlayers) {
        console.log(`[FINISH] All required players selected.`);
        setTimeout(() => {
            finishAction();
        }, 300); 
    } else {
        const title = document.getElementById('playerModalTitle');
        if (title) title.innerText = `Select ${window.requiredPlayers - window.selectedPlayersCount} more...`;
    }
}

// २. टॅकलसाठी स्वतंत्र फंक्शन
function selectDefenderForTackle(playerNo, team) {
    console.log("--- [TACKLE_MODE_START] ---");
    console.log(`[CLICK] Defender No.${playerNo} from Team ${team} recorded the tackle.`);

    // १. डिफेंडरचा नंबर पिशवीत (List) टाका जेणेकरून समरीमध्ये 'undefined' येणार नाही
    window.selectedPlayersList = [playerNo]; 

    const raiderTeam = currentAction.raiderTeam;
    const raiderName = currentAction.raiderName;
    
    let raiderList = (raiderTeam === 'A' ? teamAPlayers : teamBPlayers);
    
    // तुझ्या जुन्या कोडमध्ये नाव मॅच करण्याऐवजी आपण डायरेक्ट एक्टिव रेडरला आऊट करू शकतो
    // कारण टॅकल झाल्यावर रेडर आऊट होणे अनिवार्य आहे.
    let raiderNoMatch = raiderName.match(/\d+/);
    if (raiderNoMatch) {
        console.log(`[EXECUTION] Marking Raider No.${raiderNoMatch[0]} (Team ${raiderTeam}) as OUT.`);
        updatePlayerStatus(raiderNoMatch[0], raiderTeam, 'Out');
    }
    
    // २. finishAction ऐवजी डायरेक्ट processPoints कॉल करणे जास्त सुरक्षित आहे 
    // जेणेकरून स्कोअर आणि समरी लगेच अपडेट होईल.
    closePlayerModal(); 
    processPoints();
}


// हेल्पर फंक्शन - क्लोजिंग लॉजिकसाठी
// ४. ॲक्शन पूर्ण झाल्यावर रिसेट करण्यासाठी
function finishAction() {
    setTimeout(() => {
        processPoints(); 
        closePlayerModal();
        
        window.selectedPlayersCount = 0;
        window.requiredPlayers = 0;

        const activeRaiderEl = document.getElementById('activeRaider');
        if (activeRaiderEl) activeRaiderEl.innerText = "WAITING FOR RAIDER...";
        console.log("--- [ACTION COMPLETE & GLOBALS RESET] ---");
    }, 400);
}
/** */
function confirmRaider(no, name, team) {
    // १. HTML मधलं नाव बदला (इथेच तुझा घोळ होत होता)
    document.getElementById('activeRaider').innerText = name; 
    
    closePlayerModal();
    
    // २. जर बोनससाठी रेडर निवडला असेल, तर बोनस मोडल उघडा
    if (typeof isBonusPending !== 'undefined' && isBonusPending) {
        isBonusPending = false;
        openBonusPointsModal(team);
    } else {
        // नाहीतर टायमर सुरू करा (तुझं जुनं फंक्शन)
        startRaidTimer(team); 
    }
}
/** */
function initializeDefaultPlayers() {
    console.log("[SETUP] Initializing default player numbers...");

    // Team A: १ ते १२
    teamAPlayers = [];
    for (let i = 1; i <= 12; i++) {
        teamAPlayers.push({
            no: i.toString(),
            name: `Player ${i}`, // डिफॉल्ट नाव
            status: 'In'
        });
    }

    // Team B: २१ ते ३२
    teamBPlayers = [];
    for (let i = 21; i <= 32; i++) {
        teamBPlayers.push({
            no: i.toString(),
            name: `Player ${i}`, // डिफॉल्ट नाव
            status: 'In'
        });
    }

    renderSetupPlayerList(); // ही लिस्ट स्क्रीनवर दाखवण्यासाठी फंक्शन
}
/** */
function renderSetupPlayerList() {
    const containerA = document.getElementById('setupTeamA');
    const containerB = document.getElementById('setupTeamB');

    // Team A रेंडर करा
    containerA.innerHTML = teamAPlayers.map((p, index) => `
        <div class="flex gap-2 mb-2">
            <input type="number" value="${p.no}" 
                onchange="updatePlayerData('A', ${index}, 'no', this.value)" 
                class="w-16 bg-gray-800 p-2 rounded text-center font-bold">
            <input type="text" placeholder="Enter Name" 
                onchange="updatePlayerData('A', ${index}, 'name', this.value)" 
                class="flex-1 bg-gray-800 p-2 rounded">
        </div>
    `).join('');

    // Team B रेंडर करा
    containerB.innerHTML = teamBPlayers.map((p, index) => `
        <div class="flex gap-2 mb-2">
            <input type="number" value="${p.no}" 
                onchange="updatePlayerData('B', ${index}, 'no', this.value)" 
                class="w-16 bg-gray-800 p-2 rounded text-center font-bold">
            <input type="text" placeholder="Enter Name" 
                onchange="updatePlayerData('B', ${index}, 'name', this.value)" 
                class="flex-1 bg-gray-800 p-2 rounded">
        </div>
    `).join('');
}
/** */
function updatePlayerData(team, index, field, value) {
    if (team === 'A') {
        teamAPlayers[index][field] = value;
    } else {
        teamBPlayers[index][field] = value;
    }
    console.log(`[UPDATE] Team ${team} Player ${index} ${field} set to: ${value}`);
}
/** */
function resetMatchData() {
    // Team A रिसेट करा
    teamAPlayers.forEach(p => {
        p.status = 'In';
        p.outTime = null; // जुना वेळ काढून टाका
    });

    // Team B रिसेट करा
    teamBPlayers.forEach(p => {
        p.status = 'In';
        p.outTime = null;
    });

    // स्क्रीनवरची आउट लिस्ट रिकामी करा
    renderMiniPlayers(); 
    console.log("[RESET] All players are now IN and Out-history cleared.");
}
/** */
function initializeMatchPlayers() {
    console.log("[INITIALIZE] Clearing old out-data and resetting players...");
    
    const resetList = (list) => {
        list.forEach(p => {
            // फक्त Starting 7 ला 'In' करा, बाकीच्यांना 'Sub' किंवा 'Out' ठेवा (तुझ्या गरजेनुसार)
            // सध्या आपण सर्वांना 'In' धरूया जेणेकरून लिस्ट क्लियर होईल
            p.status = 'In'; 
            p.outTime = null; // सर्वात महत्त्वाचं: जुना आऊट वेळ डिलीट करा
        });
    };

    resetList(teamAPlayers);
    resetList(teamBPlayers);

    renderMiniPlayers(); // UI रिफ्रेश करा
}

// २. ॲक्शन बटण दाबल्यावर (Tackle, Super Tackle, Self Out इ. साठी)
function handleAction(team, type, points) {
    console.log(`%c>>> [ACTION_START] Team: ${team} | Type: ${type} | Points: ${points}`, "color: #a855f7; font-weight: bold;");

    // १. टेक्निकल पॉईंटसाठीचा तुझा मूळ ब्लॉक (जसा आहे तसाच ठेवा)
    if (type === 'technical') {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Technical Violation',
                input: 'select',
                inputOptions: {
                    'Calling Raider while Riding': 'Calling Raider while Riding',
                    'Touching Middle line While start Riding': 'Touching Middle line While start Riding',
                    'Riding 2 Player together': 'Riding 2 Player together',
                    'Raid not start in 5 Second': 'Raid not start in 5 Second',
                    'Other': 'Other'
                },
                inputPlaceholder: 'Reason निवडा',
                showCancelButton: true,
                confirmButtonText: 'Give Point',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    console.log(`    [TECH_POINT] Adding ${points} point to Team ${team}. Reason: ${result.value}`);
                    if (typeof updateScore === "function") {
                        updateScore(team, parseInt(points)); 
                    }
                }
            });
        }
        return; 
    }

    stopRaidTimer();

    const oppositeTeam = (team === 'A' ? 'B' : 'A');
    const activeRaiderEl = document.getElementById('activeRaider');
    const raiderRawText = activeRaiderEl ? activeRaiderEl.innerText.trim().toUpperCase() : "";
    const isRaiderWaiting = raiderRawText === "" || raiderRawText.includes("WAITING") || raiderRawText.includes("NONE");

    // २.ूळ कोड)
    if (isRaiderWaiting) {
        window.pendingAction = { team: team, points: parseInt(points), type: type };
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Select Raider!',
                text: `पॉईंट देण्यासाठी आधी टीम ${oppositeTeam} चा रेडर निवडा.`,
                icon: 'warning',
                confirmButtonText: 'Select Raider'
            }).then((result) => {
                if (result.isConfirmed) {
                    openRaiderSelectionModal(oppositeTeam);
                }
            });
        }
        return;
    }

    // ३. नवीन "SELF OUT" लॉजिक (तुझा मूळ कोड)
    if (type === 'self_out') {
        console.log(`[STRICT_LOG] Processing Self Out for Raider from Team ${oppositeTeam}`);
        let raiderNoMatch = raiderRawText.match(/\d+/);
        if (raiderNoMatch && typeof updatePlayerStatus === "function") {
            updatePlayerStatus(raiderNoMatch[0], oppositeTeam, 'Out');
        }
        currentAction = { team: team, type: 'self_out', points: parseInt(points) };
        if (typeof processPoints === "function") {
            processPoints();
        }
        return; 
    }

    // --- ४. टॅकल आणि सुपर टॅकल लॉजिक ---
    console.log(`[STRICT_LOG] Raider found: ${raiderRawText}. Moving to Out Logic.`);

    // [NEW CHANGE]: सुपर टॅकल नियम तपासणे
    if (type === 'super_tackle') {
        let defendersList = (team === 'A') ? teamAPlayers : teamBPlayers;
        let playersInCourt = defendersList.filter(p => p.status === 'In').length;

        console.log(`[RULE_CHECK] Defenders in court: ${playersInCourt}`);

        if (playersInCourt > 3) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Rule Violation!',
                    text: `मैदानात ${playersInCourt} डिफेंडर्स आहेत. सुपर टॅकलसाठी ३ किंवा कमी खेळाडू लागतात.`,
                    icon: 'error'
                });
            }

            if (activeRaiderEl) {
                console.log(`[CLEANUP] Rule violated, resetting activeRaider UI...`);
                activeRaiderEl.innerText = "NONE (WAITING)";
                activeRaiderEl.classList.remove('text-green-400', 'text-blue-400');
            }
            
            currentAction = null;
            window.selectedPlayersList = [];
            return; 
        }
    }

    let raiderNoMatch = raiderRawText.match(/\d+/);
    //let raiderNo = raiderNoMatch ? raiderNoMatch[0] : null;
    let raiderNo = (window.currentActiveRaider && window.currentActiveRaider.no) ? window.currentActiveRaider.no : null;
    
    // 🎯 [🔍 SCAN LOG 1]: टॅकल चालू झाल्यावर रायडरचा नंबर काय मिळाला ते तपासा
    console.log(`%c🔍 [DEBUG handleAction]: UI Text: "${raiderRawText}" ➔ Extracted Raider No: ${raiderNo} | Target Team to Out: ${oppositeTeam}`, "color: #eab308; font-weight: bold;");

    if (type === 'tackle' || type === 'super_tackle') {
        if (raiderNo && typeof updatePlayerStatus === "function") {
            
            // 🎯 [🚀 SCAN LOG 2]: updatePlayerStatus ला कॉल मारण्यापूर्वीचा कडक पुरावा
            console.log(`%c🚀 [DEBUG handleAction]: Triggering updatePlayerStatus for Raider #${raiderNo} on Team ${oppositeTeam} as 'Out'`, "color: #2563eb; font-weight: bold;");
            
            updatePlayerStatus(raiderNo, oppositeTeam, 'Out');
        } else {
            // 🚨 जर काहीतरी मिसिंग असेल तर हा एरर येईल
            console.warn(`%c⚠️ [DEBUG handleAction FAILED]: Cannot trigger updatePlayerStatus! raiderNo: ${raiderNo} | Function exists: ${typeof updatePlayerStatus === "function"}`, "color: #ef4444; font-weight: bold;");
        }
    }

    currentAction = { 
        team: team, 
        type: type, 
        points: parseInt(points),
        raiderName: raiderRawText,
        raiderTeam: oppositeTeam 
    };

    window.requiredPlayers = 1; 
    window.selectedPlayersCount = 0;

    let modalHeader = (type === 'super_tackle') ? "Super Tackle By" : "Tackled By";
    openMultiPlayerModal(team, 1, modalHeader);
}

/** */
function checkSuperTackle(defendingTeam) {
    let inCount = (defendingTeam === 'A' ? teamAPlayers : teamBPlayers).filter(p => p.status === 'In').length;
    
    if (inCount <= 3) {
        console.log("    [SPECIAL] SUPER TACKLE! 2 Points.");
        handlePoint(defendingTeam, 2); // २ पॉईंट्स आणि १ पेक्षा जास्त प्लेयर इन करण्याचं लॉजिक
    } else {
        handleTackle(defendingTeam);
    }
}

/** */
function handleAllOut(team) {
    console.log(`>>> [ALL_OUT_START] Team ${team} gets All Out points!`);
    
    // १. २ एक्स्ट्रा पॉईंट्स द्या
    updateScore(team, 2);
    console.log(`    [SCORE] Added 2 All-Out points to Team ${team}`);

    // २. समोरच्या टीमचे (ज्यांची पूर्ण टीम आऊट झाली होती) सर्व खेळाडू IN करा
    const targetTeam = (team === 'A' ? 'B' : 'A');
    let targetList = (targetTeam === 'A' ? teamAPlayers : teamBPlayers);

    console.log(`    [REVIVE] Reviving ALL players for Team ${targetTeam}`);

    targetList.forEach(p => {
        // फक्त जे 'Out' आहेत त्यांनाच 'In' करा (जे आधीच 'In' आहेत त्यांना धक्का लावू नका)
        if (p.status === 'Out') {
            updatePlayerStatus(p.no, targetTeam, 'In');
        }
    });

    // ३. रेडर रिसेट करा
    const activeRaiderEl = document.getElementById('activeRaider');
    if (activeRaiderEl) activeRaiderEl.innerText = "Waiting for Raider...";

    Swal.fire({
        title: 'ALL OUT!',
        text: `Team ${team} ला २ ज्यादा गुण मिळाले!`,
        icon: 'success',
        timer: 1500
    });
    
    console.log(`>>> [ALL_OUT_END] All players are back in court.`);
}


/** */

// खेळाडू आऊट झाला की हे फंक्शन कॉल कर (updatePlayerStatus मध्ये शेवटी हे टाक)
function checkAllOut(team) {
    const players = (team === 'A' ? teamAPlayers : teamBPlayers);
    const inCourtCount = players.filter(p => p.status === 'In').length;

    if (inCourtCount === 0) {
        console.log(`>>> [ALL_OUT_DETECTED] Team ${team} is All Out!`);
        const scoringTeam = (team === 'A' ? 'B' : 'A');

        Swal.fire({
            title: `TEAM ${team} ALL OUT!`,
            text: `Team ${scoringTeam} ला २ ऑल-आऊट पॉईंट्स मिळतील.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm All Out',
            background: '#111',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                executeAllOut(team, scoringTeam);
            }
        });
    }
}

// ऑल-आऊटची प्रत्यक्ष अंमलबजावणी (सुधारित आणि सुरक्षित)
function executeAllOut(allOutTeam, scoringTeam) {
    console.log(`>>> [ALL_OUT_START] Team: ${allOutTeam} is All-Out. Scoring Team: ${scoringTeam}`);

    updateScore(scoringTeam, 2); // २ ऑल-आऊट पॉईंट्स जोडले
    console.log(`    [SCORE] +2 Points added to Team ${scoringTeam}`);

    // -----------------------------------------------------------------
    // 🎯 [RAID SUMMARY & TIMELINE ENTRY]: ऑल-आऊटचा कडक इतिहास नोंदवणे 🚀
    // -----------------------------------------------------------------
    let allOutLabel = `TEAM ${allOutTeam} [${allOutTeam}]`;
    let allOutDetails = `+2 All-Out Points awarded to Team ${scoringTeam}`;
    
    // addRaidToSummary(पॉईंट मिळवणारी टीम, हेडिंग नाव, इव्हेंट प्रकार, पॉइंट्स, डिटेल्स)
    if (typeof addRaidToSummary === "function") {
        addRaidToSummary(scoringTeam, allOutLabel, 'ALL OUT', 2, allOutDetails);
    }

    let players = (allOutTeam === 'A') ? teamAPlayers : teamBPlayers;
    
    // १. आउट सिक्वेन्स पूर्णपणे रिकामी करा (RESET)
    if (allOutTeam === 'A') {
        outSequenceA = [];
        const elA = document.getElementById('outSequenceA');
        if (elA) elA.innerText = 'NONE';
    } else {
        outSequenceB = [];
        const elB = document.getElementById('outSequenceB');
        if (elB) elB.innerText = 'NONE';
    }
    console.log(`    [SEQ_RESET] Out sequence for Team ${allOutTeam} cleared.`);

    // २. प्लेइंग ७ ला पुन्हा मैदानात आणा
    players.forEach(p => {
        if (p.playingStatus === "Playing") {
            p.status = "In"; // तुझा मूळ 'status' कोड जसाच्या तसा सुरक्षित
            p.outTime = null;
            console.log(`    [REVIVE] Player ${p.no} (${p.name}) is back In.`);
        } else {
            p.status = "Out"; 
            console.log(`    [BENCH] Player ${p.no} remains on Bench.`);
        }
    });

    if (typeof renderMiniPlayers === "function") renderMiniPlayers();
    
    // व्हिज्युअल प्लेयर्स अपडेट करा जेणेकरून कोर्टवरील आयकॉन्सचे रंग पुन्हा हिरवे होतील
    if (typeof updateVisualPlayers === "function") updateVisualPlayers();

    console.log(`<<< [ALL_OUT_COMPLETE] Team ${allOutTeam} is fully revived.`);
}

/** */

function substitutePlayer(outPlayerNo, inPlayerNo, team) {
    let players = (team === 'A') ? teamAPlayers : teamBPlayers;
    
    let pOut = players.find(p => p.no == outPlayerNo);
    let pIn = players.find(p => p.no == inPlayerNo);

    if (pOut && pIn) {
        // ७ नंबर बेंचवर गेला
        pOut.playingStatus = "Bench";
        pOut.courtStatus = "Out"; 

        // ८ नंबर प्लेइंगमध्ये आला
        pIn.playingStatus = "Playing";
        pIn.courtStatus = "In";

        console.log(`>>> [SUB] ${outPlayerNo} is now Bench, ${inPlayerNo} is now Playing.`);
        renderMiniPlayers();
    }
}

/** */

function togglePlayerRole(checkbox, playerNo) {
    // समजा तुझ्या लेबलचा ID 'role-label-1' असा आहे
    const label = document.getElementById(`role-label-${playerNo}`);
    
    if (checkbox.checked) {
        label.innerText = "P7";
        label.className = "text-[10px] text-green-500 font-bold"; // हिरवा रंग P7 साठी
    } else {
        label.innerText = "SUB";
        label.className = "text-[10px] text-gray-500 font-bold"; // राखाडी रंग SUB साठी
    }
}

/** */

function finalizeMatchSetup() {
    let tempTeamA = [];
    
    // समजा १ ते १२ खेळाडू आहेत
    for (let i = 1; i <= 12; i++) {
        const name = document.getElementById(`name-input-${i}`).value;
        const isPlaying = document.getElementById(`check-${i}`).checked;

        tempTeamA.push({
            no: i.toString(),
            name: name || `Player ${i}`,
            // इथे आपण आपलं 'Playing' आणि 'Bench' लॉजिक सेट करत आहोत
            playingStatus: isPlaying ? "Playing" : "Bench",
            status: isPlaying ? "In" : "Out", // सुरुवातीला प्लेइंग वाले 'In' असतील
            outTime: null
        });
    }
    
    teamAPlayers = tempTeamA;
    console.log("Team A Setup Complete:", teamAPlayers);
    
    // यानंतर मॅच स्क्रीनवर जा
}
/** */

function validateCheckboxes() {
    const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
    if (checkedCount > 7) {
        Swal.fire("मर्यादा!", "तुम्ही ७ पेक्षा जास्त खेळाडू 'Playing' म्हणून निवडू शकत नाही.", "warning");
        return false;
    }
    return true;
}
/** */

function handleCheckboxChange(playerNo) {
    const checkbox = document.getElementById(`check-${playerNo}`);
    const label = document.getElementById(`role-label-${playerNo}`); // जिथे P7/SUB लिहिलंय

    // ७ खेळाडूंची मर्यादा पाळण्यासाठी चेक (Optional पण गरजेचं)
    const checkedCount = document.querySelectorAll('.setup-checkbox:checked').length;
    
    if (checkedCount > 7 && checkbox.checked) {
        Swal.fire("मर्यादा!", "तुम्ही ७ पेक्षा जास्त 'Playing' खेळाडू निवडू शकत नाही.", "warning");
        checkbox.checked = false; // टिक काढून टाका
        return;
    }

    // UI अपडेट करा
    if (checkbox.checked) {
        label.innerText = "P7";
        label.classList.remove('text-gray-500');
        label.classList.add('text-green-500', 'font-bold');
    } else {
        label.innerText = "SUB";
        label.classList.remove('text-green-500');
        label.classList.add('text-gray-500', 'font-bold');
    }
}

/***हे फंक्शन आपण प्रत्येक रेडच्या रिझल्ट नंतर (Empty, Point, Tackle) कॉल करू. */

let raidCounter = 0;

/*** 
 * जुने addRaidToSummary फंक्शन पूर्ण काढून त्या जागी हा ५-५ मोड सपोर्ट करणारा आणि टाईमलाईनला डिव्हाइडर लावणारा कडकडीत कोड
 * 
*/
// function addRaidToSummary(team, raiderName, result, points, details, isLoadedFromDB = false, isFiveRaid = false) {
//     const raidFeed = document.getElementById('raidFeed'); 
//     const modalRaidList = document.getElementById('modalRaidList'); 
//     const noRaidText = document.getElementById('noRaidText');
//     const modalEmptyText = document.getElementById('modalEmptyText');

//     if (noRaidText) noRaidText.remove(); 
//     if (modalEmptyText) modalEmptyText.remove(); 

//     if (!isLoadedFromDB) {
//         raidCounter++;
//         const totalRaidsEl = document.getElementById('totalRaids');
//         if (totalRaidsEl) totalRaidsEl.innerText = `Raids: ${raidCounter}`;
//     }

//     // 🚨 [5-5 TIE BREAKER DIVIDER]: ५-५ मोड सुरू झाल्यावर टाईमलाईनमध्ये एकच वेळ कडक ब्रेक लावणे
//     if (isFiveRaid && !window.fiveRaidDividerInserted && modalRaidList) {
//         window.fiveRaidDividerInserted = true; // दोबारा डिव्हाइडर पडू नये म्हणून लॉक
//         const dividerEntry = document.createElement('div');
//         dividerEntry.className = "my-4 mx-1 p-2 bg-gradient-to-r from-orange-950 via-slate-900 to-orange-950 border border-orange-500/30 rounded-xl text-center shadow-lg animate-pulse";
//         dividerEntry.innerHTML = `
//             <p class="text-[10px] text-orange-400 font-black tracking-widest uppercase">🤝 MAIN MATCH TIE (FULL TIME ENDED)</p>
//             <p class="text-[8px] text-white font-bold uppercase mt-0.5">🔥 5-5 TIE-BREAKER RAIDS BEGINS</p>
//         `;
//         modalRaidList.prepend(dividerEntry);
//     }

//     let finalHeaderName = raiderName;
//     let finalDetailsText = (details && details !== "") ? details : "";

//     if (result.toUpperCase() === 'ALL OUT') {
//         finalHeaderName = `TEAM ${team}  +2`;
//         if (details.toLowerCase().includes("awarded to")) {
//             let targetAllOutTeam = team === 'A' ? 'B' : 'A';
//             finalDetailsText = `Team ${targetAllOutTeam} All out`;
//         }
//     }

//     // --- 🎨 १. होम स्क्रीन होरिझॉन्टल फीड (Dynamic Styling) ---
//     // जर ५-५ मोड असेल तर टोटली सेपरेट निऑन-ऑरेंज थीम लावा
//     let borderColor = (team === 'A') ? 'border-green-500' : 'border-blue-500';
//     let actionBg = "bg-gray-900"; 
//     let indicatorIcon = "•"; 
//     let cardCustomStyle = ""; 

//     if (isFiveRaid) {
//         actionBg = "bg-gradient-to-r from-orange-950/40 to-zinc-900";
//         indicatorIcon = "⚡";
//         cardCustomStyle = "border-orange-500 shadow-lg relative";
//     }
//     else if (result.toUpperCase() === 'ALL OUT') {
//         actionBg = "bg-gradient-to-br from-amber-600/30 via-orange-950/40 to-black";
//         indicatorIcon = "🚨";
//         cardCustomStyle = "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse";
//     } 
//     else if (result.toUpperCase().includes('TACKLE')) { 
//         actionBg = "bg-red-900/30"; 
//         indicatorIcon = "🛑"; 
//     }
//     else if (result.toUpperCase().includes('BONUS')) { 
//         actionBg = "bg-blue-900/30"; 
//         indicatorIcon = "✨"; 
//     }
//     else if (points > 0) { 
//         actionBg = "bg-green-900/30"; 
//         indicatorIcon = "🎯"; 
//     }

//     const raidEntry = document.createElement('div');
//     raidEntry.className = `flex-shrink-0 w-48 ${actionBg} p-2 rounded-md shadow-md relative border-l-2 ${(result.toUpperCase() === 'ALL OUT' || isFiveRaid) ? cardCustomStyle : borderColor}`;
    
//     // ५-५ मोडसाठी लहान अक्षरात 5-5 Raid मेन्शन करणे
//     const badgeHtml = isFiveRaid ? `<span class="absolute top-1 right-1 text-[5px] bg-orange-600/30 border border-orange-500/20 text-orange-400 px-1 py-0.5 rounded font-black uppercase">5-5 Raid</span>` : '';

//     raidEntry.innerHTML = `
//         ${badgeHtml}
//         <div class="flex justify-between items-start mb-0.5">
//             <span class="text-[10px] font-black text-white truncate w-36 uppercase tracking-wide">${finalHeaderName}</span>
//         </div>
//         <div class="flex items-center gap-1 mb-1 opacity-90">
//             <span class="text-[9px] ${isFiveRaid ? 'text-orange-400' : 'text-amber-400'} font-black uppercase tracking-tight">${indicatorIcon} ${result}</span>
//         </div>
//         <div class="border-t border-white/10 pt-1 mt-1">
//             <div class="text-[8.5px] text-gray-300 leading-snug font-bold italic uppercase tracking-tighter">${finalDetailsText}</div>
//         </div>
//     `;
//     if (raidFeed) raidFeed.prepend(raidEntry);

//     // --- 🎨 २. [MATCH TIMELINE]: मॅच टाईमलाईनवरील रचना (MATCH CENTRE) ---
//     if (modalRaidList) {
//         const modalEntry = document.createElement('div');
        
//         // ५-५ मोडसाठी मॅच सेंटरमध्ये स्वतंत्र निऑन-ऑरेंज उभे प्रीमियम कार्ड रचना
//         let cardBg = (team === 'A') ? 'bg-green-500/5 border-l-4 border-green-500' : 'bg-blue-500/5 border-l-4 border-blue-500';
//         let ptsBg = (team === 'A') ? 'bg-green-600 text-white' : 'bg-blue-600 text-white';

//         if (isFiveRaid) {
//             cardBg = 'bg-orange-500/5 border-l-4 border-orange-500 shadow-[inset_0_0_10px_rgba(249,115,22,0.05)]';
//             ptsBg = 'bg-orange-500 text-black';
//         } else if (result.toUpperCase() === 'ALL OUT') {
//             cardBg = 'bg-amber-500/10 border-l-4 border-amber-500 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]';
//             ptsBg = 'bg-amber-500 text-black';
//         }

//         modalEntry.className = `p-3 mb-2 mx-1 rounded-r-xl flex gap-3 items-center shadow-sm ${cardBg} relative overflow-hidden`;
        
//         const centerBadgeHtml = isFiveRaid ? `<span class="absolute top-1.5 right-1.5 text-[5px] bg-orange-600/20 border border-orange-500/20 text-orange-400 px-1 py-0.5 rounded font-black uppercase tracking-tighter">5-5 Raid</span>` : '';

//         modalEntry.innerHTML = `
//             ${centerBadgeHtml}
//             <div class="shrink-0 w-7 h-7 ${ptsBg} text-[11px] font-black flex items-center justify-center rounded-full shadow">
//                 +${points}
//             </div>
//             <div class="flex-1 text-[11px] leading-relaxed text-gray-300">
//                 <div class="flex items-center gap-1.5 flex-wrap">
//                     <span class="font-black text-white uppercase tracking-wide">${finalHeaderName}</span> 
//                     <span class="text-gray-500 font-medium">➔</span>
//                     <span class="font-black ${isFiveRaid ? 'text-orange-400' : 'text-amber-400'} uppercase tracking-tight">${result}</span>
//                 </div>
//                 ${finalDetailsText ? `<div class="text-[9.5px] ${isFiveRaid ? 'text-orange-400/80' : 'text-amber-500/80'} font-bold italic mt-0.5 flex items-center gap-1">🚨 ${finalDetailsText}</div>` : ''}
//             </div>
//         `;
//         modalRaidList.prepend(modalEntry);
//     }

//     // --- 🔒 LOCAL STORAGE SYNC ---
//     if (!isLoadedFromDB && typeof matchSetupData !== 'undefined' && matchSetupData && matchSetupData.mId) {
//         if (!window.activeRaidsList) window.activeRaidsList = [];

//         window.activeRaidsList.push({
//             team: team,
//             raiderName: finalHeaderName, 
//             result: result,
//             points: Number(points),
//             details: finalDetailsText,
//             timestamp: new Date().getTime(),
//             isFiveRaid: isFiveRaid // ५-५ आयडेंटिफायर स्टोरेजमध्ये लॉक करणे
//         });

//         try {
//             const rawString = JSON.stringify(window.activeRaidsList);
//             const encodedData = btoa(unescape(encodeURIComponent(rawString)));
//             localStorage.setItem(`raids_secure_log_${matchSetupData.mId}`, encodedData);
//             console.log(`💾 [Local Sync Success]: ५-५ डेटा 'raids_secure_log' मध्ये कडक लॉक केला!`);
//         } catch (err) {
//             console.error("🚨 LocalStorage Save Error:", err);
//         }
//     }

//     if (typeof calculateTopStats === "function") {
//         calculateTopStats();
//     }
// }

/*** */
function addRaidToSummary(team, raiderName, result, points, details, isLoadedFromDB = false, isFiveRaid = false, isGoldenRaid = false) {
    const raidFeed = document.getElementById('raidFeed'); 
    const modalRaidList = document.getElementById('modalRaidList'); 
    const noRaidText = document.getElementById('noRaidText');
    const modalEmptyText = document.getElementById('modalEmptyText');

    if (noRaidText) noRaidText.remove(); 
    if (modalEmptyText) modalEmptyText.remove(); 

    if (!isLoadedFromDB) {
        raidCounter++;
        const totalRaidsEl = document.getElementById('totalRaids');
        if (totalRaidsEl) totalRaidsEl.innerText = `Raids: ${raidCounter}`;
    }

    // 🚨 [5-5 TIE BREAKER DIVIDER]: ५-५ मोड सुरू झाल्यावर टाईमलाईनमध्ये एकच वेळ ब्रेक लावणे
    if (isFiveRaid && !window.fiveRaidDividerInserted && modalRaidList) {
        window.fiveRaidDividerInserted = true; 
        const dividerEntry = document.createElement('div');
        dividerEntry.className = "my-4 mx-1 p-2 bg-gradient-to-r from-orange-950 via-slate-900 to-orange-950 border border-orange-500/30 rounded-xl text-center shadow-lg animate-pulse";
        dividerEntry.innerHTML = `
            <p class="text-[10px] text-orange-400 font-black tracking-widest uppercase">🤝 MAIN MATCH TIE (FULL TIME ENDED)</p>
            <p class="text-[8px] text-white font-bold uppercase mt-0.5">🔥 5-5 TIE-BREAKER RAIDS BEGINS</p>
        `;
        modalRaidList.prepend(dividerEntry);
    }

    // 🚨 [GOLDEN RAID DIVIDER]: गोल्डन रेड सुरू झाल्यावर टाईमलाईनमध्ये सोनेरी ब्रेक लावणे 🔥
    if (isGoldenRaid && !window.goldenRaidDividerInserted && modalRaidList) {
        window.goldenRaidDividerInserted = true;
        const goldenDivider = document.createElement('div');
        goldenDivider.className = "my-4 mx-1 p-2 bg-gradient-to-r from-yellow-950 via-slate-900 to-yellow-950 border border-yellow-500/40 rounded-xl text-center shadow-[0_0_15px_rgba(234,179,8,0.15)] animate-pulse";
        goldenDivider.innerHTML = `
            <p class="text-[10px] text-yellow-500 font-black tracking-widest uppercase">⚡ 5-5 RAIDS MODE TIED AGAIN</p>
            <p class="text-[8px] text-white font-bold uppercase mt-0.5">👑 GOLDEN RAID (SUDDEN DEATH) STARTED</p>
        `;
        modalRaidList.prepend(goldenDivider);
    }

    let finalHeaderName = raiderName;
    let finalDetailsText = (details && details !== "") ? details : "";

    if (result.toUpperCase() === 'ALL OUT') {
        finalHeaderName = `TEAM ${team}  +2`;
        if (details.toLowerCase().includes("awarded to")) {
            let targetAllOutTeam = team === 'A' ? 'B' : 'A';
            finalDetailsText = `Team ${targetAllOutTeam} All out`;
        }
    }

    // --- 🎨 १. होम स्क्रीन होरिझॉन्टल फीड (Dynamic Styling) ---
    let borderColor = (team === 'A') ? 'border-green-500' : 'border-blue-500';
    let actionBg = "bg-gray-900"; 
    let indicatorIcon = "•"; 
    let cardCustomStyle = ""; 

    // 🪙 कंडिशन अ: जर गोल्डन रेड असेल तर कडक सोनेरी प्रिमियम लूक
    if (isGoldenRaid) {
        actionBg = "bg-gradient-to-r from-yellow-950/30 to-zinc-900";
        indicatorIcon = "🪙";
        cardCustomStyle = "border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)] relative";
    }
    // कंडिशन ब: जर ५-५ मोड असेल तर निऑन-ऑरेंज थीम
    else if (isFiveRaid) {
        actionBg = "bg-gradient-to-r from-orange-950/40 to-zinc-900";
        indicatorIcon = "⚡";
        cardCustomStyle = "border-orange-500 shadow-lg relative";
    }
    else if (result.toUpperCase() === 'ALL OUT') {
        actionBg = "bg-gradient-to-br from-amber-600/30 via-orange-950/40 to-black";
        indicatorIcon = "🚨";
        cardCustomStyle = "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse";
    } 
    else if (result.toUpperCase().includes('TACKLE')) { 
        actionBg = "bg-red-900/30"; 
        indicatorIcon = "🛑"; 
    }
    else if (result.toUpperCase().includes('BONUS')) { 
        actionBg = "bg-blue-900/30"; 
        indicatorIcon = "✨"; 
    }
    else if (points > 0) { 
        actionBg = "bg-green-900/30"; 
        indicatorIcon = "🎯"; 
    }

    const raidEntry = document.createElement('div');
    raidEntry.className = `flex-shrink-0 w-48 ${actionBg} p-2 rounded-md shadow-md relative border-l-2 ${(result.toUpperCase() === 'ALL OUT' || isFiveRaid || isGoldenRaid) ? cardCustomStyle : borderColor}`;
    
    // बॅज मॅनेजमेंट (५-५ की गोल्डन रेड)
    let badgeText = "";
    if (isGoldenRaid) badgeText = "Golden Raid";
    else if (isFiveRaid) badgeText = "5-5 Raid";

    const badgeHtml = badgeText ? `<span class="absolute top-1 right-1 text-[5px] ${isGoldenRaid ? 'bg-yellow-600/30 border border-yellow-500/20 text-yellow-400' : 'bg-orange-600/30 border border-orange-500/20 text-orange-400'} px-1 py-0.5 rounded font-black uppercase">${badgeText}</span>` : '';

    raidEntry.innerHTML = `
        ${badgeHtml}
        <div class="flex justify-between items-start mb-0.5">
            <span class="text-[10px] font-black text-white truncate w-36 uppercase tracking-wide">${finalHeaderName}</span>
        </div>
        <div class="flex items-center gap-1 mb-1 opacity-90">
            <span class="text-[9px] ${isGoldenRaid ? 'text-yellow-400' : (isFiveRaid ? 'text-orange-400' : 'text-amber-400')} font-black uppercase tracking-tight">${indicatorIcon} ${result}</span>
        </div>
        <div class="border-t border-white/10 pt-1 mt-1">
            <div class="text-[8.5px] text-gray-300 leading-snug font-bold italic uppercase tracking-tighter">${finalDetailsText}</div>
        </div>
    `;
    if (raidFeed) raidFeed.prepend(raidEntry);

    // --- 🎨 २. [MATCH TIMELINE]: मॅच सेंटरमधील रचना ---
    if (modalRaidList) {
        const modalEntry = document.createElement('div');
        
        let cardBg = (team === 'A') ? 'bg-green-500/5 border-l-4 border-green-500' : 'bg-blue-500/5 border-l-4 border-blue-500';
        let ptsBg = (team === 'A') ? 'bg-green-600 text-white' : 'bg-blue-600 text-white';

        if (isGoldenRaid) {
            cardBg = 'bg-yellow-500/5 border-l-4 border-yellow-500 shadow-[inset_0_0_10px_rgba(234,179,8,0.05)]';
            ptsBg = 'bg-yellow-500 text-black';
        } else if (isFiveRaid) {
            cardBg = 'bg-orange-500/5 border-l-4 border-orange-500 shadow-[inset_0_0_10px_rgba(249,115,22,0.05)]';
            ptsBg = 'bg-orange-500 text-black';
        } else if (result.toUpperCase() === 'ALL OUT') {
            cardBg = 'bg-amber-500/10 border-l-4 border-amber-500 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]';
            ptsBg = 'bg-amber-500 text-black';
        }

        modalEntry.className = `p-3 mb-2 mx-1 rounded-r-xl flex gap-3 items-center shadow-sm ${cardBg} relative overflow-hidden`;
        
        const centerBadgeHtml = badgeText ? `<span class="absolute top-1.5 right-1.5 text-[5px] ${isGoldenRaid ? 'bg-yellow-600/20 border border-yellow-500/20 text-yellow-400' : 'bg-orange-600/20 border border-orange-500/20 text-orange-400'} px-1 py-0.5 rounded font-black uppercase tracking-tighter">${badgeText}</span>` : '';

        modalEntry.innerHTML = `
            ${centerBadgeHtml}
            <div class="shrink-0 w-7 h-7 ${ptsBg} text-[11px] font-black flex items-center justify-center rounded-full shadow">
                +${points}
            </div>
            <div class="flex-1 text-[11px] leading-relaxed text-gray-300">
                <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="font-black text-white uppercase tracking-wide">${finalHeaderName}</span> 
                    <span class="text-gray-500 font-medium">➔</span>
                    <span class="font-black ${isGoldenRaid ? 'text-yellow-400' : (isFiveRaid ? 'text-orange-400' : 'text-amber-400')} uppercase tracking-tight">${result}</span>
                </div>
                ${finalDetailsText ? `<div class="text-[9.5px] ${isGoldenRaid ? 'text-yellow-400/80' : (isFiveRaid ? 'text-orange-400/80' : 'text-amber-500/80')} font-bold italic mt-0.5 flex items-center gap-1">🚨 ${finalDetailsText}</div>` : ''}
            </div>
        `;
        modalRaidList.prepend(modalEntry);
    }

    // --- 🔒 LOCAL STORAGE SYNC ---
    if (!isLoadedFromDB && typeof matchSetupData !== 'undefined' && matchSetupData && matchSetupData.mId) {
        if (!window.activeRaidsList) window.activeRaidsList = [];

        window.activeRaidsList.push({
            team: team,
            raiderName: finalHeaderName, 
            result: result,
            points: Number(points),
            details: finalDetailsText,
            timestamp: new Date().getTime(),
            isFiveRaid: isFiveRaid,
            isGoldenRaid: isGoldenRaid // स्टोरेज मध्ये देखील मॅप करणे
        });

        try {
            const rawString = JSON.stringify(window.activeRaidsList);
            const encodedData = btoa(unescape(encodeURIComponent(rawString)));
            localStorage.setItem(`raids_secure_log_${matchSetupData.mId}`, encodedData);
            console.log(`💾 [Local Sync Success]: डेटा लोकल स्टोरेजमध्ये सुरक्षित ट्रॅक केला!`);
        } catch (err) {
            console.error("🚨 LocalStorage Save Error:", err);
        }
    }

    if (typeof calculateTopStats === "function") {
        calculateTopStats();
    }
}


/**
// १. मॉडेल उघडण्यासाठी
//  */
/**
 * सुधारित openSummaryModal फंक्शन (मास्टर ऑब्जेक्टसह)
आपण ठरवल्याप्रमाणे कोणताही मूळचा फ्लो न विस्कटता, 
फक्त लोकल स्टोरेजमधून आपला नवा global_score_card ऑब्जेक्ट ओढून तो चालू मॅचच्या स्टेटस (dbStatus किंवा मेमरी फ्लॅग्ज) नुसार स्क्रीनवर सेट करूया.
 */

/** */
// function openSummaryModal() {
//     console.log("%c====================================================================", "color: #9333ea; font-weight: bold;");
//     console.log("%c🚨 [STEP 1 - ENGINE START]: openSummaryModal() ट्रिगर झाले!", "background: #9333ea; color: #fff; font-weight: bold; padding: 3px;");

//     const modal = document.getElementById('summaryModal');
//     console.log("➡️ [STAGE 1.1 - DOM CHECK]: 'summaryModal' कंटेनर स्थिती ➔", modal ? "✅ हजर आहे" : "❌ गायब आहे!");

//     // १. टीमची नावे (फक्त मजकूर)
//     const nameA = document.getElementById('teamAName')?.innerText || "Team A";
//     const nameB = document.getElementById('teamBName')?.innerText || "Team B";
//     console.log(`➡️ [STAGE 1.2 - RAW NAMES FROM SCREEN]: घेतलेली नावे ➔ Team A: "${nameA}" | Team B: "${nameB}"`);

//     // २. [MASTER SCORECARD ENGINE] - लोकल स्टोरेजवरून ऑब्जेक्ट ओढणे
//     const localCard = localStorage.getItem('global_score_card');
//     console.log("➡️ [STAGE 1.3 - LOCALSTORAGE SNAPSHOT]: global_score_card चा रॅा डेटा ➔", localCard);

//     const currentScoreCard = localCard ? JSON.parse(localCard) : {
//         mainMatch:  { teamA: 0, teamB: 0 },
//         fiveRaid:   { teamA: 0, teamB: 0 },
//         goldenRaid: { teamA: 0, teamB: 0 }
//     };

//     // ३. चालू मॅचच्या स्टेटस ओळखून अचूक स्कोअर फायनल करणे
//     let finalScoreA = currentScoreCard.mainMatch.teamA;
//     let finalScoreB = currentScoreCard.mainMatch.teamB;
//     let activeMode = "Main Match (मुख्य वेळ)";

//     if (window.isFiveRaidModeOn === true) {
//         activeMode = "Five Raid (५-५ मोड)";
//         finalScoreA = currentScoreCard.fiveRaid.teamA;
//         finalScoreB = currentScoreCard.fiveRaid.teamB;
//     } else if (window.isGoldenRaidActiveNow === true) {
//         activeMode = "Golden Raid (सुवर्ण मोड)";
//         finalScoreA = currentScoreCard.goldenRaid.teamA;
//         finalScoreB = currentScoreCard.goldenRaid.teamB;
//     }

//     console.log(`➡️ [STAGE 1.4 - RESOLVED LIVE MODE]: मोड ठरला ➔ "${activeMode}" | पास होणारे आकडे ➔ A: ${finalScoreA} vs B: ${finalScoreB}`);

//     // ४. मॉडेलमध्ये डेटा सेट करा
//     const mNameA = document.getElementById('modalTeamAName');
//     const mNameB = document.getElementById('modalTeamBName');
//     const mScoreA = document.getElementById('modalTeamAScore');
//     const mScoreB = document.getElementById('modalTeamBScore');

//     console.log("➡️ [STAGE 1.5 - HEADER TARGET ELEMENTS]: हेडरच्या कप्प्यांची डोममधील जिवंत स्थिती:", {
//         "modalTeamAName कप्पा": mNameA ? "✅ हजर" : "❌ गायब",
//         "modalTeamBName कप्पा": mNameB ? "✅ हजर" : "❌ गायब",
//         "modalTeamAScore (Team A हेडर स्कोअर कप्पा)": mScoreA ? "✅ हजर" : "❌ गायब",
//         "modalTeamBScore (Team B हेडर स्कोअर कप्पा)": mScoreB ? "✅ हजर" : "❌ गायब"
//     });

//     // 🎯 प्रत्यक्ष व्हॅल्यू भरताना कन्सोलमध्ये लॉग करणे
//     if (mNameA) { mNameA.innerText = nameA; console.log(`✍️ [Header Injection]: Team A नाव सेट केले ➔ "${nameA}"`); }
//     if (mNameB) { mNameB.innerText = nameB; console.log(`✍️ [Header Injection]: Team B नाव सेट केले ➔ "${nameB}"`); }
    
//     if (mScoreA) { 
//         mScoreA.innerText = finalScoreA; 
//         console.log(`✍️ [Header Injection]: Team A चा स्कोअर ${finalScoreA} मॅन्युअली भरला! नवीन innerText ➔ "${mScoreA.innerText}"`);
//     }
//     if (mScoreB) { 
//         mScoreB.innerText = finalScoreB; 
//         console.log(`✍️ [Header Injection]: Team B चा स्कोअर ${finalScoreB} मॅन्युअली भरला! नवीन innerText ➔ "${mScoreB.innerText}"`);
//     }

//     // ५. मॉडेल उघडा
//     if (modal) {
//         modal.classList.remove('hidden');
//         modal.classList.add('flex');
//         document.body.style.overflow = 'hidden';
//         console.log("🔓 [STAGE 1.6 - MODAL FLEX DISPLAY]: मोडल स्क्रीनवर दाखवले गेले.");
//     }
//     console.log("%c🚨 [STEP 1 END]: openSummaryModal() चे काम संपले.", "color: #9333ea; font-weight: bold;");
//     console.log("%c====================================================================", "color: #9333ea; font-weight: bold;");
// }
/** */
async function openSummaryModal(tId, mId) {
    // =========================================================================
    // 📂 SECTION 1: INITIAL ENGINE START & DOM CHECK
    // =========================================================================
    console.log("%c====================================================================", "color: #9333ea; font-weight: bold;");
    console.log("%c🚨 [STEP 1 - ENGINE START]: openSummaryModal() ट्रिगर झाले!", "background: #9333ea; color: #fff; font-weight: bold; padding: 3px;");

    const modal = document.getElementById('summaryModal');
    console.log("➡️ [STAGE 1.1 - DOM CHECK]: 'summaryModal' कंटेनर स्थिती ➔", modal ? "✅ हजर आहे" : "❌ गायब आहे!");

    // आयडी रिकव्हरी (जर पॅरामिटर्स नसतील तर ग्लोबल किंवा स्टोरेजमधून ओढणे)
    let finalTId = tId || matchSetupData?.tId || currentMatchData?.tId;
    let finalMId = mId || matchSetupData?.mId || currentMatchData?.mId;

    if (!finalTId || !finalMId) {
        const savedMatchRaw = localStorage.getItem('squad_editing_match');
        if (savedMatchRaw) {
            const parsed = JSON.parse(savedMatchRaw);
            finalTId = finalTId || parsed.tId;
            finalMId = finalMId || parsed.mId;
        }
    }

    console.log(`👉 [IDs DETECTED]: Tournament ID: ${finalTId} | Match ID: ${finalMId}`);

    // मोडल उघडण्यापूर्वी जुनी रेंडर झालेली टाइमलाईन लिस्ट साफ करणे (Clean UI)
    const mList = document.getElementById('modalRaidList');
    if (mList) mList.innerHTML = `<div class="text-center py-10 text-gray-500 text-[10px] animate-pulse">डेटा लोड होत आहे...</div>`;


    // =========================================================================
    // 📂 SECTION 2: LIVE FIRESTORE DATA SNAPSHOT (🎯 THE BLANK TIMELINE FIX)
    // =========================================================================
    let matchData = null;
    if (finalTId && finalMId) {
        try {
            console.log("🔄 [Firestore Fetch]: डेटाबेसच्या विहिरीतून ताजा इतिहास ओढत आहे...");
            const mDoc = await db.collection("tournaments").doc(finalTId).collection("matches").doc(finalMId).get();
            if (mDoc.exists) {
                matchData = mDoc.data();
                console.log("📦 [Firestore Success]: ताजा मॅच डेटा मिळाला ➔", matchData);
                
                // 🚨 [💥 CRITICAL]: टाइमलाईन आणि प्लेयर समरी चालण्यासाठी जागतिक कप्पे भरणे!
                window.activeRaidsList = matchData.raidsHistory || matchData.timeline || [];
                window.currentMatchData = matchData;
            }
        } catch (err) {
            console.error("🚨 [Firestore Fetch Error]: डेटा ओढताना तांत्रिक चूक:", err);
        }
    }


    // =========================================================================
    // 📂 SECTION 3: RAW NAMES RESOLUTION
    // =========================================================================
    const nameA = matchData?.teamA || document.getElementById('teamAName')?.innerText || "Team A";
    const nameB = matchData?.teamB || document.getElementById('teamBName')?.innerText || "Team B";
    console.log(`➡️ [STAGE 1.2 - NAMES RESOLVED]: घेतलेली नावे ➔ Team A: "${nameA}" | Team B: "${nameB}"`);


    // =========================================================================
    // 📂 SECTION 4: MASTER SCORECARD ENGINE & STATUS MODE DECISION
    // =========================================================================
    // डेटाबेसचा स्कोरकार्ड प्राधान्य, नसल्यास लोकलस्टोरेज बॅकअप
    const localCard = localStorage.getItem('global_score_card');
    const currentScoreCard = matchData?.scoreCard || (localCard ? JSON.parse(localCard) : {
        mainMatch:  { teamA: 0, teamB: 0 },
        fiveRaid:   { teamA: 0, teamB: 0 },
        goldenRaid: { teamA: 0, teamB: 0 }
    });

    console.log("➡️ [STAGE 1.3 - CARD DATA]: scoreCard ऑब्जेक्ट स्थिती ➔", currentScoreCard);

    // चालू मॅचचा स्टेटस ओळखून अचूक स्कोअर फायनल करणे
    let finalScoreA = currentScoreCard.mainMatch.teamA;
    let finalScoreB = currentScoreCard.mainMatch.teamB;
    let activeMode = "Main Match (मुख्य वेळ)";

    const currentStatus = (matchData?.status || matchData?.match_status || "").trim();

    // 🟢 मेमरी फ्लॅग उडाला असेल तर डेटाबेसच्या 'status' वरून अचूक मोड निवडणे!
    if (window.isFiveRaidModeOn === true || currentStatus === "five_raid") {
        activeMode = "Five Raid (५-५ मोड)";
        finalScoreA = currentScoreCard.fiveRaid.teamA;
        finalScoreB = currentScoreCard.fiveRaid.teamB;
    } else if (window.isGoldenRaidActiveNow === true || currentStatus === "golden_raid") {
        activeMode = "Golden Raid (सुवर्ण मोड)";
        finalScoreA = currentScoreCard.goldenRaid.teamA;
        finalScoreB = currentScoreCard.goldenRaid.teamB;
    }

    console.log(`➡️ [STAGE 1.4 - RESOLVED LIVE MODE]: मोड ठरला ➔ "${activeMode}" | पास होणारे आकडे ➔ A: ${finalScoreA} vs B: ${finalScoreB}`);


// =========================================================================
    // 📂 SECTION 5: DOM INJECTION & DYNAMIC BADGE OVERWRITE (🎯 WINNER TRACKER ON)
    // =========================================================================
    const mNameA = document.getElementById('modalTeamAName');
    const mNameB = document.getElementById('modalTeamBName');
    const mScoreA = document.getElementById('modalTeamAScore');
    const mScoreB = document.getElementById('modalTeamBScore');

    if (mNameA) { mNameA.innerText = nameA; }
    if (mNameB) { mNameB.innerText = nameB; }
    if (mScoreA) { mScoreA.innerText = finalScoreA; console.log(`✍️ [Injection]: modalTeamAScore innerText ➔ "${mScoreA.innerText}"`); }
    if (mScoreB) { mScoreB.innerText = finalScoreB; console.log(`✍️ [Injection]: modalTeamBScore innerText ➔ "${mScoreB.innerText}"`); }

    // 🏆 [💥 DYNAMIC STATUS OVERVIEW BADGE]: ओव्हरव्ह्यू डब्याचा रंग आणि विनर टेक्स्ट बदलणे
    const overviewBadge = document.getElementById('matchOverviewStatusBadge') || document.querySelector('[class*="5-5 RAIDS IN PROGRESS"]') || document.querySelector('[class*="MATCH IN PROGRESS"]');
    
    if (overviewBadge) {
        if (currentStatus === "Finished") {
            console.log("⚙️ [WINNER CALCULATION]: सामना संपला आहे, विजेता शोधत आहे...");
            
            // १. ५-५ स्कोरकार्ड किंवा मुख्य स्कोरकार्ड मधील फायनल आकडे गोळा करणे
            let finalScoreA_Num = Number(currentScoreCard?.fiveRaid?.teamA || currentScoreCard?.mainMatch?.teamA || 0);
            let finalScoreB_Num = Number(currentScoreCard?.fiveRaid?.teamB || currentScoreCard?.mainMatch?.teamB || 0);
            
            let winnerText = "🏆 MATCH FINISHED / सामना संपला";
            
            // २. मॅथेमॅटिकल चेक करून जिंकलेल्या टीमचे नाव ठरवणे
            if (finalScoreA_Num > finalScoreB_Num) {
                winnerText = `🏆 WINNER: ${nameA.toUpperCase()}🥇`;
            } else if (finalScoreB_Num > finalScoreA_Num) {
                winnerText = `🏆 WINNER: ${nameB.toUpperCase()}🥇`;
            } else if (matchData?.winner) {
                // बॅकअप चेक: जर डेटाबेसमध्ये थेट विजेता सेव्ह असेल
                winnerText = `🏆 WINNER: ${matchData.winner.toUpperCase()}🥇`;
            } else {
                winnerText = "🤝 MATCH TIED / सामना बरोबरीत सुटला";
            }

            console.log(`🎯 [WINNER RESOLVED] ➔ Text: "${winnerText}"`);

            // ३. स्क्रीनवरील बॅज कडक हिरव्या रंगात विनरच्या नावासह अपडेट करणे
            overviewBadge.innerText = winnerText;
            overviewBadge.className = "w-full bg-green-950/80 text-green-400 py-3 rounded-2xl text-[11px] font-black uppercase text-center border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)] tracking-wide";
            
        } else if (currentStatus === "five_raid") {
            overviewBadge.innerText = "⚔️ 5-5 RAIDS IN PROGRESS (महासंग्राम चालू)";
            overviewBadge.className = "w-full bg-orange-950/40 text-orange-400 py-3 rounded-2xl text-[10px] font-black uppercase text-center border border-orange-500/30 shadow-md animate-pulse";
        } else {
            // जर सामना अजून चालू असेल (Live स्थिती)
            overviewBadge.innerText = "MATCH IN PROGRESS / सामना सुरू आहे...";
            overviewBadge.className = "w-full bg-orange-950/40 text-orange-400 py-3 rounded-2xl text-[10px] font-black uppercase text-center border border-orange-500/30 shadow-md";
        }
    }


    // =========================================================================
    // 📂 SECTION 6: RE-RENDER TIMELINE & TRIGGER MODAL IGNITION
    // =========================================================================
    if (mList) mList.innerHTML = ""; // लोडिंग स्टेट साफ केला

    // डेटाबेसमधून आलेल्या खऱ्याखुऱ्या रेड्स लूपद्वारे टाइमलाईन समरी फीडमध्ये पाठवणे
    if (window.activeRaidsList && window.activeRaidsList.length > 0) {
        console.log(`🔄 [Timeline Re-build]: एकूण ${window.activeRaidsList.length} रेड्स मोडलमध्ये ढकलत आहे...`);
        window.activeRaidsList.forEach(r => {
            if (typeof addRaidToSummary === "function") {
                addRaidToSummary(r.team, r.raiderName, r.result, r.points, r.details, true, r.isFiveRaid || false, r.isGoldenRaid || false);
            }
        });

        // एकूण रेड्स संख्या ओव्हरव्ह्यू डब्यात दाखवणे
        const totalRaidsWitnessedEl = document.querySelector('[class*="Total Raids Witnessed"]');
        if (totalRaidsWitnessedEl) {
            totalRaidsWitnessedEl.innerText = `Total Raids Witnessed: ${window.activeRaidsList.length}`;
        }
    } else {
        if (mList) mList.innerHTML = `<div class="text-center py-16 text-gray-500 text-xs font-bold">No raids recorded yet.</div>`;
    }

    // टॉप परफॉर्मर्सचे आकडे मोजणे
    if (typeof calculateTopStats === "function") {
        calculateTopStats();
    }

    // मॉडेल स्क्रीनवर उघडणे
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        console.log("🔓 [STAGE 1.6 - MODAL FLEX DISPLAY]: मोडल स्क्रीनवर यशस्वीरीत्या उघडले गेले.");
        
        // मोडल उघडल्यावर बाय-डिफॉल्ट ओव्हरव्ह्यू किंवा समरी टॅबवर जाणे
        if (typeof switchTimelineTab === "function") {
            switchTimelineTab('match_summary'); 
        }
    }

    console.log("%c🚨 [STEP 1 END]: openSummaryModal() चे काम संपले.", "color: #9333ea; font-weight: bold;");
    console.log("%c====================================================================", "color: #9333ea; font-weight: bold;");
}
/** */
// २. मॉडेल बंद करण्यासाठी
function closeSummaryModal() {
    const modal = document.getElementById('summaryModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    
    // बॉडी स्क्रोल पुन्हा सुरू करा
    document.body.style.overflow = 'auto';
}/** */

//१. नवीन addEventToSummary फंक्शन
//हे फंक्शन तुझे रेड कार्ड्स आणि इव्हेंट कार्ड्स यांच्यात सुसंगतता ठेवेल.

function addEventToSummary(type, team, message) {
    console.log(`--- [EVENT_FEED] Adding ${type} for Team ${team} ---`);
    
    const raidFeed = document.getElementById('raidFeed');
    const modalRaidList = document.getElementById('modalRaidList');
    const noRaidText = document.getElementById('noRaidText');
    const modalEmptyText = document.getElementById('modalEmptyText');

    if (noRaidText) noRaidText.style.display = 'none';
    if (modalEmptyText) modalEmptyText.remove();

    // १. आडवा स्क्रोलर (Small Card) - तुझ्या रेड कार्ड सारखाच लुक
    const borderColor = (team === 'A') ? 'border-green-500' : (team === 'B' ? 'border-blue-500' : 'border-orange-500');
    const icon = type === 'TIMEOUT' ? '⏱️' : '🔄';
    const bgColor = type === 'TIMEOUT' ? 'bg-orange-900/30' : 'bg-blue-900/30';

    const eventEntry = document.createElement('div');
    eventEntry.className = `flex-shrink-0 w-40 ${bgColor} border-l-2 ${borderColor} p-2 rounded-md shadow-md relative`;
    eventEntry.innerHTML = `
        <div class="flex justify-between items-start mb-0.5">
            <span class="text-[10px] font-black text-white uppercase">${type}</span>
            <span class="text-[8px] text-gray-400">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        <div class="flex items-center gap-1 mb-1 opacity-90">
            <span class="text-[9px] text-white font-bold tracking-tight">${icon} TEAM ${team}</span>
        </div>
        <div class="border-t border-white/10 pt-1 mt-1">
            <div class="text-[8px] text-white/80 leading-tight font-medium italic">${message}</div>
        </div>
    `;
    raidFeed.prepend(eventEntry);

    // २. मॉडेलमधील कॉमेंट्री स्टाईल (Summary Modal)
    if (modalRaidList) {
        const modalEntry = document.createElement('div');
        modalEntry.className = "py-2.5 border-b border-gray-100 flex gap-3 items-start bg-gray-50/50";
        
        const ptsBg = type === 'TIMEOUT' ? 'bg-orange-500' : 'bg-blue-500';
        
        modalEntry.innerHTML = `
            <div class="shrink-0 w-6 h-6 ${ptsBg} text-white text-[10px] font-black flex items-center justify-center rounded">
                ${type === 'TIMEOUT' ? 'T' : 'S'}
            </div>
            <div class="flex-1 text-[11px] leading-relaxed text-gray-700">
                <span class="font-black text-black uppercase">${type}</span>: 
                <span class="font-medium text-gray-900">${message}</span>
                <span class="text-gray-400 text-[9px] ml-2 italic">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        modalRaidList.prepend(modalEntry);
    }
}

/** */

function updateVisualPlayers() {
    console.log("--- [ICON_DEBUG_START] ---");

    const renderIcons = (team, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        // जर window. वर नसेल तर थेट व्हेरिएबल नाव वापरून बघा
        let players = [];
        try {
            players = (team === 'A') ? teamAPlayers : teamBPlayers;
        } catch(e) {
            console.error(`[ICON_DEBUG] Could not access team${team}Players variable!`);
        }
        
        console.log(`[ICON_DEBUG] Team ${team} has ${players ? players.length : 0} players in data.`);
        container.innerHTML = ""; 

        for (let i = 0; i < 7; i++) {
            let p = players && players[i] ? players[i] : null;
            
            // जर खेळाडू सापडला आणि त्याचा स्टेटस 'Out' असेल तरच राखाडी
            const isOut = p && p.status === 'Out';
            const iconColor = isOut ? '#4b5563' : '#10b981'; 
            
            if(p) {
                console.log(`  [PLAYER_${i+1}] No: ${p.no} | Status: ${p.status} | Color: ${iconColor}`);
            }

            container.innerHTML += `<i class="fa-solid fa-user" style="color: ${iconColor} !important; font-size: 11px; margin: 0 1px;"></i>`;
        }
    };

    renderIcons('A', 'playerIconsA');
    renderIcons('B', 'playerIconsB');
    console.log("--- [ICON_DEBUG_END] ---");
}

function setupLiveMatchNames() {
    // १. Storage मधून फक्त नावे (Text) काढून व्हेरिएबलमध्ये ठेवली
    const nameA = localStorage.getItem('currentTeamA') || "TEAM A";
    const nameB = localStorage.getItem('currentTeamB') || "TEAM B";

    // २. मुख्य स्क्रीनवरची नावे बदलली
    const elA = document.getElementById('teamAName') || document.getElementById('liveTeamA');
    const elB = document.getElementById('teamBName') || document.getElementById('liveTeamB');

    if (elA) elA.innerText = nameA;
    if (elB) elB.innerText = nameB;

    // ३. मॉडेल (Timeline) मधली नावे बदलली
    const modalA = document.getElementById('modalTeamAName');
    const modalB = document.getElementById('modalTeamBName');

    if (modalA) modalA.innerText = nameA;
    if (modalB) modalB.innerText = nameB;

    console.log("Names fixed: ", nameA, " vs ", nameB);
}



/** Match Timer */

let matchTotalSeconds = 20 * 60; 
let matchInterval = null;
let isMatchPaused = true; 
let isFirstTimeStart = true;   // मॅच पहिल्यांदाच सुरू होणार आहे की आधी पॉज केली होती याचा ट्रॅकर 🚀

// १. टायमर फॉरमॅट करणे
function formatMatchTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// २. टायमर सुरू/पॉज करणे (हे तुमच्या 'Pause Match' बटणासाठी)


/**अपडेटेड toggleMatchTimer (Locking सह) 🚀
यामध्ये मी तुझे मूळ लॉजिक तसेच ठेवले आहे, फक्त बटण अनलॉक करण्याचे आणि नेव्हिगेशन लॉक करण्याचे काम वाढवले आहे.
 */
// ⏱️ १. मुख्य टायमर टॉगल फंक्शन (PAUSE / RESUME चे मॅन्युअल बटण)
function toggleMatchTimer() {
    const btn = document.getElementById('mainMatchBtn'); 
    const scoringArea = document.getElementById('scoringButtonsContainer'); 

    // 🎯 कोणत्याही परिस्थितीत आधी चालू असलेला टायमर लूप सुरक्षित क्लिअर करा
    clearInterval(matchInterval);

    // 🟢 [केस A]: जर मॅच खरोखर पॉज आहे ➔ खेळ सुरू किंवा रिझ्युम करा!
    if (window.isMatchPaused) {
        window.isMatchPaused = false; // मेमरी अनलॉक 🔓
        console.log("%c⏱️ [Engine]: टायमर सुरू / रिझ्युम करत आहे...", "color: #22c55e; font-weight: bold;");
        
        if (scoringArea) {
            scoringArea.style.pointerEvents = "auto";
            scoringArea.style.opacity = "1"; // स्कोअरिंग कंट्रोल्स अनलॉक
        }

        if (typeof lockUserOnScoringPage === 'function') lockUserOnScoringPage(true); 

        if (btn) {
            btn.innerText = "PAUSE MATCH";
            btn.className = "w-full bg-red-600 py-4 rounded-2xl text-[10px] font-black uppercase border border-red-700 shadow-xl active:scale-95 text-white";
        }

        if (window.isFirstTimeStart) {
            console.log("%c🔥 [LIVE]: पहिली शिटी वाजली! खेळ सुरू झाला.", "color: #22c55e; font-weight: bold;");
            window.isFirstTimeStart = false; 
        }

        // क्लाउडवर टायमर चालू (Live) असल्याचा सिंक पाठवा (isMatchPaused: false)
        syncTimerToFirestore(matchTotalSeconds, false);

        // ⏱️ टायमरचे मुख्य इंजिन (कन्सोल कचरा विरहित 🧼)
        matchInterval = setInterval(() => {
            if (matchTotalSeconds > 0) {
                matchTotalSeconds--;
                if (typeof updateMatchUI === "function") updateMatchUI(); 
                localStorage.setItem('savedMatchTime', matchTotalSeconds);
            } else {
                clearInterval(matchInterval);
                if (typeof handleMatchTimeEnd === 'function') handleMatchTimeEnd();
            }
        }, 1000);

    } 
    // 🔴 [केस B]: जर मॅच ऑलरेडी सुरू आहे ➔ खेळ जागीच लॉक (Pause) करा!
    else {
        window.isMatchPaused = true; // मेमरी लॉक 🔒
        console.log("%c⏸️ [Engine]: मॅच मॅन्युअली पॉज केली.", "color: #ef4444; font-weight: bold;");
        
        if (btn) {
            btn.innerText = "RESUME MATCH";
            btn.className = "w-full bg-green-600 py-4 rounded-2xl text-[10px] font-black uppercase border border-green-500 shadow-xl active:scale-95 text-white animate-pulse";
        }

        if (scoringArea) {
            scoringArea.style.pointerEvents = "none";
            scoringArea.style.opacity = "0.4"; // स्कोअरिंग कंट्रोल्स कडक लॉक
        }

        // ☁️ क्लाउडवर टायमर पॉज झाल्याचा सिंक पाठवा (isMatchPaused: true)
        syncTimerToFirestore(matchTotalSeconds, true);
    }
}

// ☁️ [THE CLOUD TRACKER]: फायरस्टोअरमध्ये टाईम पॅरामीटर ढकलणारे स्वतंत्र मदतनीस फंक्शन
function syncTimerToFirestore(seconds, isPaused) {
    const matchRef = window.currentMatchData || window.currentEditingMatch || window.matchSetupData;

    if (matchRef && matchRef.tId && matchRef.mId) {
        console.log(`%c☁️ [Firestore Sync] ➔ सेकंद: ${seconds} | Paused: ${isPaused} डेटाबेसवर जतन होत आहे...`, "color: #a855f7; font-weight: bold;");
        
        db.collection("tournaments").doc(matchRef.tId)
          .collection("matches").doc(matchRef.mId).update({
              savedMatchTime: seconds,
              isMatchPaused: isPaused,
              isFirstTimeStart: window.isFirstTimeStart, 
              lastUpdated: new Date().getTime()
          })
          .then(() => {
              console.log("%c✅ [Sync Success]: क्लाउडवर टायमर स्नॅपशॉट यशस्वीरित्या लॉक झाला!", "color: #22c55e;");
          })
          .catch(err => {
              console.error("🚨 [Sync Fatal Error]: फायरस्टोअर अपडेट फेल झाले:", err);
          });
    } else {
        console.warn("⚠️ [Sync Skipped]: मॅचचा tId किंवा mId मेमरीमध्ये न मिळाल्यामुळे क्लाउड सिंक स्किप केला.");
    }
}

// ⏱️ १. नवीन स्वतंत्र टायमर स्टार्टर फंक्शन (Case 1, 2, 3 सार्थकी लावण्यासाठी)

function triggerMatchTimerStart() {
    const mainBtn = document.getElementById('mainMatchBtn');
    const scoringArea = document.getElementById('scoringButtonsContainer');

    window.isMatchPaused = false;
    
    // स्कोअरिंग पॅनल पूर्ण अनलॉक करा
    if (scoringArea) {
        scoringArea.style.pointerEvents = "auto";
        scoringArea.style.opacity = "1";
    }

    // बटण थेट लाल करा (PAUSE MATCH साठी)
    if (mainBtn) {
        mainBtn.innerText = "PAUSE MATCH";
        mainBtn.className = "w-full bg-red-600 py-4 rounded-2xl text-[10px] font-black uppercase border border-red-700 shadow-xl text-white";
    }

    // जुना कोणताही लूप सुरू असेल तर आधी नष्ट करा आणि फ्रेश सुरू करा
    clearInterval(matchInterval);
    matchInterval = setInterval(() => {
        if (matchTotalSeconds > 0) {
            matchTotalSeconds--;
            if (typeof updateMatchUI === "function") updateMatchUI();
            localStorage.setItem('savedMatchTime', matchTotalSeconds);
        } else {
            clearInterval(matchInterval);
            if (typeof handleMatchTimeEnd === 'function') handleMatchTimeEnd();
        }
    }, 1000);

    // ☁️ डेटाबेसमध्ये तात्काळ सिंक करा की मॅच आता चालू (LIVE) झाली आहे
    if (matchSetupData && matchSetupData.tId && matchSetupData.mId) {
        db.collection("tournaments").doc(matchSetupData.tId)
          .collection("matches").doc(matchSetupData.mId).update({
              isMatchPaused: false,
              savedMatchTime: matchTotalSeconds,
              status: "Live"
          }).catch(err => console.error("🚨 [Timer Sync Error]:", err));
    }
}

// २. बॅक बटण लॉक करण्यासाठी सिम्पल फंक्शन 🔒
//जे वरच्या toggleMatchTimer फंक्शनमध्ये कॉल होतंय.

function lockUserOnScoringPage(shouldLock) {
    if (shouldLock) {
        // १. ब्राउझर बॅक बटण लॉक
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function () {
            window.history.go(1);
            Swal.fire({
                title: "मॅच सुरू आहे!",
                text: "मॅच सोडून मागे जाता येणार नाही.",
                icon: "warning",
                toast: true, position: 'top', showConfirmButton: false, timer: 2000
            });
        };
        // २. तुझ्या ॲपमधील नेव्हिगेशन बार लपवा (जर असेल तर)
        const navBar = document.getElementById('bottom-nav'); // तुझ्या नेव्ह बारचा ID
        if (navBar) navBar.classList.add('hidden');
    }
}

// ३. UI अपडेट करणे (फक्त 'matchTimer' आयडी वापरून)
function updateMatchUI() {
    const display = document.getElementById('matchTimer');
    
    // 🔍 [CRITICAL DEBUG LOG]: स्क्रीन रेंडर होताना नक्की काय व्हॅल्यूज आहेत ते तपासा
    // console.log(
    //     `%c🔍 [UI Render Check] ➔ isMatchPaused: ${window.isMatchPaused} | isFirstTimeStart: ${window.isFirstTimeStart} | Seconds: ${matchTotalSeconds}`, 
    //     "color: #06b6d4; font-weight: bold; background: #083344; padding: 2px 6px; rounded: 4px;"
    // )
    ;

    if (display) {
        display.innerText = formatMatchTime(matchTotalSeconds);
        if (matchTotalSeconds <= 60) {
            display.classList.add('text-red-500');
        } else {
            display.classList.remove('text-red-500');
        }
    }

    const btn = document.getElementById('mainMatchBtn');
    const scoringArea = document.getElementById('scoringButtonsContainer');

    // 🚨 जर हा व्हेरिएबल चुकीने false असेल, तरच बटन "PAUSE MATCH" दाखवेल
    if (window.isMatchPaused) {
        if (btn) {
            btn.innerText = window.isFirstTimeStart ? "Start Match" : "RESUME MATCH";
            if (window.isFirstTimeStart) {
                btn.className = "w-full bg-gray-800 py-4 rounded-2xl text-[10px] font-black uppercase border border-gray-700 shadow-xl active:scale-95 text-orange-500 animate-pulse";
            } else {
                btn.className = "w-full bg-green-600 py-4 rounded-2xl text-[10px] font-black uppercase border border-green-500 shadow-xl active:scale-95 text-white animate-pulse";
            }
        }
        if (window.isFirstTimeStart && scoringArea) {
            scoringArea.style.pointerEvents = "none";
            scoringArea.style.opacity = "0.4";
        }
    } else {
        // 🛑 जर कन्सोलमध्ये "PAUSE MATCH" दिसत असेल, तर सिस्टीम या एल्स (Else) ब्लॉकच्या आत आली आहे!
        if (btn) {
            btn.innerText = "PAUSE MATCH";
            btn.className = "w-full bg-red-600 py-4 rounded-2xl text-[10px] font-black uppercase border border-red-700 shadow-xl active:scale-95 text-white";
        }
        if (scoringArea) {
            scoringArea.style.pointerEvents = "auto";
            scoringArea.style.opacity = "1";
        }
    }
}





/* ==========================================
   🔄 REFRESH / RELOAD MANAGEMENT (SAFE INTEGRATION)
   ========================================== */

// १. पेज लोड होताच जुना डेटा चेक करा - [तुझा मूळ कोड सुरक्षित]
window.addEventListener('DOMContentLoaded', () => {
    const savedTime = localStorage.getItem('savedMatchTime');
    const savedStatus = localStorage.getItem('isMatchPaused');

    if (savedTime !== null) {
        matchTotalSeconds = parseInt(savedTime);
        updateMatchUI();
    }

    // [STRICT RULE]: पुन्हा आल्यावर मॅच नेहमी 'PAUSE'モードमध्येच असावी
    isMatchPaused = true; 
    const btn = document.getElementById('mainMatchBtn');
    if (btn) {
        btn.innerText = "RESUME MATCH";
        btn.classList.replace('bg-red-900/40', 'bg-green-900/40');
    }
    if (typeof matchInterval !== 'undefined') clearInterval(matchInterval); 

    // 🎯 [LIVE OVERLAY RECOVERY]: पेज रिफ्रेश करून परत आल्यावर जुन्या इतिहासावरून लाइव्ह आकडे लगेच दाखवा!
    setTimeout(() => {
        if (typeof calculateTopStats === "function") {
            calculateTopStats();
        }
    }, 500); // ४००-५००ms चा छोटा डिले द्या जेणेकरून लोकल स्टोरेजचा डेटा आधी मेमरीमध्ये लोड होईल


});

// २. वेळ सेव्ह करण्यासाठी फंक्शन (टायमर रन होत असताना हे कॉल होईल) - [तुझा मूळ कोड सुरक्षित]
function saveMatchProgress() {
    localStorage.setItem('savedMatchTime', matchTotalSeconds);
    localStorage.setItem('isMatchPaused', isMatchPaused);
}

// ३. मॅच आपोआप पॉज करणे (जेव्हा युजर पेज सोडून जातो) - [तुझा मूळ कोड सुरक्षित]
window.addEventListener('blur', () => {
    if (!isMatchPaused && typeof toggleMatchTimer === "function") {
        toggleMatchTimer(); // हे फंक्शन मॅच पॉज करेल
    }
});

// ४. पेज रिफ्रेश करताना वॉर्निंग आणि 🚨 [CRITICAL DATABASE FORCE SYNC]
window.onbeforeunload = function(event) {
    // १. जाताना लोकल मेमरी सेव्ह करा
    saveMatchProgress();

    // २. जर मॅच सुरू असेल, तर पॉज करा
    if (!isMatchPaused) {
        isMatchPaused = true;
        if (typeof matchInterval !== 'undefined') clearInterval(matchInterval);
    }

    // 🚨 [PRO BACKEND SYNC]: पेज सुटताना डेटाबेसच्या 'raidsHistory' मध्ये बॅकअप सक्तीने ढकला!
    if (typeof matchSetupData !== 'undefined' && matchSetupData && matchSetupData.mId) {
        const matchId = matchSetupData.mId;
        const tournamentId = matchSetupData.tId || "default_tournament";
        
        // लोकल स्टोरेजमधून तुझा तो सुरक्षित एन्क्रिप्टेड Base64 लॉग ओढा 🔐
        const localData = localStorage.getItem(`raids_secure_log_${matchId}`);
        
        if (localData) {
            try {
                const decodedString = decodeURIComponent(escape(atob(localData)));
                const finalRaidsList = JSON.parse(decodedString);
                
                if (finalRaidsList && finalRaidsList.length > 0 && typeof db !== 'undefined') {
                    console.log(`💾 [Safety Sync]: रीलोडपूर्वी ${finalRaidsList.length} रेड्स डेटाबेसवर ढकलत आहे...`);
                    
                    // थेट कडक फायरस्टोअर अपडेट मेमरीवर न ठेवता बॅकग्राउंडला पाठवणे
                    db.collection("tournaments").doc(tournamentId)
                      .collection("matches").doc(matchId).update({
                          raidsHistory: finalRaidsList,
                          lastSyncedAt: new Date().getTime(),
                          teamAScore: typeof teamAScore !== 'undefined' ? teamAScore : 0,
                          teamBScore: typeof teamBScore !== 'undefined' ? teamBScore : 0
                      }).then(() => {
                          console.log("✅ [Safety Sync Success]: रीलोड डेटा पूर्णपणे साठवला!");
                      }).catch(err => {
                          console.error("❌ [Safety Sync Error]:", err);
                      });
                }
            } catch (e) {
                console.error("🚨 [Safety Sync Crash]:", e);
            }
        }
    }

    // ३. युजरला वॉर्निंग द्या - [तुझा मूळ कोड सुरक्षित]
    if (matchTotalSeconds > 0 && matchTotalSeconds < 1200) {
        const warningMsg = "Match is in progress. Your data is saved and match is paused.";
        if (event) event.returnValue = warningMsg; // मॉडर्न ब्राउझर सेफ्टी
        return warningMsg;
    }
};


/* ==========================================
    Login MANAGEMENT (SAFE INTEGRATION)
   ========================================== */

/**Login */

// १. लॉगिन फंक्शन (खात्री करा की हे app.js मध्ये आहे)
async function login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await firebase.auth().signInWithPopup(provider);
        // यशस्वी झाल्यावर onAuthStateChanged आपोआप पुढचे काम करेल
    } catch (error) {
        console.error("Login Error:", error);
        alert("लॉगिन अयशस्वी!");
    }
}

// २. ऑथेंटिकेशन गार्ड
firebase.auth().onAuthStateChanged((user) => {
    const overlay = document.getElementById('loginOverlay');
    if (user) {
        // जर युजर लॉगिन असेल तरच स्क्रीन लपवा
        if (overlay) overlay.classList.add('hidden');
        console.log("User Logged In:", user.displayName);
        
        // Welcome मेसेजमध्ये युजरचं नाव दाखवण्यासाठी:
        const welcomeText = document.querySelector('#app h2');
        if (welcomeText) welcomeText.innerText = `Welcome ${user.displayName} 👋`;
    } else {
        // लॉगिन नसेल तर स्क्रीन दाखवा
        if (overlay) overlay.classList.remove('hidden');
    }
});

// ३. प्रोफाइलची माहिती भरण्यासाठी फंक्शन
function updateProfileUI(user) {
    // जेव्हा युजर profile पेजवर असेल, तेव्हाच हे रन होईल
    const profileName = document.getElementById('userDisplayName');
    const profilePic = document.getElementById('userProfilePic');
    
    if (profileName) profileName.innerText = user.displayName;
    if (profilePic) profilePic.src = user.photoURL;
}


// app.js मध्ये initPage च्या सुरुवातीला हे टाका
async function handleNavigationUI(role) {
    const bottomNav = document.querySelector('.fixed.bottom-0');
    const sidebarBtn = document.querySelector('button[onclick="toggleMenu()"]');

    // सर्व बटणांची लिस्ट (Sidebar आणि Bottom Nav दोन्हीसाठी)
    const restrictedElements = [
        'nav-matches', 'nav-teams', 'nav-tournaments', // Bottom Nav IDs
        'side-matches', 'side-teams', 'side-tournaments' // Sidebar IDs
    ];

    if (role === 'viewer') {
        // व्ह्यूअरला नेव्हिगेशन दिसेल (Home/Profile साठी)
        if (bottomNav) bottomNav.style.display = 'flex';
        if (sidebarBtn) sidebarBtn.style.display = 'block';

        // फक्त Restricted बटणे लपवा
        restrictedElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        
        console.log("Viewer Mode: Hidden all management tabs.");
    } else {
        // Admin/Scorer ला सर्व काही दाखवा
        if (bottomNav) bottomNav.style.display = 'flex';
        if (sidebarBtn) sidebarBtn.style.display = 'block';

        restrictedElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'block'; // किंवा Sidebar साठी 'block' आणि Bottom साठी 'inline-block'
        });
    }
}

// Timeout and Sub

//१. triggerCommonTimeout (फक्त टायमर सुरू करण्यासाठी)
//हे फंक्शन फक्त ३० सेकंदांचा टायमर पडद्यावर (Overlay) सुरू करेल.

let timeoutInterval;
let timeoutTypeAssigned = false; // क्रेडिट दिले आहे की नाही हे तपासण्यासाठी

function triggerCommonTimeout() {
    console.log("--- [TIMEOUT_PROCESS] Start ---");

    // १. जर मॅच टायमर सुरू असेल (isMatchPaused false असेल), तर तो पॉज करा
    if (!isMatchPaused) {
        console.log("[SYNC] Match is running. Pausing timer for Timeout...");
        toggleMatchTimer(); // हे फंक्शन कॉल केल्यावर isMatchPaused 'true' होईल आणि clearInterval होईल
    }

    document.getElementById('timeoutOverlay').classList.remove('hidden');
    timeoutTypeAssigned = false;
    
    let timeLeft = 30;
    const clockEl = document.getElementById('timeoutClock');
    
    clearInterval(timeoutInterval);
    timeoutInterval = setInterval(() => {
        timeLeft--;
        console.log("[TIMEOUT_TICK] Seconds left:", timeLeft); // Console Log जो तू मागितला होतास
        
        if (clockEl) clockEl.innerText = timeLeft;

        if (timeLeft <= 0) {
            console.log("[TIMEOUT_END] 30 seconds finished.");
            stopTimeout();
        }
    }, 1000);
}

function stopTimeout() {
    console.log("--- [TIMEOUT_PROCESS] Stop ---");

    // १. बटणे पुन्हा सुरू करा (जर ती Official मुळे Disable झाली असतील तर)
    const buttons = document.querySelectorAll('#timeoutOverlay button');
    buttons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.pointerEvents = "auto";
    });

    // २. टायमर थांबवा आणि मॉडेल लपवा
    clearInterval(timeoutInterval);
    document.getElementById('timeoutOverlay').classList.add('hidden');

    // ३. जर मॅच पॉज असेल, तर ती पुन्हा सुरू करा
    if (isMatchPaused) {
        console.log("[SYNC] Resuming Match Timer after Timeout.");
        toggleMatchTimer(); 
    }
}

//२. assignTimeoutCredit (कोणी टाईमआऊट घेतला हे ठरवण्यासाठी)
//जेव्हा स्कोअरर 'Team A' किंवा 'Team B' बटण ओव्हरलेवर दाबतो, तेव्हा हे फंक्शन फायरबेसमध्ये काउंट कमी करेल.

async function assignTimeoutCredit(team) {
    const teamKey = team === 'A' ? 'timeoutsA' : 'timeoutsB';
    const opponent = team === 'A' ? 'B' : 'A'; // विरुद्ध टीम ओळखा
    let valueBefore = Number(currentMatchData[teamKey] || 0);

    if (valueBefore >= 2) {
        Swal.fire("मर्यादा संपली!", "या टीमचे २ टाईमआऊट झाले आहेत.", "error");
        return;
    }

    // १. निव्वळ नेमकी बटणे लॉक करा (Quick Sub ला हात लावू नका)
    const allButtons = document.querySelectorAll('#timeoutOverlay button');
    allButtons.forEach(btn => {
        const txt = btn.innerText.trim().toUpperCase();
        
        // अ) विरुद्ध टीमचं बटण लॉक करा (उदा. Team B)
        // ब) Official बटण लॉक करा
        // क) स्वतःचं बटण सुद्धा लॉक करा (Double click टाळण्यासाठी)
        if (txt === `TEAM ${opponent}` || txt === "OFFICIAL" || txt === `TEAM ${team}`) {
            btn.disabled = true;
            btn.style.opacity = "0.3";
            btn.style.pointerEvents = "none";
        }
        // टीप: इथे 'QUICK SUB' आणि 'RESUME' ला आपण स्पर्शही केलेला नाही, त्यामुळे ती चालू राहतील.
    });

    const newValue = valueBefore + 1;

    try {
        const { tId, mId } = matchSetupData;
        
        await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
            [teamKey]: newValue
        });

        if (currentMatchData) {
            currentMatchData[teamKey] = newValue;
        }
        
        updateTimeoutUI();
        timeoutTypeAssigned = true;
        addEventToSummary('TIMEOUT', team, `Timeout ${newValue} taken.`);
        
        console.log(`[SUCCESS] Timeout recorded for Team ${team}. Quick Sub is still available.`);

    } catch (e) {
        console.error("Update Failed:", e);
        // एरर आली तर सर्व बटणे पुन्हा सुरू करा
        allButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.pointerEvents = "auto";
        });
    }
}


let selectedOutPlayers = [];
let selectedInPlayers = [];

function openSubModal(team) {
    console.log(`--- [MULTI-SUB] Opening for Team ${team} ---`);
    currentSubTeam = team;
    selectedOutPlayers = [];
    selectedInPlayers = [];
    
    const players = (team === 'A') ? currentMatchData.teamAPlayers : currentMatchData.teamBPlayers;
    const outGrid = document.getElementById('outPlayersGrid');
    const inGrid = document.getElementById('inPlayersGrid');

    outGrid.innerHTML = "";
    inGrid.innerHTML = "";

    players.forEach(p => {
        const btn = document.createElement('button');
        btn.className = "p-2 rounded-lg border border-gray-800 text-[10px] font-bold text-gray-400 flex flex-col items-center transition-all";
        btn.innerHTML = `<span class="text-xs">#${p.no}</span><span class="truncate w-full text-[8px]">${p.name}</span>`;
        
        // जो 'Playing' आणि 'In' आहे तो OUT च्या ग्रेडमध्ये जाईल
        if (p.playingStatus === "Playing" && p.status === "In") {
            btn.onclick = () => toggleSelectSub(btn, p.no, 'OUT');
            outGrid.appendChild(btn);
        } 
        // जो 'Bench' वर आहे तो IN च्या ग्रेडमध्ये जाईल
        else if (p.playingStatus === "Bench") {
            btn.onclick = () => toggleSelectSub(btn, p.no, 'IN');
            inGrid.appendChild(btn);
        }
    });

    updateSubLabels();
    document.getElementById('subModal').classList.remove('hidden');
}

function toggleSelectSub(btn, playerNo, type) {
    if (type === 'OUT') {
        if (selectedOutPlayers.includes(playerNo)) {
            selectedOutPlayers = selectedOutPlayers.filter(id => id !== playerNo);
            btn.classList.remove('bg-red-900/40', 'border-red-500', 'text-white');
        } else {
            selectedOutPlayers.push(playerNo);
            btn.classList.add('bg-red-900/40', 'border-red-500', 'text-white');
        }
    } else {
        if (selectedInPlayers.includes(playerNo)) {
            selectedInPlayers = selectedInPlayers.filter(id => id !== playerNo);
            btn.classList.remove('bg-green-900/40', 'border-green-500', 'text-white');
        } else {
            selectedInPlayers.push(playerNo);
            btn.classList.add('bg-green-900/40', 'border-green-500', 'text-white');
        }
    }
    updateSubLabels();
}

function updateSubLabels() {
    document.getElementById('outCountLabel').innerText = selectedOutPlayers.length;
    document.getElementById('inCountLabel').innerText = selectedInPlayers.length;

    const btn = document.getElementById('confirmSubBtn');
    // नियम: जेवढे प्लेयर बाहेर काढले तेवढेच आत घेतले पाहिजेत (उदा. २ आउट तर २ इन)
    if (selectedOutPlayers.length > 0 && selectedOutPlayers.length === selectedInPlayers.length) {
        btn.classList.remove('opacity-50', 'pointer-events-none');
        console.log(`[VALID] Substitution of ${selectedOutPlayers.length} players ready.`);
    } else {
        btn.classList.add('opacity-50', 'pointer-events-none');
    }
}


async function processMultiSubstitution() {
    console.log("--- [SUB_PROCESS_START] ---");
    
    if (!currentMatchData || !currentSubTeam) {
        console.error("[ERROR] Missing currentMatchData or currentSubTeam");
        return;
    }

    const teamKey = (currentSubTeam === 'A') ? 'teamAPlayers' : 'teamBPlayers';
    let players = [...currentMatchData[teamKey]];

    console.log(`[ACTION] Swapping ${selectedOutPlayers.length} players for Team ${currentSubTeam}`);
    console.log("OUT Players:", selectedOutPlayers);
    console.log("IN Players:", selectedInPlayers);

    // खेळाडूंचा स्टेटस बदलणे
    players.forEach(p => {
        if (selectedOutPlayers.includes(p.no)) {
            console.log(`[LOG] Player #${p.no} (${p.name}) -> Bench/Out`);
            p.playingStatus = "Bench";
            p.status = "Out";
        }
        if (selectedInPlayers.includes(p.no)) {
            console.log(`[LOG] Player #${p.no} (${p.name}) -> Playing/In`);
            p.playingStatus = "Playing";
            p.status = "In";
        }
    });

    try {
        const { tId, mId } = matchSetupData;
        const subMessage = `Multi-Sub (${currentSubTeam}): ${selectedOutPlayers.length} players swapped`;

        console.log(`[DATABASE] Updating Firestore for Match: ${mId}`);
        
        await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
            [teamKey]: players,
            matchLog: firebase.firestore.FieldValue.arrayUnion({
                msg: subMessage,
                time: new Date().toLocaleTimeString()
            })
        });
        
        // --- Timeline (Recent Raids) मध्ये कार्ड ॲड करणे ---
        if (typeof addEventToSummary === "function") {
            const detailMsg = `Out: #${selectedOutPlayers.join(', #')} | In: #${selectedInPlayers.join(', #')}`;
            addEventToSummary('SUB', currentSubTeam, detailMsg);
        }

        console.log("[SUCCESS] Database updated and Timeline entry added.");
        
        Swal.fire({
            title: "बदल यशस्वी!",
            text: `${selectedOutPlayers.length} खेळाडूंची अदलाबदल झाली आहे.`,
            icon: "success",
            timer: 2000
        });

        closeSubModal();

    } catch (e) {
        console.error("[CRITICAL_ERROR] processMultiSubstitution failed:", e);
        Swal.fire("Error", "Substitution नोंदवताना अडचण आली.", "error");
    }
}

function closeSubModal() {
    document.getElementById('subModal').classList.add('hidden');
}

// २. फायनल सब्स्टिट्युशन कन्फर्म करणे
// १. Substitution (खेळाडू बदल)
async function confirmSubstitution() {
    console.log("--- [SUBSTITUTION_PROCESS] Confirmation Started ---");
    
    if (!currentMatchData) {
        console.error("[ERROR] currentMatchData not found. Substitution aborted.");
        return;
    }

    const outNo = document.getElementById('playerToOut').value;
    const inNo = document.getElementById('playerToIn').value;

    console.log(`[ACTION] Attempting Sub: Player #${outNo} (OUT) <-> Player #${inNo} (IN)`);

    const teamKey = (currentSubTeam === 'A') ? 'teamAPlayers' : 'teamBPlayers';
    let players = [...currentMatchData[teamKey]];

    players.forEach(p => {
        if (p.no == outNo) {
            console.log(`[UPDATE] Player #${p.no} (${p.name}): Status changed to Bench/Out`);
            p.playingStatus = "Bench";
            p.status = "Out";
        }
        if (p.no == inNo) {
            console.log(`[UPDATE] Player #${p.no} (${p.name}): Status changed to Playing/In`);
            p.playingStatus = "Playing";
            p.status = "In";
        }
    });

    try {
        const { tId, mId } = matchSetupData;
        console.log(`[DATABASE] Pushing new player list to Firestore for Team ${currentSubTeam}...`);
        
        await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
            [teamKey]: players
        });

        console.log("[SUCCESS] Substitution finalized in Database.");
        console.table(players.filter(p => p.no == outNo || p.no == inNo)); // फक्त बदललेले प्लेयर दिसेल

        Swal.fire("बदल यशस्वी!", "खेळाडूंची अदलाबदल झाली आहे.", "success");
        closeSubModal();
    } catch (e) {
        console.error("[CRITICAL_ERROR] Substitution failed to save:", e);
    }
}

// २. Timeout Dots अपडेट (UI)
// १. Timeout स्क्रीनवरून Sub उघडण्यासाठी
function openSubFromTimeout() {
    // टायमर चालू असतानाच मल्टि-सब मॉडेल उघडा
    // इथे आपण 'A' किंवा 'B' न देता फक्त मॉडेल उघडतोय, युजरला टीम नंतर निवडता येईल
    // किंवा आपण currentSubTeam सेट करून एका टीमचे सब उघडू शकतो
    console.log("[TIMEOUT_SUB] Opening Multi-Sub Modal...");
    // टीम विचारण्यासाठी आपण एक छोटा प्रॉम्प्ट देऊ शकतो किंवा थेट Team A चे उघडू शकतो
    Swal.fire({
        title: 'कोणाची Substitution करायची आहे?',
        showCancelButton: true,
        confirmButtonText: 'Team A',
        cancelButtonText: 'Team B',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#2563eb'
    }).then((result) => {
        if (result.isConfirmed) {
            openSubModal('A');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            openSubModal('B');
        }
    });
}

// २. Sub Modal बंद झाल्यावर पुन्हा Timeout Overlay पुढे आणण्यासाठी बदल
function closeSubModal() {
    console.log("[SUB_MODAL] Closing...");
    document.getElementById('subModal').classList.add('hidden');
    
    // जर टायमर सुरू असेल, तर Timeout Overlay पुन्हा फ्रंटला आणा
    if (!document.getElementById('timeoutOverlay').classList.contains('hidden')) {
        document.getElementById('timeoutOverlay').style.zIndex = "1000";
    }
}

// ३. UI वर टाईमआऊट किती बाकी आहेत ते दाखवण्यासाठी (Counter)
function updateTimeoutUI() {
    // १. फंक्शन कॉल झालं की नाही हे बघण्यासाठी
    console.log("%c--- [STEP 6: UI_RENDER] updateTimeoutUI() Started ---", "background: #444; color: #fff; padding: 2px 5px;");

    if (!currentMatchData) {
        console.error("%c[UI_ERROR] currentMatchData is EMPTY/NULL!", "color: red; font-weight: bold;");
        return;
    }

    // २. डेटाबेसकडून नक्की काय आकडा आलाय तो पकडणे
    // इथे आपण 'OR 0' वापरतोय, म्हणजे व्हॅल्यू नसेल तर ती 0 दिसेल.
    let tA = Number(currentMatchData.timeoutsA || 0);
    let tB = Number(currentMatchData.timeoutsB || 0);
    
    // सर्वात महत्त्वाचा लॉग: बॅकएंडचा खरा आकडा इथे दिसेल
    console.log(`%c[DATA_SYNC] Backend says -> Team A: ${tA} | Team B: ${tB}`, "color: yellow; font-size: 12px; font-weight: bold;");

    const labelA = document.getElementById('timeoutDisplayA');
    const labelB = document.getElementById('timeoutDisplayB');

    // ३. Team A साठी निर्णय प्रक्रिया
    if (labelA) {
        console.log(`[CHECK_A] Testing Logic for Team A (Value: ${tA})`);
        if (tA === 0) {
            labelA.innerText = "TO - 0";
            labelA.className = "text-[10px] font-black text-orange-500 uppercase";
            console.log("-> Result: Set to TO-0");
        } else if (tA === 1) {
            labelA.innerText = "TO - 1";
            labelA.className = "text-[10px] font-black text-orange-500 uppercase";
            console.log("-> Result: Set to TO-1");
        } else {
            // जर व्हॅल्यू 2, 3 किंवा 4 (तुझ्या केसमध्ये) असेल तर 'OVER' दिसेल
            labelA.innerText = "TO - 2 (OVER)";
            labelA.className = "text-[10px] font-black text-red-600 uppercase";
            console.warn(`-> Result: Set to OVER (Because value ${tA} is >= 2)`);
        }
    } else {
        console.error("[UI_ERROR] HTML Element 'timeoutDisplayA' NOT FOUND!");
    }

    // ४. Team B साठी निर्णय प्रक्रिया
    if (labelB) {
        console.log(`[CHECK_B] Testing Logic for Team B (Value: ${tB})`);
        if (tB === 0) {
            labelB.innerText = "TO - 0";
            labelB.className = "text-[10px] font-black text-orange-500 uppercase";
        } else if (tB === 1) {
            labelB.innerText = "TO - 1";
            labelB.className = "text-[10px] font-black text-orange-500 uppercase";
        } else {
            labelB.innerText = "TO - 2 (OVER)";
            labelB.className = "text-[10px] font-black text-red-600 uppercase";
        }
    }
    
    console.log("%c--- [UI_RENDER] Finished ---", "color: gray; font-style: italic;");
}

//१. setOfficialType दुरुस्त करा (विंडो बंद होणार नाही)
//stopTimeout() ऐवजी फक्त टायमर थांबवा आणि मेसेज अपडेट करा:

async function setOfficialType(type) {
    console.log(`[OFFICIAL_TIMEOUT] Mode: ${type}`);
    
    const statusLabel = document.getElementById('timeoutStatus');
    const clockLabel = document.getElementById('timeoutClock');

    // १. UI अपडेट
    if (statusLabel) statusLabel.innerText = "OFFICIAL TIMEOUT";
    if (clockLabel) clockLabel.innerText = "--";
    
    // २. टायमर थांबवा
    if (typeof timeoutInterval !== 'undefined') clearInterval(timeoutInterval);
    
    // ३. [IMPORTANT] बटणे Disable करणे
    // Team A, Team B आणि Quick Sub या बटणांना शोधून बंद करा
    const buttons = document.querySelectorAll('#timeoutOverlay button');
    buttons.forEach(btn => {
        // जर बटणावर 'Resume' लिहिलेले नसेल, तरच त्याला बंद करा
        if (btn.innerText.trim().toUpperCase() !== "RESUME") {
            btn.disabled = true;
            btn.style.opacity = "0.3"; // युजरला कळावं की हे बटण आता चालणार नाही
            btn.style.pointerEvents = "none";
        }
    });

    // ४. Firebase Log (आधी ठरवल्याप्रमाणे)
    try {
        const { tId, mId } = matchSetupData;
        await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
            matchLog: firebase.firestore.FieldValue.arrayUnion({
                type: "TIMEOUT",
                team: "OFFICIAL",
                detail: "Official/Medical Timeout by Umpire",
                timestamp: new Date().toISOString()
            })
        });
    } catch (e) {
        console.error("Log error:", e);
    }
}


// हा फक्त डेटा बॅकग्राउंडला अपडेट ठेवेल, स्क्रीन रेंडर करणार नाही
// त्यामुळे तुझे 'Raider List' किंवा 'Out Player' लॉजिक बिघडणार नाही
function syncDataOnly(tId, mId) {
    db.collection("tournaments").doc(tId).collection("matches").doc(mId)
    .onSnapshot((doc) => {
        if (doc.exists) {
            const freshData = doc.data();
            
            // हा लॉग सर्वात महत्त्वाचा आहे
            console.log("%c[5. SNAPSHOT_RECEIVE] Data came from Firebase!", "background: green; color: white; padding: 2px 5px;");
            console.log("-> TimeoutsA:", freshData.timeoutsA);
            console.log("-> TimeoutsB:", freshData.timeoutsB);
            
            currentMatchData = freshData; 
            updateTimeoutUI();
        }
    });
}


// १. ग्लोबल स्टेज सेट करा (फंक्शनच्या बाहेर) // 🌍 ग्लोबल लेव्हलला हा व्हेरिएबल असाच राहू दे

let matchStage = "1ST_HALF"; 


async function handleMainAction() {
    const actionBtn = document.getElementById('mainActionBtn'); // उजवे स्टेज बटण
    const mainBtn = document.getElementById('mainMatchBtn');       // डावे टायमर बटण

    // 🚨 [FATAL CHECK]: मॅचचा आयडी आणि टूर्नामेंट आयडी मेमरीमध्ये उपलब्ध आहेत का ते तपासा
    if (!matchSetupData || !matchSetupData.tId || !matchSetupData.mId) {
        console.error("🚨 [Fatal Error]: matchSetupData मध्ये tId किंवा mId सापडला नाही!");
        return;
    }
    const { tId, mId } = matchSetupData;

    console.log(`%c==================================================`, "color: #a855f7; font-weight: bold;");
    console.log(`%c🎬 [ACTION CLICK]: #mainActionBtn दाबला! ➔ चालू स्टेज (Memory): "${matchStage}"`, "color: #a855f7; font-weight: bold;");
    console.log(`%c==================================================`, "color: #a855f7; font-weight: bold;");

    // =========================================================================
    // 🎯 [टप्पा १]: पहला हाफ संपवणे (1ST_HALF ➔ INTERVAL)
    // =========================================================================
    if (matchStage === "1ST_HALF") {
        const result = await Swal.fire({
            title: '1st Half संपवायचा का?',
            text: "यानंतर टायमर 00:00 वर लॉक होईल आणि ब्रेक सुरू होईल.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'हो, संपवा',
            cancelButtonText: 'नाही',
            background: '#111',
            color: '#fff',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#4b5563'
        });

        if (result.isConfirmed) {
            console.log("%c🛑 [Stage Transition]: 1st Half संपवण्याची प्रक्रिया सुरू...", "color: #ef4444; font-weight: bold;");

            // १. टायमरचा चालू लूप बॅकग्राउंडला पूर्णपणे नष्ट करा
            clearInterval(matchInterval);
            window.isMatchPaused = true;
            window.isFirstTimeStart = true; 
            matchStage = "INTERVAL"; // मेमरी स्टेट बदलला

            // २. उजव्या ॲक्शन बटणाचा लुक बदला ("Start 2nd Half" करा)
            if (actionBtn) {
                actionBtn.innerText = "Start 2nd Half";
                actionBtn.className = "w-full bg-green-600 py-4 rounded-2xl text-[10px] font-black uppercase border border-green-500 shadow-xl active:scale-95 text-white";
            }

            // 🚨 ३. [THE ULTIMATE HIDE FIX]: डावे "Start Match" बटण पूर्णपणे गायब (Hide) करा!
            if (mainBtn) {
                mainBtn.classList.add('hidden'); // स्क्रीनवर दोन बटणे दिसण्याचा घोळ कायमचा बंद!
                console.log("🔒 [UI Lock]: डावे mainMatchBtn यशस्वीरित्या hidden केले.");
            }

            // ४. टायमरची वेळ सक्तीने शून्य (00:00) करा
            matchTotalSeconds = 0; 
            localStorage.setItem('savedMatchTime', 0);

            // ५. चुकीचे स्कोअरिंग टाळण्यासाठी स्कोअरिंग पॅनल तात्पुरते锁 करा
            const scoringArea = document.getElementById('scoringButtonsContainer');
            if (scoringArea) {
                scoringArea.style.pointerEvents = "none";
                scoringArea.style.opacity = "0.4";
            }

            // ६. टायमर स्क्रीनवर अपडेट करून घ्या (00:00 रेंडर होईल)
            if (typeof updateMatchUI === "function") updateMatchUI();

            // ☁️ ७. [DATABASE LOCK]: क्लाउडवर 1st_Half_End आणि वेळ 0 सुरक्षित लॉक करा
            await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
                status: "1st_Half_End",      
                savedMatchTime: 0,            
                isMatchPaused: true,
                isFirstTimeStart: true,
                lastUpdated: new Date().getTime()
            });
            
            console.log("%c✅ [Sync Success]: 1st Half अधिकृतपणे क्लाउडवर लॉक झाला!", "color: #22c55e; font-weight: bold;");
        }
    } 

    // =========================================================================
    // 🎯 [टप्पा २]: दुसरा हाफ सुरू करणे (INTERVAL ➔ 2ND_HALF)
    // =========================================================================
    else if (matchStage === "INTERVAL") {
        console.log("%c🔥 [Stage Transition]: २रा हाफ सुरू करण्याची प्रक्रिया सुरू...", "color: #22c55e; font-weight: bold;");

        // १. २ऱ्या हाफसाठी पूर्ण २० मिनिटे रिसेट करा (२० * ६० = १२०० सेकंद) ⏱️
        matchTotalSeconds = 20 * 60; 
        localStorage.setItem('savedMatchTime', matchTotalSeconds);
        
        window.isMatchPaused = false; // 🎯 खेळ आता थेट सुरू होत आहे, म्हणून फ्लॅग False!
        window.isFirstTimeStart = false; 
        matchStage = "2ND_HALF"; // मेमरी स्टेट बदलला

        // २. उजवे ॲक्शन बटन पुन्हा लाल करा ("End Match" च्या टप्प्यासाठी)
        if (actionBtn) {
            actionBtn.innerText = "End Match";
            actionBtn.className = "w-full bg-red-900/20 text-red-500 py-4 rounded-2xl text-[10px] font-black uppercase border border-red-900/30 active:scale-95";
        }

        // 🚨 ३. डावे टायमर बटण पुन्हा समोर आणा आणि थेट लाल रंगात "PAUSE MATCH" म्हणून अनलॉक करा!
        if (mainBtn) {
            mainBtn.classList.remove('hidden'); // 'hidden' क्लास काढून प्रकट केले 👁️
            mainBtn.innerText = "PAUSE MATCH";
            mainBtn.className = "w-full bg-red-600 py-4 rounded-2xl text-[10px] font-black uppercase border border-red-700 shadow-xl active:scale-95 text-white";
        }

        // ४. स्कोअरिंग पॅनल पूर्णपणे अनलॉक करा (स्कोअरर आता गुणे देऊ शकतो)
        const scoringArea = document.getElementById('scoringButtonsContainer');
        if (scoringArea) {
            scoringArea.style.pointerEvents = "auto";
            scoringArea.style.opacity = "1";
        }

        // 📺 ५. हेडरमधील टेक्स्ट बदलून "2nd Half" करा!
        const halfTextElement = document.getElementById('matchHalfText') || document.getElementById('periodDisplay');
        if (halfTextElement) halfTextElement.innerText = "2nd Half";

        // स्क्रीनवर २०:०० टाईम रेंडर करा
        if (typeof updateMatchUI === "function") updateMatchUI();

        // ⏱️ ६. [CRITICAL DIRECT START]: टायमरचा लूप इथेच थेट ऑटो-स्टार्ट करा!
        console.log("%c⏱️ [Timer Engine]: २ऱ्या हाफचा टायमर थेट ऑटो-स्टार्ट केला!", "color: #06b6d4; font-weight: bold;");
        clearInterval(matchInterval);
        matchInterval = setInterval(() => {
            if (matchTotalSeconds > 0) {
                matchTotalSeconds--;
                if (typeof updateMatchUI === "function") updateMatchUI();
                localStorage.setItem('savedMatchTime', matchTotalSeconds);
            } else {
                clearInterval(matchInterval);
                if (typeof handleMatchTimeEnd === 'function') handleMatchTimeEnd();
            }
        }, 1000);

        // ☁️ ७. [DATABASE SYNC]: २रा हाफ सुरू झाल्यावरही स्टेटस '1st_Half_End' च ठेवा! 🎯
        if (typeof syncTimerToFirestore === 'function') {
            syncTimerToFirestore(matchTotalSeconds, false);
        } else {
            await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
                timeoutsA: 0,
                timeoutsB: 0,
                status: "1st_Half_End",        // 🎯 स्टेटस तुझा मूळ '1st_Half_End' च लॉक ठेवला!
                savedMatchTime: matchTotalSeconds,
                isMatchPaused: false,
                isFirstTimeStart: false,
                lastUpdated: new Date().getTime()
            });
        }

        console.log("%c✅ [Sync Success]: २रा हाफ सुरू झाला आणि टायमर क्लाउडवर धावत आहे!", "color: #22c55e; font-weight: bold;");
    } 

    // =========================================================================
    // 🎯 [टप्पा ३]: पूर्ण मॅच संपवणे (2ND_HALF ➔ END)
    // =========================================================================
    else if (matchStage === "2ND_HALF") {
        console.log("%c🏁 [Stage Transition]: पूर्ण मॅच संपवण्याची प्रक्रिया सुरू...", "color: #f97316; font-weight: bold;");
        
        // मॅच पूर्ण संपवण्यापूर्वी टायमर थांबवणे सुरक्षित राहील
        if (!window.isMatchPaused) {
            window.isMatchPaused = true;
            clearInterval(matchInterval);
        }

        if (typeof confirmEndMatch === "function") {
            confirmEndMatch();
        } else {
            console.log("Match Ended!");
        }
    }
    console.log(`%c==================================================`, "color: #a855f7; font-weight: bold;");
}

/** End Match Confirmation */

/**
 * आपल्याला यातच कबड्डीच्या ५-५ रेड्स (5-5 Raids) चा हायब्रिड फ्लो बसवायचा आहे. 
 * जेव्हा स्कोअरर 'End Match' दाबेल आणि स्कोअर सारखा (sA === sB) असेल, 
 * तेव्हा आपण त्याला थेट मॅच संपवू देणार नाही. 
 * तिथे SweetAlert2 (Swal.fire) चा वापर करून एक कडक Decision Dialog दाखवू, 
 * ज्यामध्ये त्याला २ पर्याय मिळतील:
 * @returns 
 */
// async function confirmEndMatch() {
//     console.log("🔍 [END MATCH MASTER CHECK]: 'End Match' बटण क्लिक झाले. लोकल स्टोरेज आणि डीबी तपासत आहे...");

//     if (!matchSetupData || !matchSetupData.tId || !matchSetupData.mId) {
//         console.error("🚨 [CRITICAL]: matchSetupData चे आयडी सापडले नाहीत!");
//         return;
//     }

//     const { tId, mId } = matchSetupData;

//     // 🚨 [⚡ LOCAL STORAGE SECURITY]: १ मिलीसेकंदात लोकल स्टोरेजवरून 'Finished' स्टेटस ब्लॉक करणे!
//     const localStatus = localStorage.getItem(`match_status_${mId}`);
//     console.log(`💾 [LOCAL STORAGE STATUS]: ब्राउझर मेमरी स्टेटस ➔ "${localStatus}"`);

//     if (localStatus === 'Finished') {
//         console.log("🛑 [LOCAL BLOCK]: सामना आधीच 'Finished' झाला आहे! ५-५ विंडो ब्लॉक केली.");
//         Swal.fire({
//             title: 'सामना आधीच संपला आहे! 🏁',
//             text: 'या सामन्याचा अंतिम निकाल लागला असून तो जतन केला आहे.',
//             icon: 'info',
//             background: '#111', color: '#fff', confirmButtonColor: '#3b82f6'
//         });
//         return; 
//     }

//     // ☁️ [BACKUP FIREBASE FETCH]: लोकल स्टोरेज रिकामे असेल तरच डीबी कडून 'Finished' तपासणे
//     try {
//         const liveMatchDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
//         if (liveMatchDoc.exists) {
//             const liveData = liveMatchDoc.data();
//             const liveStatus = liveData.status || liveData.match_status || "";
            
//             if (liveStatus === 'Finished') {
//                 localStorage.setItem(`match_status_${mId}`, "Finished");
//                 console.log("🛑 [CLOUD BLOCK]: सामना डीबीनुसार आधीच 'Finished' आहे. ५-५ ब्लॉक केले.");
//                 Swal.fire({
//                     title: 'सामना आधीच संपला आहे! 🏁',
//                     text: 'या सामन्याचा अंतिम निकाल लागला असून तो जतन केला आहे.',
//                     icon: 'info',
//                     background: '#111', color: '#fff', confirmButtonColor: '#3b82f6'
//                 });
//                 return;
//             }
//         }
//     } catch (fetchErr) {
//         console.error("🚨 [DB FETCH ERROR]: ताजा स्टेटस तपासताना एरर:", fetchErr);
//     }

//     // १. युजरला कन्फर्मेशन विचारा
//     const result = await Swal.fire({
//         title: 'मॅच संपवायची का?',
//         text: "यानंतर स्कोअरमध्ये कोणताही बदल करता येणार नाही!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'हो, मॅच संपवा!',
//         cancelButtonText: 'चूक झाली',
//         background: '#111', color: '#fff',
//         confirmButtonColor: '#ef4444', cancelButtonColor: '#4b5563'
//     });

//     if (result.isConfirmed) {
//         const elA = document.getElementById('scoreA');
//         const elB = document.getElementById('scoreB');
//         const sA = elA ? Number(elA.innerText || 0) : Number(currentMatchData?.scoreA || 0);
//         const sB = elB ? Number(elB.innerText || 0) : Number(currentMatchData?.scoreB || 0);
        
//         // =============================================================
//         // 🎯 🚀 [THE KABADDI TIE HYBRID FILTER]: मुख्य स्कोर टाय निर्णय
//         // =============================================================
//         if (sA === sB && sA > 0) {
//             const tieDecision = await Swal.fire({
//                 title: 'सामना बरोबरीत सुटला! (Match Tied)',
//                 text: 'हा सामना बाद फेरीचा (Knockout) आहे की लीग सामना आहे? पुढील पर्याय निवडा:',
//                 icon: 'question',
//                 showCancelButton: true, showDenyButton: true,
//                 confirmButtonText: '🏃‍♂️ ५-५策 रेड्स सुरू करा',
//                 denyButtonText: '🤝 थेट टाय घोषित करा',
//                 cancelButtonText: 'स्कोअरिंगवर परत जा',
//                 confirmButtonColor: '#f97316', denyButtonColor: '#3b82f6', cancelButtonColor: '#4b5563',
//                 background: '#111', color: '#fff',
//                 customClass: { actions: 'flex flex-col sm:flex-row gap-2 w-full px-4' }
//             });

//             if (tieDecision.isConfirmed) {
//                 console.log("☁️ [DB & LOCAL SYNC]: ५-५ मोड सुरू होत आहे. स्टेटस अपडेट करत आहे...");
                
//                 localStorage.setItem(`match_status_${mId}`, "five_raid");
                
//                 try {
//                     await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
//                         status: "five_raid",          
//                         isFiveRaidModeOn: true,        
//                         fiveRaidCount: 1,             
//                         lastUpdated: new Date().getTime()
//                     });
//                 } catch (dbErr) { console.error("🚨 [DB UPDATE FAIL]:", dbErr); }
                
//                 if (typeof currentMatchData !== 'undefined' && currentMatchData) currentMatchData.status = 'five_raid';

//                 if (typeof startFiveRaidsSystem === "function") {
//                     startFiveRaidsSystem(sA, sB);
//                 } else {
//                     window.isFiveRaidModeOn = true; window.fiveRaidCount = 0;
//                     Swal.fire({ title: '५-५策 रेड्स मोड ऑन!', text: 'मूळ स्क्रीनवरच स्कोअरिंग सुरू ठेवा.', icon: 'info', confirmButtonColor: '#f97316', background: '#111', color: '#fff' });
//                 }
//                 return; 
                
//             } else if (tieDecision.isDenied) {
//                 localStorage.setItem(`match_status_${mId}`, "Finished");
//                 console.log("🤝 स्कोअररने थेट टाय घोषित केला.");
//             } else {
//                 return;
//             }
//         }
//         // =============================================================

//         // २. लेटेस्ट स्कोअरनुसार अचूक विजेता ठरवा
//         let winnerText = ""; let winnerTeam = ""; let winnerTeamId = "";
//         if (sA > sB) {
//             winnerTeam = currentMatchData?.teamA || "Team A"; winnerTeamId = currentMatchData?.teamA_id || "TM_A"; winnerText = `${winnerTeam} ने मॅच जिंकली आहे! 🏆`;
//         } else if (sB > sA) {
//             winnerTeam = currentMatchData?.teamB || "Team B"; winnerTeamId = currentMatchData?.teamB_id || "TM_B"; winnerText = `${winnerTeam} ने मॅच जिंकली आहे! 🏆`;
//         } else {
//             winnerTeam = "Tie"; winnerTeamId = "TIE"; winnerText = "मॅच टाय झाली आहे! 🤝";
//         }

//         try {
//             localStorage.setItem(`match_status_${mId}`, "Finished");
//             await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
//                 status: "Finished", scoreA: sA, scoreB: sB, winner: winnerTeam, winner_id: winnerTeamId, finalScore: `${sA}-${sB}`, isMatchPaused: true, lastUpdated: new Date().getTime()
//             });
//             if (typeof lockScoringUI === "function") lockScoringUI();
//             Swal.fire({ title: 'MATCH FINISHED!', html: `<div class="text-xl font-bold text-orange-500">${winnerText}</div><div class="mt-4 text-white text-lg">Final Score: ${sA} - ${sB}</div>`, icon: 'success', confirmButtonText: 'Dashboard ला जा', background: '#111', color: '#fff' }).then(() => { 
//                 if (typeof loadPage === "function") loadPage('matches');
//             });
//         } catch (e) { console.error("🚨 [Error]:", e); }
//     }
// }

/** नवीन मास्टर confirmEndMatch() फंक्शन (All-In-One क्लोजिंग इंजिन)
हा एकच कोड तुझ्या फाईलमध्ये टाकून घे भावा, जो तिन्ही परिस्थिती एकाच जागी लीलया हँडल करेल:*/
async function confirmEndMatch(goldenWinnerTag = null, goldenLogDetails = "") {
    // =========================================================================
    // 📂 SECTION 1: MASTER INITIALIZATIONS & STATUS DETECTIVE
    // =========================================================================
    console.log("%c==================================================", "color: #ef4444; font-weight: bold;");
    console.log("🏁 [MASTER END MATCH ENGINE]: क्लोजिंग फ्लो सुरू झाला...");

    if (!matchSetupData || !matchSetupData.tId || !matchSetupData.mId) {
        console.error("🚨 [CRITICAL]: matchSetupData चे आवश्यक IDs मेमरीमध्ये सापडले नाहीत!");
        return;
    }

    const { tId, mId } = matchSetupData;

    // ब्राउझरच्या मेमरीमधून चालू सामना कोणत्या मोडवर आहे ते अचूक तपासणे
    const localCard = localStorage.getItem('global_score_card');
    const currentScoreCard = localCard ? JSON.parse(localCard) : null;
    
    // फायरबेसमधील चालू स्टेटस बॅकअप
    const currentStatus = (currentMatchData?.status || "").trim();

    const nameA = currentMatchData?.teamA || document.getElementById('teamAName')?.innerText || "Team A";
    const nameB = currentMatchData?.teamB || document.getElementById('teamBName')?.innerText || "Team B";
    const idA = currentMatchData?.teamA_id || "TM_A";
    const idB = currentMatchData?.teamB_id || "TM_B";

    console.log(`📊 [DIAGNOSTIC]: Current Match Status ➔ "${currentStatus}"`);


    // =========================================================================
    // 📂 SECTION 2: USER CONSENT / CONFIRMATION WIZARD (🚨 STEP BY STEP)
    // =========================================================================
    // जर गोल्डन रेड संपवून डायरेक्ट कोड आला नसेल, तरच युझरला पॉपअप विचारणे
    if (!goldenWinnerTag) {
        const userPrompt = await Swal.fire({
            title: 'सामना अधिकृत संपवायचा का?',
            text: "यानंतर स्कोअरमध्ये कोणताही बदल करता येणार नाही!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'हो, सामना संपवा! 🏁',
            cancelButtonText: 'स्कोअरिंग चालू ठेवा',
            background: '#111', color: '#fff',
            confirmButtonColor: '#ef4444', cancelButtonColor: '#4b5563'
        });

        if (!userPrompt.isConfirmed) {
            console.log("❌ [CANCELLED]: युझरने क्लोजिंग फ्लो रद्द केला.");
            return;
        }
    }


    // =========================================================================
    // 📂 SECTION 3: MATHEMATICAL WINNER CALCULATION (🎯 THE DYNAMIC RESOLVER)
    // =========================================================================
    let winnerTeam = "Tie";
    let winnerTeamId = "TIE";
    let winnerText = "सामना टाय झाला आहे! 🤝";
    let finalScoreDisplay = "";

    // 🔥 परिस्थिती अ: जर सामना सुवर्ण रेड (GOLDEN RAID) मोडवर संपला असेल!
    if (currentStatus === "golden_raid" || goldenWinnerTag) {
        let finalTag = goldenWinnerTag || window.goldenRaidTeam; // जर मॅन्युअली पास केला नसेल तर मेमरी ओढणे
        winnerTeam = (finalTag === 'A') ? nameA : nameB;
        winnerTeamId = (finalTag === 'A') ? idA : idB;
        finalScoreDisplay = `Golden Raid Winner: ${winnerTeam}`;
        winnerText = `👑 GOLDEN RAID MAHA-WINNER: ${winnerTeam}! 🔥 (${goldenLogDetails || 'Sudden Death'})`;
    } 
    // ⚡ परिस्थिती ब: जर सामना ५-५ (FIVE RAID) मोडवर संपला असेल!
    else if (currentStatus === "five_raid" || window.isFiveRaidModeOn === true) {
        let fA = Number(currentScoreCard?.fiveRaid?.teamA || 0);
        let fB = Number(currentScoreCard?.fiveRaid?.teamB || 0);
        finalScoreDisplay = `5-5 Score: ${fA} - ${fB}`;

        if (fA === fB) {
            // 🚨 जर ५-५ मध्ये पण स्कोअर टाय झाला, तर क्लोजिंग न करता गोल्डन रेड ट्रिगर करणे सर्वात सेफ!
            console.log("🤝 [5-5 TIED AGAIN]: ५-५ मध्ये पण मॅच टाय झाली! गोल्डन रेडची गरज आहे.");
            // (इथे तू गोल्डन रेड सुरू करण्याचे स्वतःचे मोडल ट्रिगर करू शकतोस, पण जर युझरने थेट टाय घोषित केला तर:)
            winnerTeam = "Tie"; winnerTeamId = "TIE"; winnerText = "५-५ महासंग्राम बरोबरीत सुटला! 🤝";
        } else if (fA > fB) {
            winnerTeam = nameA; winnerTeamId = idA; winnerText = `५-५ मोडमध्ये ${nameA} संघ जिंकला! 🏆`;
        } else {
            winnerTeam = nameB; winnerTeamId = idB; winnerText = `५-५ मोडमध्ये ${nameB} संघ जिंकला! 🏆`;
        }
    } 
    // 🏃‍♂️ परिस्थिती क: जर नेहमीचा सामना (NORMAL MATCH FULL-TIME) संपला असेल!
    else {
        const elA = document.getElementById('scoreA');
        const elB = document.getElementById('scoreB');
        const sA = elA ? Number(elA.innerText || 0) : Number(currentMatchData?.scoreA || 0);
        const sB = elB ? Number(elB.innerText || 0) : Number(currentMatchData?.scoreB || 0);
        finalScoreDisplay = `Final Score: ${sA} - ${sB}`;

        // 🚨 जर फ्रेश सामन्यात मुख्य स्कोअर टाय झाला, तर टाय फिल्टर दाखवणे (५-५ सुरू करण्यासाठी)
        if (sA === sB && sA > 0) {
            const tieDecision = await Swal.fire({
                title: 'सामना बरोबरीत सुटला! (Match Tied)',
                text: 'हा सामना बाद फेरीचा (Knockout) आहे की लीग सामना आहे? पर्याय निवडा:',
                icon: 'question',
                showCancelButton: true, showDenyButton: true,
                confirmButtonText: '🏃‍♂️ ५-५ रेड्स सुरू करा',
                denyButtonText: '🤝 थेट टाय घोषित करा',
                cancelButtonText: 'स्कोअरिंगवर परत जा',
                confirmButtonColor: '#f97316', denyButtonColor: '#3b82f6', cancelButtonColor: '#4b5563',
                background: '#111', color: '#fff',
                customClass: { actions: 'flex flex-col sm:flex-row gap-2 w-full px-4' }
            });

            if (tieDecision.isConfirmed) {
                console.log("⚙️ [5-5 ENGINE INITIATION]: ५-५ कप्पा ऑन करत आहे...");
                localStorage.setItem(`match_status_${mId}`, "five_raid");
                try {
                    await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
                        status: "five_raid", isFiveRaidModeOn: true, fiveRaidCount: 1, lastUpdated: new Date().getTime()
                    });
                } catch (err) { console.error(err); }
                if (typeof startFiveRaidsSystem === "function") startFiveRaidsSystem(sA, sB);
                return; // फ्लो इथूनच थांबवून बाहेर काढला, जेणेकरून मॅच Finished होणार नाही!
            } else if (tieDecision.isDenied) {
                console.log("🤝 स्कोअररने थेट सामना टाय घोषित करून संपवला.");
                winnerTeam = "Tie"; winnerTeamId = "TIE"; winnerText = "सामना अधिकृत बरोबरीत सुटला! 🤝";
            } else {
                return; // स्कोअरिंगवर परत जा
            }
        } else if (sA > sB) {
            winnerTeam = nameA; winnerTeamId = idA; winnerText = `${nameA} ने सामना जिंकला! 🏆`;
        } else {
            winnerTeam = nameB; winnerTeamId = idB; winnerText = `${nameB} ने सामना जिंकला! 🏆`;
        }
    }


    // =========================================================================
    // 📂 SECTION 4: THE MASTER LOCAL STORAGE DUAL SYNC (🎯 NO GAP PROTECTION)
    // =========================================================================
    try {
        // अ. तू सांगितलेली तंतोतंत युनिक की: tournamentId_matchId_winner
        const exactWinnerKey = `${tId}_${mId}_winner`;
        localStorage.setItem(exactWinnerKey, winnerTeam);
        
        // ब. मॅच स्टेटस की क्लोज करणे
        localStorage.setItem(`match_status_${mId}`, "Finished");
        
        console.log(`💾 [MASTER LOCAL STORAGE SYNC SUCCESS]: "${exactWinnerKey}" मध्ये विजेता "${winnerTeam}" सुरक्षित लॉक केला!`);
    } catch (localErr) {
        console.error("🚨 [LOCAL SYNC CRASH]:", localErr);
    }


    // =========================================================================
    // 📂 SECTION 5: MASTER FIRESTORE DEPLOYMENT & SUMMARY MODAL IGNITION
    // =========================================================================
    try {
        console.log("📤 [Firestore Update]: डेटाबेसवर 'Finished' आणि विनर डेटा जतन करत आहे...");
        
        let updatePayload = {
            status: "Finished",
            match_status: "Finished",
            winner: winnerTeam,
            winner_id: winnerTeamId,
            finalScore: finalScoreDisplay,
            isMatchPaused: true,
            endTime: new Date().getTime(),
            lastUpdated: new Date().getTime()
        };

        // जर ५-५ किंवा गोल्डन कार्ड उपलब्ध असेल तर ते देखील डेटाबेसवर फायनल पाठवून देणे
        if (currentScoreCard) {
            updatePayload.scoreCard = currentScoreCard;
        }

        await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update(updatePayload);
        console.log("✅ [FIRESTORE ENGINE LOCKED]: डेटाबेस पूर्ण जतन झाला!");

        if (typeof lockScoringUI === "function") lockScoringUI();

        // स्कोरिंगचे पॅनेल्स हायड करणे
        const fivePanel = document.getElementById('fiveRaidBattleGroundPanel');
        if (fivePanel) fivePanel.classList.add('hidden');
        window.isFiveRaidModeOn = false;
        window.isGoldenRaidActiveNow = false;

        // 🏆 [confirmEndMatch च्या शेवटी]: सामना अधिकृत संपल्याचा गोड मेसेज आणि थेट मोडल ओपनिंग
        Swal.fire({
            title: 'सामना अधिकृत संपला! 🏁',
            html: `<div class="text-xl font-bold text-green-500 mb-2">${winnerText}</div><div class="text-zinc-400 font-mono text-sm">${finalScoreDisplay}</div>`,
            icon: 'success',
            confirmButtonText: '📊 View Match Summary',
            background: '#111', color: '#fff', confirmButtonColor: '#22c55e',
            allowOutsideClick: false
        }).then(() => {
            console.log("%c🚀 [ALERT INTERACTION]: युझरने 'View Match Summary' बटण क्लिक केले! थेट मास्टर मोडल उघडत आहे...", "color: #22c55e; font-weight: bold;");
            
            // थेट मूळ मास्टर इंजिनला ताबा देणे
            if (typeof openSummaryModal === "function") {
                openSummaryModal(tId, mId);
            } else {
                console.error("🚨 [CRITICAL]: openSummaryModal() फंक्शन फाईलमध्ये सापडले नाही!");
            }
        });

    } catch (dbErr) {
        console.error("🚨 [DATABASE END UPDATE FAIL]:", dbErr);
    }
    console.log("%c==================================================", "color: #ef4444; font-weight: bold;");
}

/** */

function lockScoringUI() {
    console.log("[LOCK] Match Finished. Disabling all scoring controls.");
    
    // १. सर्व बटणे शोधा (Raid, Bonus, Tackle, Timeout, Substitution)
    const allButtons = document.querySelectorAll('button');
    
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = "0.3";
        btn.style.pointerEvents = "none";
    });

    // २. टायमर थांबवा
    clearInterval(matchInterval);
    
    // ३. बॅकग्राउंड कलर बदला जेणेकरून 'Finished' फील येईल
    document.body.style.filter = "grayscale(50%)";
}

/** Master Teams  */

// १. मोडल उघडणे
function openGlobalTeamSelector(tId) {
    currentTid = tId; // आपण switchTab मध्ये आधीच सेट केला असेल
    document.getElementById('globalTeamModal').classList.replace('hidden', 'flex');
    searchMasterTeams(); // सुरुवातीला काही टीम्स दाखवण्यासाठी
}

function closeGlobalTeamModal() {
    console.log("[UI]: Attempting to close Global Team Modal...");
    
    // १. आधी घटक अस्तित्वात आहे का ते तपासा (Safety Check)
    const modal = document.getElementById('globalTeamModal');
    
    if (modal) {
        // जर मोडल सापडला, तरच classList बदला
        modal.classList.replace('flex', 'hidden');
        console.log("[UI]: Global Team Modal closed successfully.");
    } else {
        // जर मोडल नसेल (उदा. तुम्ही मास्टर टीम पेजवर आहात), तर फक्त लॉग द्या, एरर नको
        console.warn("[UI]: globalTeamModal element not found on this page. Skipping close.");
    }
}

// २. मास्टर लिस्ट मधून टीम सर्च करणे
// async function searchMasterTeams() {
//     console.log("[Search] Process started...");
    
//     // Safety check for null elements
//     const queryInput = document.getElementById('searchTeamInput');
//     const assocSelect = document.getElementById('filterAssociation');
//     const groupSelect = document.getElementById('filterGroup');
//     const resultsContainer = document.getElementById('masterTeamResults');

//     if (!queryInput || !assocSelect || !groupSelect) {
//         console.error("[Error] Elements not found!"); return;
//     }

//     const queryText = queryInput.value.toLowerCase();
//     const association = assocSelect.value;
//     const group = groupSelect.value;

//     resultsContainer.innerHTML = `<p class="text-orange-500 text-xs text-center py-4 animate-pulse">शोधत आहे...</p>`;

//     try {
//         let teamRef = db.collection("master_teams");
        
//         if (association) {
//             console.log("[Filter] Association:", association);
//             teamRef = teamRef.where("associationId", "==", association);
//         }
        
//         // नवीन ग्रुप फिल्टर लॉजिक
//         if (group) {
//             console.log("[Filter] Group:", group);
//             teamRef = teamRef.where("currentGroup", "==", group);
//         }

//         const snapshot = await teamRef.limit(40).get(); // जास्त टीम्स आणल्या
//         console.log(`[Data] Found ${snapshot.size} teams in Firestore`);

//         const teams = [];
//         snapshot.forEach(doc => teams.push({ id: doc.id, ...doc.data() }));

//         const filteredTeams = teams.filter(t => t.teamName.toLowerCase().includes(queryText));

//         if (filteredTeams.length === 0) {
//             console.warn("[Search] No teams matched.");
//             resultsContainer.innerHTML = `<p class="text-gray-500 text-xs text-center py-4">टीम सापडली नाही.</p>`;
//             return;
//         }

//         // Compact UI for showing more teams
//         resultsContainer.innerHTML = filteredTeams.map(team => `
//             <div class="flex justify-between items-center bg-gray-900 p-3 rounded-xl border border-gray-800 hover:border-orange-500 transition-all">
//                 <div>
//                     <p class="text-sm font-bold text-white">${team.teamName}</p>
//                     <p class="text-[10px] text-gray-500 uppercase">${team.associationId || 'General'} | Group: ${team.currentGroup || 'N/A'}</p>
//                 </div>
//                 <button onclick="addTeamToTournament('${team.teamName}')" class="bg-orange-600 text-white text-[10px] px-4 py-2 rounded-lg font-bold uppercase active:scale-90 shadow-md">
//                     निवडा
//                 </button>
//             </div>
//         `).join('');
        
//         console.log(`[UI] Rendered ${filteredTeams.length} teams.`);

//     } catch (e) {
//         console.error("[Fatal Error] searchMasterTeams failed:", e);
//         resultsContainer.innerHTML = `<p class="text-red-500 text-xs text-center py-4">काहीतरी चुकलंय! कन्सोल तपासा.</p>`;
//     }
// }

/***
 * यावेळी तुला फ्रंटएंड कन्सोलमध्येच पहिल्या ओळीत संघाचे खरे नाव आणि त्याचा अधिकृत regId (उदा. MSKALG0029) 
 * अत्यंत कडकडीत हायलाईट झालेला दिसेल आणि TBD_ID चा बोजवारा कायमचा संपेल!, 
 */
async function searchMasterTeams() {
    // 🔍 [लॉग १]: प्रोसेस सुरू झाल्याचा मोठा निळा सिग्नल
    console.log("%c==================================================", "color: #3b82f6; font-weight: bold;");
    console.log("%c🔍 [Search Master Teams]: शोध प्रक्रिया आणि फिल्टर तपासणी सुरू...", "color: #3b82f6; font-weight: bold; font-size: 12px;");
    console.log("%c==================================================", "color: #3b82f6; font-weight: bold;");
    
    const queryInput = document.getElementById('searchTeamInput');
    const assocSelect = document.getElementById('filterAssociation');
    const groupSelect = document.getElementById('filterGroup');
    const resultsContainer = document.getElementById('masterTeamResults');

    if (!queryInput || !assocSelect || !groupSelect) {
        console.error("🚨 [Error]: HTML मधील सर्च किंवा फिल्टर एलिमेंट्स DOM मध्ये सापडले नाहीत!"); 
        return;
    }

    const queryText = queryInput.value.toLowerCase();
    const association = assocSelect.value;
    const group = groupSelect.value;

    resultsContainer.innerHTML = `<p class="text-orange-500 text-xs text-center py-4 animate-pulse">शोधत आहे...</p>`;

    try {
        let teamRef = db.collection("master_teams");
        
        // फिल्टर्सचे लाईव्ह कन्सोल ट्रॅकिंग
        if (association) {
            console.log(`%c[Filter Active]: Association ➔ %c"${association}"`, "color: #a855f7;", "color: #a855f7; font-weight: bold;");
            teamRef = teamRef.where("associationId", "==", association);
        }
        
        if (group) {
            console.log(`%c[Filter Active]: Group ➔ %c"${group}"`, "color: #a855f7;", "color: #a855f7; font-weight: bold;");
            teamRef = teamRef.where("currentGroup", "==", group);
        }

        const snapshot = await teamRef.limit(40).get(); 
        console.log(`%c📊 [Firestore Data]: 'master_teams' मधून एकूण ${snapshot.size} दस्तऐवज (Documents) आले.`, "color: #06b6d4; font-weight: bold;");

        const teams = [];
        snapshot.forEach(doc => teams.push({ id: doc.id, ...doc.data() }));

        // फ्रंटएंड सर्च फिल्टर (Text Search)
        const filteredTeams = teams.filter(t => t.teamName.toLowerCase().includes(queryText));

        if (filteredTeams.length === 0) {
            console.warn(`%c⚠️ [Search Status]: "${queryText}" नावाची कोणतीही टीम मॅच झाली नाही.`, "color: #eab308;");
            resultsContainer.innerHTML = `<p class="text-gray-500 text-xs text-center py-4">टीम सापडली नाही.</p>`;
            return;
        }

        // 🔍 [लाइव्ह फ्रंटएंड चेक]: रेंडर होण्यापूर्वी पूर्ण ऑब्जेक्ट यादी कन्सोलमध्ये उघडून दाखवणे
        console.log("%c📋 [मॅच झालेल्या संघांची मूळ यादी]:", "color: #06b6d4; font-weight: bold;", filteredTeams);
        console.log("%c--------------------------------------------------", "color: #gray;");

        // UI रेंडरिंग आणि प्रत्येक कार्डच्या आयडीची चिरफाड सुरू
        resultsContainer.innerHTML = filteredTeams.map((team, index) => {
            
            // 🟢 [अल्टीमेट आयडी ट्रॅकिंग]:
            const realSystemId = team.id;          // हा खरोखरचा दस्तऐवज आयडी आहे (उदा. TM_JAY_BHARAT_SEVA_005)
            const manualRegId = team.regId || "N/A"; // हा मॅन्युअल नोंदणी क्रमांक आहे (उदा. MSKALG0029)
            const cleanTeamName = team.teamName.replace(/'/g, "\\'"); // सिंगल कोट नावांचा एरर रोखण्यासाठी

            // 🔍 [लाइव्ह कार्ड लॉग]: प्रत्येक बटणावर नक्की काय आयडी लॉक होतोय ते डोळ्यांसमोर दिसेल
            console.log(`🏅 [कार्ड ${index + 1} रेंडर] ➔ संघ: %c"${team.teamName}"`, "color: #fff; font-weight: bold;");
            console.log(`   ↳ 🔑 खरोखरचा सिस्टीम ID (team.id)  : %c"${realSystemId}"`, "color: #22c55e; font-weight: bold;");
            console.log(`   ↳ 🔑 मॅन्युअल नोंदणी क्रमांक (regId) : %c"${manualRegId}"`, "color: #eab308;");

            return `
                <div class="flex justify-between items-center bg-gray-900 p-3 rounded-xl border border-gray-800 hover:border-orange-500 transition-all mb-2">
                    <div>
                        <p class="text-sm font-bold text-white uppercase">${team.teamName}</p>
                        <p class="text-[9px] text-gray-400 uppercase tracking-tight font-mono">
                            ID: <span class="text-green-400 font-bold">${realSystemId}</span> | Reg: <span class="text-yellow-500">${manualRegId}</span>
                        </p>
                    </div>
                    <button onclick="addTeamToTournament('${cleanTeamName}', '${manualRegId}', '${realSystemId}')" 
                            class="bg-orange-600 text-white text-[10px] px-4 py-2 rounded-lg font-black uppercase active:scale-90 shadow-md transition-transform">
                        निवडा
                    </button>
                </div>
            `;
        }).join('');
        
        console.log("%c--------------------------------------------------", "color: #gray;");
        console.log(`%c✅ [UI Rendering Completed]: एकूण ${filteredTeams.length} टीम्स स्क्रीनवर यशस्वीरित्या लावल्या आहेत!`, "color: #22c55e; font-weight: bold;");

    } catch (e) {
        console.error("🚨 [Fatal Error]: searchMasterTeams चालताना गंभीर त्रुटी आली:", e);
        resultsContainer.innerHTML = `<p class="text-red-500 text-xs text-center py-4">काहीतरी चुकलंय! कन्सोल तपासा.</p>`;
    }
}


// ३. निवडलेली टीम टूर्नामेंटमध्ये ॲड करणे
// async function addTeamToTournament(teamName) {
//     if (!currentTid) return;
    
//     try {
//         const tRef = db.collection("tournaments").doc(currentTid);
//         const doc = await tRef.get();
//         const teams = doc.data().teams || [];

//         if (teams.includes(teamName)) {
//             Swal.fire("आधीच आहे!", "हा संघ आधीच टूर्नामेंटमध्ये जोडलेला आहे.", "info");
//             return;
//         }

//         await tRef.update({
//             teams: firebase.firestore.FieldValue.arrayUnion(teamName)
//         });

//         closeGlobalTeamModal();
//         Swal.fire({ title: "संघ जोडला!", icon: "success", timer: 1000, showConfirmButton: false });
        
//         // टॅब पुन्हा रेंडर करा जेणेकरून नवीन टीम दिसेल
//         switchTab('teams', currentTid);

//     } catch (e) {
//         console.error("Add Team Error:", e);
//     }
// }

// add team to tournament

async function addTeamToTournament(teamName, regId, teamId) {
    if (!currentTid) {
        console.error("%c🚨 [संघ जोडणे एरर]: करंट टूर्नामेंट आयडी (currentTid) सापडला नाही!", "background: red; color: white; font-weight: bold; padding: 4px;");
        return;
    }
    
    // 🟢 आपण जो 'teamId' (TM_...) पॅरामीटर वाढवला आहे, तो नसेल तर बॅकअप म्हणून 'regId' घेईल
    const finalSystemId = (teamId && teamId.startsWith("TM_")) ? teamId : regId;

    // 🔥 =================== [अल्टीमेट फ्रंटएंड लाईव्ह लॉग] ===================
    console.log("%c==================================================", "color: #06b6d4; font-weight: bold;");
    console.log(`%c📥 [टूर्नामेंट संघ जोडणी]: मास्टर यादीमधून संघ निवडला आहे!`, "color: #06b6d4; font-weight: bold; font-size: 12px;");
    console.log(`👉 संघाचे नाव             : "${teamName}"`);
    console.log(`👉 मॅन्युअल नोंदणी क्रमांक (regId) : "${regId}"`);
    
    // 🎯 हाच तो आयडी जो टूर्नामेंटच्या 'teams' ॲरेमध्ये सेव्ह होणार आहे
    if (finalSystemId && finalSystemId.startsWith("TM_")) {
        console.log(`👉 डेटाबेसमध्ये जाणारा फायनल ID : %c" ${finalSystemId} " ✅ [कडक सिस्टीम आयडी]`, "background: #1e3a8a; color: #38bdf8; font-weight: bold; font-size: 13px; padding: 3px; border-radius: 4px;");
    } else {
        console.log(`👉 डेटाबेसमध्ये जाणारा फायनल ID : %c" ${finalSystemId} " ⚠️ [जुना मॅन्युअल आयडी]`, "background: #7c2d12; color: #f97316; font-weight: bold; font-size: 13px; padding: 3px; border-radius: 4px;");
    }
    console.log(`📍 लक्ष्य टूर्नामेंट ID      : ${currentTid}`);
    console.log("%c==================================================", "color: #06b6d4; font-weight: bold;");
    // =======================================================================

    try {
        const tRef = db.collection("tournaments").doc(currentTid);
        const doc = await tRef.get();
        const teams = doc.data().teams || [];

        // खऱ्या सिस्टीम आयडीने संघ आधीच आहे का तपासणे
        const isAlreadyAdded = teams.some(t => {
            const existingId = (typeof t === 'object') ? t.regId : t;
            return existingId === finalSystemId;
        });

        if (isAlreadyAdded) {
            Swal.fire("आधीच आहे!", "हा संघ आधीच टूर्नामेंटमध्ये जोडलेला आहे.", "info");
            return;
        }

        // 'regId' फील्डच्या पोटात आपण फायनल सिस्टीम आयडी पाठवत आहोत
        const newTeamObject = {
            regId: finalSystemId, 
            teamName: teamName
        };

        // 💾 जतन होण्यापूर्वीचा फायनल व्हेरिफिकेशन लॉग
        console.log("%c💾 [FIRESTORE WRITE]: टूर्नामेंटच्या 'teams' ॲरेमध्ये हा अचूक ऑब्जेक्ट पुश होत आहे:", "color: #22c55e; font-weight: bold;", newTeamObject);

        await tRef.update({
            teams: firebase.firestore.FieldValue.arrayUnion(newTeamObject)
        });

        closeGlobalTeamModal();
        Swal.fire({ title: "संघ जोडला!", text: `${teamName} यशस्वीरित्या समाविष्ट झाला.`, icon: "success", timer: 1000, showConfirmButton: false });
        
        switchTab('teams', currentTid);

    } catch (e) {
        console.error("🚨 [संघ जोडणे क्रिटिकल एरर]:", e);
        Swal.fire("Error", "टूर्नामेंटमध्ये संघ जोडताना तांत्रिक चूक झाली.", "error");
    }
}



/** हे फंक्शन्स तुझे createMasterTeamModal मोडल उघडणे, बंद करणे आणि डेटा सेव्ह करण्याचे काम करतील:*/
// १. मोडल उघडणे आणि बंद करणे
function showCreateNewTeamForm() {
    console.log("Opening Create Team Modal...");

    // रिसेट करण्यासाठी आयडींची लिस्ट
    const fieldsToReset = [
        'newMasterTeamName',
        'newMasterTeamArea',
        'newMasterTeamPin'
    ];

    fieldsToReset.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = ""; // जर आयडी सापडला तरच व्हॅल्यू काढा
        }
    });

    // ड्रॉपडाउन्सना पहिल्या ऑप्शनवर सेट करा
    const selectsToReset = ['newMasterTeamAssoc', 'newMasterTeamGroup', 'newMasterTeamStatus'];
    selectsToReset.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.selectedIndex = 0;
        }
    });

    // मोडल दाखवा
    const modal = document.getElementById('createMasterTeamModal');
    if (modal) {
        modal.classList.replace('hidden', 'flex');
    } else {
        console.error("Error: 'createMasterTeamModal' आयडी index.html मध्ये सापडला नाही.");
    }
}

/**
 * जेव्हा तू मोडल बंद करशील, तेव्हा तो पुन्हा 'Create' मोडमध्ये येणं गरजेचं आहे, 
 * नाहीतर पुढच्या वेळी नवीन टीम ॲड करताना तिथे 'Update' बटण दिसेल.
तुझ्या closeCreateTeamModal फंक्शनमध्ये हे बदल कर:
 */

function closeCreateTeamModal() {
    const modal = document.getElementById('createMasterTeamModal');
    if (modal) {
        modal.classList.replace('flex', 'hidden');
        
        // मोडल पुन्हा 'Create' मोडमध्ये सेट करा
        document.querySelector('#createMasterTeamModal h3').innerText = "अधिकृत संघ नोंदणी";
        const actionBtn = document.querySelector('#createMasterTeamModal button[onclick="handleUpdateMasterTeam()"]');
        if (actionBtn) {
            actionBtn.innerText = "नोंदणी करा आणि जोडा (Register & Add)";
            actionBtn.setAttribute("onclick", "handleCreateMasterTeam()");
        }
        
        editingTeamId = null; // ID विसरून जा
    }
}

// २. डेटा जमा करणे आणि Firestore मध्ये पाठवणे
// async function handleCreateMasterTeam() {
//     console.log("[Process] handleCreateMasterTeam started...");

//     // १. मोडल इनपुटमधून डेटा मिळवणे
//     const name = document.getElementById('newMasterTeamName')?.value.trim();
//     const assoc = document.getElementById('newMasterTeamAssoc')?.value;
//     const group = document.getElementById('newMasterTeamGroup')?.value;
//     const area = document.getElementById('newMasterTeamArea')?.value.trim();
//     const pin = document.getElementById('newMasterTeamPin')?.value.trim();
//     const status = document.getElementById('newMasterTeamStatus')?.value;
//     const regId = document.getElementById('newMasterTeamRegId')?.value.trim();
    
//     // [NEW INPUTS] मॅनेजरचा ईमेल आणि मोबाईल नंबर वाचणे
//     const managerEmail = document.getElementById('newMasterTeamManagerEmail')?.value.trim() || "";
//     const managerPhone = document.getElementById('newMasterTeamManagerPhone')?.value.trim() || "";

//     console.log("[Data Collected for New Team Create]:", { name, regId, assoc, group, area, pin, status, managerEmail, managerPhone });

//     // २. कडक व्हॅलिडेशन (Strict Validation)
//     if (!name) {
//         Swal.fire({ icon: 'warning', title: 'नाव आवश्यक!', text: 'कृपया संघाचे नाव टाईप करा.' });
//         return;
//     }

//     // REGID CHECK (हा अनिवार्य केला आहे)
//     if (!regId) {
//         Swal.fire({ icon: 'warning', title: 'रजिस्ट्रेशन आयडी आवश्यक!', text: 'कृपया संघाचा अधिकृत नोंदणी क्रमांक (Reg ID) टाका.' });
//         return;
//     }

//     if (!area || !pin) {
//         Swal.fire({ icon: 'warning', title: 'माहिती अपूर्ण!', text: 'कृपया परिसर आणि ६ अंकी पिनकोड भरणे गरजेचे आहे.' });
//         return;
//     }

//     try {
//         let tData = null;
//         let currentSeason = "2025-26"; // Default

//         // टूर्नामेंट संदर्भ तपासणे
//         if (typeof currentTid !== 'undefined' && currentTid) {
//             console.log(`[Context]: Adding via Tournament (ID: ${currentTid})`);
//             const tDoc = await db.collection("tournaments").doc(currentTid).get();
//             tData = tDoc.data();
//             currentSeason = tData?.season || currentSeason;

//             // Group Validation फक्त टूर्नामेंटमधून ॲड करतानाच लावा
//             if (tData && tData.group && group !== tData.group) {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'गट जुळत नाही!',
//                     text: `ही टूर्नामेंट ${tData.group} गटाची आहे. तुम्ही ${group} गट निवडला आहे.`
//                 });
//                 return; 
//             }
//         } else {
//             console.log("[Context]: Adding via Master Teams Page (No Tournament Link)");
//         }

//         // टीम आधीच अस्तित्त्वात आहे का तपासणे
//         const teamRef = db.collection("master_teams");
//         const existCheck = await teamRef.where("teamName", "==", name).get();
        
//         if (!existCheck.empty) {
//             Swal.fire({ icon: 'error', title: 'संघ आधीच आहे!', text: 'हा संघ मास्टर लिस्टमध्ये आहे.' });
//             return;
//         }

//         // ३. नवीन फायनल डेटा ऑब्जेक्ट तयार करा (मॅनेजर डेटासह)
//         const finalData = {
//             teamName: name,
//             regId: regId, // Root Level वर सुरक्षित
//             associationId: assoc,
//             area: area,
//             pincode: pin,
//             createdAt: new Date().getTime(),
//             lastRegSeason: currentSeason,
//             currentGroup: group,
//             currentStatus: status,
            
//             // [NEW FIELDS] भविष्यात मॅनेजर कंट्रोल देण्यासाठी
//             managerEmail: managerEmail,
//             managerPhone: managerPhone,
//             teamLogo: "", // सुरुवातीला ब्लँक (मॅनेजर नंतर त्याचा लोगो लावेल)

//             // सीझन डेटा रेकॉर्ड
//             seasonData: {
//                 [currentSeason]: { 
//                     group: group, 
//                     status: status, 
//                     updatedAt: new Date().getTime() 
//                 }
//             }
//         };

//         console.log("[Firestore]: Writing finalData to master_teams...", finalData);

//         // Firestore मध्ये मास्टर एंट्री करणे
//         await teamRef.add(finalData);
//         console.log("[Firestore]: Master Entry Created Successfully.");

//         // ४. टूर्नामेंटमध्ये लिंक करणे (उपलब्ध असल्यास)
//         if (typeof currentTid !== 'undefined' && currentTid) {
//             await db.collection("tournaments").doc(currentTid).update({
//                 teams: firebase.firestore.FieldValue.arrayUnion(name)
//             });
//             console.log("[Firestore]: Linked to Tournament.");
//             switchTab('teams', currentTid);
//         } else {
//             loadMasterTeamsList(); 
//         }

//         Swal.fire({ 
//             icon: 'success', 
//             title: 'नोंदणी यशस्वी!', 
//             text: 'नवीन संघ डेटाबेसमध्ये जतन केला आहे.',
//             timer: 2000, 
//             showConfirmButton: false 
//         });
        
//         closeCreateTeamModal();
//         if (typeof closeGlobalTeamModal === 'function') closeGlobalTeamModal();

//     } catch (error) {
//         console.error("[Fatal Error in handleCreateMasterTeam]:", error);
//         Swal.fire({ icon: 'error', title: 'तांत्रिक अडचण!', text: error.message });
//     }
// }

/**
 * आता आपल्या कडक प्लॅन्डिंगनुसार, आपण या कोडमध्ये फायरबेसचा रँडम आयडी साफ करणार आहोत. 
 * युझर मॅन्युअली जो regId भरणार आहे (उदा. MSKALG0029), आपण त्याच्याच मदतीने आपला कडक TM_JAY_BHARAT_892 सारखा युनिक सिस्टीम आयडी तयार करू. 
 * तसेच, जर हा संघ टूर्नामेंटमधून थेट तयार होत असेल, 
 * तर आपण जुन्या पद्धतीने फक्त संघाचे नाव (name) पाठवण्याऐवजी 
 * आपला नवीन कडक ऑब्जेक्ट { regId: customTeamId, teamName: name } टूर्नामेंटच्या teams ॲरेमध्ये पुश करूया.
 */

async function handleCreateMasterTeam() {
    console.log("%c[Process] handleCreateMasterTeam started... 🚀", "color: #3b82f6; font-weight: bold;");

    // १. मोडल इनपुटमधून डेटा मिळवणे
    const name = document.getElementById('newMasterTeamName')?.value.trim();
    const assoc = document.getElementById('newMasterTeamAssoc')?.value;
    const group = document.getElementById('newMasterTeamGroup')?.value;
    const area = document.getElementById('newMasterTeamArea')?.value.trim();
    const pin = document.getElementById('newMasterTeamPin')?.value.trim();
    const status = document.getElementById('newMasterTeamStatus')?.value;
    const regId = document.getElementById('newMasterTeamRegId')?.value.trim();
    
    const managerEmail = document.getElementById('newMasterTeamManagerEmail')?.value.trim() || "";
    const managerPhone = document.getElementById('newMasterTeamManagerPhone')?.value.trim() || "";

    console.log("[Data Collected for New Team Create]:", { name, regId, assoc, group, area, pin, status, managerEmail, managerPhone });

    // २. कडक व्हॅलिडेशन (Strict Validation)
    if (!name) {
        Swal.fire({ icon: 'warning', title: 'नाव आवश्यक!', text: 'कृपया संघाचे नाव टाईप करा.' });
        return;
    }

    if (!regId) {
        Swal.fire({ icon: 'warning', title: 'रजिस्ट्रेशन आयडी आवश्यक!', text: 'कृपया संघाचा अधिकृत नोंदणी क्रमांक (Reg ID) टाका.' });
        return;
    }

    if (!area || !pin) {
        Swal.fire({ icon: 'warning', title: 'माहिती अपूर्ण!', text: 'कृपया परिसर आणि ६ अंकी पिनकोड भरणे गरजेचे आहे.' });
        return;
    }

    try {
        let tData = null;
        let currentSeason = "2025-26"; // Default

        // टूर्नामेंट संदर्भ तपासणे
        if (typeof currentTid !== 'undefined' && currentTid) {
            console.log(`[Context]: Adding via Tournament (ID: ${currentTid})`);
            const tDoc = await db.collection("tournaments").doc(currentTid).get();
            tData = tDoc.data();
            currentSeason = tData?.season || currentSeason;

            if (tData && tData.group && group !== tData.group) {
                Swal.fire({
                    icon: 'error',
                    title: 'गट जुळत नाही!',
                    text: `ही टूर्नामेंट ${tData.group} गटाची आहे. तुम्ही ${group} गट निवडला आहे.`
                });
                return; 
            }
        }

        // 🟢 फिक्स १: रँडम आयडी ऐवजी आपला कडक सिस्टीम आयडी डिझाईन करणे
        // नावातील स्पेस काढून आणि शेवटी रँडम नंबर टाकून बनवला (उदा. TM_JAY_BHARAT_892)
        const cleanTeamName = name.replace(/\s+/g, '_').toUpperCase().slice(0, 15);
        const randomNum = Math.floor(1000 + Math.random() * 9000).toString().slice(-3);
        const customTeamId = `TM_${cleanTeamName}_${randomNum}`;

        // टीमचा नाव किंवा नवीन बनवलेला कस्टम आयडी आधीच अस्तित्त्वात आहे का तपासणे
        const teamRef = db.collection("master_teams");
        const existCheck = await teamRef.doc(customTeamId).get();
        
        if (existCheck.exists) {
            Swal.fire({ icon: 'error', title: 'संघ आधीच आहे!', text: 'या आयडीचा संघ मास्टर लिस्टमध्ये आधीच नोंदणीकृत आहे.' });
            return;
        }

        // ३. नवीन फायनल डेटा ऑब्जेक्ट तयार करा
        const finalData = {
            teamId: customTeamId,         // 🔐 आपला कडक सिस्टीम जनरेटेड युनिक आयडी
            teamName: name,
            regId: regId,                 // युझरने भरलेला मॅन्युअल रजिस्ट्रेशन आयडी
            associationId: assoc,
            area: area,
            pincode: pin,
            createdAt: new Date().getTime(),
            lastRegSeason: currentSeason,
            currentGroup: group,
            currentStatus: status,
            managerEmail: managerEmail,
            managerPhone: managerPhone,
            teamLogo: "", 

            seasonData: {
                [currentSeason]: { 
                    group: group, 
                    status: status, 
                    updatedAt: new Date().getTime() 
                }
            }
        };

        // 🔍 [लाइव्ह फ्रंटएंड चेक]: फायरबेसमध्ये जाण्यापूर्वी कन्सोलमध्ये सर्व व्हॅल्यूज तपासून घेणे
        console.log("%c==================================================", "color: #22c55e; font-weight: bold;");
        console.log(`%c💾 [मास्टर संघ निर्मिती]: नवीन फ्युचर-प्रूफ संघ तयार होत आहे...`, "color: #22c55e; font-weight: bold; font-size: 11px;");
        console.log(`👉 नवीन सिस्टीम ID  : %c"${customTeamId}"`, "color: #3b82f6; font-weight: bold; font-size: 12px;");
        console.log(`👉 संघाचे नाव     : "${name}"`);
        console.log(`👉 नोंदणी ID (Reg) : "${regId}"`);
        console.log("%c==================================================", "color: #22c55e; font-weight: bold;");

        // 🟢 फिक्स २: .add() ऐवजी आपण स्वतः बनवलेल्या डॉक्युमेंट आयडीचा वापर करून .set() करणे
        await teamRef.doc(customTeamId).set(finalData);
        console.log(`[Firestore]: Master Entry Created with Custom ID: ${customTeamId}`);

        // ४. टूर्नामेंटमध्ये लिंक करणे (उपलब्ध असल्यास)
        if (typeof currentTid !== 'undefined' && currentTid) {
            // 🟢 फिक्स ३: टूर्नामेंटच्या teams ॲरेमध्ये फक्त साधी स्ट्रिंग पाठवण्याऐवजी आपला कडक ऑब्जेक्ट जोडणे
            const tournamentTeamObject = {
                regId: customTeamId, // आपला बनवलेला अधिकृत युनिक आयडी
                teamName: name
            };

            console.log("[Firestore]: टूर्नामेंटच्या 'teams' ॲरेमध्ये ऑब्जेक्ट लिंक करत आहे ->", tournamentTeamObject);

            await db.collection("tournaments").doc(currentTid).update({
                teams: firebase.firestore.FieldValue.arrayUnion(tournamentTeamObject)
            });
            
            console.log("[Firestore]: Linked to Tournament.");
            switchTab('teams', currentTid);
        } else {
            loadMasterTeamsList(); 
        }

        Swal.fire({ 
            icon: 'success', 
            title: 'नोंदणी यशस्वी!', 
            text: `नवीन संघ (आयडी: ${customTeamId}) सुरक्षितपणे जतन केला आहे.`,
            timer: 2000, 
            showConfirmButton: false 
        });
        
        closeCreateTeamModal();
        if (typeof closeGlobalTeamModal === 'function') closeGlobalTeamModal();

    } catch (error) {
        console.error("🚨 [Fatal Error in handleCreateMasterTeam]:", error);
        Swal.fire({ icon: 'error', title: 'तांत्रिक अडचण!', text: error.message });
    }
}



/**
 * टूर्नामेंटमधून संघ काढणे (Remove Team from Tournament)
टूर्नामेंटच्या टीम लिस्टमध्ये प्रत्येक टीमच्या नावापुढे एक 'Remove' (कचरापेटीचं आयकॉन) देऊया.
लॉजिक: हे फक्त टूर्नामेंटच्या डॉक्युमेंटमधील teams ॲरेमधून त्या टीमचं नाव काढून टाकेल. यामुळे 'Master List' मधील टीम डिलीट होणार नाही.
*/

// async function removeTeamFromTournament(teamName) {
//     console.log(`[Process]: Removing ${teamName} from tournament...`);
    
//     const result = await Swal.fire({
//         title: 'खात्री आहे का?',
//         text: "या संघाला टूर्नामेंटमधून काढून टाकले जाईल!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#d33',
//         confirmButtonText: 'हो, काढा!'
//     });

//     if (result.isConfirmed) {
//         try {
//             await db.collection("tournaments").doc(currentTid).update({
//                 teams: firebase.firestore.FieldValue.arrayRemove(teamName)
//             });
//             console.log("[Firestore]: Success - Team removed from tournament.");
//             switchTab('teams', currentTid); // रिफ्रेश टॅब
//         } catch (error) {
//             console.error("[Error]: Failed to remove team.", error);
//         }
//     }
// }

async function removeTeamFromTournament(teamName, regId) {
    if (!currentTid) {
        console.error("🚨 [ERR]: currentTid (टूर्नामेंट आयडी) मिळालेला नाही!");
        return;
    }

    // 🔥 [FRONTEND LIVE LOG]: काढण्यापूर्वी फ्रंटएंडलाच सर्व व्हॅल्यूज चोख दिसतील
    console.log("%c==================================================", "color: #ef4444; font-weight: bold;");
    console.log(`%c🗑️ [टूर्नामेंट संघ काढण्याची प्रक्रिया सुरू]...`, "color: #ef4444; font-weight: bold; font-size: 11px;");
    console.log(`👉 काढायचा संघ (नाव) : "${teamName}"`);
    console.log(`👉 काढायचा संघ (ID)  : "${regId}"`);
    console.log("%c==================================================", "color: #ef4444; font-weight: bold;");
    
    const result = await Swal.fire({
        title: 'खात्री आहे का?',
        text: `"${teamName}" या संघाला टूर्नामेंटमधून काढून टाकले जाईल!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'हो, काढा!',
        cancelButtonText: 'रद्द करा'
    });

    if (result.isConfirmed) {
        try {
            // 🟢 [फिक्स ऑब्जेक्ट]: ॲरेमधून काढण्यासाठी आपण सेव्ह केलेला तोच हुबेहूब साचा (Object) पास करत आहोत
            const targetObjectToRemove = {
                regId: regId || "TBD_ID",
                teamName: teamName
            };

            console.log("[Firestore WRITE]: arrayRemove द्वारे हा ऑब्जेक्ट डिलीट करत आहे ->", targetObjectToRemove);

            await db.collection("tournaments").doc(currentTid).update({
                teams: firebase.firestore.FieldValue.arrayRemove(targetObjectToRemove)
            });
            
            console.log(`%c✅ [डेटाबेस यशस्वी]: "${teamName}" संघ टूर्नामेंटमधून डिलीट झाला!`, "color: #22c55e; font-weight: bold;");
            
            // टॅब रिफ्रेश करा
            switchTab('teams', currentTid); 
            
        } catch (error) {
            console.error("🚨 [डिलीट एरर]: फायरबेसमधून संघ काढताना चूक झाली:", error);
            Swal.fire("त्रुटी", "संघ काढताना तांत्रिक अडचण आली.", "error");
        }
    }
}


/***********************Team Master ******************/
/***
 * हे फंक्शन वापरून तू तुझ्या असोसिएशनच्या टीम्स एका कार्ड फॉरमॅटमध्ये दाखवू शकतोस.
 * loadMasterTeamsList (Full Advanced Version)
हे फंक्शन तुझ्या जुन्या फंक्शनच्या जागी रिप्लेस कर. हे आता एकाच वेळी Group, Status आणि Search तिन्ही गोष्टी हाताळेल.

 */

// १. टीम्स लोड करणे
// async function loadMasterTeamsList() {
//     console.log("[Process]: Loading Master Teams List...");

//     // १. घटकांचे संदर्भ मिळवा
//     const container = document.getElementById('masterTeamListContainer');
//     const groupFilter = document.getElementById('masterPageGroupFilter')?.value || "All";
//     const statusFilter = document.getElementById('masterPageStatusFilter')?.value || "All";
//     const searchText = document.getElementById('masterTeamPageSearch')?.value.toLowerCase() || "";

//     if (!container) {
//         console.error("[Error]: 'masterTeamListContainer' missing!");
//         return;
//     }

//     container.innerHTML = `<div class="col-span-2 text-center py-10 text-orange-500 text-[10px] uppercase tracking-widest animate-pulse">डेटा लोड होत आहे...</div>`;

//     try {
//         let teamRef = db.collection("master_teams");

//         // २. Firestore Query Filters (Group आणि Status दोन्ही एकत्र)
//         if (groupFilter !== "All") {
//             console.log("[Query]: Filtering by Group -", groupFilter);
//             teamRef = teamRef.where("currentGroup", "==", groupFilter);
//         }

//         if (statusFilter !== "All") {
//             console.log("[Query]: Filtering by Status -", statusFilter);
//             teamRef = teamRef.where("currentStatus", "==", statusFilter);
//         }

//         const snapshot = await teamRef.get();
//         console.log(`[Data]: Fetched ${snapshot.size} records.`);

//         let html = "";
// snapshot.forEach(doc => {
//     const team = doc.data();
//     const teamId = doc.id;
    
//     // १. ग्रुपनुसार कलर्स ठरवा
//     let groupBorder = "border-l-gray-600"; 
//     let groupBg = "bg-gray-800/10";
//     let groupText = "text-gray-400";

//     if (team.currentGroup === "A") {
//         groupBorder = "border-l-green-500";
//         groupBg = "bg-green-500/5";
//         groupText = "text-green-500";
//     } else if (team.currentGroup === "B") {
//         groupBorder = "border-l-blue-500";
//         groupBg = "bg-blue-500/5";
//         groupText = "text-blue-500";
//     } else if (team.currentGroup === "C") {
//         groupBorder = "border-l-yellow-500";
//         groupBg = "bg-yellow-500/5";
//         groupText = "text-yellow-500";
//     } else if (team.currentGroup === "Vaysayik") {
//         groupBorder = "border-l-purple-500";
//         groupBg = "bg-purple-500/5";
//         groupText = "text-purple-500";
//     }

//     // २. स्टेटस चेक (Banned असेल तर वेगळा लुक)
//     const isBanned = team.currentStatus === "Banned";
//     if (isBanned) {
//         groupBorder = "border-l-red-600";
//         groupBg = "bg-red-600/5";
//     }

//     // ३. क्लायंट साईड सर्च फिल्टर
//     if (team.teamName.toLowerCase().includes(searchText)) {
//         html += `
//         <div class="relative bg-[#111] ${groupBg} border border-gray-800 ${groupBorder} border-l-4 p-2 rounded-xl shadow-md animate-fadeIn flex items-center space-x-2 h-[65px]">
            
//             <button onclick="editMasterTeam('${teamId}')" class="absolute top-1 right-1 text-gray-700 active:text-orange-500 p-1">
//                 <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//                 </svg>
//             </button>

//             <div class="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800">
//                 <span class="text-orange-500 font-black text-xs">${team.teamName.charAt(0)}</span>
//             </div>

//             <div class="flex-1 min-w-0">
//                 <h4 class="text-[10px] font-bold text-gray-100 truncate pr-4">${team.teamName}</h4>
//                 <div class="flex items-center space-x-1">
//                     <span class="text-[7px] font-bold uppercase ${groupText}">${team.currentGroup || 'NA'}</span>
//                     <span class="text-[7px] text-gray-600">|</span>
//                     <span class="text-[7px] font-medium ${isBanned ? 'text-red-500' : 'text-gray-500'} uppercase">
//                         ${isBanned ? 'Banned' : 'Active'}
//                     </div>
//                 </div>
//             </div>
//         </div>`;
//     }
// });

//         container.innerHTML = html || `<p class="col-span-2 text-center py-10 text-gray-600 text-[10px] uppercase tracking-widest font-bold">माहिती सापडली नाही.</p>`;

//     } catch (error) {
//         console.error("[Fatal Error]: loadMasterTeamsList failed", error);
//         container.innerHTML = `<p class="col-span-2 text-center py-10 text-red-500 text-xs uppercase">एरर: डेटा लोड करता आला नाही.</p>`;
//     }
// }

async function loadMasterTeamsList() {
    console.log("%c[Process]: 🔄 Initiating Master Teams List Loading...", "color: #f97316; font-weight: bold;");

    // १. घटकांचे संदर्भ मिळवा
    const container = document.getElementById('masterTeamListContainer');
    const groupFilter = document.getElementById('masterPageGroupFilter')?.value || "All";
    const statusFilter = document.getElementById('masterPageStatusFilter')?.value || "All";
    const searchText = document.getElementById('masterTeamPageSearch')?.value.toLowerCase() || "";

    if (!container) {
        console.error("[Error]: 'masterTeamListContainer' missing from the DOM!");
        return;
    }

    // लोडिंग स्टेट दाखवा
    container.innerHTML = `<div class="col-span-2 text-center py-10 text-orange-500 text-[10px] uppercase tracking-widest animate-pulse">डेटा लोड होत आहे...</div>`;

    try {
        let teamRef = db.collection("master_teams");

        // २. Firestore Query Filters (Group आणि Status दोन्ही एकत्र)
        if (groupFilter !== "All") {
            console.log(`[Query]: Applying Group Filter -> ${groupFilter}`);
            teamRef = teamRef.where("currentGroup", "==", groupFilter);
        }

        if (statusFilter !== "All") {
            console.log(`[Query]: Applying Status Filter -> ${statusFilter}`);
            teamRef = teamRef.where("currentStatus", "==", statusFilter);
        }

        const snapshot = await teamRef.get();
        console.log(`[Data Fetch Success]: Retrieved ${snapshot.size} records from Firestore.`);

        let html = "";
        
        snapshot.forEach(doc => {
            const team = doc.data();
            const teamId = doc.id;
            
            // ३. ग्रुपनुसार कलर्स ठरवा
            let groupBorder = "border-l-gray-600"; 
            let groupBg = "bg-gray-800/10";
            let groupText = "text-gray-400";

            if (team.currentGroup === "A") {
                groupBorder = "border-l-green-500";
                groupBg = "bg-green-500/5";
                groupText = "text-green-500";
            } else if (team.currentGroup === "B") {
                groupBorder = "border-l-blue-500";
                groupBg = "bg-blue-500/5";
                groupText = "text-blue-500";
            } else if (team.currentGroup === "C") {
                groupBorder = "border-l-yellow-500";
                groupBg = "bg-yellow-500/5";
                groupText = "text-yellow-500";
            } else if (team.currentGroup === "Vaysayik") {
                groupBorder = "border-l-purple-500";
                groupBg = "bg-purple-500/5";
                groupText = "text-purple-500";
            }

            // ४. स्टेटस चेक (Banned असेल तर लाल रंगाचा लुक)
            const isBanned = team.currentStatus === "Banned";
            if (isBanned) {
                groupBorder = "border-l-red-600";
                groupBg = "bg-red-600/5";
            }

            // ५. क्लायंट साईड सर्च फिल्टर
            if (team.teamName.toLowerCase().includes(searchText)) {
                
                // 🟢 [FULL CARD CLICK]: येथे पूर्ण कार्डवर 'onclick' लावला आहे जो 'viewTeamPlayers' ओपन करेल
                // 🟢 [CONSOLE LOG]: क्लिक केल्यावर कन्सोलमध्ये हिरव्या रंगात मेसेज प्रिंट होईल
                html += `
                <div onclick="console.log('%c[Master Page Click]: 🟢 Clicked Team Card -> ID: ${teamId}, Name: ${team.teamName}', 'color: #22c55e; font-weight: bold;'); viewTeamPlayers('${teamId}', '')" 
                     class="relative bg-[#111] ${groupBg} border border-gray-800 ${groupBorder} border-l-4 p-2 rounded-xl shadow-md animate-fadeIn flex items-center space-x-2 h-[65px] cursor-pointer active:bg-gray-900 group transition-all">
                    
                    <button onclick="event.stopPropagation(); console.log('[Master Page Click]: ✏️ Pencil Clicked for Team ID: ${teamId}. Blocking propagation.'); editMasterTeam('${teamId}')" 
                            class="absolute top-1 right-1 text-gray-700 hover:text-orange-500 p-1 z-10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>

                    <div class="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800 pointer-events-none">
                        ${team.teamLogo ? 
                            `<img src="${team.teamLogo}" class="w-full h-full object-contain rounded-lg">` : 
                            `<span class="text-orange-500 font-black text-xs font-mono">${team.teamName.charAt(0).toUpperCase()}</span>`
                        }
                    </div>

                    <div class="flex-1 min-w-0 pointer-events-none">
                        <h4 class="text-[10px] font-black text-white uppercase tracking-tighter truncate pr-4 group-hover:text-orange-500 transition-colors leading-tight">${team.teamName}</h4>
                        <div class="flex items-center space-x-1 mt-0.5">
                            <span class="text-[7px] font-bold uppercase ${groupText}">Group ${team.currentGroup || 'NA'}</span>
                            <span class="text-[7px] text-gray-700">|</span>
                            <span class="text-[7px] font-black ${isBanned ? 'text-red-500' : 'text-gray-500'} uppercase">
                                ${isBanned ? 'Banned' : 'Active'}
                            </span>
                        </div>
                    </div>

                </div>`;
            }
        });

        // ८. फायनल HTML इंजेक्ट करा
        container.innerHTML = html || `<p class="col-span-2 text-center py-10 text-gray-600 text-[10px] uppercase tracking-widest font-bold">माहिती सापडली नाही.</p>`;
        console.log("[UI Render]: Master teams list mapping complete.");

    } catch (error) {
        console.error("[Fatal Error]: loadMasterTeamsList execution failed:", error);
        container.innerHTML = `<p class="col-span-2 text-center py-10 text-red-500 text-xs uppercase">एरर: डेटा लोड करता आला नाही.</p>`;
    }
}


// हे फंक्शन आता फक्त प्रॉक्सी म्हणून काम करेल
function filterByStatus(val) {
    console.log("[Filter]: Triggering reload for Status -", val);
    loadMasterTeamsList();
}


// २. फिल्टर बदलण्याचे फंक्शन
function filterMasterTeams(type) {
    // सर्व चिप्सचा कलर बदला (UI Update)
    // तू इथे CSS क्लासेस वापरून ऍक्टिव्ह चिप हायलाईट करू शकतोस
    loadMasterTeamsList(type);
}


/**
 *  edit Teams
 * जेव्हा तू एडिट आयकॉनवर क्लिक करशील, 
 * तेव्हा editMasterTeam हे फंक्शन Firestore मधून त्या टीमचा डेटा आणेल आणि मोडलमध्ये भरेल.
 */

let editingTeamId = null; // सध्या कोणती टीम एडिट करतोय ते ट्रॅक करण्यासाठी

async function editMasterTeam(teamId) {
    console.log(`[Process]: Fetching team data for edit. ID: ${teamId}`);
    editingTeamId = teamId;

    try {
        const doc = await db.collection("master_teams").doc(teamId).get();
        if (!doc.exists) {
            Swal.fire('Error', 'टीमचा डेटा सापडला नाही!', 'error');
            return;
        }

        const team = doc.data();
        console.log("[Data Loaded for Edit]:", team);

        // १. मोडलमधील नेहमीच्या फिल्ड्समध्ये डेटा भरा
        document.getElementById('newMasterTeamName').value = team.teamName || "";
        document.getElementById('newMasterTeamRegId').value = team.regId || ""; 
        document.getElementById('newMasterTeamAssoc').value = team.associationId || "Mumbai Shahar";
        document.getElementById('newMasterTeamArea').value = team.area || "";
        document.getElementById('newMasterTeamPin').value = team.pincode || "";
        document.getElementById('newMasterTeamStatus').value = team.currentStatus || "Active";
        document.getElementById('newMasterTeamGroup').value = team.currentGroup || "A";
        
        // २. [NEW FIELDS] मॅनेजरचा डेटा बॉक्सेसमध्ये लोड करा
        if (document.getElementById('newMasterTeamManagerEmail')) {
            document.getElementById('newMasterTeamManagerEmail').value = team.managerEmail || "";
        }
        if (document.getElementById('newMasterTeamManagerPhone')) {
            document.getElementById('newMasterTeamManagerPhone').value = team.managerPhone || "";
        }

        // ३. मोडलचे टायटल आणि सब-मजकूर बदला (Create ऐवजी Update)
        const modalTitle = document.querySelector('#createMasterTeamModal h3');
        if (modalTitle) modalTitle.innerText = "संघ माहिती अपडेट करा";
        
        const modalSubTitle = document.querySelector('#createMasterTeamModal p');
        if (modalSubTitle && modalSubTitle.innerText.includes("Registration")) {
            modalSubTitle.innerText = "Update Team Settings";
        }

        // ४. बटण टेक्स्ट आणि 'onclick' इव्हेंट बदला
        const actionBtn = document.querySelector('#createMasterTeamModal button[onclick="handleCreateMasterTeam()"]') || 
                          document.querySelector('#createMasterTeamModal button[onclick="handleUpdateMasterTeam()"]');
        
        if (actionBtn) {
            actionBtn.innerText = "अपडेट करा (Update)";
            actionBtn.setAttribute("onclick", "handleUpdateMasterTeam()");
        }

        // ५. मोडल दाखवा
        document.getElementById('createMasterTeamModal').classList.replace('hidden', 'flex');

    } catch (error) {
        console.error("[Error]: editMasterTeam failed", error);
        Swal.fire('Error', 'डेटा लोड करताना चूक झाली.', 'error');
    }
}

/**
 * handleUpdateMasterTeam (डेटा अपडेट करण्यासाठी)
हे फंक्शन बदललेला डेटा Firestore मध्ये सेव्ह करेल.
 */

async function handleUpdateMasterTeam() {
    console.log("--- Update Process Started ---");
    
    if (!editingTeamId) {
        console.error("[Error]: editingTeamId is null or undefined!");
        return;
    }

    // १. मोडलमधून डेटा वाचणे (नवीन मॅनेजर फील्ड्ससह)
    const name = document.getElementById('newMasterTeamName')?.value.trim();
    const regId = document.getElementById('newMasterTeamRegId')?.value.trim();
    const assoc = document.getElementById('newMasterTeamAssoc')?.value;
    const group = document.getElementById('newMasterTeamGroup')?.value;
    const area = document.getElementById('newMasterTeamArea')?.value.trim();
    const pin = document.getElementById('newMasterTeamPin')?.value.trim();
    const status = document.getElementById('newMasterTeamStatus')?.value;
    
    // [NEW] मॅनेजरचा डेटा इनपुटमधून वाचणे
    const managerEmail = document.getElementById('newMasterTeamManagerEmail')?.value.trim() || "";
    const managerPhone = document.getElementById('newMasterTeamManagerPhone')?.value.trim() || "";

    console.log("[Data Collected for Update]:", { name, regId, assoc, group, area, pin, status, managerEmail, managerPhone });

    // २. कडक व्हॅलिडेशन (Strict Validation)
    if (!name) {
        console.warn("[Validation]: Team Name is blank.");
        Swal.fire('नाव आवश्यक!', 'संघाचे नाव रिकामे ठेवता येणार नाही.', 'error');
        return;
    }

    if (!regId) {
        console.warn("[Validation]: Registration ID is blank.");
        Swal.fire('रजिस्ट्रेशन आयडी आवश्यक!', 'कृपया संघाचा अधिकृत नोंदणी क्रमांक (Reg ID) टाका.', 'error');
        return;
    }

    if (!assoc) {
        console.warn("[Validation]: Association not selected.");
        Swal.fire('असोसिएशन निवडा!', 'कृपया असोसिएशन निवडणे अनिवार्य आहे.', 'error');
        return;
    }

    if (!area || !pin) {
        console.warn("[Validation]: Area or Pincode is blank.");
        Swal.fire('माहिती अपूर्ण!', 'परिसर आणि पिनकोड भरणे गरजेचे आहे.', 'error');
        return;
    }

    // [NEW VALIDATION] मॅनेजर मोबाईल नंबर चेक (१० अंकी हवा)
    if (managerPhone && managerPhone.length !== 10) {
        console.warn("[Validation]: Invalid Manager Phone length.");
        Swal.fire('मोबाईल नंबर तपासा!', 'कृपया मॅनेजरचा वैध १० अंकी मोबाईल नंबर टाका.', 'error');
        return;
    }

    // ३. अपडेट करण्यासाठी डेटा ऑब्जेक्ट तयार करणे
    const updatedData = {
        teamName: name,
        regId: regId, // Root level वर अपडेट होईल
        associationId: assoc,
        currentGroup: group,
        area: area,
        pincode: pin,
        currentStatus: status,
        
        // [NEW FIELDS] मॅनेजरचा डेटाबेस रेकॉर्ड अपडेट ठेवा
        managerEmail: managerEmail,
        managerPhone: managerPhone,
        
        updatedAt: new Date().getTime()
    };

    console.log("[Firestore]: Sending update to ID:", editingTeamId, updatedData);

    try {
        // ४. Firestore अपडेट कमांड
        await db.collection("master_teams").doc(editingTeamId).update(updatedData);
        
        console.log("[Success]: Firestore document updated successfully!");

        Swal.fire({
            icon: 'success',
            title: 'अपडेट यशस्वी!',
            text: 'संघाची माहिती आणि मॅनेजर संपर्क सुरक्षितपणे बदलले आहेत.',
            timer: 2000,
            showConfirmButton: false,
            background: '#111',
            color: '#fff'
        });

        closeCreateTeamModal();
        loadMasterTeamsList(); // लिस्ट रिफ्रेश करा

    } catch (error) {
        console.error("[Fatal Error]: Update operation failed!", error);
        Swal.fire('चूक झाली!', 'डेटाबेस अपडेट करताना तांत्रिक अडचण आली.', 'error');
    }
}


/*** Team Profile */
/**
 * यामध्ये आपण दोन मुख्य ग्लोबल व्हेरिएबल्स वापरू 
 * जेणेकरून कोणता संघ आणि कोणत्या टूर्नामेंटमधून आपण आलो आहोत याचा ट्रॅक राहील.
 */

let currentViewingTeamId = null;
let currentViewingTournamentId = null;

// १. मुख्य एंट्री फंक्शन जे बटण क्लिकवर कॉल होईल

async function viewTeamPlayers(teamId, tId) {
    // 🔥 [FRONTEND LIVE LOG]: प्रोफाइल कार्डवर क्लिक करताच आयडीची कुंडली फ्रंटएंडला उघडेल
    console.log("%c========================================", "color: #f97316; font-weight: bold;");
    if (!tId || tId === "") {
        console.log(`%c📂 [प्रोफाइल राउटिंग]: संघ मास्टर यादीमधून (OUTSIDE) प्रोफाइल उघडली.`, "color: #3b82f6; font-weight: bold; font-size: 11px;");
    } else {
        console.log(`%c🏆 [प्रोफाइल राउटिंग]: टूर्नामेंटच्या आतून (INSIDE) प्रोफाइल उघडली. टूर्नामेंट ID: ${tId}`, "color: #a855f7; font-weight: bold; font-size: 11px;");
    }
    console.log(`👉 लक्ष्य संघ आयडी (teamId/regId) : %c"${teamId}"`, "color: #eab308; font-weight: bold; font-size: 12px;");
    console.log("%c========================================", "color: #f97316; font-weight: bold;");

    currentViewingTeamId = teamId;
    currentViewingTournamentId = tId;

    const content = document.getElementById('mainContent') || document.getElementById('app') || document.body; 
    if (!content) return;

    const oldOverlay = document.getElementById('fullTeamProfileOverlay');
    if (oldOverlay) oldOverlay.remove();

    const profileOverlay = document.createElement('div');
    profileOverlay.id = 'fullTeamProfileOverlay';
    profileOverlay.className = "fixed inset-0 z-[150] p-4 bg-black text-white overflow-y-auto space-y-4 pb-12 animate-fadeIn";

    profileOverlay.innerHTML = `
        <div class="flex items-center justify-between p-2.5 bg-[#111] border border-gray-800/80 shadow-lg rounded-2xl mt-2 gap-2">
            <div class="flex items-center gap-3 min-w-0 flex-1">
                <button onclick="closeTeamProfileOverlay('${tId}')" class="text-orange-500 hover:bg-orange-500/10 p-1.5 rounded-full transition-all active:scale-75 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                
                <div id="profHeaderLogo" class="w-9 h-9 bg-gray-950 rounded-full border border-orange-500/30 flex items-center justify-center p-0.5 shrink-0 shadow-inner">
                    <div class="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                
                <div class="min-w-0 flex-1 leading-tight">
                    <h2 id="profTeamNameHeader" class="text-sm font-black text-white uppercase tracking-tighter italic truncate">Loading...</h2>
                    <p id="profTeamAreaHeader" class="text-[8px] text-gray-500 uppercase font-bold tracking-wider truncate mt-0.5">📍 Loading...</p>
                </div>
            </div>

            <div id="profTeamFormHeader" class="flex gap-0.5 shrink-0 bg-gray-950/80 p-1 rounded-lg border border-gray-900"></div>
        </div>

        <div class="px-1 sticky top-0 z-20 bg-black/80 backdrop-blur-md py-1">
            <div class="flex bg-[#111] p-1 rounded-2xl border border-gray-800 shadow-inner overflow-x-auto gap-1">
                <button id="btnTeamTabOverview" onclick="switchTeamProfileTab('overview')" class="flex-1 py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all duration-200 text-gray-500 whitespace-nowrap">
                    Overview
                </button>
                <button id="btnTeamTabPlayers" onclick="switchTeamProfileTab('players')" class="flex-1 py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all duration-200 text-gray-500 whitespace-nowrap">
                    Players
                </button> 
                <button id="btnTeamTabMatches" onclick="switchTeamProfileTab('matches')" class="flex-1 py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all duration-200 text-gray-500 whitespace-nowrap">
                    Matches
                </button>
                <button id="btnTeamTabStats" onclick="switchTeamProfileTab('stats')" class="flex-1 py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all duration-200 text-gray-500 whitespace-nowrap">
                    Statistics
                </button>
            </div>
        </div>

        <div id="teamProfileTabContent" class="min-h-[450px] py-1">
            <div class="flex justify-center py-20 text-orange-500 text-[10px] font-black uppercase tracking-widest animate-pulse">डेटा लोड होत आहे...</div>
        </div>
    `;

    content.appendChild(profileOverlay);

try {
        // १. आधी नेहमीप्रमाणे थेट दस्तऐवज आयडी (Document ID) ने शोधण्याचा प्रयत्न करा
        console.log(`[डेटाबेस शोध]: थेट डॉक्युमेंट आयडीने तपासत आहे: "${teamId}"...`);
        let teamDoc = await db.collection("master_teams").doc(teamId).get();
        let teamData = null;

        if (teamDoc.exists) {
            teamData = teamDoc.data();
            console.log(`%c✅ [थेट सापडला]: दस्तऐवज आयडी थेट मॅच झाला!`, "color: #22c55e; font-weight: bold;");
        } else {
            // 🟢 [अल्टीमेट बॅकअप]: जर थेट सापडला नाही, तर 'regId' फील्डमध्ये तो नंबर शोधून काढा!
            console.log(`%c⚠️ [बॅकअप सक्रिय]: थेट आयडी सापडला नाही. "regId == ${teamId}" साठी क्वेरी मारत आहे...`, "color: #eab308;");
            
            const backupSnapshot = await db.collection("master_teams").where("regId", "==", teamId).get();
            
            if (!backupSnapshot.empty) {
                teamDoc = backupSnapshot.docs[0]; // खरा दस्तऐवज मिळाला
                teamData = teamDoc.data();
                console.log(`%c✅ [क्वेरी यशस्वी]: बॅकअप क्वेरीद्वारे संघ सापडला! खरा दस्तऐवज आयडी -> "${teamDoc.id}"`, "color: #22c55e; font-weight: bold;");
            }
        }

        // २. जर दोन्ही मार्गाने संघ सापडला नाही, तरच एरर दाखवा
        if (!teamData) {
            console.error(`🚨 [ERR]: "master_teams" मध्ये "${teamId}" या आयडीचा किंवा regId चा डेटा कुठेही सापडला नाही!`);
            document.getElementById('teamProfileTabContent').innerHTML = "<p class='text-gray-500 text-xs text-center py-10'>माहिती सापडली नाही.</p>";
            Swal.fire("त्रुटी", `संघाचा डेटा डेटाबेसमध्ये सापडला नाही! (ID: ${teamId})`, "error");
            return;
        }

        // ३. ग्लोबल डेटा सुरक्षित करणे (खऱ्या दस्तऐवज आयडीसह जेणेकरून प्लेयर्स टॅबला अडचण येणार नाही)
        window.currentLoadedTeamData = { 
            docId: teamDoc.id, // हा नेहमी फायरबेसमधील मूळ दस्तऐवजाचा आयडीच राहील (TM_... किंवा रँडम)
            ...teamData 
        }; 

        console.log("%c📊 [ग्लोबल डेटा लॉक]: प्रोफाइल रेंडरिंगसाठी डेटा सज्ज आहे:", "color: #06b6d4; font-weight: bold;", window.currentLoadedTeamData);

        // टॉप हेडरमध्ये डेटा भरणे
        document.getElementById('profTeamNameHeader').innerText = teamData.teamName || "No Name";
        document.getElementById('profTeamAreaHeader').innerText = `📍 ${teamData.area || 'N/A'} | ${teamData.pincode || '------'}`;

        // लोगो सेट करणे
        const logoDiv = document.getElementById('profHeaderLogo');
        if (teamData.teamLogo) {
            logoDiv.innerHTML = `<img src="${teamData.teamLogo}" class="w-full h-full object-contain rounded-full">`;
        } else {
            const firstLetter = teamData.teamName ? teamData.teamName.charAt(0).toUpperCase() : "?";
            logoDiv.innerHTML = `<span class="text-orange-500 font-black text-xs font-mono italic">${firstLetter}</span>`;
        }

        // फॉर्म बॅजेस (W/L)
        const sampleForm = ['W', 'L', 'L', 'W', 'W']; 
        document.getElementById('profTeamFormHeader').innerHTML = sampleForm.map(res => `
            <span class="${res === 'W' ? 'text-green-500' : 'text-red-500'} text-[8px] font-black font-mono px-0.5">${res}</span>
        `).join('');

        // डीफॉल्ट पहिला टॅब 'overview' उघडा
        switchTeamProfileTab('overview');

    } catch (error) {
        console.error("🚨 [Fatal Error in viewTeamPlayers]:", error);
        Swal.fire("त्रुटी", "प्रोफाइल उघडताना तांत्रिक अडचण आली.", "error");
    }
}


// 🟢 नवीन स्मार्ट क्लोजर फंक्शन (बॅक बटणसाठी)
function closeTeamProfileOverlay(tournamentId) {
    console.log(`[Team Profile]: ↩️ Exiting profile view overlay. Tournament ID Context: "${tournamentId}"`);
    const overlay = document.getElementById('fullTeamProfileOverlay');
    if (overlay) overlay.remove(); // १. लेयर स्क्रीनवरून काढून टाका

    // २. जर टूर्नामेंटच्या आतून आला असेल तर टूर्नामेंट पेज रिफ्रेश करा
    if (tournamentId && tournamentId !== "" && tournamentId !== "null" && tournamentId !== "undefined") {
        if (typeof viewTournamentDetails === 'function') {
            viewTournamentDetails(tournamentId);
            setTimeout(() => {
                switchTab('teams', tournamentId);
            }, 300);
        }
    } else {
        // ३. जर बाहेरून आला असेल, तर युजर आधीपासूनच मास्टर लिस्ट पेजवर हजर आहे, फक्त यादी रिफ्रेश करू
        if (typeof loadMasterTeamsList === 'function') {
            loadMasterTeamsList();
        }
    }
}

// २. अंतर्गत टॅब बदलणारे सब-फंक्शन
function switchTeamProfileTab(tabName) {
    const tabs = ['overview', 'players', 'matches', 'stats'];
    
    // टॅब बटन्सचे कलर्स बदलणे
    tabs.forEach(t => {
        const btn = document.getElementById(`btnTeamTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
        if (btn) {
            if (t === tabName) {
                btn.classList.add('bg-orange-600', 'text-white', 'shadow-md');
                btn.classList.remove('text-gray-500');
            } else {
                btn.classList.remove('bg-orange-600', 'text-white', 'shadow-md');
                btn.classList.add('text-gray-500');
            }
        }
    });

    // टॅबनुसार रेंडर फंक्शन कॉल करणे
    if (tabName === 'overview') renderTeamOverviewTab();
    else if (tabName === 'players') renderTeamPlayersTab();
    else if (tabName === 'matches') renderTeamMatchesTab();
    else if (tabName === 'stats') renderTeamStatsTab();
}

//अंतर्गत टॅब्स रेंडर करण्याचे स्पेसिफिक फंक्शन्स (UI Elements)
/**
 * अ) Overview टॅब (गुणोत्तर आणि टॉप परफॉर्मर):
येथे आपण क्रिकेट ॲपसारखा Win/Loss Ratio प्रोग्रेस बार आणि डिझाइन दाखवूया.
 */
async function renderTeamOverviewTab() {
    console.log(`[Team Overview]: Querying dynamic match stats for Team: ${currentViewingTeamId}`);
    const subContent = document.getElementById('teamProfileTabContent');
    if (!subContent) return;

    const teamData = window.currentLoadedTeamData || {};
    const teamId = currentViewingTeamId || "------";
    const tId = currentViewingTournamentId; // टूर्नामेंट आयडी (जर टूर्नामेंटमधून आला असेल तर)

    // लोडिंग स्क्रीन दाखवा
    subContent.innerHTML = `
        <div class="flex justify-center py-16 text-orange-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
            सामने आणि आकडेवारी कॅल्क्युलेट होत आहे...
        </div>`;

    let totalMatches = 0;
    let matchesWon = 0;
    let matchesLost = 0;
    let matchesTied = 0;
    const currentTeamName = teamData.teamName;

    try {
        // ------------------------------------------------------------
        // 🔥 केस १: युजर टूर्नामेंटच्या आतल्या टॅबमधून आला आहे (tId उपलब्ध आहे)
        // ------------------------------------------------------------
        if (tId && tId !== "" && tId !== "null" && tId !== "undefined") {
            console.log(`[Team Overview]: Target -> Only current Tournament matches (${tId})`);
            const matchesSnapshot = await db.collection("tournaments").doc(tId).collection("matches").get();
            
            matchesSnapshot.forEach(doc => {
                const m = doc.data();
                if (m.teamA === currentTeamName || m.teamB === currentTeamName) {
                    if (m.scoreA !== undefined && m.scoreB !== undefined && m.teamA !== "TBD" && m.teamB !== "TBD") {
                        totalMatches++;
                        const isTeamA = (m.teamA === currentTeamName);
                        const scoreThisTeam = isTeamA ? parseInt(m.scoreA) : parseInt(m.scoreB);
                        const scoreOpponent = isTeamA ? parseInt(m.scoreB) : parseInt(m.scoreA);

                        if (scoreThisTeam > scoreOpponent) matchesWon++;
                        else if (scoreThisTeam < scoreOpponent) matchesLost++;
                        else matchesTied++;
                    }
                }
            });
        } 
        // ------------------------------------------------------------
        // 🔥 केस २: युजर बाहेरून 'Team Master' कार्डवरून आला आहे (tId नाहीये)
        // ------------------------------------------------------------
        else {
            console.log(`[Team Overview]: Target -> Global Search across ALL tournaments for team "${currentTeamName}"`);
            
            // १. आधी सर्व टूर्नामेंट्स मिळवा
            const allTournamentsSnapshot = await db.collection("tournaments").get();
            
            // २. प्रत्येक टूर्नामेंटच्या आत जाऊन मॅचेस तपासा (मल्टिपल सब-कलेक्शन क्वेरी)
            for (const tourDoc of allTournamentsSnapshot.docs) {
                const matchesSnapshot = await db.collection("tournaments").doc(tourDoc.id).collection("matches").get();
                
                matchesSnapshot.forEach(doc => {
                    const m = doc.data();
                    if (m.teamA === currentTeamName || m.teamB === currentTeamName) {
                        if (m.scoreA !== undefined && m.scoreB !== undefined && m.teamA !== "TBD" && m.teamB !== "TBD") {
                            totalMatches++;
                            const isTeamA = (m.teamA === currentTeamName);
                            const scoreThisTeam = isTeamA ? parseInt(m.scoreA) : parseInt(m.scoreB);
                            const scoreOpponent = isTeamA ? parseInt(m.scoreB) : parseInt(m.scoreA);

                            if (scoreThisTeam > scoreOpponent) matchesWon++;
                            else if (scoreThisTeam < scoreOpponent) matchesLost++;
                            else matchesTied++;
                        }
                    }
                });
            }
        }

        // ३. टक्केवारीचे कॅल्क्युलेशन
        const winPercentage = totalMatches > 0 ? Math.round((matchesWon / totalMatches) * 100) : 0;
        const lossPercentage = totalMatches > 0 ? Math.round((matchesLost / totalMatches) * 100) : 0;

        // ४. फायनल UI रेंडरिंग (पाणीदार डार्क-ऑरेंज लेआउट)
        subContent.innerHTML = `
        <div class="space-y-4 animate-fadeIn">
            
            <div class="bg-[#111] p-4 rounded-2xl border border-gray-800 shadow-lg">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Win Loss Ratio (सामने गुणोत्तर)</h4>
                    <span class="text-[9px] font-mono text-gray-500 font-bold uppercase">ID: ${teamId.substring(0, 6).toUpperCase()}</span>
                </div>
                <div class="flex justify-between text-xs font-black text-gray-300 mb-2 font-mono">
                    <span class="text-orange-500">WON - ${winPercentage}%</span>
                    <span class="text-gray-500">LOST - ${lossPercentage}%</span>
                </div>
                <div class="w-full h-2.5 bg-gray-950 rounded-full overflow-hidden border border-gray-900 flex shadow-inner">
                    ${totalMatches > 0 ? `
                        <div class="h-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.5)]" style="width: ${winPercentage}%"></div>
                        <div class="h-full bg-gray-800" style="width: ${lossPercentage}%"></div>
                    ` : `
                        <div class="h-full bg-gray-800 w-full"></div>
                    `}
                </div>
            </div>

            <div class="bg-[#111] p-4 rounded-2xl border border-gray-800 shadow-lg">
                <h4 class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Matches Statistics (सामने विहंगावलोकन)</h4>
                <div class="grid grid-cols-4 gap-2 text-center font-mono">
                    <div class="bg-gray-950/60 p-3 rounded-xl border border-gray-900">
                        <p class="text-[8px] text-gray-500 uppercase font-black tracking-wider">Played</p>
                        <p class="text-sm font-black text-white mt-1">${totalMatches}</p>
                    </div>
                    <div class="bg-orange-600/10 p-3 rounded-xl border border-orange-500/10">
                        <p class="text-[8px] text-orange-400 uppercase font-black tracking-wider">Won</p>
                        <p class="text-sm font-black text-orange-500 mt-1">${matchesWon}</p>
                    </div>
                    <div class="bg-gray-950/60 p-3 rounded-xl border border-gray-900">
                        <p class="text-[8px] text-gray-500 uppercase font-black tracking-wider">Lost</p>
                        <p class="text-sm font-black text-red-500 mt-1">${matchesLost}</p>
                    </div>
                    <div class="bg-gray-950/60 p-3 rounded-xl border border-gray-900">
                        <p class="text-[8px] text-gray-500 uppercase font-black tracking-wider">Tied</p>
                        <p class="text-sm font-black text-gray-400 mt-1">${matchesTied}</p>
                    </div>
                </div>
            </div>

            <div class="bg-[#111] p-4 rounded-2xl border border-gray-800 shadow-lg relative overflow-hidden group">
                <h4 class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Top Performer (सर्वोत्कृष्ट खेळाडू)</h4>
                <div class="flex items-center justify-between bg-gray-950/40 p-3 rounded-xl border border-gray-900/60">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-orange-600/10 rounded-full border border-orange-500/20 flex items-center justify-center text-lg shadow-inner">🏆</div>
                        <div>
                            <p class="text-xs font-black text-white uppercase tracking-tighter">माहिती उपलब्ध नाही...</p>
                            <p class="text-[9px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">सामने खेळल्यावर अपडेट होईल</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>`;

    } catch (error) {
        console.error("[Team Overview Dynamic Error]:", error);
        subContent.innerHTML = "<p class='text-center text-red-500 text-xs py-10'>माहिती कॅल्क्युलेट करताना एरर आला.</p>";
    }
}

/**
 * ब) Players टॅब (खेळाडूंची यादी):
संघातील सर्व खेळाडूंची लिस्ट (रोल, मॅचेस आणि पॉईंट्ससह) दाखवण्यासाठी:
 */

// async function renderTeamPlayersTab() {
//     console.log(`[Team Profile]: Fetching players from master_players for Team: ${currentViewingTeamId}`);
//     const subContent = document.getElementById('teamProfileTabContent');
//     if (!subContent) return;

//     // चालू सीझन निश्चित करा (उदा. 2026-2027)
//     const currentSeason = window.currentLoadedTeamData?.season || "2026-2027";

//     // तुझ्या renderTeamPlayersTab मधील बटण सेक्शन फक्त असा बदलून घे:
//     subContent.innerHTML = `
//         <div class="flex justify-between items-center mb-4 px-1">
//             <div>
//                 <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest">खेळाडू यादी (Squad)</p>
//                 <p class="text-[8px] text-orange-500 font-bold font-mono">Season: ${currentSeason}</p>
//             </div>
            
//             <button onclick="openExistingPlayerSelector()" class="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md italic">
//                 + Add / Create Player
//             </button>
//         </div>
//         <div id="teamPlayersContainer" class="space-y-2">
//             <p class="text-gray-500 text-[10px] text-center py-10 uppercase tracking-widest animate-pulse">खेळाडू शोधत आहे...</p>
//         </div>
//     `;

//     try {
//         const container = document.getElementById('teamPlayersContainer');
        
//         // 🟢 'master_players' कलेक्शन् मधून या सीझनचे खेळाडू शोधा
//         const snapshot = await db.collection("master_players")
//             .where(`seasons.${currentSeason}.teamId`, "==", currentViewingTeamId)
//             .get();

//         if (snapshot.empty) {
//             container.innerHTML = `
//                 <div class="text-center py-12 bg-gray-950/40 rounded-2xl border border-gray-900">
//                     <p class="text-gray-600 text-[10px] uppercase font-bold tracking-wider">या सीझनमध्ये अजून एकही खेळाडू जोडलेला नाही.</p>
//                 </div>`;
//             return;
//         }

//         let playersHTML = "";
//         snapshot.forEach(doc => {
//             const p = doc.data();
//             const seasonDetails = p.seasons[currentSeason] || {};
//             const stats = seasonDetails.stats || { matches: 0, raidPoints: 0, tacklePoints: 0 };

//             let skillColor = "bg-orange-500/10 text-orange-500 border-orange-500/20";
//             if (p.skill === "Defender") skillColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
//             if (p.skill === "All Rounder") skillColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";

//             playersHTML += `
//             <div class="bg-[#111] p-3 rounded-2xl border border-gray-800 flex justify-between items-center shadow-md">
//                 <div class="flex items-center gap-3 min-w-0">
//                     <div class="w-9 h-9 bg-gray-950 rounded-full border border-gray-800 flex items-center justify-center font-black text-xs text-gray-400 uppercase shrink-0">
//                         ${p.photoURL ? `<img src="${p.photoURL}" class="w-full h-full object-cover rounded-full">` : p.name.charAt(0)}
//                     </div>
//                     <div class="min-w-0">
//                         <p class="text-xs font-black text-white uppercase tracking-tighter truncate leading-tight">${p.name}</p>
//                         <div class="flex items-center gap-1.5 mt-0.5">
//                             <span class="text-[7px] font-mono font-bold text-gray-500 bg-gray-950 px-1 py-0.2 rounded border border-gray-900">Reg: ${seasonDetails.registerId || 'N/A'}</span>
//                             <span class="text-[7px] border px-1 py-0.2 rounded font-black uppercase tracking-wide ${skillColor}">${p.skill}</span>
//                         </div>
//                     </div>
//                 </div>
                
//                 <div class="text-right font-mono shrink-0 flex gap-4 items-center">
//                     <div class="text-center">
//                         <p class="text-[10px] text-white font-black leading-none">${stats.matches || 0}</p>
//                         <p class="text-[7px] text-gray-600 font-bold uppercase tracking-tighter mt-0.5">Mat</p>
//                     </div>
//                     <div class="text-center min-w-8">
//                         <p class="text-[10px] text-orange-500 font-black leading-none">${(stats.raidPoints || 0) + (stats.tacklePoints || 0)}</p>
//                         <p class="text-[7px] text-gray-600 font-bold uppercase tracking-tighter mt-0.5">Pts</p>
//                     </div>
//                 </div>
//             </div>`;
//         });

//         container.innerHTML = playersHTML;

//     } catch (err) {
//         console.error("Error loading master players into squad:", err);
//     }
// }
/**
 * Player Profile page open
 */

async function renderTeamPlayersTab() {
    console.log(`[Team Profile]: Fetching players from master_players for Team: ${currentViewingTeamId}`);
    const subContent = document.getElementById('teamProfileTabContent');
    if (!subContent) return;

    // चालू सीझन निश्चित करा (उदा. 2026-2027)
    const currentSeason = window.currentLoadedTeamData?.season || "2026-2027";

    subContent.innerHTML = `
        <div class="flex justify-between items-center mb-4 px-1">
            <div>
                <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest">खेळाडू यादी (Squad)</p>
                <p class="text-[8px] text-orange-500 font-bold font-mono">Season: ${currentSeason}</p>
            </div>
            
            <button onclick="openExistingPlayerSelector()" class="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md italic">
                + Add / Create Player
            </button>
        </div>
        <div id="teamPlayersContainer" class="space-y-2">
            <p class="text-gray-500 text-[10px] text-center py-10 uppercase tracking-widest animate-pulse">खेळाडू शोधत आहे...</p>
        </div>
    `;

    try {
        const container = document.getElementById('teamPlayersContainer');
        
        // 'master_players' कलेक्शन् मधून या सीझनचे खेळाडू शोधा
        const snapshot = await db.collection("master_players")
            .where(`seasons.${currentSeason}.teamId`, "==", currentViewingTeamId)
            .get();

        if (snapshot.empty) {
            container.innerHTML = `
                <div class="text-center py-12 bg-gray-950/40 rounded-2xl border border-gray-900">
                    <p class="text-gray-600 text-[10px] uppercase font-bold tracking-wider">या सीझनमध्ये अजून एकही खेळाडू जोडलेला नाही.</p>
                </div>`;
            return;
        }

        let playersHTML = "";
        snapshot.forEach(doc => {
            // 🚨 [BUG PREVENTER]: फायरबेसमधून doc.id हाच खेळाडूचा अधिकृत pId असतो, तो आधी सुरक्षित मिळवू
            const pId = doc.id; 
            const p = doc.data();
            const seasonDetails = p.seasons[currentSeason] || {};
            const stats = seasonDetails.stats || { matches: 0, raidPoints: 0, tacklePoints: 0 };

            let skillColor = "bg-orange-500/10 text-orange-500 border-orange-500/20";
            if (p.skill === "Defender") skillColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
            if (p.skill === "All Rounder") skillColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";

            // 🎯 [💥 THE MASTER INTERFACE CONNECT]: मुख्य कार्डच्या सुरुवातीला आपण onclick जोडला आहे!
            // १. तो 'profile' फाईल व्ह्यू लोड करेल.
            // २. १५० मिलीसेकंदानंतर या खेळाडूचा pId पास करून त्याचा सखोल अनालिसिस रिपोर्ट रेंडर करेल.
            playersHTML += `
            <div onclick="loadPage('profile'); setTimeout(() => { initPlayerProfileView('${pId}'); }, 150);" 
                 class="bg-[#111] hover:bg-zinc-900/60 p-3 rounded-2xl border border-gray-800 flex justify-between items-center shadow-md cursor-pointer active:scale-[0.98] transition-all">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 bg-gray-950 rounded-full border border-gray-800 flex items-center justify-center font-black text-xs text-gray-400 uppercase shrink-0">
                        ${p.photoURL ? `<img src="${p.photoURL}" class="w-full h-full object-cover rounded-full">` : p.name.charAt(0)}
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs font-black text-white uppercase tracking-tighter truncate leading-tight">${p.name}</p>
                        <div class="flex items-center gap-1.5 mt-0.5">
                            <span class="text-[7px] font-mono font-bold text-gray-500 bg-gray-950 px-1 py-0.2 rounded border border-gray-900">Reg: ${seasonDetails.registerId || 'N/A'}</span>
                            <span class="text-[7px] border px-1 py-0.2 rounded font-black uppercase tracking-wide ${skillColor}">${p.skill}</span>
                        </div>
                    </div>
                </div>
                
                <div class="text-right font-mono shrink-0 flex gap-4 items-center">
                    <div class="text-center">
                        <p class="text-[10px] text-white font-black leading-none">${stats.matches || 0}</p>
                        <p class="text-[7px] text-gray-600 font-bold uppercase tracking-tighter mt-0.5">Mat</p>
                    </div>
                    <div class="text-center min-w-8">
                        <p class="text-[10px] text-orange-500 font-black leading-none">${(stats.raidPoints || 0) + (stats.tacklePoints || 0)}</p>
                        <p class="text-[7px] text-gray-600 font-bold uppercase tracking-tighter mt-0.5">Pts</p>
                    </div>
                </div>
            </div>`;
        });

        container.innerHTML = playersHTML;

    } catch (err) {
        console.error("Error loading master players into squad:", err);
    }
}

/**
 * क) Matches टॅब (या संघाचे सामने):
या संघाने खेळलेले किंवा आगामी फिक्स्चर्स:
 */

function renderTeamMatchesTab() {
    const subContent = document.getElementById('teamProfileTabContent');
    subContent.innerHTML = `
    <div class="space-y-2 animate-fadeIn">
        <p class="text-[9px] text-gray-500 uppercase font-black tracking-widest px-1">सामने (Team Matches)</p>
        <div class="bg-[#111] p-3 rounded-xl border border-gray-800 text-center py-10 text-gray-500 text-xs">
            या स्पर्धेत अजून सामने खेळलेले नाहीत.
        </div>
    </div>`;
}

/**
 * ड) Stats टॅब (एकूण आकडेवारी):
संघाचे एकूण रेड पॉईंट्स, टॅकल पॉईंट्स, ऑल-आउट्स काउंट्स इत्यादी:
 */

function renderTeamStatsTab() {
    const subContent = document.getElementById('teamProfileTabContent');
    subContent.innerHTML = `
    <div class="bg-[#111] p-4 rounded-2xl border border-gray-800 shadow-lg animate-fadeIn space-y-3">
        <h4 class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Team Performance Stats</h4>
        <div class="grid grid-cols-2 gap-2 text-center text-xs">
            <div class="bg-gray-900/50 p-3 rounded-xl border border-gray-800/60">
                <p class="text-[8px] text-gray-500 uppercase font-bold">Total Raid Pts</p>
                <p class="text-sm font-black text-white font-mono mt-0.5">245</p>
            </div>
            <div class="bg-gray-900/50 p-3 rounded-xl border border-gray-800/60">
                <p class="text-[8px] text-gray-500 uppercase font-bold">Total Tackle Pts</p>
                <p class="text-sm font-black text-orange-500 font-mono mt-0.5">112</p>
            </div>
        </div>
    </div>`;
}


function exitTeamProfileAndReturn(tournamentId) {
    console.log(`[Team Profile]: ↩️ Exiting profile screen. Returning to Tournament: ${tournamentId}`);
    
    // १. जर आपण मुख्य 'mainContent' ओव्हरराईट केला असेल, तर पुन्हा टूर्नामेंट डिटेल्सचे पेज लोड करू
    if (typeof viewTournamentDetails === 'function') {
        viewTournamentDetails(tournamentId);
        
        // २. पेज लोड झाल्यावर थोडा वेळ (delay) देऊन 'teams' टॅबवर स्विच करू जेणेकरून युजर तिथेच येईल जिथून गेला होता
        setTimeout(() => {
            console.log("[Team Profile]: Auto switching back to 'teams' tab.");
            switchTab('teams', tournamentId);
        }, 300);
        
    } else {
        console.warn("viewTournamentDetails function not found. Falling back to switchTab.");
        switchTab('teams', tournamentId);
    }
}

async function openExistingPlayerSelector() {
    console.log("[Player Master]: Opening selector window for existing players...");
    const modal = document.getElementById('existingPlayerSelectorModal');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const listContainer = document.getElementById('masterPlayerSelectionList');
    listContainer.innerHTML = `<p class="text-gray-500 text-[9px] text-center py-10 uppercase tracking-widest animate-pulse">डेटाबेस तपासत आहे...</p>`;

    try {
        const currentSeason = window.currentLoadedTeamData?.season || "2026-2027";
        
        // १. सर्व मास्टर खेळाडू गोळा करा
        const snapshot = await db.collection("master_players").get();
        window.allAvailableMasterPlayers = []; // सर्चसाठी ग्लोबल सेव्ह करू

        let html = "";
        snapshot.forEach(doc => {
            const p = doc.data();
            const pId = doc.id;

            // जर खेळाडू या चालू सीझनमध्ये आधीच कोणत्यातरी संघात खेळत असेल तर त्याला यादीत दाखवायचे नाही
            const isAlreadyAssigned = p.seasons && p.seasons[currentSeason] && p.seasons[currentSeason].teamId;

            if (!isAlreadyAssigned) {
                window.allAvailableMasterPlayers.push({ id: pId, ...p });
                
// openExistingPlayerSelector मधील लूपच्या आतला फक्त हा HTML बदला:
html += `
<div class="master-player-row bg-[#111] p-2.5 rounded-xl border border-gray-800/60 flex justify-between items-center hover:border-gray-700 transition-all gap-2" data-name="${p.name.toLowerCase()}" data-mobile="${p.mobile || ''}">
    <div class="min-w-0 flex-1 leading-tight">
        <p class="text-xs font-bold text-gray-200 uppercase tracking-tight truncate">${p.name}</p>
        <p class="text-[8px] text-gray-500 uppercase font-mono font-bold mt-0.5">📞 ${p.mobile || '------'} | ${p.skill || 'NA'}</p>
    </div>
    <button onclick="linkPlayerToCurrentTeam('${pId}', '${p.name}')" class="bg-orange-600 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg active:scale-90 transition-all shrink-0 italic">
        निवडा
    </button>
</div>`;
            }
        });

        listContainer.innerHTML = html || `<p class="text-gray-600 text-[9px] text-center py-10 uppercase font-bold">कोणताही मोकळा खेळाडू उपलब्ध नाही.</p>`;

    } catch (err) {
        console.error("Error fetching master players selector:", err);
    }
}

function closeExistingPlayerSelector() {
    const modal = document.getElementById('existingPlayerSelectorModal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        document.getElementById('searchMasterPlayerInput').value = "";
    }
}

// 🔥 सिलेक्ट केलेल्या आधीच्या खेळाडूला चालू संघात आणि चालू सीझनमध्ये अपडेट (Link) करणे
async function linkPlayerToCurrentTeam(playerId, playerName) {
    const currentSeason = window.currentLoadedTeamData?.season || "2026-2027";
    const teamId = currentViewingTeamId;
    const teamName = window.currentLoadedTeamData?.teamName || "Unknown Team";
    
    const registerId = prompt(`✍️ खेळाडू "${playerName}" साठी या सीझनचा (Season: ${currentSeason}) Register ID टाका:`);
    if (!registerId || registerId.trim() === "") {
        alert("🚨 नोंदणी रद्द केली! Register ID अनिवार्य आहे.");
        return;
    }

    console.log(`[Link Player]: Linking Master Player ${playerId} to Team ${teamId} for Season ${currentSeason}`);

    try {
        // master_players मधील त्या खेळाडूच्या दस्तऐवजात चालू सीझनचा ऑब्जेक्ट अपडेट करा
        await db.collection("master_players").doc(playerId).update({
            [`seasons.${currentSeason}`]: {
                teamId: teamId,
                teamName: teamName,
                registerId: registerId.trim().toUpperCase(),
                stats: { matches: 0, raidPoints: 0, tacklePoints: 0, superRaids: 0, superTackles: 0 }
            }
        });

        alert(`🎉 "${playerName}" यशस्वीरित्या या संघात जोडला गेला आहे!`);
        closeExistingPlayerSelector();
        renderTeamPlayersTab(); // यादी लाइव्ह रिफ्रेश

    } catch (err) {
        console.error("Error linking player to team:", err);
        alert("🚨 तांत्रिक एरर आला, खेळाडू लिंक करता आला नाही.");
    }
}

function filterMasterPlayersForSelection() {
    const searchText = document.getElementById('searchMasterPlayerInput').value.toLowerCase();
    const rows = document.querySelectorAll('.master-player-row');
    
    rows.forEach(row => {
        const name = row.getAttribute('data-name') || '';
        const mobile = row.getAttribute('data-mobile') || '';
        
        if (name.includes(searchText) || mobile.includes(searchText)) {
            row.style.setProperty('display', 'flex', 'important');
        } else {
            row.style.setProperty('display', 'none', 'important');
        }
    });
}


// १. नवीन खेळाडू नोंदणीचा मोडल उघडणे
// १. मोडल उघडतानाची सेटिंग (डीफॉल्ट तारीख ०१/०१/२००० दिसेल)

function openNewPlayerModal() {
    console.log("[प्लेअर मास्टर]: 📂 नवीन खेळाडू नोंदणी मोडल उघडत आहे...");
    const modal = document.getElementById('newPlayerModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // स्क्रीनवर थेट आपल्या पद्धतीने कडक तारीख दिसणार
        const dobInput = document.getElementById('pDob');
        if (dobInput && !dobInput.value) {
            dobInput.value = "01/01/2000";
            console.log("[कॅलेंडर]: 📅 स्क्रीनवर डीफॉल्ट तारीख सेट केली -> 01/01/2000");
        }
    }
}

// २. कॅलेंडरमधून निवडलेली तारीख थेट DD/MM/YYYY मध्ये इनपुट बॉक्समध्ये भरणे
function syncDateToText(rawDate) {
    if (!rawDate) return;
    
    const parts = rawDate.split('-'); // YYYY-MM-DD ला तोडणे
    if (parts.length === 3) {
        const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY बनवणे
        document.getElementById('pDob').value = formattedDate;
        console.log(`%c[कॅलेंडर निवड]: 🎯 युझरने कॅलेंडरमधून तारीख निवडली -> ${formattedDate}`, "color: #22c55e; font-weight: bold;");
    }
}

// ३. युझरने स्वतः कीपॅडने टाईप केल्यास आपोआप योग्य जागी स्लॅश (/) पाडणे
function formatDateInput(input) {
    let v = input.value.replace(/\D/g, ''); // फक्त आकडे ठेवा
    if (v.length > 2 && v.length <= 4) {
        input.value = `${v.slice(0, 2)}/${v.slice(2)}`;
    } else if (v.length > 4) {
        input.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)}`;
    } else {
        input.value = v;
    }
}

// २. नवीन खेळाडू नोंदणीचा मोडल बंद करणे (आणि फॉर्म रिसेट करणे)
function closeNewPlayerModal() {
    console.log("[Player Master]: ❌ Closing New Player Modal & Resetting Form.");
    const modal = document.getElementById('newPlayerModal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        
        // फॉर्ममधील सर्व इनपुट्स रिकामे करा
        document.getElementById('pName').value = "";
        document.getElementById('pRegisterId').value = "";
        document.getElementById('pMobile').value = "";
        document.getElementById('pDob').value = "";
        document.getElementById('pAadhar').value = "";
        document.getElementById('pWeight').value = "";
        document.getElementById('pEmail').value = "";
    }
}

/***
 * ४ अंकी पूर्ण अल्फा-न्यूमेरिक (Letters + Numbers Mix) चा निर्णय एकदम नंबर वन आहे! 
 * याचा सर्वात मोठा फायदा म्हणजे आयडी दिसायला खूप मोठा होत नाही (मोबाईल स्क्रीनवर कॉम्पॅक्ट दिसतो), 
 * पण बॅकएंडला थेट १६ लाख आणि ८० हजार खेळाडूंचे युनिक आयडी बनवण्याची ताकद याला मिळते. 
 * त्यामुळे भविष्यात महाराष्ट्रातील कानाकोपऱ्यातून कितीही खेळाडू ॲपवर आले, तरी आयडी संपणार नाहीत!
 * उदा. खेळाडूचा मास्टर आयडी दिसायला असा कडक आणि प्रोफेशनल असेल: 
 * RX4A9Z, RXK2W8, RXX7P3 (RaidX चे 'RX' + ४ रँडम अल्फा-न्यूमेरिक अक्षरे).
 * generateMasterPlayerId
 */

// ४ अंकी कडक अल्फा-न्यूमेरिक आयडी जनरेट करणारे फंक्शन
function generateMasterPlayerId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPart = "";
    
    // ४ वेळा रँडम अक्षरे किंवा आकडे निवडून एकत्र करणे
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        randomPart += chars.charAt(randomIndex);
    }
    
    // 'RX' (RaidX) जोडून फायनल आयडी बनवणे (उदा. RX5H9K)
    return `RX${randomPart}`;
}


// ३. फॉर्ममधील डेटा गोळा करून 'master_players' मध्ये सेव्ह करणे
async function saveNewPlayerToMaster() {
    console.log("%c[Player Master]: 💾 Saving new player directly with Custom Unique ID...", "color: #3b82f6; font-weight: bold;");

    // फॉर्ममधून डेटा गोळा करा
    const name = document.getElementById('pName')?.value.trim();
    const registerId = document.getElementById('pRegisterId')?.value.trim().toUpperCase();
    const mobile = document.getElementById('pMobile')?.value.trim();
    const dob = document.getElementById('pDob')?.value.trim() || "";
    const aadharLast4 = document.getElementById('pAadhar')?.value.trim();
    const weight = document.getElementById('pWeight')?.value.trim();
    const skill = document.getElementById('pSkill')?.value;
    const role = document.getElementById('pRole')?.value;
    const email = document.getElementById('pEmail')?.value.trim().toLowerCase();

    // आवश्यक फील्ड्सचे व्हॅलिडेशन
    if (!name || !registerId) {
        Swal.fire("माहिती अपूर्ण!", "कृपया खेळाडूचे नाव आणि सीझन Register ID अनिवार्यपणे भरा!", "warning");
        return;
    }

    // 🟢 [फिक्स १]: प्रोफाइल उघडताना आपण सेव्ह केलेला खरोखरचा दस्तऐवज आयडी (docId -> TM_...) अचूक ओढणे
    const teamId = window.currentLoadedTeamData?.docId || currentViewingTeamId; 
    const teamName = window.currentLoadedTeamData?.teamName || "Unknown Team";
    const currentSeason = window.currentLoadedTeamData?.season || "2026-2027"; 

    if (!teamId || teamId === "UNKNOWN") {
        Swal.fire("त्रुटी", "चालू संघाचा युनिक आयडी सापडला नाही! खेळाडू जोडता येणार नाही.", "error");
        return;
    }

    if (dob && dob.length !== 10) {
        Swal.fire("तारीख चुकीची!", "कृपया जन्म तारीख पूर्ण भरा किंवा कॅलेंडरमधून निवडा (DD/MM/YYYY)!", "warning");
        return;
    }

    // 🟢 [फिक्स २]: सिस्टीमने तयार केलेला ४ अंकी युनिक अल्फा-न्यूमेरिक आयडी (उदा. RXO0QN)
    const generatedId = generateMasterPlayerId();

    // फायरस्टोअरसाठी ऑब्जेक्ट तयार करा
    const playerData = {
        playerID: generatedId, // खेळाडूचा आयुष्यभराचा युनिक सिस्टीम आयडी
        name: name,
        email: email || "",
        mobile: mobile || "",
        dob: dob || "",
        aadharLast4: aadharLast4 || "",
        weight: weight ? parseInt(weight) : null,
        skill: skill,
        role: role,
        status: "Approved", 
        createdAt: new Date().getTime(), // सर्व्हर टाईमस्टॅम्प ऐवजी सुटसुटीत टाईमस्टॅम्प
        seasons: {
            [currentSeason]: {
                teamId: teamId,       // 🔐 इथे आता अचूक "TM_JAY_BHARAT_892" लॉक होईल
                teamName: teamName,
                registerId: registerId,
                stats: { matches: 0, raidPoints: 0, tacklePoints: 0, superRaids: 0, superTackles: 0 }
            }
        }
    };

    // 🔍 [लाइव्ह फ्रंटएंड चेक]: डेटाबेसकडे रवाना होण्यापूर्वी फ्रंटएंडलाच कन्सोलमध्ये सर्व व्हॅल्यूज चोख दिसतील
    console.log("%c==================================================", "color: #22c55e; font-weight: bold;");
    console.log(`%c💾 [मास्टर खेळाडू नोंदणी]: नवीन खेळाडू डेटाबेसत जमा होत आहे...`, "color: #22c55e; font-weight: bold; font-size: 11px;");
    console.log(`👉 खेळाडू युनिक ID : %c"${generatedId}"`, "color: #3b82f6; font-weight: bold; font-size: 12px;");
    console.log(`👉 खेळाडूचे नाव    : "${name}"`);
    console.log(`👉 लिंक केलेला संघ : "${teamName}" (ID: ${teamId})`);
    console.log("%c==================================================", "color: #22c55e; font-weight: bold;");

    try {
        if (email) {
            const emailCheck = await db.collection("master_players").where("email", "==", email).get();
            if (!emailCheck.empty) {
                Swal.fire("आधीच नोंदणीकृत!", "या ईमेल आयडीचा खेळाडू आधीच नोंदणीकृत आहे!", "error");
                return;
            }
        }

        // 🟢 [फिक्स ३]: .add() चा जुना रँडम रस्ता बंद करून स्वतःच्या डॉक्युमेंट आयडीने .doc().set() करणे!
        await db.collection("master_players").doc(generatedId).set(playerData);
        
        console.log(`%c✅ [डेटाबेस यशस्वी]: खेळाडू सुरक्षितपणे जतन झाला. डॉक्युमेंट आयडी -> "${generatedId}"`, "color: #22c55e; font-weight: bold;");
        
        Swal.fire({
            icon: 'success',
            title: 'नोंदणी यशस्वी!',
            text: `खेळाडू "${name}" (ID: ${generatedId}) यशस्वीरित्या या संघात जोडला गेला आहे.`,
            timer: 2000,
            showConfirmButton: false
        });
        
        closeNewPlayerModal();
        
        if (typeof renderTeamPlayersTab === 'function') {
            renderTeamPlayersTab();
        }

    } catch (error) {
        console.error("🚨 [खेळाडू सेव्हिंग क्रिटिकल एरर]:", error);
        Swal.fire("त्रुटी", "तांत्रिक अडचणीमुळे खेळाडू सेव्ह करता आला नाही.", "error");
    }
}

/** */

// 🔍 १. खेळाडूंची नावे फ्रंटएंडलाच लाईव्ह फिल्टर करण्याचे कडक फंक्शन
function filterSquadPlayersLive() {
    const searchText = document.getElementById('squadPlayerSearch').value.toLowerCase().trim();
    
    // सध्या Team A चालू आहे की Team B, त्यानुसार योग्य कंटेनर निवडा
    const activeTabA = !document.getElementById('playerListA').classList.contains('hidden');
    const containerId = activeTabA ? 'playerListA' : 'playerListB';
    const container = document.getElementById(containerId);
    
    if (!container) return;

    // कंटेनरच्या आतील सर्व खेळाडूंचे लेबल कार्ड्स गोळा करा
    const playerLabels = container.querySelectorAll('label');
    let matchedCount = 0;

    playerLabels.forEach(label => {
        // लेबल कार्डच्या आत असलेला खेळाडूच्या नावाचा पॅराग्राफ शोधा
        const playerNameEl = label.querySelector('p.text-xs');
        if (playerNameEl) {
            const playerName = playerNameEl.innerText.toLowerCase();
            
            // जर नाव सर्च टेक्स्टशी मॅच होत असेल तर दाखवा, नाहीतर लपवा
            if (playerName.includes(searchText)) {
                label.style.display = 'flex';
                matchedCount++;
            } else {
                label.style.display = 'none';
            }
        }
    });

    console.log(`[सर्च फिल्टर]: "${searchText}" शोधत आहे... एकूण मॅच झाले: ${matchedCount}`);
}

// 🧼 २. सर्च बार रिसेट आणि यादी पूर्ववत करण्याचे फंक्शन
function clearSquadSearch() {
    const searchInput = document.getElementById('squadPlayerSearch');
    if (searchInput) searchInput.value = "";
    
    // दोन्ही लिस्ट मधील सर्व लेबल्स पुन्हा 'flex' (Visible) करा
    ['playerListA', 'playerListB'].forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            const labels = container.querySelectorAll('label');
            labels.forEach(label => label.style.display = 'flex');
        }
    });
    
    console.log("[सर्च रिसेट]: खेळाडूंची पूर्ण यादी पुन्हा पूर्ववत केली.");
}


/* ==========================================
    Live Action / MATCH SUMMARY Calculation
   ========================================== */
// calculateTopStats() (लाईव्ह ओव्हरलेसाठी)
//हा तुझ्या ओव्हरलेवरील दोन आयडी (liveTopRaiders आणि liveTopDefenders) ऑटोमॅटिक अपडेट करेल.

// =========================================================================
// 📊 अद्ययावत (UPDATED) calculateTopStats - सर्व बोनस आणि टॅकल नियमांसह 🚀
// =========================================================================
function calculateTopStats() {
    const rEl = document.getElementById('liveTopRaiders');
    const dEl = document.getElementById('liveTopDefenders');
    if (!rEl && !dEl) return;

    console.log("%c📊 [TOP STATS ENGINE START] ----------------------------------", "color: #ff007f; font-weight: bold; font-size: 12px;");

    if (!window.activeRaidsList || window.activeRaidsList.length === 0) {
        if (rEl) rEl.innerHTML = "No Data"; 
        if (dEl) dEl.innerHTML = "No Data"; 
        return;
    }

    let raiderScores = {}; 
    let defenderScores = {};

    window.activeRaidsList.forEach((raid, index) => {
        const resultUpper = raid.result ? raid.result.toUpperCase() : "";
        const points = Number(raid.points) || 0;
        let rTeam = raid.team;
        let dTeam = (rTeam === 'A') ? 'B' : 'A';

        let cleanRaider = raid.raiderName ? raid.raiderName.replace(/#\d+\s+/, '').split('[')[0].split('(')[0].trim() : "UNKNOWN";

        // 🏃‍♂️ १. रायडर पॉइंट्स कॅल्क्युलेशन
        if (cleanRaider !== "OFFICIALS" && !resultUpper.includes("ALL OUT") && !resultUpper.includes("TECHNICAL")) {
            if (!raiderScores[cleanRaider]) raiderScores[cleanRaider] = 0;
            
            if (resultUpper === "TOUCH POINT" || resultUpper === "TOUCH") {
                raiderScores[cleanRaider] += points;
            } 
            else if (resultUpper === "BONUS + TOUCH") {
                raiderScores[cleanRaider] += points;
            } 
            else if (resultUpper.includes("BONUS")) {
                raiderScores[cleanRaider] += 1; 
            }
        }

        // 🛡️ २. डिफेंडर पॉइंट्स कॅल्क्युलेशन
        if (raid.details && (resultUpper.includes("TACKLE") || resultUpper.includes("SUPER TACKLE"))) {
            let detailsText = raid.details.toUpperCase();
            if (detailsText.includes("CAUGHT BY")) {
                let defenderPart = raid.details.split(/caught by/i)[1];
                if (defenderPart) {
                    defenderPart.split(',').forEach(defRaw => {
                        let cleanDef = defRaw.replace(/#\d+\s+/, '').split('[')[0].split('(')[0].trim();
                        
                        let actualDefTeam = dTeam;
                        let defNoMatch = defRaw.match(/\d+/);
                        let dNo = defNoMatch ? parseInt(defNoMatch[0]) : null;
                        
                        if (dNo !== null) {
                            actualDefTeam = (dNo >= 21) ? 'B' : 'A';
                        } else {
                            if (defRaw.includes("[A]") || defRaw.includes("(A)")) actualDefTeam = 'A';
                            if (defRaw.includes("[B]") || defRaw.includes("(B)")) actualDefTeam = 'B';
                        }

                        if (cleanDef && cleanDef !== cleanRaider && cleanDef !== "DEFENDER") {
                            if (!defenderScores[cleanDef]) defenderScores[cleanDef] = 0;
                            defenderScores[cleanDef] += 1;
                        }
                    });
                }
            }
        }
    });

    let topR = Object.keys(raiderScores).map(n => ({ name: n, score: raiderScores[n] })).sort((a,b) => b.score - a.score);
    let topD = Object.keys(defenderScores).map(n => ({ name: n, score: defenderScores[n] })).sort((a,b) => b.score - a.score);

    // 🚨 [THE ULTIMATE INNERHTML FIX]: एकाखाली एक कडक रेंडर करण्यासाठी <br> आणि innerHTML चा परफेक्ट मेळ! 🦾
    let finalRaiderText = topR.length > 0 ? topR.slice(0, 2).map(r => `${r.name}: ${r.score}`).join('<br>') : "No Data";
    let finalDefenderText = topD.length > 0 ? topD.slice(0, 2).map(d => `${d.name}: ${d.score}`).join('<br>') : "No Data";

    // इथल्या जुन्या .innerText ओळी आपण .innerHTML ने बदलल्या आहेत!
    if (rEl) rEl.innerHTML = finalRaiderText;
    if (dEl) dEl.innerHTML = finalDefenderText;

    console.log(`%c🚀 [UI HTML RENDER COMPLETE]`, "color: #10b981; font-weight: bold;");
    console.log("%c📊 [TOP STATS ENGINE END] ------------------------------------", "color: #ff007f; font-weight: bold;");
}

/**
 * buildMatchSummaryTab() (खेळाडूंची कुंडली काढण्यासाठी)
जेव्हा युझर मोडलमधील 'Match Summary' टॅबवर क्लिक करेल, 
तेव्हा हा संपूर्ण ॲनालिसिस डेटा काढून HTML चे सुंदर टेबल बनवणारे हे मुख्य फंक्शन:
🛠️ फक्त एक छोटा 'Null-Safe' सुधारणा (Crash Protection)
जरी कोड परफेक्ट असला, तरी प्रेक्षकांच्या बाजूने किंवा रिफ्रेश झाल्यावर btnSubTabTeamA आणि btnSubTabTeamB हे DOM एलिमेंट्स स्क्रीनवर हजर नसतील, तर कोड मधेच अडकून पुढचे टेबल रेंडर करायचे थांबवू शकतो (Crash).
 */

// function buildMatchSummaryTab() {
//     const containerA = document.getElementById('teamASummaryTableContainer');
//     const containerB = document.getElementById('teamBSummaryTableContainer');
//     if (!containerA || !containerB) return;

//     console.log("%c📊 [ADVANCED ANALYTICS ENGINE START] ----------------------------------", "color: #ff007f; font-weight: bold; font-size: 12px;");

//     if (!window.activeRaidsList || window.activeRaidsList.length === 0) {
//         let emptyHtml = `<div class="text-center p-8 text-gray-500 font-bold">अजून एकही領 रेड झालेली नाही!</div>`;
//         containerA.innerHTML = emptyHtml; containerB.innerHTML = emptyHtml; return;
//     }

//     let stats = { A: {}, B: {} };

//     function initStatsObj(team, name) {
//         if (!stats[team][name]) {
//             stats[team][name] = { R: 0, TP: 0, B: 0, E: 0, RO: 0, DO: 0, TK: 0, STK: 0 };
//         }
//     }

//     function detectRealTeamOfPlayer(fullName, defaultTeam) {
//         let nameUpper = fullName.toUpperCase();
//         if (nameUpper.includes("[A]") || nameUpper.includes("(A)")) return 'A';
//         if (nameUpper.includes("[B]") || nameUpper.includes("(B)")) return 'B';
        
//         let jerseyMatch = nameUpper.match(/\d+/);
//         if (jerseyMatch) {
//             let jNo = parseInt(jerseyMatch[0]);
//             return (jNo >= 21) ? 'B' : 'A';
//         }
//         return defaultTeam;
//     }

//     window.activeRaidsList.forEach((raid, idx) => {
//         const resultUpper = raid.result ? raid.result.toUpperCase() : "";
//         const points = Number(raid.points) || 0;

//         let cleanRaider = raid.raiderName.replace(/#\d+\s+/, '').split('[')[0].split('(')[0].trim();
//         let rTeam = detectRealTeamOfPlayer(raid.raiderName, raid.team);
//         let dTeam = (rTeam === 'A') ? 'B' : 'A';

//         if (cleanRaider !== "OFFICIALS" && !resultUpper.includes("ALL OUT") && !resultUpper.includes("TECHNICAL")) {
//             initStatsObj(rTeam, cleanRaider);
//             stats[rTeam][cleanRaider].R += 1;

//             if (resultUpper === "TOUCH POINT" || resultUpper === "TOUCH") {
//                 stats[rTeam][cleanRaider].TP += points;
//             }
//             else if (resultUpper === "BONUS + TOUCH") {
//                 stats[rTeam][cleanRaider].B += 1;
//                 stats[rTeam][cleanRaider].TP += (points - 1);
//             }
//             else if (resultUpper === "BONUS + TACKLE") {
//                 stats[rTeam][cleanRaider].B += 1;
//                 stats[rTeam][cleanRaider].RO += 1;
//             }
//             else if (resultUpper === "BONUS" || resultUpper === "BONUS POINT") {
//                 stats[rTeam][cleanRaider].B += 1;
//             }
//             else if (resultUpper === "EMPTY RAID" || resultUpper === "EMPTY") {
//                 stats[rTeam][cleanRaider].E += 1;
//             }
//             else if (resultUpper.includes("TACKLE") || resultUpper.includes("OUT")) {
//                 stats[rTeam][cleanRaider].RO += 1;
//             }
//         }

//         if (raid.details && (resultUpper === "TOUCH POINT" || resultUpper === "TOUCH" || resultUpper === "BONUS + TOUCH")) {
//             let detailsText = raid.details.toUpperCase();
//             if (detailsText.includes("OUT ")) {
//                 let outPart = raid.details.split(/out /i)[1];
//                 if (outPart) {
//                     outPart.split(',').forEach(defRaw => {
//                         let cleanDef = defRaw.replace(/#\d+\s+/, '').split('[')[0].split('(')[0].trim();
//                         let actualDefTeam = detectRealTeamOfPlayer(defRaw, dTeam);
                        
//                         if (cleanDef && cleanDef !== cleanRaider && cleanDef !== "PLAYER") {
//                             initStatsObj(actualDefTeam, cleanDef);
//                             stats[actualDefTeam][cleanDef].DO += 1;
//                         }
//                     });
//                 }
//             }
//         }

//         if (raid.details && (resultUpper.includes("TACKLE") || resultUpper.includes("SUPER TACKLE"))) {
//             let detailsText = raid.details.toUpperCase();
//             if (detailsText.includes("CAUGHT BY")) {
//                 let defenderPart = raid.details.split(/caught by/i)[1];
//                 if (defenderPart) {
//                     defenderPart.split(',').forEach(defRaw => {
//                         let cleanDef = defRaw.replace(/#\d+\s+/, '').split('[')[0].split('(')[0].trim();
//                         let actualDefTeam = detectRealTeamOfPlayer(defRaw, dTeam);
                        
//                         if (cleanDef && cleanDef !== cleanRaider && cleanDef !== "DEFENDER") { 
//                             initStatsObj(actualDefTeam, cleanDef);
                            
//                             if (resultUpper.includes("SUPER TACKLE")) {
//                                 stats[actualDefTeam][cleanDef].STK += 1;
//                             } else {
//                                 stats[actualDefTeam][cleanDef].TK += 1;
//                             }
//                         }
//                     });
//                 }
//             }
//         }
//     });

//     function generateTableHTML(teamData, themeColor) {
//         if (Object.keys(teamData).length === 0) {
//             return `<div class="text-center p-6 text-gray-600 italic text-[11px]">अद्याप कोणतीही नोंद नाही.</div>`;
//         }

//         let html = `
//             <div class="w-full overflow-hidden border border-gray-800/60 rounded-xl bg-black/20">
//                 <table class="w-full text-left text-[11px] text-gray-300 table-fixed border-collapse">
//                     <thead class="bg-gray-900/80 text-${themeColor}-400 uppercase text-[8px] font-black tracking-tight border-b border-gray-800 text-center">
//                         <tr>
//                             <th class="p-2 text-left w-[32%] tracking-tighter">Player Name</th>
//                             <th class="p-1 w-[7.5%]">R</th>
//                             <th class="p-1 w-[7.5%] text-green-400">TP</th>
//                             <th class="p-1 w-[7.5%] text-blue-400">B</th>
//                             <th class="p-1 w-[7.5%] text-gray-500">E</th>
//                             <th class="p-1 w-[7.5%] text-red-400">RO</th>
//                             <th class="p-1 w-[7.5%] text-red-300">DO</th>
//                             <th class="p-1 w-[7.5%] text-orange-400">TK</th>
//                             <th class="p-1 w-[8.5%] text-purple-400">STK</th>
//                             <th class="p-1 w-[9%] text-yellow-400 font-black bg-yellow-500/5">PT</th>
//                         </tr>
//                     </thead>
//                     <tbody class="divide-y divide-gray-850 text-center font-bold text-[10px]">`;

//         Object.keys(teamData).forEach(name => {
//             let p = teamData[name];
//             let totalPoints = p.TP + p.B + p.TK + (p.STK * 2);

//             html += `
//                 <tr class="hover:bg-white/5 transition-colors">
//                     <td class="p-2 text-left font-black text-white uppercase tracking-tighter whitespace-normal break-words leading-tight border-r border-gray-850/30">${name}</td>
//                     <td class="p-1">${p.R}</td>
//                     <td class="p-1 text-green-400 font-black">${p.TP}</td>
//                     <td class="p-1 text-blue-400 font-black">${p.B}</td>
//                     <td class="p-1 text-gray-400">${p.E}</td>
//                     <td class="p-1 text-red-400">${p.RO}</td>
//                     <td class="p-1 text-red-300">${p.DO}</td>
//                     <td class="p-1 text-orange-400">${p.TK}</td>
//                     <td class="p-1 text-purple-400">${p.STK}</td>
//                     <td class="p-1 font-black text-yellow-400 bg-yellow-500/5">${totalPoints}</td>
//                 </tr>`;
//         });

//         html += `</tbody></table></div>
//             <div class="mt-2.5 p-2 bg-gray-900/60 rounded-lg flex flex-wrap gap-x-1.5 gap-y-1 text-[8.5px] text-gray-400 border border-gray-800 justify-center font-bold uppercase tracking-tighter">
//                 <span><b>R:</b> Raid</span> | <span><b class="text-green-400">TP:</b> Touch</span> | <span><b class="text-blue-400">B:</b> Bonus</span> | <span><b>E:</b> Empty</span> | 
//                 <span><b class="text-red-400">RO:</b> Raid Out</span> | <span><b class="text-red-300">DO:</b> Def Out</span> | <span><b class="text-orange-400">TK:</b> Tackle</span> | <span><b class="text-purple-400">STK:</b> Super Tackle</span> | <span><b class="text-yellow-400">PT:</b> Points</span>
//             </div>`; 
            
//         return html;
//     }

//     // 🎯 [buildMatchSummaryTab च्या आतल्या शेवटच्या ओळी सुरक्षित केल्या]
//     let nameA = (window.matchSetupData && window.matchSetupData.tAName) ? window.matchSetupData.tAName.toUpperCase() : "TEAM A";
//     let nameB = (window.matchSetupData && window.matchSetupData.tBName) ? window.matchSetupData.tBName.toUpperCase() : "TEAM B";

//     // 🚨 [💥 CRITICAL NULL-SAFE ELEMENT CHECK]: बटने हजर असतील तरच नावे भरणे
//     const btnA = document.getElementById('btnSubTabTeamA');
//     const btnB = document.getElementById('btnSubTabTeamB');
//     if (btnA) btnA.innerText = `${nameA} STATS`;
//     if (btnB) btnB.innerText = `${nameB} STATS`;

//     containerA.innerHTML = generateTableHTML(stats.A, 'green');
//     containerB.innerHTML = generateTableHTML(stats.B, 'blue');

//     console.log("%c✅ [SUMMARY ENGINE ADVANCED COMPLETED]", "color: #10b981; font-weight: bold;");
// }

/***player stats push in db  */
function buildMatchSummaryTab() {
    const containerA = document.getElementById('teamASummaryTableContainer');
    const containerB = document.getElementById('teamBSummaryTableContainer');
    if (!containerA || !containerB) return;

    console.log("%c📊 [ADVANCED ANALYTICS ENGINE START] ----------------------------------", "color: #ff007f; font-weight: bold; font-size: 12px;");

    if (!window.activeRaidsList || window.activeRaidsList.length === 0) {
        let emptyHtml = `<div class="text-center p-8 text-gray-500 font-bold">अजून एकही रेड झालेली नाही!</div>`;
        containerA.innerHTML = emptyHtml; containerB.innerHTML = emptyHtml; return;
    }

    let stats = { A: {}, B: {} };

    function initStatsObj(team, name) {
        if (!stats[team][name]) {
            stats[team][name] = { R: 0, TP: 0, B: 0, E: 0, RO: 0, DO: 0, TK: 0, STK: 0 };
        }
    }

    function detectRealTeamOfPlayer(fullName, defaultTeam) {
        let nameUpper = fullName.toUpperCase();
        if (nameUpper.includes("[A]") || nameUpper.includes("(A)")) return 'A';
        if (nameUpper.includes("[B]") || nameUpper.includes("(B)")) return 'B';
        
        let jerseyMatch = nameUpper.match(/\d+/);
        if (jerseyMatch) {
            let jNo = parseInt(jerseyMatch[0]);
            return (jNo >= 21) ? 'B' : 'A';
        }
        return defaultTeam;
    }

    window.activeRaidsList.forEach((raid, idx) => {
        const resultUpper = raid.result ? raid.result.toUpperCase() : "";
        const points = Number(raid.points) || 0;

        let cleanRaider = raid.raiderName.replace(/#\d+\s+/, '').split('[')[0].split('(')[0].trim();
        let rTeam = detectRealTeamOfPlayer(raid.raiderName, raid.team);
        let dTeam = (rTeam === 'A') ? 'B' : 'A';

        if (cleanRaider !== "OFFICIALS" && !resultUpper.includes("ALL OUT") && !resultUpper.includes("TECHNICAL")) {
            initStatsObj(rTeam, cleanRaider);
            stats[rTeam][cleanRaider].R += 1;

            if (resultUpper === "TOUCH POINT" || resultUpper === "TOUCH") {
                stats[rTeam][cleanRaider].TP += points;
            }
            else if (resultUpper === "BONUS + TOUCH") {
                stats[rTeam][cleanRaider].B += 1;
                stats[rTeam][cleanRaider].TP += (points - 1);
            }
            else if (resultUpper === "BONUS + TACKLE") {
                stats[rTeam][cleanRaider].B += 1;
                stats[rTeam][cleanRaider].RO += 1;
            }
            else if (resultUpper === "BONUS" || resultUpper === "BONUS POINT") {
                stats[rTeam][cleanRaider].B += 1;
            }
            else if (resultUpper === "EMPTY RAID" || resultUpper === "EMPTY") {
                stats[rTeam][cleanRaider].E += 1;
            }
            else if (resultUpper.includes("TACKLE") || resultUpper.includes("OUT")) {
                stats[rTeam][cleanRaider].RO += 1;
            }
        }

        if (raid.details && (resultUpper === "TOUCH POINT" || resultUpper === "TOUCH" || resultUpper === "BONUS + TOUCH")) {
            let detailsText = raid.details.toUpperCase();
            if (detailsText.includes("OUT ")) {
                let outPart = raid.details.split(/out /i)[1];
                if (outPart) {
                    outPart.split(',').forEach(defRaw => {
                        let cleanDef = defRaw.replace(/#\d+\s+/, '').split('[')[0].split('(')[0].trim();
                        let actualDefTeam = detectRealTeamOfPlayer(defRaw, dTeam);
                        
                        if (cleanDef && cleanDef !== cleanRaider && cleanDef !== "PLAYER") {
                            initStatsObj(actualDefTeam, cleanDef);
                            stats[actualDefTeam][cleanDef].DO += 1;
                        }
                    });
                }
            }
        }

        if (raid.details && (resultUpper.includes("TACKLE") || resultUpper.includes("SUPER TACKLE"))) {
            let detailsText = raid.details.toUpperCase();
            if (detailsText.includes("CAUGHT BY")) {
                let defenderPart = raid.details.split(/caught by/i)[1];
                if (defenderPart) {
                    defenderPart.split(',').forEach(defRaw => {
                        let cleanDef = defRaw.replace(/#\d+\s+/, '').split('[')[0].split('(')[0].trim();
                        let actualDefTeam = detectRealTeamOfPlayer(defRaw, dTeam);
                        
                        if (cleanDef && cleanDef !== cleanRaider && cleanDef !== "DEFENDER") { 
                            initStatsObj(actualDefTeam, cleanDef);
                            
                            if (resultUpper.includes("SUPER TACKLE")) {
                                stats[actualDefTeam][cleanDef].STK += 1;
                            } else {
                                stats[actualDefTeam][cleanDef].TK += 1;
                            }
                        }
                    });
                }
            }
        }
    });

    function generateTableHTML(teamData, themeColor) {
        if (Object.keys(teamData).length === 0) {
            return `<div class="text-center p-6 text-gray-600 italic text-[11px]">अद्याप कोणतीही नोंद नाही.</div>`;
        }

        let html = `
            <div class="w-full overflow-hidden border border-gray-800/60 rounded-xl bg-black/20">
                <table class="w-full text-left text-[11px] text-gray-300 table-fixed border-collapse">
                    <thead class="bg-gray-900/80 text-${themeColor}-400 uppercase text-[8px] font-black tracking-tight border-b border-gray-800 text-center">
                        <tr>
                            <th class="p-2 text-left w-[32%] tracking-tighter">Player Name</th>
                            <th class="p-1 w-[7.5%]">R</th>
                            <th class="p-1 w-[7.5%] text-green-400">TP</th>
                            <th class="p-1 w-[7.5%] text-blue-400">B</th>
                            <th class="p-1 w-[7.5%] text-gray-500">E</th>
                            <th class="p-1 w-[7.5%] text-red-400">RO</th>
                            <th class="p-1 w-[7.5%] text-red-300">DO</th>
                            <th class="p-1 w-[7.5%] text-orange-400">TK</th>
                            <th class="p-1 w-[8.5%] text-purple-400">STK</th>
                            <th class="p-1 w-[9%] text-yellow-400 font-black bg-yellow-500/5">PT</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-850 text-center font-bold text-[10px]">`;

        Object.keys(teamData).forEach(name => {
            let p = teamData[name];
            let totalPoints = p.TP + p.B + p.TK + (p.STK * 2);

            html += `
                <tr class="hover:bg-white/5 transition-colors">
                    <td class="p-2 text-left font-black text-white uppercase tracking-tighter whitespace-normal break-words leading-tight border-r border-gray-850/30">${name}</td>
                    <td class="p-1">${p.R}</td>
                    <td class="p-1 text-green-400 font-black">${p.TP}</td>
                    <td class="p-1 text-blue-400 font-black">${p.B}</td>
                    <td class="p-1 text-gray-400">${p.E}</td>
                    <td class="p-1 text-red-400">${p.RO}</td>
                    <td class="p-1 text-red-300">${p.DO}</td>
                    <td class="p-1 text-orange-400">${p.TK}</td>
                    <td class="p-1 text-purple-400">${p.STK}</td>
                    <td class="p-1 font-black text-yellow-400 bg-yellow-500/5">${totalPoints}</td>
                </tr>`;
        });

        html += `</tbody></table></div>
            <div class="mt-2.5 p-2 bg-gray-900/60 rounded-lg flex flex-wrap gap-x-1.5 gap-y-1 text-[8.5px] text-gray-400 border border-gray-800 justify-center font-bold uppercase tracking-tighter">
                <span><b>R:</b> Raid</span> | <span><b class="text-green-400">TP:</b> Touch</span> | <span><b class="text-blue-400">B:</b> Bonus</span> | <span><b>E:</b> Empty</span> | 
                <span><b class="text-red-400">RO:</b> Raid Out</span> | <span><b class="text-red-300">DO:</b> Def Out</span> | <span><b class="text-orange-400">TK:</b> Tackle</span> | <span><b class="text-purple-400">STK:</b> Super Tackle</span> | <span><b class="text-yellow-400">PT:</b> Points</span>
            </div>`; 
            
        return html;
    }

    let nameA = (window.matchSetupData && window.matchSetupData.tAName) ? window.matchSetupData.tAName.toUpperCase() : "TEAM A";
    let nameB = (window.matchSetupData && window.matchSetupData.tBName) ? window.matchSetupData.tBName.toUpperCase() : "TEAM B";

    const btnA = document.getElementById('btnSubTabTeamA');
    const btnB = document.getElementById('btnSubTabTeamB');
    if (btnA) btnA.innerText = `${nameA} STATS`;
    if (btnB) btnB.innerText = `${nameB} STATS`;

    containerA.innerHTML = generateTableHTML(stats.A, 'green');
    containerB.innerHTML = generateTableHTML(stats.B, 'blue');

    console.log("%c✅ [SUMMARY ENGINE ADVANCED COMPLETED]", "color: #10b981; font-weight: bold;");


// =========================================================================
    // 🚨 📂 SECTION 5: AUTOMATIC PLAYER STATS DATABASE SYNC WITH GAIN & LOSS ☁️
    // =========================================================================
    let mId = window.matchSetupData?.mId || window.currentMatchData?.mId || "";
    let tId = window.matchSetupData?.tId || window.currentMatchData?.tId || "";
    let currentStatus = (window.currentMatchData?.status || localStorage.getItem(`match_status_${mId}`) || "").trim().toLowerCase();

    if (tId && mId && currentStatus === "finished") {
        console.log("%c🔄 [FIREBASE ADVANCED STATS SYNC]: Gain, Loss आणि Empty Raids चा हिशोब सुरू...", "color: #a855f7; font-weight: bold;");
        
        (async () => {
            try {
                const matchDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
                if (!matchDoc.exists) return;
                
                const matchData = matchDoc.data();
                let teamAPlayers = matchData.teamAPlayers || matchData.teamA_players || [];
                let teamBPlayers = matchData.teamBPlayers || matchData.teamB_players || [];

                // नावांमधील स्पेस आणि केसचा घोळ मिटवणारे हेल्पर फंक्शन
                function getCleanKey(name) {
                    return name.trim().toLowerCase().replace(/\s+/g, '');
                }

                // अ. Team A प्लेयर्सचे सखोल मॅपिंग (Gain - Loss - Empty)
                teamAPlayers = teamAPlayers.map(p => {
                    let dbPlayerKey = getCleanKey(p.name);
                    let foundName = Object.keys(stats.A).find(calcName => getCleanKey(calcName) === dbPlayerKey);
                    
                    if (foundName) {
                        let pData = stats.A[foundName];
                        
                        // 🧮 कबड्डी नियम हिशोब:
                        let tkGain = Number(pData.TK || 0) + (Number(pData.STK || 0) * 2); // १ टॅकल = १ पॉईंट, १ सुपर टॅकल = २ पॉईंट
                        let rdGain = Number(pData.TP || 0) + Number(pData.B || 0);        // टच + बोनस
                        let ptTotal = rdGain + tkGain;                                    // एकूण कमावलेले गुण
                        
                        p.stats = {
                            raids: Number(pData.R || 0),
                            raid_gain: rdGain,
                            raid_loss: Number(pData.RO || 0),       // रेडर आऊट झाला म्हणजे तो लॉस आहे
                            bonus: Number(pData.B || 0),
                            empty_raids: Number(pData.E || 0),      // 🎯 [EMPTY RAID INJECTION]
                            
                            tackles: Number(pData.TK || 0) + Number(pData.STK || 0) + Number(pData.DO || 0), // एकूण केलेले प्रयत्ने
                            tackle_gain: tkGain,
                            tackle_loss: Number(pData.DO || 0),     // डिफेन्स करताना आऊट झाला म्हणजे तो लॉस आहे
                            super_tackles: Number(pData.STK || 0),
                            
                            points: ptTotal
                        };
                        console.log(`✅ [DB Sync A]: ${p.name} ➔ Gain: ${p.stats.points} | Loss: ${p.stats.raid_loss + p.stats.tackle_loss} | Empty: ${p.stats.empty_raids}`);
                    }
                    return p;
                });

                // ब. Team B प्लेयर्सचे सखोल मॅपिंग (Gain - Loss - Empty)
                teamBPlayers = teamBPlayers.map(p => {
                    let dbPlayerKey = getCleanKey(p.name);
                    let foundName = Object.keys(stats.B).find(calcName => getCleanKey(calcName) === dbPlayerKey);
                    
                    if (foundName) {
                        let pData = stats.B[foundName];
                        
                        let tkGain = Number(pData.TK || 0) + (Number(pData.STK || 0) * 2);
                        let rdGain = Number(pData.TP || 0) + Number(pData.B || 0);
                        let ptTotal = rdGain + tkGain;
                        
                        p.stats = {
                            raids: Number(pData.R || 0),
                            raid_gain: rdGain,
                            raid_loss: Number(pData.RO || 0),
                            bonus: Number(pData.B || 0),
                            empty_raids: Number(pData.E || 0),      // 🎯 [EMPTY RAID INJECTION]
                            
                            tackles: Number(pData.TK || 0) + Number(pData.STK || 0) + Number(pData.DO || 0),
                            tackle_gain: tkGain,
                            tackle_loss: Number(pData.DO || 0),
                            super_tackles: Number(pData.STK || 0),
                            
                            points: ptTotal
                        };
                        console.log(`✅ [DB Sync B]: ${p.name} ➔ Gain: ${p.stats.points} | Loss: ${p.stats.raid_loss + p.stats.tackle_loss} | Empty: ${p.stats.empty_raids}`);
                    }
                    return p;
                });

                // 🔥 अंतिम डेटाबेस अपडेट (Single Source of Truth)
                await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
                    teamAPlayers: teamAPlayers,
                    teamBPlayers: teamBPlayers,
                    statsCalculatedOn: new Date().getTime()
                });
                
                console.log("%c🚀 [ADVANCED FIREBASE WRITE SUCCESS]: रिकाम्या रेड्स आणि गेन-लॉससह सर्व प्लेयर्सचा डेटा जतन झाला!", "background: #22c55e; color: #fff; font-weight: bold; padding: 2px;");
            } catch (err) {
                console.error("🚨 [ADVANCED DB SYNC CRASH]:", err);
            }
        })();
    }
}
/**
 * switchTimelineTab(tabName) (टॅब्स अदलाबदल करण्यासाठी)
मोडल उघडल्यावर 'Timeline' आणि 'Player Summary' या दोन बटणामध्ये टॉगल करण्यासाठी हे सोपं नेव्हिगेटर फंक्शन:
🛠️ कोड क्लीनअप (फक्त कन्सोल ट्रॅकिंगसह)
तुझा मूळचा टॅब हायडिंग, क्लासेस रिमूव्हल आणि buildMatchSummaryTab() चा संपूर्ण फ्लो जसाच्या तसा ठेवून, 
आपण यात फक्त एक छोटा कन्सोल ट्रॅकर जोडूया, जेणेकरून टॅब बदलताना सिस्टीम अचूक सिंक होतेय की नाही हे तुला कन्सोलमध्ये स्पष्ट दिसेल:
 */

function switchTimelineTab(tabName) {
    console.log(`🎛️ [TAB SWITCH]: युझरने "${tabName}" टॅबवर क्लिक केले.`);

    const tabTimeline = document.getElementById('modalRaidList');
    const tabPlayerSummary = document.getElementById('modalSummaryTabContent');
    const tabMatchSummary = document.getElementById('modalMatchSummaryTabContent');
    
    const btnTimeline = document.getElementById('btnTabTimeline');
    const btnPlayerSummary = document.getElementById('btnTabPlayerSummary');
    const btnMatchSummary = document.getElementById('btnTabMatchSummary');

    // १. सर्व कंटेनर्स आधी हायड करा
    if (tabTimeline) tabTimeline.classList.add('hidden');
    if (tabPlayerSummary) tabPlayerSummary.classList.add('hidden');
    if (tabMatchSummary) tabMatchSummary.classList.add('hidden');

    // २. सर्व बटनांचे स्टाईल्स ग्रे रीसेट करा
    [btnTimeline, btnPlayerSummary, btnMatchSummary].forEach(btn => {
        if (btn) {
            btn.classList.remove('bg-orange-600', 'text-black');
            btn.classList.add('bg-gray-900', 'text-gray-400', 'border', 'border-gray-800');
        }
    });

    // ३. जो टॅब सिलेक्ट केलाय त्याला ऑरेंज (Active) करा
    if (tabName === 'timeline') {
        if (tabTimeline) tabTimeline.classList.remove('hidden');
        if (btnTimeline) {
            btnTimeline.classList.add('bg-orange-600', 'text-black');
            btnTimeline.classList.remove('bg-gray-900', 'text-gray-400', 'border-gray-800');
        }
    } 
    else if (tabName === 'player_summary') {
        if (tabPlayerSummary) tabPlayerSummary.classList.remove('hidden');
        if (btnPlayerSummary) {
            btnPlayerSummary.classList.add('bg-orange-600', 'text-black');
            btnPlayerSummary.classList.remove('bg-gray-900', 'text-gray-400', 'border-gray-800');
        }
        // प्लेयर समरी तक्ता जनरेट करा
        if (typeof buildMatchSummaryTab === "function") buildMatchSummaryTab();
    } 
    else if (tabName === 'match_summary') {
        if (tabMatchSummary) tabMatchSummary.classList.remove('hidden');
        if (btnMatchSummary) {
            btnMatchSummary.classList.add('bg-orange-600', 'text-black');
            btnMatchSummary.classList.remove('bg-gray-900', 'text-gray-400', 'border-gray-800');
        }
        // नवीन कडक मॅच ओव्हरव्ह्यू/समरी रेंडर करा!
        renderMatchSummaryOverview();
    }
}

/**
 * switchTeamSummarySubTab(teamLetter) फंक्शन
सब-टॅब्स बटनांवर क्लिक केल्यावर एका टीमचं टेबल दाखवून दुसऱ्या टीमचं लपवण्यासाठी हे अगदी सोपं आणि कडक नेव्हिगेटर फंक्शन:
 * 
 */
function switchTeamSummarySubTab(teamLetter) {
    const tableA = document.getElementById('teamASummaryTableContainer');
    const tableB = document.getElementById('teamBSummaryTableContainer');
    
    const btnA = document.getElementById('btnSubTabTeamA');
    const btnB = document.getElementById('btnSubTabTeamB');

    if (teamLetter === 'B') {
        // टीम B चे टेबल उघडा 🔵
        if (tableA) tableA.classList.add('hidden');
        if (tableB) tableB.classList.remove('hidden');
        
        btnB.className = "flex-1 py-1.5 text-center text-[10px] font-black bg-blue-600 text-white rounded-lg transition-all uppercase tracking-tight shadow";
        btnA.className = "flex-1 py-1.5 text-center text-[10px] font-black bg-gray-900 text-gray-500 rounded-lg transition-all border border-gray-850 uppercase tracking-tight hover:text-white";
    } else {
        // टीम A चे टेबल उघडा 🟢
        if (tableB) tableB.classList.add('hidden');
        if (tableA) tableA.classList.remove('hidden');
        
        btnA.className = "flex-1 py-1.5 text-center text-[10px] font-black bg-green-600 text-white rounded-lg transition-all uppercase tracking-tight shadow";
        btnB.className = "flex-1 py-1.5 text-center text-[10px] font-black bg-gray-900 text-gray-500 rounded-lg transition-all border border-gray-850 uppercase tracking-tight hover:text-white";
    }
}

/** renderMatchSummaryOverview
 * ओव्हरव्ह्यूमध्ये scoreCard चा मास्टर सिंक लावणे
आपण तुझा मूळचा संपूर्ण लेआउट, क्रिकहिरोज डिझाईन, बॅनर कलर्सचे नियम आणि कडक Top Raiders/Defenders कॅल्क्युलेशनचे गणिताचे लॉजिक १ टक्काही विस्कटणार नाही.
 */

function renderMatchSummaryOverview() {
        // =========================================================================
            // 📂 SECTION 1: ENGINE START & ADVANCED ID RECOVERY 🧪 (🎯 THE CRITICAL BUG FIX)
            // =========================================================================
    console.log("%c====================================================================", "color: #10b981; font-weight: bold;");
    console.log("%c📊 [ENGINE START]: renderMatchSummaryOverview() इंजिन ट्रिगर झाले!", "background: #10b981; color: #fff; font-weight: bold; padding: 4px; font-size: 11px;");

    const container = document.getElementById('modalMatchSummaryTabContent');
    if (!container) {
        console.error("🚨 [DOM CRITICAL ERROR]: 'modalMatchSummaryTabContent' कंटेनर DOM मध्ये सापडला नाही!");
        return;
    }

    // 🚨 [💥 THE EXACT BUG RECOVERY]: आयडी पूर्ण रिकामे येऊ नयेत म्हणून ३ लेव्हलचा कडक बॅकअप!
    let mId = window.matchSetupData?.mId || window.currentMatchData?.mId || "";
    let tId = window.matchSetupData?.tId || window.currentMatchData?.tId || "";

    // जर अजूनही आयडी रिकामे असतील, तर स्कोरिंग चालू असलेल्या 'squad_editing_match' मधून ओढणे
    if (!mId || !tId) {
        const savedMatchRaw = localStorage.getItem('squad_editing_match');
        if (savedMatchRaw) {
            const parsed = JSON.parse(savedMatchRaw);
            tId = tId || parsed.tId || "";
            mId = mId || parsed.mId || "";
            console.log("📦 [OVERVIEW ID RECOVERY]: window मेमरी रिकामी होती, म्हणून Storage मधून आयडी शोधले!");
        }
    }

    const combinedKey = `${tId}_${mId}`;
    console.log("%c🔍 [CORE CONFIG CHECKS]:", "color: #38bdf8; font-weight: bold;");
    console.log(`👉 Match ID: "${mId}" | Tournament ID: "${tId}" | Key: "${combinedKey}"`);

    let currentMatchStatus = "Live";
    let matchRawData = window.currentMatchData || {};

    // जर आयडी परफेक्ट मिळाले असतील, तरच आता स्टेटस फेचिंग १००% अचूक काम करेल!
    if (mId && mId !== "") {
        if (typeof homeLiveMatchesStorage !== 'undefined' && homeLiveMatchesStorage[combinedKey]) {
            currentMatchStatus = homeLiveMatchesStorage[combinedKey].status || "Live";
            matchRawData = homeLiveMatchesStorage[combinedKey];
            console.log("%c✅ [DATA SOURCE]: homeLiveMatchesStorage मधून डेटा यशस्वीरीत्या ओढला!", "color: #22c55e; font-weight: bold;");
        } else {
            const localSavedStatus = localStorage.getItem(`match_status_${mId}`);
            if (localSavedStatus) {
                currentMatchStatus = localSavedStatus;
                console.log(`✅ [DATA SOURCE]: LocalStorage कडून स्टेटस मिळाला ➔ "${localSavedStatus}"`);
            }
        }
    }

    // जर डेटाबेसमधून थेट स्टेटस 'Finished' मिळाला असेल (window.currentMatchData च्या आत)
    if (window.currentMatchData?.status && (!mId || currentMatchStatus === "Live")) {
        currentMatchStatus = window.currentMatchData.status;
        console.log(`✅ [DATA SOURCE]: window.currentMatchData वरून थेट स्टेटस ओढला ➔ "${currentMatchStatus}"`);
    }

    const cleanStatus = currentMatchStatus.trim().toLowerCase();
    console.log(`📋 [RESOLVED RAW STATUS] ➔ DB Status: "${currentMatchStatus}" | Cleaned Status: "${cleanStatus}"`);


    // =========================================================================
    // 📂 SECTION 2: OBJECT SCORECARD PARSING & DEEP AUDIT 📊
    // =========================================================================
    let localCard = localStorage.getItem('global_score_card');
    let currentScoreCard = matchRawData.scoreCard || (localCard ? JSON.parse(localCard) : {
        mainMatch:  { teamA: 0, teamB: 0 },
        fiveRaid:   { teamA: 0, teamB: 0 },
        goldenRaid: { teamA: 0, teamB: 0 }
    });

    console.log("%c📊 [SCORECARD OBJECT SNAPSHOT]:", "color: #a855f7; font-weight: bold;");
    console.log("   👉 Main Match Score ➔", currentScoreCard.mainMatch);
    console.log("   👉 5-5 Raids Score  ➔", currentScoreCard.fiveRaid);
    console.log("   👉 Golden Raid Score➔", currentScoreCard.goldenRaid);

    // 🎯 [ARCHITECTURAL RULE]: ओव्हरव्ह्यूच्या मुख्य स्कोअर डब्यांवर नेहमी 'mainMatch' चाच मूळ स्कोअर दाखवणे
    let sA = Number(currentScoreCard?.mainMatch?.teamA ?? 0);
    let sB = Number(currentScoreCard?.mainMatch?.teamB ?? 0);

    const domNameA = document.getElementById('modalTeamAName')?.innerText;
    const domNameB = document.getElementById('modalTeamBName')?.innerText;
    let tA = matchRawData.teamA || domNameA || "TEAM A";
    let tB = matchRawData.teamB || domNameB || "TEAM B";

    let dbWinner = matchRawData.winner || window.currentMatchData?.winner || localStorage.getItem(`${tId}_${mId}_winner`) || "";
    console.log(`🏆 [WINNER RECOVERY CHECK]: सिस्टीमला सापडलेला विजेतासंघ ➔ "${dbWinner}"`);


    // =========================================================================
    // 📂 SECTION 3: WINNER LOGIC & DYNAMIC BANNER GENERATOR 🏆
    // =========================================================================
    let winText = "MATCH IN PROGRESS";
    let subWinText = "सामना अद्याप सुरू आहे, रोमांचक वळणावर... 🔥";
    let badgeColor = "from-orange-600 to-amber-600 text-white shadow-orange-900/30";
    
    if (cleanStatus === "completed" || cleanStatus === "finished") {
        badgeColor = "from-green-600 to-emerald-600 text-white shadow-green-900/30";
        console.log("%c🏁 [STATUS MATCHED Finished]: सामना संपलेला आहे. निकाल काढत आहे...", "color: #10b981; font-weight: bold;");
        
        if (dbWinner && dbWinner !== "Tie" && dbWinner !== "Tied") {
            winText = `🏆 WINNER: ${dbWinner.toUpperCase()} 🥇`;
            
            // ५-५ किंवा गोल्डन रेडनुसार पोट-मेसेज (Subtitle) ठरवणे
            let fA_check = Number(currentScoreCard?.fiveRaid?.teamA || 0);
            let fB_check = Number(currentScoreCard?.fiveRaid?.teamB || 0);
            let gA_check = Number(currentScoreCard?.goldenRaid?.teamA || 0);
            let gB_check = Number(currentScoreCard?.goldenRaid?.teamB || 0);

            if (gA_check > 0 || gB_check > 0) {
                subWinText = `Won in Golden Raid Sudden Death! 👑`;
            } else if (fA_check > 0 || fB_check > 0) {
                subWinText = `Won in 5-5 Tie-Breaker Raids! 👑 [${fA_check}-${fB_check}]`;
            } else {
                subWinText = `Main Match Full-Time Victory by ${Math.abs(sA - sB)} points! 👑`;
            }
        } else {
            // जर मेमरीत विनर नसेल तर गणितावरून काढणे
            if (sA > sB) { 
                winText = `🏆 WINNER: ${tA.toUpperCase()} 🥇`; 
                subWinText = `Won by ${sA - sB} points in Main Match! 👑`;
            } else if (sB > sA) { 
                winText = `🏆 WINNER: ${tB.toUpperCase()} 🥇`; 
                subWinText = `Won by ${sB - sA} points in Main Match! 👑`;
            } else { 
                winText = "🤝 MATCH TIED / सामना बरोबरीत"; 
                subWinText = "दोन्ही संघ महासंग्रामात बरोबरीत सुटले";
                badgeColor = "from-blue-600 to-indigo-600 text-white shadow-blue-900/30";
            }
        }
    } else {
        if (cleanStatus === "five_raid") {
            winText = "⚔️ 5-5 RAIDS IN PROGRESS";
            subWinText = `महासंग्राम: ५-५ टायब्रेकर फेरी सुरू आहे 🏃‍♂️`;
            badgeColor = "from-orange-500 to-red-600 animate-pulse";
        } else if (cleanStatus === "golden_raid") {
            winText = "⚡ GOLDEN RAID ACTIVE";
            subWinText = "सुवर्ण थरार: निकाल फक्त पुढील १ रेडवर! 👑";
            badgeColor = "from-amber-500 to-yellow-600 shadow-[0_0_15px_rgba(234,179,8,0.3)] animate-pulse";
        }
    }


    // =========================================================================
    // 📂 SECTION 4: EXTRA BREAKDOWN SCORE SUB-PANELS ⚡ (🎯 THE TARGET REQ)
    // =========================================================================
    let extraScoresHtml = "";
    let fA = Number(currentScoreCard?.fiveRaid?.teamA ?? 0);
    let fB = Number(currentScoreCard?.fiveRaid?.teamB ?? 0);
    let gA = Number(currentScoreCard?.goldenRaid?.teamA ?? 0);
    let gB = Number(currentScoreCard?.goldenRaid?.teamB ?? 0);

    // अ. ५-५ चा स्कोअर असल्यास त्याचा स्वतंत्र डबा उभा करणे
    if (fA > 0 || fB > 0 || cleanStatus === "five_raid") {
        console.log(`🔥 [OVERVIEW INJECTION]: 5-5 स्कोअर [${fA}-${fB}] रेंडर केला.`);
        extraScoresHtml += `
            <div class="mt-2.5 text-[10px] bg-gradient-to-r from-orange-950/80 to-slate-900/90 border border-orange-500/30 px-3 py-2 rounded-xl font-black uppercase tracking-wider flex justify-between items-center w-full shadow-inner animate-fade-in">
                <span class="flex items-center gap-1"><span class="text-orange-500">⚡</span> 5-5 Raids Score:</span>
                <span class="font-mono text-xs text-orange-400 bg-orange-950/40 px-2.5 py-0.5 rounded-md border border-orange-500/10">${fA} - ${fB}</span>
            </div>`;
    }

    // ब. गोल्डन रेडचा स्कोअर असल्यास त्याचा स्वतंत्र प्रीमियम डबा उभा करणे
    if (gA > 0 || gB > 0 || cleanStatus === "golden_raid") {
        console.log(`🪙 [OVERVIEW INJECTION]: Golden Raid स्कोअर [${gA}-${gB}] रेंडर केला.`);
        extraScoresHtml += `
            <div class="mt-1.5 text-[10px] bg-gradient-to-r from-yellow-950/80 to-slate-900/90 border border-yellow-500/30 px-3 py-2 rounded-xl font-black uppercase tracking-wider flex justify-between items-center w-full shadow-inner animate-fade-in">
                <span class="flex items-center gap-1"><span class="text-yellow-500">👑</span> Golden Raid Score:</span>
                <span class="font-mono text-xs text-yellow-400 bg-yellow-950/40 px-2.5 py-0.5 rounded-md border border-yellow-500/10">${gA} - ${gB}</span>
            </div>`;
    }


    // =========================================================================
    // 📂 SECTION 5: PERFORMANCE METRICS & STATISTICS (SAFE MODE)
    // =========================================================================
    let raiders = { A: [], B: [] }, defenders = { A: [], B: [] };
    function getTeamOfPlayer(fullName, defaultTeam) {
        let nameUpper = fullName.toUpperCase();
        if (nameUpper.includes("[A]") || nameUpper.includes("(A)")) return 'A';
        if (nameUpper.includes("[B]") || nameUpper.includes("(B)")) return 'B';
        return defaultTeam;
    }

    if (window.activeRaidsList && window.activeRaidsList.length > 0) {
        let rScores = {}; let dScores = {};
        window.activeRaidsList.forEach((raid) => {
            const res = raid.result ? raid.result.toUpperCase() : "";
            const pts = Number(raid.points) || 0;
            let rTeam = getTeamOfPlayer(raid.raiderName || "", raid.team);
            let dTeam = (rTeam === 'A') ? 'B' : 'A';
            let name = (raid.raiderName || "Raider").replace(/#\d+\s+/, '').split('[')[0].split('(')[0].trim();
            let no = (raid.raiderName || "").match(/\d+/) ? `#${(raid.raiderName || "").match(/\d+/)[0]}` : "";

            if (name !== "OFFICIALS" && !res.includes("ALL OUT") && !res.includes("TECHNICAL")) {
                if (!rScores[name]) rScores[name] = { score: 0, no: no, team: rTeam };
                if (res === "TOUCH POINT" || res === "TOUCH" || res === "BONUS + TOUCH") rScores[name].score += pts;
                else if (res.includes("BONUS")) rScores[name].score += 1;
            }
            if (raid.details && (res.includes("TACKLE") || res.includes("SUPER TACKLE"))) {
                let defPart = raid.details.split(/caught by/i)[1];
                if (defPart) {
                    defPart.split(',').forEach(defRaw => {
                        let dName = defRaw.replace(/#\d+\s+/, '').split('[')[0].split('(')[0].trim();
                        let dNo = defRaw.match(/\d+/) ? `#${defRaw.match(/\d+/)[0]}` : "";
                        let actTeam = getTeamOfPlayer(defRaw, dTeam);
                        if (dName && dName !== name && dName !== "DEFENDER") {
                            if (!dScores[dName]) dScores[dName] = { score: 0, no: dNo, team: actTeam };
                            dScores[dName].score += 1;
                        }
                    });
                }
            }
        });
        let sortedR = Object.keys(rScores).map(n => ({ name: n, ...rScores[n] })).sort((a,b) => b.score - a.score);
        let sortedD = Object.keys(dScores).map(n => ({ name: n, ...dScores[n] })).sort((a,b) => b.score - a.score);
        raiders.A = sortedR.filter(r => r.team === 'A').slice(0, 1);
        raiders.B = sortedR.filter(r => r.team === 'B').slice(0, 1);
        defenders.A = sortedD.filter(d => d.team === 'A').slice(0, 1);
        defenders.B = sortedD.filter(d => d.team === 'B').slice(0, 1);
    }

    let heroRA = raiders.A[0] ? `${raiders.A[0].name} (${raiders.A[0].score} Pts)` : "No Data";
    let heroRB = raiders.B[0] ? `${raiders.B[0].name} (${raiders.B[0].score} Pts)` : "No Data";
    let heroDA = defenders.A[0] ? `${defenders.A[0].name} (${defenders.A[0].score} Tk)` : "No Data";
    let heroDB = defenders.B[0] ? `${defenders.B[0].name} (${defenders.B[0].score} Tk)` : "No Data";


    // =========================================================================
    // 📂 SECTION 6: PURE HIGH-END DOM LAYOUT RENDERING 🚀
    // =========================================================================
    console.log(`✍️ [DOM INJECTION SUCCESS]: HTML जनरेट करून कप्प्यात ढकलले. रेंडर होणारे स्कोअर ➔ A: ${sA} vs B: ${sB}`);

    container.innerHTML = `
        <div class="w-full space-y-4 font-sans text-gray-200 antialiased anim-fade-in animate-duration-300">
            
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-sm">
                <div class="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
                
                <p class="text-[9px] font-black tracking-widest text-yellow-500/80 uppercase mb-2">🏆 MATCH SUMMARY REPORT 🏆</p>
                <div class="bg-gradient-to-br ${badgeColor} px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-tight shadow-lg min-w-[220px]">
                    <div class="text-[12px] leading-tight font-black">${winText}</div>
                    <div class="text-[9px] text-white/90 font-medium tracking-normal mt-0.5">${subWinText}</div>
                </div>
                
                <div class="w-full max-w-[260px]">
                    ${extraScoresHtml}
                </div>
                
                <div class="mt-3 text-[10px] text-slate-500 font-bold tracking-tight">
                    Total Raids Witnessed: <span class="text-slate-300 font-mono">${window.activeRaidsList ? window.activeRaidsList.length : 0}</span>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg">
                    <div class="border-b border-slate-850/60 pb-2">
                        <span class="inline-block w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] mr-1.5 align-middle"></span>
                        <span class="text-[11px] font-black text-white uppercase tracking-tight align-middle truncate inline-block max-w-[80%]">${tA}</span>
                    </div>
                    <div class="py-4 text-left">
                        <span class="text-4xl font-black text-white font-mono tracking-tighter">${sA}</span>
                        <span class="text-[10px] font-black text-slate-500 tracking-wider block mt-1">MAIN MATCH POINTS</span>
                    </div>
                </div>

                <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg">
                    <div class="border-b border-slate-850/60 pb-2 text-right">
                        <span class="text-[11px] font-black text-white uppercase tracking-tight align-middle truncate inline-block max-w-[80%]">${tB}</span>
                        <span class="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] ml-1.5 align-middle"></span>
                    </div>
                    <div class="py-4 text-right">
                        <span class="text-4xl font-black text-white font-mono tracking-tighter">${sB}</span>
                        <span class="text-[10px] font-black text-slate-500 tracking-wider block mt-1">MAIN MATCH POINTS</span>
                    </div>
                </div>
            </div>

            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3.5">
                <p class="text-[10px] font-black tracking-wider text-slate-400 uppercase border-b border-slate-850 pb-2 flex items-center gap-1.5">
                    <i class="fa-solid fa-trophy text-yellow-500"></i> Match Top Performers
                </p>
                <div class="grid grid-cols-2 gap-4 text-[11px] relative">
                    <div class="absolute inset-y-0 left-1/2 w-[1px] bg-slate-850/80 -translate-x-1/2"></div>
                    <div class="space-y-3 pr-1">
                        <div>
                            <span class="text-[9px] font-bold text-green-400 block uppercase mb-1">⚡ Top Raider</span>
                            <span class="font-black text-white uppercase tracking-tight block leading-tight">${heroRA}</span>
                        </div>
                        <div class="pt-1.5">
                            <span class="text-[9px] font-bold text-orange-400 block uppercase mb-1">🛡️ Top Defender</span>
                            <span class="font-black text-white uppercase tracking-tight block leading-tight">${heroDA}</span>
                        </div>
                    </div>
                    <div class="space-y-3 pl-3 text-right">
                        <div>
                            <span class="text-[9px] font-bold text-blue-400 block uppercase mb-1">Top Raider ⚡</span>
                            <span class="font-black text-white uppercase tracking-tight block leading-tight">${heroRB}</span>
                        </div>
                        <div class="pt-1.5">
                            <span class="text-[9px] font-bold text-orange-400 block uppercase mb-1">Top Defender 🛡️</span>
                            <span class="font-black text-white uppercase tracking-tight block leading-tight">${heroDB}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-2.5 pt-1">
                <button onclick="shareKabaddiMatch('report')" class="py-3 px-4 bg-white hover:bg-slate-100 text-black font-black text-[11px] rounded-xl tracking-tight flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md">
                    <i class="fa-solid fa-file-pdf text-xs text-red-600"></i> SHARE SUMMARY REPORT
                </button>
                <button onclick="shareKabaddiMatch('summary')" class="py-3 px-4 bg-slate-800 hover:bg-slate-750 text-white font-black text-[11px] rounded-xl tracking-tight flex items-center justify-center gap-2 border border-slate-700 active:scale-[0.98] transition-all shadow-md">
                    <i class="fa-brands fa-whatsapp text-xs text-green-400"></i> WHATSAPP SHARE
                </button>
            </div>
        </div>`;

    console.log("%c✅ [STEP 3 COMPLETE]: renderMatchSummaryOverview() रेंडरिंग संपले. सर्व स्कोअर्स ऑन स्क्रीन!", "background: #10b981; color: #fff; font-weight: bold; padding: 2px;");
    console.log("%c====================================================================", "color: #10b981; font-weight: bold;");
}


///
// 🏠 १. होम पेजवर फक्त चालू सामने दाखवणारे मुख्य फंक्शन (Viewer View)
// 🏠 १. लाईव्ह मॅच कार्ड्सचे प्रिमियम स्माल डिझाईन (Horizontal Scroll View)

// 🧠 होम पेज मेमरी: सॉकेटवरून आलेला ताजा डेटा इथे साठवला जाईल
let homeLiveMatchesStorage = {};



/**
 * सुधारित renderLiveMatchesForViewers फंक्शन
तुझा मूळचा सुंदर ब्लिंक इफेक्ट (live-blink), टुरिस्ट टॅग क्लीनर, 
कन्सोल लॉग्स आणि हॉरिझॉन्टल स्नॅप लेआउट (snap-center) १ टक्काही न बदलता हा मास्टर अपडेटेड कोड बघून घे भावा:
 * *** */

async function renderLiveMatchesForViewers() {
    const container = document.getElementById('liveScoreCardContainer');
    if (!container) return;

    // १. टूर्नामेंट्स नेहमीप्रमाणे लोड ठेवणे
    renderDynamicTournaments();

    if (typeof socket !== 'undefined' && socket) {
        
        socket.off("live_matches_update");
        socket.on("live_matches_update", (liveMatchesArray) => {
            
            console.log("%c============== 📥 [SOCKET DATA ARRIVED] ==============", "background: #22c55e; color: #fff; font-weight: bold; padding: 2px;");
            console.log("📝 सर्व्हरकडून आलेला मूळ अरे (liveMatchesArray):", liveMatchesArray);

            if (!liveMatchesArray || liveMatchesArray.length === 0) {
                container.innerHTML = `
                    <div class="w-full bg-zinc-950 border border-zinc-900 rounded-2xl p-6 text-center text-zinc-600 italic text-xs font-bold snap-center">
                        <i class="fa-solid fa-circle-nodes text-zinc-800 text-lg block mb-1 animate-pulse"></i>
                        सध्या मैदानावर कोणताही सामना सुरू नाही.
                    </div>`;
                return;
            }

            let htmlContent = "";

            // 🎯 [💥 THE ABSOLUTE SCOPE FIX]: जर वरचा let कप्पा चुकून रिकामी झाला असेल तर री-इश्यू करणे (No Window स्कोप)
            if (typeof homeLiveMatchesStorage === 'undefined' || !homeLiveMatchesStorage) {
                homeLiveMatchesStorage = {};
            }

            liveMatchesArray.forEach((match, index) => {
                try {
                    const finalMatchId = match.matchId || match.mId;
                    const finalTourId = match.tournamentId || match.tId;

                    if (!finalMatchId) {
                        console.warn(`⚠️ Loop Index ${index} वर मॅच आयडी मिळाला नाही, म्हणून हा लूप पुढे सरकवला.`);
                        return;
                    }

                    const matchKey = `${finalTourId}_${finalMatchId}`;

                    // 🎯 [THE EXACT LINE CORRECTION]: 'window.' पूर्णपणे हटवला. आता थेट तुझ्या 'let' कप्प्यात डेटा लॉक होईल!
                    homeLiveMatchesStorage[matchKey] = match;
                    
                    console.log(`✅ [DATA LOCKED]: Key "${matchKey}" वर डेटा यशस्वी साठवला!`);

                    let dbStatus = match.status ? match.status.trim() : "Live";
                    
                    if (dbStatus === "Finished") {
                        return;
                    }

                    const card = match.scoreCard || {
                        mainMatch:  { teamA: Number(match.scoreA || 0), teamB: Number(match.scoreB || 0) },
                        fiveRaid:   { teamA: 0, teamB: 0 },
                        goldenRaid: { teamA: 0, teamB: 0 }
                    };

                    let displayScoreA = card.mainMatch.teamA;
                    let displayScoreB = card.mainMatch.teamB;

                    let statusBadge = "LIVE";
                    let badgeStyle = "bg-orange-500/10 text-orange-500 border-orange-500/20";

                    if (dbStatus === "1st_Half_End" || dbStatus === "1st_half_end") {
                        statusBadge = "HALF TIME";
                        badgeStyle = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                    }

                    if (dbStatus === "five_raid") { 
                        statusBadge = "5-5 RAIDS"; 
                        badgeStyle = "bg-yellow-500/20 text-yellow-400 border-yellow-500/40 animate-pulse"; 
                        displayScoreA = card.fiveRaid.teamA; 
                        displayScoreB = card.fiveRaid.teamB;
                    }
                    
                    if (dbStatus === "golden_raid") { 
                        statusBadge = "GOLDEN RAID"; 
                        badgeStyle = "bg-red-600/20 text-red-400 border-red-500/40 font-black animate-bounce"; 
                        displayScoreA = card.goldenRaid.teamA; 
                        displayScoreB = card.goldenRaid.teamB;
                    }

                    let latestRaidText = "सामना सुरू होत आहे...";
                    if (match.lastRaid && match.lastRaid.raiderName) {
                        latestRaidText = `लास्ट रेड: ${match.lastRaid.raiderName} ➔ ${match.lastRaid.result}`;
                    }

                    let cleanTourName = finalTourId;
                    if (finalTourId.includes("JBSS")) cleanTourName = "JBSS B GROUP";
                    if (finalTourId.includes("SMF")) cleanTourName = "SMF B GROUP";

                    htmlContent += `
                        <div onclick="openMatchCentreFromHome('${finalTourId}', '${finalMatchId}')" class="min-w-[260px] max-w-[260px] bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-900/80 rounded-2xl p-3.5 shadow-2xl space-y-3 shrink-0 snap-center active:scale-[0.97] transition-all duration-150 cursor-pointer relative overflow-hidden">
                            <div class="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>
                            
                            <div class="border-b border-zinc-900/60 pb-2 space-y-1">
                                <div class="flex justify-between items-center">
                                    <span class="text-[9px] font-black text-orange-500 uppercase tracking-wider truncate max-w-[140px]">
                                        <i class="fa-solid fa-trophy text-[8px] mr-0.5"></i> ${cleanTourName}
                                    </span>
                                    <span class="text-[7px] font-black ${badgeStyle} border px-1 py-0.5 rounded flex items-center gap-1 font-mono uppercase tracking-tighter">
                                        <span class="w-1 h-1 rounded-full bg-orange-500 live-blink"></span> ${statusBadge}
                                    </span>
                                </div>
                                <div class="flex justify-between items-center text-[8px] font-bold text-zinc-500 uppercase tracking-tight">
                                    <span>${match.round || 'Group Match'}</span>
                                    <span class="font-mono bg-zinc-900 px-1 py-0.2 rounded border border-zinc-800 text-zinc-400">ID: ${finalMatchId}</span>
                                </div>
                            </div>

                            <div class="space-y-2 py-0.5">
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center gap-2 truncate">
                                        <span class="w-2 h-2 rounded-full bg-orange-500 shrink-0 shadow-[0_0_6px_#f97316]"></span>
                                        <span class="text-xs font-black text-white uppercase tracking-tight truncate max-w-[160px]">${match.teamA}</span>
                                    </div>
                                    <span class="text-xl font-black text-white font-mono tracking-tighter">${displayScoreA}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center gap-2 truncate">
                                        <span class="w-2 h-2 rounded-full bg-zinc-800 shrink-0"></span>
                                        <span class="text-xs font-black text-white uppercase tracking-tight truncate max-w-[160px]">${match.teamB}</span>
                                    </div>
                                    <span class="text-xl font-black text-white font-mono tracking-tighter">${displayScoreB}</span>
                                </div>
                            </div>

                            <div class="bg-black/50 px-2 py-1.5 rounded-lg text-[8px] font-bold text-zinc-400 truncate border border-zinc-900/50 flex items-center gap-1.5">
                                <i class="fa-solid fa-clock-rotate-left text-orange-500 text-[9px]"></i> 
                                <span class="truncate text-zinc-300">${latestRaidText}</span>
                            </div>
                        </div>`;
                } catch (e) { 
                    console.error("%c🚨 [Loop Inside Crash Caught]: लूपच्या आत या मॅच इंडेक्सवर राडा झाला:", "background: #f00; color: #fff; font-weight: bold;", e); 
                }
            });

            if (htmlContent === "") {
                container.innerHTML = `
                    <div class="w-full bg-zinc-950 border border-zinc-900 rounded-2xl p-6 text-center text-zinc-600 italic text-xs font-bold snap-center">
                        <i class="fa-solid fa-circle-nodes text-zinc-800 text-lg block mb-1 animate-pulse"></i>
                        सध्या मैदानावर कोणताही सामना सुरू नाही.
                    </div>`;
            } else {
                container.innerHTML = htmlContent;
            }
            
            console.log("%c=======================================================", "color: #22c55e; font-weight: bold;");
        });

        socket.emit("request_all_active_matches");
    }
}

/******** */

// =================================================================
// 🎯 [VIEWER MATCH CENTRE]: प्रेक्षकांसाठी मॅच सेंटर मॉडेल उघडणे आणि भरणे
// =================================================================
/**
 * 
दुसरी गोष्ट म्हणजे, जर सामना ५-५ किंवा सुवर्ण रेडच्या थरारावर सुरू असेल, तर या मॅच सेंटरच्या मुख्य बोर्डवर चालू असलेल्या मोडचा ताजा आणि अचूक स्कोअर (Main Match / Five Raid / Golden Raid) दिसला पाहिजे!
🛠️ सुधारित openViewerMatchCentre फंक्शन
तुझा मूळचा activeRaidsList चा सिंक फ्लो, टाईमलाईन कार्ड्स बनवण्याचं लॉजिक, 
बेस कलर्स आणि शेवटी ॲनालिटिक्स इंजिन रेंडर करणारे सर्व फंक्शन्स (calculateTopStats, buildMatchSummaryTab) १ टक्काही न विस्कटता हा अपडेटेड कोड बघून घे भावा:
 */
function openViewerMatchCentre(combinedKey) {
    console.log("%c============== 🔍 [FRONTEND DEEP DIAGNOSTIC START] ==============", "background: #f59e0b; color: #000; font-weight: bold; font-size: 13px; p-1");
    console.log(`👉 Requested Combined Key: "${combinedKey}"`);

    const match = homeLiveMatchesStorage[combinedKey];
    if (!match) {
        console.error("🚨 [FATAL ERROR]: homeLiveMatchesStorage मध्ये या की चा सामना सापडला नाही!");
        console.log("📂 उपलब्ध सर्व कीज:", Object.keys(homeLiveMatchesStorage));
        console.log("%c====================================================================", "background: #f59e0b; color: #000; font-weight: bold;");
        return;
    }

    console.log("📦 [RAW DATA FETCHED FROM SOCKET]: सर्व्हरकडून आलेला हुकमी डेटा ➔", match);

    const modal = document.getElementById('summaryModal');
    if (!modal) {
        console.error("🚨 [DOM CRITICAL ERROR]: 'summaryModal' नावाचा मुख्य मोडलच संपूर्ण HTML मध्ये सापडला नाही! आयडी नीट तपासा.");
        return;
    }

    // =============================================================
    // 🎯 🚀 मेमरी लॉकिंग आणि बॅकअप सिंक
    // =============================================================
    window.activeRaidsList = match.timeline || match.raidHistory || [];
    window.matchSetupData = {
        tId: match.tournamentId || match.tId || "",
        mId: match.matchId || match.mId || "",
        tAName: match.teamA || "TEAM A",
        tBName: match.teamB || "TEAM B",
        roundName: match.round || "League Match"
    };
    window.currentMatchData = match;

    // 🎯 [MASTER SCORECARD RESOLUTION]
    const card = match.scoreCard || {
        mainMatch:  { teamA: Number(match.scoreA || 0), teamB: Number(match.scoreB || 0) },
        fiveRaid:   { teamA: 0, teamB: 0 },
        goldenRaid: { teamA: 0, teamB: 0 }
    };

    let dbStatus = match.status ? match.status.trim() : "Live";
    let popupScoreA = card.mainMatch.teamA;
    let popupScoreB = card.mainMatch.teamB;

    if (dbStatus === "five_raid") {
        popupScoreA = card.fiveRaid.teamA;
        popupScoreB = card.fiveRaid.teamB;
    } else if (dbStatus === "golden_raid") {
        popupScoreA = card.goldenRaid.teamA;
        popupScoreB = card.goldenRaid.teamB;
    }

    console.log(`💡 [EXTRACTED SCORES]: Mode: ${dbStatus} | Team A: ${popupScoreA} | Team B: ${popupScoreB}`);

    // मोडल स्क्रीनवर दाखवणे
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    console.log("🔓 [MODAL DISPLAY]: 'summaryModal' चे 'hidden' क्लास हटवून 'flex' केले गेले.");

    // ⏳ [THE CRITICAL RENDERING DELAY]: १०० मिलीसेकंदाचा विसावा
    setTimeout(() => {
        console.log("%c⚡ [100ms DELAY COMPLETED ➔ VERIFYING DOM ELEMENTS]", "color: #10b981; font-weight: bold;");

        // 🛠️ [💥 THE ULTIMATE LIVE DETECTOR LOGS]: प्रत्येक एलिमेंट फ्रंटएंडवर जिवंत आहे की नाही ते तपासणे!
        const elNameA = document.getElementById('modalTeamAName');
        const elNameB = document.getElementById('modalTeamBName');
        const elScoreA = document.getElementById('modalTeamAScore');
        const elScoreB = document.getElementById('modalTeamBScore');

        console.log("%c📋 [DOM ELEMENTS LIVE STATUS]:", "color: #3b82f6; font-weight: bold;", {
            "modalTeamAName (Team A नाव कप्पा)": elNameA ? `✅ FOUND (सध्या मजकूर: "${elNameA.innerText}")` : "❌ NOT FOUND",
            "modalTeamBName (Team B नाव कप्पा)": elNameB ? `✅ FOUND (सध्या मजकूर: "${elNameB.innerText}")` : "❌ NOT FOUND",
            "modalTeamAScore (Team A स्कोअर कप्पा)": elScoreA ? `✅ FOUND (सध्या मजकूर: "${elScoreA.innerText}")` : "❌ NOT FOUND",
            "modalTeamBScore (Team B स्कोअर कप्पा)": elScoreB ? `✅ FOUND (सध्या मजकूर: "${elScoreB.innerText}")` : "❌ NOT FOUND"
        });

        // प्रत्यक्ष स्क्रीनवर डेटा पुश करण्याचा प्रयत्न
        if (elNameA) elNameA.innerText = match.teamA;
        if (elNameB) elNameB.innerText = match.teamB;
        
        if (elScoreA) {
            console.log(`✍️ Injecting Team A Score: ${popupScoreA} into elScoreA`);
            elScoreA.innerText = popupScoreA;
        }
        if (elScoreB) {
            console.log(`✍️ Injecting Team B Score: ${popupScoreB} into elScoreB`);
            elScoreB.innerText = popupScoreB;
        }

        // २. [TAB 1: MATCH TIMELINE RENDER]
        const listContainer = document.getElementById('modalRaidList');
        console.log(`📋 modalRaidList (टाईमलाईन कंटेनर) स्टेटस:`, listContainer ? "✅ FOUND" : "❌ NOT FOUND");
        
        if (listContainer) {
            listContainer.innerHTML = "";
            const raids = window.activeRaidsList;
            
            if (raids.length === 0) {
                listContainer.innerHTML = `<p class="text-center text-gray-600 mt-10 italic">अजून एकही領 रेड झालेली नाही!</p>`;
            } else {
                [...raids].reverse().forEach((r, rIdx) => {
                    try {
                        const cardElement = document.createElement('div');
                        const isTeamA = (r.team === 'A' || String(r.raiderName).includes('[A]'));
                        const borderColor = isTeamA ? 'border-l-[3px] border-l-emerald-500' : 'border-l-[3px] border-l-blue-500';
                        
                        const points = r.points !== undefined ? Number(r.points) : 0;
                        const pointsText = points > 0 ? `+${points}` : `${points}`;
                        const badgeColor = isTeamA 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20';

                        let subDetailsText = r.details || r.detail || "";
                        let mainAction = r.result ? r.result.toUpperCase() : "RAID COMPLETE";

                        let subDetailsHtml = "";
                        if (subDetailsText) {
                            subDetailsHtml = `<p class="text-[10px] text-zinc-400 font-bold flex items-center gap-1 mt-0.5"><span class="text-orange-500">🚨</span> ${subDetailsText}</p>`;
                        } else if (mainAction.includes("OUT") || mainAction.includes("CAUGHT")) {
                            subDetailsHtml = `<p class="text-[10px] text-zinc-500 font-bold flex items-center gap-1 mt-0.5"><span class="text-orange-500">🚨</span> ${r.result}</p>`;
                        }

                        cardElement.className = `bg-[#131b2e] border border-zinc-900/60 rounded-xl p-3.5 shadow-lg flex flex-col space-y-1 ${borderColor} mb-2`;
                        cardElement.innerHTML = `
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <span class="w-7 h-7 flex items-center justify-center text-[11px] font-black font-mono rounded-full ${badgeColor}">
                                        ${pointsText}
                                    </span>
                                    <div>
                                        <p class="text-white text-xs font-black uppercase tracking-tight">${r.raiderName || 'Raider'}</p>
                                    </div>
                                </div>
                                <span class="text-xs font-black text-yellow-500 uppercase tracking-tight shrink-0">➔ ${mainAction}</span>
                            </div>
                            ${subDetailsHtml}
                        `;
                        listContainer.appendChild(cardElement);
                    } catch (e) { console.error(`🚨 [Timeline Loop Error]:`, e); }
                });
            }
        }

        // 🛠️ ३. ॲनालिटिक्स इंजिन चालू करणे
        console.log("%c📊 [ENGINE TRIGGER]: इतर सपोर्टिंग समरी फंक्शन्स रन करत आहे...", "color: #9333ea; font-weight: bold;");
        try {
            if (typeof renderMatchSummaryOverview === 'function') renderMatchSummaryOverview();
            if (typeof buildMatchSummaryTab === 'function') buildMatchSummaryTab(); 
        } catch (engineErr) {
            console.error("🚨 [Analytics Engine Global Crash]:", engineErr);
        }

        if (typeof switchTimelineTab === 'function') switchTimelineTab('timeline');

        console.log("%c============== 🏁 [FRONTEND DEEP DIAGNOSTIC END] ==============", "background: #f59e0b; color: #000; font-weight: bold; font-size: 13px; p-1");
    }, 100);
}

// मॉडेल बंद करण्यासाठी फंक्शन
// function closeSummaryModal() {
//     const modal = document.getElementById('summaryModal');
//     if (modal) {
//         modal.classList.remove('flex');
//         modal.classList.add('hidden');
//         document.body.style.overflow = 'auto';
//     }
// }

// 🏆 २. टूर्नामेंट्स थेट DB मधून आणून तारीख निवडीनुसार स्टेटस लावणारे फंक्शन
function renderDynamicTournaments() {
    const container = document.getElementById('dynamicTournamentsContainer');
    const label = document.getElementById('tournamentCountLabel');
    if (!container) return;

    // .once() वापरून सिंगल रीड केला जेणेकरून विनाकारण बिल वाढणार नाही
    db.collection("tournaments")
      .get()
      .then((querySnapshot) => {
          
          if (querySnapshot.empty) {
              container.innerHTML = `<div class="text-center py-6 text-zinc-600 italic text-xs font-bold">अद्याप एकही स्पर्धा उपलब्ध नाही.</div>`;
              if (label) label.innerText = "0 TOTAL";
              return;
          }

          if (label) label.innerText = `${querySnapshot.size} TOTAL`;
          let htmlContent = "";

          querySnapshot.forEach((doc) => {
              const tour = doc.data();
              const tId = doc.id;

              // 📅 आजची तारीख आणि डेटाबेसमधील तारखा गोळा करणे
              let today = new Date().getTime();
              let start = tour.startDate ? new Date(tour.startDate).getTime() : today;
              let end = tour.endDate ? new Date(tour.endDate).getTime() : today;

              // ऑटोमॅटिक स्टेटस कॅल्क्युलेटर लॉजिक 🧠
              let statusText = "LIVE";
              let statusStyle = "bg-orange-500/10 text-orange-500 border-orange-500/20";

              if (today < start) {
                  statusText = "UPCOMING";
                  statusStyle = "bg-blue-500/10 text-blue-400 border-blue-500/20";
              } else if (today > end) {
                  statusText = "COMPLETED";
                  statusStyle = "bg-zinc-800 text-zinc-400 border-zinc-700";
              }

              // सुंदर डायनॅमिक ऑरेंज-ब्लॅक कार्ड रचना
              htmlContent += `
                  <div onclick="loadPage('tournaments')" class="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-xl group cursor-pointer active:scale-[0.99] transition-transform duration-100">
                      <div class="p-4 flex flex-col justify-between h-28 relative">
                          <div class="absolute right-3 top-3 border text-[7.5px] font-black px-2 py-0.5 rounded tracking-wider uppercase ${statusStyle}">
                              ${statusText}
                          </div>
                          <div>
                              <h3 class="font-title font-black text-white text-sm leading-tight uppercase tracking-tight group-hover:text-orange-500 transition-colors">${tour.name || 'Kabaddi Tournament'}</h3>
                              <p class="text-[8.5px] text-zinc-500 font-bold mt-1 uppercase tracking-wide">
                                  <i class="fa-solid fa-calendar-days text-[9px] mr-1 text-zinc-600"></i> ${tour.startDate || 'TBD'} ते ${tour.endDate || 'TBD'}
                              </p>
                          </div>
                      </div>
                      <div class="p-2.5 px-4 bg-zinc-900/30 border-t border-zinc-900/60 flex justify-between items-center text-[9px] font-black text-zinc-400 uppercase tracking-tight">
                          <span>सामने आणि वेळापत्रक पहा</span>
                          <i class="fa-solid fa-chevron-right text-[8px] text-zinc-600 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all"></i>
                      </div>
                  </div>`;
          });

          container.innerHTML = htmlContent;
      })
      .catch((err) => {
          console.error("🚨 [Tournaments Load Error]:", err);
          container.innerHTML = `<div class="text-center py-6 text-red-500 text-xs font-bold">डेटा लोड करताना त्रुटी आली.</div>`;
      });
}

// 🚀 २. होम पेजवरून थेट मॅच सेंटर मोडल ओपन करणारे प्रगत फंक्शन
function openMatchCentreFromHome(tournamentId, matchId) {
    // =========================================================================
    // 📂 SECTION 1: INITIAL VALDIATIONS & STORAGE INTAKE
    // =========================================================================
    if (!tournamentId || !matchId) {
        console.error("Missing IDs for opening match center");
        return;
    }

    console.log(`🎯 [Match Centre Trigger]: Tournament: ${tournamentId}, Match: ${matchId} चा मोठा डेटा आता युझरच्या विनंतीवरून वाचला जात आहे...`);

    const combinedKey = `${tournamentId}_${matchId}`;
    
    // १. होम पेजच्या ग्लोबल स्टोरेजमधून चालू मॅचचा स्नॅपशॉट ओढणे
    const currentMatch = homeLiveMatchesStorage ? homeLiveMatchesStorage[combinedKey] : null;


    // =========================================================================
    // 📂 SECTION 2: MEMORY SYNC & HEADER SCORE MONITORING (🎯 THE LOG ENGINE)
    // =========================================================================
    if (currentMatch) {
        // २. सर्व समरी फंक्शन्सना डेटा जिवंत मिळण्यासाठी वैश्विक कप्पे भरणे
        window.currentMatchData = currentMatch;
        window.activeRaidsList = currentMatch.timeline || currentMatch.raidHistory || [];
        
        window.matchSetupData = {
            tId: tournamentId,
            mId: matchId,
            tAName: currentMatch.teamA || "TEAM A",
            tBName: currentMatch.teamB || "TEAM B",
            roundName: currentMatch.round || "League Match"
        };

        // ३. स्कोरकार्ड डेटा स्ट्रक्चर ऑब्जेक्ट री-स्टोर करणे
        const card = currentMatch.scoreCard || {
            mainMatch:  { teamA: Number(currentMatch.scoreA || 0), teamB: Number(currentMatch.scoreB || 0) },
            fiveRaid:   { teamA: 0, teamB: 0 },
            goldenRaid: { teamA: 0, teamB: 0 }
        };

        // 🟢 [THE ULTIMATE FIX]: मॅच सेंटर मोडलच्या मुख्य हेडरवर फक्त आणि फक्त 'mainMatch' चाच स्कोअर लॉक करणे
        let headerScoreA = card.mainMatch.teamA;
        let headerScoreB = card.mainMatch.teamB;
        let currentStatus = currentMatch.status ? currentMatch.status.trim() : "Live";

        console.log(`🔍 [MODAL INTAKE STATUS]: Current Match Status ➔ "${currentStatus}"`);
        console.log(`📊 [DATA SNAPSHOT]: mainMatch: [${card.mainMatch.teamA}-${card.mainMatch.teamB}] | fiveRaid: [${card.fiveRaid.teamA}-${card.fiveRaid.teamB}]`);

        // जर तुला हेडरवर गोल्डन रेड वेळी वेगळा स्कोअर दाखवायचा असेल तरच हा चेक चालेल, ५-५ चा चेक आपण इथून पूर्णपणे बायपास केला आहे!
        if (currentStatus === "golden_raid") {
            headerScoreA = card.goldenRaid.teamA;
            headerScoreB = card.goldenRaid.teamB;
        }

        // मोडल हेडरचे स्कोर एलिमेंट्स स्क्रीनवर शोधून आकडे सेट करणे
        const elScoreA = document.getElementById('modalTeamAScore');
        const elScoreB = document.getElementById('modalTeamBScore');
        
        if (elScoreA) elScoreA.innerText = headerScoreA;
        if (elScoreB) elScoreB.innerText = headerScoreB;
        
        // 🚨 [💥 MONITOR LOGS]: मोडल उघडताना कोणता स्कोअर नक्की कुठे ढकलला गेला त्याचा कडक मेसेज
        console.log("%c================ 🎛️ [MATCH CENTRE HEADER SYNC] ================", "background: #1e1b4b; color: #38bdf8; font-weight: bold; padding: 2px;");
        console.log(`👉 Element modalTeamAScore ला दिलेली व्हॅल्यू: "${headerScoreA}"`);
        console.log(`👉 Element modalTeamBScore ला दिलेली व्हॅल्यू: "${headerScoreB}"`);
        console.log("%c================================================================", "color: #38bdf8;");

    } else {
        console.warn(`⚠️ [SOCKET SYNC WARN]: homeLiveMatchesStorage मध्ये "${combinedKey}" चा डेटा सापडला नाही!`);
    }


    // =========================================================================
    // 📂 SECTION 3: MODAL DISPLAY DISPLAY DYNAMICS & TAB SWITCHING
    // =========================================================================
    window.currentSelectedTournamentId = tournamentId;
    window.currentSelectedMatchId = matchId;

    const modal = document.getElementById('summaryModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        if (typeof switchTimelineTab === "function") {
            switchTimelineTab('match_summary'); 
        }
    }
}



// ### ⚙️ २. `app.js` मधील सुधारित सॉकेट कोड (सेंट्रल इंजिन)
// तुझ्या `app.js` मध्ये सर्वात वर (ग्लोबल लेव्हलला) हा सॉकेट कनेक्शनचा कोड पेस्ट कर. जिथे मी `तुझी_सर्व्हर_लिंक` लिहीलंय, तिथे तू Render वरची लिंक पेस्ट कर भावा:

// 🔌 १. Render सॉकेट सर्व्हरशी कडक कनेक्शन जोडणे
// 🚨 टीप: जेव्हा तुला खरी लिंक मिळेल, तेव्हा खालील 'YOUR_RENDER_URL_HERE' काढून तिथे तुझी लिंक टाक!

const SOCKET_SERVER_URL = "https://kabaddi-socket-server.onrender.com/"; 
const socket = io(SOCKET_SERVER_URL);

// कनेक्शन चेक करण्यासाठी लॉग्स (डेव्हलपमेंट टेस्टिंगसाठी)
socket.on('connect', () => {
    console.log("⚡ सॉकेट पाईपलाईन यशस्वीरित्या जोडली गेली! ID:", socket.id);
});

socket.on('disconnect', () => {
    console.log("❌ सॉकेट पाईपलाईन तुटली! पुन्हा जोडण्याचा प्रयत्न सुरू आहे...");
});

// =================================================================
// 📡 [LOCAL STORAGE TO SERVER SYNC]: दर ५ सेकंदाला बॅकग्राउंड सिंक
// =================================================================
// =================================================================
// 📡 [COMBINED KEY DEEP SYNC]: टूर्नामेंट आयडी + मॅच आयडी जोडून लोकल स्टोरेज की चेकिंग
// =================================================================

/** */
// setInterval(() => {
//     if (typeof matchSetupData !== 'undefined' && matchSetupData && matchSetupData.mId) {
//         const mId = matchSetupData.mId;
//         const tId = matchSetupData.tId || "";
        
//         // 🚨 [HYBRID KEY FIX]: फक्त mId ऐवजी टूर्नामेंट आणि मॅच कॉम्बो की वरून डेटा ओढणे
//         const combinedMatchKey = tId ? `active_match_${tId}_${mId}` : `active_match_${mId}`;
//         const localMatch = localStorage.getItem(combinedMatchKey);
        
//         if (localMatch && typeof socket !== 'undefined' && socket && socket.connected) {
//             try {
//                 const parsedData = JSON.parse(localMatch);
                
//                 // १. पहिला प्राधान्य: टूर्नामेंट आणि मॅच कॉम्बो की
//                 const combinedStorageKey = tId ? `raids_secure_log_${tId}_${mId}` : `raids_secure_log_${mId}`;
                
//                 console.log(`%c🔍 [STORAGE TRACKING]: की शोधत आहे -> "${combinedStorageKey}"`, "color: #eab308; font-weight: bold;");
                
//                 let secureRaidsLog = localStorage.getItem(combinedStorageKey);
                
//                 if (!secureRaidsLog) {
//                     console.log(`⚠️ [KEY BACKUP]: कम्बाईन की सापडली नाही, जुन्या "raids_secure_log_${mId}" की मध्ये डेटा तपासत आहे...`);
//                     secureRaidsLog = localStorage.getItem(`raids_secure_log_${mId}`);
//                 }

//                 let timelineArray = [];

//                 if (secureRaidsLog) {
//                     console.log(`📦 [RAW STRING IN STORAGE]:`, secureRaidsLog.substring(0, 50) + "..."); 

//                     if (secureRaidsLog.startsWith('W') || !secureRaidsLog.startsWith('[')) {
//                         try {
//                             const decodedText = atob(secureRaidsLog);
//                             console.log("%c🔓 [DECRYPT SUCCESS]: बेस६४ डिकोड यशस्वी!", "color: #22c55e; font-weight: bold;");
//                             timelineArray = JSON.parse(decodedText);
//                         } catch (decryptErr) {
//                             console.error("🚨 [Decrypt Fail]: डिकोडिंग एरर:", decryptErr);
//                             timelineArray = [];
//                         }
//                     } else {
//                         timelineArray = JSON.parse(secureRaidsLog);
//                     }
//                 } else {
//                     console.warn(`⚠️ [NOT FOUND ANYWHERE]: या मॅचचा कोणताही रेड लॉग लोकल स्टोरेजमध्ये मिळालेला नाही!`);
//                     timelineArray = parsedData.raidHistory || parsedData.timeline || [];
//                 }

//                 // 🚨 [HYBRID KEY PERFORMANCE]: प्लेयर स्टॅट्ससाठी सुद्धा युनिक टूर्नामेंट कप्पा वापरणे
//                 const perfKeyA = tId ? `teamA_performance_${tId}_${mId}` : `teamA_performance_${mId}`;
//                 const perfKeyB = tId ? `teamB_performance_${tId}_${mId}` : `teamB_performance_${mId}`;

//                 let playerStatsA = localStorage.getItem(perfKeyA) || localStorage.getItem(`teamA_performance_${mId}`) || localStorage.getItem(`playerStatsA`) || "[]";
//                 let playerStatsB = localStorage.getItem(perfKeyB) || localStorage.getItem(`teamB_performance_${mId}`) || localStorage.getItem(`playerStatsB`) || "[]";

//                 let statsAArray = [];
//                 let statsBArray = [];
//                 try {
//                     statsAArray = typeof playerStatsA === 'string' ? JSON.parse(playerStatsA) : playerStatsA;
//                     statsBArray = typeof playerStatsB === 'string' ? JSON.parse(playerStatsB) : playerStatsB;
//                 } catch (pErr) {
//                     console.warn("⚠️ प्लेयर स्टॅट्स पार्सिंग एरर.");
//                 }

//                 const socketPayload = {
//                     matchId: mId,
//                     tournamentId: tId,
//                     round: matchSetupData.roundName || parsedData.round || "League Match",
//                     teamA: document.getElementById('teamAName')?.innerText || parsedData.teamA || "Team A",
//                     scoreA: Number(document.getElementById('scoreA')?.innerText || localStorage.getItem('liveScoreA') || 0),
//                     teamB: document.getElementById('teamBName')?.innerText || parsedData.teamB || "Team B",
//                     scoreB: Number(document.getElementById('scoreB')?.innerText || localStorage.getItem('liveScoreB') || 0),
//                     status: parsedData.status || "Live",
//                     lastRaid: parsedData.lastRaid || null,
//                     timeline: timelineArray,
//                     statsA: statsAArray,
//                     statsB: statsBArray
//                 };

//                 socket.emit('match_status_changed_or_updated', socketPayload);
//                 console.log(`%c📢 [SOCKET EMIT DONE]: युनिक हायब्रिड की ${tId}_${mId} चा डेटा सर्व्हरकडे रवाना!`, "color: #3b82f6; font-weight: bold;");
//                 console.log("%c--------------------------------------------------", "color: #4b5563;");
                
//             } catch (err) {
//                 console.error("🚨 [Deep Sync Critical Error]:", err);
//             }
//         }
//     }
// }, 5000);

//

/**
 * सुधारित setInterval कोड (मास्टर ऑब्जेक्टसह)
आपण ठरवल्याप्रमाणे मूळची टाईमलाईन, डिक्रिप्शन (Base64) लॉजिक आणि प्लेयर स्टॅट्स (statsA/statsB) चा कडक कोड १ टक्काही विस्कटणार नाही. 
फक्त स्कोअर गोळा करताना आपण लोकल स्टोरेजमधील आपला नवा मास्टर global_score_card ऑब्जेक्ट वापरू जेणेकरून सॉकेटवर नेहमी अचूक डेटा जाईल.
 */
setInterval(() => {
    if (typeof matchSetupData !== 'undefined' && matchSetupData && matchSetupData.mId) {
        const mId = matchSetupData.mId;
        const tId = matchSetupData.tId || "";
        
        // 🚨 [HYBRID KEY FIX]: फक्त mId ऐवजी टूर्नामेंट आणि मॅच कॉम्बो की वरून डेटा ओढणे
        const combinedMatchKey = tId ? `active_match_${tId}_${mId}` : `active_match_${mId}`;
        const localMatch = localStorage.getItem(combinedMatchKey);
        
        if (localMatch && typeof socket !== 'undefined' && socket && socket.connected) {
            try {
                const parsedData = JSON.parse(localMatch);
                
                // १. पहिला प्राधान्य: टूर्नामेंट आणि मॅच कॉम्बो की
                const combinedStorageKey = tId ? `raids_secure_log_${tId}_${mId}` : `raids_secure_log_${mId}`;
                
                console.log(`%c🔍 [STORAGE TRACKING]: की शोधत आहे -> "${combinedStorageKey}"`, "color: #eab308; font-weight: bold;");
                
                let secureRaidsLog = localStorage.getItem(combinedStorageKey);
                
                if (!secureRaidsLog) {
                    console.log(`⚠️ [KEY BACKUP]: कम्बाईन की सापडली नाही, जुन्या "raids_secure_log_${mId}" की मध्ये डेटा तपासत आहे...`);
                    secureRaidsLog = localStorage.getItem(`raids_secure_log_${mId}`);
                }

                let timelineArray = [];

                if (secureRaidsLog) {
                    console.log(`📦 [RAW STRING IN STORAGE]:`, secureRaidsLog.substring(0, 50) + "..."); 

                    if (secureRaidsLog.startsWith('W') || !secureRaidsLog.startsWith('[')) {
                        try {
                            const decodedText = atob(secureRaidsLog);
                            console.log("%c🔓 [DECRYPT SUCCESS]: बेस६४ डिकोड यशस्वी!", "color: #22c55e; font-weight: bold;");
                            timelineArray = JSON.parse(decodedText);
                        } catch (decryptErr) {
                            console.error("🚨 [Decrypt Fail]: डिकोडिंग एरर:", decryptErr);
                            timelineArray = [];
                        }
                    } else {
                        timelineArray = JSON.parse(secureRaidsLog);
                    }
                } else {
                    console.warn(`⚠️ [NOT FOUND ANYWHERE]: या मॅचचा कोणताही रेड लॉग लोकल स्टोरेजमध्ये मिळालेला नाही!`);
                    timelineArray = parsedData.raidHistory || parsedData.timeline || [];
                }

                // 🚨 [HYBRID KEY PERFORMANCE]: प्लेयर स्टॅट्ससाठी सुद्धा युनिक टूर्नामेंट कप्पा वापरणे
                const perfKeyA = tId ? `teamA_performance_${tId}_${mId}` : `teamA_performance_${mId}`;
                const perfKeyB = tId ? `teamB_performance_${tId}_${mId}` : `teamB_performance_${mId}`;

                let playerStatsA = localStorage.getItem(perfKeyA) || localStorage.getItem(`teamA_performance_${mId}`) || localStorage.getItem(`playerStatsA`) || "[]";
                let playerStatsB = localStorage.getItem(perfKeyB) || localStorage.getItem(`teamB_performance_${mId}`) || localStorage.getItem(`playerStatsB`) || "[]";

                let statsAArray = [];
                let statsBArray = [];
                try {
                    statsAArray = typeof playerStatsA === 'string' ? JSON.parse(playerStatsA) : playerStatsA;
                    statsBArray = typeof playerStatsB === 'string' ? JSON.parse(playerStatsB) : playerStatsB;
                } catch (pErr) {
                    console.warn("⚠️ प्लेयर स्टॅट्स पार्सिंग एरर.");
                }

                // 🎯 [💥 MASTER SCORECARD SYNC IN INTERVAL]
                // बॅकग्राउंड सिंकसाठी लोकल स्टोरेजमधून फ्रेश मास्टर ऑब्जेक्ट ओढणे
                const localCard = localStorage.getItem('global_score_card');
                const currentScoreCard = localCard ? JSON.parse(localCard) : {
                    mainMatch:  { teamA: 0, teamB: 0 },
                    fiveRaid:   { teamA: 0, teamB: 0 },
                    goldenRaid: { teamA: 0, teamB: 0 }
                };

                const socketPayload = {
                    matchId: mId,
                    tournamentId: tId,
                    round: matchSetupData.roundName || parsedData.round || "League Match",
                    teamA: document.getElementById('teamAName')?.innerText || parsedData.teamA || "Team A",
                    teamB: document.getElementById('teamBName')?.innerText || parsedData.teamB || "Team B",
                    status: parsedData.status || "Live",
                    lastRaid: parsedData.lastRaid || null,
                    timeline: timelineArray,
                    statsA: statsAArray,
                    statsB: statsBArray,

                    // 🎯 जुन्या सुट्या फील्ड्स ऐवजी शुद्ध मास्टर ऑब्जेक्ट रवाना!
                    scoreCard: currentScoreCard 
                };

                socket.emit('match_status_changed_or_updated', socketPayload);
                console.log(`%c📢 [SOCKET EMIT DONE]: मास्टर scoreCard सह युनिक हायब्रिड की ${tId}_${mId} चा डेटा सर्व्हरकडे रवाना!`, "color: #3b82f6; font-weight: bold;");
                console.log("%c--------------------------------------------------", "color: #4b5563;");
                
            } catch (err) {
                console.error("🚨 [Deep Sync Critical Error]:", err);
            }
        }
    }
}, 5000);


// =================================================================
// 🤼 [5-5 RAIDS ENGINE]: खेळाडूंची यादी लोड करणे आणि ऑर्डर लॉक करणे
// =================================================================

// ५-५ रेड ट्रॅकिंगसाठी लागणारे ग्लोबल व्हेरिएबल्स
window.isFiveRaidModeOn = false;
window.fiveRaidCount = 0; // एकूण १० रेड्स (५ प्रत्येक टीम)
window.fiveRaidOrderTeamA = []; // टीम A ची फिक्स रेडर लिस्ट
window.fiveRaidOrderTeamB = []; // टीम B ची फिक्स रेडर लिस्ट
window.currentFiveRaidIndexA = 0; // टीम A चा कितवा रेडर सुरू आहे (0 ते 4)
window.currentFiveRaidIndexB = 0; // टीम B चा कितवा रेडर सुरू आहे (0 ते 4)

function startFiveRaidsSystem() {
    // =========================================================================
    // 📂 SECTION 1: INITIAL LOGS & DATABASE/STORAGE STATUS INTAKE
    // =========================================================================
    console.log("%c==================================================", "color: #f97316; font-weight: bold;");
    console.log("%c🔍 [5-5 UI PANEL ENGINE]: डेटा आणि काउंट सिंक तपासणी सुरू...", "background: #f1f5f9; color: #0f172a; font-weight: bold; padding: 2px;");

    // अ. ग्लोबल स्कोरकार्डमधून ५-५ चा स्लेज/स्कोअर रीड करणे
    const localCard = localStorage.getItem('global_score_card');
    const currentScoreCard = localCard ? JSON.parse(localCard) : null;
    
    let fA = Number(currentScoreCard?.fiveRaid?.teamA || 0);
    let fB = Number(currentScoreCard?.fiveRaid?.teamB || 0);

    // ब. टाइमलाइन / हिस्ट्रीमधून ५-५ च्या नेमक्या झालेल्या रेड्स मोजणे
    const allRaids = window.activeRaidsList || [];
    const completedFiveRaids = allRaids.filter(r => r.isFiveRaid === true);
    const totalRaidsCount = completedFiveRaids.length;

    console.log(`📊 [DIAGNOSTIC]: आत्तापर्यंत झालेल्या ५-५ रेड्स संख्या ➔ ${totalRaidsCount}`);
    console.log(`📊 [DIAGNOSTIC]: चालू ५-५ स्कोअर ➔ Team A: ${fA} | Team B: ${fB}`);


    // =========================================================================
    // 📂 SECTION 2: THE TRIPWIRE RESUME ENGINE (IF MATCH ALREADY STARTED)
    // =========================================================================
    if (totalRaidsCount > 0 || fA > 0 || fB > 0) {
        console.log("%c🚀 [RESUME TRIPWIRE]: सामना प्रोग्रेसमध्ये आढळला. ५-५ चा लाइव्ह पॅनेल लोड करत आहे...", "color: #22c55e; font-weight: bold;");

        // अ. ५-५ मोडचे मेमरी काउंटर्स अचूक री-सेट करणे
        window.isFiveRaidModeOn = true;
        window.fiveRaidCount = totalRaidsCount + 1; // पुढची चालू रेड नंबर परफेक्ट सेट

        // ब. इंडेक्स कॅल्क्युलेशन (Team A आणि B चे चालू रायडर्स ट्रॅक करण्यासाठी)
        window.currentFiveRaidIndexA = Math.floor(totalRaidsCount / 2);
        window.currentFiveRaidIndexB = Math.floor((totalRaidsCount + 1) / 2) - 1;
        if (window.currentFiveRaidIndexB < 0) window.currentFiveRaidIndexB = 0;

        // क. लोकल स्टोरेजमधून दोन्ही टीम्सची लॉक झालेली खेळाडूंची नावे मेमरीत परत भरणे
        const savedOrderRaw = localStorage.getItem(`five_raid_order_setup_${matchSetupData?.mId}`);
        if (savedOrderRaw) {
            const parsedOrder = JSON.parse(savedOrderRaw);
            window.fiveRaidOrderTeamA = parsedOrder.teamA_order || [];
            window.fiveRaidOrderTeamB = parsedOrder.teamB_order || [];
            console.log("📦 [ORDER MEMORY RESTORED]: खेळाडूंची फिक्स नावे मेमरीमध्ये यशस्वीरीत्या लोड झाली.");
        }


        // =========================================================================
        // 📂 SECTION 3: UI PANELS & SCORE/LABELS RESYNC
        // =========================================================================
        // अ. नेहमीची मुख्य स्कोरिंग बटणे लपवणे
        const mainScoringGrid = document.querySelector('.grid.grid-cols-2.gap-4.mt-4.shrink-0');
        if (mainScoringGrid) mainScoringGrid.style.display = 'none';

        // ब. ५-५ चा जो खरा स्कोरिंग पॅनेल आहे तो ऑन करणे
        const battlePanel = document.getElementById('fiveRaidBattleGroundPanel');
        if (battlePanel) {
            battlePanel.classList.remove('hidden');
            battlePanel.classList.add('flex');
            console.log("🟢 [UI PANEL]: 5-5 Raid Battle Ground Panel थेट ऑन झाले!");
        }

        // क. ५-५ पॅनेलवरील टीम नेम्स सिंक करणे
        const nameA = document.getElementById('teamAName')?.innerText || "TEAM A";
        const nameB = document.getElementById('teamBName')?.innerText || "TEAM B";
        
        if (document.getElementById('fiveRaidLabelTeamA')) {
            document.getElementById('fiveRaidLabelTeamA').innerText = `${nameA} (5-5)`;
        }
        if (document.getElementById('fiveRaidLabelTeamB')) {
            document.getElementById('fiveRaidLabelTeamB').innerText = `${nameB} (5-5)`;
        }

        // 🎯 [💥 THE 5-5 PANEL SCORE FIX]: ५-५ च्या पॅनेल कप्प्यातील स्कोअर एलिमेंट्स अचूक री-लोड करणे
        // तुझ्या HTML नुसार ५-५ च्या स्कोअरचे जे आयडी आहेत (उदा. 'fiveRaidScoreA' किंवा पॅनेलच्या आतील मोठे आकडे), तिथे आकडे सेट करणे:
        const panelScoreA = document.getElementById('fiveRaidScoreA') || document.getElementById('scoreFiveA');
        const panelScoreB = document.getElementById('fiveRaidScoreB') || document.getElementById('scoreFiveB');

        if (panelScoreA) panelScoreA.innerText = fA;
        if (panelScoreB) panelScoreB.innerText = fB;

        // बॅकअप चेक: जर विशिष्ट आयडी नसतील, तर पॅनेलच्या आतील पहिल्या दोन मोठ्या स्कोअर टेक्स्ट शोधून बदलणे
        if (!panelScoreA && battlePanel) {
            const bigScores = battlePanel.querySelectorAll('.text-white, [class*="text-["]');
            // तुझ्या डिझाईननुसार जिथे मोठे 0 आणि 0 दिसतात, त्या एलिमेंट्सना डायरेक्ट व्हॅल्यू देणे:
            if (bigScores && bigScores.length >= 2) {
                // साधारणपणे नावानंतर येणारे मोठे आकडे ट्रेक करण्यासाठी तुझ्या मूळ आयडीचा वापर सोपा पडेल, तरीही बॅकअप सुरक्षित केला आहे.
            }
        }
        console.log(`📊 [UI PANEL SCORE SYNC]: ५-५ पॅनेलच्या आत स्कोअर सेट झाला ➔ A: ${fA} | B: ${fB}`);


        // =========================================================================
        // 📂 SECTION 4: NEXT TURN & RAIDER DETERMINER
        // =========================================================================
        // अ. मॅथेमॅटिकल टर्न ठरवणे (सम संख्या = Team A, विषम संख्या = Team B)
        let nextTeamTurn = (totalRaidsCount % 2 === 0) ? 'A' : 'B';
        
        console.log(`👉 [TURN DECISION]: ${totalRaidsCount} रेड्स झाल्यात, म्हणून पुढची रेड Team ${nextTeamTurn} ची असेल.`);
        
        // ब. मूळ फंक्शनद्वारे रेड काउंट, चालू रायडरचे नाव आणि निळा/हिरवा बॅज स्क्रीनवर सेट करणे
        if (typeof updateFiveRaidDisplay === "function") {
            updateFiveRaidDisplay(nextTeamTurn); 
        }

        console.log("%c==================================================", "color: #f97316; font-weight: bold;");
        return; // 🛑 खेळाडू निवडायचा मोडल बायपास करण्यासाठी इथूनच कोड बाहेर काढला!
    }


    // =========================================================================
    // 📂 SECTION 5: FRESH 5-5 MATCH SQUAD SELECTOR FLOW (0-0 SCORE)
    // =========================================================================
    console.log("🆕 [FRESH START]: फ्रेश ५-५ सामना आहे, १२ खेळाडूंचे मोडल विंडो उघडत आहे.");

    const modal = document.getElementById('fiveRaidOrderModal');
    if (!modal) {
        console.error("🚨 [ERROR]: 'fiveRaidOrderModal' HTML मध्ये सापडला नाही!");
        return;
    }

    const nameA = document.getElementById('teamAName')?.innerText || "TEAM A";
    const nameB = document.getElementById('teamBName')?.innerText || "TEAM B";
    
    document.getElementById('fiveRaidTitleTeamA').innerText = `${nameA.toUpperCase()} - RAIDING ORDER`;
    document.getElementById('fiveRaidTitleTeamB').innerText = `${nameB.toUpperCase()} - RAIDING ORDER`;

    let listA = [];
    let listB = [];

    if (typeof currentMatchData !== 'undefined' && currentMatchData) {
        listA = currentMatchData.teamAPlayers || currentMatchData.teamA_players || [];
        listB = currentMatchData.teamBPlayers || currentMatchData.teamB_players || [];
    }

    if (listA.length === 0 && typeof matchSetupData !== 'undefined' && matchSetupData?.mId) {
        const activeMatchKey = `active_match_${matchSetupData.mId}`;
        const localData = localStorage.getItem(activeMatchKey);
        if (localData) {
            const parsed = JSON.parse(localData);
            listA = parsed.teamAPlayers || [];
            listB = parsed.teamBPlayers || [];
        }
    }

    generateOrderDropdowns('teamAFiveInputs', listA, 'A');
    generateOrderDropdowns('teamBFiveInputs', listB, 'B');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    console.log("%c==================================================", "color: #f97316; font-weight: bold;");
}

/** */

// ड्रॉपडाउन बनवणारे सोपे नल-सेफ हेल्पर फंक्शन
function buildDropdownInputs(divId, playersArray, teamTag) {
    const box = document.getElementById(divId);
    if (!box) return;
    box.innerHTML = "";

    // जर यादी रिकामी आली तरच डमी डेटा (सेफ्टी बॅकअप)
    if (!playersArray || playersArray.length === 0) {
        playersArray = Array.from({length: 12}, (_, i) => ({ name: `Player ${teamTag}${i+1}`, no: teamTag === 'A' ? i+1 : 21+i }));
    }

    for (let i = 1; i <= 5; i++) {
        let options = `<option value="">-- निवडा खेळाडू ${i} --</option>`;
        
        playersArray.forEach(p => {
            // तुझ्या ऑब्जेक्टच्या रचनेनुसार p.name आणि p.no ओढणे
            const name = typeof p === 'string' ? p : (p.name || `Player`);
            const jerseyNo = p.no || p.jersey || "";
            const displayLabel = jerseyNo ? `#${jerseyNo} ${name}` : name;
            
            options += `<option value="${name}">${displayLabel}</option>`;
        });

        const selectHtml = `
            <div class="flex items-center gap-3 bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                <span class="w-6 h-6 flex items-center justify-center text-[10px] font-black font-mono bg-slate-800 text-amber-500 rounded-md border border-slate-700 shrink-0">R${i}</span>
                <select id="fiveRaidSelect_${teamTag}_${i}" class="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs font-bold text-white focus:outline-none">
                    ${options}
                </select>
            </div>`;
            
        box.insertAdjacentHTML('beforeend', selectHtml);
        
        // क्रमाने पहिले ५ खेळाडू बाय-डिफ़ॉल्ट सिलेक्ट करून ठेवणे
        const selectEl = document.getElementById(`fiveRaidSelect_${teamTag}_${i}`);
        if (selectEl && playersArray[i-1]) {
            const defaultName = typeof playersArray[i-1] === 'string' ? playersArray[i-1] : playersArray[i-1].name;
            selectEl.value = defaultName;
        }
    }
}

// ड्रॉपडाउन लिस्ट बनवणारे हेल्पर फंक्शन
function generateOrderDropdowns(containerId, playersArray, teamType) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    // जर खेळाडूंची यादी नसेल तर तात्पुरती १ ते ७ जर्सीची डमी लिस्ट (सेफ्टी बॅकअप)
    if (!playersArray || playersArray.length === 0) {
        playersArray = Array.from({length: 7}, (_, i) => ({ name: `Player ${i+1}`, jersey: i+1 }));
    }

    // १ ते ५ नंबरचे सिलेक्ट बॉक्स तयार करणे
    for (let i = 1; i <= 5; i++) {
        const div = document.createElement('div');
        div.className = "flex items-center gap-3 bg-slate-950/60 p-2 rounded-lg border border-slate-850";
        
        let optionsHtml = `<option value="">-- Select Raider ${i} --</option>`;
        playersArray.forEach(p => {
            const pName = typeof p === 'string' ? p : (p.name || `Player ${p.jersey || ''}`);
            const pNo = p.jersey ? `#${p.jersey} ` : "";
            optionsHtml += `<option value="${pName}">${pNo}${pName}</option>`;
        });

        div.innerHTML = `
            <span class="w-6 h-6 flex items-center justify-center text-[10px] font-black font-mono bg-slate-800 text-amber-500 rounded-md border border-slate-700 shrink-0">R${i}</span>
            <select id="fiveRaidSelect_${teamType}_${i}" class="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs font-bold text-white focus:outline-none focus:border-orange-500">
                ${optionsHtml}
            </select>
        `;
        container.appendChild(div);
        
        // आधीच उपलब्ध असल्यास सिरीयल वाईज बाय-डिफॉल्ट खेळाडू सिलेक्ट करून ठेवणे (स्कोअररचा वेळ वाचवण्यासाठी)
        if (playersArray[i-1]) {
            const selectEl = document.getElementById(`fiveRaidSelect_${teamType}_${i}`);
            const defaultName = typeof playersArray[i-1] === 'string' ? playersArray[i-1] : playersArray[i-1].name;
            if (selectEl) selectEl.value = defaultName;
        }
    }
}

// 🎯 ५-५ रेड्सची ऑर्डर फायनल लॉक करणे
// 🎯 ५-५ रेड्सची ऑर्डर फायनल लॉक करणे
function lockFiveRaidOrder() {
    window.fiveRaidOrderTeamA = [];
    window.fiveRaidOrderTeamB = [];

    // १. फॉर्ममधून अचूक आयडी वापरून नावे गोळा करणे
    for (let i = 1; i <= 5; i++) {
        const pA = document.getElementById(`fiveRaidSelect_A_${i}`)?.value;
        const pB = document.getElementById(`fiveRaidSelect_B_${i}`)?.value;

        if (!pA || !pB) {
            Swal.fire({ 
                icon: 'error', 
                title: 'अपूर्ण यादी!', 
                text: 'कृपया दोन्ही संघांचे सर्व ५ खेळाडू क्रमाने सिलेक्ट करा.', 
                background: '#111', 
                color: '#fff',
                confirmButtonColor: '#f97316'
            });
            return;
        }
        window.fiveRaidOrderTeamA.push(pA);
        window.fiveRaidOrderTeamB.push(pB);
    }

    // २. कन्सोलवर डेटा लॉक करणे
    console.log("%c🔒 [5-5 RAID PLAYERS LOCKED SUCCESSFULLY]:", "color: #22c55e; font-weight: bold;");
    console.log("Team A Order:", window.fiveRaidOrderTeamA);
    console.log("Team B Order:", window.fiveRaidOrderTeamB);

    // =============================================================
    // 🎯 [💥 THE EXACT SINGLE OBJECT STORAGE LOCK]: क्लीन आणि युनिक सेव्ह
    // =============================================================
    if (typeof matchSetupData !== 'undefined' && matchSetupData?.mId) {
        const mId = matchSetupData.mId;
        
        const fiveRaidOrderMaster = {
            teamA_order: window.fiveRaidOrderTeamA,
            teamB_order: window.fiveRaidOrderTeamB
        };

        // तुझ्या मागणीनुसार ५-५ रिलेटेड स्पष्ट नाव आणि शेवटी मॅच आयडी जोडून सेव्ह केला
        localStorage.setItem(`five_raid_order_setup_${mId}`, JSON.stringify(fiveRaidOrderMaster));
        
        console.log(`%c💾 [STORAGE SUCCESS]: 'five_raid_order_setup_${mId}' ऑब्जेक्ट कडक सेव्ह झाला!`, "background: #22c55e; color: #fff; font-weight: bold;");
        console.log("📝 ऑब्जेक्ट स्नॅपशॉट:", JSON.stringify(fiveRaidOrderMaster));
    } else {
        console.warn("⚠️ [STORAGE WARN]: matchSetupData किंवा mId ग्लोबल स्कोपमध्ये न मिळाल्यामुळे लोकल स्टोरेज सेव्ह स्किप झाले.");
    }
    // =============================================================

    // मॅचच्या स्क्रीनवरील खरी नावे ओढून ५-५ च्या स्कोअर बोर्डवर सेट करणे
    const nameA = document.getElementById('teamAName')?.innerText || "TEAM A";
    const nameB = document.getElementById('teamBName')?.innerText || "TEAM B";
    
    if (document.getElementById('fiveRaidLabelTeamA')) document.getElementById('fiveRaidLabelTeamA').innerText = `${nameA} (5-5)`;
    if (document.getElementById('fiveRaidLabelTeamB')) document.getElementById('fiveRaidLabelTeamB').innerText = `${nameB} (5-5)`;

    // ३. ५-५ रेड मोडचे ग्लोबल काऊंटर्स ऑन करणे
    window.isFiveRaidModeOn = true;
    window.fiveRaidCount = 1; // पहिली रेड सुरू होणार
    window.currentFiveRaidIndexA = 0;
    window.currentFiveRaidIndexB = 0;

    // ४. मॉडेल बंद करणे
    closeFiveRaidOrderModal();
    
    // =============================================================
    // 🎯 🚀 [THE SCREEN SWAP MAGIC]: जुने बटने लपवून नवीन पॅनेल उघडणे!
    // =============================================================
    const mainScoringGrid = document.querySelector('.grid.grid-cols-2.gap-4.mt-4.shrink-0');
    if (mainScoringGrid) {
        mainScoringGrid.style.display = 'none'; // जुनी बटणे लपवली ❌
        console.log("📦 [UI]: मूळ स्कोअरिंग बटणांचा कप्पा लपवला गेला आहे.");
    }

    const battlePanel = document.getElementById('fiveRaidBattleGroundPanel');
    if (battlePanel) {
        battlePanel.classList.remove('hidden');
        battlePanel.classList.add('flex'); // नवीन पॅनेल दाखवला! 🟢
        console.log("📦 [UI]: 5-5 Raid Battle Ground Panel स्क्रीनवर ऑन झाला!");
    }

    // ५. 🎯 नवीन स्क्रीनवर पहिल्या रेडरचे नाव आणि टीम बॅज सेट करणे
    updateFiveRaidDisplay('A');

    // ६. स्कोअररला कडक मेसेज दाखवणे
    Swal.fire({
        title: 'महासंग्राम सुरू!',
        text: '५-५ रेड्स पॅनेल ऍक्टिव्हेट झाला आहे. ७ प्लेयर्स नेहमी आतच राहतील, फक्त ३ सोपी बटणे वापरा!',
        icon: 'success',
        background: '#111',
        color: '#fff',
        confirmButtonColor: '#f97316'
    });
}

// 🎛️ नवीन पॅनेलवर राऊंड नंबर, खेळाडूचे नाव आणि बॅज अपडेट करणारे सोपे हेल्पर फंक्शन
function updateFiveRaidDisplay(currentTeam) {
    // अ. एकूण कितवी रेड सुरू आहे ते सेट करणे
    const roundCounter = document.getElementById('fiveRaidRoundCounter');
    if (roundCounter) roundCounter.innerText = window.fiveRaidCount;

    // ब. चालू रेडरचे नाव आणि टीमचा बॅज सेट करणे
    const nameEl = document.getElementById('fiveRaidActiveRaiderName');
    const badgeEl = document.getElementById('fiveRaidActiveTeamBadge');
    
    if (currentTeam === 'A') {
        const raiderName = window.fiveRaidOrderTeamA[window.currentFiveRaidIndexA] || "No Raider";
        if (nameEl) nameEl.innerText = raiderName;
        if (badgeEl) {
            badgeEl.innerText = "TEAM A RAID";
            badgeEl.className = "bg-green-600 text-black font-black text-[9px] px-2.5 py-1 rounded-md uppercase tracking-tight";
        }
    } else {
        const raiderName = window.fiveRaidOrderTeamB[window.currentFiveRaidIndexB] || "No Raider";
        if (nameEl) nameEl.innerText = raiderName;
        if (badgeEl) {
            badgeEl.innerText = "TEAM B RAID";
            badgeEl.className = "bg-blue-600 text-white font-black text-[9px] px-2.5 py-1 rounded-md uppercase tracking-tight";
        }
    }
}

// मॉडेल बंद करणे
function closeFiveRaidOrderModal() {
    const modal = document.getElementById('fiveRaidOrderModal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

// मूळ स्क्रीनवरील रेडर ऑटो-सिलेक्ट करणारा कडक सुबक जुगाड
function autoSelectNextFiveRaidPlayer(teamType) {
    if (!window.isFiveRaidModeOn) return;
    
    let nextPlayerName = "";
    if (teamType === 'A') {
        nextPlayerName = window.fiveRaidOrderTeamA[window.currentFiveRaidIndexA];
    } else {
        nextPlayerName = window.fiveRaidOrderTeamB[window.currentFiveRaidIndexB];
    }

    console.log(`🎯 [Auto-Select Raider]: Team ${teamType} चा खेळाडू "${nextPlayerName}" ऑटो-सिलेक्ट करत आहे.`);

    // तुझ्या मूळ स्क्रीनवर रेडर निवडण्यासाठी जो ड्रॉपडाउन किंवा बटन्स आहेत (उदा. document.getElementById('raiderSelectDropdown')), 
    // तिथे थेट हे नाव बाइंड (Set) करून टाकायचे!
    const raiderDropdown = document.getElementById('raiderSelectDropdown') || document.getElementById('activeRaiderSelect');
    if (raiderDropdown) {
        raiderDropdown.value = nextPlayerName;
        // जर तिथे ऑनचेन्ज इव्हेंट लावला असेल तर तो मॅन्युअली फायर करणे
        raiderDropdown.dispatchEvent(new Event('change'));
    }
}

///////////////////
// =================================================================
// 🎯 5-5 RAIDS MODE: CLEAN & READABLE BUTTON FUNCTIONS
// =================================================================


// 1️⃣ [TOUCH POINTS BUTTON] - टच पॉईंट्स बटण
async function touchPointsFiveRaid() {
    console.log("%c🎯 [TOUCH PTS BUTTON]: ५-५ रेड अंतर्गत क्लिक झाले.", "color: #f97316; font-weight: bold;");
    
    const swalResult = await Swal.fire({
        title: 'किती टच पॉईंट्स (Touch Points) मिळाले?',
        html: `
            <div class="grid grid-cols-4 gap-2 p-2">
                ${[1,2,3,4,5,6,7].map(num => `
                    <button onclick="Swal.close({ pts: ${num} })" class="bg-indigo-950 border border-indigo-500/40 text-white font-black text-lg py-3 rounded-xl active:bg-indigo-600">${num}</button>
                `).join('')}
            </div>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'रद्द करा',
        background: '#111',
        color: '#fff'
    });

    // 🎯 [💥 PROCESSING THE SELECTION]
    if (swalResult && swalResult.pts) {
        const touchCount = Number(swalResult.pts);
        console.log(`📊 [TOUCH PTS FIVE RAID]: स्कोअररने ${touchCount} टच पॉईंट्स निवडले. आता आउट झालेल्या डिफेंडर्सची लिस्ट उघडत आहे...`);
        
        // कॉमन डिफेंडर सिलेक्शन विंडो उघडणे (टच_काउंट, बोनस_गुण, ऍक्शन_टाईप)
        openFiveRaidDefenderSelector(touchCount, 0, 'TOUCH_POINTS');
    } else {
        console.log("😇 [TOUCH PTS FIVE RAID]: स्कोअररने पॉईंट्स निवडणे रद्द केले.");
    }
}

// 🎛️ बटणावर क्लिक केल्यावर त्याचे सिलेक्शन ऑन-ऑफ करणारे आणि संख्या मोजणारे हेल्पर फंक्शन
function toggleFiveRaidDefenderSelection(name, no, maxLimit) {
    const btn = document.getElementById(`defBtn_${no}`);
    const dot = document.getElementById(`dot_${no}`);
    if (!btn || !dot) return;

    const index = window.tempSelectedFiveDefs.indexOf(name);

    if (index > -1) {
        // आधीच सिलेक्ट असेल तर अन-सिलेक्ट करणे
        window.tempSelectedFiveDefs.splice(index, 1);
        btn.classList.remove('border-indigo-500', 'bg-indigo-950/40', 'text-indigo-400');
        btn.classList.add('border-zinc-800', 'bg-slate-900', 'text-white');
        dot.classList.remove('bg-indigo-500');
        dot.classList.add('bg-zinc-700');
    } else {
        // जर लिमिट संपली नसेल तरच सिलेक्ट करू देणे
        if (window.tempSelectedFiveDefs.length >= maxLimit) {
            console.warn(`⚠️ [FIVE RAID DEF LIMIT]: मॅक्सिमम लिमिट (${maxLimit}) संपली आहे! अजून खेळाडू निवडता येणार नाही.`);
            return; 
        }
        
        window.tempSelectedFiveDefs.push(name);
        btn.classList.remove('border-zinc-800', 'bg-slate-900', 'text-white');
        btn.classList.add('border-indigo-500', 'bg-indigo-950/40', 'text-indigo-400');
        dot.classList.remove('bg-zinc-700');
        dot.classList.add('bg-indigo-500');
    }

    // स्क्रीनवर काउंटर अपडेट करणे
    const countLabel = document.getElementById('swalSelCount');
    if (countLabel) countLabel.innerText = window.tempSelectedFiveDefs.length;

    console.log(`📋 [FIVE RAID SELECTING]: (${window.tempSelectedFiveDefs.length}/${maxLimit}) ➔ चालू निवड:`, window.tempSelectedFiveDefs);

    // 🎯 जर निवडलेले खेळाडू मूळ टच पॉईंट्सच्या एवढे झाले, तर पॉप-अप स्वतःहून बंद होईल! (FAST UI)
    if (window.tempSelectedFiveDefs.length === maxLimit) {
        console.log(`%c⚡ [LIMIT REACHED]: ${maxLimit} खेळाडू पूर्ण निवडले गेले! मोडल स्वतःहून क्लोज होत आहे...`, "color: #22c55e; font-weight: bold;");
        setTimeout(() => {
            Swal.close(window.tempSelectedFiveDefs.join(", "));
        }, 300); // युझरला दिसण्यासाठी ३०० मिलीसेकंदाचा छोटा ब्रेक
    }
}

// 2️⃣ [BONUS BUTTON] - (Deep Level Logs सह १००% फिक्स ट्रॅकिंग! 🚀)
async function bonusFiveRaid() {
    console.log("%c✨ [DEEP LOG 1]: bonusFiveRaid() फंक्शन ट्रिगर झाले आहे!", "color: #22c55e; font-weight: bold; font-size: 12px;");
    console.log(`📊 [CURRENT STATE]: window.fiveRaidCount = ${window.fiveRaidCount}`);

    console.log("🖥️ [UI SEARCH]: बोनस आणि कॉम्बिनेशन्स निवडण्याचा SweetAlert पॉप-अप उघडत आहे...");

    const result = await Swal.fire({
        title: 'बोनस सोबत काय झाले?',
        html: `
            <div class="space-y-4 p-1 font-sans">
                <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-wider text-left pl-1">बोनस + टच पॉईंट्स निवडा:</p>
                <div class="grid grid-cols-4 gap-2">
                    <button onclick="console.log('👉 [CLICKED]: Bonus +0 दाबले'); Swal.close({ mode: 'bonus_touch', val: 0 })" class="bg-teal-950/80 border border-teal-500/30 text-teal-400 font-black text-base py-3 rounded-xl active:bg-teal-600">+0</button>
                    <button onclick="console.log('👉 [CLICKED]: Bonus +1 दाबले'); Swal.close({ mode: 'bonus_touch', val: 1 })" class="bg-slate-900 border border-zinc-800 text-white font-black text-base py-3 rounded-xl active:bg-indigo-600">1</button>
                    <button onclick="console.log('👉 [CLICKED]: Bonus +2 दाबले'); Swal.close({ mode: 'bonus_touch', val: 2 })" class="bg-slate-900 border border-zinc-800 text-white font-black text-base py-3 rounded-xl active:bg-indigo-600">2</button>
                    <button onclick="console.log('👉 [CLICKED]: Bonus +3 दाबले'); Swal.close({ mode: 'bonus_touch', val: 3 })" class="bg-slate-900 border border-zinc-800 text-white font-black text-base py-3 rounded-xl active:bg-indigo-600">3</button>
                    <button onclick="var btn = 4; console.log('👉 [CLICKED]: Bonus +' + btn + ' दाबले'); Swal.close({ mode: 'bonus_touch', val: btn })" class="bg-slate-900 border border-zinc-800 text-white font-black text-base py-3 rounded-xl active:bg-indigo-600">4</button>
                    <button onclick="console.log('👉 [CLICKED]: Bonus +5 दाबले'); Swal.close({ mode: 'bonus_touch', val: 5 })" class="bg-slate-900 border border-zinc-800 text-white font-black text-base py-3 rounded-xl active:bg-indigo-600">5</button>
                    <button onclick="console.log('👉 [CLICKED]: Bonus +6 दाबले'); Swal.close({ mode: 'bonus_touch', val: 6 })" class="bg-slate-900 border border-zinc-800 text-white font-black text-base py-3 rounded-xl active:bg-indigo-600">6</button>
                    <button onclick="console.log('👉 [CLICKED]: Bonus +7 दाबले'); Swal.close({ mode: 'bonus_touch', val: 7 })" class="bg-slate-900 border border-zinc-800 text-white font-black text-base py-3 rounded-xl active:bg-indigo-600">7</button>
                </div>
                <div class="border-t border-slate-850 my-2"></div>
                <button onclick="console.log('👉 [CLICKED]: Bonus + Tackle दाबले'); Swal.close({ mode: 'bonus_tackle', val: 1 })" class="w-full bg-red-950/50 border border-red-900/40 text-red-400 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 active:bg-red-900 shadow-md">
                    🛡️ BONUS + TACKLE (दोन्ही टीम +1)
                </button>
            </div>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'मागे जा',
        background: '#111',
        color: '#fff'
    });

    // 🔍 [DEEP LOG 2]: पॉप-अपमधून नक्की काय कच्चा डेटा आला तो तपासणे
    console.log("🔍 [DEEP LOG 2]: बोनस पॉप-अपचा कच्चा रिझल्ट (result):", result);

    // 🎯 [THE BIG ARCHITECTURE FIX]: लायब्ररीच्या सिंटॅक्स नुसार डेटा शोधणे (Direct Root किंवा result.value कप्पा)
    let finalMode = null;
    let finalVal = 0;

    if (result && result.mode) {
        finalMode = result.mode;
        finalVal = Number(result.val);
        console.log("👉 [DATA LAYER]: Direct Root वरून डेटा सापडला.");
    } else if (result && result.value && result.value.mode) {
        finalMode = result.value.mode;
        finalVal = Number(result.value.val);
        console.log("👉 [DATA LAYER]: result.value कप्प्यातून डेटा सापडला.");
    }

    console.log(`🔍 [DEEP LOG 3]: फायनल फिल्टर केलेला डेटा ➔ Mode: ${finalMode} | Value: ${finalVal}`);

    // जर काहीच डेटा आला नसेल किंवा युझर मागे गेला असेल तर:
    if (!finalMode) {
        console.warn("%c❌ [DEEP LOG 4]: पॉप-अप मधून मोड मिळाला नाही, युझर बाहेर पडला! फंक्शन स्टॉप.", "color: #ef4444; font-weight: bold;");
        return;
    }

    // पायरी २: अचूक मोडनुसार पुढचा कप्पा ट्रिगर करणे
    if (finalMode === 'bonus_touch') {
        if (finalVal === 0) {
            console.log("🟢 [DEEP LOG 5]: Bonus +0 निवडले! थेट मास्टर सेव्हकडे जात आहे...");
            if (typeof saveFiveRaidOutcome === 'function') {
                saveFiveRaidOutcome('BONUS_ONLY', 0, 1, 0, "None (Only Bonus)");
            }
        } else {
            console.log(`🟢 [DEEP LOG 5]: Bonus + ${finalVal} निवडले! आता ${finalVal} डिफेंडर निवडण्यासाठी खिडकी उघडत आहे...`);
            if (typeof openFiveRaidDefenderSelector === 'function') {
                openFiveRaidDefenderSelector(finalVal, 1, 'BONUS_TOUCH');
            } else {
                console.error("🚨 [ERROR]: openFiveRaidDefenderSelector फंक्शन सापडले नाही!");
            }
        }
    } 
    else if (finalMode === 'bonus_tackle') {
        console.log("🚨 [DEEP LOG 5]: Bonus + Tackle निवडले! १ पकडणारा डिफेंडर निवडायला पाठवत आहे...");
        if (typeof openFiveRaidDefenderSelector === 'function') {
            openFiveRaidDefenderSelector(1, 1, 'BONUS_TACKLE');
        } else {
            console.error("🚨 [ERROR]: openFiveRaidDefenderSelector फंक्शन सापडले नाही!");
        }
    }
}

// 💡 मदतनीस: बोनस सोबत १ ते ७ टच पॉईंट्स निवडण्यासाठी फ्रेश पॉप-अप
async function askFiveRaidTouchWithBonus() {
    const { value: pts } = await Swal.fire({
        title: 'बोनस सोबत किती टच पॉईंट्स (1 to 7) मिळाले?',
        html: `
            <div class="grid grid-cols-4 gap-2 p-2">
                ${[1,2,3,4,5,6,7].map(num => `
                    <button onclick="Swal.close('${num}')" class="bg-slate-800 text-white font-black text-lg py-3 rounded-xl active:bg-indigo-600">${num}</button>
                `).join('')}
            </div>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        background: '#111',
        color: '#fff'
    });

    if (pts) {
        const touch = Number(pts);
        // बोनस + टच ➔ रायडर टीमला १ (बोनस) + X (टच) गुण
        saveFiveRaidOutcome('BONUS_TOUCH', touch, 1, 0);
    }
}

// 3️⃣ [EMPTY RAID BUTTON] - थेट १-क्लिक
function emptyFiveRaid() {
    console.log("⚠️ [5-5 RAID]: Empty Raid! नियमानुसार डिफेन्स टीम +१ गुण.");
    saveFiveRaidOutcome('EMPTY_OUT', 0, 0, 1);
}

// 4️⃣ [TACKLE BUTTON] - (Deep Logs सह टॅकलचा १००% फिक्स कोड! 🛡️)
async function tackleFiveRaid() {
    console.log("%c🛡️ [DEEP LOG 1]: tackleFiveRaid() फंक्शन ट्रिगर झाले आहे!", "color: #ef4444; font-weight: bold; font-size: 12px;");
    console.log(`📊 [CURRENT STATE]: window.fiveRaidCount = ${window.fiveRaidCount}`);

    // १. सध्या डिफेन्स कोणती टीम करत आहे ते ओळखणे
    const currentRaidingTeam = (window.fiveRaidCount % 2 !== 0) ? 'A' : 'B';
    const defendingTeamTag = (currentRaidingTeam === 'A') ? 'B' : 'A';
    console.log(`🤼 [DEEP LOG 2]: चालू रेडर टीम: ${currentRaidingTeam} | डिफेन्स करणारी टीम: ${defendingTeamTag}`);
    
    // २. डिफेन्स करणाऱ्या टीमचे प्लेयर्स ओढणे
    let defendersList = [];
    if (typeof currentMatchData !== 'undefined' && currentMatchData) {
        defendersList = (defendingTeamTag === 'A') ? (currentMatchData.teamAPlayers || currentMatchData.teamA_players || []) : (currentMatchData.teamBPlayers || currentMatchData.teamB_players || []);
        console.log(`📥 [DEEP LOG 3]: ओढलेली डिफेंडर लिस्ट:`, defendersList);
    }

    // जर यादी सापडली नाही तर सेफ्टी बॅकअप म्हणून डमी यादी
    if (!defendersList || defendersList.length === 0) {
        console.log("🛠️ [DEEP LOG 4]: खरी यादी नाही, ७ प्लेयर्सचा डमी बॅकअप लोड केला.");
        defendersList = Array.from({length: 7}, (_, i) => ({ name: `Player ${defendingTeamTag}${i+1}`, no: i+1 }));
    }

    // ३. डिफेंडर निवडण्यासाठी बटन्स तयार करणे
    let defenderButtonsHtml = `<div class="grid grid-cols-2 gap-2 p-1 font-sans">`;
    defendersList.forEach(p => {
        const pName = p.name || "Player";
        const pNo = p.no || p.jersey || "";
        const display = pNo ? `#${pNo} ${pName}` : pName;
        
        // थेट ऑब्जेक्ट बाहेर पास करण्यासाठी बदल
        defenderButtonsHtml += `
            <button onclick="console.log('👉 [CLICKED]: डिफेंडर ${pName} दाबला'); Swal.close({ defender: '${pName}' })" class="bg-slate-900 border border-zinc-800 text-white font-bold text-xs py-3 rounded-xl active:bg-red-950 active:text-red-400 truncate px-2 text-left">
                🏃‍♂️ ${display}
            </button>
        `;
    });
    
    // डायरेक्ट टीम टॅकल पॉइंट
    defenderButtonsHtml += `
        <button onclick="console.log('👉 [CLICKED]: Direct Team Tackle दाबले'); Swal.close({ defender: 'TEAM_TACKLE' })" class="col-span-2 bg-red-950/40 border border-red-900/40 text-red-400 font-black text-xs py-3 rounded-xl active:bg-red-900 active:text-white uppercase">
            🛡️ Direct Team Tackle Point
        </button>
    </div>`;

    console.log("🖥️ [UI SEARCH]: डिफेंडर निवडण्याचा पॉप-अप उघडत आहे...");
    const swalResult = await Swal.fire({
        title: 'पकडणारा डिफेंडर (Defender) निवडा:',
        html: defenderButtonsHtml,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        background: '#111',
        color: '#fff'
    });

    // 🔍 [DEEP LOG 5]: टॅकल पॉप-अपचा कच्चा डेटा तपासणे
    console.log("🔍 [DEEP LOG 5]: टॅकल पॉप-अपचा कच्चा रिझल्ट (swalResult):", swalResult);

    // 🎯 [THE FIX]: रूट किंवा व्हॅल्यू दोन्ही कप्प्यातून डिफेंडरचे नाव शोधणे
    let selectedDefender = null;
    if (swalResult && swalResult.defender) {
        selectedDefender = swalResult.defender;
    } else if (swalResult && swalResult.value && swalResult.value.defender) {
        selectedDefender = swalResult.value.defender;
    }

    console.log(`🔍 [DEEP LOG 6]: फायनल फिल्टर केलेला डिफेंडर ➔ ${selectedDefender}`);

    // ४. जर डिफेंडर अचूक मिळाला असेल तर पुढे पाठवणे
    if (selectedDefender) {
        console.log(`%c🏆 [DEEP LOG 7 - SUCCESS]: मास्टर सेव्हकडे जात आहे... खेळाडू: ${selectedDefender}`, "color: #22c55e; font-weight: bold;");
        
        if (typeof saveFiveRaidOutcome === 'function') {
            saveFiveRaidOutcome('TACKLE', 0, 0, 1, selectedDefender);
        } else {
            console.error("🚨 [ERROR]: saveFiveRaidOutcome फंक्शन सापडले नाही!");
        }
    } else {
        console.warn("%c❌ [DEEP LOG 8]: युझरने डिफेंडर निवडला नाही किंवा कॅन्सल केले!", "color: #eab308; font-weight: bold;");
    }
}

// =================================================================
// 🎯 5-5 RAIDS MODE: MASTER COMMON SAVE ENGINE (WITH DEFENDER TRACKING)
// =================================================================
/**
 * सुधारित रचनेचा वापर करून raids_secure_log_M1 मध्ये डेटा ढकलण्यासाठी आणि addRaidToSummary ला ट्रिगर करण्यासाठी saveFiveRaidOutcome चा हा संपूर्ण कडक कोड
 */

// async function saveFiveRaidOutcome(actionType, touchPts, bonusPts, defensePts, defenderNames = "Team Defense") {
//     const mId = typeof matchSetupData !== 'undefined' ? matchSetupData?.mId : "";
//     const tId = typeof matchSetupData !== 'undefined' ? matchSetupData?.tId : "";

//     // =================================================================
//     // 🚨 🪙 [GOLDEN RAID GATEKEEPER]: सुवर्ण निकाल गोळा करणे आणि सेव्हिंग
//     // =================================================================
//     if (window.isGoldenRaidActiveNow === true) {
//         console.log("🪙 [GOLDEN RESULT LOG]: सुवर्ण निकाल गोळा केला!");

//         const realTeamNameA = document.getElementById('teamAName')?.innerText || 'TEAM A';
//         const realTeamNameB = document.getElementById('teamBName')?.innerText || 'TEAM B';
        
//         const attackingTeam = window.goldenRaidAttackingTeam || 'A';
//         const defendingTeam = (attackingTeam === 'A') ? 'B' : 'A';
//         const finalRaiderName = window.goldenRaiderSelectedName || "Golden Raider";

//         let isSuccess = (actionType === 'TOUCH_POINTS' || actionType === 'BONUS_ONLY' || actionType === 'BONUS_TOUCH');
//         let finalWinnerTeamTag = isSuccess ? attackingTeam : defendingTeam;
//         const finalWinnerName = (finalWinnerTeamTag === 'A') ? realTeamNameA : realTeamNameB;

//         let displayResult = isSuccess ? "GOLDEN RAID SUCCESS" : "GOLDEN RAID CAUGHT";
//         let displayDetails = isSuccess ? `👑 MAHA-WINNER: ${finalWinnerName} (OUT: ${defenderNames})` : `👑 MAHA-WINNER: ${finalWinnerName} (CAUGHT BY: ${defenderNames})`;

//         if (typeof addRaidToSummary === 'function') {
//             addRaidToSummary(finalWinnerTeamTag, finalRaiderName, displayResult, 1, displayDetails, false, false, true);
//         }

//         // 🔒 लोकल स्टोरेज लॉक - 'Finished' केले
//         if (mId) localStorage.setItem(`match_status_${mId}`, "Finished");

//         // ☁️ [💥 SAFE ASYNC UPDATE]: सुवर्ण निकाल आणि विनर मास्टर ऑब्जेक्टसह जतन!
//         console.log("⏳ [DB SYNC]: गोल्डन रेड विजेता डेटाबेसमध्ये नोंदवत आहे...");
//         try {
//             // लोकल स्टोरेजमधून स्कोअरकार्ड बॅकअप घेणे
//             let localCard = localStorage.getItem('global_score_card');
//             let currentScoreCard = localCard ? JSON.parse(localCard) : { mainMatch: {teamA:0,teamB:0}, fiveRaid: {teamA:0,teamB:0}, goldenRaid: {teamA:0,teamB:0} };
            
//             // सुवर्ण रेडचा विनर पॉईंट सेट करणे
//             currentScoreCard.goldenRaid.teamA = (finalWinnerTeamTag === 'A') ? 1 : 0;
//             currentScoreCard.goldenRaid.teamB = (finalWinnerTeamTag === 'B') ? 1 : 0;
//             localStorage.setItem('global_score_card', JSON.stringify(currentScoreCard));

//             if (tId && mId && typeof db !== 'undefined') {
//                 await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
//                     status: "Finished", 
//                     winner: finalWinnerName, 
//                     winner_id: finalWinnerTeamTag, 
//                     lastUpdated: new Date().getTime(),
//                     scoreCard: currentScoreCard // 🎯 मास्टर ऑब्जेक्ट डेटाबेसमध्ये सेव्ह!
//                 });
//             }
//             console.log("✅ [DB SUCCESS]: गोल्डन रेडचा डेटा सुरक्षित क्लाउडवर पोहोचला!");
//         } catch (dbErr) { console.error("🚨 [DB ERROR]: सुवर्ण निकाल सिंक फेल!", dbErr); }

//         Swal.fire({
//             title: '🔥 महासंग्राम संपला! 🔥',
//             html: `<div class="text-sm font-sans space-y-3 p-1"><div class="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-4 py-3 rounded-2xl font-black text-sm uppercase tracking-tight shadow-xl">👑 ${finalWinnerName} विजेता!</div></div>`,
//             icon: 'success', background: '#111', color: '#fff', confirmButtonText: '🏁 डॅशबोर्डला जा', confirmButtonColor: '#eab308', allowOutsideClick: false
//         }).then(() => {
//             const fivePanel = document.getElementById('fiveRaidBattleGroundPanel');
//             if (fivePanel) fivePanel.classList.add('hidden');
//             window.isFiveRaidModeOn = false; window.isGoldenRaidActiveNow = false;
//             if (typeof loadPage === "function") loadPage('matches');
//         });
//         return; 
//     }

//     // =================================================================
//     // 📊 मूळ ५-५ रेड्सचा नेहमीचा स्कोअरिंग फ्लो
//     // =================================================================
//     const currentRaidingTeam = (window.fiveRaidCount % 2 !== 0) ? 'A' : 'B';
//     const currentDefendingTeam = (currentRaidingTeam === 'A') ? 'B' : 'A';

//     let raiderName = "";
//     if (currentRaidingTeam === 'A') { raiderName = window.fiveRaidOrderTeamA[window.currentFiveRaidIndexA] || "Raider A"; } 
//     else { raiderName = window.fiveRaidOrderTeamB[window.currentFiveRaidIndexB] || "Raider B"; }

//     const totalRaiderTeamPts = touchPts + bonusPts;
    
//     // १. UI स्क्रीनवरील आकडे बदलणे
//     if (currentRaidingTeam === 'A') {
//         if (totalRaiderTeamPts > 0) { const scorePanelA = document.getElementById('fiveRaidScoreA'); if (scorePanelA) scorePanelA.innerText = Number(scorePanelA.innerText) + totalRaiderTeamPts; }
//         if (defensePts > 0) { const scorePanelB = document.getElementById('fiveRaidScoreB'); if (scorePanelB) scorePanelB.innerText = Number(scorePanelB.innerText) + defensePts; }
//     } else {
//         if (totalRaiderTeamPts > 0) { const scorePanelB = document.getElementById('fiveRaidScoreB'); if (scorePanelB) scorePanelB.innerText = Number(scorePanelB.innerText) + totalRaiderTeamPts; }
//         if (defensePts > 0) { const scorePanelA = document.getElementById('fiveRaidScoreA'); if (scorePanelA) scorePanelA.innerText = Number(scorePanelA.innerText) + defensePts; }
//     }

//     // 🎯 [💥 STEP 1: REAL-TIME FIVE RAID SCORE CAPTURE]
//     // स्क्रीनवरून ५-५ चा आत्ताचा ताजा स्कोअर लगेच गोळा करणे
//     const fresh55ScoreA = Number(document.getElementById('fiveRaidScoreA')?.innerText || 0);
//     const fresh55ScoreB = Number(document.getElementById('fiveRaidScoreB')?.innerText || 0);

//     // लोकल स्टोरेजमधील मास्टर ऑब्जेक्ट अपडेट करणे (जेणेकरून मधेच बॅक गेले तरी डेटा उडणार नाही!)
//     let localCard = localStorage.getItem('global_score_card');
//     let currentScoreCard = localCard ? JSON.parse(localCard) : { mainMatch: {teamA:0,teamB:0}, fiveRaid: {teamA:0,teamB:0}, goldenRaid: {teamA:0,teamB:0} };
    
//     currentScoreCard.fiveRaid.teamA = fresh55ScoreA;
//     currentScoreCard.fiveRaid.teamB = fresh55ScoreB;
//     localStorage.setItem('global_score_card', JSON.stringify(currentScoreCard));

//     // २. निकाल मजकूर सेट करणे
//     let mainResult = ""; let mainPoints = 0; let mainDetails = ""; let mainTeam = currentRaidingTeam;
//     if (actionType === 'TOUCH_POINTS') { mainResult = "TOUCH POINT"; mainPoints = touchPts; mainDetails = `OUT: ${defenderNames}`; } 
//     else if (actionType === 'BONUS_ONLY') { mainResult = "BONUS POINT"; mainPoints = 1; mainDetails = "✨ BONUS COMPLETED"; } 
//     else if (actionType === 'BONUS_TOUCH') { mainResult = "BONUS + TOUCH"; mainPoints = touchPts + 1; mainDetails = `💥 +${touchPts} PTS | OUT: ${defenderNames}`; } 
//     else if (actionType === 'BONUS_TACKLE') { mainResult = "BONUS + TACKLE"; mainPoints = 1; mainDetails = `🛡️ CAUGHT BOTH TEAM +1`; } 
//     else if (actionType === 'EMPTY_OUT') { mainResult = "EMPTY RAID"; mainPoints = 1; mainDetails = "⚠️ TIME EXPIRED / OUT"; mainTeam = currentDefendingTeam; } 
//     else if (actionType === 'TACKLE') { mainResult = "TACKLE POINT"; mainPoints = 1; mainDetails = `🛡️ CAUGHT BY: ${defenderNames}`; mainTeam = currentDefendingTeam; }

//     if (typeof addRaidToSummary === 'function') { addRaidToSummary(mainTeam, raiderName, mainResult, mainPoints, mainDetails, false, true); }

//     if (currentRaidingTeam === 'A') { window.currentFiveRaidIndexA++; } else { window.currentFiveRaidIndexB++; }
//     window.fiveRaidCount++; 

//     // 🎯 [💥 STEP 2: REAL-TIME CLOUD SYNC BETWEEN RAIDS]
//     // चालू सामन्यात प्रत्येक रेड संपताच ५-५ चा स्कोअर बॅकग्राउंडला फायरबेसवर सेव्ह करणे (Full Security)
//     if (tId && mId && typeof db !== 'undefined') {
//         db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
//             status: "five_raid",
//             scoreCard: currentScoreCard,
//             lastUpdated: new Date().getTime()
//         }).then(() => console.log("☁️ [Mid-Five-Raid Sync]: रेड क्रमांक", window.fiveRaidCount - 1, "चा स्कोअर सिंक झाला."));
//     }

//     // 🛑 [१० रेड्स पूर्ण झाल्यावर विनर चेकिंग आणि अंतिम क्लोजर]
//     if (window.fiveRaidCount > 10) {
//         const realTeamNameA = document.getElementById('teamAName')?.innerText || 'TEAM A';
//         const realTeamNameB = document.getElementById('teamBName')?.innerText || 'TEAM B';

//         // 🎯 ५-५ चा स्पष्ट विजेता मिळाला ➔ स्टेटस 'Finished'
//         if (fresh55ScoreA !== fresh55ScoreB) {
//             let winnerText = fresh55ScoreA > fresh55ScoreB ? realTeamNameA : realTeamNameB;
//             let winnerTag = fresh55ScoreA > fresh55ScoreB ? 'A' : 'B';

//             if (mId) localStorage.setItem(`match_status_${mId}`, "Finished");

//             console.log("⏳ [DB FINAL SYNC]: ५-५ चा अंतिम स्कोअर मास्टर ऑब्जेक्टसह क्लाउडवर लॉक करत आहे...");
            
//             const runEndBlock = async () => {
//                 try {
//                     if (tId && mId && typeof db !== 'undefined') {
//                         await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
//                             status: "Finished", 
//                             winner: winnerText, 
//                             winner_id: winnerTag, 
//                             finalScore: `5-5 Mode: ${fresh55ScoreA}-${fresh55ScoreB}`, 
//                             lastUpdated: new Date().getTime(),
//                             scoreCard: currentScoreCard // 🎯 पूर्णपणे लॉक
//                         });
//                     }
//                     console.log("✅ [DB SUCCESS]: ५-५ विजेता ऑफिशिअल मास्टर ऑब्जेक्टसह सेव्ह झाला!");
//                 } catch (dbErr) { console.error("🚨 [DB ERROR]: ५-५ निकाल सिंक फेल!", dbErr); }

//                 Swal.fire({ 
//                     title: '५-५ रेड्सचा थरार संपला!', 
//                     html: `<div class="text-sm font-sans space-y-2"><p class="font-black text-green-400 text-base">🏆 विजेता संघ: ${winnerText}</p></div>`, 
//                     icon: 'success', background: '#111', color: '#fff', confirmButtonColor: '#22c55e', confirmButtonText: '🏁 डॅशबोर्डला जा', allowOutsideClick: false 
//                 }).then(() => {
//                     window.isFiveRaidModeOn = false;
//                     if (document.getElementById('fiveRaidBattleGroundPanel')) { document.getElementById('fiveRaidBattleGroundPanel').classList.add('hidden'); }
//                     if (typeof loadPage === "function") loadPage('matches');
//                 });
//             };

//             runEndBlock();
//             return;
//         } 
//         // 🎯 ५-५ मध्ये पुन्हा महा-टाय ➔ स्टेटस 'golden_raid'
//         else {
//             if (mId) localStorage.setItem(`match_status_${mId}`, "golden_raid");

//             console.log("⏳ [DB TIE SYNC]: ५-५ टाय झाला, डेटाबेस 'golden_raid' मोडवर शिफ्ट करत आहे...");
//             const runTieBlock = async () => {
//                 try {
//                     if (tId && mId && typeof db !== 'undefined') {
//                         await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({ 
//                             status: "golden_raid", 
//                             lastUpdated: new Date().getTime(),
//                             scoreCard: currentScoreCard
//                         });
//                     }
//                     console.log("✅ [DB SUCCESS]: स्टेटस 'golden_raid' यशस्वीरित्या सिंक झाला!");
//                 } catch (dbErr) { console.error("🚨 [DB ERROR]: golden_raid स्टेटस सिंक फेल!", dbErr); }

//                 Swal.fire({ 
//                     title: 'अजूनही महा-टाय! 🤝', 
//                     html: `<div class="text-sm font-sans space-y-2"><p class="font-black text-amber-500 text-sm uppercase">पाच-पाच रेड्समध्येही दोन्ही संघ बरोबरीत!</p><p class="text-xs text-zinc-400">आता निकाल फक्त 'गोल्डन編 रेड' वर लागणार.</p></div>`, 
//                     icon: 'warning', background: '#111', color: '#fff', confirmButtonText: '⚡ GOLDEN RAID सुरू करा', confirmButtonColor: '#f97316', allowOutsideClick: false 
//                 }).then(() => { 
//                     if (typeof initGoldenRaidSetup === 'function') { initGoldenRaidSetup(); } 
//                 });
//             };

//             runTieBlock();
//             return;
//         }
//     }

//     const nextTeamTag = (window.fiveRaidCount % 2 !== 0) ? 'A' : 'B';
//     if (typeof updateFiveRaidDisplay === 'function') { updateFiveRaidDisplay(nextTeamTag); }
// }

/**
 * ५-५ रेड्सचे १० काउंट्स पूर्ण झाल्यावर किंवा गोल्डन रेडचा निकाल लागल्यावर, या फंक्शनने स्वतः विनर ठरवण्याऐवजी किंवा डीबी अपडेट करण्याऐवजी, 
 * थेट आपल्या मास्टर confirmEndMatch कडे फ्लो सुपूर्द केला पाहिजे.
 */
async function saveFiveRaidOutcome(actionType, touchPts, bonusPts, defensePts, defenderNames = "Team Defense") {
    // =========================================================================
    // 📂 SECTION 1: THE GOLDEN RAID INTERCEPTOR & GATEKEEPER 🪙
    // =========================================================================
    const mId = typeof matchSetupData !== 'undefined' ? matchSetupData?.mId : "";
    const tId = typeof matchSetupData !== 'undefined' ? matchSetupData?.tId : "";

    if (window.isGoldenRaidActiveNow === true || matchStage === "GOLDEN_RAID") {
        console.log("%c🪙 [GOLDEN RESULT INTENT]: सुवर्ण निकाल गोळा केला जात आहे...", "background: #eab308; color: #000; font-weight: bold;");

        const realTeamNameA = document.getElementById('teamAName')?.innerText || 'TEAM A';
        const realTeamNameB = document.getElementById('teamBName')?.innerText || 'TEAM B';
        
        const attackingTeam = window.goldenRaidTeam || window.goldenRaidAttackingTeam || 'A';
        const defendingTeam = (attackingTeam === 'A') ? 'B' : 'A';
        const finalRaiderName = window.goldenRaiderSelectedName || "Golden Raider";

        let isSuccess = (actionType === 'TOUCH_POINTS' || actionType === 'BONUS_ONLY' || actionType === 'BONUS_TOUCH');
        let finalWinnerTeamTag = isSuccess ? attackingTeam : defendingTeam;
        const finalWinnerName = (finalWinnerTeamTag === 'A') ? realTeamNameA : realTeamNameB;

        let displayResult = isSuccess ? "GOLDEN RAID SUCCESS" : "GOLDEN RAID CAUGHT";
        let displayDetails = isSuccess ? `👑 MAHA-WINNER: ${finalWinnerName} (OUT: ${defenderNames})` : `👑 MAHA-WINNER: ${finalWinnerName} (CAUGHT BY: ${defenderNames})`;

        // अ. टाइमलाईन समरीमध्ये गोल्डन रेडची कडक सोनेरी नोंद करणे
        if (typeof addRaidToSummary === 'function') {
            addRaidToSummary(finalWinnerTeamTag, finalRaiderName, displayResult, 1, displayDetails, false, false, true);
        }

        // ब. लोकल स्कोरकार्ड मेमरी अपडेट
        let localCard = localStorage.getItem('global_score_card');
        let currentScoreCard = localCard ? JSON.parse(localCard) : { mainMatch: {teamA:0,teamB:0}, fiveRaid: {teamA:0,teamB:0}, goldenRaid: {teamA:0,teamB:0} };
        
        currentScoreCard.goldenRaid.teamA = (finalWinnerTeamTag === 'A') ? 1 : 0;
        currentScoreCard.goldenRaid.teamB = (finalWinnerTeamTag === 'B') ? 1 : 0;
        localStorage.setItem('global_score_card', JSON.stringify(currentScoreCard));

        console.log("⚙️ [GOLDEN OVER DIRECT ROUTING]: सुवर्ण निकाल थेट मुख्य मास्टर इंजिनकडे पाठवत आहे...");
        
        // 🚨 [💥 THE MASTER UNIFICATION]: डेटाबेस आणि Swal चे डुप्लिकेशन काढून थेट एकाच इंजिनला ताबा दिला!
        if (typeof confirmEndMatch === "function") {
            await confirmEndMatch(finalWinnerTeamTag, `Golden Raid Result: ${displayResult}`);
        }
        return; 
    }


    // =========================================================================
    // 📂 SECTION 2: THE CORE 5-5 RAID CALCULATOR & UI INJECTION 📊
    // =========================================================================
    const currentRaidingTeam = (window.fiveRaidCount % 2 !== 0) ? 'A' : 'B';
    const currentDefendingTeam = (currentRaidingTeam === 'A') ? 'B' : 'A';

    let raiderName = "";
    if (currentRaidingTeam === 'A') { 
        raiderName = window.fiveRaidOrderTeamA[window.currentFiveRaidIndexA] || "Raider A"; 
    } else { 
        raiderName = window.fiveRaidOrderTeamB[window.currentFiveRaidIndexB] || "Raider B"; 
    }

    const totalRaiderTeamPts = touchPts + bonusPts;
    
    // १. स्क्रीनवरील ५-५ पॅनेलचे चालू आकडे तातडीने बदलणे
    if (currentRaidingTeam === 'A') {
        if (totalRaiderTeamPts > 0) { const scorePanelA = document.getElementById('fiveRaidScoreA'); if (scorePanelA) scorePanelA.innerText = Number(scorePanelA.innerText) + totalRaiderTeamPts; }
        if (defensePts > 0) { const scorePanelB = document.getElementById('fiveRaidScoreB'); if (scorePanelB) scorePanelB.innerText = Number(scorePanelB.innerText) + defensePts; }
    } else {
        if (totalRaiderTeamPts > 0) { const scorePanelB = document.getElementById('fiveRaidScoreB'); if (scorePanelB) scorePanelB.innerText = Number(scorePanelB.innerText) + totalRaiderTeamPts; }
        if (defensePts > 0) { const scorePanelA = document.getElementById('fiveRaidScoreA'); if (scorePanelA) scorePanelA.innerText = Number(scorePanelA.innerText) + defensePts; }
    }

    // २. स्क्रीनवरून ५-५ चा आत्ताचा ताजा स्कोअर लगेच गोळा करणे
    const fresh55ScoreA = Number(document.getElementById('fiveRaidScoreA')?.innerText || 0);
    const fresh55ScoreB = Number(document.getElementById('fiveRaidScoreB')?.innerText || 0);

    // ३. मास्टर ऑब्जेक्ट लोकल मेमरीत वेगाने सिंक करणे
    let localCard = localStorage.getItem('global_score_card');
    let currentScoreCard = localCard ? JSON.parse(localCard) : { mainMatch: {teamA:0,teamB:0}, fiveRaid: {teamA:0,teamB:0}, goldenRaid: {teamA:0,teamB:0} };
    
    currentScoreCard.fiveRaid.teamA = fresh55ScoreA;
    currentScoreCard.fiveRaid.teamB = fresh55ScoreB;
    localStorage.setItem('global_score_card', JSON.stringify(currentScoreCard));


    // =========================================================================
    // 📂 SECTION 3: TIMELINE STREAM INTERFACES & MID-RAID SYNC ☁️
    // =========================================================================
    let mainResult = ""; let mainPoints = 0; let mainDetails = ""; let mainTeam = currentRaidingTeam;
    if (actionType === 'TOUCH_POINTS') { mainResult = "TOUCH POINT"; mainPoints = touchPts; mainDetails = `OUT: ${defenderNames}`; } 
    else if (actionType === 'BONUS_ONLY') { mainResult = "BONUS POINT"; mainPoints = 1; mainDetails = "✨ BONUS COMPLETED"; } 
    else if (actionType === 'BONUS_TOUCH') { mainResult = "BONUS + TOUCH"; mainPoints = touchPts + 1; mainDetails = `💥 +${touchPts} PTS | OUT: ${defenderNames}`; } 
    else if (actionType === 'BONUS_TACKLE') { mainResult = "BONUS + TACKLE"; mainPoints = 1; mainDetails = `🛡️ CAUGHT BOTH TEAM +1`; } 
    else if (actionType === 'EMPTY_OUT') { mainResult = "EMPTY RAID"; mainPoints = 1; mainDetails = "⚠️ TIME EXPIRED / OUT"; mainTeam = currentDefendingTeam; } 
    else if (actionType === 'TACKLE') { mainResult = "TACKLE POINT"; mainPoints = 1; mainDetails = `🛡️ CAUGHT BY: ${defenderNames}`; mainTeam = currentDefendingTeam; }

    if (typeof addRaidToSummary === 'function') { 
        addRaidToSummary(mainTeam, raiderName, mainResult, mainPoints, mainDetails, false, true); 
    }

    // इंडेक्स आणि रेड काउंटर्स पुढे सरकवणे
    if (currentRaidingTeam === 'A') { window.currentFiveRaidIndexA++; } else { window.currentFiveRaidIndexB++; }
    window.fiveRaidCount++; 

    // चालू सामन्यात प्रत्येक रेड संपताच ५-५ चा स्कोअर बॅकग्राउंडला फायरबेसवर ढकलणे (Full Safety)
    if (tId && mId && typeof db !== 'undefined') {
        db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
            status: "five_raid",
            scoreCard: currentScoreCard,
            lastUpdated: new Date().getTime()
        }).then(() => console.log(`☁️ [Mid-Raid-Sync]: रेड क्रमांक ${window.fiveRaidCount - 1} चा स्कोअर क्लाउडवर सुरक्षित सिंक झाला.`));
    }


    // =========================================================================
    // 📂 SECTION 4: 10-RAIDS FINITE CRITERIA & UNIFIED CLOSURE 🛑
    // =========================================================================
    if (window.fiveRaidCount > 10) {
        console.log("%c🛑 [10 RAIDS COMPLETED]: ५-५ च्या सर्व १० रेड्स पूर्ण झाल्या! निकाल तपासत आहे...", "color: #f97316; font-weight: bold;");

        // 🎯 परिस्थिती अ: ५-५ चा स्पष्ट विजेता मिळाला ➔ थेट मास्टर क्लोजर इंजिनला ट्रिगर करा!
        if (fresh55ScoreA !== fresh55ScoreB) {
            console.log("➡️ [DECISION]: ५-५ मध्ये रिझल्ट लागला! ताबा confirmEndMatch() कडे सुपूर्द करत आहे...");
            
            if (typeof confirmEndMatch === "function") {
                // आपण विनर टॅग मॅन्युअली पास न करता रिकामे सोडले, जेणेकरून तो स्वतः ५-५ चे गुण मोजून फायनल क्लोज करेल!
                await confirmEndMatch(); 
            }
            return;
        } 
        
        // 🎯 परिस्थिती ब: ५-५ मध्ये पुन्हा महा-टाय ➔ स्टेटस 'golden_raid' वर नेऊन ब्रेक लावणे
        else {
            if (mId) localStorage.setItem(`match_status_${mId}`, "golden_raid");
            console.log("🤝 [5-5 TIED]: पाच-पाच रेड्समध्येही टाय झाला! आता 'golden_raid' मोडवर जावे लागेल.");

            try {
                if (tId && mId && typeof db !== 'undefined') {
                    await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({ 
                        status: "golden_raid", 
                        lastUpdated: new Date().getTime(),
                        scoreCard: currentScoreCard
                    });
                }
                console.log("✅ [DB SUCCESS]: स्टेटस 'golden_raid' यशस्वीरित्या क्लाउडवर अपडेट झाला!");
            } catch (dbErr) { console.error("🚨 [DB ERROR]: golden_raid स्टेटस सिंक फेल!", dbErr); }

            Swal.fire({ 
                title: 'अजूनही महा-टाय! 🤝', 
                html: `<div class="text-sm font-sans space-y-2"><p class="font-black text-amber-500 text-sm uppercase">पाच-पाच रेड्समध्येही दोन्ही संघ बरोबरीत!</p><p class="text-xs text-zinc-400">आता अंतिम निकाल फक्त 'गोल्डन रेड' (Sudden Death) वर लागणार.</p></div>`, 
                icon: 'warning', background: '#111', color: '#fff', confirmButtonText: '⚡ GOLDEN RAID सुरू करा', confirmButtonColor: '#f97316', allowOutsideClick: false 
            }).then(() => { 
                if (typeof initGoldenRaidSetup === 'function') { initGoldenRaidSetup(); } 
            });
            return;
        }
    }

    // जर १० रेड्स पूर्ण झाल्या नसतील, तर पुढच्या टीमचा टर्न डिस्प्लेवर सेट करणे
    const nextTeamTag = (window.fiveRaidCount % 2 !== 0) ? 'A' : 'B';
    if (typeof updateFiveRaidDisplay === 'function') { 
        updateFiveRaidDisplay(nextTeamTag); 
    }
}


/** 🎛️ DEFENDER SELECTION WINDOW (नो चेंज - लॉजिक १००% सुरक्षित) */
async function openFiveRaidDefenderSelector(maxSelectionCount, bonusValue, actionTag) {
    console.log(`%c🎬 [DEFENDER SQUAD SELECTOR]: उघडत आहे. संख्या लिमिट: ${maxSelectionCount}`, "color: #3b82f6; font-weight: bold;");

    const currentRaidingTeam = (window.fiveRaidCount % 2 !== 0) ? 'A' : 'B';
    const defendingTeamTag = (currentRaidingTeam === 'A') ? 'B' : 'A';
    
    let defendersList = [];
    if (typeof currentMatchData !== 'undefined' && currentMatchData) {
        defendersList = (defendingTeamTag === 'A') ? (currentMatchData.teamAPlayers || currentMatchData.teamA_players || []) : (currentMatchData.teamBPlayers || currentMatchData.teamB_players || []);
    }

    if (!defendersList || defendersList.length === 0) {
        defendersList = Array.from({length: 12}, (_, i) => ({ name: `Player ${defendingTeamTag}${i+1}`, no: defendingTeamTag === 'A' ? i+1 : 21+i }));
    }

    window.tempSelectedFiveDefs = []; 

    let popupTitle = `आऊट झालेले ${maxSelectionCount} डिफेंडर निवडा:`;
    if (actionTag === 'BONUS_TACKLE') popupTitle = `टॅकल करणारा (Tackle) डिफेंडर निवडा:`;

    await Swal.fire({
        title: popupTitle,
        html: `
            <div class="text-[10px] text-orange-500 font-bold uppercase mb-2 text-left pl-1">
                निवडलेले: <span id="swalSelCount">0</span> / ${maxSelectionCount}
            </div>
            <div class="grid grid-cols-2 gap-2 p-1 font-sans max-h-60 overflow-y-auto">
                ${defendersList.map(p => {
                    const pName = p.name || "Player";
                    const pNo = p.no || p.jersey || "0";
                    return `
                        <button id="defBtn_${pNo}" onclick="toggleFiveRaidDefenderSelection('${pName}', '${pNo}', ${maxSelectionCount})" class="bg-slate-900 border border-zinc-800 text-white font-bold text-xs py-3 rounded-xl transition-all truncate px-2 text-left flex items-center gap-1.5">
                            <span id="dot_${pNo}" class="w-2 h-2 rounded-full bg-zinc-700"></span>
                            <span>#${pNo} ${pName}</span>
                        </button>
                    `;
                }).join('')}
            </div>
            <button onclick="Swal.close('DIRECT_TEAM')" class="w-full bg-slate-800 border border-zinc-700 text-zinc-400 font-black text-[10px] py-2.5 rounded-xl mt-3 uppercase">
                🛡️ Direct Team Point (नावे निवडायचे नाहीत)
            </button>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        background: '#111',
        color: '#fff'
    }).then((result) => {
        let finalDefendersNames = "Team Defense";
        
        if (window.tempSelectedFiveDefs && window.tempSelectedFiveDefs.length > 0) {
            finalDefendersNames = window.tempSelectedFiveDefs.join(", ");
        } else if (result && result.value && result.value !== 'DIRECT_TEAM') {
            finalDefendersNames = result.value;
        }

        console.log(`💥 [SQUAD SELECTOR COMPLETE]: Result Locked ➔ ${finalDefendersNames}`);
        
        if (actionTag === 'TOUCH_POINTS') {
            saveFiveRaidOutcome('TOUCH_POINTS', maxSelectionCount, 0, 0, finalDefendersNames);
        } else if (actionTag === 'BONUS_TOUCH') {
            saveFiveRaidOutcome('BONUS_TOUCH', maxSelectionCount, 1, 0, finalDefendersNames);
        } else if (actionTag === 'BONUS_TACKLE') {
            saveFiveRaidOutcome('BONUS_TACKLE', 0, 1, 1, finalDefendersNames);
        }
    });
}



/*******/////////*******// 🪙 [GOLDEN RAID SETUP]: टॉस आणि सिस्टीम निवड पॉप-अप //////////////////************************ */

// 🪙 [GOLDEN RAID SETUP]: टॉस आणि सिस्टीम निवड पॉप-अप
// 🪙 [GOLDEN TOSS & PLAYER WINDOW]: टॉस झाल्यावर थेट खेळाडू निवड विंडो उघडणे
async function initGoldenRaidSetup() {
    console.log("%c🪙 [GOLDEN LOG 1]: initGoldenRaidSetup() सुरू झाले!", "color: #f59e0b; font-weight: bold; font-size: 13px;");

    const realTeamNameA = document.getElementById('teamAName')?.innerText || 'TEAM A';
    const realTeamNameB = document.getElementById('teamBName')?.innerText || 'TEAM B';

    // १. टॉसचा कडक निऑन पॉप-अप
    const { value: tossResult } = await Swal.fire({
        title: 'गोल्डन रेड (Golden Raid) टॉस निकाल',
        html: `
            <div class="space-y-4 p-1 font-sans text-left">
                <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pl-1">टॉस जिंकून 'रेडिंग' करणारा संघ निवडा:</p>
                <div class="flex flex-col gap-2.5">
                    <button onclick="Swal.getInput().value = 'A'; Swal.clickConfirm();" class="w-full bg-green-950/60 border border-green-500/30 text-green-400 py-3.5 rounded-xl text-xs font-black uppercase px-4 flex justify-between items-center">
                        <span>🏃‍♂️ ${realTeamNameA}</span>
                    </button>
                    <button onclick="Swal.getInput().value = 'B'; Swal.clickConfirm();" class="w-full bg-blue-950/60 border border-blue-500/30 text-blue-400 py-3.5 rounded-xl text-xs font-black uppercase px-4 flex justify-between items-center">
                        <span>🏃‍♂️ ${realTeamNameB}</span>
                    </button>
                </div>
            </div>
        `,
        input: 'text',
        inputAttributes: { style: 'display: none;' },
        showConfirmButton: false, allowOutsideClick: false, background: '#111', color: '#fff'
    });

    console.log(`🔍 [GOLDEN LOG 2]: टॉसचा निकाल मिळाला ➔ Team "${tossResult}"`);

    if (tossResult) {
        // मास्टर ग्लोबल फ्लॅग्स मेमरी लॉक करणे
        window.isGoldenRaidActiveNow = true; 
        window.goldenRaidAttackingTeam = tossResult;

        // ५-५ च्या काउंटरचा आयडी सुरक्षित ठेवून टेक्स्ट बदलणे
        const roundCounterEl = document.getElementById('fiveRaidRoundCounter');
        if (roundCounterEl) {
            roundCounterEl.innerText = "⚡ GOLDEN";
            console.log("✅ [DOM]: काउंटर टेक्स्ट यशस्वी बदलला.");
        }

        // २. 💥 [THE MASTER INJECTION]: मॅच टाईमलाईनमध्ये कडक सोनेरी ब्रेक (Divider) ढकलणे!
        const modalRaidList = document.getElementById('modalRaidList');
        if (modalRaidList && !window.goldenRaidDividerInserted) {
            window.goldenRaidDividerInserted = true; // दोबारा पडू नये म्हणून लॉक
            const goldenDivider = document.createElement('div');
            goldenDivider.className = "my-4 mx-1 p-2 bg-gradient-to-r from-yellow-950 via-slate-900 to-yellow-950 border border-yellow-500/40 rounded-xl text-center shadow-lg animate-pulse";
            goldenDivider.innerHTML = `
                <p class="text-[10px] text-yellow-500 font-black tracking-widest uppercase">⚡ 5-5 RAIDS MODE TIED AGAIN</p>
                <p class="text-[8px] text-white font-bold uppercase mt-0.5">👑 GOLDEN RAID (SUDDEN DEATH) STARTED</p>
            `;
            modalRaidList.prepend(goldenDivider);
            console.log("✅ [TIMELINE]: सुवर्ण ब्रेक यशस्वी इन्सर्ट झाला!");
        }

        // ३. रेडर यादी उघडणे (Match Data मधून)
        let playersList = [];
        if (typeof currentMatchData !== 'undefined' && currentMatchData) {
            playersList = (tossResult === 'A') 
                ? (currentMatchData.teamAPlayers || currentMatchData.teamA_players || []) 
                : (currentMatchData.teamBPlayers || currentMatchData.teamB_players || []);
        }
        if (!playersList || playersList.length === 0) {
            playersList = Array.from({length: 5}, (_, i) => ({ name: `Raider ${tossResult}${i+1}`, no: i+1 }));
        }

        const { value: selectedRaiderName } = await Swal.fire({
            title: 'गोल्डन रेडसाठी रेडर निवडा:',
            html: `
                <div class="grid grid-cols-2 gap-2 p-1 font-sans">
                    ${playersList.map(p => `
                        <button onclick="Swal.getInput().value = '${p.name}'; Swal.clickConfirm();" class="bg-slate-900 border border-zinc-800 text-white font-bold text-xs py-3 rounded-xl truncate px-2 text-left">
                            🏃‍♂️ #${p.no || p.jersey || ''} ${p.name}
                        </button>
                    `).join('')}
                </div>
            `,
            input: 'text',
            inputAttributes: { style: 'display: none;' },
            showConfirmButton: false, allowOutsideClick: false, background: '#111', color: '#fff'
        });

        window.goldenRaiderSelectedName = selectedRaiderName || "Golden Raider";
        console.log(`👤 [GOLDEN LOG 3]: निवडलेला अंतिम रेडर ➔ ${window.goldenRaiderSelectedName}`);
        
        // ५-५ च्या पॅनेलवरील नाव बदलणे
        const activeNameLabel = document.getElementById('fiveRaidActiveRaiderName');
        if (activeNameLabel) activeNameLabel.innerText = window.goldenRaiderSelectedName;

        // पॅनेलवरील टीम बॅज सोनेरी आणि ॲनिमेटेड करणे
        const badgeEl = document.getElementById('fiveRaidActiveTeamBadge');
        if (badgeEl) {
            badgeEl.innerText = `GOLDEN RAID [TEAM ${tossResult}]`;
            badgeEl.className = "bg-yellow-500 text-black font-black text-[8px] px-2 py-0.5 rounded uppercase animate-pulse";
        }
    }
}

// ⚡ [GOLDEN RAID UI ENGINE]: स्क्रीनवर गोल्डन रेड पॅनेल दाखवणे (WITH DEEP LOGS)
// ⚡ [GOLDEN RAID UI ENGINE]: स्क्रीनवर ५-५ च्या डब्यातच गोल्डन पॅनेल री-राइट करणे
function startGoldenRaidMode(raidingTeamTag) {
    console.log(`%c⚡ [GOLDEN LOG 4]: startGoldenRaidMode() सुरू. टीम टॅग: ${raidingTeamTag}`, "color: #eab308; font-weight: bold;");
    
    window.goldenRaidTeam = raidingTeamTag; // ग्लोबल मेमरी लॉक
    
    const realTeamNameA = document.getElementById('teamAName')?.innerText || 'TEAM A';
    const realTeamNameB = document.getElementById('teamBName')?.innerText || 'TEAM B';
    const activeTeamName = (raidingTeamTag === 'A') ? realTeamNameA : realTeamNameB;

    const fivePanel = document.getElementById('fiveRaidBattleGroundPanel');
    if (!fivePanel) {
        console.error("🚨 [GOLDEN FATAL ERROR]: fiveRaidBattleGroundPanel आयडी स्क्रीनवर सापडला नाही!");
        return;
    }

    // ५-५ चा पॅनेल चालू ठेवून त्याची बॉर्डर गोल्डन करणे
    fivePanel.classList.remove('hidden');
    fivePanel.classList.add('flex');
    fivePanel.classList.remove('border-orange-500/20');
    fivePanel.classList.add('border-yellow-500/40');

    // ५-५ च्या डब्याचा जुना कचरा साफ करून तिथे थेट नवीन सुवर्ण बटन्स बसवणे
    fivePanel.innerHTML = `
        <div id="goldenRaidBattleGroundPanel" class="flex flex-col w-full anim-fade-in">
            <div class="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                <h3 class="text-yellow-500 font-black italic text-xs uppercase tracking-wider animate-pulse">⚡ GOLDEN RAID MODE (SUDDEN DEATH)</h3>
                <span class="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[8px] font-black px-2 py-0.5 rounded-md uppercase">FINAL RAID</span>
            </div>

            <div class="bg-gradient-to-r from-amber-950/40 to-zinc-900 border border-amber-500/20 p-3 rounded-xl flex items-center justify-between shadow-inner mb-4">
                <div>
                    <p class="text-[7px] text-zinc-500 font-black uppercase">ATTACKING SQUAD (टॉस विजेता)</p>
                    <p class="text-white text-xs font-black uppercase mt-0.5">${activeTeamName}</p>
                </div>
                <div class="bg-yellow-500 text-black font-black text-[8px] px-2 py-0.5 rounded uppercase shadow-sm">
                    DO OR DIE RAID
                </div>
            </div>

            <div class="grid grid-cols-3 gap-2.5">
                <button onclick="saveGoldenRaidOutcome('SUCCESS', 1, 'रेडर यशस्वी रीतीने पॉईंट घेऊन परतला!')" class="bg-green-950/60 border border-green-500/30 text-green-400 font-black py-4 rounded-xl text-[10px] uppercase tracking-wide active:bg-green-900 shadow-md flex flex-col items-center justify-center gap-1 active:scale-95">
                    <span class="text-base">🏆</span>
                    <span>RAID SUCCESS</span>
                </button>

                <button onclick="saveGoldenRaidOutcome('TACKLE', 1, 'डिफेन्सने策 रेडरला कडक पकडले!')" class="bg-red-950/60 border border-red-500/30 text-red-400 font-black py-4 rounded-xl text-[10px] uppercase tracking-wide active:bg-red-900 shadow-md flex flex-col items-center justify-center gap-1 active:scale-95">
                    <span class="text-base">🛡️</span>
                    <span>RAIDER CAUGHT</span>
                </button>

                <button onclick="saveGoldenRaidOutcome('EMPTY_OUT', 1, 'एम्प्टी रेड टाकल्यामुळे नियमानुसार रेडर आऊट!')" class="bg-slate-900 border border-zinc-800 text-zinc-400 font-black py-4 rounded-xl text-[10px] uppercase tracking-wide active:bg-slate-850 shadow-md flex flex-col items-center justify-center gap-1 active:scale-95">
                    <span class="text-base">⚠️</span>
                    <span>EMPTY RAID OUT</span>
                </button>
            </div>
        </div>
    `;
    console.log("%c✅ [GOLDEN LOG 5]: सुवर्ण पॅनेल यशस्वी रिप्लेस झाला आहे!", "color: #10b981; font-weight: bold;");
}

/**
 * तोडगा: गोल्डन रेडच्या पोटात scoreCard परमनंट लॉक करणे
आपण तुझा मूळचा addRaidToSummary चा कडक फ्लो, Swal चा महासंग्राम विनर पॉप-अप, आणि fivePanel लपवण्याचं लॉजिक जसं च्या तसं सुरक्षित ठेवलं आहे.
फक्त निकाल लागताच लोकल स्टोरेजमधून फ्रेश global_score_card ओढून, जो संघ जिंकला असेल त्याच्या goldenRaid च्या कप्प्यात 1 पॉईंट परमनंट लॉक करून तो थेट डेटाबेसमध्ये कसा सिंक करायचा, ते फिक्स केलं आहे.
 */

// async function saveGoldenRaidOutcome(statusType, logDetails) {
//     console.log(`%c🏁 [GOLDEN PROCESS]: Type: ${statusType}`, "background: #eab308; color: #000; font-weight: bold;");

//     const mId = typeof matchSetupData !== 'undefined' ? matchSetupData?.mId : "";
//     const tId = typeof matchSetupData !== 'undefined' ? matchSetupData?.tId : "";

//     const realTeamNameA = document.getElementById('teamAName')?.innerText || 'TEAM A';
//     const realTeamNameB = document.getElementById('teamBName')?.innerText || 'TEAM B';

//     const raidingTeam = window.goldenRaidTeam; 
//     const defendingTeam = (raidingTeam === 'A') ? 'B' : 'A';

//     let finalWinnerTeamTag = (statusType === 'SUCCESS') ? raidingTeam : defendingTeam;
//     const finalWinnerName = (finalWinnerTeamTag === 'A') ? realTeamNameA : realTeamNameB;

//     // 🚀 [THE MASTER LINK]: एक्स्ट्रा फंक्शन उडवून थेट मूळ फंक्शनला कॉल केला
//     if (typeof addRaidToSummary === 'function') {
//         addRaidToSummary(
//             finalWinnerTeamTag, 
//             `GOLDEN RAID [${raidingTeam}]`, 
//             statusType === 'SUCCESS' ? "GOLDEN RAID SUCCESS" : "GOLDEN RAID CAUGHT", 
//             1, 
//             `👑 MAHA-WINNER: ${finalWinnerName} (${logDetails})`,
//             false,
//             false,
//             true // 🌟 हा शेवटचा पॅरामीटर गोल्डन कार्ड आणि डिव्हाइइर ट्रिगर करेल!
//         );
//     }

//     // 🎯 [💥 MASTER SCORECARD GOLDEN LOCK]
//     // लोकल स्टोरेजमधून जुना मास्टर ऑब्जेक्ट आणणे आणि गोल्डन रेडचा आलेख बदलणे
//     let localCard = localStorage.getItem('global_score_card');
//     let currentScoreCard = localCard ? JSON.parse(localCard) : {
//         mainMatch:  { teamA: 0, teamB: 0 },
//         fiveRaid:   { teamA: 0, teamB: 0 },
//         goldenRaid: { teamA: 0, teamB: 0 }
//     };

//     // जो संघ सुवर्ण रेड जिंकला, त्याच्या कप्प्यात १ पॉईंट लॉक केला!
//     currentScoreCard.goldenRaid.teamA = (finalWinnerTeamTag === 'A') ? 1 : 0;
//     currentScoreCard.goldenRaid.goldenRaid?.teamB || 0; // सेफ साईड बॅकअप
//     currentScoreCard.goldenRaid.teamB = (finalWinnerTeamTag === 'B') ? 1 : 0;

//     // लोकल स्टोरेज अपडेट
//     localStorage.setItem('global_score_card', JSON.stringify(currentScoreCard));
//     if (mId) localStorage.setItem(`match_status_${mId}`, "Finished");

//     console.log("%c📊 [GOLDEN SCORE LOCKED]: मास्टर ऑब्जेक्टमध्ये सुवर्ण रेडचा स्कोअर नोंदवला!", "color: #22c55e; font-weight: bold;");
//     console.dir(currentScoreCard.goldenRaid);

//     // ☁️ [💥 SAFE ASYNC UPDATE]: डेटाबेसमध्ये 'Finished' स्टेटससह संपूर्ण मास्टर ऑब्जेक्ट जतन!
//     try {
//         if (tId && mId && typeof db !== 'undefined') {
//             await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({ 
//                 status: "Finished", 
//                 winner: finalWinnerName, 
//                 winner_id: finalWinnerTeamTag,
//                 finalScore: `Golden Raid Winner: ${finalWinnerName}`,
//                 lastUpdated: new Date().getTime(),
                
//                 // 🎯 [SINGLE SOURCE OF TRUTH]: अख्खा scoreCard क्लाउडवर पाठवला!
//                 scoreCard: currentScoreCard
//             });
//             console.log("✅ [DB SUCCESS]: गोल्डन रेडचा निकाल ऑफिशिअल मास्टर ऑब्जेक्टसह डेटाबेसमध्ये लॉक झाला!");
//         } else if (typeof updateMatchStatusInDB === 'function') {
//             // जर तुझ्याकडे कॉमन डीबी फंक्शन असेल तर त्यात डेटा पाठवणे
//             await updateMatchStatusInDB('Finished', { 
//                 goldenRaidWinner: finalWinnerName, 
//                 goldenRaidWinnerTag: finalWinnerTeamTag,
//                 details: logDetails,
//                 status: "Finished",
//                 scoreCard: currentScoreCard
//             });
//         }
//     } catch (dbErr) { 
//         console.error("🚨 [DB ERROR]: सुवर्ण निकाल डेटाबेस सिंक फेल!", dbErr); 
//     }

//     // अंतिम भव्य विजेता पॉप-अप (No Change)
//     Swal.fire({
//         title: '🔥 महासंग्राम संपला! 🔥',
//         html: `<div class="text-sm font-sans space-y-3 p-1">
//                 <div class="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-4 py-3 rounded-2xl font-black text-sm uppercase tracking-tight shadow-xl">
//                     👑 ${finalWinnerName} विजेता!
//                 </div>
//                 <p class="text-xs text-zinc-400 font-bold uppercase tracking-wider italic">${logDetails}</p>
//                </div>`,
//         icon: 'success',
//         background: '#111',
//         color: '#fff',
//         confirmButtonText: '🏁 MATCH CLOSE',
//         confirmButtonColor: '#eab308',
//         allowOutsideClick: false
//     }).then(() => {
//         const fivePanel = document.getElementById('fiveRaidBattleGroundPanel');
//         if (fivePanel) fivePanel.classList.add('hidden');
//         window.isFiveRaidModeOn = false;
//         window.isGoldenRaidActiveNow = false;

//         // मॅचेसच्या मुख्य स्क्रीनवर रिडायरेक्ट करणे
//         if (typeof loadPage === "function") loadPage('tournaments');
//     });
// }

/**
 * 
 *🛠️ सुधारित saveGoldenRaidOutcome (थेट confirmEndMatch कनेक्टेड)
हा संपूर्ण कोड कॉपी कर आणि तुझ्या फाईलमध्ये जुन्या फंक्शनच्या जागी रिप्लेस करून घे भावा} tId 
 */

async function saveGoldenRaidOutcome(statusType, logDetails) {
    // =========================================================================
    // 📂 SECTION 1: DYNAMIC GOLDEN WINNER RESOLUTION
    // =========================================================================
    console.log(`%c🏁 [GOLDEN PROCESS INITIALIZED]: Type: ${statusType}`, "background: #eab308; color: #000; font-weight: bold;");

    const realTeamNameA = document.getElementById('teamAName')?.innerText || 'TEAM A';
    const realTeamNameB = document.getElementById('teamBName')?.innerText || 'TEAM B';

    const raidingTeam = window.goldenRaidTeam; 

    // सुवर्ण रेड यशस्वी झाली की पकडली गेली यावरून जिंकलेली टीम ठरवणे
    let finalWinnerTeamTag = (statusType === 'SUCCESS') ? raidingTeam : ((raidingTeam === 'A') ? 'B' : 'A');
    const finalWinnerName = (finalWinnerTeamTag === 'A') ? realTeamNameA : realTeamNameB;


    // =========================================================================
    // 📂 SECTION 2: TIMELINE ENTRY IGNITION
    // =========================================================================
    if (typeof addRaidToSummary === 'function') {
        addRaidToSummary(
            finalWinnerTeamTag, 
            `GOLDEN RAID [${raidingTeam}]`, 
            statusType === 'SUCCESS' ? "GOLDEN RAID SUCCESS" : "GOLDEN RAID CAUGHT", 
            1, 
            `👑 MAHA-WINNER: ${finalWinnerName} (${logDetails})`,
            false,
            false,
            true // 🌟 हा शेवटचा पॅरामीटर गोल्डन कार्ड थीम आणि डिव्हायडर ऑन करेल
        );
    }


    // =========================================================================
    // 📂 SECTION 3: RE-CALCULATING MASTER SCORECARD MEMORY
    // =========================================================================
    let localCard = localStorage.getItem('global_score_card');
    let currentScoreCard = localCard ? JSON.parse(localCard) : {
        mainMatch:  { teamA: 0, teamB: 0 },
        fiveRaid:   { teamA: 0, teamB: 0 },
        goldenRaid: { teamA: 0, teamB: 0 }
    };

    // जो संघ सुवर्ण रेड जिंकला, त्याच्या कप्प्यात १ पॉईंट देणे (दुसऱ्याला ०)
    currentScoreCard.goldenRaid.teamA = (finalWinnerTeamTag === 'A') ? 1 : 0;
    currentScoreCard.goldenRaid.teamB = (finalWinnerTeamTag === 'B') ? 1 : 0;

    // स्कोरकार्ड तात्काळ लोकल स्टोरेजमध्ये अपडेट करणे
    localStorage.setItem('global_score_card', JSON.stringify(currentScoreCard));
    console.log("%c📊 [GOLDEN SCORE LOCKED]: मेमरीमध्ये सुवर्ण रेडचा स्कोअर अचूक सिंक केला!", "color: #22c55e; font-weight: bold;");


    // =========================================================================
    // 📂 SECTION 4: DELEGATING ENTIRE CONTROL TO MASTER END MATCH ENGINE 🚀
    // =========================================================================
    // 🚨 [💥 THE EXACT UNIFICATION]: स्वतंत्र पॉपअप आणि डीबी कोड काढून थेट आपल्या एकाच मास्टर फंक्शनला कामाला लावले!
    if (typeof confirmEndMatch === "function") {
        console.log("➡️ [ROUTING TO SINGLE ENGINE]: ताबा अधिकृतपणे confirmEndMatch कडे सुपूर्द केला!");
        
        // आपण बनवलेल्या नवीन रचनेनुसार विनर टॅग आणि लॉग डिटेल्स थेट पास केले, जेणेकरून युझरला डबल पॉपअप न विचारता थेट रिझल्ट दिसेल
        await confirmEndMatch(finalWinnerTeamTag, logDetails);
    } else {
        console.error("🚨 [CORE FUNCTION MISSING]: confirmEndMatch स्क्रिप्टमध्ये सापडले नाही!");
    }
}


// =========================================================================
// 📂 FUNCTION: viewMatchSummary(tId, mId)
// 🎯 उद्देश: सामना संपल्यानंतर थेट मॅच सेंटर (Summary Modal) उघडणे
// =========================================================================
function viewMatchSummary(tId, mId) {
    // =========================================================================
    // 📂 SECTION 1: VALIDATION & ULTIMATE FALLBACK CHECKS
    // =========================================================================
    console.log("%c==================================================", "color: #10b981; font-weight: bold;");
    console.log("%c📊 [MATCH SUMMARY TRIGGER]: सामना समरी उघडण्याची पडताळणी सुरू...", "background: #f0fdf4; color: #166534; font-weight: bold; padding: 2px;");

    let finalTId = tId;
    let finalMId = mId;

    if (!finalTId && typeof matchSetupData !== 'undefined' && matchSetupData?.tId) finalTId = matchSetupData.tId;
    if (!finalMId && typeof matchSetupData !== 'undefined' && matchSetupData?.mId) finalMId = matchSetupData.mId;

    if (!finalTId && typeof currentMatchData !== 'undefined' && currentMatchData?.tId) finalTId = currentMatchData.tId;
    if (!finalMId && typeof currentMatchData !== 'undefined' && currentMatchData?.mId) finalMId = currentMatchData.mId;

    // जर अजूनही आयडी मिळाले नाहीत तर 'squad_editing_match' स्टोरेज बॅकअप ओढणे
    if (!finalTId || !finalMId) {
        const savedMatchRaw = localStorage.getItem('squad_editing_match');
        if (savedMatchRaw) {
            const parsed = JSON.parse(savedMatchRaw);
            finalTId = finalTId || parsed.tId;
            finalMId = finalMId || parsed.mId;
        }
    }

    if (!finalTId || !finalMId) {
        console.error("🚨 [SUMMARY CRITICAL ERROR]: टूर्नामेंट आयडी किंवा मॅच आयडी दोन्ही मेमरीमध्ये सापडले नाहीत!");
        Swal.fire("त्रुटी", "मॅच समरी उघडण्यासाठी आवश्यक आयडी मिळाले नाहीत.", "error");
        return;
    }

    console.log(`👉 Targeting Tournament: ${finalTId} | Match: ${finalMId}`);


    // =========================================================================
    // 📂 SECTION 2: SECURE LOG DISCOVERY & TIMELINE MEMORY RECOVERY 🧪
    // =========================================================================
    console.log("%c============== 🧪 [SECURE LOG DIAGNOSTIC] ==============", "background: #0284c7; color: #fff; font-weight: bold; padding: 2px;");
    
    // १. आधी ग्लोबल मेमरी चेक करणे
    if (!window.activeRaidsList || window.activeRaidsList.length === 0) {
        console.log("⚠️ [Memory Empty]: ग्लोबल activeRaidsList रिकामी आहे. आता 'raids_secure_log' शोधत आहे...");
        
        // २. लोकल स्टोरेजमधील सुरक्षित एनकोडेड लॉग ट्रॅक करणे
        const secureLogRaw = localStorage.getItem(`raids_secure_log_${finalMId}`);
        
        if (secureLogRaw) {
            try {
                const decoded = decodeURIComponent(escape(atob(secureLogRaw)));
                window.activeRaidsList = JSON.parse(decoded);
                console.log(`🎯 [DIAGNOSTIC SUCCESS]: raids_secure_log_${finalMId} सापडला! एकूण ${window.activeRaidsList.length} रेड्स मेमरीमध्ये यशस्वीरीत्या रिस्टोर केल्या.`);
            } catch (e) {
                console.error("🚨 [DIAGNOSTIC ERROR]: raids_secure_log डीकोड करताना क्रॅश झाला:", e);
            }
        } else {
            console.log(`❌ [DIAGNOSTIC FAIL]: 'raids_secure_log_${finalMId}' नावाचा कप्पा लोकल स्टोरेजमध्ये सापडला नाही!`);
        }
    } else {
        console.log(`✅ [Memory Alive]: ग्लोबल मेमरीमध्ये आधीच ${window.activeRaidsList.length} रेड्स ट्रॅकवर आहेत.`);
    }
    console.log("%c================================================================", "color: #0284c7;");


    // =========================================================================
    // 📂 SECTION 3: LIVE SCORECARD RE-SYNC TO HOME MEMORY
    // =========================================================================
    try {
        const localCard = localStorage.getItem('global_score_card');
        const activeMatchKey = `active_match_${finalTId}_${finalMId}`;
        const localMatchDetails = localStorage.getItem(activeMatchKey);

        if (localMatchDetails && typeof homeLiveMatchesStorage !== 'undefined') {
            const parsedMatch = JSON.parse(localMatchDetails);
            const combinedKey = `${finalTId}_${finalMId}`;
            
            if (!homeLiveMatchesStorage[combinedKey]) homeLiveMatchesStorage[combinedKey] = {};
            
            homeLiveMatchesStorage[combinedKey] = {
                ...parsedMatch,
                scoreCard: localCard ? JSON.parse(localCard) : parsedMatch.scoreCard,
                timeline: window.activeRaidsList || parsedMatch.timeline || []
            };
            console.log("💾 [LOCAL RESYNC SUCCESS]: होम स्टोरेज मेमरी तात्पुरती सिंक केली.");
        }
    } catch (syncErr) {
        console.warn("⚠️ [LOCAL RESYNC WARN]: होम मेमरी सिंक एरर:", syncErr);
    }


    // =========================================================================
    // 📂 SECTION 4: ROUTING TO CORRECT SUMMARY MODAL ENGINE (🎯 THE TRIPLE FIX)
    // =========================================================================
    // 🚨 [FIXED]: जुने openMatchCentreFromHome काढून थेट आपले मुख्य openSummaryModal इंजिन चालू केले!
    if (typeof openSummaryModal === "function") {
        console.log("🚀 [ROUTING]: मुख्य openSummaryModal() कडे ताबा सोपवत आहे...");
        openSummaryModal(finalTId, finalMId);
    } else {
        console.error("🚨 [CORE MISSING]: 'openSummaryModal' हे मुख्य फंक्शन स्क्रिप्टमध्ये सापडले नाही!");
        Swal.fire("त्रुटी", "मॅच समरीचे मुख्य मोडल इंजिन सापडले नाही.", "error");
    }

    console.log("%c==================================================", "color: #10b981; font-weight: bold;");
}


    // =========================================================================
//आपण बनवलेल्या initPlayerProfileView फंक्शनमध्ये फक्त एक ओळ जोडून घेऊया, जी ओळखेल की स्वतःची प्रोफाईल सुरू आहे की दुसऱ्या प्लेयरची:
    // =========================================================================

async function initPlayerProfileView(targetPlayerId = null) {
    console.log("%c==================================================", "color: #3b82f6; font-weight: bold;");
    console.log(`👤 [PROFILE ENGINE INITIATED]: Target ID ➔ ${targetPlayerId || 'OWN_LOGGED_IN_PROFILE'}`);

    // १. लॉगिन आयडी रिकव्हरी (तुझ्या सिस्टीममधील व्हेरिएबल इथे वापरू शकतोस)
    const currentUserId = window.loggedInUserPlayerId || localStorage.getItem('current_logged_in_pId') || "";
    
    // जर targetPlayerId मॅन्युअली पास केला नसेल, तर आपण स्वतःची प्रोफाईल उघडली आहे असे समजणे
    const isOwnProfile = !targetPlayerId || targetPlayerId === currentUserId;
    const finalPlayerId = targetPlayerId || currentUserId || "RXOKQQC"; 
    currentViewingPlayerId = finalPlayerId;

    // २. डायनॅमिक नेव्हिगेशन आणि बॅक बटण मॅनेजमेंट
    const backBtnContainer = document.getElementById('profileBackButtonContainer');
    if (backBtnContainer) {
        if (!isOwnProfile) {
            backBtnContainer.innerHTML = `
                <button onclick="loadPage('team_profile')" class="text-[10px] font-black text-zinc-400 bg-zinc-950 border border-zinc-850 px-3 py-1.5 rounded-xl flex items-center gap-1">
                    <i class="fa-solid fa-arrow-left"></i> SQUAD
                </button>`;
        } else {
            backBtnContainer.innerHTML = ""; // स्वतःच्या मूळ टॅबवर बॅक बटण नको
        }
    }

    // ३. 🎯 [LOGOUT BUTTON CONTROLLER]: स्वतःची प्रोफाईल असेल तरच लॉगआउट दाखवणे, दुसऱ्याच्या वेळी गपचूप लपवणे
    const logoutContainer = document.getElementById('profileLogoutBtnWrapper');
    if (logoutContainer) {
        if (isOwnProfile) {
            logoutContainer.classList.remove('hidden');
        } else {
            logoutContainer.classList.add('hidden');
        }
    }

    // ४. शेवटी अधिकृत आकडे ओढणे सुरू करणे
    await fetchAndRenderPlayerStats();
}


async function fetchAndRenderPlayerStats() {
    if (!currentViewingPlayerId) return;

    // सीजन फिल्टर आणि डोम एलिमेंट्स
    const selectedSeason = document.getElementById('profileSeasonFilter')?.value || "2026";
    const gridEl = document.getElementById('playerStatsMainGrid');
    const loadingEl = document.getElementById('playerStatsLoadingState');

    if (gridEl) gridEl.classList.add('hidden');
    if (loadingEl) loadingEl.classList.remove('hidden');

    console.log(`%c📊 [COMPILING STATS]: Player ID: ${currentViewingPlayerId} | Season: ${selectedSeason}`, "color: #eab308; font-weight: bold;");

    try {
        let totalMatches = 0;
        let detectedTeamName = "No Active Team";
        
        // 🧮 सर्व प्रिमियम आकड्यांचे सुरुवातीचे फॉलबॅक मॅट्रिक्स
        let finalStats = {
            raids: 0, raid_gain: 0, raid_loss: 0, bonus: 0, empty_raids: 0,
            tackles: 0, tackle_gain: 0, tackle_loss: 0, super_tackles: 0,
            points: 0
        };
        
        let historyHtml = "";

        // 🔥 [FIRESTORE DEEP QUERY]: टूर्नामेंटमधील सर्व Finished सामने तपासणे
        const tId = window.matchSetupData?.tId || window.currentMatchData?.tId || "KV_CUP_2026";
        const matchesSnapshot = await db.collection("tournaments").doc(tId).collection("matches").where("status", "==", "Finished").get();

        matchesSnapshot.forEach(doc => {
            const match = doc.data();
            const teamAPlayers = match.teamAPlayers || match.teamA_players || [];
            const teamBPlayers = match.teamBPlayers || match.teamB_players || [];

            // १. दोन्ही संघांच्या खेळाडूंमध्ये हा Player ID शोधणे
            let playerObj = [...teamAPlayers, ...teamBPlayers].find(p => p.pId === currentViewingPlayerId);

            if (playerObj) {
                totalMatches++;
                
                // २. डेटाबेसमधून त्या विशिष्ट सामन्याचे प्रिमियम आकडे गोळा करणे
                const pStats = playerObj.stats || { raids: 0, raid_gain: 0, raid_loss: 0, bonus: 0, empty_raids: 0, tackles: 0, tackle_gain: 0, tackle_loss: 0, super_tackles: 0, points: 0 };

                // ३. करंट टीम अचूक शोधणे
                if (detectedTeamName === "No Active Team") {
                    let isTeamA = teamAPlayers.some(p => p.pId === currentViewingPlayerId);
                    detectedTeamName = isTeamA ? (match.teamA || "Team A") : (match.teamB || "Team B");
                }

                // ४. करिअर ग्रँड टोटल बेरीज (Accumulating Stats)
                finalStats.raids += Number(pStats.raids || 0);
                finalStats.raid_gain += Number(pStats.raid_gain || 0);
                finalStats.raid_loss += Number(pStats.raid_loss || 0);
                finalStats.bonus += Number(pStats.bonus || 0);
                finalStats.empty_raids += Number(pStats.empty_raids || 0);
                
                finalStats.tackles += Number(pStats.tackles || 0);
                finalStats.tackle_gain += Number(pStats.tackle_gain || 0);
                finalStats.tackle_loss += Number(pStats.tackle_loss || 0);
                finalStats.super_tackles += Number(pStats.super_tackles || 0);
                finalStats.points += Number(pStats.points || 0);

                // ५. पहिल्या मॅचच्या स्क्वाडमधून प्रोफाइलचे मुख्य डिटेल्स भरणे
                if (totalMatches === 1) {
                    document.getElementById('userDisplayName').innerText = playerObj.name || "Unknown Player";
                    document.getElementById('profJerseyNo').innerText = playerObj.no ? `#${playerObj.no}` : "#--";
                    document.getElementById('profPlayerRole').innerText = `${playerObj.role || 'Player'}`;
                    document.getElementById('profRegNo').innerText = playerObj.pId || "00000";
                    
                    // फोटो बॅकअप चेक
                    const imgEl = document.getElementById('userProfilePic');
                    if (imgEl) {
                        imgEl.src = playerObj.photo || match.userProfilePic || "assets/logo/logo.png";
                    }
                }

                // ६. मॅच वाईज हिस्ट्री रो (History Row) तयार करणे
                let vsTeam = (match.teamA_id === playerObj.teamId || match.teamA === detectedTeamName) ? match.teamB : match.teamA;
                let matchPts = Number(pStats.points || 0);

                historyHtml += `
                    <div class="bg-black/20 border border-slate-850/60 rounded-xl p-2 flex justify-between items-center animate-fade-in text-[10px]">
                        <div class="space-y-0.5">
                            <div class="font-black text-white uppercase">vs ${vsTeam || 'Opponent'}</div>
                            <div class="text-[8px] text-zinc-500 font-bold font-mono">R: ${pStats.raids || 0} (Gain: ${pStats.raid_gain || 0}) | TK: ${pStats.tackles || 0}</div>
                        </div>
                        <div class="text-right font-mono font-black text-yellow-400 bg-yellow-500/5 border border-yellow-500/10 px-2 py-0.5 rounded-lg">
                            +${matchPts} PTS
                        </div>
                    </div>`;
            }
        });

        // =========================================================================
        // 📤 DOM INJECTION: गोळा झालेले आकडे स्क्रीनवर रेंडर करणे
        // =========================================================================
        const teamLabel = document.getElementById('profCurrentTeam');
        if (teamLabel) teamLabel.innerText = detectedTeamName;

        // अ. ३ मुख्य ओव्हरव्ह्यू बॉक्सेस
        document.getElementById('statTotalMatches').innerText = totalMatches;
        document.getElementById('statTotalPoints').innerText = finalStats.points;
        
        // Net Impact Score = (एकंण पॉईंट्स) - (रेड लॉस + टॅकल लॉस)
        let netImpact = finalStats.points - (finalStats.raid_loss + finalStats.tackle_loss);
        const netEl = document.getElementById('statNetImpact');
        if (netEl) {
            netEl.innerText = netImpact >= 0 ? `+${netImpact}` : netImpact;
            netEl.className = netImpact >= 0 ? "text-sm font-mono font-black text-green-400 block" : "text-sm font-mono font-black text-red-500 block";
        }

        // ब. Raid Breakdown डेटा इंजेक्शन
        document.getElementById('statRaidTotal').innerText = finalStats.raids;
        document.getElementById('statRaidGain').innerText = finalStats.raid_gain;
        document.getElementById('statRaidLoss').innerText = finalStats.raid_loss;
        document.getElementById('statRaidEmpty').innerText = finalStats.empty_raids;
        let rSuccess = finalStats.raids > 0 ? Math.round((finalStats.raid_gain / finalStats.raids) * 100) : 0;
        document.getElementById('statRaidSuccessRate').innerText = `Success: ${rSuccess}%`;

        // क. Tackle Breakdown डेटा इंजेक्शन
        document.getElementById('statTackleTotal').innerText = finalStats.tackles;
        document.getElementById('statTackleGain').innerText = finalStats.tackle_gain;
        document.getElementById('statTackleLoss').innerText = finalStats.tackle_loss;
        document.getElementById('statSuperTackles').innerText = finalStats.super_tackles;
        let tSuccess = finalStats.tackles > 0 ? Math.round((finalStats.tackle_gain / finalStats.tackles) * 100) : 0;
        document.getElementById('statTackleSuccessRate').innerText = `Success: ${tSuccess}%`;

        // ड. मॅच हिस्ट्री यादी रेंडर करणे
        const historyContainer = document.getElementById('playerMatchHistoryRows');
        if (historyContainer) {
            historyContainer.innerHTML = totalMatches > 0 ? historyHtml : `<div class="text-center p-4 text-zinc-600 text-[10px] italic font-bold uppercase">अजून एकही सामना खेळलेला नाही!</div>`;
        }

        console.log(`%c✅ [STATS RENDER SUCCESS]: खेळाडूची कुंडली ऑन-स्क्रीन चकाचक रेंडर झाली!`, "color: #10b981; font-weight: bold;");

    } catch (err) {
        console.error("🚨 [STATS RENDER FATAL CRASH]:", err);
    } finally {
        if (loadingEl) loadingEl.classList.add('hidden');
        if (gridEl) gridEl.classList.remove('hidden');
    }
}