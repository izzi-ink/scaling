// Wait for DOM and Chart.js to load before initializing
document.addEventListener('DOMContentLoaded', initializeApp);

// Show loading indicator
const loadingIndicator = document.getElementById('loadingIndicator');
if (loadingIndicator) {
    loadingIndicator.style.display = 'flex';
}

function initializeApp() {
    // Ensure Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded yet, waiting...');
        setTimeout(initializeApp, 100);
        return;
    }
    
    // Log initial attributes state for debugging
    console.log('Initial attributes:', JSON.stringify(attributes));
    console.log('Attribute clusters:', JSON.stringify(attributeClusters));
    
    // Verify attributes exist for all sliders
    Object.values(attributeClusters).forEach(cluster => {
        cluster.attributes.forEach(attr => {
            if (attributes[attr] === undefined) {
                console.error(`Missing attribute in initial state: ${attr}`);
                attributes[attr] = 1; // Set default value
            }
        });
    });
    
    // Start initializing the application
    createSliders();
    initializeCharts();
    updateAnalysis();
    setupThemeToggle();
    setupKeyboardNavigation();
    setupExportFeature();
    
    // Hide loading indicator
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Attribute descriptions for tooltips
const attributeDescriptions = {
    roleSpecialization: "The degree to which work is divided into distinct specialized roles",
    processFormalization: "How codified and documented organizational processes are",
    communicationChannels: "The variety and complexity of information flow paths",
    hierarchyLevels: "Number of management layers in the organization",
    decisionMakingDistribution: "How decentralized decision authority is",
    knowledgeManagement: "Systems for capturing, storing and sharing organizational knowledge",
    functionalDepartments: "Degree of specialized departmental division",
    crossFunctionalIntegration: "Mechanisms for coordination across different functions",
    standardizationLevel: "Consistency of processes, outputs and skills across the organization",
    systemsComplexity: "Sophistication of organizational systems and infrastructure"
};

// Initial attributes for organizational evolution
const attributes = {
    roleSpecialization: 2,
    processFormalization: 2,
    communicationChannels: 3,
    hierarchyLevels: 1,
    decisionMakingDistribution: 1,
    knowledgeManagement: 2,
    functionalDepartments: 1,
    crossFunctionalIntegration: 4,
    standardizationLevel: 1,
    systemsComplexity: 2
};

// Presets for different organizational stages
const stagePresets = {
    startup: {
        roleSpecialization: 2,
        processFormalization: 2,
        communicationChannels: 3,
        hierarchyLevels: 1,
        decisionMakingDistribution: 1,
        knowledgeManagement: 2,
        functionalDepartments: 1,
        crossFunctionalIntegration: 4,
        standardizationLevel: 1,
        systemsComplexity: 2
    },
    growthPhase: {
        roleSpecialization: 5,
        processFormalization: 4,
        communicationChannels: 6,
        hierarchyLevels: 3,
        decisionMakingDistribution: 3,
        knowledgeManagement: 5,
        functionalDepartments: 4,
        crossFunctionalIntegration: 7,
        standardizationLevel: 4,
        systemsComplexity: 5
    },
    established: {
        roleSpecialization: 8,
        processFormalization: 7,
        communicationChannels: 9,
        hierarchyLevels: 5,
        decisionMakingDistribution: 6,
        knowledgeManagement: 7,
        functionalDepartments: 7,
        crossFunctionalIntegration: 8,
        standardizationLevel: 7,
        systemsComplexity: 8
    },
    enterprise: {
        roleSpecialization: 10,
        processFormalization: 9,
        communicationChannels: 10,
        hierarchyLevels: 8,
        decisionMakingDistribution: 8,
        knowledgeManagement: 9,
        functionalDepartments: 10,
        crossFunctionalIntegration: 6,
        standardizationLevel: 10,
        systemsComplexity: 10
    }
};

// Current organization stage
let currentStage = 'startup';

// Define attribute clusters for organization categories
const attributeClusters = {
    structure: {
        label: 'Structural Evolution',
        attributes: ['hierarchyLevels', 'functionalDepartments', 'roleSpecialization', 'systemsComplexity']
    },
    functional: {
        label: 'Functional Specialization',
        attributes: ['processFormalization', 'standardizationLevel', 'knowledgeManagement', 'decisionMakingDistribution']
    },
    integration: {
        label: 'System Integration',
        attributes: ['communicationChannels', 'crossFunctionalIntegration']
    }
};

