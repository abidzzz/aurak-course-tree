document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired');
    setupEventListeners();
});

function fixHeaderWidth() {
    const wideBg = document.querySelector('.wide-bg-colour');
    const fullWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );

    const headerHeight = wideBg.offsetHeight;

    // Create a wrapper for the red background (sibling of namebox)
    const bgWrapper = document.createElement('div');
    bgWrapper.className = 'header-bg-wrapper';

    // Insert the red background BEFORE the namebox
    const namebox = document.getElementById('namebox');
    namebox.parentNode.insertBefore(bgWrapper, namebox);

    // Style the background wrapper (full width)
    bgWrapper.style.position = 'absolute';
    bgWrapper.style.top = '0';
    bgWrapper.style.left = '0';
    bgWrapper.style.width = fullWidth + 'px'; // Use actual full width
    bgWrapper.style.height = headerHeight + 'px';
    bgWrapper.style.background = '#8a0d0c';
    bgWrapper.style.zIndex = '1';

    // Style the header content to be centered
    wideBg.style.position = 'relative';
    wideBg.style.width = '100%';
    wideBg.style.maxWidth = '100%'; // Your known max
    wideBg.style.margin = '0 auto'; // Center the content
    wideBg.style.background = 'transparent';
    wideBg.style.zIndex = '2'; // Above the red background

    const element = document.getElementById("root");
    if (element) {
        element.style.marginTop = (headerHeight - 180) + 'px';
    }

}

document.addEventListener('DOMContentLoaded', fixHeaderWidth);
window.addEventListener('resize', fixHeaderWidth);

function setupEventListeners() {
    console.log('Setting up event listeners');
    const root = document.getElementById('root');
    const allBoxes = document.getElementsByClassName('classBox');
    console.log('Total class boxes found:', allBoxes.length);

    for (const box of allBoxes) {
        box.addEventListener('mouseover', boxOnHover);
        box.addEventListener('mouseout', boxOnLeave);
        box.addEventListener('click', boxOnClick);
    }

    root.addEventListener('click', rootDivClicked);


    const zoomRangeSlider = document.getElementById('zoom-range-slider');
    if (zoomRangeSlider) {
        zoomRangeSlider.addEventListener('input', zoom_slider_update);
        zoomRangeSlider.addEventListener('change', zoom_slider_update);
    } else {
        console.error('Zoom range slider not found');
    }

    setupArrows();
}


