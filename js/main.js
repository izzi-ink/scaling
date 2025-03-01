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

// Create attribute sliders grouped by category
Object.entries(attributeClusters).forEach(([category, cluster]) => {
    const categoryContainer = document.getElementById(`${category}Attributes`);
    cluster.attributes.forEach(attr => {
        const formattedName = formatAttributeName(attr);
        const sliderHtml = `
            <div class="attribute-slider">
                <div class="attribute-header">
                    <label>${formattedName}</label>
                    <span id="${attr}Value">${attributes[attr]}/10</span>
                </div>
                <div class="slider-container">
                    <input type="range" min="1" max="10" value="${attributes[attr]}" 
                           id="${attr}" onchange="updateAttribute('${attr}')">
                </div>
            </div>
        `;
        categoryContainer.innerHTML += sliderHtml;
    });
});

// Initialize charts
Object.entries(attributeClusters).forEach(([key, cluster]) => {
    const ctx = document.getElementById(chartConfigs[key].id).getContext('2d');
    
    charts[key] = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: cluster.attributes.map(attr => formatAttributeName(attr)),
            datasets: [{
                label: cluster.label,
                data: cluster.attributes.map(attr => attributes[attr]),
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
                        color: 'white'
                    },
                    ticks: {
                        color: 'white',
                        backdropColor: 'transparent',
                        beginAtZero: true,
                        max: 10
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
                            return `${context.dataset.label}: ${context.raw}/10`;
                        }
                    }
                }
            }
        }
    });
});

// Function to update attribute when slider changes
function updateAttribute(key) {
    const value = document.getElementById(key).value;
    attributes[key] = parseInt(value);
    document.getElementById(`${key}Value`).textContent = `${value}/10`;
    updateCharts();
    updateAnalysis();
}

// Update all charts
function updateCharts() {
    Object.entries(attributeClusters).forEach(([key, cluster]) => {
        charts[key].data.datasets[0].data = cluster.attributes.map(attr => attributes[attr]);
        charts[key].update();
    });
}

// Apply a preset stage
function applyStagePreset(stage) {
    currentStage = stage;
    
    // Update UI for active button
    document.querySelectorAll('.button-group button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${stage}Btn`).classList.add('active');
    
    // Apply preset values
    Object.keys(stagePresets[stage]).forEach(attr => {
        attributes[attr] = stagePresets[stage][attr];
        const inputElement = document.getElementById(attr);
        if (inputElement) {
            inputElement.value = attributes[attr];
            document.getElementById(`${attr}Value`).textContent = `${attributes[attr]}/10`;
        }
    });
    
    updateCharts();
    updateAnalysis();
}

// Calculate average for a cluster
function calculateClusterAverage(clusterKey) {
    const cluster = attributeClusters[clusterKey];
    const sum = cluster.attributes.reduce((acc, attr) => acc + attributes[attr], 0);
    return sum / cluster.attributes.length;
}

// Format attribute name from camelCase to Title Case with spaces
function formatAttributeName(attr) {
    return attr
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
}

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

// Initial analysis update
updateAnalysis();