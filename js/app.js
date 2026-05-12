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
async function loadPage(page) {

  const app = document.getElementById('app');

  // 🔥 १. हे नाव फायनल (UI अपडेट करण्यासाठी)
  setActiveNav(page);   

  // 🔥 fetch page
  const res = await fetch(`pages/${page}.html`);
  const html = await res.text();

  // 🔥 render
  app.innerHTML = html;

  // 🔥 page-specific init
  initPage(page);

  // 🔥 close menu
  closeMenu();
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
            renderAdminDashboard();
        }
    }

    // Bakiche logic (Profile, Teams, etc.)
    if (page === 'profile' && user) updateProfileUI(user);
    if (page === 'teams' && userRole !== 'viewer') renderTeams();
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



/**Tournaments */

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

// async function createTournament() {
//   const tName = document.getElementById('tName').value;
//   const startDate = document.getElementById('tStartDate').value;
//   const endDate = document.getElementById('tEndDate').value;

//   // १. नाव आणि तारखा रिकाम्या नसाव्यात याची खात्री करा
//   if (!tName || !startDate || !endDate) {
//     Swal.fire("चूक!", "कृपया टूर्नामेंटचे नाव आणि तारखा भरा.", "error");
//     return;
//   }

//   // २. त्याच नावाच्या टूर्नामेंटची आधीच तपासणी करा (Restriction)
//   const querySnapshot = await db.collection("tournaments")
//     .where("name", "==", tName)
//     .get();

//   if (!querySnapshot.empty) {
//     Swal.fire("ओहो...", "या नावाची टूर्नामेंट आधीच अस्तित्वात आहे!", "error");
//     return;
//   }

//   const t = {
//     name: tName,
//     organizer: document.getElementById('tOrganizer').value,
//     season: document.getElementById('tSeason').value,
//     level: document.getElementById('tLevel').value,
//     association: document.getElementById('tAssociation').value,
//     surface: document.getElementById('tSurface').value,
//     type: document.getElementById('tType').value,
//     category: document.getElementById('tCategory').value,
//     group: document.getElementById('tGroup').value,
//     format: document.getElementById('tFormat').value,
//     teamLimit: parseInt(document.getElementById('tLimit').value),
//     startDate: startDate, // नवीन फील्ड
//     endDate: endDate,     // नवीन फील्ड
//     teams: tournamentTeams,
//     createdAt: firebase.firestore.FieldValue.serverTimestamp()
//   };

//   try {
//     await db.collection("tournaments").add(t);
//     Swal.fire("यशस्वी!", "टूर्नामेंट तयार झाली आहे!", "success");
//     closeTournamentModal();
//     renderTournaments();
//   } catch (error) {
//     console.error("Error:", error);
//     Swal.fire("Error", "सेव्ह करताना काहीतरी चूक झाली.", "error");
//   }
// }
/**
 * renderTournaments
*/
// async function renderTournaments() {
//   const list = document.getElementById('tournamentList');
//   if (!list) return;

//   list.innerHTML = "<p class='text-center text-gray-500 text-xs'>लोड होत आहे...</p>";

//   try {
//     const snapshot = await db.collection("tournaments").orderBy("createdAt", "desc").get();
//     list.innerHTML = "";

//     snapshot.forEach((doc) => {
//       const t = doc.data();
//       const tId = doc.id; // Firebase Document ID

//     list.innerHTML += `
//     <div onclick="viewTournamentDetails('${tId}')" class="bg-gray-900 p-4 rounded-xl border border-gray-800 shadow-lg mb-3 cursor-pointer hover:border-green-600 transition-all">
//         <div class="flex justify-between items-start">
//         <div>
//             <div class="font-bold text-lg text-green-400">${t.name}</div>
//             <div class="text-[10px] text-gray-400">${t.season} | ${t.level} - ${t.association || ''}</div>
            
//             <div class="text-[10px] text-blue-400 mt-1 font-medium">
//             📅 ${t.startDate || 'TBD'} ते ${t.endDate || 'TBD'}
//             </div>
            
//             <div class="text-[10px] text-gray-500 mt-1">${t.type} | ${t.group} | ${t.surface}</div>
//         </div>
        
//         <div class="flex flex-col gap-2">
//             <span class="bg-gray-800 text-[10px] px-2 py-1 rounded text-center">${t.format}</span>
            
//             <button onclick="event.stopPropagation(); editTournament('${tId}')" class="bg-blue-600 text-[10px] px-2 py-1 rounded text-white font-bold">
//             Edit
//             </button>
//         </div>
//         </div>
        
//         <div class="mt-2 text-[9px] text-gray-500 italic">
//         Teams: ${t.teams ? t.teams.length : 0} registered
//         </div>
//     </div>
//     `;
//     });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     list.innerHTML = "डेटा लोड करता आला नाही.";
//   }
// }

async function createTournament() {
  const tName = document.getElementById('tName').value;
  const startDate = document.getElementById('tStartDate').value;
  const endDate = document.getElementById('tEndDate').value;

  // १. नाव आणि तारखा रिकाम्या नसाव्यात याची खात्री करा
  if (!tName || !startDate || !endDate) {
    Swal.fire("चूक!", "कृपया टूर्नामेंटचे नाव आणि तारखा भरा.", "error");
    return;
  }

  // २. त्याच नावाच्या टूर्नामेंटची आधीच तपासणी करा (Restriction)
  const querySnapshot = await db.collection("tournaments")
    .where("name", "==", tName)
    .get();

  if (!querySnapshot.empty) {
    Swal.fire("ओहो...", "या नावाची टूर्नामेंट आधीच अस्तित्वात आहे!", "error");
    return;
  }

  // 🔥 लॉगिन असलेला युजर मिळवा
  const user = firebase.auth().currentUser;

  const t = {
    name: tName,
    createdBy: user.email,         // 🔥 नवीन: हा टूर्नामेंटचा मालक (Admin)
    assignedScorers: [],           // 🔥 नवीन: भविष्यात स्कोअरर नेमण्यासाठी रिकामी लिस्ट
    organizer: document.getElementById('tOrganizer').value,
    season: document.getElementById('tSeason').value,
    level: document.getElementById('tLevel').value,
    association: document.getElementById('tAssociation').value,
    surface: document.getElementById('tSurface').value,
    type: document.getElementById('tType').value,
    category: document.getElementById('tCategory').value,
    group: document.getElementById('tGroup').value,
    format: document.getElementById('tFormat').value,
    teamLimit: parseInt(document.getElementById('tLimit').value),
    startDate: startDate, 
    endDate: endDate,     
    teams: tournamentTeams,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    await db.collection("tournaments").add(t);
    Swal.fire("यशस्वी!", "टूर्नामेंट तयार झाली आहे!", "success");
    closeTournamentModal();
    renderTournaments();
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", "सेव्ह करताना काहीतरी चूक झाली.", "error");
  }
}