// Add this to your JavaScript
const genEdCourses = {
    "Humanities/Fine Arts": {
        "PHIL100": "Critical Thinking and Reasoning",
        "ENGL200": "Advanced Composition",
        "MEST100": "Introduction to Islam in World Culture",
        "ENGL102": "Public Speaking",
        "HIST100": "Contemporary Middle Eastern History",
        "HIST101": "Ancient History of the Arabian Peninsula",
        "PHIL101": "Ethics in Today's World",
        "ARTT101": "History of Art and Design",
        "ARTT102": "Art and Artificial Intelligence",
        "COMM102": "Reading Image and Film"
    },
    "Social and Behavioral Sciences": {
        "UAES200": "Survey of United Arab Emirates Studies",
        "PSYC100": "Introduction to Psychology",
        "PSYC250": "Social Psychology",
        "ECON103": "Principles of Microeconomics",
        "POLI100": "Contemporary Global Issues",
        "POLI101": "Politics of Scarcity",
        "COMM101": "Interpersonal Communication and Group Interaction"
    },
    "Mathematics": {
        "MATH101": "Numbers and Data Interpretation",
        "STAT100": "Statistics",
        "MATH108": "Calculus with Business Applications",
        "MATH111": "Calculus with Life Sciences Applications",
        "MATH113": "Calculus I"
    },
    "Natural Sciences": {
        "BIOL100": "Humankind in a Biological World",
        "CHEM100/101": "Chemistry in Everyday Life",
        "CHEM211/212": "General Chemistry I",
        "ENVS102": "Sustainability and Human-Environment Relations"
    }
};
const programElectives = {
  "Mass Communications": {
    credits: 15,
    courses: [
      { code: "COMM 221", title: "Communication Analysis and Criticism", credits: 3 },
      { code: "COMM 225", title: "Visual Communication and Digital Photography", credits: 3 },
      { code: "COMM 226", title: "Graphic Communication Design and Print Production", credits: 3 },
      { code: "COMM 227", title: "Film and Video Editing", credits: 3 },
      { code: "COMM 322", title: "Digital Resources and Content", credits: 3 },
      { code: "COMM 422", title: "Streaming Media, Podcasting and Radio Production", credits: 3 },
      { code: "COMM 425", title: "Media Management and Entrepreneurship", credits: 3 }
    ]
  },
  
  "Biotechnology": {
    credits: 7,
    note: "Students may choose one course and its corresponding lab from the other concentration as an elective.",
    courses: [
      { code: "BIOL 322", title: "Microbial Genetics", credits: 3 },
      { code: "BIOL 357", title: "Artificial Intelligence in Biotechnology", credits: 3 },
      { code: "BIOL 480", title: "Food Biotechnology", credits: 3 },
      { code: "BIOL 481", title: "Bioprocessing Technology in the Pharmaceutical Industry", credits: 3 }
    ]
  },
  
  "Psychology": {
    credits: 18,
    requirements: "Students need to take 2 courses from each of the following three groups (at least 2 courses must be at the 300-level and at least 1 course at the 400-level).",
    groups: {
      "Group 1: Cognitive and Brain Sciences": {
        credits: 6,
        courses: [
          { code: "PSYC 210", title: "Learning and Memory", credits: 3 },
          { code: "PSYC 340", title: "Sensation and Perception", credits: 3 },
          { code: "PSYC 331", title: "Psychology of Language", credits: 3 },
          { code: "PSYC 423", title: "Human Neuropsychology", credits: 3 }
        ]
      },
      "Group 2: Clinical, Personality, Social": {
        courses: [
          { code: "PSYC 251", title: "Psychology of Diversity and Inclusion", credits: 3 },
          { code: "PSYC 354", title: "Health Psychology", credits: 3 },
          { code: "PSYC 396", title: "Tests and Measurements", credits: 3 },
          { code: "PSYC 457", title: "Counseling and Psychotherapy", credits: 3 }
        ]
      },
      "Group 3: Applied Psychology": {
        courses: [
          { code: "PSYC 252", title: "Positive Psychology", credits: 3 },
          { code: "PSYC 262", title: "Psychology of Adulthood and Aging", credits: 3 },
          { code: "PSYC 355", title: "Educational Psychology", credits: 3 },
          { code: "MGMT 401", title: "Organizational Behavior", credits: 3 }
        ]
      }
    }
  },
  
  "Architecture": {
    credits: 6,
    courses: [
      { code: "ARCH 449", title: "Technology of the Built Environment", credits: 3 },
      { code: "ARCH 456", title: "Sustainable Housing", credits: 3 },
      { code: "ARCH 459", title: "Conservation of Historic Environment", credits: 3 },
      { code: "ARCH 473", title: "Environmental Control", credits: 3 },
      { code: "ARCH 499", title: "Special Topics of Architecture", credits: 3 },
      { code: "INDS 351", title: "Parametric Design", credits: 3 },
      { code: "INDS 353", title: "Landscape and Garden Design", credits: 3 },
      { code: "INDS 451", title: "Portfolio Design", credits: 3 },
      { code: "INDS 453", title: "Advanced BIM: Scheduling and coordination", credits: 3 }
    ]
  },
  
  "Artificial Intelligence": {
    credits: 6,
    courses: [
      { code: "CSCI 450", title: "Information Security and Privacy", credits: 3 },
      { code: "CSAI 480", title: "Big Data", credits: 3 },
      { code: "CSAI 481", title: "Computer Vision", credits: 3 },
      { code: "CSAI 482", title: "Data Mining", credits: 3 },
      { code: "CSAI 483", title: "Information Retrieval", credits: 3 },
      { code: "CSAI 485", title: "Introduction to Deep Learning", credits: 3 },
      { code: "CSCI 416", title: "Human Computer Interaction", credits: 3 },
      { code: "CENG 431", title: "Embedded Systems", credits: 3 },
      { code: "CENG 432", title: "Embedded Systems Lab", credits: 1 },
      { code: "CSAI 486", title: "Special Topics in Artificial Intelligence", credits: 3 },
      { code: "CSAI 487", title: "Introduction to Robotics", credits: 3 },
      { code: "ENGR 399", title: "Undergraduate Research Project", credits: 3 }
    ]
  },

  "Chemical Engineering": {
    credits: 6,
    note: "To be selected from the following list of courses:",
    courses: [
      { code: "CHEN 403", title: "Fundamentals of Biochemical Engineering", credits: 3 },
      { code: "CHEN 452", title: "Introduction to Hydrogen Technologies", credits: 3 },
      { code: "CHEN 462", title: "Petroleum Refining Engineering", credits: 3 },
      { code: "CHEN 463", title: "Natural Gas Engineering", credits: 3 },
      { code: "CHEN 464", title: "Industrial Catalysis", credits: 3 },
      { code: "CHEN 473", title: "Water Desalination", credits: 3 },
      { code: "CHEN 474", title: "Industrial and Wastewater Treatment", credits: 3 },
      { code: "CHEN 476", title: "Fundamentals of Nanotechnology", credits: 3 },
      { code: "CHEN 485", title: "Carbon Capture, Utilization and Storage", credits: 3 },
      { code: "CHEN 493", title: "Special Topics in Chemical Engineering", credits: 3 },
      { code: "ENGR 399", title: "Undergraduate Research Project", credits: 3 }
    ]
  },

  "Chemical Engineeringwith Concentration in Petroleum Engineering": {
    credits: 6,
    note: "To be selected from the following list of courses:",
    courses: [
      { code: "CHEN 404", title: "Safety and Environmental Impact", credits: 3 },
      { code: "CHEN 452", title: "Introduction to Hydrogen Technologies", credits: 3 },
      { code: "CHEN 463", title: "Natural Gas Engineering", credits: 3 },
      { code: "CHEN 485", title: "Carbon Capture, Utilization and Storage", credits: 3 },
      { code: "PENG 404", title: "Petroleum Economics", credits: 3 },
      { code: "PENG 464", title: "Data Science in Petroleum Engineering", credits: 3 },
      { code: "PENG 474", title: "Applied Reservoir Simulation", credits: 3 },
      { code: "PENG 483", title: "Well Testing", credits: 3 },
      { code: "PENG 486", title: "Enhanced Oil Recovery", credits: 3 },
      { code: "PENG 493", title: "Special Topics in Petroleum Engineering", credits: 3 },
      { code: "ENGR 399", title: "Undergraduate Research Project", credits: 3 }
    ]
  },

  "Civil Engineering": {
        credits: 6,
        courses: [
          { code: "CIEN 422", title: "Advanced Reinforced Concrete Design", credits: 3 },
          { code: "CIEN 424", title: "Bridge Design", credits: 3 },
          { code: "CIEN 431", title: "Foundation Engineering", credits: 3 },
          { code: "CIEN 442", title: "Construction Planning and Scheduling", credits: 3 },
          { code: "CIEN 444", title: "Construction Cost Analysis and Estimating", credits: 3 },
          { code: "CIEN 457", title: "Water Resources Sustainability", credits: 3 },
          { code: "ENGR 410", title: "Climate Change", credits: 3 },
          { code: "CIEN 456", title: "Sustainable Urban Building Sites", credits: 3 },
          { code: "CIEN 462", title: "Advanced Pavement Design", credits: 3 },
          { code: "CIEN 464", title: "Airport Planning and Design", credits: 3 },
          { code: "CIEN 493", title: "Special Topics in Civil Engineering", credits: 3 },
          { code: "ENGR 399", title: "Undergraduate Research Project", credits: 3 },
          { code: "INDS 453", title: "Advanced BIM: Scheduling and Coordination", credits: 3 }
        ]
      },

  "Computer Engineering": {
    credits: 6,
    courses: [
      { code: "CSCI 415", title: "Introduction to Parallel Programming", credits: 3 },
      { code: "CSCI 450", title: "Information Security and Privacy", credits: 3 },
      { code: "CENG 435", title: "Parallel Computer Architectures", credits: 3 },
      { code: "CENG 437", title: "Introduction to Robotics", credits: 3 },
      { code: "CENG 461", title: "Network Security", credits: 3 },
      { code: "CENG 401", title: "Network Servers & Architecture", credits: 3 },
      { code: "CSCI 499", title: "Special Topics in Computing", credits: 3 },
      { code: "EEEN 431", title: "Digital Circuit Design", credits: 3 },
      { code: "EEEN 481", title: "Concepts of Multimedia Processing and Transmission", credits: 3 },
      { code: "ENGR 399", title: "Undergraduate Research Project", credits: 3 }
    ]
  },

  "Computer Science": {
    credits: 6,
    courses: [
      { code: "CENG 437", title: "Introduction to Robotics", credits: 3 },
      { code: "CSCI 411", title: "Computer Graphics", credits: 3 },
      { code: "CSCI 412", title: "Computer Graphics Lab", credits: 1 },
      { code: "CSCI 415", title: "Introduction to Parallel Programming", credits: 3 },
      { code: "CSCI 416", title: "Human Computer Interaction", credits: 3 },
      { code: "CENG 435", title: "Parallel Computer Architectures", credits: 3 },
      { code: "EEEN 481", title: "Concepts of Multimedia Processing and Transmission", credits: 3 },
      { code: "CENG 401", title: "Network Servers & Architecture", credits: 3 },
      { code: "CSCI 450", title: "Information Security and Privacy", credits: 3 },
      { code: "CSCI 499", title: "Special Topics in Computing", credits: 3 },
      { code: "ENGR 399", title: "Undergraduate Research Project", credits: 3 }
    ]
  },

  "Electrical and Electronics Engineering": {
    credits: 6,
    courses: [
      { code: "CENG 315", title: "Microprocessor", credits: 3 },
      { code: "EEEN 422", title: "High Voltage Engineering", credits: 3 },
      { code: "EEEN 423", title: "Electrical Energy Systems and Fault Analysis", credits: 3 },
      { code: "EEEN 425", title: "Smart Power Grid Systems Theory and Implementation", credits: 3 },
      { code: "EEEN 426", title: "Renewable Energy Systems", credits: 3 },
      { code: "EEEN 455", title: "Digital Image Processing", credits: 3 },
      { code: "EEEN 462", title: "Data and Computer Communication", credits: 3 },
      { code: "EEEN 467", title: "Mobile and Wireless Communications", credits: 3 },
      { code: "EEEN 472", title: "Antenna Theory and Design", credits: 3 },
      { code: "EEEN 474", title: "Advanced Information Theory and Coding", credits: 3 },
      { code: "EEEN 481", title: "Concepts of Multimedia Processing & Transmission", credits: 3 },
      { code: "EEEN 487", title: "Robotics Engineering", credits: 3 },
      { code: "EEEN 499", title: "Special Topics in EEEN", credits: 3 },
      { code: "ENGR 399", title: "Undergraduate Research Project", credits: 3 }
    ]
  },

  "Electrical Electronics Engineering with Concentration in Robotics": {
    credits: 6,
    courses: [
      { code: "EEEN 455", title: "Digital Image Processing", credits: 3 },
      { code: "EEER 488", title: "Advanced Robotics Engineering", credits: 3 },
      { code: "EEER 489", title: "Machine Learning for Robotics", credits: 3 },
      { code: "EEER 490", title: "IoT and Sensors for Robotic Systems", credits: 3 }
    ]
  },

  "Mechanical Engineering": {
    credits: 6,
    courses: [
      { code: "MENG 311", title: "Internal Combustion Engines", credits: 3 },
      { code: "MENG 323", title: "Engineering Economy", credits: 3 },
      { code: "MENG 441", title: "Turbo Machinery", credits: 3 },
      { code: "MENG 453", title: "Computer Aided Design", credits: 3 },
      { code: "MENG 455", title: "Finite Elements in Machine Design", credits: 3 },
      { code: "MENG 461", title: "HVAC and Refrigeration Systems", credits: 3 },
      { code: "MENG 462", title: "Design of Thermal System", credits: 3 },
      { code: "MENG 463", title: "Energy Conversion and Management", credits: 3 },
      { code: "MENG 471", title: "Sustainable Product Design", credits: 3 },
      { code: "MENG 493", title: "Special Topics in Mechanical Engineering", credits: 3 },
      { code: "ENGR 399", title: "Undergraduate Research Project", credits: 3 },
      { code: "ENGR 420", title: "Life Cycle Assessment", credits: 3 },
      { code: "EEEN 426", title: "Renewable Energy Systems", credits: 3 },
      { code: "EEEN 451", title: "Control Theory", credits: 3 }
    ]
  }
};
function matchGenEdCategory(courseName) {
    const categoryKeywords = {
        "Social and Behavioral Sciences": ["social", "behavioral", "sciences", "science"],
        "Humanities/Fine Arts": ["humanities", "fine", "arts", "art"],
        "Mathematics": ["mathematics", "math"],
        "Natural Sciences": ["natural", "sciences", "science"]
    };

    const lowerName = courseName.toLowerCase();

    // Count matches for each category
    const categoryMatches = {};

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        let matchCount = 0;

        for (const keyword of keywords) {
            if (lowerName.includes(keyword)) {
                matchCount++;
            }
        }

        categoryMatches[category] = matchCount;
    }

    // Find category with at least 2 matches
    for (const [category, matchCount] of Object.entries(categoryMatches)) {
        if (matchCount >= 2) {
            return category;
        }
    }

    // If no category has 2 matches, try with 1 match as fallback
    for (const [category, matchCount] of Object.entries(categoryMatches)) {
        if (matchCount >= 1) {
            return category;
        }
    }

    return null;
}

