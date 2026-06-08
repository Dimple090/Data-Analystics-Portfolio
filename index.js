// --- PORTFOLIO DATA ANALYTICS DATABASE ---
const DATABASE = {
    projects: [
        {
            id: 1,
            name: "OmniData: Business Analytics Sim",
            role: "Lead Architect",
            tech_stack: "JavaScript (ES6), HTML5, Canvas, SQL",
            impact_metric: "Real-time Tableau data modeling",
            description: "Client-side Single Page Application modeling logistics, retail, and financial feedback loops on the Tableau Superstore dataset."
        },
        {
            id: 2,
            name: "KalaKart: Artisan E-Commerce",
            role: "Full-Stack Developer",
            tech_stack: "React.js, Redux, Node.js, Express, MongoDB, JWT",
            impact_metric: "35% API latency & 22% bounce rate reduction",
            description: "Secure full-stack e-commerce app with role-based JWT authentication and bcrypt credential encryption."
        },
        {
            id: 3,
            name: "Anabella Bot: AI Assistant",
            role: "Python Developer",
            tech_stack: "Python, Google APIs, OAuth 2.0, Cron",
            impact_metric: "85% automated workflow latency reduction",
            description: "Python virtual assistant automating productivity workflows like email dispatch and scheduling via OAuth 2.0."
        }
    ],
    skills: [
        { skill_name: "SQL (Structured Query Language)", category: "Databases", proficiency: "90%", primary_use: "Complex reporting, joins, query optimization" },
        { skill_name: "MongoDB & NoSQL Databases", category: "Databases", proficiency: "85%", primary_use: "Schema design, compound indexing" },
        { skill_name: "Python (Pandas, NumPy, Scripting)", category: "Analytics Tools", proficiency: "85%", primary_use: "Data manipulation, reporting, pipeline automation" },
        { skill_name: "Tableau & BI Dashboards", category: "Analytics Tools", proficiency: "85%", primary_use: "KPI visualization, retail analytics modeling" },
        { skill_name: "C++ (Data Structs & Performance)", category: "Programming", proficiency: "80%", primary_use: "Algorithmic data structures, pipeline processing" },
        { skill_name: "JavaScript (Interactive SPAs)", category: "Programming", proficiency: "90%", primary_use: "Client-side charts, real-time KPI engines" },
        { skill_name: "React.js & State Management", category: "Development", proficiency: "90%", primary_use: "State-driven analytical web dashboards" },
        { skill_name: "Node.js / Express.js Backend", category: "Development", proficiency: "80%", primary_use: "RESTful API data endpoints" },
        { skill_name: "Git & GitHub Version Control", category: "Tools", proficiency: "90%", primary_use: "Version control & collaboration" },
        { skill_name: "Postman (API Schema Validation)", category: "Tools", proficiency: "90%", primary_use: "Schema contracts & API response testing" },
        { skill_name: "Wireshark Packet Analysis", category: "Tools", proficiency: "70%", primary_use: "Network data flow & traffic analysis" }
    ],
    experience: [
        {
            role: "Web Analytics & Dashboard Intern",
            company: "PrernaGati Technology",
            duration: "July 2024 -- August 2024",
            focus_area: "User telemetry analysis, dashboard loading speeds",
            metrics_achieved: "+18% active user engagement, +35% faster rendering"
        },
        {
            role: "Data Pipeline Optimization Intern",
            company: "Programming Pathshala",
            duration: "June 2023 -- July 2023",
            focus_area: "Algorithmic processing pipelines & execution footprints",
            metrics_achieved: "O(N log N) data throughput (+25%), -15% RAM footprint"
        }
    ],
    education: [
        {
            degree: "B.E. Computer Science & Engineering",
            institution: "MIET Jammu",
            duration: "2022 -- 2026",
            academic_focus: "Database Management (DBMS), Data Structures, Statistics & OOP"
        }
    ]
};