// Chart configuration for categories
const chartConfigs = {
    structure: {
        id: 'structureChart',
        color: 'rgba(54, 162, 235, 0.2)'
    },
    functional: {
        id: 'functionalChart',
        color: 'rgba(255, 99, 132, 0.2)'
    },
    integration: {
        id: 'integrationChart',
        color: 'rgba(75, 192, 192, 0.2)'
    }
};

// Store chart objects
const charts = {};

// Modified createSliders function
function createSliders() {
    // Create attribute sliders grouped by category
    Object.entries(attributeClusters).forEach(([category, cluster]) => {
        const categoryContainer = document.getElementById(`${category}Attributes`);
        if (!categoryContainer) return;
        
        // Clear container first
        categoryContainer.innerHTML = '';
        
        // Create all slider HTML first
        let slidersHTML = '';
        cluster.attributes.forEach(attr => {
            const formattedName = formatAttributeName(attr);
            const description = attributeDescriptions[attr] || '';
            
            slidersHTML += `
                <div class="attribute-slider tooltip">
                    <div class="attribute-header">
                        <label for="${attr}">${formattedName}</label>
                        <span id="${attr}Value">${attributes[attr]}/10</span>
                    </div>
                    <div class="slider-container">
                        <input type="range" min="1" max="10" value="${attributes[attr]}" 
                               id="${attr}" 
                               aria-valuemin="1" 
                               aria-valuemax="10" 
                               aria-valuenow="${attributes[attr]}"
                               aria-valuetext="${attributes[attr]} out of 10"
                               aria-label="${formattedName}"
                               oninput="updateAttribute('${attr}')"
                               onchange="updateAttribute('${attr}')">
                    </div>
                    <span class="tooltip-text">${description}</span>
                </div>
            `;
        });
        
        // Set all sliders at once
        categoryContainer.innerHTML = slidersHTML;
    });
    
    console.log('All sliders created with inline event handlers');
}

// Function to initialize charts
function initializeCharts() {
    // Initialize charts
    Object.entries(attributeClusters).forEach(([key, cluster]) => {
        const chartElement = document.getElementById(chartConfigs[key].id);
        if (!chartElement) {
            console.error(`Chart element not found: ${chartConfigs[key].id}`);
            return;
        }
        
        // Debug data mapping
        console.log(`Initializing ${key} chart with attributes:`, cluster.attributes);
        
        // Map values and check for undefined
        const data = [];
        const labels = [];
        
        cluster.attributes.forEach((attr, index) => {
            const value = attributes[attr];
            const label = formatAttributeName(attr);
            
            // Debug each value mapping
            console.log(`Chart ${key}, attribute ${attr}: ${value} (${typeof value})`);
            
            if (value === undefined) {
                console.error(`❌ Missing value for ${attr} in ${key} chart`);
                data.push(1); // Default value
            } else {
                data.push(value);
            }
            
            labels.push(label);
        });
        
        // Store the attribute names with the chart for easier updates
        const mappedAttributes = [...cluster.attributes];
        
        const ctx = chartElement.getContext('2d');
        
        charts[key] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: cluster.label,
                    data: data,
                    backgroundColor: chartConfigs[key].color,
                    borderColor: chartConfigs[key].color.replace('0.2', '1'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        },
                        pointLabels: {
                            color: 'white',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            color: 'white',
                            backdropColor: 'transparent',
                            beginAtZero: true,
                            max: 10,
                            stepSize: 2
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const attrName = mappedAttributes[context.dataIndex];
                                return `${formatAttributeName(attrName)}: ${context.raw}/10`;
                            }
                        }
                    }
                }
            }
        });
        
        // Store the mapped attributes with the chart for updates
        charts[key].mappedAttributes = mappedAttributes;
    });
}

// Function to update attribute when slider changes
function updateAttribute(key) {
    const inputElement = document.getElementById(key);
    const value = inputElement.value;
    
    // Log for debugging
    console.log(`Updating attribute: ${key} to value: ${value}`);
    
    // Update the value in the attributes object
    attributes[key] = parseInt(value);
    
    // Debug the current state of attributes
    console.log('Current attributes:', JSON.stringify(attributes));
    
    // Update text display
    document.getElementById(`${key}Value`).textContent = `${value}/10`;
    
    // Update ARIA properties
    inputElement.setAttribute('aria-valuenow', value);
    inputElement.setAttribute('aria-valuetext', `${value} out of 10`);
    
    // Update charts and analysis
    updateCharts();
    updateAnalysis();
}

