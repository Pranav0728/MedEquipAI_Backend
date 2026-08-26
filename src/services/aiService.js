import Groq from 'groq-sdk';
import { config } from '../config/config.js';
import { calculateRiskScore } from './riskService.js';
import Equipment from '../models/Equipment.js';
import Maintenance from '../models/Maintenance.js';
import Breakdown from '../models/Breakdown.js';

const groq = new Groq({
    apiKey: config.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are MedEquipAI, an AI assistant for biomedical equipment management in hospitals. Your role is to analyze equipment data and provide maintenance recommendations.

IMPORTANT RULES:
- Do NOT claim or provide any medical diagnosis.
- Focus ONLY on equipment maintenance, safety, and operational recommendations.
- Be specific and actionable in your recommendations.
- When uncertain, recommend professional inspection by a certified biomedical engineer.
- Always prioritize patient safety.
- Structure your responses clearly with markdown sections.`;

export const analyzeEquipment = async (equipmentId) => {
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
        throw new Error('Equipment not found');
    }

    const [risk, maintenanceHistory, breakdownHistory] = await Promise.all([
        calculateRiskScore(equipment),
        Maintenance.find({ equipment: equipmentId }).sort({ scheduledDate: -1 }).limit(10),
        Breakdown.find({ equipment: equipmentId }).sort({ reportedDate: -1 }).limit(5),
    ]);

    const lastMaintenance = maintenanceHistory.find((m) => m.status === 'COMPLETED');
    const lastMaintenanceDate = lastMaintenance
        ? `${Math.max(0, Math.round((Date.now() - new Date(lastMaintenance.completedDate || lastMaintenance.updatedAt)) / (1000 * 60 * 60 * 24)))} days ago`
        : 'No completed maintenance records';

    const recentBreakdownDesc = breakdownHistory.length > 0
        ? breakdownHistory.slice(0, 3).map((b, i) => `${i + 1}. ${b.description} (Severity: ${b.severity}, Status: ${b.status})`).join('\n')
        : 'None in the last 6 months';

    const riskBreakdown = (risk.factors || [])
        .map((f) => `- ${f.type || 'factor'}: ${String(f.value)} (+${f.points} pts)`)
        .join('\n');

    const userPrompt = `
Analyze the following biomedical equipment data for a hospital.

=== EQUIPMENT DETAILS ===
- Name: ${equipment.name}
- Equipment ID: ${equipment.equipmentId}
- Category: ${equipment.category}
- Manufacturer: ${equipment.manufacturer}
- Model: ${equipment.model}
- Department: ${equipment.department}
- Location: ${equipment.location}
- Status: ${equipment.status}
- Criticality: ${equipment.criticality}
- Purchase Date: ${new Date(equipment.purchaseDate).toISOString().split('T')[0]}
- Equipment Age: ${risk.age} years

=== RISK ASSESSMENT ===
- Overall Risk Score: ${risk.score}/100
- Risk Level: ${risk.level}
- Last Maintenance Performed: ${lastMaintenanceDate}
- Number of Recent Breakdowns (6 months): ${risk.recentBreakdowns}

=== RECENT BREAKDOWNS ===
${recentBreakdownDesc}

=== RISK FACTORS (deterministic) ===
${riskBreakdown}

=== INSTRUCTIONS ===
Please provide a structured analysis using EXACTLY these sections (use markdown ## headings):

## 1. RISK INTERPRETATION
Explain what this risk level means in terms of hospital operations and patient safety.

## 2. POSSIBLE CAUSES
Identify 3-5 specific potential issues or failure modes supported by the data above.

## 3. RECOMMENDED ACTIONS
Provide a prioritized, numbered list of specific, actionable maintenance steps.

## 4. MAINTENANCE PRIORITY
Rate overall priority as IMMEDIATE / HIGH / MEDIUM / LOW, with a 1-sentence explanation of the timeline for service.`;

    const response = await groq.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 2000,
    });

    return {
        equipment: {
            _id: equipment._id,
            name: equipment.name,
            equipmentId: equipment.equipmentId,
            department: equipment.department,
        },
        riskScore: risk.score,
        riskLevel: risk.level,
        riskFactors: risk.factors,
        analysis: response.choices[0]?.message?.content || 'No analysis generated.',
    };
};

export const chatWithAI = async (equipmentId, userMessage, chatHistory = []) => {
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

    if (equipmentId) {
        const equipment = await Equipment.findById(equipmentId);
        if (equipment) {
            const [risk, maintenanceHistory, breakdownHistory] = await Promise.all([
                calculateRiskScore(equipment),
                Maintenance.find({ equipment: equipmentId }).sort({ scheduledDate: -1 }).limit(10),
                Breakdown.find({ equipment: equipmentId }).sort({ reportedDate: -1 }).limit(5),
            ]);

            const recentBreakdownsSummary = breakdownHistory.length > 0
                ? breakdownHistory.map((b) => `- ${b.description} [${b.severity}, ${b.status}]`).join('; ')
                : 'None reported recently';

            messages.push({
                role: 'system',
                content: `
You are currently answering questions specifically about this equipment. Use this context:

--- EQUIPMENT CONTEXT ---
Name: ${equipment.name} (${equipment.equipmentId})
Category: ${equipment.category} | Manufacturer: ${equipment.manufacturer} | Model: ${equipment.model}
Department: ${equipment.department} | Location: ${equipment.location}
Status: ${equipment.status} | Criticality: ${equipment.criticality}
Age: ${risk.age} years
Risk Score: ${risk.score}/100 (${risk.level})
Recent Breakdowns (6 months): ${risk.recentBreakdowns}
Total Maintenance Records: ${maintenanceHistory.length}
Recent Breakdown Detail: ${recentBreakdownsSummary}
Last Maintenance: ${maintenanceHistory.filter((m) => m.status === 'COMPLETED')[0]
                    ? `${Math.round((Date.now() - new Date(maintenanceHistory.filter((m) => m.status === 'COMPLETED')[0].completedDate)) / 86400000)} days ago`
                    : 'No completed maintenance'}
--- END CONTEXT ---

If the user's question is unrelated, gently redirect them to the equipment context or general biomed equipment management best practices. Always cite equipment-specific data when relevant. Keep answers concise and structured (use bullet points where possible).`,
            });
        }
    }

    if (Array.isArray(chatHistory)) {
        for (const msg of chatHistory.slice(-8)) {
            if (msg?.role && msg?.content) {
                messages.push({ role: msg.role, content: msg.content });
            }
        }
    }

    messages.push({ role: 'user', content: userMessage });

    const response = await groq.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages,
        temperature: 0.3,
        max_tokens: 1500,
    });

    return {
        response: response.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
    };
};