function checkIfCourseExists(courseCode) {
    const allCourseBoxes = document.getElementsByClassName('classBox');

    for (const box of allCourseBoxes) {
        const boxId = box.id;
        // Remove spaces and special characters for comparison
        const cleanBoxId = boxId.replace(/[^A-Z0-9]/g, '');
        const cleanCourseCode = courseCode.replace(/[^A-Z0-9]/g, '');

        if (cleanBoxId.includes(cleanCourseCode)) {
            return true;
        }
    }
    return false;
}
function getAvailableGenEdOptions(genEdCategory) {
    const availableOptions = [];
    const courses = genEdCourses[genEdCategory];

    if (!courses) return availableOptions;

    for (const [courseCode, courseTitle] of Object.entries(courses)) {
        // Only include if this course doesn't exist as a separate box
        if (!checkIfCourseExists(courseCode)) {
            availableOptions.push({
                code: courseCode,
                title: courseTitle
            });
        }
    }

    return availableOptions;
}
function showBusinessNaturalSciencesTooltip(box, courseName) {
    let tooltip = document.getElementById('prereq-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'prereq-tooltip';
        document.body.appendChild(tooltip);
    }

    const tooltipHTML = `
        <strong>${courseName}</strong>
        <br><div class="gened-instruction">Please choose one of the following courses:</div>
        <br>
        <div class="gened-option"><strong>BIOL 100</strong> - Humankind in a Biological World, OR</div>
        <div class="gened-option"><strong>CHEM 100</strong> - Chemistry in Everyday Life, OR</div>
        <div class="gened-option"><strong>CHEM 211</strong> - General Chemistry I, OR</div>
        <div class="gened-option"><strong>ENVS 102</strong> - Sustainability and Human-Environment Relations</div>
    `;

    tooltip.innerHTML = tooltipHTML;
    positionTooltipSmartly(tooltip, box);
    tooltip.classList.add('show');
}

