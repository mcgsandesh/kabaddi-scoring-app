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

/** 
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
    // २. युनिक नेम चेक (Restriction)
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

    // ४. नवीन डेटा स्ट्रक्चर (Cleaned)
    const tData = {
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
      
      teams: [],                  // 🔥 आता सुरुवातीला संघ यादी पूर्णपणे ब्लँक राहील!
      createdBy: user.email,      // टूर्नामेंटचा मालक (Admin)
      assignedScorers: [],        // नेमलेल्या स्कोअरर्सची लिस्ट
      createdAt: new Date().getTime()
    };

    console.log("[Firestore]: Saving tournament data...", tData);
    await db.collection("tournaments").add(tData);
    
    Swal.fire({
      icon: 'success',
      title: 'स्पर्धा तयार झाली!',
      text: 'नवीन टूर्नामेंट यशस्वीरित्या जतन केली आहे.',
      timer: 1500,
      showConfirmButton: false
    });

    closeTournamentModal();
    renderTournaments(); // मुख्य लिस्ट रिफ्रेश करा

  } catch (error) {
    console.error("[Fatal Error] createTournament failed:", error);
    Swal.fire({ icon: 'error', title: 'चूक झाली!', text: 'डेटा जतन करताना तांत्रिक अडचण आली.' });
  }
}
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
// function createMatchEntry(batch, tId, mNo, roundName) {
//   const mRef = db.collection("tournaments").doc(tId).collection("matches").doc(`M${mNo}`);
//   batch.set(mRef, {
//     matchNo: mNo,
//     teamA: "TBD",
//     teamB: "TBD",
//     status: "Pending",
//     scoreA: 0,
//     scoreB: 0,
//     round: roundName
//   });
// }

// मॅच एन्ट्री तयार करण्यासाठी फ्युचर-प्रूफ हेल्पपर फंक्शन
function createMatchEntry(batch, tId, mNo, roundName) {
  const mRef = db.collection("tournaments").doc(tId).collection("matches").doc(`M${mNo}`);
  
  batch.set(mRef, {
    matchNo: mNo,
    teamA: "TBD",
    teamB: "TBD",
    teamA_id: "TBD", // 🟢 नवीन युनिक आयडी फील्ड भविष्यातील सुरक्षेसाठी
    teamB_id: "TBD", // 🟢 नवीन युनिक आयडी फील्ड भविष्यातील सुरक्षेसाठी
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
// async function switchTab(tabName, tId) {
//   // १. जर आयडी आला असेल तर तो सेव्ह करा, नसेल तर सेव्ह केलेला वापरा
//   if (tId) {
//     currentTid = tId;
//     localStorage.setItem('lastTournamentId', tId); // ब्राउझरमध्ये सेव्ह करा
//   } else {
//     currentTid = localStorage.getItem('lastTournamentId'); // रिफ्रेश केल्यावर इथून मिळेल
//   }

//   const targetId = currentTid;
//   const content = document.getElementById('tabContent');

//   // जर आयडीच नसेल, तर पुढे जाऊ नका
//   if (!targetId || !content) {
//     console.error("Tournament ID missing!");
//     return;
//   }

//   // २. सर्व टॅब बटणांचे ॲक्टिव्ह स्टाइल रिसेट करा
//   const tabs = document.querySelectorAll('button[onclick^="switchTab"]');
//   tabs.forEach(tab => {
//     tab.classList.remove('border-green-600', 'text-green-500');
//     tab.classList.add('border-transparent', 'text-gray-400');
    
//     // जो टॅब क्लिक केलाय त्याला हायलाईट करा
//     if (tab.getAttribute('onclick').includes(`'${tabName}'`)) {
//       tab.classList.add('border-green-600', 'text-green-500');
//       tab.classList.remove('border-transparent', 'text-gray-400');
//     }
//   });

//   // ३. डेटा लोड करा
//   try {
//     const doc = await db.collection("tournaments").doc(targetId).get();
//     const tData = doc.data();

//     if (tabName === 'details') {
//       renderDetailsTab(tData, targetId);
//     } else if (tabName === 'fixtures') {
//       renderFixturesTab(targetId);
//     }
//   } catch (error) {
//     console.error("Tab switch error:", error);
//   }
// }

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
//   content.innerHTML = "<p class='text-center text-gray-500 py-10 text-xs'>मॅचेस शोधत आहे...</p>";

//   try {
//     const snapshot = await db.collection("tournaments").doc(tId).collection("matches").orderBy("matchNo").get();
    
//     if (snapshot.empty) {
//       content.innerHTML = `
//         <div class="text-center py-10">
//           <p class="text-gray-500 mb-4 text-sm">अजून मॅचेस तयार केल्या नाहीत.</p>
//           <button onclick="switchTab('details', '${tId}')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs">Details मध्ये जाऊन Template तयार करा</button>
//         </div>
//       `;
//       return;
//     }

//     content.innerHTML = "";
//     snapshot.forEach(doc => {
//       const match = doc.data();
//       const mId = doc.id;

//       // १. दोन्ही टीम्स TBD नसतील तरच स्टार्ट बटन दाखवण्यासाठी हा चेक:
//       const isReady = match.teamA !== "TBD" && match.teamB !== "TBD";

//       content.innerHTML += `
//         <div class="bg-gray-900 p-4 rounded-2xl border border-gray-800 mb-4 shadow-xl">
//           <div class="flex justify-between items-center mb-3">
//             <div class="flex flex-col">
//               <span class="text-[9px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full font-bold w-fit uppercase tracking-wider mb-1">
//                 ${match.round || 'Tournament'}
//               </span>
//               <span class="text-[10px] text-gray-500 font-bold">Match #${match.matchNo}</span>
//             </div>
            
//             <button onclick="openMatchSetter('${tId}', '${mId}')" class="text-[10px] bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-gray-300 transition-colors">
//               Set Team/Time
//             </button>
//           </div>

//           <div class="flex justify-between items-center text-center py-2">
//             <div class="flex-1">
//               <p class="text-sm font-black text-white uppercase">${match.teamA}</p>
//               <p class="text-xl font-black text-green-500 mt-1">${match.scoreA || 0}</p>
//             </div>
//             <div class="px-4">
//               <div class="text-[10px] bg-gray-800 text-gray-500 px-2 py-1 rounded font-bold uppercase">VS</div>
//             </div>
//             <div class="flex-1">
//               <p class="text-sm font-black text-white uppercase">${match.teamB}</p>
//               <p class="text-xl font-black text-green-500 mt-1">${match.scoreB || 0}</p>
//             </div>
//           </div>

//           <div class="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center">
//             <div class="text-[9px] text-gray-500 italic">
//               📅 ${match.matchDate || 'Date TBD'} | ⏰ ${match.matchTime || 'Time TBD'}
//             </div>
            
//             <div>
//               ${isReady ? `
//                 <button onclick="startScoring('${tId}', '${mId}')" class="bg-green-600 hover:bg-green-500 text-white text-[10px] px-4 py-2 rounded-xl font-black shadow-lg transition-all active:scale-95 uppercase">
//                   Start Scoring
//                 </button>
//               ` : `
//                 <span class="text-[9px] text-orange-500 font-bold italic animate-pulse">Set Teams First</span>
//               `}
//             </div>
//           </div>
//         </div>
//       `;
//     });

//   } catch (error) {
//     console.error("Error fetching fixtures:", error);
//     content.innerHTML = "<div class='text-center text-red-500 py-10'>फिक्स्चर्स लोड करताना चूक झाली.</div>";
//   }
// }

async function renderFixturesTab(tId) {
  const content = document.getElementById('tabContent');
  if (!content) return;

  // प्रो-लेव्हल लोडिंग स्टेट
  content.innerHTML = `
    <div class="flex justify-center py-20 text-orange-500 animate-pulse text-[10px] font-black uppercase tracking-widest">
        मॅचेस शोधत आहे (Loading Fixtures)...
    </div>`;

  try {
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
    snapshot.forEach(doc => {
      const match = doc.data();
      const mId = doc.id;

      // १. दोन्ही टीम्स TBD किंवा BYE नसतील तरच स्टार्ट बटन दाखवण्यासाठी हा चेक:
      const isReady = match.teamA !== "TBD" && match.teamB !== "TBD" && match.teamA !== "BYE" && match.teamB !== "BYE";

      // २. मऊ डार्क ऑरेंज थीममधील मॅच कार्ड
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
              <p class="text-2xl font-black text-white mt-1.5 font-mono drop-shadow-md">${match.scoreA || 0}</p>
            </div>
            
            <div class="px-2 shrink-0">
              <div class="text-[9px] bg-gray-950 text-orange-500/80 border border-gray-800 px-2.5 py-1 rounded-xl font-black uppercase tracking-wider shadow-inner group-hover:scale-110 transition-transform italic">
                VS
              </div>
            </div>
            
            <div class="flex-1 min-w-[40%]">
              <p class="text-xs font-black text-white uppercase tracking-tighter truncate px-1">${match.teamB}</p>
              <p class="text-2xl font-black text-white mt-1.5 font-mono drop-shadow-md">${match.scoreB || 0}</p>
            </div>
            
          </div>

          <div class="mt-4 pt-3 border-t border-gray-800/60 flex justify-between items-center">
            <div class="text-[9px] text-gray-500 font-medium font-mono flex items-center gap-1">
              <span>📅</span> ${match.matchDate || 'Date TBD'} <span class="text-gray-700">|</span> <span>⏰</span> ${match.matchTime || 'Time TBD'}
            </div>
            
            <div>
              ${isReady ? `
                <button onclick="startScoring('${tId}', '${mId}')" 
                    class="bg-orange-600 hover:bg-orange-700 text-white text-[10px] px-4 py-2 rounded-xl font-black shadow-[0_4px_12px_rgba(249,115,22,0.3)] transition-all active:scale-95 uppercase tracking-tighter italic">
                  Start Scoring
                </button>
              ` : `
                <span class="text-[8px] bg-orange-600/10 text-orange-500 border border-orange-500/20 px-2.5 py-1 rounded-lg font-black uppercase tracking-wider italic animate-pulse">
                  ${match.teamA === "BYE" || match.teamB === "BYE" ? 'BYE Match' : 'Set Teams First'}
                </span>
              `}
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





// async function startScoring(tId, mId) {
//     console.log("Starting Match Setup:", tId, mId);
//     matchSetupData = { tId, mId };
    
//     // --- बदल १: आधी LocalStorage मध्ये 'Resume' करण्यासाठी डेटा आहे का ते चेक करा ---
//     const localMatch = localStorage.getItem(`active_match_${mId}`);
//     if (localMatch) {
//         const savedData = JSON.parse(localMatch);
//         if (savedData.status === "STARTED") {
//             console.log("Match already started, resuming scoring...");
//             // जर मॅच सुरू असेल तर थेट स्कोअरिंग UI कडे वळा (हे फंक्शन आपण नंतर लिहू)
//             // resumeMatchUI(savedData); 
//             // return; 
//         }
//     }

//     const modal = document.getElementById('startMatchModal');
//     const tossSelect = document.getElementById('tossWinner');
//     const tabBtnA = document.getElementById('tabBtnA');
//     const tabBtnB = document.getElementById('tabBtnB');

//     if (!modal || !tossSelect) {
//         Swal.fire("Error", "Start Match Modal missing in HTML!", "error");
//         return;
//     }

//     try {
//         const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
//         const match = mDoc.data();

//         // १. टॉस विनरचे ऑप्शन्स भरा
//         tossSelect.innerHTML = `
//             <option value="${match.teamA}">${match.teamA}</option>
//             <option value="${match.teamB}">${match.teamB}</option>
//         `;

//         // २. टॅब बटणांवर टीमची नावे दाखवा
//         if (tabBtnA) tabBtnA.innerText = match.teamA;
//         if (tabBtnB) tabBtnB.innerText = match.teamB;

//         // ३. १२ खेळाडूंचे इनपुट रेंडर करा
//         renderPlayerInputs('playerListA', 'A');
//         renderPlayerInputs('playerListB', 'B');

//         // --- बदल २: जर आधीच खेळाडूंची नावे लोकलमध्ये असतील तर ती इनपुटमध्ये भरा ---
//         if (localMatch) {
//             const savedData = JSON.parse(localMatch);
//             fillSavedPlayers(savedData); // हे एक छोटा फंक्शन आपण खाली बनवूया
//         }

//         // ४. मोडल उघडा
//         modal.classList.remove('hidden');
//         modal.classList.add('flex');
        
//         // ५. बाय डिफॉल्ट Team A चा टॅब उघडा ठेवा
//         switchPlayerTab('A');

//     } catch (e) {
//         console.error("Error in startScoring:", e);
//         Swal.fire("Error", "डेटा लोड करताना चूक झाली.", "error");
//     }
// }

// async function startScoring(tId, mId) {
//     console.log(`--- [MATCH_INIT] Checking Status for Match: ${mId} --- 🚀`);
//     matchSetupData = { tId, mId };
    
//     try {
//         // १. सर्वात आधी Firestore मधून मॅचचा करंट स्टेटस चेक करा ☁️
//         const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
        
//         if (!mDoc.exists) {
//             Swal.fire("Error", "मॅचचा डेटा सापडला नाही!", "error");
//             return;
//         }

//         const match = mDoc.data();
//         console.log(`[STATUS_CHECK] Current Match Status: ${match.status} 📊`);

//         // २. [LOCK-LOGIC] जर स्टेटस आधीच "Live" असेल तर सेटअप न दाखवता थेट स्कोअरिंगला पाठवा 🏁
//         if (match.status === "Live") {
//             console.log("[REDIRECT] Match is already Live. Bypassing Setup Modal... 🚀");
            
//             // लोकल स्टोरेज अपडेट करा जेणेकरून स्कोअरिंग स्क्रीनला डेटा मिळेल
//             localStorage.setItem(`active_match_${mId}`, JSON.stringify(match));
            
//             // थेट स्कोअरिंग स्क्रीनवर नेणारे तुझे फंक्शन
//             goToScoring(tId, mId); 
//             return; // फंक्शन इथेच थांबवा
//         }

//         // ३. जर मॅच "Live" नसेल, तरच सेटअप मोडलची तयारी सुरू करा 🛠️
//         const modal = document.getElementById('startMatchModal');
//         const tossSelect = document.getElementById('tossWinner');
//         const tabBtnA = document.getElementById('tabBtnA');
//         const tabBtnB = document.getElementById('tabBtnB');

//         if (!modal || !tossSelect) {
//             Swal.fire("Error", "Start Match Modal missing in HTML!", "error");
//             return;
//         }

//         // ४. टॉस विनरचे ऑप्शन्स भरा
//         tossSelect.innerHTML = `
//             <option value="${match.teamA}">${match.teamA}</option>
//             <option value="${match.teamB}">${match.teamB}</option>
//         `;

//         // ५. टॅब बटणांवर टीमची नावे दाखवा
//         if (tabBtnA) tabBtnA.innerText = match.teamA;
//         if (tabBtnB) tabBtnB.innerText = match.teamB;

//         // ६. १२ खेळाडूंचे इनपुट रेंडर करा
//         console.log("[UI] Rendering 12 player inputs... 👤");
//         renderPlayerInputs('playerListA', 'A');
//         renderPlayerInputs('playerListB', 'B');

//         // ७. [RESUME-DRAFT] जर लोकल स्टोरेजमध्ये काही अर्धवट भरलेला डेटा असेल तर तो भरा 📦
//         const localMatch = localStorage.getItem(`active_match_${mId}`);
//         if (localMatch) {
//             const savedData = JSON.parse(localMatch);
//             console.log("[DRAFT] Filling saved player names from draft... ✅");
//             fillSavedPlayers(savedData); 
//         }

//         // ८. मोडल उघडा
//         modal.classList.remove('hidden');
//         modal.classList.add('flex');
        
//         // ९. बाय डिफॉल्ट Team A चा टॅब उघडा ठेवा
//         switchPlayerTab('A');

//     } catch (e) {
//         console.error("[CRITICAL_ERROR] Error in startScoring: ❌", e);
//         Swal.fire("Error", "डेटा लोड करताना चूक झाली.", "error");
//     }
// }

/**अपडेटेड startScoring फंक्शन (app.js)
 * तुझ्या app.js मधील जुन्या फंक्शनच्या जागी हा कोड रिप्लेस करून घे. 
 * यामध्ये आपण डेटाबेस मधून खेळाडू शोधण्यासाठी match.teamAId आणि match.teamBId चा वापर केला आहे: 
 */
