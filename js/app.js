let teamAPlayers = [];
let teamBPlayers = [];
let currentMatchData = null;


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
    if (!container) return; // सेफ्टी चेक
    container.innerHTML = "";
    
    console.log(`[RENDER] Generating inputs for ${prefix} Team with default numbers.`);

    for (let i = 1; i <= 12; i++) {
        // १. डिफॉल्ट नंबर सेट करा: Team A (1-12) आणि Team B (21-32)
        let defaultNo = (prefix === 'A') ? i : (i + 20);

        container.innerHTML += `
            <div class="flex items-center gap-2 bg-gray-800/30 p-1 rounded-lg border border-gray-800">
                <input type="checkbox" id="${prefix}P${i}_check" class="w-4 h-4 ml-2" ${i <= 7 ? 'checked' : ''}>
                
                <input type="number" id="${prefix}P${i}_no" 
                    value="${defaultNo}" 
                    placeholder="No" 
                    class="w-12 bg-gray-900 text-white text-[11px] p-2 rounded-lg border border-gray-700 text-center font-bold">
                
                <input type="text" id="${prefix}P${i}_name" 
                    placeholder="Player Name" 
                    class="flex-1 bg-gray-900 text-white text-[11px] p-2 rounded-lg border border-gray-700">
                
                <span class="text-[8px] font-bold px-2 ${i <= 7 ? 'text-green-500' : 'text-gray-500'} w-8">
                    ${i <= 7 ? 'P7' : 'SUB'}
                </span>
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
      goToScoring(tId, mId);
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

async function goToScoring(tId, mId) {
    await loadPage('scoring'); // आधी पेज लोड करा

    try {
        const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
        const match = mDoc.data();
        currentMatchData = match;

        // १. प्लेयर डेटा ग्लोबल व्हेरिएबल्समध्ये भरा
        teamAPlayers = match.teamAPlayers || [];
        teamBPlayers = match.teamBPlayers || [];

        // २. स्क्रीनवर टीमची नावे आणि स्कोअर दाखवा
        document.getElementById('liveTeamA').innerText = match.teamA;
        document.getElementById('liveTeamB').innerText = match.teamB;
        document.getElementById('scoreA').innerText = match.scoreA || 0;
        document.getElementById('scoreB').innerText = match.scoreB || 0;

        // ३. सुरुवातीचे ७ खेळाडू (In) रेंडर करा
        renderMiniPlayers();
        
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

function startRaidTimer(team) {
    // १. आधी टायमर थांबवा (जर आधीची रेड चुकून सुरू असेल तर)
    clearInterval(raidInterval);
    
    // २. रेडर निवडण्यासाठी मोडल उघडा
    openRaiderSelectionModal(team);
}

function openRaiderSelectionModal(team) {
    console.log(`[MODAL_OPEN] Attempting to open Raider Selection for Team: ${team}`);
    
    const modal = document.getElementById('playerSelectModal');
    const grid = document.getElementById('playerModalGrid');
    const title = document.getElementById('playerModalTitle');
    
    if (!modal || !grid) {
        console.error("[ERROR] Modal or Grid element not found in DOM!");
        return;
    }

    // १. डेटा चेक करा
    let players = (team === 'A') ? teamAPlayers : teamBPlayers;
    console.log(`[DATA_CHECK] Total players in Team ${team}:`, players ? players.length : 0);
    
    if (!players || players.length === 0) {
        console.error(`[ERROR] Player data is empty for Team ${team}`);
        Swal.fire("Error", "खेळाडूंची यादी सापडली नाही!", "error");
        return;
    }

    title.innerText = `Select Raider (Team ${team})`;
    grid.innerHTML = "";
    
    // २. 'In' प्लेयर्स फिल्टर करा
    const inPlayers = players.filter(p => p.status === 'In');
    console.log(`[DATA_CHECK] Players currently 'In':`, inPlayers.length);
    
    if (inPlayers.length === 0) {
        console.warn(`[WARN] No players are 'In' for Team ${team}. All are Out.`);
        grid.innerHTML = "<p class='text-gray-400 text-center col-span-4 py-4 text-[10px] uppercase font-bold'>सर्व खेळाडू आऊट आहेत!</p>";
    } else {
        inPlayers.forEach(p => {
            grid.innerHTML += `
                <button onclick="actuallyStartTimer('${p.no}', '${p.name}', '${team}')" 
                    class="bg-gray-800 border border-gray-700 p-3 rounded-xl flex flex-col items-center active:bg-green-600 transition-all">
                    <span class="text-xl font-black text-white">${p.no}</span>
                    <span class="text-[8px] text-gray-500 font-bold uppercase truncate w-full text-center mt-1">${p.name}</span>
                </button>`;
        });
        console.log(`[UI_UPDATE] Grid populated with ${inPlayers.length} player buttons.`);
    }

    modal.classList.replace('hidden', 'flex');
    console.log(`[MODAL_STATE] Modal is now VISIBLE.`);
}

/**actuallyStartTimer (तुझे मूळ टायमर लॉजिक)
एकदा रेडर निवडला की हे फंक्शन तुझे टायमरचे काम पूर्ण करेल. */
function actuallyStartTimer(playerNo, playerName, team) {
    console.log(`[ACTION] actuallyStartTimer started | Player: ${playerName} (${playerNo}) | Team: ${team}`);
    
    // १. मोडल बंद करा
    closePlayerModal();

    // २. स्क्रीनवर रेडरचे नाव अपडेट करा
    const activeRaiderEl = document.getElementById('activeRaider');
    if (activeRaiderEl) {
        activeRaiderEl.innerText = playerName;
        console.log(`[UI_UPDATE] Active Raider set to: ${playerName}`);
    } else {
        console.error("[ERROR] Element with ID 'activeRaider' not found!");
    }

    // ३. पेंडिंग ॲक्शन चेक करा (जर युजरने आधी पॉईंट्स किंवा बोनसवर क्लिक केले असेल तर)
    // आपण isBonusPending (बोनससाठी) आणि window.pendingAction (पॉईंट्ससाठी) दोन्ही चेक करूया
    
    // CASE A: बोनससाठी रेडर निवडला असेल तर
    if (typeof isBonusPending !== 'undefined' && isBonusPending) {
        console.log(`[FLOW] isBonusPending is TRUE. Redirecting to Bonus Modal.`);
        isBonusPending = false; // रिसेट करा
        setTimeout(() => {
            openBonusPointsModal(team);
        }, 300);
        return; // इथेच थांबा, टायमर सुरू करू नका
    }

    // CASE B: १, २, ३ किंवा मोर पॉईंट्ससाठी रेडर निवडला असेल तर
    if (window.pendingAction) {
        const pts = window.pendingAction.points;
        const t = window.pendingAction.team;
        const type = window.pendingAction.type;
        
        console.log(`[FLOW] Pending Action found: ${pts} points. Opening Defender Selection...`);
        window.pendingAction = null; // रिसेट करा

        setTimeout(() => {
            // मल्टिपल प्लेयर निवडण्यासाठी मोडल उघडा
            requiredPlayers = parseInt(pts);
            selectedPlayersCount = 0;
            currentAction = { team: t, type: type, points: requiredPlayers };
            
            // तुझे मूळ मोडल फंक्शन कॉल करा
            openMultiPlayerModal(t, requiredPlayers, "Touch");
        }, 300);
        return; // इथेच थांबा, टायमर सुरू करू नका
    }

    // CASE C: जर ही साधी रेड असेल (Start Raid बटनवरून), तर टायमर सुरू करा
    console.log(`[FLOW] No pending actions. Starting standard 30-sec timer.`);
    
    // जुना टायमर थांबवा
    clearInterval(raidInterval);
    
    raidTime = 30;
    const timerEl = document.getElementById('raidTimer');
    
    if (timerEl) {
        timerEl.innerText = raidTime;
        timerEl.classList.remove('text-red-600');
        timerEl.classList.add('text-green-500');

        raidInterval = setInterval(() => {
            raidTime--;
            timerEl.innerText = raidTime;

            // शेवटचे १० सेकंद
            if (raidTime <= 10) {
                timerEl.classList.replace('text-green-500', 'text-red-600');
            }

            // वेळ संपली
            if (raidTime <= 0) {
                clearInterval(raidInterval);
                console.log(`[TIMEOUT] Raid Over for ${playerName}`);
                Swal.fire({
                    title: "TIME OUT!",
                    text: `${playerName} आऊट!`,
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false
                });
                // टायमर संपल्यावर समोरच्या टीमला पॉईंट देण्याचं लॉजिक इथे टाकू शकतोस
            }
        }, 1000);
    } else {
        console.error("[ERROR] Element with ID 'raidTimer' not found!");
    }
}

function stopRaidTimer() {
    clearInterval(raidInterval);
}

let currentAction = null; // { team: 'A', type: 'touch', points: 1 }

// १. पॉईंट बटण दाबल्यावर काय होईल?
function handlePoint(team, points) {
    console.log(`[CHECK] handlePoint clicked | Team: ${team} | Points: ${points}`);
    stopRaidTimer();

    // १. रेडर चेक (Case-Insensitive)
    const activeRaiderEl = document.getElementById('activeRaider');
    const raiderText = activeRaiderEl ? activeRaiderEl.innerText.trim().toUpperCase() : "";
    console.log(`[CHECK] Current Raider: "${raiderText}"`);

    if (raiderText === "" || raiderText.includes("WAITING") || raiderText.includes("NONE")) {
        console.log(`[FLOW] Raider missing. Storing pending action for ${points} points.`);
        
        // ही 'Action' सेव्ह करा जेणेकरून रेडर निवडल्यावर ती आपोआप सुरू होईल
        window.pendingAction = { team: team, points: points, type: 'touch' };

        Swal.fire({
            title: 'Select Raider First!',
            text: 'पॉईंट्स देण्यापूर्वी रेडर निवडा.',
            icon: 'warning',
            confirmButtonText: 'Select Raider'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(`[UI] Opening Raider Selection Modal...`);
                openRaiderSelectionModal(team);
            }
        });
        return;
    }

    // २. जर रेडर आधीच असेल तर थेट डिफेंडर्स निवडायला पाठवा
    console.log(`[FLOW] Raider present. Proceeding to select ${points} defenders.`);
    startTouchSelection(team, points);
}

function openMorePointsModal(team) {
    console.log(`[UI] Opening More Points Grid for Team ${team}`);
    Swal.fire({
        title: 'Select Points',
        background: '#111',
        html: `
            <div class="grid grid-cols-2 gap-3 mt-2">
                ${[4, 5, 6, 7].map(num => `
                    <button onclick="handlePoint('${team}', ${num})" 
                        class="bg-gray-800 py-5 rounded-xl text-white font-black text-2xl border border-gray-700 active:bg-orange-600">
                        ${num}
                    </button>
                `).join('')}
            </div>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'CANCEL'
    });
}