function showGenEdOptionsTooltip(box, courseName) {
    // Match the category (handles plural/singular variations)
    const genEdCategory = matchGenEdCategory(courseName);
    const titleElement = document.querySelector('h1.titl');
    const isBusinessProgramPage = titleElement && titleElement.textContent.toLowerCase().includes('business');
    const isNaturalSciences = courseName.includes("Natural Sciences") || courseName.includes("Natural Science");

    if (isBusinessProgramPage && isNaturalSciences) {
        showBusinessNaturalSciencesTooltip(box, courseName);
        return;
    }
    if (!genEdCategory) {
        // Fallback: show generic message if category can't be determined
        showGenericGenEdTooltip(box, courseName);
        return;
    }

    // Get available options for this category
    const availableOptions = getAvailableGenEdOptions(genEdCategory);

    // Create or update tooltip
    let tooltip = document.getElementById('prereq-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'prereq-tooltip';
        document.body.appendChild(tooltip);
    }

    let tooltipHTML = `<strong>${courseName}</strong>`;
    tooltipHTML += `<br><em>Available ${genEdCategory}:</em><br><br>`;

    if (availableOptions.length > 0) {
        availableOptions.forEach(course => {
            tooltipHTML += `<div class="gened-option">`;
            tooltipHTML += `<strong>${course.code}:</strong> ${course.title}`;
            tooltipHTML += `</div>`;
        });

        tooltipHTML += `<br><small>Choose any one course from above options</small>`;
    } else {
        tooltipHTML += `<div class="no-options">`;
        tooltipHTML += `All ${genEdCategory} courses are already in your study plan`;
        tooltipHTML += `</div>`;
    }

    tooltip.innerHTML = tooltipHTML;

    // Position and show tooltip
    positionTooltipSmartly(tooltip, box);
    tooltip.classList.add('show');
}
function positionTooltipSmartly(tooltip, box) {
    const rect = box.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 5;

    // Show tooltip temporarily to measure it
    tooltip.style.visibility = 'hidden';
    tooltip.style.display = 'block';
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    tooltip.style.visibility = 'visible';

    // Adjust if tooltip goes off-screen right
    if (left + tooltipWidth > viewportWidth) {
        left = rect.left - 130;
    }

    // Adjust if tooltip goes off-screen left
    if (left < 10) {
        left = 10;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}
// Fallback function for unrecognized GenEd categories
function showGenericGenEdTooltip(box, courseName) {
    let tooltip = document.getElementById('prereq-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'prereq-tooltip';
        document.body.appendChild(tooltip);
    }

    let tooltipHTML = `<strong>${courseName}</strong>`;
    tooltipHTML += `<br><em>General Education Course</em><br>`;
    tooltipHTML += `<div class="no-options">`;
    tooltipHTML += `Choose any course from the General Education requirements`;
    tooltipHTML += `</div>`;

    tooltip.innerHTML = tooltipHTML;

    const rect = box.getBoundingClientRect();
    tooltip.style.left = (rect.left + window.scrollX) + 'px';
    tooltip.style.top = (rect.bottom + window.scrollY + 5) + 'px';
    tooltip.classList.add('show');
}
// Add this function to show electives tooltip
function showElectivesTooltip(box, courseName) {
    const titleElement = document.querySelector('h1.titl');
    const programName = titleElement && titleElement.textContent.replace('Bachelor of Science in ', '').replace('Bachelor of Arts in','').replace('4-Year Study Plan ','').replace('5-Year Study Plan ','').replace('(2025-2026)','').replace('Bachelor of ', '').trim(); 

    let electiveData = programElectives[programName];
    if (!electiveData) {
        if(programName.includes('Mass Communication')){ 
            electiveData = programElectives["Mass Communications"];
        }
        else if(programName.includes('Biotechnology')){
            electiveData = programElectives["Biotechnology"];
        }
        else {
            
        console.log('No elective data found for program:', programName);
        return;
    }
    }

    let tooltip = document.getElementById('prereq-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'prereq-tooltip';
        document.body.appendChild(tooltip);
    }
    let tooltipHTML = '';
    if (programName === "Psychology") {
        
        tooltipHTML += `<div class="electives-info">${electiveData.requirements || ''}</div>`;
        
        for (const [groupName, groupData] of Object.entries(electiveData.groups)) {
            tooltipHTML += `<div class="elective-group">`;
            tooltipHTML += `<div class="group-name">${groupName}</div>`;
            
            groupData.courses.forEach(course => {
                tooltipHTML += `<div class="elective-option">`;
                tooltipHTML += `<strong>${course.code}</strong>: ${course.title}`;
                tooltipHTML += `</div>`;
            });
            
            tooltipHTML += `</div>`;
        }
    } 
    else{
    tooltipHTML += `<strong>${courseName}</strong>`;
    tooltipHTML += `<br><div class="electives-info"><small>Choose any one course from below options</small></div>`;
    
    electiveData.courses.forEach(course => {
        tooltipHTML += `<div class="elective-option">`;
        tooltipHTML += `<strong>${course.code}:</strong> ${course.title} (${course.credits} Cr.)`;
        tooltipHTML += `</div>`;
    });
    }
    tooltip.innerHTML = tooltipHTML;
    positionTooltipSmartly(tooltip, box);
    tooltip.classList.add('show');

}

function showPrerequisitesOnHover(box) {
    const prereqs = box.getAttribute('prereq');
    const coreqs = box.getAttribute('coreq');
    const courseCodeFull = box.getElementsByClassName('course-code-full')[0].innerHTML;
    const courseName = box.getElementsByClassName('course-name')[0]?.innerHTML || '';
    const boxId = box.id;
    
    // Check if this is an electives box
    if (courseName.includes('Electives') || courseName.includes('electives') || courseName.includes('Elective') || courseName.includes('elective')) {
        if (!courseName.includes("Free")) {
            showElectivesTooltip(box, courseName);
            return;
        }
    }
    
    // Check if this is a GenEd box by ID
    if (boxId.toLowerCase() === "gened") {

        showGenEdOptionsTooltip(box, courseName);
        return;
    }
    let prereqText = '';
    let coreqText = '';
    // Function to format course code with spaces
    function formatCourseCode(courseId) {
        // If it's a "Completion" or "Requisite" text, return as is
        if (courseId.startsWith("Completion") || courseId.startsWith("Requisite")) {
            return courseId;
        }

        // For course codes like "COMM111" -> "COMM 111"
        // Match pattern: 3-4 letters followed by 3 digits
        const match = courseId.match(/^([A-Z]{3,4})(\d{3})$/);
        if (match) {
            return match[1] + ' ' + match[2];
        }

        // If no match, return original
        return courseId;
    }

    if (prereqs && prereqs !== '') {
        let prereqArray;
        const tempprereqArray = prereqs.split(' ');

        if (tempprereqArray[0] && tempprereqArray[0] === "Requisite") {
            prereqArray = [prereqs];
        }
        else if (tempprereqArray[0] && tempprereqArray[0].substring(0, 10) === "Completion") {
            prereqArray = [prereqs];
        }
        else if (tempprereqArray[0].length >= 7) {
            prereqArray = tempprereqArray;
        }
        else {
            prereqArray = [prereqs];
        }

        prereqArray.forEach(prereqId => {
            if (prereqId.includes('or')) {
                const options = prereqId.split('or').map(option => formatCourseCode(option.trim()));
                prereqText += options.join(' or ') + ', ';
            } else {
                const prereqElement = document.getElementById(prereqId);
                if (prereqElement) {
                    const prereqCourseCode = prereqElement.getElementsByClassName('course-code-full')[0].innerHTML;
                    prereqText += prereqCourseCode + ', ';
                } else {
                    // Format the course code before displaying
                    prereqText += formatCourseCode(prereqId) + ', ';
                }
            }
        });
        // Remove trailing comma and space
        prereqText = prereqText.slice(0, -2);
    }

    if (coreqs && coreqs !== '') {
        let coreqArray;
        const tempcoreqArray = coreqs.split(' ');
        if (tempcoreqArray[0].length <= 7) {
            coreqArray = tempcoreqArray;
        } else {
            coreqArray = [coreqs];
        }

        coreqArray.forEach(coreqId => {
            if (coreqId.includes('or')) {
                const options = coreqId.split('or').map(option => formatCourseCode(option.trim()));
                coreqText += options.join(' or ') + ', ';
            }
            else {
                const coreqElement = document.getElementById(coreqId);
                if (coreqElement) {
                    const coreqCourseCode = coreqElement.getElementsByClassName('course-code-full')[0].innerHTML;
                    coreqText += coreqCourseCode + ', ';
                } else {
                    // Format the course code before displaying
                    coreqText += formatCourseCode(coreqId) + ', ';
                }
            }
        });
        // Remove trailing comma and space
        coreqText = coreqText.slice(0, -2);
    }

    // Create or update tooltip
    let tooltip = document.getElementById('prereq-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'prereq-tooltip';
        document.body.appendChild(tooltip);
    }

    let desc = "";
    if (courseCodeFull == "PHIL 100 OR ENGL 200 OR MEST 100 (3&nbsp;Cr.)") {
        desc = '<br>Critical Thinking and Reasoning <br>OR<br> Advanced Composition <br><div style="color:#ba0000;">*ENGL 200 requires ENGL 101</div>OR<br> Introduction to Islam in World Culture';
    }
    else if (courseCodeFull == "ARAB 210 OR ARAB 211 (3&nbsp;Cr.)") {
        desc = '<br>Arabic for Media: Native Speakers <div style="color:#ba0000;">*ARAB 210 requires ARAB 110</div> OR <br> Arabic for Media: Non-Native speakers<div style="color:#ba0000;">*ARAB 211 requires ARAB 101</div>';
    }


    tooltip.innerHTML = `<strong>${courseCodeFull}</strong>` +
        (desc ? `<br>${desc}` : '') +
        (prereqText ? `<br>Prerequisites: ${prereqText}` : '') +
        (coreqText ? `<br>Corequisites: ${coreqText}` : '');

    // Position tooltip near the box
    const rect = box.getBoundingClientRect();
    tooltip.style.left = (rect.left + window.scrollX) + 'px';
    tooltip.style.top = (rect.bottom + window.scrollY + 5) + 'px';

    // Show the tooltip with animation
    tooltip.classList.add('show');
}

function hidePrerequisitesTooltip() {
    const tooltip = document.getElementById('prereq-tooltip');
    if (tooltip) {
        tooltip.classList.remove('show'); // Hide tooltip using opacity transition
    }
}

function boxOnHover(event) {
    if (box_focused) return;

    let box = event.target;
    while (!box.classList.contains('classBox')) {
        box = box.parentElement;
    }

    showPrerequisitesOnHover(box);
    highlightCourse(box);
}

function boxOnLeave() {
    if (box_focused) return;
    hidePrerequisitesTooltip();
    showAllElements();
}

function boxOnClick(event) {
    if (event.target && !(event.target.textContent.includes('Electives') || event.target.textContent.includes('Elective')) ) {
        hidePrerequisitesTooltip();
    }
}
function rootDivClicked(event) {
    if (!event.target.classList.contains('classBox') &&
        !event.target.classList.contains('course-code-full') &&
        !event.target.classList.contains('course-name')) {
        hidePrerequisitesTooltip(); // Hide tooltip when clicking elsewhere
        unfocusBox();
    }
}

function zoom_slider_update(event) {
    const zoomValue = event.target.value;
    document.getElementById('zoom-value').innerHTML = zoomValue;
    document.getElementById('root').style.fontSize = `${zoomValue}em`;
}

function highlightCourse(source) {
    while (!source.classList.contains('classBox')) {
        source = source.parentElement;
    }
    const sourceId = source.id;
    const allElements = document.getElementsByClassName('classBox');
    for (const elem of allElements) {
        elem.style.opacity = '0.3';
    }
    source.style.opacity = '1.0';
    const arrows = document.getElementsByClassName(sourceId);
    for (const arrow of arrows) {
        const related = arrow.classList;
        for (const rel of related) {
            const elem = document.getElementById(rel);
            if (elem) {
                arrow.style.opacity = '1.0';
                elem.style.opacity = '1.0';
            }
        }
    }
}


function showAllElements() {
    const allElements = document.getElementById('root').getElementsByTagName('*');
    for (const elem of allElements) {
        elem.style.opacity = '1.0';
    }
    const allArrows = document.getElementsByTagName('line');
    for (const arrow of allArrows) {
        arrow.style.opacity = '0';
    }
}

let box_focused = false;

function focusBox(source) {
    while (!source.classList.contains('classBox')) {
        source = source.parentElement;
    }
    if (box_focused) {
        unfocusBox();  // Unfocus the previous box if there is one focused
    }
    box_focused = source.id;
    highlightCourse(source);
}

function unfocusBox() {
    if (!box_focused) return;
    box_focused = false;
    showAllElements();

}
function setupArrows() {
    console.log('Setting up arrows');
    const classBoxes = document.getElementsByClassName("classBox");
    const svgConns = document.getElementsByClassName("svgConns")[0];
    const bodyRect = document.body.getBoundingClientRect();
    const scrollWidth = Math.max(
        document.documentElement.scrollWidth,
        document.body.scrollWidth,
        document.documentElement.offsetWidth,
        document.body.offsetWidth
    );
    const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight
    );

    svgConns.style.position = 'absolute';
    svgConns.style.top = '0';
    svgConns.style.left = '0';
    svgConns.style.width = scrollWidth + 'px';
    svgConns.style.height = scrollHeight + 'px';
    svgConns.style.pointerEvents = 'none';
    svgConns.style.zIndex = '0';

    // Helper function to create arrows for connections
    function createArrowsForConnections(element, connectionStyle, arrowClass) {
        return function (targetBox, connectionIds) {
            connectionIds.forEach(connectionId => {
                const connectionElement = document.getElementById(connectionId.trim());
                if (connectionElement) {
                    const arrow = document.createElementNS("http://www.w3.org/2000/svg", 'line');
                    arrow.setAttribute("style", connectionStyle);
                    arrow.setAttribute("marker-end", "url(#arrow)");

                    let x1, y1, x2, y2;
                    if (arrowClass === 'coreq-arrow') {
                        arrow.setAttribute("marker-end", "url(#coreq-arrow)");
                        // Draw coreq arrows: from right edge to left edge OR left edge to right edge based on position
                        const sourceRect = connectionElement.getBoundingClientRect();
                        const targetRect = targetBox.getBoundingClientRect();
                        if (sourceRect.left < targetRect.left) {
                            // Source is to the left of target: draw arrow from right to left

                            x1 = parseFloat(connectionElement.style.left) + (parseFloat(connectionElement.offsetWidth || 0) / 16);
                            y1 = parseFloat(connectionElement.style.top) + (parseFloat(connectionElement.offsetHeight || 0) / 32);
                            x2 = parseFloat(targetBox.style.left) + 0.1;
                            y2 = parseFloat(targetBox.style.top) + (parseFloat(targetBox.offsetHeight || 0) / 32);

                        } else {
                            // Source is to the right of target: draw arrow from left to right
                            x1 = parseFloat(connectionElement.style.left);
                            y1 = parseFloat(connectionElement.style.top) + (parseFloat(connectionElement.offsetHeight || 0) / 32);
                            x2 = parseFloat(targetBox.style.left) - 0.2 + (parseFloat(targetBox.offsetWidth || 0) / 16);
                            y2 = parseFloat(targetBox.style.top) + (parseFloat(targetBox.offsetHeight || 0) / 32);
                        }



                    } else {
                        // Default: vertical arrow (prereq)
                        x1 = parseFloat(connectionElement.style.left) + 6;
                        y1 = parseFloat(connectionElement.style.top) + 4.5;
                        x2 = parseFloat(targetBox.style.left) + 6;
                        y2 = parseFloat(targetBox.style.top);
                    }

                    arrow.setAttribute("x1", `${x1}em`);
                    arrow.setAttribute("y1", `${y1}em`);
                    arrow.setAttribute("x2", `${x2}em`);
                    arrow.setAttribute("y2", `${y2}em`);

                    arrow.classList.add(connectionId.trim());
                    arrow.classList.add(targetBox.id);
                    arrow.classList.add(arrowClass);

                    svgConns.appendChild(arrow);
                }
            });
        };
    }

    for (const box of classBoxes) {
        const prereqs = box.getAttribute("prereq");
        if (prereqs) {
            const prereqArray = parsePrereqs(prereqs);

            prereqArray.forEach(({ id, isOr }) => {
                const style = isOr
                    ? "stroke:rgb(255,255,255);stroke-width:1;stroke-dasharray:2,2;opacity:0"
                    : "stroke:rgb(255,255,255);stroke-width:1;opacity:0";

                const createArrow = createArrowsForConnections(box, style, 'prereq-arrow');
                createArrow(box, [id]);
            });
        }

        const coreqs = box.getAttribute("coreq");
        if (coreqs) {
            const coreqArray = parsePrereqs(coreqs);

            coreqArray.forEach(({ id, isOr }) => {
                const style = isOr
                    ? "stroke:#00ff88;stroke-width:1;stroke-dasharray:2,2;opacity:0"
                    : "stroke:#00ff88;stroke-width:1;opacity:0";

                const createArrow = createArrowsForConnections(box, style, 'coreq-arrow');
                createArrow(box, [id]);
            });
        }
    }


    // Function to parse prerequisite or corequisite strings and split by "or" inside parentheses
    function parsePrereqs(prereqString) {
        // console.log('Parsing prereqString:', prereqString);
        const regex = /\((.*?)\)/g;
        let results = [];
        let match;
        let foundOrGroup = false;

        // Handle content inside parentheses
        while ((match = regex.exec(prereqString))) {
            const alternatives = match[1]
                .split('or')
                .map(item => item.trim())
                .filter(item => item !== '');
            foundOrGroup = true;

            const existing = alternatives.filter(id => document.getElementById(id));
            const isOrGroup = existing.length >= 2;

            // console.log('Found alternatives:', alternatives, 'Existing:', existing, 'isOrGroup:', isOrGroup);

            results = results.concat(alternatives.map(id => ({
                id,
                isOr: isOrGroup
            })));
        }

        // If no parentheses found but "or" exists (like AorB)
        if (!foundOrGroup && prereqString.includes('or')) {
            const parts = prereqString.split(' ')
                .flatMap(item => item.includes('or') ? item.split('or').map(i => i.trim()) : [item.trim()])
                .filter(item => item !== '');

            const existing = parts.filter(id => document.getElementById(id));
            const isOrGroup = existing.length >= 2;

            // console.log('No parentheses, found inline or:', parts, 'Existing:', existing, 'isOrGroup:', isOrGroup);

            results = results.concat(parts.map(id => ({
                id,
                isOr: isOrGroup
            })));
        }

        // Normal AND connections
        const outsideParentheses = prereqString
            .split(' ')
            .filter(item => !item.includes('(') && !item.includes(')') && !item.includes('or'))
            .map(item => item.trim())
            .filter(item => item !== '');

        results = results.concat(outsideParentheses.map(id => ({
            id,
            isOr: false
        })));

        return results;
    }

}
