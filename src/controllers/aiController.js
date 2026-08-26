import { successResponse, errorResponse } from '../utils/response.js';
import { analyzeEquipment, chatWithAI } from '../services/aiService.js';
import { config } from '../config/config.js';

const GROQ_CONFIGURED = !!(config.GROQ_API_KEY && config.GROQ_API_KEY.length > 20);

export const analyze = async (req, res, next) => {
    try {
        const { equipmentId } = req.body;
        if (!equipmentId) {
            return errorResponse(res, 'Equipment ID is required', 400);
        }

        if (!GROQ_CONFIGURED) {
            return successResponse(
                res,
                {
                    equipment: { _id: equipmentId },
                    riskScore: 75,
                    riskLevel: 'HIGH',
                    analysis: `⚠️ **DEMO MODE - Groq API key not configured**

Below is a simulated equipment analysis. Configure your GROQ_API_KEY in the backend .env file for real AI-powered analysis.

---

## 1. RISK INTERPRETATION

This equipment has a **HIGH** risk score (75/100). This indicates that the equipment requires significant maintenance attention to ensure reliable operation. In a hospital setting, unaddressed maintenance issues could impact patient care and equipment availability.

## 2. POSSIBLE CAUSES

Based on the equipment data pattern:
• Possible component wear due to equipment age
• Inadequate preventive maintenance frequency
• Potential environmental factors (temperature, humidity)
• Usage patterns exceeding design specifications

## 3. RECOMMENDED ACTIONS

✓ **Immediate:** Schedule a full diagnostic inspection by a certified biomedical engineer
✓ **Short-term:** Review and update preventive maintenance schedule
✓ **Medium-term:** Check for manufacturer recalls or firmware updates
✓ **Documentation:** Verify calibration records and maintenance logs

## 4. MAINTENANCE PRIORITY

**Priority: HIGH**

This equipment should be scheduled for maintenance within the next 3-5 business days. If this equipment supports critical care functions, consider scheduling immediately and arranging backup equipment if available.`,
                },
                'Demo analysis provided - configure Groq API key for real AI analysis'
            );
        }

        const result = await analyzeEquipment(equipmentId);
        successResponse(res, result, 'Equipment analysis completed');
    } catch (error) {
        console.error('AI analyze error:', error);
        return errorResponse(res, error?.message || 'AI analysis failed', 500);
    }
};

export const chat = async (req, res, next) => {
    try {
        const { equipmentId, message, chatHistory } = req.body;
        if (!message) {
            return errorResponse(res, 'Message is required', 400);
        }

        if (!GROQ_CONFIGURED) {
            const demoResponses = {
                risk: `Based on the current equipment data, this unit shows a **HIGH risk** profile. Key contributors:
• Equipment age exceeds typical service life
• Recent breakdown history indicates recurring issues
• Maintenance intervals may need adjustment

I recommend prioritizing this equipment for inspection within 5 business days.`,
                maintenance: `Recommended maintenance steps:
1. **Full diagnostic check** by certified engineer
2. **Clean and inspect** all accessible components
3. **Calibration verification** using calibrated test equipment
4. **Firmware/Software check** for latest manufacturer updates
5. **Documentation update** with all findings

Always follow manufacturer service manual procedures.`,
                breakdowns: `Summary of recent breakdown patterns:
• Frequency: Suggests underlying wear or usage issues
• Root causes often include: component degradation, environmental stress, inadequate servicing
• Recommendation: Investigate for systemic issues rather than isolated failures

Consider preventive schedule adjustment if breakdowns continue.`,
                engineer: `The engineer should focus on these key checks:
🔍 **Cooling/ventilation systems** - fans, filters, heat sinks
🔍 **Electrical connections** - power supplies, cabling, grounds
🔍 **Sensor calibration** - accuracy verification
🔍 **Wear indicators** - belts, seals, moving parts
🔍 **Error logs** - review for recurring error codes
🔍 **Manufacturer bulletins** - any relevant recalls or advisories

Document all findings and take photos for the service record.`,
            };

            const lowerMsg = message.toLowerCase();
            let demoReply = demoResponses.risk;
            if (lowerMsg.includes('maintenance')) demoReply = demoResponses.maintenance;
            else if (lowerMsg.includes('breakdown') || lowerMsg.includes('issue')) demoReply = demoResponses.breakdowns;
            else if (lowerMsg.includes('engineer') || lowerMsg.includes('check')) demoReply = demoResponses.engineer;

            return successResponse(
                res,
                {
                    response: `**🤖 MedEquipAI Copilot (Demo Mode)**

${demoReply}

---
*Configure GROQ_API_KEY in your backend .env for full AI-powered conversations with equipment context.*`,
                },
                'Demo chat response provided'
            );
        }

        const result = await chatWithAI(equipmentId, message, chatHistory || []);
        successResponse(res, result, 'Chat response generated');
    } catch (error) {
        console.error('AI chat error:', error);
        return errorResponse(res, error?.message || 'AI chat failed', 500);
    }
};