async function renderTournaments() {
  const list = document.getElementById('tournamentList');
  if (!list) return;

  list.innerHTML = "<p class='text-center text-gray-500 text-xs'>लोड होत आहे...</p>";

  try {
    const user = firebase.auth().currentUser;
    // आपण आधी बनवलेले परमिशन फंक्शन वापरून रोल मिळवा
    const userRole = await checkUserPermissions(user.email); 
    
    let query;
    const dbRef = db.collection("tournaments");

    // 🔥 रोलनुसार डेटा फिल्टर करा
    if (userRole === 'admin') {
        // ॲडमिनला त्याने स्वतः बनवलेल्या टूर्नामेंट्स दिसतील
        query = dbRef.where("createdBy", "==", user.email);
    } else if (userRole === 'scorer') {
        // स्कोअररला ज्या टूर्नामेंटमध्ये ॲड केले आहे तीच दिसेल
        query = dbRef.where("assignedScorers", "array-contains", user.email);
    } else {
        list.innerHTML = "<p class='text-center text-red-500 text-xs'>तुम्हाला पाहण्याची परवानगी नाही.</p>";
        return;
    }

    // आता फिल्टर केलेला डेटा 'createdAt' नुसार सॉर्ट करा
    const snapshot = await query.orderBy("createdAt", "desc").get();
    list.innerHTML = "";

    if (snapshot.empty) {
        list.innerHTML = "<p class='text-center text-gray-500 text-xs'>कोणतीही टूर्नामेंट सापडली नाही.</p>";
        return;
    }

    snapshot.forEach((doc) => {
      const t = doc.data();
      const tId = doc.id; 

      list.innerHTML += `
      <div onclick="viewTournamentDetails('${tId}')" class="bg-gray-900 p-4 rounded-xl border border-gray-800 shadow-lg mb-3 cursor-pointer hover:border-green-600 transition-all">
          <div class="flex justify-between items-start">
          <div>
              <div class="font-bold text-lg text-green-400">${t.name}</div>
              <div class="text-[10px] text-gray-400">${t.season} | ${t.level} - ${t.association || ''}</div>
              
              <div class="text-[10px] text-blue-400 mt-1 font-medium">
              📅 ${t.startDate || 'TBD'} ते ${t.endDate || 'TBD'}
              </div>
              
              <div class="text-[10px] text-gray-500 mt-1">${t.type} | ${t.group} | ${t.surface}</div>
          </div>
          
          <div class="flex flex-col gap-2">
              <span class="bg-gray-800 text-[10px] px-2 py-1 rounded text-center">${t.format}</span>
              
              <!-- फक्त ॲडमिनलाच 'Edit' बटण दिसावे असे वाटत असेल तर खालील चेक वापरू शकतोस -->
              ${userRole === 'admin' ? `
                <button onclick="event.stopPropagation(); editTournament('${tId}')" class="bg-blue-600 text-[10px] px-2 py-1 rounded text-white font-bold">
                Edit
                </button>
              ` : ''}
          </div>
          </div>
          
          <div class="mt-2 text-[9px] text-gray-500 italic">
          Teams: ${t.teams ? t.teams.length : 0} registered
          </div>
      </div>
      `;
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    list.innerHTML = "<p class='text-center text-red-500 text-xs'>डेटा लोड करताना चूक झाली (Index गरज असू शकते).</p>";
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
  // आपण निवडलेल्या टीम्स एका ग्लोबल व्हेरिएबलमध्ये स्टोअर करू जेणेकरून नंतर वापरता येतील
  window.currentTournamentTeams = t.teams || []; 

  content.innerHTML = `
    <div class="bg-gray-900 p-4 rounded-xl space-y-2 text-sm border border-gray-800">
      <p><span class="text-gray-400">Organizer:</span> ${t.organizer}</p>
      <p><span class="text-gray-400">Level:</span> ${t.level} (${t.association || ''})</p>
      <p><span class="text-gray-400">Group:</span> ${t.group} | <span class="text-gray-400">Surface:</span> ${t.surface}</p>
      <p><span class="text-gray-400">Total Teams:</span> ${t.teams.length} / ${t.teamLimit}</p>
      <p><span class="text-gray-400">कालावधी (Duration):</span> ${t.startDate} ते ${t.endDate}</p>
      <hr class="border-gray-800 my-4">
      
      <button onclick="handleFixtureGeneration('${id}')" 
        class="w-full bg-blue-600 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
        Generate Fixtures (मॅचेस लावा)
      </button>
    </div>
  `;
}

/**
 * Fixture Generator (मॅचेस लावण्याचे लॉजिक)
* जेव्हा युजर बटण दाबतो, तेव्हा आपण रँडमली जोड्या लावून मॅचेस 'Pending' म्हणून सेव्ह करूया
* handleFixtureGeneration
 */
async function handleFixtureGeneration(tId) {
  const targetId = tId || currentTid;
  
  try {
    const tDoc = await db.collection("tournaments").doc(targetId).get();
    const limit = parseInt(tDoc.data().teamLimit) || 16;
    
    // १. जवळची 'Power of 2' शोधा (उदा. २० साठी ३२)
    const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(limit)));
    
    // २. पहिल्या राऊंडमध्ये किती टीम्स खेळतील?
    // सूत्र: (Total Teams - (Power of 2 / 2)) * 2
    // २० टीम्ससाठी: (20 - 16) * 2 = 8 टीम्स (म्हणजे ४ मॅचेस)
    const teamsInRound1 = (limit - (powerOfTwo / 2)) * 2;
    const round1Matches = teamsInRound1 > 0 ? teamsInRound1 / 2 : 0;

    // ३. एकूण मॅचेस = (Limit - 1)
    const totalActualMatches = limit - 1;

    const check = await db.collection("tournaments").doc(targetId).collection("matches").limit(1).get();
    if (!check.empty) {
      Swal.fire("माहिती", "फिक्स्चर्स आधीच तयार आहेत.", "info");
      return;
    }

    Swal.fire({
      title: 'ऑटोमेटेड फिक्स्चर!',
      text: `${limit} टीम्ससाठी ${totalActualMatches} मॅचेस तयार होतील. (BYE वगळून)`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'हो, तयार करा'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const batch = db.batch();
        let matchCounter = 1;

        // --- ROUND 1 (फक्त आवश्यक मॅचेस) ---
        for (let i = 1; i <= round1Matches; i++) {
          createMatchEntry(batch, targetId, matchCounter++, "Round 1");
        }

        // --- ROUND 2 (Pre-Quarter / Round of 16) ---
        for (let i = 1; i <= 8; i++) {
          createMatchEntry(batch, targetId, matchCounter++, (limit <= 16 && matchCounter <= 8) ? "Round 1" : "Pre-Quarter");
        }

        // --- QUARTER, SEMI, FINAL ---
        const rounds = [
          { name: "Quarter Final", count: 4 },
          { name: "Semi Final", count: 2 },
          { name: "FINAL", count: 1 }
        ];

        rounds.forEach(r => {
          for (let i = 1; i <= r.count; i++) {
            // जर एकूण मॅचेसच्या बाहेर जात असेल तर थांबा
            if (matchCounter <= totalActualMatches) {
              createMatchEntry(batch, targetId, matchCounter++, r.name);
            }
          }
        });

        await batch.commit();
        Swal.fire("यशस्वी!", "सर्व मॅचेस तयार झाल्या!", "success");
        switchTab('fixtures', targetId);
      }
    });
  } catch (err) { console.error(err); }
}

// मॅच एन्ट्री तयार करण्यासाठी हेल्पपर फंक्शन
function createMatchEntry(batch, tId, mNo, roundName) {
  const mRef = db.collection("tournaments").doc(tId).collection("matches").doc(`M${mNo}`);
  batch.set(mRef, {
    matchNo: mNo,
    teamA: "TBD",
    teamB: "TBD",
    status: "Pending",
    scoreA: 0,
    scoreB: 0,
    round: roundName
  });
}

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
async function switchTab(tabName, tId) {
  // १. जर आयडी आला असेल तर तो सेव्ह करा, नसेल तर सेव्ह केलेला वापरा
  if (tId) {
    currentTid = tId;
    localStorage.setItem('lastTournamentId', tId); // ब्राउझरमध्ये सेव्ह करा
  } else {
    currentTid = localStorage.getItem('lastTournamentId'); // रिफ्रेश केल्यावर इथून मिळेल
  }

  const targetId = currentTid;
  const content = document.getElementById('tabContent');

  // जर आयडीच नसेल, तर पुढे जाऊ नका
  if (!targetId || !content) {
    console.error("Tournament ID missing!");
    return;
  }

  // २. सर्व टॅब बटणांचे ॲक्टिव्ह स्टाइल रिसेट करा
  const tabs = document.querySelectorAll('button[onclick^="switchTab"]');
  tabs.forEach(tab => {
    tab.classList.remove('border-green-600', 'text-green-500');
    tab.classList.add('border-transparent', 'text-gray-400');
    
    // जो टॅब क्लिक केलाय त्याला हायलाईट करा
    if (tab.getAttribute('onclick').includes(`'${tabName}'`)) {
      tab.classList.add('border-green-600', 'text-green-500');
      tab.classList.remove('border-transparent', 'text-gray-400');
    }
  });

  // ३. डेटा लोड करा
  try {
    const doc = await db.collection("tournaments").doc(targetId).get();
    const tData = doc.data();

    if (tabName === 'details') {
      renderDetailsTab(tData, targetId);
    } else if (tabName === 'fixtures') {
      renderFixturesTab(targetId);
    }
  } catch (error) {
    console.error("Tab switch error:", error);
  }
}

/**
 * renderFixturesTab (मॅचेस दाखवण्यासाठी)
हे फंक्शन फायरबेसमधून त्या टूर्नामेंटच्या सर्व मॅचेस खेचून आणेल आणि कार्ड्सच्या स्वरूपात दाखवेल.
 */