// --- MOCK SQL ENGINE ---
function runMockSQL(queryText) {
    const startTime = performance.now();
    
    // Clean and validate query input
    let query = queryText.trim().replace(/;+$/, "").replace(/\s+/g, " ");
    
    // Regular Expression to parse standard SELECT queries:
    // SELECT <columns> FROM <table> [WHERE <col> =|LIKE <val>] [LIMIT <num>]
    const selectPattern = /^select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(.+?))?(?:\s+limit\s+(\d+))?$/i;
    const match = query.match(selectPattern);
    
    if (!match) {
        return {
            error: "Syntax Error: Only standard SELECT queries are supported.<br>Example: <code>SELECT * FROM projects;</code> or <code>SELECT name, tech_stack FROM projects WHERE tech_stack LIKE '%React%';</code>",
            time: 0
        };
    }
    
    const selectCols = match[1].trim();
    const tableName = match[2].trim().toLowerCase();
    const whereClause = match[3] ? match[3].trim() : null;
    const limitVal = match[4] ? parseInt(match[4].trim()) : null;
    
    // Check if table exists in DB
    if (!DATABASE.hasOwnProperty(tableName)) {
        return {
            error: `Table <code>${tableName}</code> not found. Available tables: <b>projects</b>, <b>skills</b>, <b>experience</b>, <b>education</b>.`,
            time: 0
        };
    }
    
    let rows = JSON.parse(JSON.stringify(DATABASE[tableName])); // deep clone data
    
    // Handle WHERE filter
    if (whereClause) {
        // Matches col = 'value' or col = value
        const eqPattern = /^(\w+)\s*=\s*['"]?([^'"]+?)['"]?$/i;
        // Matches col LIKE '%value%' or col LIKE 'value'
        const likePattern = /^(\w+)\s+like\s+['"]%?([^'"]+?)%?['"]$/i;
        
        let eqMatch = whereClause.match(eqPattern);
        let likeMatch = whereClause.match(likePattern);
        
        if (eqMatch) {
            let colName = eqMatch[1].toLowerCase();
            let targetVal = eqMatch[2].toLowerCase();
            
            rows = rows.filter(row => {
                let actualKey = Object.keys(row).find(k => k.toLowerCase() === colName);
                if (!actualKey) return false;
                return String(row[actualKey]).toLowerCase() === targetVal;
            });
        } else if (likeMatch) {
            let colName = likeMatch[1].toLowerCase();
            let targetVal = likeMatch[2].toLowerCase();
            
            rows = rows.filter(row => {
                let actualKey = Object.keys(row).find(k => k.toLowerCase() === colName);
                if (!actualKey) return false;
                return String(row[actualKey]).toLowerCase().includes(targetVal);
            });
        } else {
            return {
                error: "Unsupported WHERE filter. Please use simple comparison (e.g. <code>tech_stack LIKE '%React%'</code> or <code>role = 'Python Developer'</code>).",
                time: 0
            };
        }
    }
    
    // Handle specific columns selection
    let columns = [];
    if (rows.length > 0) {
        if (selectCols === "*") {
            columns = Object.keys(rows[0]);
        } else {
            columns = selectCols.split(",").map(c => c.trim());
            // Verify if requested columns exist
            const firstRowKeys = Object.keys(rows[0]).map(k => k.toLowerCase());
            for (let requestedCol of columns) {
                if (!firstRowKeys.includes(requestedCol.toLowerCase())) {
                    return {
                        error: `Column <code>${requestedCol}</code> does not exist on table <code>${tableName}</code>.`,
                        time: 0
                    };
                }
            }
            // Map rows to selected columns
            rows = rows.map(row => {
                let selectedRow = {};
                columns.forEach(col => {
                    let actualKey = Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase());
                    selectedRow[col] = row[actualKey];
                });
                return selectedRow;
            });
        }
    } else {
        columns = selectCols === "*" ? ["result"] : selectCols.split(",").map(c => c.trim());
    }
    
    // Handle LIMIT limitVal
    if (limitVal !== null && !isNaN(limitVal)) {
        rows = rows.slice(0, limitVal);
    }
    
    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(3);
    
    return {
        columns: columns,
        rows: rows,
        time: timeTaken
    };
}

// --- RENDERING ENGINE RESULTS ---
function displayQueryResults(results) {
    const outputDiv = document.getElementById("queryResultsOutput");
    const statusText = document.getElementById("sqlConsoleStatus");
    const execTimeText = document.getElementById("sqlConsoleTime");
    
    outputDiv.innerHTML = "";
    
    if (results.error) {
        outputDiv.innerHTML = `<div class="results-empty" style="color: #ff5f56;"><i class="fa-solid fa-triangle-exclamation"></i>&nbsp;<span>${results.error}</span></div>`;
        statusText.textContent = "Query execution failed.";
        statusText.style.color = "#ff5f56";
        execTimeText.textContent = "0.00ms";
        return;
    }
    
    if (results.rows.length === 0) {
        outputDiv.innerHTML = `<div class="results-empty"><i class="fa-solid fa-folder-open"></i>&nbsp;<span>Query executed successfully, but returned 0 rows.</span></div>`;
        statusText.textContent = "Returned 0 rows.";
        statusText.style.color = "var(--text-secondary)";
        execTimeText.textContent = `${results.time}ms`;
        return;
    }
    
    // Build HTML Table structure
    let tableHtml = `<table class="results-table"><thead><tr>`;
    results.columns.forEach(col => {
        tableHtml += `<th>${col}</th>`;
    });
    tableHtml += `</tr></thead><tbody>`;
    
    results.rows.forEach(row => {
        tableHtml += `<tr>`;
        results.columns.forEach(col => {
            tableHtml += `<td>${row[col] !== undefined ? row[col] : "NULL"}</td>`;
        });
        tableHtml += `</tr>`;
    });
    tableHtml += `</tbody></table>`;
    
    outputDiv.innerHTML = tableHtml;
    statusText.textContent = `Returned ${results.rows.length} row(s) successfully.`;
    statusText.style.color = "#27c93f";
    execTimeText.textContent = `${results.time}ms`;
}

