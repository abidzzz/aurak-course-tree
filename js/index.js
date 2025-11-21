document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    setupEventListeners();
});

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

function boxOnHover(event) {
    if (box_focused) return;
    console.log('Box hover:', event.target);

    let box = event.target;
    while (!box.classList.contains('classBox')) {
        box = box.parentElement;
    }

    showPrerequisitesOnHover(box);
    highlightCourse(box);
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
    "Natural Sciences":{
        "BIOL100": "Humankind in a Biological World",
        "CHEM100/101": "Chemistry in Everyday Life", 
        "CHEM211/212": "General Chemistry I",
        "ENVS102": "Sustainability and Human-Environment Relations"
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

function showGenEdOptionsTooltip(box, courseName) {
    // Match the category (handles plural/singular variations)
    const genEdCategory = matchGenEdCategory(courseName);
    
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
            tooltipHTML += `<strong>${course.code}</strong>: ${course.title}`;
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
    const viewportHeight = window.innerHeight;
    
    let left = rect.left - 130;
    let top = rect.bottom + window.scrollY + 5;

    // Reset any previous positioning classes
    tooltip.classList.remove('off-screen-right', 'off-screen-bottom');
    
    // Check if tooltip would go off-screen to the right
    tooltip.style.visibility = 'hidden';
    tooltip.style.display = 'block';
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    tooltip.style.visibility = 'visible';
    
    // Adjust horizontal position if needed
    if (left + tooltipWidth > viewportWidth) {
        left = rect.right - 130;
        if (left < 0) left = 5; // Minimum left margin
        tooltip.classList.add('off-screen-right');
    }
    
    // Adjust vertical position if needed
    // if (top + tooltipHeight > viewportHeight + window.scrollY) {
    //     top = rect.top + window.scrollY - tooltipHeight - 5;
    //     if (top < 0) top = 5; // Minimum top margin
    //     tooltip.classList.add('off-screen-bottom');
    // }
    console.log(left+"()"+top)
    // left = 1255 top = 495
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

function showPrerequisitesOnHover(box) {
    const prereqs = box.getAttribute('prereq');
    const coreqs = box.getAttribute('coreq');
    const courseCodeFull = box.getElementsByClassName('course-code-full')[0].innerHTML;
    const courseName = box.getElementsByClassName('course-name')[0]?.innerHTML || '';
    const boxId = box.id;
    console.log(boxId)
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
        console.log('Prereqs string:', prereqs);
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
    if (courseCodeFull == "PHIL 100 OR ENGL 200 OR MEST 100 (3&nbsp;Cr.)"){
        desc = '<br>Critical Thinking and Reasoning <br>OR<br> Advanced Composition <br><div style="color:#ba0000;">*ENGL 200 requires ENGL 101</div>OR<br> Introduction to Islam in World Culture';
    }
    else if(courseCodeFull == "ARAB 210 OR ARAB 211 (3&nbsp;Cr.)"){
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


function boxOnLeave() {
    if (box_focused) return;
    console.log('Box leave');
    hidePrerequisitesTooltip();
    showAllElements();
}

function boxOnClick(event) {
    console.log('Box click:', event.target);
    focusBox(event.target);
    hidePrerequisitesTooltip();
}

function rootDivClicked(event) {
    if (!event.target.classList.contains('classBox') &&
        !event.target.classList.contains('course-code-full') &&
        !event.target.classList.contains('course-name')) {
        console.log('Root div clicked');
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
    console.log('Highlighting course:', source.id);
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
    console.log('Showing all elements');
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
    console.log('Focusing on box:', source.id);
    if (box_focused) {
        unfocusBox();  // Unfocus the previous box if there is one focused
    }
    box_focused = source.id;
    highlightCourse(source);
}

function unfocusBox() {
    console.log('Unfocusing box');
    if (!box_focused) return;
    box_focused = false;
    showAllElements();

}
function setupArrows() {
    console.log('Setting up arrows');
    const classBoxes = document.getElementsByClassName("classBox");
    const svgConns = document.getElementsByClassName("svgConns")[0];
    const bodyRect = document.body.getBoundingClientRect();
    svgConns.style.position = 'absolute';
    svgConns.style.top = '0';
    svgConns.style.left = '0';
    svgConns.style.width = bodyRect.width + 'px';
    svgConns.style.height = bodyRect.height + 'px';
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
                            y1 = parseFloat(connectionElement.style.top)  + (parseFloat(connectionElement.offsetHeight || 0) / 32);
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