function startTouchSelection(team, count) {
    console.log(`[DATA] Setting up Touch Selection: ${count} players needed.`);
    
    // तुझे मूळ व्हेरिएबल्स
    requiredPlayers = parseInt(count);
    selectedPlayersCount = 0;

    currentAction = { 
        team: team, 
        type: 'touch', 
        points: requiredPlayers 
    };

    // तुझे आधीचे 'openMultiPlayerModal' फंक्शन कॉल करा
    // आपण टायटल म्हणून "Touch" पाठवूया
    if (typeof openMultiPlayerModal === "function") {
        openMultiPlayerModal(team, requiredPlayers, "Touch");
    } else {
        console.error("[ERROR] openMultiPlayerModal function सापडले नाही!");
    }
}

// २. प्लेयर निवडण्यासाठी मोडल उघडणे
function openPlayerModal(team, type) {
    const modal = document.getElementById('playerSelectModal');
    const grid = document.getElementById('playerModalGrid');
    
    let targetTeam;
    if (type === 'out') {
        targetTeam = team; 
    } else if (type === 'tackle') {
        targetTeam = team; 
    } else {
        targetTeam = (team === 'A' ? 'B' : 'A'); 
    }

    console.log(`[MODAL] Type: ${type}, Opening players for Team: ${targetTeam}`);
    
    let players = (targetTeam === 'A') ? teamAPlayers : teamBPlayers;
    grid.innerHTML = "";
    
    players.filter(p => p.status === 'In').forEach(p => {
        grid.innerHTML += `
            <button onclick="selectPlayer('${p.no}', '${targetTeam}')" 
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
function selectPlayer(playerNo, team) {
    console.log(`[SELECT] Player ${playerNo} from Team ${team} selected.`);
    
    // १. डिफेंडरला सिलेक्ट करणे (किंवा जो प्लेयर क्लिक केलाय त्याला)
    updatePlayerStatus(playerNo, team, 'In'); // डिफेंडर तर 'In'च राहणार

    // २. जर ही टॅकल असेल, तर जो रेडर 'Raiding' करत होता त्याला 'Out' करा
    // आपण 'activeRaider' मधला डेटा वापरून त्याला आऊट करू शकतो
    processRaiderOutStatus(); 

    // ३. स्कोअर आणि मोडल क्लोज
    processPoints();
    closePlayerModal();
    
    // ४. रेडरचं नाव रिसेट करा
    document.getElementById('activeRaider').innerText = "Waiting for Raid...";
}

// रेडरला मॅन्युअली आऊट करण्यासाठी एक सपोर्ट फंक्शन
function processRaiderOutStatus() {
    const raiderName = document.getElementById('activeRaider').innerText;
    // इथे तुझं प्लेयरचा स्टेटस 'Out' करण्याचं लॉजिक टाक
    // उदा. शोधून काढा की कोणत्या टीमचा हा खेळाडू आहे आणि त्याला आऊट करा.
    console.log(`[STATUS] Raider ${raiderName} marked as OUT.`);
}

function processPoints() {
    if (!currentAction) return;

    const { team, type, points } = currentAction;

    if (type === 'bonus_tackle') {
        // १. डिफेंडर टीमला १ पॉईंट (Tackle)
        updateScore(team, 1); 

        // २. रेडर टीमला १ पॉईंट (Bonus)
        const raiderTeam = (team === 'A' ? 'B' : 'A');
        updateScore(raiderTeam, 1);
        
        console.log(`[SCORE UPDATE] Bonus + Tackle: 1 point to each team.`);
    } else {
        // तुझे बाकीचे नेहमीचे पॉईंट्स (Touch, Tackle, etc.)
        updateScore(team, points);
    }

    // ३. एम्प्टी रेड काउंट रिसेट करा (बोनस/टॅकल झालाय म्हणून)
    emptyRaidCount['A'] = 0;
    emptyRaidCount['B'] = 0;
    updateEmptyDots('A');
    updateEmptyDots('B');

    // क्लिनअप
    currentAction = null;
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
    console.log(`[CHECK] handleBonus clicked for team: ${team}`);
    stopRaidTimer();

    const activeRaiderEl = document.getElementById('activeRaider');
    // .trim() मुळे फाजील स्पेस निघून जाईल आणि .toUpperCase() मुळे अक्षरांचा घोळ मिटेल
    const activeRaiderText = activeRaiderEl ? activeRaiderEl.innerText.trim().toUpperCase() : "";
    
    console.log(`[CHECK] Normalized Raider text: "${activeRaiderText}"`);

    // आता आपण फक्त "WAITING" हा शब्द आहे का ते चेक करूया
    if (activeRaiderText === "" || activeRaiderText.includes("WAITING") || activeRaiderText.includes("NONE")) {
        console.log(`[CHECK] Raider missing (Matched 'WAITING'). Opening Selection...`);
        
        isBonusPending = true; // बोनस मोडल उघडण्यासाठी खूण

        Swal.fire({
            title: 'Select Raider First!',
            text: 'बोनस देण्यापूर्वी रेडर कोण आहे ते निवडा.',
            icon: 'warning',
            confirmButtonText: 'Select Raider'
        }).then((result) => {
            if (result.isConfirmed) {
                openRaiderSelectionModal(team);
            }
        });
        return;
    }

    console.log(`[CHECK] Raider found. Opening Bonus Modal Directly.`);
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

function handleBonusTackle(raiderTeam) {
    console.log(`[ACTION] Bonus + Tackle! Raider Team: ${raiderTeam}`);
    Swal.close();

    const defenderTeam = (raiderTeam === 'A' ? 'B' : 'A');

    // १. फक्त ॲक्शन सेट करा, स्कोअर इथे देऊ नका
    currentAction = { 
        team: defenderTeam, // टॅकलचे मुख्य पॉईंट्स डिफेंडरला
        type: 'bonus_tackle', 
        points: 1 // हा टॅकलचा १ पॉईंट
    };

    // २. थेट डिफेंडर निवडण्यासाठी मोडल उघडा
    console.log(`[FLOW] Opening Defender List for Team ${defenderTeam}`);
    openPlayerModal(defenderTeam, 'tackle'); 

    Swal.fire({
        title: 'Bonus + Tackle!',
        text: 'आता टॅकल करणाऱ्या डिफेंडरला निवडा.',
        icon: 'success',
        toast: true,
        position: 'top',
        timer: 2000,
        showConfirmButton: false
    });
}

// function processBonus(team, touchPoints) {
//     Swal.close(); // जुना पॉईंट्सचा पॉपअप बंद करा
    
//     const totalPoints = 1 + touchPoints; // १ बोनस + किती टच
//     console.log(`[BONUS PROCESS] Team: ${team}, Bonus: 1, Touch: ${touchPoints}, Total: ${totalPoints}`);

//     if (touchPoints === 0) {
//         // फक्त बोनस - थेट स्कोअर अपडेट
//         updateScore(team, 1);
//         emptyRaidCount[team] = 0; // बोनस मिळाला की एम्प्टी रेड काउंट रिसेट
//         updateEmptyDots(team);
        
//         Swal.fire({ title: 'Bonus Point!', icon: 'success', toast: true, position: 'top', timer: 1500 });
//     } else {
//         // बोनस + टच पॉईंट्स - समोरच्या टीमची प्लेयर लिस्ट उघडा
//         currentAction = { 
//             team: team, 
//             type: 'bonus_touch', 
//             points: totalPoints 
//         };
        
//         // समोरच्या टीमची लिस्ट उघडा (आउट झालेले प्लेयर्स निवडण्यासाठी)
//         openPlayerModal(team, 'touch'); 
//     }
// }

function renderMiniPlayers() {
    const containerA = document.getElementById('miniInA');
    const containerB = document.getElementById('miniInB');
    
    if(!containerA || !containerB) return;

    // Team A रेंडरिंग आणि काउंट
    const inCountA = teamAPlayers.filter(p => p.status === 'In').length;
    containerA.innerHTML = teamAPlayers.map(p => 
        `<span class="${p.status === 'In' ? 'text-green-500' : 'text-red-600'} text-xs">👤</span>`
    ).join('');
    // जर हवं असेल तर तू इथे 'inCountA' चा वापर करून "Players In: 5" असं ही दाखवू शकतोस.

    // Team B रेंडरिंग आणि काउंट
    const inCountB = teamBPlayers.filter(p => p.status === 'In').length;
    containerB.innerHTML = teamBPlayers.map(p => 
        `<span class="${p.status === 'In' ? 'text-green-500' : 'text-red-600'} text-xs">👤</span>`
    ).join('');

    // Super Tackle Check (जर ३ किंवा त्यापेक्षा कमी खेळाडू उरले असतील तर)
    checkSuperTackleAvailability(inCountA, inCountB);
}

function checkSuperTackleAvailability(countA, countB) {
    // इथे आपण सुपर टॅकल बटण चमकवायचं की नाही याचं लॉजिक लिहू शकतो
    console.log(`Live Status - Team A: ${countA}, Team B: ${countB}`);
}

function updatePlayerStatus(playerNo, teamPrefix, newStatus) {
    let targetList = (teamPrefix === 'A') ? teamAPlayers : teamBPlayers;
    let player = targetList.find(p => p.no == playerNo);
    
    if (player) {
        player.status = newStatus;
        renderMiniPlayers(); // स्क्रीनवर आयकॉनचा रंग बदलण्यासाठी
        
        // TODO: इथे Firebase मध्ये सुद्धा अपडेट पाठवू शकतोस जेणेकरून लाईव्ह दिसले
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
async function updateScore(teamPrefix, points) {
    const { tId, mId } = matchSetupData; // आपण मॅच सेटअप वेळी हे सेव्ह केले होते
    const scoreEl = document.getElementById(`score${teamPrefix}`);

    if (!scoreEl) return;

    // Local UI अपडेट
    let currentScore = parseInt(scoreEl.innerText);
    let newScore = currentScore + points;
    scoreEl.innerText = newScore;

    // Firebase अपडेट
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
}

let outSequenceA = [];
let outSequenceB = [];

function updateOutSequence(playerNo, team) {
    if (team === 'A') {
        outSequenceA.push(playerNo);
        document.getElementById('outSequenceA').innerText = outSequenceA.join(', ');
    } else {
        outSequenceB.push(playerNo);
        document.getElementById('outSequenceB').innerText = outSequenceB.join(', ');
    }
}

/** Empty Raid */
let emptyRaidCount = { A: 0, B: 0 };

function handleEmptyRaid(team) {
    console.log(`[EMPTY RAID] Team: ${team}, Current Count: ${emptyRaidCount[team]}`);
    
    emptyRaidCount[team]++;

    if (emptyRaidCount[team] === 3) {
        console.log(`[DO OR DIE] Team ${team} failed.`);
        let oppositeTeam = (team === 'A' ? 'B' : 'A');

        // महत्त्वाचं: इथे थेट updateScore() करू नकोस, म्हणून २ पॉईंट्स जात होते.
        // आपण फक्त 'currentAction' सेट करू आणि मोडल उघडू.
        
        currentAction = { 
            team: oppositeTeam, // पॉईंट कोणाला मिळणार? (Opposite Team ला)
            type: 'tackle', 
            points: 1 
        };

        // टीम 'A' ची रेड असेल तर टीम 'A' चाच प्लेयर आउट दाखवला पाहिजे.
        // त्यासाठी आपण 'out' प्रकार वापरून त्याच टीमची लिस्ट उघडू.
        openPlayerModal(team, 'out'); 

        emptyRaidCount[team] = 0; // काउंट रिसेट
    }
    
    updateEmptyDots(team);
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

let selectedPlayersCount = 0;
let requiredPlayers = 0;

function processBonus(team, touchPoints) {
    Swal.close();
    requiredPlayers = parseInt(touchPoints);
    selectedPlayersCount = 0;

    if (requiredPlayers === 0) {
        updateScore(team, 1);
        emptyRaidCount[team] = 0;
        updateEmptyDots(team);
        Swal.fire({ title: 'Bonus Only!', icon: 'success', toast: true, position: 'top', timer: 1500 });
    } else {
        currentAction = { 
            team: team, 
            type: 'bonus_touch', 
            points: 1 + requiredPlayers 
        };
        // समोरच्या टीमची लिस्ट उघडा - इथे "Bonus Touch" पाठवा
        openMultiPlayerModal(team, requiredPlayers, "Bonus Touch"); 
    }
}

function openMultiPlayerModal(team, count, headerText = "Out Players") {
    console.log(`[MODAL] Opening Multi-Select for Team ${team}. Goal: ${count} players.`);
    
    const modal = document.getElementById('playerSelectModal');
    const grid = document.getElementById('playerModalGrid');
    const title = document.getElementById('playerModalTitle');
    
    let targetTeam = (team === 'A' ? 'B' : 'A');
    
    // परिस्थितीनुसार टायटल बदला (उदा. "Select 2 Touch Points")
    title.innerText = `Select ${count} ${headerText} (Team ${targetTeam})`;
    
    let players = (targetTeam === 'A') ? teamAPlayers : teamBPlayers;
    grid.innerHTML = "";
    
    players.filter(p => p.status === 'In').forEach(p => {
        grid.innerHTML += `
            <button id="p-btn-${p.no}" onclick="selectMultiplePlayers('${p.no}', '${targetTeam}')" 
                class="bg-gray-800 border border-gray-700 p-3 rounded-xl flex flex-col items-center active:bg-red-600 transition-all">
                <span class="text-xl font-black text-white">${p.no}</span>
                <span class="text-[8px] text-gray-500 uppercase mt-1">${p.name}</span>
            </button>`;
    });

    modal.classList.replace('hidden', 'flex');
}

function selectMultiplePlayers(playerNo, team) {
    // १. प्लेयरचा स्टेटस अपडेट करा (आऊट करा)
    updatePlayerStatus(playerNo, team, 'Out');
    updateOutSequence(playerNo, team);
    
    // २. बटण डिसेबल करा जेणेकरून तोच प्लेयर पुन्हा निवडता येणार नाही
    const btn = document.getElementById(`p-btn-${playerNo}`);
    btn.classList.replace('bg-gray-800', 'bg-red-900');
    btn.disabled = true;

    selectedPlayersCount++;

    // ३. जर ठरवलेले सर्व प्लेयर्स निवडून झाले असतील, तरच मोडल बंद करा आणि स्कोअर द्या
    if (selectedPlayersCount === requiredPlayers) {
        setTimeout(() => {
            processPoints();
            closePlayerModal();
        }, 500);
    } else {
        // अजून प्लेयर्स निवडायचे आहेत असा मेसेज
        const title = document.getElementById('playerModalTitle');
        title.innerText = `Select ${requiredPlayers - selectedPlayersCount} more...`;
    }
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