window.onload = () => {
      loadPage('home');
};

/** toggle Menu */
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  sidebar.classList.toggle('-translate-x-full');
  overlay.classList.toggle('hidden');
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
function initPage(page) {

  if (page === 'home') {
    // future home logic
  }

  if (page === 'teams') {
    renderTeams();
  }

  if (page === 'tournaments') {
    renderTournaments();
  }

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

  const t = {
    name: tName,
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
    startDate: startDate, // नवीन फील्ड
    endDate: endDate,     // नवीन फील्ड
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
/**
 * renderTournaments
*/
async function renderTournaments() {
  const list = document.getElementById('tournamentList');
  if (!list) return;

  list.innerHTML = "<p class='text-center text-gray-500 text-xs'>लोड होत आहे...</p>";

  try {
    const snapshot = await db.collection("tournaments").orderBy("createdAt", "desc").get();
    list.innerHTML = "";

    snapshot.forEach((doc) => {
      const t = doc.data();
      const tId = doc.id; // Firebase Document ID

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
            
            <button onclick="event.stopPropagation(); editTournament('${tId}')" class="bg-blue-600 text-[10px] px-2 py-1 rounded text-white font-bold">
            Edit
            </button>
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
    list.innerHTML = "डेटा लोड करता आला नाही.";
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
    container.innerHTML = "";
    
    // १ ते १२ नंबरचे लूप
    for (let i = 1; i <= 12; i++) {
        container.innerHTML += `
            <div class="flex items-center gap-2 bg-gray-800/30 p-1 rounded-lg border border-gray-800">
                <input type="checkbox" id="${prefix}P${i}_check" class="w-4 h-4 ml-2" ${i <= 7 ? 'checked' : ''}>
                <input type="number" id="${prefix}P${i}_no" placeholder="No" class="w-12 bg-gray-900 text-white text-[11px] p-2 rounded-lg border border-gray-700 text-center font-bold">
                <input type="text" id="${prefix}P${i}_name" placeholder="Player Name" class="flex-1 bg-gray-900 text-white text-[11px] p-2 rounded-lg border border-gray-700">
                <span class="text-[8px] font-bold px-2 ${i <= 7 ? 'text-green-500' : 'text-gray-500'} w-8">${i <= 7 ? 'P7' : 'SUB'}</span>
            </div>
        `;
    }
}

function closeStartMatchModal() {
    document.getElementById('startMatchModal').classList.add('hidden');
}

async function confirmStartMatch() {
    const { tId, mId } = matchSetupData;
    
    // प्लेयर्सचा डेटा जमा करा
    const playersA = getPlayersData('A');
    const playersB = getPlayersData('B');

    const tossWinner = document.getElementById('tossWinner').value;
    const selection = document.getElementById('tossSelection').value;

    const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
    const match = mDoc.data();
    
    let firstRaidBy = (selection === "Raid") ? tossWinner : (tossWinner === match.teamA ? match.teamB : match.teamA);

    const updateData = {
        status: "Live",
        tossWinner: tossWinner,
        tossSelection: selection,
        firstRaidBy: firstRaidBy,
        currentRaider: firstRaidBy, // पहिली रेड कुणाची हे इथे सेव्ह होईल
        teamAPlayers: playersA,
        teamBPlayers: playersB,
        scoreA: 0,
        scoreB: 0,
        timeoutsA: 4,
        timeoutsB: 4,
        matchLog: [] // प्रत्येक पॉईंटची नोंद करण्यासाठी
    };

    try {
        await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update(updateData);
        closeStartMatchModal();
        Swal.fire("Match Live!", "स्कोअरिंग विंडो उघडत आहे...", "success");
        // इथून आपण renderScoringWindow(tId, mId) ला कॉल करू
    } catch (e) {
        console.error(e);
    }
}

function getPlayersData(prefix) {
    let data = [];
    for (let i = 1; i <= 12; i++) {
        data.push({
            no: document.getElementById(`${prefix}P${i}_no`).value || i,
            name: document.getElementById(`${prefix}P${i}_name`).value || `Player ${i}`,
            isPlaying: document.getElementById(`${prefix}P${i}_check`).checked,
            status: document.getElementById(`${prefix}P${i}_check`).checked ? "In" : "Out"
        });
    }
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