async function renderFixturesTab(tId) {
  const content = document.getElementById('tabContent');
  content.innerHTML = "<p class='text-center text-gray-500 py-10 text-xs'>मॅचेस शोधत आहे...</p>";

  try {
    const snapshot = await db.collection("tournaments").doc(tId).collection("matches").orderBy("matchNo").get();
    
    if (snapshot.empty) {
      content.innerHTML = `
        <div class="text-center py-10">
          <p class="text-gray-500 mb-4 text-sm">अजून मॅचेस तयार केल्या नाहीत.</p>
          <button onclick="switchTab('details', '${tId}')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs">Details मध्ये जाऊन Template तयार करा</button>
        </div>
      `;
      return;
    }

    content.innerHTML = "";
    snapshot.forEach(doc => {
      const match = doc.data();
      const mId = doc.id;

      // १. दोन्ही टीम्स TBD नसतील तरच स्टार्ट बटन दाखवण्यासाठी हा चेक:
      const isReady = match.teamA !== "TBD" && match.teamB !== "TBD";

      content.innerHTML += `
        <div class="bg-gray-900 p-4 rounded-2xl border border-gray-800 mb-4 shadow-xl">
          <div class="flex justify-between items-center mb-3">
            <div class="flex flex-col">
              <span class="text-[9px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full font-bold w-fit uppercase tracking-wider mb-1">
                ${match.round || 'Tournament'}
              </span>
              <span class="text-[10px] text-gray-500 font-bold">Match #${match.matchNo}</span>
            </div>
            
            <button onclick="openMatchSetter('${tId}', '${mId}')" class="text-[10px] bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-gray-300 transition-colors">
              Set Team/Time
            </button>
          </div>

          <div class="flex justify-between items-center text-center py-2">
            <div class="flex-1">
              <p class="text-sm font-black text-white uppercase">${match.teamA}</p>
              <p class="text-xl font-black text-green-500 mt-1">${match.scoreA || 0}</p>
            </div>
            <div class="px-4">
              <div class="text-[10px] bg-gray-800 text-gray-500 px-2 py-1 rounded font-bold uppercase">VS</div>
            </div>
            <div class="flex-1">
              <p class="text-sm font-black text-white uppercase">${match.teamB}</p>
              <p class="text-xl font-black text-green-500 mt-1">${match.scoreB || 0}</p>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center">
            <div class="text-[9px] text-gray-500 italic">
              📅 ${match.matchDate || 'Date TBD'} | ⏰ ${match.matchTime || 'Time TBD'}
            </div>
            
            <div>
              ${isReady ? `
                <button onclick="startScoring('${tId}', '${mId}')" class="bg-green-600 hover:bg-green-500 text-white text-[10px] px-4 py-2 rounded-xl font-black shadow-lg transition-all active:scale-95 uppercase">
                  Start Scoring
                </button>
              ` : `
                <span class="text-[9px] text-orange-500 font-bold italic animate-pulse">Set Teams First</span>
              `}
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error fetching fixtures:", error);
    content.innerHTML = "<div class='text-center text-red-500 py-10'>फिक्स्चर्स लोड करताना चूक झाली.</div>";
  }
}

/**
 * startScoring फंक्शन (स्कोअरिंग स्क्रीनकडे नेण्यासाठी)
हे फंक्शन स्कोअरिंग स्क्रीन लोड करेल आणि कोणत्या मॅचचे स्कोअरिंग करायचे आहे त्याचा आयडी पाठवेल.
 */
let matchSetupData = null;

async function startScoring(tId, mId) {
    console.log("Starting Match Setup:", tId, mId);
    matchSetupData = { tId, mId };
    
    const modal = document.getElementById('startMatchModal');
    const tossSelect = document.getElementById('tossWinner');
    const tabBtnA = document.getElementById('tabBtnA');
    const tabBtnB = document.getElementById('tabBtnB');

    if (!modal || !tossSelect) {
        Swal.fire("Error", "Start Match Modal missing in HTML!", "error");
        return;
    }

    try {
        const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
        const match = mDoc.data();

        // १. टॉस विनरचे ऑप्शन्स भरा
        tossSelect.innerHTML = `
            <option value="${match.teamA}">${match.teamA}</option>
            <option value="${match.teamB}">${match.teamB}</option>
        `;

        // २. टॅब बटणांवर टीमची नावे दाखवा (जेणेकरून युजरला समजेल कोणत्या टॅबमध्ये कुणाचे प्लेयर्स आहेत)
        if (tabBtnA) tabBtnA.innerText = match.teamA;
        if (tabBtnB) tabBtnB.innerText = match.teamB;

        // ३. १२ खेळाडूंचे इनपुट रेंडर करा
        renderPlayerInputs('playerListA', 'A');
        renderPlayerInputs('playerListB', 'B');

        // ४. मोडल उघडा
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // ५. बाय डिफॉल्ट Team A चा टॅब उघडा ठेवा
        switchPlayerTab('A');

    } catch (e) {
        console.error("Error in startScoring:", e);
        Swal.fire("Error", "डेटा लोड करताना चूक झाली.", "error");
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



function closeStartMatchModal() {
    document.getElementById('startMatchModal').classList.add('hidden');
}

async function confirmStartMatch() {
    console.log("--- [START_MATCH_PROCESS] Final Validation Initiated ---");
    const { tId, mId } = matchSetupData;

    // १. 'Playing' खेळाडूंची संख्या मोजा (Strict Exactly 7 Check)
    const countA = document.querySelectorAll('.player-check-A:checked').length;
    const countB = document.querySelectorAll('.player-check-B:checked').length;

    console.log(`[VALIDATION] Team A: ${countA}/7 | Team B: ${countB}/7`);

    if (countA !== 7 || countB !== 7) {
        console.warn(`[DENIED] Match blocked. Improper player count.`);
        Swal.fire({
            title: "खेळाडू अपूर्ण आहेत!",
            text: `मॅच सुरू करण्यासाठी प्रत्येक टीममध्ये ७ खेळाडू निवडणे अनिवार्य आहे. (सध्या: Team A: ${countA}, Team B: ${countB})`,
            icon: "error",
            background: '#111',
            color: '#fff'
        });
        return; 
    }

    // २. जर ७-७ खेळाडू असतील तरच डेटा गोळा करा
    console.log("[PROCEED] Validation successful. Collecting players data...");
    const playersA = getPlayersData('A');
    const playersB = getPlayersData('B');

    const tossWinner = document.getElementById('tossWinner').value;
    const selection = document.getElementById('tossSelection').value;

    try {
        const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
        const match = mDoc.data();
        
        // [IMPORTANT]: इकडे आपण localStorage मध्ये नावे साठवत आहोत
        // यामुळे scoring.html ला समजेल की नक्की कोणत्या टीम खेळत आहेत.
        localStorage.setItem('currentTeamA', match.teamA);
        localStorage.setItem('currentTeamB', match.teamB);

        let firstRaidBy = (selection === "Raid") ? tossWinner : (tossWinner === match.teamA ? match.teamB : match.teamA);

        const updateData = {
            status: "Live",
            tossWinner: tossWinner,
            tossSelection: selection,
            firstRaidBy: firstRaidBy,
            currentRaider: firstRaidBy,
            teamAPlayers: playersA,
            teamBPlayers: playersB,
            scoreA: 0,
            scoreB: 0,
            timeoutsA: 0,
            timeoutsB: 0,
            matchLog: []
        };

        console.log("[DATABASE] Updating Firestore with match data...");
        await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update(updateData);
        
        console.log("--- [MATCH_LIVE] Setup Complete! ---");
        closeStartMatchModal();
        
        Swal.fire({
            title: "Match Live!",
            text: "स्कोअरिंग विंडो उघडत आहे...",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });

        goToScoring(tId, mId);

    } catch (e) {
        console.error("[CRITICAL_ERROR] Failed to start match:", e);
        Swal.fire("Error", "डेटा अपडेट करताना तांत्रिक अडचण आली.", "error");
    }
    if (typeof updateVisualPlayers === "function") updateVisualPlayers();
}

function getPlayersData(prefix) {
    console.log(`--- [DATA_COLLECTION] Starting for Team: ${prefix} ---`);
    let data = [];
    
    for (let i = 1; i <= 12; i++) {
        const noVal = document.getElementById(`${prefix}P${i}_no`).value;
        const nameVal = document.getElementById(`${prefix}P${i}_name`).value;
        const isChecked = document.getElementById(`${prefix}P${i}_check`).checked;

        // १. प्रत्येक प्लेयरचा ऑब्जेक्ट तयार करा
        const playerObj = {
            no: noVal || (prefix === 'A' ? i : i + 20),
            name: nameVal || `Player ${noVal || i}`,
            // आपण ठरवल्याप्रमाणे 'Playing' आणि 'Bench' हे शब्द वापरूया
            playingStatus: isChecked ? "Playing" : "Bench", 
            // कोर्टातील स्थिती
            status: isChecked ? "In" : "Out",
            outTime: null
        };

        data.push(playerObj);
    }

    // २. व्हेरिफिकेशनसाठी कन्सोल लॉग्स
    const playingCount = data.filter(p => p.playingStatus === "Playing").length;
    const benchCount = data.filter(p => p.playingStatus === "Bench").length;
    
    console.log(`[SUMMARY] Team ${prefix}: ${playingCount} Playing, ${benchCount} Bench.`);
    
    // पूर्ण डेटा टेबल फॉरमॅटमध्ये बघण्यासाठी (डेव्हलपमेंटसाठी खूप सोपं पडतं)
    console.table(data); 

    return data;
}


/** Edit Tournaments */
let currentEditId = null; // सध्या कोणती टूर्नामेंट एडिट होत आहे त्याचा आयडी

async function editTournament(id) {
  try {
    const doc = await db.collection("tournaments").doc(id).get();
    if (!doc.exists) return;

    const t = doc.data();
    currentEditId = id; // आयडी स्टोअर करा

    // फॉर्ममध्ये डेटा भरणे [cite: 352, 358]
    document.getElementById('tName').value = t.name;
    document.getElementById('tOrganizer').value = t.organizer;
    document.getElementById('tSeason').value = t.season;
    document.getElementById('tLevel').value = t.level;
    handleLevelChange(); // असोसिएशन फिल्ड दाखवण्यासाठी
    document.getElementById('tAssociation').value = t.association;
    document.getElementById('tSurface').value = t.surface;
    document.getElementById('tType').value = t.type;
    document.getElementById('tCategory').value = t.category;
    document.getElementById('tGroup').value = t.group;
    document.getElementById('tFormat').value = t.format;
    document.getElementById('tLimit').value = t.teamLimit;
    document.getElementById('tStartDate').value = t.startDate || "";
    document.getElementById('tEndDate').value = t.endDate || "";
    
    // टीम्स रिस्टोअर करणे
    tournamentTeams = t.teams || [];
    updateSelectedTeamsUI();

    // मॉडेल ओपन करा
    openTournamentModal();

    // सेव्ह बटणाचे नाव बदला (Optional)
    const saveBtn = document.querySelector("#tournamentModal button[onclick='createTournament()']");
    if(saveBtn) {
        saveBtn.innerText = "Update Tournament";
        saveBtn.setAttribute("onclick", `updateTournament()`);
    }

  } catch (error) {
    Swal.fire("Error", "डेटा मिळवता आला नाही", "error");
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

async function generateKnockoutFixtures(tId, teams) {
  // १. टीम्सना रँडमली शफल करा [cite: 5]
  const shuffled = teams.sort(() => Math.random() - 0.5);
  const matches = [];

  // २. जोड्या लावा (Team 1 vs Team 2) [cite: 5, 53]
  for (let i = 0; i < shuffled.length; i += 2) {
    if (shuffled[i + 1]) {
      matches.push({
        matchNo: (i / 2) + 1,
        teamA: shuffled[i].name,
        teamB: shuffled[i + 1].name,
        status: "Pending", // Pending / Live / Completed 
        scoreA: 0,
        scoreB: 0,
        round: 1
      });
    }
  }

  // ३. Firebase मध्ये एकाच वेळी मॅचेस सेव्ह करा
  const batch = db.batch();
  matches.forEach(m => {
    const mRef = db.collection("tournaments").doc(tId).collection("matches").doc();
    batch.set(mRef, m);
  });
  await batch.commit();
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
  console.log("उघडत आहे मॅच सेटर:", tId, mId);
  currentEditingMatch = { tId, mId };

  const modal = document.getElementById('matchSetterModal');
  const selA = document.getElementById('mTeamA');
  const selB = document.getElementById('mTeamB');
  const inpDate = document.getElementById('mDate');
  const inpTime = document.getElementById('mTime');

  if (!modal || !selA || !selB) {
    Swal.fire("Error", "HTML मध्ये पॉपअप कोड सापडला नाही. तो index.html मध्ये टाका.", "error");
    return;
  }

  try {
    // १. टूर्नामेंटचा डेटा आणि मॅचचा सध्याचा डेटा एकाच वेळी मिळवा
    const tDoc = await db.collection("tournaments").doc(tId).get();
    const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
    
    const teams = tDoc.data().teams || [];
    const currentMatch = mDoc.exists ? mDoc.data() : {};

    // २. ड्रॉपडाउन पर्यायांमध्ये 'BYE' ॲड करा
    let options = `
      <option value="TBD">निवडा (Select Team)</option>
      <option value="BYE">BYE (पुढच्या फेरीसाठी पात्र)</option>
    `;

    teams.forEach(t => {
      options += `<option value="${t.name}">${t.name}</option>`;
    });

    selA.innerHTML = options;
    selB.innerHTML = options;

    // ३. पॉपअप उघडताना जुना डेटा (जर असेल तर) सेट करा
    selA.value = currentMatch.teamA || "TBD";
    selB.value = currentMatch.teamB || "TBD";
    if (inpDate) inpDate.value = currentMatch.matchDate || "";
    if (inpTime) inpTime.value = currentMatch.matchTime || "";

    // ४. पॉपअप दाखवा
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
  } catch (err) {
    console.error("Teams Load Error:", err);
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
  if (!currentEditingMatch) return;
  const { tId, mId } = currentEditingMatch;

  const teamA = document.getElementById('mTeamA').value;
  const teamB = document.getElementById('mTeamB').value;
  const matchDate = document.getElementById('mDate').value;
  const matchTime = document.getElementById('mTime').value;

  // १. एकाच टीमची मॅच स्वतःसोबत लागण्यापासून रोखणे
  // (TBD किंवा BYE सोडून इतर टीम्ससाठी हा नियम लागू होईल)
  if (teamA !== "TBD" && teamA !== "BYE" && teamA === teamB) {
    Swal.fire({
      icon: 'error',
      title: 'चूक!',
      text: 'एकच संघ स्वतःविरुद्ध खेळू शकत नाही. कृपया वेगळा संघ निवडा.',
      confirmButtonColor: '#d33'
    });
    return;
  }

  const data = {
    teamA: teamA,
    teamB: teamB,
    matchDate: matchDate,
    matchTime: matchTime
  };

  try {
    await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update(data);
    
    closeMatchSetter();
    Swal.fire({
      title: "यशस्वी!",
      text: "मॅच यशस्वीरीत्या अपडेट झाली आहे.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    });
    
    // फिक्स्चर टॅब रिफ्रेश करा
    renderFixturesTab(tId); 
  } catch (error) {
    console.error("Update Error:", error);
    Swal.fire("Error", "डेटा अपडेट करताना तांत्रिक अडचण आली.", "error");
  }
}


function closeMatchSetter() {
  document.getElementById('matchSetterModal').classList.add('hidden'); // [cite: 299]
}

/**
 * हे फंक्शन 'मॅच एडमिन' कडून 'लाइव्ह स्कोअरर' कडे जाणारा मुख्य पूल (Bridge) आहे. 
 * या फंक्शनशिवाय स्कोअरिंग स्क्रीनला हे समजणारच नाही की नक्की कोणत्या टीमची आणि कोणत्या खेळाडूंची मॅच सुरू आहे.
 */

// async function goToScoring(tId, mId) {
//     await loadPage('scoring'); 

//     try {
//         const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
//         const match = mDoc.data();
//         currentMatchData = match;

//         // [ बदल ]: नावे LocalStorage मध्ये साठवा जेणेकरून ती पुढच्या फंक्शनला मिळतील
//         localStorage.setItem('currentTeamA', match.teamA);
//         localStorage.setItem('currentTeamB', match.teamB);
//             // मूळ स्क्रीनवरील नावे अपडेट करा
//                     setupLiveMatchNames();

//         teamAPlayers = match.teamAPlayers || [];
//         teamBPlayers = match.teamBPlayers || [];


//         document.getElementById('scoreA').innerText = match.scoreA || 0;
//         document.getElementById('scoreB').innerText = match.scoreB || 0;

//         renderMiniPlayers();
        
//         console.log("Scoring Screen Ready for:", match.teamA, "vs", match.teamB);

//     } catch (e) {
//         console.error("Error loading scoring data:", e);
//     }
// }


async function goToScoring(tId, mId) {
    console.log("--- [NAV] Loading Original Scoring Logic ---");
    await loadPage('scoring'); 

    try {
        const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
        const match = mDoc.data();
        
        // १. तुझा जुना मूळ डेटा सेट
        currentMatchData = match;

        localStorage.setItem('currentTeamA', match.teamA);
        localStorage.setItem('currentTeamB', match.teamB);
        
        setupLiveMatchNames();

        teamAPlayers = match.teamAPlayers || [];
        teamBPlayers = match.teamBPlayers || [];

        if(document.getElementById('scoreA')) document.getElementById('scoreA').innerText = match.scoreA || 0;
        if(document.getElementById('scoreB')) document.getElementById('scoreB').innerText = match.scoreB || 0;

        // २. तुझे मूळ रेंडरिंग फंक्शन (जसे होते तसेच)
        renderMiniPlayers();
        
        // ३. फक्त नवीन UI साठी (काहीही बिघडणार नाही)
        if (typeof updateTimeoutUI === "function") updateTimeoutUI();

        console.log("Scoring Screen Ready for:", match.teamA, "vs", match.teamB);

    } catch (e) {
        console.error("Error loading scoring data:", e);
    }
}



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

// function startRaidTimer(team) {
//     // १. आधी टायमर थांबवा (जर आधीची रेड चुकून सुरू असेल तर)
//     clearInterval(raidInterval);
    
//     // २. रेडर निवडण्यासाठी मोडल उघडा
//     openRaiderSelectionModal(team);
// }

function startRaidTimer(team, isJustStarting = false) {
    // १. आधी टायमर थांबवा (जर आधीची रेड चुकून सुरू असेल तर) - [मूळ कोड तसाच आहे]
    clearInterval(raidInterval);
    
    // २. रेडर निवडण्यासाठी मोडल उघडा - [बदल: फक्त isJustStarting पुढे पास केला]
    openRaiderSelectionModal(team, isJustStarting);
}



// function openRaiderSelectionModal(team) {
//     // STRICT LOG: हे सांगेल की हे मोडल नक्की कधी उघडलं
//     console.error(`[STRICT_LOG] 🚨 Raider Selection Modal OPENED at ${new Date().getTime()}`);
    
//     const modal = document.getElementById('playerSelectModal');
//     const grid = document.getElementById('playerModalGrid');
//     const title = document.getElementById('playerModalTitle');
    
//     if (!modal || !grid) return;

//     let players = (team === 'A') ? teamAPlayers : teamBPlayers;
//     title.innerText = `Select Raider (Team ${team})`;
//     grid.innerHTML = "";
    
//     const activeRaiders = players.filter(p => p.playingStatus === 'Playing' && p.status === 'In');
    
//     activeRaiders.forEach(p => {
//         grid.innerHTML += `
//             <button onclick="actuallyStartTimer('${p.no}', '${p.name}', '${team}')" 
//                 class="bg-gray-800 border border-gray-700 p-3 rounded-xl flex flex-col items-center active:bg-green-600 transition-all shadow-lg">
//                 <span class="text-xl font-black text-white">${p.no}</span>
//                 <span class="text-[8px] text-gray-500 font-bold uppercase truncate w-full text-center mt-1">${p.name}</span>
//             </button>`;
//     });

//     modal.classList.replace('hidden', 'flex');
// }

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
एकदा रेडर निवडला की हे फंक्शन तुझे टायमरचे काम पूर्ण करेल. */
// function actuallyStartTimer(playerNo, playerName, team) {
//     const timestamp = Date.now();
//     console.log(`[STRICT_LOG] 🏁 actuallyStartTimer START | Player: ${playerNo} | Team: ${team} | Time: ${timestamp}`);

//     if (typeof closePlayerModal === "function") {
//         console.log(`[STRICT_LOG] 🏠 Closing Player Modal...`);
//         closePlayerModal();
//     }

//     const activeRaiderEl = document.getElementById('activeRaider');
//     if (activeRaiderEl) {
//         activeRaiderEl.innerText = `${playerName.toUpperCase()} (${team})`;
//         console.log(`[STRICT_LOG] 👤 Active Raider Set: ${playerName} (${team})`);
//     }

//     // १. बोनस चेक (हा सर्वात आधी व्हायला हवा)
//     if (window.isBonusPending === true) {
//         console.log(`[STRICT_LOG] 🎁 BONUS_PENDING Detected!`);
//         window.isBonusPending = false; // खूण तात्काळ पुसा

//         // नियम: बोनसवर एम्प्टी डॉट्स रिसेट होतात
//         emptyRaidCount[team] = 0;
//         if (typeof updateEmptyDots === 'function') updateEmptyDots(team);

//         // समरी अपडेट
//         if (typeof addRaidToSummary === "function") {
//             //addRaidToSummary(team, playerName, 'Bonus Point', 1, 'Technical Bonus');
//         }

//         // बोनस मोडल उघडा
//         if (typeof openBonusPointsModal === "function") {
//             console.log(`[STRICT_LOG] 🔓 Opening Bonus Points Modal and STOPPING flow.`);
//             openBonusPointsModal(team);
//         }

//         return; // अत्यंत महत्त्वाचे: विरुद्ध टीमचे मोडल उघडू नये म्हणून इथूनच बाहेर पडा
//     }

//     // २. इतर पेंडिंग ॲक्शन्स (Empty, Touch, Tackle)
//     if (window.pendingAction) {
//         const action = window.pendingAction;
//         console.log(`[STRICT_LOG] 📦 Pending Action Found: ${action.type}`);
//         window.pendingAction = null; 

//         if (action.type === 'empty') {
//             console.log(`[STRICT_LOG] ⚪ Processing Empty Raid...`);
//             if (typeof addRaidToSummary === "function") {
//                 addRaidToSummary(action.team, playerName, 'Empty Raid', 0, 'Returned Safely');
//             }

//             setTimeout(() => {
//                 processEmptyRaidLogic(action.team, "SELECTION_FLOW", playerNo);
//             }, 400);
//             return; 
//         }

//         setTimeout(() => {
//             console.log(`[STRICT_LOG] ⚡ Executing Delayed Action: ${action.type}`);
//             if (action.type === 'touch') {
//                 handlePoint(action.team, action.points);
//             } else {
//                 handleAction(action.team, action.type, action.points);
//             }
//         }, 300);
//         return; 
//     }

//     // ३. काहीच पेंडिंग नसेल तर टायमर सुरू करा
//     console.log(`[STRICT_LOG] ⏱️ Normal Flow: Starting Raid Timer.`);
//     if (typeof startRaidTimer === "function") startRaidTimer();
// }

function actuallyStartTimer(playerNo, playerName, team, isJustStarting = false) {
    const timestamp = Date.now();
    console.log(`[STRICT_LOG] 🏁 actuallyStartTimer START | Player: ${playerNo} | Team: ${team} | Time: ${timestamp} | JustStarting: ${isJustStarting}`);

    if (typeof closePlayerModal === "function") {
        console.log(`[STRICT_LOG] 🏠 Closing Player Modal...`);
        closePlayerModal();
    }

    const activeRaiderEl = document.getElementById('activeRaider');
    if (activeRaiderEl) {
        activeRaiderEl.innerText = `${playerName.toUpperCase()} (${team})`;
        console.log(`[STRICT_LOG] 👤 Active Raider Set: ${playerName} (${team})`);
    }

    // --- [NEW SAFE GATE]: जर फक्त 'Start Raid' बटण दाबलं असेल, तर इथूनच बाहेर पडा ---
// --- [NEW SAFE GATE]: जर फक्त 'Start Raid' बटण दाबलं असेल ---
    if (isJustStarting === true) {
        console.log(`[STRICT_LOG] ⏱️ Just Starting: Manual Timer Start Triggered.`);
        
        // १. टायमरचा आकडा ३० वर सेट करा
        const timerEl = document.getElementById('raidTimer');
        if (timerEl) timerEl.innerText = "30";

        // २. टायमर पळवण्यासाठी लॉजिक
        let timeLeft = 30;
        
        // जुना कोणताही इंटरव्हल असेल तर थांबवा
        if (typeof raidInterval !== 'undefined') clearInterval(raidInterval);

        raidInterval = setInterval(() => {
            timeLeft--;
            if (timerEl) timerEl.innerText = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(raidInterval);
                console.log("Raid Time Up!");
                // वेळ संपल्यावर काय व्हायला हवं (उदा. शिट्टी वाजणे) ते इथे टाकू शकतोस
            }
        }, 1000);

        return; 
    }
    // -------------------------------------------------------------------------

    // १. बोनस चेक (हा सर्वात आधी व्हायला हवा) - [मूळ कोड तसाच आहे]
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

    // २. इतर पेंडिंग ॲक्शन्स (Empty, Touch, Tackle) - [मूळ कोड तसाच आहे]
    if (window.pendingAction) {
        const action = window.pendingAction;
        console.log(`[STRICT_LOG] 📦 Pending Action Found: ${action.type}`);
        window.pendingAction = null; 

        if (action.type === 'empty') {
            console.log(`[STRICT_LOG] ⚪ Processing Empty Raid...`);
            if (typeof addRaidToSummary === "function") {
                addRaidToSummary(action.team, playerName, 'Empty Raid', 0, 'Returned Safely');
            }

            setTimeout(() => {
                processEmptyRaidLogic(action.team, "SELECTION_FLOW", playerNo);
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

    // ३. काहीच पेंडिंग नसेल तर टायमर सुरू करा - [मूळ कोड तसाच आहे]
    console.log(`[STRICT_LOG] ⏱️ Normal Flow: Starting Raid Timer.`);
    // टीप: इथे startClock() किंवा तुझे मूळ टायमर फंक्शन कॉल होईल
    if (typeof startRaidTimer === "function") startRaidTimer(); 
}

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
    
    if (type === 'out' || type === 'tackle') {
        // १. खेळाडूला OUT करा
        updatePlayerStatus(playerNo, team, 'Out');
        
        // २. स्कोर अपडेट (जर टॅकल पॉईंट असेल तर)
        if (window.currentAction && window.currentAction.team) {
            updateScore(window.currentAction.team, 1);
            
            // ३. टॅकल झाल्यावर सुद्धा समोरच्याचा खेळाडू रिवाइव्ह (In) झाला पाहिजे
            if (typeof revivePlayers === "function") {
                revivePlayers(window.currentAction.team, 1);
            }
            
            window.currentAction = null; 
        }
    } else {
        updatePlayerStatus(playerNo, team, 'In');
    }

    // ३ऱ्या रेडच्या वेळी (Direct Out) आपण खालची फंक्शन्स थांबवतोय
    if (type !== 'out') {
        if (typeof processRaiderOutStatus === "function") processRaiderOutStatus(); 
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

    // ४. आऊट झालेल्या खेळाडूंची यादी तयार करा
    let outPlayersInfo = (window.selectedPlayersList && window.selectedPlayersList.length > 0) 
                         ? "Out: " + window.selectedPlayersList.join(", ") 
                         : points + " Players Out";

    // ५. [LOGIC SECTION]: जुन्या बटनांचे सर्व नियम इथे सुरक्षित आहेत
    if (type === 'touch') {
        updateScore(team, points);
        addRaidToSummary(team, currentRaider, 'TOUCH POINT', points, outPlayersInfo);
    } 
    else if (type === 'bonus_touch') {
        updateScore(team, points); 
        addRaidToSummary(team, currentRaider, 'BONUS + TOUCH', points, outPlayersInfo);
    }
    else if (type === 'tackle') {
        updateScore(team, 1);
        let defender = (window.selectedPlayersList && window.selectedPlayersList.length > 0) ? window.selectedPlayersList[0] : 'Defender';
        addRaidToSummary(team, currentRaider, 'TACKLE', 1, `Caught by ${defender}`);
    }
    else if (type === 'super_tackle') {
        updateScore(team, 2);
        let defenders = (window.selectedPlayersList && window.selectedPlayersList.length > 0) ? window.selectedPlayersList.join(', ') : 'Defenders';
        addRaidToSummary(team, currentRaider, 'SUPER TACKLE', 2, `Caught by ${defenders}`);
    }
    else if (type === 'bonus_tackle') {
        updateScore(team, 1);
        updateScore(oppositeTeam, 1);
        addRaidToSummary(team, currentRaider, 'BONUS + TACKLE', 1, 'Bonus scored but Tackled');
    }
    else if (type === 'self_out') {
        updateScore(team, points);
        addRaidToSummary(team, currentRaider, 'SELF OUT', points, 'Raider went out of bounds');
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

let selectedPlayersCount = 0;
let requiredPlayers = 0;

function processBonus(team, touchPoints) {
    const ts = Date.now();
    console.log(`[BONUS_DEBUG] processBonus Start | Team: ${team} | TouchPts: ${touchPoints} | TS: ${ts}`);
    
    Swal.close();
    
    const ptsInt = parseInt(touchPoints);
    window.requiredPlayers = ptsInt;
    window.selectedPlayersCount = 0;
    const oppositeTeam = (team === 'A' ? 'B' : 'A');

    const activeRaiderEl = document.getElementById('activeRaider');
    const raiderName = activeRaiderEl ? activeRaiderEl.innerText.split('(')[0].trim() : "Raider";

    if (ptsInt === 0) {
        // --- १. फक्त बोनस (+1) ---
        updateScore(team, 1);
        
        // एम्प्टी रेड डॉट्स रिसेट (तुझे मूळ लॉजिक)
        if (typeof emptyRaidCount !== 'undefined') emptyRaidCount[team] = 0;
        if (typeof updateEmptyDots === "function") updateEmptyDots(team);
        
        // --- २. समरी अपडेट (आता आपण हे processPoints कडे सोपवू शकतो किंवा इथेच ठेवू शकतो) ---
        if (typeof addRaidToSummary === "function") {
            addRaidToSummary(team, raiderName, 'BONUS POINT', 1, 'Technical Bonus');
        }

        Swal.fire({ title: 'Bonus Only!', icon: 'success', toast: true, position: 'top', timer: 1500 });

        // --- ३. सर्वात महत्त्वाचा बदल: रेड क्लोज करणे ---
        // खेळाडू निवडायचे नसल्यामुळे आपण इथूनच 'Cleanup' करूया
        if (activeRaiderEl) {
            console.log(`[CLEANUP] Resetting activeRaider after Only Bonus...`);
            activeRaiderEl.innerText = "NONE (WAITING)";
            activeRaiderEl.classList.remove('text-green-400', 'text-blue-400');
        }

        // प्रॉब्लेम सोडवण्यासाठी: जर currentAction सेट असेल तर तो null करा
        currentAction = null;
        window.selectedPlayersList = [];

        // टायमर सुरू करा (तुझे मूळ लॉजिक)
       // if (typeof startRaidTimer === "function") startRaidTimer();

    } else {
        // --- बोनस (+1) + टच पॉईंट्स (हे लॉजिक जसे आहे तसेच राहील) ---
        console.log(`[BONUS_DEBUG] Bonus + Touch points. Opening Modal for Team: ${oppositeTeam}`);
        
        const totalPoints = 1 + ptsInt;

        currentAction = { 
            team: team, 
            type: 'bonus_touch', 
            points: totalPoints 
        };

        // डिफेन्डर निवडण्यासाठी मोडल उघडा
        openMultiPlayerModal(oppositeTeam, ptsInt, "Bonus Touch Out"); 
    }
}

function handleBonusTackle(raiderTeam) {
    console.log(`[STRICT_LOG] Bonus + Tackle! Raider Team: ${raiderTeam}`);
    Swal.close();

    const defenderTeam = (raiderTeam === 'A' ? 'B' : 'A');
    const activeRaiderEl = document.getElementById('activeRaider');
    const raiderRaw = activeRaiderEl ? activeRaiderEl.innerText : "";
    const raiderName = raiderRaw.split('(')[0].trim();

    // १. एम्प्टी रेड काउंट रिसेट करा (बोनस मिळाल्यामुळे)
    emptyRaidCount[raiderTeam] = 0; 
    if (typeof updateEmptyDots === 'function') updateEmptyDots(raiderTeam);

    // २. रेडरला Out List मध्ये टाका
    let raiderNoMatch = raiderRaw.match(/\d+/); 
    if (raiderNoMatch) {
        console.log(`[STRICT_LOG] Raider ${raiderNoMatch[0]} identified for Out status.`);
        updatePlayerStatus(raiderNoMatch[0], raiderTeam, 'Out');
    }

    // ३. समरीमध्ये नोंद
    if (typeof addRaidToSummary === "function") {
        addRaidToSummary(raiderTeam, raiderName, 'Bonus+Tackle', 1, 'Scored Bonus then Tackled');
    }

    // ४. करंट ॲक्शन सेट करा (स्कोर आता processPoints मधून अपडेट होईल)
    currentAction = { 
        team: defenderTeam, 
        type: 'bonus_tackle', 
        points: 1 
    };

    console.log(`[FLOW] Opening Defender List for Team ${defenderTeam}`);
    openPlayerModal(defenderTeam, 'tackle'); 

    Swal.fire({
        title: 'Bonus + Tackle!',
        text: 'आता टॅकल करणाऱ्या डिफेंडरला निवडा.',
        icon: 'success',
        toast: true, position: 'top', timer: 2000, showConfirmButton: false
    });
}



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



function updatePlayerStatus(playerNo, teamPrefix, newStatus) {
    console.log(`>>> [STATUS_CHANGE] Player: ${playerNo} | Team: ${teamPrefix} | New Status: ${newStatus}`);
    
    let targetList = (teamPrefix === 'A') ? teamAPlayers : teamBPlayers;
    let player = targetList.find(p => p.no == playerNo);
    
    if (player) {
        player.status = newStatus;

        if (newStatus === 'Out') {
            player.outTime = Date.now(); 
            console.log(`    [OUT_LOG] Time set for Player ${playerNo}: ${player.outTime}`);
            
            // १. आउट सिक्वेन्स अपडेट करा
            updateOutSequence(playerNo, teamPrefix, 'Out');

            // २. ऑल आऊट चेक करा
            console.log(`    [CHECK] Checking if Team ${teamPrefix} is All Out...`);
            checkAllOut(teamPrefix); 
        } 
        else if (newStatus === 'In') {
            console.log(`    [IN_LOG] Clearing Time for Player ${playerNo}.`);
            player.outTime = null; 

            // ३. आउट सिक्वेन्स अपडेट करा
            updateOutSequence(playerNo, teamPrefix, 'In');
        }

        // जुना प्लेयर्स लिस्ट रेंडर
        if (typeof renderMiniPlayers === "function") renderMiniPlayers();
    } else {
        console.error(`    [ERROR] Player ${playerNo} not found in Team ${teamPrefix}!`);
    }

    // [IMPORTANT]: व्हिज्युअल आयकॉन्स अपडेट करा (Font Awesome Color Change)
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
//     const { tId, mId } = matchSetupData; // आपण मॅच सेटअप वेळी हे सेव्ह केले होते
//     const scoreEl = document.getElementById(`score${teamPrefix}`);

//     if (!scoreEl) return;

//     // Local UI अपडेट
//     let currentScore = parseInt(scoreEl.innerText);
//     let newScore = currentScore + points;
//     scoreEl.innerText = newScore;

//     // Firebase अपडेट
//     try {
//         const matchRef = db.collection("tournaments").doc(tId).collection("matches").doc(mId);
        
//         const updateData = {};
//         if (teamPrefix === 'A') {
//             updateData.scoreA = newScore;
//         } else {
//             updateData.scoreB = newScore;
//         }

//         await matchRef.update(updateData);
//         console.log(`Score Updated for Team ${teamPrefix}: ${newScore}`);
        
//     } catch (error) {
//         console.error("Score Update Error:", error);
//     }

//     // [ADD THIS]: स्कोअर LocalStorage मध्ये साठवा
//     localStorage.setItem('liveScoreA', scoreA);
//     localStorage.setItem('liveScoreB', scoreB);
// }

async function updateScore(teamPrefix, points) {
    const { tId, mId } = matchSetupData; 
    const scoreEl = document.getElementById(`score${teamPrefix}`);

    if (!scoreEl) return;

    // Local UI अपडेट (जुना कोड तसाच आहे)
    let currentScore = parseInt(scoreEl.innerText);
    let newScore = currentScore + points;
    scoreEl.innerText = newScore;

    // Firebase अपडेट (जुना कोड तसाच आहे)
    try {
        const matchRef = db.collection("tournaments").doc(tId).collection("matches").doc(mId);
        
        const updateData = {};
        if (teamPrefix === 'A') {
            updateData.scoreA = newScore;
        } else {
            updateData.scoreB = newScore;
        }

        await matchRef.update(updateData);
        console.log(`Score Updated for Team ${teamPrefix}: ${newScore}`);
        
    } catch (error) {
        console.error("Score Update Error:", error);
    }

    // --- [SAFE FIX]: फक्त खालील २ ओळी दुरुस्त केल्या आहेत ---
    // आपण थेट स्क्रीनवरचा मजकूर (Text) स्टोरेजमध्ये साठवत आहोत
    const sA = document.getElementById('scoreA')?.innerText || "0";
    const sB = document.getElementById('scoreB')?.innerText || "0";

    localStorage.setItem('liveScoreA', sA);
    localStorage.setItem('liveScoreB', sB);
}

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

function updateOutSequenceDisplay() {
    document.getElementById('outSequenceA').innerText = outSequenceA.join(', ') || 'None';
    document.getElementById('outSequenceB').innerText = outSequenceB.join(', ') || 'None';
}




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

function updatePlayerData(team, index, field, value) {
    if (team === 'A') {
        teamAPlayers[index][field] = value;
    } else {
        teamBPlayers[index][field] = value;
    }
    console.log(`[UPDATE] Team ${team} Player ${index} ${field} set to: ${value}`);
}

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
    console.log(`>>> [ACTION_START] Team: ${team} | Type: ${type} | Points: ${points}`);

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

    // २. रेडर नसेल तर निवडायला सांगणे (तुझा मूळ कोड)
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

    // --- ४. टॅकल आणि सुपर टॅकल लॉजिक (इथे नवीन बदल केले आहेत) ---
    console.log(`[STRICT_LOG] Raider found: ${raiderRawText}. Moving to Out Logic.`);

    // [NEW CHANGE]: सुपर टॅकल नियम तपासणे (३ किंवा कमी खेळाडू आहेत का?)
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

            // [FIX]: नियम मोडला तरी रेड संपली आहे, म्हणून रेडर क्लिअर करा
            if (activeRaiderEl) {
                console.log(`[CLEANUP] Rule violated, resetting activeRaider UI...`);
                activeRaiderEl.innerText = "NONE (WAITING)";
                activeRaiderEl.classList.remove('text-green-400', 'text-blue-400');
            }
            
            // डेटा रिसेट
            currentAction = null;
            window.selectedPlayersList = [];

            return; // नियम मोडला असेल तर प्रक्रिया इथेच थांबवा
        }
    }

    let raiderNoMatch = raiderRawText.match(/\d+/);
    let raiderNo = raiderNoMatch ? raiderNoMatch[0] : null;

    if (type === 'tackle' || type === 'super_tackle') {
        if (raiderNo && typeof updatePlayerStatus === "function") {
            updatePlayerStatus(raiderNo, oppositeTeam, 'Out');
        }
        // [INFO]: addRaidToSummary इथून कमेंट केली आहे कारण आता ती processPoints मध्ये आहे
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

    // [NEW CHANGE]: मोडलचे टायटल परिस्थितीनुसार बदला
    let modalHeader = (type === 'super_tackle') ? "Super Tackle By" : "Tackled By";
    openMultiPlayerModal(team, 1, modalHeader);
}


function checkSuperTackle(defendingTeam) {
    let inCount = (defendingTeam === 'A' ? teamAPlayers : teamBPlayers).filter(p => p.status === 'In').length;
    
    if (inCount <= 3) {
        console.log("    [SPECIAL] SUPER TACKLE! 2 Points.");
        handlePoint(defendingTeam, 2); // २ पॉईंट्स आणि १ पेक्षा जास्त प्लेयर इन करण्याचं लॉजिक
    } else {
        handleTackle(defendingTeam);
    }
}

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

// ऑल-आऊटची प्रत्यक्ष अंमलबजावणी
function executeAllOut(allOutTeam, scoringTeam) {
    console.log(`>>> [ALL_OUT_START] Team: ${allOutTeam} is All-Out. Scoring Team: ${scoringTeam}`);

    updateScore(scoringTeam, 2); // २ ऑल-आऊट पॉईंट्स
    console.log(`    [SCORE] +2 Points added to Team ${scoringTeam}`);

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
            p.status = "In"; // तुझ्या आधीच्या फंक्शनमध्ये courtStatus होतं, ते 'status' आहे का एकदा चेक कर.
            p.outTime = null;
            console.log(`    [REVIVE] Player ${p.no} (${p.name}) is back In.`);
        } else {
            p.status = "Out"; 
            console.log(`    [BENCH] Player ${p.no} remains on Bench.`);
        }
    });

    renderMiniPlayers();
    console.log(`<<< [ALL_OUT_COMPLETE] Team ${allOutTeam} is fully revived.`);
}

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

function validateCheckboxes() {
    const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
    if (checkedCount > 7) {
        Swal.fire("मर्यादा!", "तुम्ही ७ पेक्षा जास्त खेळाडू 'Playing' म्हणून निवडू शकत नाही.", "warning");
        return false;
    }
    return true;
}

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

function addRaidToSummary(team, raiderName, result, points, details) {
    const raidFeed = document.getElementById('raidFeed');
    const modalRaidList = document.getElementById('modalRaidList');
    const noRaidText = document.getElementById('noRaidText');
    const modalEmptyText = document.getElementById('modalEmptyText');

    if (noRaidText) noRaidText.remove(); 
    if (modalEmptyText) modalEmptyText.remove(); 

    raidCounter++;
    document.getElementById('totalRaids').innerText = `Raids: ${raidCounter}`;

    // --- तुझे मूळ स्टाइलिंग लॉजिक (Raid Feed साठी) ---
    const borderColor = (team === 'A') ? 'border-green-500' : 'border-blue-500';
    let actionBg = "bg-gray-900"; 
    let indicatorIcon = "•"; 
    if (result.toUpperCase().includes('TACKLE')) { actionBg = "bg-red-900/30"; indicatorIcon = "🛑"; }
    else if (result.toUpperCase().includes('BONUS')) { actionBg = "bg-blue-900/30"; indicatorIcon = "✨"; }
    else if (points > 0) { actionBg = "bg-green-900/30"; indicatorIcon = "🎯"; }

    const displayDetails = (details && details !== "") ? details : "";

    // १. आडवा स्क्रोलर (Small Card) - हे बदलू नकोस
    const raidEntry = document.createElement('div');
    raidEntry.className = `flex-shrink-0 w-40 ${actionBg} border-l-2 ${borderColor} p-2 rounded-md shadow-md relative`;
    raidEntry.innerHTML = `
        <div class="flex justify-between items-start mb-0.5">
            <span class="text-[10px] font-black text-white truncate w-28 uppercase">${raiderName}</span>
            <span class="text-[10px] font-bold ${points > 0 ? 'text-green-400' : 'text-red-400'}">+${points}</span>
        </div>
        <div class="flex items-center gap-1 mb-1 opacity-90"><span class="text-[8px] text-gray-200 font-black uppercase tracking-tighter">${indicatorIcon} ${result}</span></div>
        <div class="border-t border-white/10 pt-1 mt-1"><div class="text-[8px] text-white/80 leading-snug font-medium italic">${displayDetails}</div></div>
    `;
    raidFeed.prepend(raidEntry);

    // २. [NEW STYLE]: मॉडेलमधील कॉमेंट्री स्टाईल लिस्ट
    if (modalRaidList) {
        const modalEntry = document.createElement('div');
        // क्रिकेट कॉमेंट्री सारखा लुक
        modalEntry.className = "py-2.5 border-b border-gray-100 flex gap-3 items-start bg-white";
        
        // पॉइंट्सचा रंग (हिरवा किंवा लाल)
        const ptsBg = points > 0 ? 'bg-green-600' : 'bg-red-600';
        const teamName = (team === 'A') ? (document.getElementById('teamAName')?.innerText || 'Team A') : (document.getElementById('teamBName')?.innerText || 'Team B');

        modalEntry.innerHTML = `
            <div class="shrink-0 w-6 h-6 ${ptsBg} text-white text-[10px] font-black flex items-center justify-center rounded shadow-sm">
                ${points}
            </div>
            <div class="flex-1 text-[11px] leading-relaxed text-gray-800">
                <span class="font-bold text-black uppercase">${raiderName}</span> 
                <span class="text-gray-400 text-[9px] font-bold">[${teamName}]</span>: 
                <span class="font-bold text-blue-800 uppercase tracking-tighter">${result}</span>. 
                <span class="text-gray-500 italic ml-1">${displayDetails}</span>
            </div>
        `;
        modalRaidList.prepend(modalEntry);
    }
}

// १. मॉडेल उघडण्यासाठी
function openSummaryModal() {
    console.log("--- [ULTIMATE_FIX_START] ---");
    const modal = document.getElementById('summaryModal');

    // १. टीमची नावे (फक्त मजकूर)
    const nameA = document.getElementById('teamAName')?.innerText || "Team A";
    const nameB = document.getElementById('teamBName')?.innerText || "Team B";

    // २. स्कोअर (LocalStorage मधून फक्त नंबर काढा)
    // यामुळे <h1 id="scoreA"> वाला गोंधळ कायमचा संपेल
    const finalScoreA = localStorage.getItem('liveScoreA') || "0";
    const finalScoreB = localStorage.getItem('liveScoreB') || "0";

    console.log("[FIXED_LOG] Final Values:", nameA, finalScoreA, "vs", nameB, finalScoreB);

    // ३. मॉडेलमध्ये डेटा सेट करा
    const mNameA = document.getElementById('modalTeamAName');
    const mNameB = document.getElementById('modalTeamBName');
    const mScoreA = document.getElementById('modalTeamAScore');
    const mScoreB = document.getElementById('modalTeamBScore');

    if (mNameA) mNameA.innerText = nameA;
    if (mNameB) mNameB.innerText = nameB;
    if (mScoreA) mScoreA.innerText = finalScoreA;
    if (mScoreB) mScoreB.innerText = finalScoreB;

    // ४. मॉडेल उघडा
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
    console.log("--- [ULTIMATE_FIX_END] ---");
}

// २. मॉडेल बंद करण्यासाठी
function closeSummaryModal() {
    const modal = document.getElementById('summaryModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    
    // बॉडी स्क्रोल पुन्हा सुरू करा
    document.body.style.overflow = 'auto';
}


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

// १. टायमर फॉरमॅट करणे
function formatMatchTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// २. टायमर सुरू/पॉज करणे (हे तुमच्या 'Pause Match' बटणासाठी)
function toggleMatchTimer() {
    const btn = document.getElementById('mainMatchBtn'); 
    
    // १. सर्वात आधी जुना कोणताही इंटरव्हल असेल तर तो थांबवा (Safety Check)
    clearInterval(matchInterval);

    if (isMatchPaused) {
        // २. मॅच सुरू/रिझ्युम करा
        isMatchPaused = false;
        if (btn) {
            btn.innerText = "PAUSE MATCH";
            btn.classList.replace('bg-green-600', 'bg-red-600'); // कलर पण बदलू शकतोस
        }

        matchInterval = setInterval(() => {
            if (matchTotalSeconds > 0) {
                matchTotalSeconds--;
                updateMatchUI();
                localStorage.setItem('savedMatchTime', matchTotalSeconds);
            } else {
                clearInterval(matchInterval); // वेळ संपल्यावर थांबवा
                handleMatchTimeEnd();
            }
        }, 1000);
    } else {
        // ३. मॅच पॉज करा
        isMatchPaused = true;
        if (btn) {
            btn.innerText = "RESUME MATCH";
            btn.classList.replace('bg-red-600', 'bg-green-600');
        }
        // clearInterval आपण वरच (Line 5) केला आहे, तरी इथे राहू दे.
        clearInterval(matchInterval);
    }
}

// ३. UI अपडेट करणे (फक्त 'matchTimer' आयडी वापरून)
function updateMatchUI() {
    const display = document.getElementById('matchTimer');
    if (display) {
        display.innerText = formatMatchTime(matchTotalSeconds);
        
        // १ मिनिटापेक्षा कमी वेळ असेल तर लाल रंग (Optional)
        if (matchTotalSeconds <= 60) {
            display.classList.add('text-red-500');
        }
    }
}




/*Refresh reload**/

// १. पेज लोड होताच जुना डेटा चेक करा
window.addEventListener('DOMContentLoaded', () => {
    const savedTime = localStorage.getItem('savedMatchTime');
    const savedStatus = localStorage.getItem('isMatchPaused');

    if (savedTime !== null) {
        matchTotalSeconds = parseInt(savedTime);
        updateMatchUI();
    }

    // [STRICT RULE]: पुन्हा आल्यावर मॅच नेहमी 'PAUSE' मोडमध्येच असावी
    isMatchPaused = true; 
    const btn = document.getElementById('mainMatchBtn');
    if (btn) {
        btn.innerText = "RESUME MATCH";
        btn.classList.replace('bg-red-900/40', 'bg-green-900/40');
    }
    clearInterval(matchInterval); 
});

// २. पेज रिफ्रेश करताना वॉर्निंग
window.onbeforeunload = function() {
    // १. जाताना डेटा सेव्ह करा
    saveMatchProgress();

    // २. जर मॅच सुरू असेल, तर पॉज करा
    if (!isMatchPaused) {
        isMatchPaused = true;
        clearInterval(matchInterval);
    }

    // ३. युजरला वॉर्निंग द्या
    if (matchTotalSeconds > 0 && matchTotalSeconds < 1200) {
        return "Match is in progress. Your data is saved and match is paused.";
    }
};


// १. वेळ सेव्ह करण्यासाठी फंक्शन (टायमर रन होत असताना हे कॉल होईल)
function saveMatchProgress() {
    localStorage.setItem('savedMatchTime', matchTotalSeconds);
    localStorage.setItem('isMatchPaused', isMatchPaused);
}

// २. मॅच आपोआप पॉज करणे (जेव्हा युजर पेज सोडून जातो)
window.addEventListener('blur', () => {
    // युजरने दुसऱ्या टॅबवर क्लिक केले किंवा मिनीमाइज केले तरी पॉज होईल
    if (!isMatchPaused) {
        toggleMatchTimer(); // हे फंक्शन मॅच पॉज करेल
    }
});


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


// १. ग्लोबल स्टेज सेट करा (फंक्शनच्या बाहेर)
let matchStage = "1ST_HALF"; 

async function handleMainAction() {
    const actionBtn = document.getElementById('mainActionBtn');
    const { tId, mId } = matchSetupData;

    // --- टप्पा १: पहिला हाफ संपवणे ---
    if (matchStage === "1ST_HALF") {
        const result = await Swal.fire({
            title: '1st Half संपवायचा का?',
            text: "यानंतर ब्रेक सुरू होईल.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'हो, संपवा',
            background: '#111',
            color: '#fff'
        });

        if (result.isConfirmed) {
            // टायमर पॉज करा (जर सुरू असेल तर)
            if (!isMatchPaused) toggleMatchTimer(); 
            
            matchStage = "INTERVAL";
            actionBtn.innerText = "Start 2nd Half";
            
            // बटणाचा लुक बदला (हिरवा करा जेणेकरून सुरू करायचंय हे कळेल)
            actionBtn.classList.replace('bg-red-900/20', 'bg-green-600');
            actionBtn.classList.replace('text-red-500', 'text-white');

            // DB मध्ये स्टेटस अपडेट करा
            await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
                status: "Half-Time"
            });
        }
    } 

    // --- टप्पा २: दुसरा हाफ सुरू करणे ---
    else if (matchStage === "INTERVAL") {
        // २० मिनिटे रिसेट करा (२० * ६० सेकंद)
        matchTotalSeconds = 20 * 60; 
        updateMatchUI();
        
        matchStage = "2ND_HALF";
        actionBtn.innerText = "End Match";
        
        // बटण पुन्हा लाल करा
        actionBtn.classList.replace('bg-green-600', 'bg-red-900/20');
        actionBtn.classList.replace('text-white', 'text-red-500');

        // २nd Half साठी टाईमआऊट रिसेट (Firestore मध्ये)
        await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
            timeoutsA: 0,
            timeoutsB: 0,
            status: "Live"
        });

        // टायमर पुन्हा सुरू करा
        if (isMatchPaused) toggleMatchTimer();
    } 

    // --- टप्पा ३: पूर्ण मॅच संपवणे ---
    else if (matchStage === "2ND_HALF") {
        // तुझं जे मूळ मॅच संपवण्याचं फंक्शन आहे ते इथे कॉल करा
        if (typeof confirmEndMatch === "function") {
            confirmEndMatch();
        } else {
            console.log("Match Ended!");
            // इथे मॅच संपवण्याचे लॉजिक येईल
        }
    }
}


async function confirmEndMatch() {
    // १. युजरला कन्फर्मेशन विचारा
    const result = await Swal.fire({
        title: 'मॅच संपवायची का?',
        text: "यानंतर स्कोअरमध्ये कोणताही बदल करता येणार नाही!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'हो, मॅच संपवा!',
        cancelButtonText: 'चूक झाली',
        background: '#111',
        color: '#fff'
    });

    if (result.isConfirmed) {
        const { tId, mId } = matchSetupData;
        const sA = Number(currentMatchData.scoreA || 0);
        const sB = Number(currentMatchData.scoreB || 0);
        
        let winnerText = "";
        let winnerTeam = "";

        // २. विजेता ठरवा
        if (sA > sB) {
            winnerTeam = currentMatchData.teamA;
            winnerText = `${winnerTeam} ने मॅच जिंकली आहे! 🏆`;
        } else if (sB > sA) {
            winnerTeam = currentMatchData.teamB;
            winnerText = `${winnerTeam} ने मॅच जिंकली आहे! 🏆`;
        } else {
            winnerText = "मॅच टाय (Tie) झाली आहे! 🤝";
        }

        try {
            // ३. डेटाबेसमध्ये स्टेटस 'Finished' करा
            await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update({
                status: "Finished",
                winner: winnerTeam,
                finalScore: `${sA}-${sB}`
            });

            // ४. स्कोअरिंग लॉक करा (Disable Buttons)
            lockScoringUI();

            // ५. निकाल दाखवा (Result Alert)
            Swal.fire({
                title: 'MATCH FINISHED!',
                html: `<div class="text-xl font-bold text-orange-500">${winnerText}</div>
                       <div class="mt-4 text-white text-lg">Final Score: ${sA} - ${sB}</div>`,
                icon: 'success',
                confirmButtonText: 'Dashboard ला जा',
                background: '#111',
                color: '#fff'
            }).then(() => {
                // मॅच संपल्यावर बॅक जा किंवा रिफ्रेश करा
                window.location.reload(); 
            });

        } catch (e) {
            console.error("End Match Error:", e);
        }
    }
}

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