// Update all charts
function updateCharts() {
    // Loop through all charts
    Object.keys(charts).forEach(key => {
        const chart = charts[key];
        
        // Use the stored mapped attributes to ensure correct order
        if (!chart.mappedAttributes) {
            console.error(`Chart ${key} missing mappedAttributes!`);
            return;
        }
        
        // Log for debugging
        console.log(`Updating ${key} chart with attributes:`, chart.mappedAttributes);
        
        // Build new data array based on stored attribute mapping
        const newData = [];
        
        chart.mappedAttributes.forEach((attr, index) => {
            const value = attributes[attr];
            
            if (value === undefined) {
                console.error(`Value for attribute ${attr} is undefined!`);
                // Use existing value as fallback or default to 1
                const existingValue = chart.data.datasets[0].data[index] || 1;
                newData.push(existingValue);
            } else {
                // Log successful update
                console.log(`Chart ${key}, updating ${attr} to ${value}`);
                newData.push(value);
            }
        });
        
        // Update chart data with the new values
        chart.data.datasets[0].data = newData;
        chart.update();
    });
}

// Apply a preset stage
function applyStagePreset(stage) {
    // Show loading indicator briefly for visual feedback
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'flex';
    
    // Set a small timeout to ensure the UI updates
    setTimeout(() => {
        console.log(`Applying preset: ${stage}`);
        currentStage = stage;
        
        // Update UI for active button and ARIA states
        document.querySelectorAll('.button-group button').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        const activeButton = document.getElementById(`${stage}Btn`);
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-pressed', 'true');
        
        // First, ensure all attributes from all clusters are included in the attributes object
        Object.values(attributeClusters).forEach(cluster => {
            cluster.attributes.forEach(attr => {
                if (attributes[attr] === undefined) {
                    attributes[attr] = 1; // Set default value
                    console.warn(`Added missing attribute: ${attr}`);
                }
            });
        });
        
        // Apply preset values and update UI
        const preset = stagePresets[stage];
        console.log(`Preset values:`, preset);
        
        Object.keys(preset).forEach(attr => {
            // Update the attribute value
            attributes[attr] = preset[attr];
            
            // Update the slider if it exists
            const inputElement = document.getElementById(attr);
            if (inputElement) {
                inputElement.value = attributes[attr];
                
                // Update ARIA properties
                inputElement.setAttribute('aria-valuenow', attributes[attr]);
                inputElement.setAttribute('aria-valuetext', `${attributes[attr]} out of 10`);
                
                // Update visible value
                const valueElement = document.getElementById(`${attr}Value`);
                if (valueElement) {
                    valueElement.textContent = `${attributes[attr]}/10`;
                } else {
                    console.warn(`Value element not found for: ${attr}Value`);
                }
            } else {
                console.warn(`Input element not found for: ${attr}`);
            }
        });
        
        // Verify all attributes were updated
        console.log('Updated attributes:', JSON.stringify(attributes));
        
        // Update charts with the new values
        updateCharts();
        updateAnalysis();
        
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        
        // Log a confirmation
        console.log(`Successfully applied ${stage} preset`);
    }, 300);
}

// Calculate average for a cluster
function calculateClusterAverage(clusterKey) {
    const cluster = attributeClusters[clusterKey];
    const sum = cluster.attributes.reduce((acc, attr) => acc + attributes[attr], 0);
    return sum / cluster.attributes.length;
}

// Removed duplicate formatAttributeName function - now only defined once above

// Generate category-specific analysis
function updateCategoryAnalysis() {
    // Structure Analysis
    const structureAvg = calculateClusterAverage('structure');
    const structureAnalysis = [];
    
    if (structureAvg < 4) {
        structureAnalysis.push('Flat structure with generalist roles and minimal hierarchy');
    } else if (structureAvg < 7) {
        structureAnalysis.push('Developing specialized departments with defined reporting structures');
    } else {
        structureAnalysis.push('Complex hierarchical structures with highly specialized roles');
    }
    
    if (attributes.hierarchyLevels > 7 && attributes.roleSpecialization < 5) {
        structureAnalysis.push('Warning: High hierarchy with low role specialization may lead to inefficient management');
    }
    
    document.getElementById('structureAnalysis').innerHTML = 
        structureAnalysis.map(text => `<p>${text}</p>`).join('');
    
    // Functional Analysis
    const functionalAvg = calculateClusterAverage('functional');
    const functionalAnalysis = [];
    
    if (functionalAvg < 4) {
        functionalAnalysis.push('Informal processes with ad-hoc decision making and minimal standardization');
    } else if (functionalAvg < 7) {
        functionalAnalysis.push('Developing formal processes with standardized procedures and distributed decision-making');
    } else {
        functionalAnalysis.push('Highly formalized processes with extensive standardization and structured knowledge management');
    }
    
    if (attributes.processFormalization > 8 && attributes.knowledgeManagement < 5) {
        functionalAnalysis.push('Warning: High process formalization without adequate knowledge management may lead to bureaucracy');
    }
    
    document.getElementById('functionalAnalysis').innerHTML = 
        functionalAnalysis.map(text => `<p>${text}</p>`).join('');
    
    // Integration Analysis
    const integrationAvg = calculateClusterAverage('integration');
    const integrationAnalysis = [];
    
    if (integrationAvg < 4) {
        integrationAnalysis.push('Simple, direct communication channels with natural cross-functional collaboration');
    } else if (integrationAvg < 7) {
        integrationAnalysis.push('Increasing communication complexity with dedicated integration mechanisms');
    } else {
        integrationAnalysis.push('Complex, formalized communication channels requiring intentional coordination');
    }
    
    if (attributes.communicationChannels > 8 && attributes.crossFunctionalIntegration < 5) {
        integrationAnalysis.push('Warning: Complex communication channels with low cross-functional integration may lead to information silos');
    }
    
    document.getElementById('integrationAnalysis').innerHTML = 
        integrationAnalysis.map(text => `<p>${text}</p>`).join('');
}

