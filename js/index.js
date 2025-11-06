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

    const switchColorButton = document.getElementById('switch-color-code');
    if (switchColorButton) {
        switchColorButton.addEventListener('click', toggle_color_code_clicked);
    } else {
        console.error('Switch color code button not found');
    }

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


function showPrerequisitesOnHover(box) {
    const prereqs = box.getAttribute('prereq');
    const coreqs = box.getAttribute('coreq');
    const courseCodeFull = box.getElementsByClassName('course-code-full')[0].innerHTML;
    let prereqText = '';
    let coreqText = '';

    if (prereqs && prereqs !== '') {
        let prereqArray;
        console.log('Prereqs string:', prereqs);
        const tempprereqArray = prereqs.split(' ');

        if ( tempprereqArray[0] && tempprereqArray[0].substring(0, 10) === "Completion") {
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
                const options = prereqId.split('or').map(option => option.trim());
                prereqText += options.join(' or ') + ', ';
            } else {

                const prereqElement = document.getElementById(prereqId);
                if (prereqElement) {
                    const prereqCourseCode = prereqElement.getElementsByClassName('course-code-full')[0].innerHTML;
                    prereqText += prereqCourseCode + ', ';
                } else {
                    prereqText += prereqId + ', ';
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
                const options = coreqId.split('or').map(option => option.trim());
                coreqText += options.join(' or ') + ', ';
            }
            else{
                const coreqElement = document.getElementById(coreqId);
                if (coreqElement) {
                    const coreqCourseCode = coreqElement.getElementsByClassName('course-code-full')[0].innerHTML;
                    coreqText += coreqCourseCode + ', ';
                } else {
                    coreqText += coreqId + ', ';
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

    tooltip.innerHTML = `<strong>${courseCodeFull}</strong>` +
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
    hidePrerequisitesTooltip(); // Hide tooltip when clicking
    focusBox(event.target);
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
    document.getElementById('explain-main').style.display = 'block';
    document.getElementById('explain-hint').style.display = 'none';
    document.getElementById('explain-topp').innerHTML = `${source.getElementsByClassName('course-code-full')[0].innerHTML}<br>${source.getElementsByClassName('course-name')[0].innerHTML}`;
    document.getElementById('explain-desc').innerHTML = source.getElementsByClassName('course-description')[0].innerHTML;
    const prereqs = source.getAttribute('prereq').split(' ');
    const prereqList = document.getElementById('explain-prereq-list');
    prereqList.innerHTML = '';
    if (prereqs.length > 0 && prereqs[0] !== '') {
        document.getElementById('explain-prereq-list-div').style.display = 'block';
        prereqs.forEach(prereq => {
            prereqList.innerHTML += `<li>${prereq}</li>`;
        });
    } else {
        document.getElementById('explain-prereq-list-div').style.display = 'none';
    }
}

function unfocusBox() {
    console.log('Unfocusing box');
    if (!box_focused) return;
    box_focused = false;
    showAllElements();
    document.getElementById('explain-main').style.display = 'none';
    document.getElementById('explain-hint').style.display = 'block';
}
function setupArrows() {
    console.log('Setting up arrows');
    const classBoxes = document.getElementsByClassName("classBox");
    const svgConns = document.getElementsByClassName("svgConns")[0];
    
    function checkSymmetricCoreq(courseA, courseB) {
        const elementA = document.getElementById(courseA);
        const elementB = document.getElementById(courseB);
        
        if (!elementA || !elementB) return false;
        
        const coreqsA = parsePrereqs(elementA.getAttribute("coreq"));
        const coreqsB = parsePrereqs(elementB.getAttribute("coreq"));
        
        // Check if both courses list each other as corequisites
        return coreqsA.includes(courseB) && coreqsB.includes(courseA);
    }
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
                            x2 = parseFloat(targetBox.style.left);
                            y2 = parseFloat(targetBox.style.top) + (parseFloat(targetBox.offsetHeight || 0) / 32);
                        } else {
                            // Source is to the right of target: draw arrow from left to right
                            x1 = parseFloat(connectionElement.style.left);  
                            y1 = parseFloat(connectionElement.style.top) + (parseFloat(connectionElement.offsetHeight || 0) / 32);
                            x2 = parseFloat(targetBox.style.left)-0.4 + (parseFloat(targetBox.offsetWidth || 0) / 16);
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
        // Prerequisite arrows (white)
        const prereqs = box.getAttribute("prereq");
        if (prereqs) {
            // Split the prereqs based on "or" inside parentheses
            const prereqArray = parsePrereqs(prereqs);
            const createPrereqArrows = createArrowsForConnections(box, "stroke:rgb(255,255,255);stroke-width:1;opacity:0", 'prereq-arrow');
            createPrereqArrows(box, prereqArray);
        }

        // Corequisite arrows (blue)
        const coreqs = box.getAttribute("coreq");
        if (coreqs) {
            // Split the coreqs based on "or" inside parentheses
            const coreqArray = parsePrereqs(coreqs);
            const createCoreqArrows = createArrowsForConnections(box, "stroke:#00ff88;stroke-width:1;opacity:0", 'coreq-arrow');
            createCoreqArrows(box, coreqArray);
        }
    }

    // Function to parse prerequisite or corequisite strings and split by "or" inside parentheses
    function parsePrereqs(prereqString) {
        // This regular expression will find content inside parentheses and split by "or"
        // EEEN280orMENG231 -> ["EEEN280", "MENG231"]
        const regex = /\((.*?)\)/g;
        let matches = [];
        let match;
        while (match = regex.exec(prereqString)) {
            const alternatives = match[1].split('or').map(item => item.trim());
            matches = matches.concat(alternatives); // Add each alternative found in parentheses
        }

        // Also add any prerequisites/corequisites that aren't inside parentheses
        // Split by spaces, then for each item, if it contains 'or', split further
        const outsideParentheses = prereqString
            .split(' ')
            .filter(item => !item.includes('(') && !item.includes(')'))
            .flatMap(item => item.includes('or') ? item.split('or').map(i => i.trim()) : [item.trim()])
            .filter(item => item !== '');

        matches = matches.concat(outsideParentheses);

        return matches;
    }
}