async function startScoring(tId, mId) {
    // 🔥 [FRONTEND LIVE LOG]: स्कोअरिंग मोडल उघडताच संपूर्ण आयडी पॅटर्न कन्सोलमध्ये चमकेल
    console.log("%c==================================================", "color: #f97316; font-weight: bold;");
    console.log(`%c🚀 [मॅच स्कोअरिंग सुरुवात]: 🔐 फ्युचर-प्रूफ युनिक आयडी तपासणी सुरू...`, "color: #f97316; font-weight: bold; font-size: 11px;");
    console.log(`👉 टूर्नामेंट ID : ${tId}`);
    console.log(`👉 मॅच आयडी     : ${mId}`);
    console.log("%c==================================================", "color: #f97316; font-weight: bold;");
    
    matchSetupData = { tId, mId };
    
    try {
        const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
        
        if (!mDoc.exists) {
            console.error(`🚨 [ERR]: टूर्नामेंट "${tId}" मध्ये मॅच "${mId}" चा डेटा सापडला नाही!`);
            Swal.fire("त्रुटी", "मॅचचा डेटा सापडला नाही!", "error");
            return;
        }

        const match = mDoc.data();

        // 🟢 [अल्टीमेट आयडी फिक्स]: आपण डिझाईन केलेले नवीन कडक सिस्टीम आयडी (TM_...) इथून गोळा करणे
        const idA = match.teamA_id;
        const idB = match.teamB_id;

        console.log(`%c[आयडी ट्रॅकिंग]: संघ A आयडी -> %c"${idA}" %c| संघ B आयडी -> %c"${idB}"`, 
            "color: #gray;", "color: #3b82f6; font-weight: bold;", "color: #gray;", "color: #3b82f6; font-weight: bold;");

        // जर आयडी मिळाले नाहीत, तर डेव्हलपमेंटमध्येच अलर्ट येईल जेणेकरून चूक लगेच पकडता येईल
        if (!idA || !idB || idA === "TBD" || idB === "TBD") {
            console.error("🚨 एरर: मॅच डॉक्युमेंटमध्ये अधिकृत teamA_id किंवा teamB_id (TM_...) सापडला नाही!");
            Swal.fire({
                icon: 'error',
                title: 'संघाची माहिती अपूर्ण!',
                text: 'स्कोअरिंग सुरू करण्यापूर्वी कृपया फिक्सचर सेटरमध्ये जाऊन दोन्ही संघांची निवड अचूक करा.'
            });
            return;
        }

        // जर स्टेटस आधीच "Live" असेल तर थेट स्कोअरिंग स्क्रीनला पाठवा
        if (match.status === "Live") {
            console.log("%c[REDIRECT]: मॅच आधीच लाईव्ह आहे. थेट स्कोअरिंग स्क्रीनवर पाठवत आहे... 🏁", "color: #22c55e; font-weight: bold;");
            localStorage.setItem(`active_match_${mId}`, JSON.stringify(match));
            goToScoring(tId, mId); 
            return; 
        }

        const modal = document.getElementById('startMatchModal');
        const tossSelect = document.getElementById('tossWinner');
        const tabBtnA = document.getElementById('tabBtnA');
        const tabBtnB = document.getElementById('tabBtnB');

        if (!modal || !tossSelect) {
            console.error("🚨 [UI एरर]: HTML मध्ये 'startMatchModal' किंवा 'tossWinner' एलिमेंट्स गहाळ आहेत!");
            Swal.fire("त्रुटी", "Start Match Modal एचटीएमएलमध्ये सापडले नाही!", "error");
            return;
        }

        // टॉस विनर ड्रॉपडाउनमध्ये नाव दिसेल, पण व्हॅल्यू म्हणून बॅकएंडला युनिक आयडी (TM_...) जाईल
        tossSelect.innerHTML = `
            <option value="${idA}">${match.teamA}</option>
            <option value="${idB}">${match.teamB}</option>
        `;

        if (tabBtnA) tabBtnA.innerText = match.teamA;
        if (tabBtnB) tabBtnB.innerText = match.teamB;

        // 🟢 [स्मार्ट सिलेक्टर]: थेट नवीन कडक आयडी पास करून मास्टर प्लेअर्समधून ३० खेळाडू ओढणे
        console.log(`%c👤 [UI Rendering]: मास्टर डेटाबेसमधून खेळाडू शोधत आहे...`, "color: #06b6d4;");
        console.log(`👉 टीम A (ID: ${idA}) चे खेळाडू लोड होत आहेत...`);
        await renderSmartSquadSelector('playerListA', idA, 'A');
        
        console.log(`👉 टीम B (ID: ${idB}) चे खेळाडू लोड होत आहेत...`);
        await renderSmartSquadSelector('playerListB', idB, 'B');

        // मोडल ओपन करा
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // बाय डिफॉल्ट Team A चा टॅब उघडा ठेवा
        switchPlayerTab('A');
        console.log("%c✅ [मॅच सेटअप मोडल रेडी]: युझर १२ खेळाडू निवडण्यासाठी सज्ज आहे!", "color: #22c55e; font-weight: bold;");

    } catch (e) {
        console.error("🚨 [startScoring क्रिटिकल एरर]:", e);
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

async function renderSmartSquadSelector(containerId, teamId, teamPrefix) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 🧡 ऑरेंज थीम लोडिंग टेक्स्ट
    container.innerHTML = `<p class="text-orange-500 text-[10px] text-center py-5 uppercase tracking-widest animate-pulse font-mono font-bold">डेटाबेसमधून खेळाडू शोधत आहे...</p>`;

    const currentSeason = window.currentLoadedTeamData?.season || "2026-2027";

    try {
        console.log(`%c[१. स्क्वॉड सिलेक्टर]: ID -> "${teamId}" साठी खेळाडूंचा शोध सुरू...`, "color: #f97316; font-weight: bold;");
        
        // 🟢 पायरी १: आधी नेहमीप्रमाणे थेट 'teamId' फील्ड मॅच करून खेळाडू शोधा (नवीन सिस्टीम आयडी नियम)
        let snapshot = await db.collection("master_players")
            .where(`seasons.${currentSeason}.teamId`, "==", teamId).get();

        // 🟢 पायरी २ [बॅकअप सक्रिय]: जर खेळाडू सापडले नाहीत, तर जुन्या डेटासाठी 'registerId' फील्डमध्ये शोध घ्या!
        if (snapshot.empty) {
            console.log(`%c⚠️ [बॅकअप सक्रिय]: "teamId == ${teamId}" मध्ये खेळाडू सापडले नाहीत. आता "registerId == ${teamId}" साठी शोधत आहे...`, "color: #eab308;");
            
            snapshot = await db.collection("master_players")
                .where(`seasons.${currentSeason}.registerId`, "==", teamId).get();
        }

        if (snapshot.empty) {
            console.warn(`🚨 [ERR]: संघ आयडी "${teamId}" साठी कोणत्याही फील्डमध्ये खेळाडू सापडले नाहीत!`);
            container.innerHTML = `<p class="text-orange-500 text-[10px] text-center py-5 font-bold uppercase font-mono">⚠️ या संघात (ID: ${teamId}) एकही खेळाडू नोंदणीकृत नाही!</p>`;
            return;
        }

        console.log(`%c✅ [यशस्वी]: डेटाबेसमधून एकूण ${snapshot.size} खेळाडू अचूक सापडले!`, "color: #22c55e; font-weight: bold;");

        // 🎯 [RAID X PURE ORANGE UI]: डबा उभी जागा कमी खाईल आणि पूर्णपणे मॅच होईल
        let html = `
        <div class="p-2 mb-2 bg-orange-950/20 rounded-xl border border-orange-500/10 flex items-center justify-between px-3.5 shrink-0 shadow-sm">
            <span class="text-[9px] text-orange-400 font-black uppercase tracking-tight font-mono">🎯 पायरी १: १२ खेळाडू निवडा</span>
            <div class="text-[9px] text-gray-400 font-bold font-mono">
                निवडले: <span id="count_${teamPrefix}" class="text-orange-500 font-black text-xs">0</span> <span class="text-gray-600">/ 12</span>
            </div>
        </div>
        <div class="space-y-1.5 max-h-[52vh] overflow-y-auto pr-1 custom-scrollbar">`;

        snapshot.forEach(doc => {
            const player = doc.data();
            const pId = doc.id; // खेळाडूचा सिस्टीम आयडी (उदा. RXO0QN)

            html += `
            <label class="flex justify-between items-center bg-[#0d0d0d] p-3 rounded-xl border border-gray-900 hover:border-gray-800 cursor-pointer transition-all gap-2 group">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                    <input type="checkbox" name="squad_check_${teamPrefix}" value="${pId}" data-name="${player.name}"
                        onchange="handleSquadSelection('${teamPrefix}')"
                        class="w-4 h-4 rounded bg-gray-950 border-gray-800 text-orange-600 focus:ring-0 accent-orange-500 cursor-pointer">
                    <div class="leading-tight truncate">
                        <p class="text-xs font-bold text-gray-200 uppercase truncate group-hover:text-orange-400 transition-colors">${player.name}</p>
                        <p class="text-[8px] text-gray-500 font-mono font-bold mt-0.5 tracking-tight">🔑 ID: ${pId} | 📞 ${player.mobile || '------'} | 🛡️ ${player.skill || 'NA'}</p>
                    </div>
                </div>
            </label>`;
        });

        html += `</div>
        <div id="playingDecisionContainer_${teamPrefix}" class="mt-4 hidden space-y-2 border-t border-gray-900 pt-3">
        </div>`;

        container.innerHTML = html;

    } catch (err) {
        console.error("🚨 [सिएक्वेक्टर क्रिटिकल एरर]: खेळाडू लोड करताना अडचण आली:", err);
        container.innerHTML = `<p class="text-red-500 text-[10px] text-center py-5 font-mono">खेळाडू लोड करताना एरर आला.</p>`;
    }
}


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



function closeStartMatchModal() {
    document.getElementById('startMatchModal').classList.add('hidden');
}

// async function confirmStartMatch() {
//     console.log("--- [START_MATCH_PROCESS] Final Validation Initiated ---");
//     const { tId, mId } = matchSetupData;

//     // १. 'Playing' खेळाडूंची संख्या मोजा (Strict Exactly 7 Check)
//     const countA = document.querySelectorAll('.player-check-A:checked').length;
//     const countB = document.querySelectorAll('.player-check-B:checked').length;

//     console.log(`[VALIDATION] Team A: ${countA}/7 | Team B: ${countB}/7`);

//     if (countA !== 7 || countB !== 7) {
//         console.warn(`[DENIED] Match blocked. Improper player count.`);
//         Swal.fire({
//             title: "खेळाडू अपूर्ण आहेत!",
//             text: `मॅच सुरू करण्यासाठी प्रत्येक टीममध्ये ७ खेळाडू निवडणे अनिवार्य आहे. (सध्या: Team A: ${countA}, Team B: ${countB})`,
//             icon: "error",
//             background: '#111',
//             color: '#fff'
//         });
//         return; 
//     }

//     // २. जर ७-७ खेळाडू असतील तरच डेटा गोळा करा
//     console.log("[PROCEED] Validation successful. Collecting players data...");
//     const playersA = getPlayersData('A');
//     const playersB = getPlayersData('B');

//     const tossWinner = document.getElementById('tossWinner').value;
//     const selection = document.getElementById('tossSelection').value;

//     try {
//         const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
//         const match = mDoc.data();
        
//         // [IMPORTANT]: इकडे आपण localStorage मध्ये नावे साठवत आहोत
//         // यामुळे scoring.html ला समजेल की नक्की कोणत्या टीम खेळत आहेत.
//         localStorage.setItem('currentTeamA', match.teamA);
//         localStorage.setItem('currentTeamB', match.teamB);

//         let firstRaidBy = (selection === "Raid") ? tossWinner : (tossWinner === match.teamA ? match.teamB : match.teamA);

//         const updateData = {
//             status: "Live",
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
//             matchLog: []
//         };

//         console.log("[DATABASE] Updating Firestore with match data...");
//         await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update(updateData);
        
//         console.log("--- [MATCH_LIVE] Setup Complete! ---");
//         closeStartMatchModal();
        
//         Swal.fire({
//             title: "Match Live!",
//             text: "स्कोअरिंग विंडो उघडत आहे...",
//             icon: "success",
//             timer: 1500,
//             showConfirmButton: false
//         });

//         goToScoring(tId, mId);

//     } catch (e) {
//         console.error("[CRITICAL_ERROR] Failed to start match:", e);
//         Swal.fire("Error", "डेटा अपडेट करताना तांत्रिक अडचण आली.", "error");
//     }
//     if (typeof updateVisualPlayers === "function") updateVisualPlayers();
// }


async function confirmStartMatch() {
    console.log("--- [START_MATCH_PROCESS] Final Validation Initiated --- 🚀");
    const { tId, mId } = matchSetupData;

    // १. [DATA COLLECTION] आधी सर्व १२ खेळाडूंचा डेटा मिळवा (getPlayersData मधून) 🚀
    // हे फंक्शन आपण मगाशी अपडेट केले आहे जेणेकरून रिकामी नावे पकडता येतील.
    const playersA = getPlayersData('A'); 
    const playersB = getPlayersData('B');

    // २. [STRICT NAME VALIDATION] १२ खेळाडूंची नावे भरली आहेत का ते तपासा 🚀
    // जर एक जरी नाव रिकामं असेल (name === ""), तर hasEmpty true होईल.
    const hasEmptyA = playersA.some(p => p.name === "");
    const hasEmptyB = playersB.some(p => p.name === "");

    if (hasEmptyA || hasEmptyB) {
        console.warn("[DENIED] Match blocked. Real player names are missing. ❌");
        Swal.fire({
            title: "नावे अनिवार्य आहेत!",
            text: "सर्व १२ खेळाडूंची खरी नावे भरणे आवश्यक आहे. डिफॉल्ट नावे चालणार नाहीत.",
            icon: "error",
            background: '#111',
            color: '#fff'
        });
        return; // नाव नसेल तर प्रोसेस इथेच थांबवा
    }

    // ३. [STRICT COUNT VALIDATION] 'Playing' खेळाडूंची संख्या मोजा (Exactly 7 Check) 🚀
    const countA = playersA.filter(p => p.playingStatus === "Playing").length;
    const countB = playersB.filter(p => p.playingStatus === "Playing").length;

    console.log(`[VALIDATION] Names OK. Playing Count - Team A: ${countA}/7 | Team B: ${countB}/7 ✅`);

    if (countA !== 7 || countB !== 7) {
        console.warn("[DENIED] Match blocked. Improper playing count. ❌");
        Swal.fire({
            title: "खेळाडू निवड चुकली!",
            text: `मॅच सुरू करण्यासाठी प्रत्येक टीममध्ये नक्की ७ खेळाडू 'Playing' असणे अनिवार्य आहे. (सध्या: Team A: ${countA}, Team B: ${countB})`,
            icon: "error",
            background: '#111',
            color: '#fff'
        });
        return; // ७ खेळाडू नसतील तर पुढे जाऊ नका
    }

    // ४. [PROCEED] सर्व व्हॅलिडेशन झाले, आता डेटा गोळा करा ✅
    const tossWinner = document.getElementById('tossWinner').value;
    const selection = document.getElementById('tossSelection').value;

    try {
        console.log("[DATABASE] Fetching match details... ☁️");
        const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
        const match = mDoc.data();
        
        // पहिल्या रेडरचे लॉजिक
        let firstRaidBy = (selection === "Raid") ? tossWinner : (tossWinner === match.teamA ? match.teamB : match.teamA);

        // ५. [HYBRID-DATA] पूर्ण मॅच ऑब्जेक्ट तयार करा (Status "Live") 🚀
        const updateData = {
            tId: tId,
            mId: mId,
            teamAName: match.teamA,
            teamBName: match.teamB,
            status: "Live", // आता स्टेटस लाईव्ह झाला, इथून बॅक येता येणार नाही
            tossWinner: tossWinner,
            tossSelection: selection,
            firstRaidBy: firstRaidBy,
            currentRaider: firstRaidBy,
            teamAPlayers: playersA, // १२ खरी नावे (Playing/Bench)
            teamBPlayers: playersB, // १२ खरी नावे
            scoreA: 0,
            scoreB: 0,
            timeoutsA: 0,
            timeoutsB: 0,
            matchLog: [],
            lastUpdated: new Date().getTime()
        };

        // ६. [HYBRID-SAVE] LocalStorage मध्ये स्नॅपशॉट सेव्ह करा 📦
        console.log("[HYBRID-LOCAL] Saving to LocalStorage for safety... ✅");
        localStorage.setItem(`active_match_${mId}`, JSON.stringify(updateData));
        
        // ७. [HYBRID-SAVE] Firestore मध्ये सिंक करा ☁️
        console.log("[HYBRID-CLOUD] Syncing to Firestore... ✅");
        await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update(updateData);
        
        console.log("--- [MATCH_LIVE] Status: Live. Setup Locked. 🚀 ---");
        
        closeStartMatchModal();
        
        Swal.fire({
            title: "Match Live!",
            text: "१२ खेळाडूंची नावे नोंदवली आहेत. मॅच सुरू होत आहे!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });

        // ८. स्कोअरिंग स्क्रीनवर रिडायरेक्ट करा
        console.log(`[REDIRECT] Moving to scoring window... 🏁`);
        goToScoring(tId, mId);

    } catch (e) {
        console.error("[CRITICAL_ERROR] Setup failed: ❌", e);
        Swal.fire("Error", "डेटा अपडेट करताना तांत्रिक अडचण आली.", "error");
    }
}


// function getPlayersData(prefix) {
//     console.log(`--- [DATA_COLLECTION] Starting for Team: ${prefix} ---`);
//     let data = [];
    
//     for (let i = 1; i <= 12; i++) {
//         const noVal = document.getElementById(`${prefix}P${i}_no`).value;
//         const nameVal = document.getElementById(`${prefix}P${i}_name`).value;
//         const isChecked = document.getElementById(`${prefix}P${i}_check`).checked;

//         // १. प्रत्येक प्लेयरचा ऑब्जेक्ट तयार करा
//         const playerObj = {
//             no: noVal || (prefix === 'A' ? i : i + 20),
//             name: nameVal || `Player ${noVal || i}`,
//             // आपण ठरवल्याप्रमाणे 'Playing' आणि 'Bench' हे शब्द वापरूया
//             playingStatus: isChecked ? "Playing" : "Bench", 
//             // कोर्टातील स्थिती
//             status: isChecked ? "In" : "Out",
//             outTime: null
//         };

//         data.push(playerObj);
//     }

//     // २. व्हेरिफिकेशनसाठी कन्सोल लॉग्स
//     const playingCount = data.filter(p => p.playingStatus === "Playing").length;
//     const benchCount = data.filter(p => p.playingStatus === "Bench").length;
    
//     console.log(`[SUMMARY] Team ${prefix}: ${playingCount} Playing, ${benchCount} Bench.`);
    
//     // पूर्ण डेटा टेबल फॉरमॅटमध्ये बघण्यासाठी (डेव्हलपमेंटसाठी खूप सोपं पडतं)
//     console.table(data); 

//     return data;
// }


function getPlayersData(prefix) {
    console.log(`--- [DATA_COLLECTION] Starting for Team: ${prefix} --- 🚀`);
    let data = [];
    
    for (let i = 1; i <= 12; i++) {
        const noVal = document.getElementById(`${prefix}P${i}_no`).value.trim();
        const nameVal = document.getElementById(`${prefix}P${i}_name`).value.trim();
        const isChecked = document.getElementById(`${prefix}P${i}_check`).checked;

        // १. प्रत्येक प्लेयरचा ऑब्जेक्ट तयार करा
        const playerObj = {
            no: noVal, // आता इथे डिफॉल्ट नंबर देणार नाही, युजरने टाकला तरच येईल
            // [STRICT] जर नाव नसेल तर फक्त रिकामी स्ट्रिंग ठेवा, "Player X" असं नका करू 🚀
            name: nameVal, 
            playingStatus: isChecked ? "Playing" : "Bench", 
            status: isChecked ? "In" : "Out",
            outTime: null,
            stats: { raids: 0, tackles: 0, points: 0 } // भविष्यासाठी आकडेवारी जोडली
        };

        data.push(playerObj);
    }

    // २. व्हेरिफिकेशनसाठी कन्सोल लॉग्स
    const playingCount = data.filter(p => p.playingStatus === "Playing").length;
    console.log(`[SUMMARY] Team ${prefix}: ${playingCount}/7 Playing Checked. ✅`);
    
    return data;
}

/** Edit Tournaments */
let currentEditId = null; // सध्या कोणती टूर्नामेंट एडिट होत आहे त्याचा आयडी

// async function editTournament(id) {
//   try {
//     const doc = await db.collection("tournaments").doc(id).get();
//     if (!doc.exists) return;

//     const t = doc.data();
//     currentEditId = id; // आयडी स्टोअर करा

//     // फॉर्ममध्ये डेटा भरणे [cite: 352, 358]
//     document.getElementById('tName').value = t.name;
//     document.getElementById('tOrganizer').value = t.organizer;
//     document.getElementById('tSeason').value = t.season;
//     document.getElementById('tLevel').value = t.level;
//     handleLevelChange(); // असोसिएशन फिल्ड दाखवण्यासाठी
//     document.getElementById('tAssociation').value = t.association;
//     document.getElementById('tSurface').value = t.surface;
//     document.getElementById('tType').value = t.type;
//     document.getElementById('tCategory').value = t.category;
//     document.getElementById('tGroup').value = t.group;
//     document.getElementById('tFormat').value = t.format;
//     document.getElementById('tLimit').value = t.teamLimit;
//     document.getElementById('tStartDate').value = t.startDate || "";
//     document.getElementById('tEndDate').value = t.endDate || "";
    
//     // टीम्स रिस्टोअर करणे
//     tournamentTeams = t.teams || [];
//     updateSelectedTeamsUI();

//     // मॉडेल ओपन करा
//     openTournamentModal();

//     // सेव्ह बटणाचे नाव बदला (Optional)
//     const saveBtn = document.querySelector("#tournamentModal button[onclick='createTournament()']");
//     if(saveBtn) {
//         saveBtn.innerText = "Update Tournament";
//         saveBtn.setAttribute("onclick", `updateTournament()`);
//     }

//   } catch (error) {
//     Swal.fire("Error", "डेटा मिळवता आला नाही", "error");
//   }
// }

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

// async function openMatchSetter(tId, mId) {
//   console.log("उघडत आहे मॅच सेटर:", tId, mId);
//   currentEditingMatch = { tId, mId };

//   const modal = document.getElementById('matchSetterModal');
//   const selA = document.getElementById('mTeamA');
//   const selB = document.getElementById('mTeamB');
//   const inpDate = document.getElementById('mDate');
//   const inpTime = document.getElementById('mTime');

//   if (!modal || !selA || !selB) {
//     Swal.fire("Error", "HTML मध्ये पॉपअप कोड सापडला नाही.", "error");
//     return;
//   }

//   try {
//     // १. टूर्नामेंटचा डेटा आणि मॅचचा सध्याचा डेटा मिळवा
//     const tDoc = await db.collection("tournaments").doc(tId).get();
//     const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
    
//     // टूर्नामेंटमधील संघ यादी (आता हा थेट नावांचा ॲरे आहे)
//     const teams = tDoc.data().teams || [];
//     const currentMatch = mDoc.exists ? mDoc.data() : {};

//     console.log("[Match Setter]: Loaded Tournament Teams ->", teams);

//     // २. ड्रॉपडाउन पर्याय तयार करणे
//     let options = `
//       <option value="TBD">निवडा (Select Team)</option>
//       <option value="BYE">BYE (पुढच्या फेरीसाठी पात्र)</option>
//     `;

//     // 🔥 बदल इथे केला आहे: 't' स्वतःच संघाचे नाव (String) आहे, त्यामुळे थेट 't' वापरा!
//     teams.forEach(t => {
//       if (t) { // सुरक्षिततेसाठी चेक
//         options += `<option value="${t}">${t}</option>`;
//       }
//     });

//     selA.innerHTML = options;
//     selB.innerHTML = options;

//     // ३. पॉपअप उघडताना जुना डेटा सेट करा
//     selA.value = currentMatch.teamA || "TBD";
//     selB.value = currentMatch.teamB || "TBD";
//     if (inpDate) inpDate.value = currentMatch.matchDate || "";
//     if (inpTime) inpTime.value = currentMatch.matchTime || "";

//     // ४. पॉपअप दाखवा
//     modal.classList.remove('hidden');
//     modal.classList.add('flex');
    
//   } catch (err) {
//     console.error("Teams Load Error:", err);
//     Swal.fire("Error", "डेटा लोड करताना चूक झाली.", "error");
//   }
// }

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
// async function saveMatchDetails() {
//   if (!currentEditingMatch) return;
//   const { tId, mId } = currentEditingMatch;

//   const teamA = document.getElementById('mTeamA').value;
//   const teamB = document.getElementById('mTeamB').value;
//   const matchDate = document.getElementById('mDate').value;
//   const matchTime = document.getElementById('mTime').value;

//   // १. एकाच टीमची मॅच स्वतःसोबत लागण्यापासून रोखणे
//   // (TBD किंवा BYE सोडून इतर टीम्ससाठी हा नियम लागू होईल)
//   if (teamA !== "TBD" && teamA !== "BYE" && teamA === teamB) {
//     Swal.fire({
//       icon: 'error',
//       title: 'चूक!',
//       text: 'एकच संघ स्वतःविरुद्ध खेळू शकत नाही. कृपया वेगळा संघ निवडा.',
//       confirmButtonColor: '#d33'
//     });
//     return;
//   }

//   const data = {
//     teamA: teamA,
//     teamB: teamB,
//     matchDate: matchDate,
//     matchTime: matchTime
//   };

//   try {
//     await db.collection("tournaments").doc(tId).collection("matches").doc(mId).update(data);
    
//     closeMatchSetter();
//     Swal.fire({
//       title: "यशस्वी!",
//       text: "मॅच यशस्वीरीत्या अपडेट झाली आहे.",
//       icon: "success",
//       timer: 1500,
//       showConfirmButton: false
//     });
    
//     // फिक्स्चर टॅब रिफ्रेश करा
//     renderFixturesTab(tId); 
//   } catch (error) {
//     console.error("Update Error:", error);
//     Swal.fire("Error", "डेटा अपडेट करताना तांत्रिक अडचण आली.", "error");
//   }
// }

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


// async function goToScoring(tId, mId) {
//     console.log("--- [NAV] Loading Original Scoring Logic ---");
//     await loadPage('scoring'); 

//     try {
//         const mDoc = await db.collection("tournaments").doc(tId).collection("matches").doc(mId).get();
//         const match = mDoc.data();
        
//         // १. तुझा जुना मूळ डेटा सेट
//         currentMatchData = match;

//         localStorage.setItem('currentTeamA', match.teamA);
//         localStorage.setItem('currentTeamB', match.teamB);
        
//         setupLiveMatchNames();

//         teamAPlayers = match.teamAPlayers || [];
//         teamBPlayers = match.teamBPlayers || [];

//         if(document.getElementById('scoreA')) document.getElementById('scoreA').innerText = match.scoreA || 0;
//         if(document.getElementById('scoreB')) document.getElementById('scoreB').innerText = match.scoreB || 0;

//         // २. तुझे मूळ रेंडरिंग फंक्शन (जसे होते तसेच)
//         renderMiniPlayers();
        
//         // ३. फक्त नवीन UI साठी (काहीही बिघडणार नाही)
//         if (typeof updateTimeoutUI === "function") updateTimeoutUI();

//         console.log("Scoring Screen Ready for:", match.teamA, "vs", match.teamB);

//     } catch (e) {
//         console.error("Error loading scoring data:", e);
//     }
// }

async function goToScoring(tId, mId) {
    console.log("--- [NAV] Loading Original Scoring Logic --- 🚀");
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
        // 🛠️ [LOCKING LOGIC] - मॅच सुरू होण्यापूर्वी बटणे लॉक करणे 🚀
        // ---------------------------------------------------------
        // १. तुझ्या स्कोअरिंग बटणांचा मुख्य कंटेनर (उदा. जिथे बोनस, टच पॉईंट बटणे आहेत)
        const scoringArea = document.getElementById('scoringButtonsContainer'); 
        
        // २. तुझं मूळ "Start Match" बटण
        const mainBtn = document.getElementById('mainMatchBtn'); 

        // ३. रिलोड झाल्यावर किंवा पहिल्यांदा येताना टायमरची स्थिती तपासा
        // आपण localStorage मधून टायमरची वेळ तपासू शकतो
        const savedTime = localStorage.getItem('savedMatchTime');
        
        // जर मॅच अजून 'Pause' मोडमध्ये असेल आणि वेळ अजून खर्च झाली नसेल
        if (!match.isMatchRunning && (!savedTime || savedTime == 1200)) { 
            console.log("[LOCK] Initial State: Controls Locked. Click 'Start Match' 🔒");
            
            if (scoringArea) {
                scoringArea.style.pointerEvents = "none";
                scoringArea.style.opacity = "0.4";
            }
            
            if (mainBtn) {
                mainBtn.innerText = "START MATCH";
                mainBtn.classList.add('bg-gray-800'); // मूळ कलर
            }
        } else {
            // जर मॅच आधीच सुरू झाली असेल (Reload Case)
            console.log("[UNLOCK] Resuming Match: Controls Unlocked. 🏃‍♂️");
            
            if (scoringArea) {
                scoringArea.style.pointerEvents = "auto";
                scoringArea.style.opacity = "1";
            }
            
            if (mainBtn) {
                // रिलोड झाल्यावर बटणाचं नाव 'PAUSE' ठेवा कारण मॅच सुरू आहे असं आपण समजू
                mainBtn.innerText = "PAUSE MATCH";
                mainBtn.classList.add('bg-red-600');
            }

            // नेव्हिगेशन लॉक करा जेणेकरून रिलोड झाल्यावरही युजर बाहेर जाऊ शकणार नाही
            if (typeof lockUserOnScoringPage === "function") lockUserOnScoringPage(true);
        }
        // ---------------------------------------------------------

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
// function toggleMatchTimer() {
//     const btn = document.getElementById('mainMatchBtn'); 
    
//     // १. सर्वात आधी जुना कोणताही इंटरव्हल असेल तर तो थांबवा (Safety Check)
//     clearInterval(matchInterval);

//     if (isMatchPaused) {
//         // २. मॅच सुरू/रिझ्युम करा
//         isMatchPaused = false;
//         if (btn) {
//             btn.innerText = "PAUSE MATCH";
//             btn.classList.replace('bg-green-600', 'bg-red-600'); // कलर पण बदलू शकतोस
//         }

//         matchInterval = setInterval(() => {
//             if (matchTotalSeconds > 0) {
//                 matchTotalSeconds--;
//                 updateMatchUI();
//                 localStorage.setItem('savedMatchTime', matchTotalSeconds);
//             } else {
//                 clearInterval(matchInterval); // वेळ संपल्यावर थांबवा
//                 handleMatchTimeEnd();
//             }
//         }, 1000);
//     } else {
//         // ३. मॅच पॉज करा
//         isMatchPaused = true;
//         if (btn) {
//             btn.innerText = "RESUME MATCH";
//             btn.classList.replace('bg-red-600', 'bg-green-600');
//         }
//         // clearInterval आपण वरच (Line 5) केला आहे, तरी इथे राहू दे.
//         clearInterval(matchInterval);
//     }
// }

/**अपडेटेड toggleMatchTimer (Locking सह) 🚀
यामध्ये मी तुझे मूळ लॉजिक तसेच ठेवले आहे, फक्त बटण अनलॉक करण्याचे आणि नेव्हिगेशन लॉक करण्याचे काम वाढवले आहे.
 */
function toggleMatchTimer() {
    const btn = document.getElementById('mainMatchBtn'); 
    const scoringArea = document.getElementById('scoringButtonsContainer'); // तुझ्या बटणांच्या कंटेनरचा ID

    clearInterval(matchInterval);

    if (isMatchPaused) {
        // --- [NEW] मॅच पहिल्यांदा सुरू होत असेल तर अनलॉक करा 🚀 ---
        isMatchPaused = false;
        
        // १. स्कोअरिंग बटणे अनलॉक करा (जर लॉक असतील तर)
        if (scoringArea) {
            scoringArea.style.pointerEvents = "auto";
            scoringArea.style.opacity = "1";
        }

        // २. नेव्हिगेशन लॉक करा (मॅच सोडून जाता येऊ नये)
        lockUserOnScoringPage(true); 

        if (btn) {
            btn.innerText = "PAUSE MATCH";
            btn.classList.remove('bg-gray-800'); // जुना कलर काढून रेड करा
            btn.classList.add('bg-red-600');
        }

        matchInterval = setInterval(() => {
            if (matchTotalSeconds > 0) {
                matchTotalSeconds--;
                updateMatchUI();
                localStorage.setItem('savedMatchTime', matchTotalSeconds);
                
                // [NEW-HYBRID] प्रत्येक सेकंदाला नको, पण ठराविक वेळी Firebase सिंक करू शकतोस
            } else {
                clearInterval(matchInterval);
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
        clearInterval(matchInterval);
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
// async function viewTeamPlayers(teamId, tId) {
//     console.log(`[Team Profile]: 🚀 Adjusting hero details into Top Header Row...`);
//     currentViewingTeamId = teamId;
//     currentViewingTournamentId = tId;

//     const content = document.getElementById('mainContent') || document.getElementById('tabContent'); 
//     if (!content) return;

//     // १. सुरुवातीला साचा रेंडर करा (लोडिंग स्टेटसह)
//     content.innerHTML = `
//     <div class="space-y-4 animate-fadeIn pb-12 px-2 min-h-screen bg-black text-white absolute inset-0 z-[120] p-4 overflow-y-auto">

//         <div class="flex items-center justify-between p-2.5 bg-[#111] border border-gray-800/80 shadow-lg rounded-2xl mt-2 gap-2">
//             <div class="flex items-center gap-3 min-w-0 flex-1">
//                 <button onclick="exitTeamProfileAndReturn('${tId}')" class="text-orange-500 hover:bg-orange-500/10 p-1.5 rounded-full transition-all active:scale-75 shrink-0">
//                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                     </svg>
//                 </button>
                
//                 <div id="profHeaderLogo" class="w-9 h-9 bg-gray-950 rounded-full border border-orange-500/30 flex items-center justify-center p-0.5 shrink-0 shadow-inner">
//                     <div class="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//                 </div>
                
//                 <div class="min-w-0 flex-1 leading-tight">
//                     <h2 id="profTeamNameHeader" class="text-sm font-black text-white uppercase tracking-tighter italic truncate">Loading...</h2>
//                     <p id="profTeamAreaHeader" class="text-[8px] text-gray-500 uppercase font-bold tracking-wider truncate mt-0.5">📍 Loading...</p>
//                 </div>
//             </div>

//             <div id="profTeamFormHeader" class="flex gap-0.5 shrink-0 bg-gray-950/80 p-1 rounded-lg border border-gray-900"></div>
//         </div>

//         <div class="px-1 sticky top-0 z-20 bg-black/80 backdrop-blur-md py-1">
//             <div class="flex bg-[#111] p-1 rounded-2xl border border-gray-800 shadow-inner overflow-x-auto gap-1">
//                 <button id="btnTeamTabOverview" onclick="switchTeamProfileTab('overview')" class="flex-1 py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all duration-200 text-gray-500 whitespace-nowrap">
//                     Overview
//                 </button>
//                 <button id="btnTeamTabPlayers" onclick="switchTeamProfileTab('players')" class="flex-1 py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all duration-200 text-gray-500 whitespace-nowrap">
//                     Players
//                 </button> 
//                 <button id="btnTeamTabMatches" onclick="switchTeamProfileTab('matches')" class="flex-1 py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all duration-200 text-gray-500 whitespace-nowrap">
//                     Matches
//                 </button>
//                 <button id="btnTeamTabStats" onclick="switchTeamProfileTab('stats')" class="flex-1 py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all duration-200 text-gray-500 whitespace-nowrap">
//                     Statistics
//                 </button>
//             </div>
//         </div>

//         <div id="teamProfileTabContent" class="min-h-[450px] py-1"></div>

//     </div>
//     `;

//     try {
//         const teamDoc = await db.collection("master_teams").doc(teamId).get();
//         if (!teamDoc.exists) {
//             document.getElementById('teamProfileTabContent').innerHTML = "<p class='text-gray-500 text-xs text-center py-10'>माहिती सापडली नाही.</p>";
//             return;
//         }

//         const teamData = teamDoc.data();
//         window.currentLoadedTeamData = teamData; // ओव्हरव्ह्यूसाठी डेटा सेव्ह केला

//         // 🟢 टॉप हेडरमध्ये डेटा भरणे
//         document.getElementById('profTeamNameHeader').innerText = teamData.teamName || "No Name";
//         document.getElementById('profTeamAreaHeader').innerText = `📍 ${teamData.area || 'N/A'} | ${teamData.pincode || '------'}`;

//         // कॉम्पॅक्ट लोगो सेट करणे
//         const logoDiv = document.getElementById('profHeaderLogo');
//         if (teamData.teamLogo) {
//             logoDiv.innerHTML = `<img src="${teamData.teamLogo}" class="w-full h-full object-contain rounded-full">`;
//         } else {
//             const firstLetter = teamData.teamName ? teamData.teamName.charAt(0).toUpperCase() : "?";
//             logoHTML = `<span class="text-orange-500 font-black text-xs font-mono italic">${firstLetter}</span>`;
//             logoDiv.innerHTML = logoHTML;
//         }

//         // कॉम्पॅक्ट फॉर्म बॅजेस (W/L) सेट करणे
//         const sampleForm = ['W', 'L', 'L', 'W', 'W']; 
//         document.getElementById('profTeamFormHeader').innerHTML = sampleForm.map(res => `
//             <span class="${res === 'W' ? 'text-green-500' : 'text-red-500'} text-[8px] font-black font-mono px-0.5">${res}</span>
//         `).join('');

//         // डीफॉल्ट पहिला टॅब 'overview' उघडा
//         switchTeamProfileTab('overview');

//     } catch (error) {
//         console.error("[Fatal Error in viewTeamPlayers]:", error);
//     }
// }

// async function viewTeamPlayers(teamId, tId) {
//     console.log("%c========================================", "color: #f97316; font-weight: bold;");
//     if (!tId || tId === "") {
//         console.log(`%c[Team Profile Routing]: 📂 Route opened from OUTSIDE (Team Master List)`, "color: #3b82f6; font-weight: bold;");
//     } else {
//         console.log(`%c[Team Profile Routing]: 🏆 Route opened from INSIDE Tournament (ID: ${tId})`, "color: #a855f7; font-weight: bold;");
//     }
//     console.log(`[Team Profile Target]: Team Firestore Doc ID -> ${teamId}`);
//     console.log("%c========================================", "color: #f97316; font-weight: bold;");

//     currentViewingTeamId = teamId;
//     currentViewingTournamentId = tId;

//     // ⚡ फिक्स: स्क्रीन ओव्हरलॅपिंग टाळण्यासाठी आपण थेट 'body' किंवा मुख्य 'app' रूट कंटेनर पकडू
//     const content = document.getElementById('mainContent') || document.getElementById('app') || document.body; 
//     if (!content) return;

//     // १. जुना प्रोफाईल ओव्हरले आधीच चालू असेल तर तो उडवून टाकू (डुप्लिकेशन रोखण्यासाठी)
//     const oldOverlay = document.getElementById('fullTeamProfileOverlay');
//     if (oldOverlay) oldOverlay.remove();

//     // २. नवीन स्वतंत्र फुल स्क्रीन डबा (Overlay) तयार करा
//     const profileOverlay = document.createElement('div');
//     profileOverlay.id = 'fullTeamProfileOverlay';
    
//     // 🚀 CSS MAGIC: 'fixed inset-0 z-[150]' मुळे हा डबा आता मोबाईल स्क्रीनवर कशाच्याही मागे लपणार नाही!
//     profileOverlay.className = "fixed inset-0 z-[150] p-4 bg-black text-white overflow-y-auto space-y-4 pb-12 animate-fadeIn";

//     profileOverlay.innerHTML = `
//         <div class="flex items-center justify-between p-2.5 bg-[#111] border border-gray-800/80 shadow-lg rounded-2xl mt-2 gap-2">
//             <div class="flex items-center gap-3 min-w-0 flex-1">
//                 <button onclick="closeTeamProfileOverlay('${tId}')" class="text-orange-500 hover:bg-orange-500/10 p-1.5 rounded-full transition-all active:scale-75 shrink-0">
//                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                     </svg>
//                 </button>
                
//                 <div id="profHeaderLogo" class="w-9 h-9 bg-gray-950 rounded-full border border-orange-500/30 flex items-center justify-center p-0.5 shrink-0 shadow-inner">
//                     <div class="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//                 </div>
                
//                 <div class="min-w-0 flex-1 leading-tight">
//                     <h2 id="profTeamNameHeader" class="text-sm font-black text-white uppercase tracking-tighter italic truncate">Loading...</h2>
//                     <p id="profTeamAreaHeader" class="text-[8px] text-gray-500 uppercase font-bold tracking-wider truncate mt-0.5">📍 Loading...</p>
//                 </div>
//             </div>

//             <div id="profTeamFormHeader" class="flex gap-0.5 shrink-0 bg-gray-950/80 p-1 rounded-lg border border-gray-900"></div>
//         </div>

//         <div class="px-1 sticky top-0 z-20 bg-black/80 backdrop-blur-md py-1">
//             <div class="flex bg-[#111] p-1 rounded-2xl border border-gray-800 shadow-inner overflow-x-auto gap-1">
//                 <button id="btnTeamTabOverview" onclick="switchTeamProfileTab('overview')" class="flex-1 py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all duration-200 text-gray-500 whitespace-nowrap">
//                     Overview
//                 </button>
//                 <button id="btnTeamTabPlayers" onclick="switchTeamProfileTab('players')" class="flex-1 py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all duration-200 text-gray-500 whitespace-nowrap">
//                     Players
//                 </button> 
//                 <button id="btnTeamTabMatches" onclick="switchTeamProfileTab('matches')" class="flex-1 py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all duration-200 text-gray-500 whitespace-nowrap">
//                     Matches
//                 </button>
//                 <button id="btnTeamTabStats" onclick="switchTeamProfileTab('stats')" class="flex-1 py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all duration-200 text-gray-500 whitespace-nowrap">
//                     Statistics
//                 </button>
//             </div>
//         </div>

//         <div id="teamProfileTabContent" class="min-h-[450px] py-1">
//             <div class="flex justify-center py-20 text-orange-500 text-[10px] font-black uppercase tracking-widest animate-pulse">डेटा लोड होत आहे...</div>
//         </div>
//     `;

//     // 🚀 स्क्रीनवर ओव्हरले डोक्यावर फेका
//     content.appendChild(profileOverlay);

//     try {
//         const teamDoc = await db.collection("master_teams").doc(teamId).get();
//         if (!teamDoc.exists) {
//             document.getElementById('teamProfileTabContent').innerHTML = "<p class='text-gray-500 text-xs text-center py-10'>माहिती सापडली नाही.</p>";
//             return;
//         }

//         const teamData = teamDoc.data();
//         window.currentLoadedTeamData = teamData; // ओव्हरव्ह्यूसाठी डेटा सेव्ह केला

//         // टॉप हेडरमध्ये डेटा भरणे
//         document.getElementById('profTeamNameHeader').innerText = teamData.teamName || "No Name";
//         document.getElementById('profTeamAreaHeader').innerText = `📍 ${teamData.area || 'N/A'} | ${teamData.pincode || '------'}`;

//         // लोगो सेट करणे
//         const logoDiv = document.getElementById('profHeaderLogo');
//         if (teamData.teamLogo) {
//             logoDiv.innerHTML = `<img src="${teamData.teamLogo}" class="w-full h-full object-contain rounded-full">`;
//         } else {
//             const firstLetter = teamData.teamName ? teamData.teamName.charAt(0).toUpperCase() : "?";
//             logoDiv.innerHTML = `<span class="text-orange-500 font-black text-xs font-mono italic">${firstLetter}</span>`;
//         }

//         // फॉर्म बॅजेस (W/L)
//         const sampleForm = ['W', 'L', 'L', 'W', 'W']; 
//         document.getElementById('profTeamFormHeader').innerHTML = sampleForm.map(res => `
//             <span class="${res === 'W' ? 'text-green-500' : 'text-red-500'} text-[8px] font-black font-mono px-0.5">${res}</span>
//         `).join('');

//         // डीफॉल्ट पहिला टॅब 'overview' उघडा
//         switchTeamProfileTab('overview');

//     } catch (error) {
//         console.error("[Fatal Error in viewTeamPlayers]:", error);
//     }
// }

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

// function renderTeamPlayersTab() {
//     const subContent = document.getElementById('teamProfileTabContent');
    
//     // सॅम्पल लिस्ट (भविष्यात तुझ्या 'players' सब-कलेक्शन किंवा ॲरेमधून लूप होईल)
//     const samplePlayers = [
//         { name: "Milind Aeer", role: "Rider", matches: 21, points: 104 },
//         { name: "Amod Parab", role: "Defender", matches: 18, points: 52 },
//         { name: "Aranav Jadhav", role: "All Rounder", matches: 20, points: 88 }
//     ];

//     let playersHTML = `
//     <div class="space-y-2 animate-fadeIn">
//         <div class="flex justify-between items-center mb-2 px-1">
//             <p class="text-[9px] text-gray-500 uppercase font-black tracking-widest">खेळाडू यादी (Squad)</p>
//             <button class="bg-orange-600/10 text-orange-500 border border-orange-500/20 px-2 py-1 rounded-lg text-[9px] font-black uppercase">+ Add Player</button>
//         </div>`;

//     samplePlayers.forEach(p => {
//         playersHTML += `
//         <div class="bg-[#111] p-3 rounded-xl border border-gray-800 flex justify-between items-center shadow-md">
//             <div class="flex items-center gap-3">
//                 <div class="w-8 h-8 bg-gray-900 rounded-full border border-gray-800 flex items-center justify-center text-xs font-black text-gray-500 uppercase">${p.name.charAt(0)}</div>
//                 <div>
//                     <p class="text-xs font-black text-white uppercase tracking-tighter leading-tight">${p.name}</p>
//                     <p class="text-[8px] text-gray-500 uppercase font-bold tracking-wide">${p.role}</p>
//                 </div>
//             </div>
//             <div class="text-right font-mono">
//                 <p class="text-[10px] text-white font-bold">${p.matches} <span class="text-[8px] text-gray-500 font-normal">Mat</span></p>
//                 <p class="text-[9px] text-orange-500 font-black">${p.points} <span class="text-[7px] text-gray-600 font-normal">Pts</span></p>
//             </div>
//         </div>`;
//     });

//     playersHTML += `</div>`;
//     subContent.innerHTML = playersHTML;
// }

async function renderTeamPlayersTab() {
    console.log(`[Team Profile]: Fetching players from master_players for Team: ${currentViewingTeamId}`);
    const subContent = document.getElementById('teamProfileTabContent');
    if (!subContent) return;

    // चालू सीझन निश्चित करा (उदा. 2026-2027)
    const currentSeason = window.currentLoadedTeamData?.season || "2026-2027";

    // तुझ्या renderTeamPlayersTab मधील बटण सेक्शन फक्त असा बदलून घे:
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
        
        // 🟢 'master_players' कलेक्शन् मधून या सीझनचे खेळाडू शोधा
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
            const p = doc.data();
            const seasonDetails = p.seasons[currentSeason] || {};
            const stats = seasonDetails.stats || { matches: 0, raidPoints: 0, tacklePoints: 0 };

            let skillColor = "bg-orange-500/10 text-orange-500 border-orange-500/20";
            if (p.skill === "Defender") skillColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
            if (p.skill === "All Rounder") skillColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";

            playersHTML += `
            <div class="bg-[#111] p-3 rounded-2xl border border-gray-800 flex justify-between items-center shadow-md">
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
// async function saveNewPlayerToMaster() {
//     console.log("[Player Master]: 💾 Saving new player directly to master_players...");

//     // फॉर्ममधून डेटा गोळा करा
//     const name = document.getElementById('pName')?.value.trim();
//     const registerId = document.getElementById('pRegisterId')?.value.trim().toUpperCase();
//     const mobile = document.getElementById('pMobile')?.value.trim();
//     const dob = document.getElementById('pDob')?.value.trim() || "";
//     const aadharLast4 = document.getElementById('pAadhar')?.value.trim();
//     const weight = document.getElementById('pWeight')?.value.trim();
//     const skill = document.getElementById('pSkill')?.value;
//     const role = document.getElementById('pRole')?.value;
//     const email = document.getElementById('pEmail')?.value.trim().toLowerCase();

//     // आवश्यक फील्ड्सचे व्हॅलिडेशन
//     if (!name || !registerId) {
//         alert("🚨 कृपया खेळाडूचे नाव आणि सीझन Register ID अनिवार्यपणे भरा!");
//         return;
//     }

//     // आपण ज्या टीमच्या प्रोफाइलमध्ये आहोत, त्याचा आयडी आणि सीझन डेटा घ्या
//     const teamId = currentViewingTeamId; 
//     const teamName = window.currentLoadedTeamData?.teamName || "Unknown Team";
//     const currentSeason = window.currentLoadedTeamData?.season || "2026-2027"; 

//     if (!teamId) {
//         alert("🚨 एरर: चालू संघाची माहिती सापडली नाही!");
//         return;
//     }

//     if (dob && dob.length !== 10) {
//         alert("🚨 कृपया जन्म तारीख पूर्ण भरा किंवा कॅलेंडरमधून निवडा (DD/MM/YYYY)!");
//         return;
//     }
//     console.log(`[प्लेअर मास्टर]: 💾 फायरस्टोअरमध्ये जतन होणारी जन्मतारीख -> ${dob}`);

//     // 🟢 १. इथे ऑटोमॅटिक ४ अंकी अल्फा-न्यूमेरिक आयडी जनरेट होईल
//     const generatedId = generateMasterPlayerId();

//     // फायरस्टोअरसाठी ऑब्जेक्ट तयार करा (सीझन-वाईज मॅप स्ट्रक्चर)
//     const playerData = {
//         playerID: generatedId, // 🟢 २. हा खेळाडूचा आयुष्यभराचा कायमस्वरूपी आयडी बनला!
//         name: name,
//         email: email || "",
//         mobile: mobile || "",
//         dob: dob || "",
//         aadharLast4: aadharLast4 || "",
//         weight: weight ? parseInt(weight) : null,
//         skill: skill,
//         role: role,
//         status: "Approved", 
//         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//         seasons: {
//             [currentSeason]: {
//                 teamId: teamId,
//                 teamName: teamName,
//                 registerId: registerId,
//                 stats: { matches: 0, raidPoints: 0, tacklePoints: 0, superRaids: 0, superTackles: 0 }
//             }
//         }
//     };

//     try {
//         // ईमेल युनिक आहे का ते तपासा (जर ईमेल टाकला असेल तर)
//         if (email) {
//             const emailCheck = await db.collection("master_players").where("email", "==", email).get();
//             if (!emailCheck.empty) {
//                 alert("🚨 या ईमेल आयडीचा खेळाडू आधीच नोंदणीकृत आहे!");
//                 return;
//             }
//         }

//         // 'master_players' कलेक्शनमध्ये डेटा जतन करा
//         const docRef = await db.collection("master_players").add(playerData);
//         console.log(`[Success]: New Master Player saved! ID -> ${docRef.id}`);
        
//         alert(`🎉 खेळाडू "${name}" ची नवीन नोंदणी यशस्वी झाली आणि तो या संघात जोडला गेला!`);
        
//         // मोडल बंद करा आणि खेळाडूंचा टॅब लाइव्ह रिफ्रेश करा
//         closeNewPlayerModal();
//         if (typeof renderTeamPlayersTab === 'function') {
//             renderTeamPlayersTab();
//         }

//     } catch (error) {
//         console.error("[Error saving new player]:", error);
//         alert("🚨 तांत्रिक अडचणीमुळे खेळाडू सेव्ह करता आला नाही.");
//     }
// }

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