// Generate overall analysis
function updateOverallAnalysis() {
    const structureAvg = calculateClusterAverage('structure');
    const functionalAvg = calculateClusterAverage('functional');
    const integrationAvg = calculateClusterAverage('integration');
    
    const overallAnalysis = [];
    
    // Overall maturity assessment
    const overallAvg = (structureAvg + functionalAvg + integrationAvg) / 3;
    if (overallAvg < 3) {
        overallAnalysis.push('Early-stage startup with single-function phase characteristics');
    } else if (overallAvg < 5) {
        overallAnalysis.push('Growth-stage organization with emerging specialization');
    } else if (overallAvg < 8) {
        overallAnalysis.push('Established organization with defined functional boundaries');
    } else {
        overallAnalysis.push('Enterprise-level organization with high specialization and formalization');
    }
    
    // Structure vs Function balance
    if (Math.abs(structureAvg - functionalAvg) > 3) {
        if (structureAvg > functionalAvg) {
            overallAnalysis.push('Structural complexity outpaces process maturity, which may lead to organizational confusion');
        } else {
            overallAnalysis.push('Process formalization exceeds structural development, which may create unnecessary bureaucracy');
        }
    }
    
    // Integration vs. Structure balance
    if (structureAvg > 7 && integrationAvg < 5) {
        overallAnalysis.push('High structural complexity with inadequate integration mechanisms may lead to organizational silos');
    }
    
    // Evolution advice based on stage
    if (currentStage === 'startup' && overallAvg > 5) {
        overallAnalysis.push('Organization has evolved beyond typical startup patterns and may be experiencing premature complexity');
    } else if (currentStage === 'enterprise' && overallAvg < 6) {
        overallAnalysis.push('Organization has enterprise aspirations but lacks the necessary structural and procedural maturity');
    }
    
    document.getElementById('analysisContent').innerHTML = 
        overallAnalysis.map(text => `<p>${text}</p>`).join('');
}

// Update all analysis sections
function updateAnalysis() {
    updateCategoryAnalysis();
    updateOverallAnalysis();
}

// Format attribute name from camelCase to Title Case with spaces 
// (moved function up since it's used in createSliders)
function formatAttributeName(attr) {
    return attr
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
}

// Theme toggling functionality
function setupThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const root = document.documentElement;
    
    // Check system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check local storage for saved preference
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (savedTheme === 'light') {
        root.classList.add('light-theme');
        updateThemeIcon('light');
    } else if (savedTheme === 'dark') {
        root.classList.add('dark-theme');
        updateThemeIcon('dark');
    } else {
        // Use system preference by default
        if (!prefersDarkScheme) {
            root.classList.add('light-theme');
            updateThemeIcon('light');
        } else {
            updateThemeIcon('dark');
        }
    }
    
    // Theme toggle click handler
    themeToggleBtn.addEventListener('click', () => {
        // Toggle theme
        if (root.classList.contains('light-theme')) {
            root.classList.remove('light-theme');
            root.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon('dark');
        } else {
            root.classList.remove('dark-theme');
            root.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            updateThemeIcon('light');
        }
        
        // Update charts for new theme
        Object.values(charts).forEach(chart => {
            // Update chart colors
            updateChartTheme(chart);
            chart.update();
        });
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'light') {
            // Moon icon for light theme
            themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
            themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
        } else {
            // Sun icon for dark theme
            themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
            themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
        }
    }
    
    function updateChartTheme(chart) {
        const isLight = root.classList.contains('light-theme');
        
        // Update chart text colors
        chart.options.scales.r.pointLabels.color = isLight ? '#333' : 'white';
        chart.options.scales.r.ticks.color = isLight ? '#333' : 'white';
        chart.options.plugins.legend.labels.color = isLight ? '#333' : 'white';
        
        // Update grid colors
        chart.options.scales.r.grid.color = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)';
        chart.options.scales.r.angleLines.color = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)';
    }
}