// --- SKILLS PROGRESS METER ANIMATIONS ---
function triggerSkillAnimations() {
    const activePane = document.querySelector(".skills-pane.active");
    if (!activePane) return;
    
    const skillFills = activePane.querySelectorAll(".skill-fill");
    skillFills.forEach(fill => {
        const targetWidth = fill.getAttribute("data-width");
        fill.style.width = targetWidth;
    });
}

// --- EVENT LISTENERS & INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Sticky Header Scroll ---
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("navbar-scrolled");
        } else {
            navbar.classList.remove("navbar-scrolled");
        }
        
        // Active Nav Indicator on Scroll
        const sections = document.querySelectorAll("section");
        const navLinks = document.querySelectorAll(".nav-links .nav-link");
        
        let currentSectionId = "";
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.clientHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSectionId = sec.getAttribute("id");
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove("active-link");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active-link");
            }
        });
    });
    
    // --- SQL Editor Interface handlers ---
    const sqlEditor = document.getElementById("sqlEditor");
    const btnRunQuery = document.getElementById("btnRunQuery");
    
    // Execute query function
    const executeCurrentEditorQuery = () => {
        const queryText = sqlEditor.value;
        const results = runMockSQL(queryText);
        displayQueryResults(results);
    };
    
    btnRunQuery.addEventListener("click", executeCurrentEditorQuery);
    
    // Allow Ctrl+Enter to execute queries
    sqlEditor.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            executeCurrentEditorQuery();
        }
    });
    
    // Sidebar table selector clicks
    const tableItems = document.querySelectorAll(".sql-table-item");
    tableItems.forEach(item => {
        item.addEventListener("click", () => {
            tableItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            
            const tableName = item.getAttribute("data-table");
            sqlEditor.value = `SELECT * FROM ${tableName};`;
            executeCurrentEditorQuery();
        });
    });
    
    // Preset queries clicks
    const presetBtns = document.querySelectorAll(".sql-preset-btn");
    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const query = btn.getAttribute("data-query");
            sqlEditor.value = query;
            
            // Highlight matching sidebar table if query is a simple SELECT * FROM table
            const fromMatch = query.match(/from\s+(\w+)/i);
            if (fromMatch) {
                const tableName = fromMatch[1].toLowerCase();
                tableItems.forEach(i => {
                    if (i.getAttribute("data-table") === tableName) {
                        i.classList.add("active");
                    } else {
                        i.classList.remove("active");
                    }
                });
            }
            
            executeCurrentEditorQuery();
        });
    });
    
    // Execute default query on load
    executeCurrentEditorQuery();
    
    // --- Skills Tabs Selector ---
    const tabBtns = document.querySelectorAll(".skills-tab-btn");
    const skillPanes = document.querySelectorAll(".skills-pane");
    
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            skillPanes.forEach(p => {
                p.classList.remove("active");
                // Reset skill fill widths to animate again when selected
                p.querySelectorAll(".skill-fill").forEach(fill => {
                    fill.style.width = "0%";
                });
            });
            
            btn.classList.add("active");
            const tabId = btn.getAttribute("data-tab");
            const activePane = document.getElementById(tabId);
            activePane.classList.add("active");
            
            // Animate skills fill in active pane (slight timeout to trigger repaint)
            setTimeout(triggerSkillAnimations, 50);
        });
    });
    
    // Skill fills scroll trigger
    const skillsSection = document.getElementById("skills");
    let skillsAnimated = false;
    
    const checkSkillsScroll = () => {
        if (skillsAnimated) return;
        const rect = skillsSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.75) {
            triggerSkillAnimations();
            skillsAnimated = true;
            window.removeEventListener("scroll", checkSkillsScroll);
        }
    };
    
    window.addEventListener("scroll", checkSkillsScroll);
    // Call once initially in case skills is already in view
    checkSkillsScroll();
});