// Add keyboard navigation for sliders
function setupKeyboardNavigation() {
    // Improve keyboard accessibility for sliders
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('keydown', (e) => {
            // Arrow keys for fine-grained control
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                slider.value = Math.min(parseInt(slider.value) + 1, 10);
                updateAttribute(slider.id);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                slider.value = Math.max(parseInt(slider.value) - 1, 1);
                updateAttribute(slider.id);
            }
        });
    });
}

// Setup save/export functionality
function setupExportFeature() {
    // Create export button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Configuration';
    exportBtn.className = 'export-btn';
    exportBtn.setAttribute('aria-label', 'Export your current configuration as JSON');
    
    // Add to page
    document.querySelector('.analysis').appendChild(exportBtn);
    
    // Add export handler
    exportBtn.addEventListener('click', () => {
        // Create configuration object
        const config = {
            stage: currentStage,
            attributes: {...attributes},
            timestamp: new Date().toISOString()
        };
        
        // Create download link
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `org-evolution-${currentStage}-${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    });
}

// No need for another DOMContentLoaded listener as we're initializing in initializeApp

// Add a global debug function to force chart updates and print detailed information
window.debugCharts = function() {
    console.clear();
    console.log('===== CHART DEBUGGING INFORMATION =====');
    
    // 1. Check all attributes
    console.log('\n1. CURRENT ATTRIBUTE VALUES:');
    const attributesList = Object.entries(attributes).map(([key, value]) => `${key}: ${value}`);
    console.table(attributes);
    
    // 2. Check cluster configurations
    console.log('\n2. CLUSTER CONFIGURATIONS:');
    Object.entries(attributeClusters).forEach(([key, cluster]) => {
        console.log(`- ${key} (${cluster.label}):`);
        cluster.attributes.forEach(attr => {
            console.log(`  • ${attr}: ${attributes[attr] !== undefined ? attributes[attr] : 'UNDEFINED ❌'}`);
        });
    });
    
    // 3. Check slider-to-attribute mapping
    console.log('\n3. SLIDER-TO-ATTRIBUTE MAPPING:');
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        const id = slider.id;
        const value = slider.value;
        const storedValue = attributes[id];
        
        if (storedValue === undefined) {
            console.error(`  ❌ Slider ${id} = ${value}, but attributes[${id}] is UNDEFINED`);
        } else if (parseInt(value) !== parseInt(storedValue)) {
            console.error(`  ❌ Slider ${id} = ${value}, but attributes[${id}] = ${storedValue} (MISMATCH)`);
        } else {
            console.log(`  ✓ Slider ${id} = ${value} matches attributes[${id}] = ${storedValue}`);
        }
    });
    
    // 4. Check chart data
    console.log('\n4. CHART DATA:');
    Object.keys(charts).forEach(key => {
        const chart = charts[key];
        console.log(`- ${key} Chart:`);
        
        if (!chart.mappedAttributes) {
            console.error(`  ❌ Chart ${key} missing mappedAttributes!`);
            return;
        }
        
        // Check if chart data matches attribute values
        chart.mappedAttributes.forEach((attr, index) => {
            const chartValue = chart.data.datasets[0].data[index];
            const attrValue = attributes[attr];
            const label = chart.data.labels[index];
            
            if (attrValue === undefined) {
                console.error(`  ❌ ${label} (${attr}): Chart = ${chartValue}, Attribute = UNDEFINED`);
            } else if (chartValue !== attrValue) {
                console.error(`  ❌ ${label} (${attr}): Chart = ${chartValue}, Attribute = ${attrValue} (MISMATCH)`);
            } else {
                console.log(`  ✓ ${label} (${attr}): Chart = ${chartValue}, Attribute = ${attrValue}`);
            }
        });
    });
    
    // 5. Force refresh all charts
    console.log('\n5. FORCING CHART UPDATES...');
    updateCharts();
    
    console.log('\n===== DEBUG COMPLETE =====');
    console.log('If you see any UNDEFINED or MISMATCH errors above, those indicate problems.');
    console.log('Try clicking a preset button (like "Startup") to reset all values.');
}