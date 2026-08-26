import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import User from '../src/models/User.js';
import Equipment from '../src/models/Equipment.js';
import Maintenance from '../src/models/Maintenance.js';
import Breakdown from '../src/models/Breakdown.js';

const seed = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');

        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Equipment.deleteMany({});
        await Maintenance.deleteMany({});
        await Breakdown.deleteMany({});
        console.log('✅ Existing data cleared');

        console.log('🌱 Seeding Users...');
        const users = await User.create([
            {
                name: 'Hospital Admin',
                email: 'admin@medequipai.com',
                password: 'admin123',
                role: 'HOSPITAL_ADMIN',
            },
            {
                name: 'Sarah Johnson',
                email: 'sarah@medequipai.com',
                password: 'engineer123',
                role: 'SERVICE_ENGINEER',
            },
            {
                name: 'Mike Chen',
                email: 'mike@medequipai.com',
                password: 'engineer123',
                role: 'SERVICE_ENGINEER',
            },
        ]);
        console.log(`✅ ${users.length} users created`);
        console.log('   Login: admin@medequipai.com / admin123');

        console.log('🌱 Seeding Equipment...');
        const equipmentData = [
            {
                equipmentId: 'EQ-1001', name: 'Ventilator V-102', category: 'Respiratory',
                manufacturer: 'MedTech', model: 'VT-500', serialNumber: 'VT500-7821',
                department: 'ICU', location: 'ICU-01', status: 'ACTIVE',
                criticality: 'HIGH', purchaseDate: '2019-05-10',
                lastMaintenanceDate: '2026-06-15', nextMaintenanceDate: '2026-08-28',
            },
            {
                equipmentId: 'EQ-1002', name: 'Infusion Pump IP-205', category: 'Infusion',
                manufacturer: 'CareFusion', model: 'IP-2000', serialNumber: 'IP2K-4412',
                department: 'ICU', location: 'ICU-03', status: 'ACTIVE',
                criticality: 'HIGH', purchaseDate: '2020-02-20',
                lastMaintenanceDate: '2026-07-20', nextMaintenanceDate: '2026-09-20',
            },
            {
                equipmentId: 'EQ-1003', name: 'ECG Machine ECG-301', category: 'Cardiology',
                manufacturer: 'GE Healthcare', model: 'MAC-5500', serialNumber: 'MAC55-9982',
                department: 'Cardiology', location: 'CARD-02', status: 'ACTIVE',
                criticality: 'MEDIUM', purchaseDate: '2022-11-05',
                lastMaintenanceDate: '2026-08-01', nextMaintenanceDate: '2026-11-01',
            },
            {
                equipmentId: 'EQ-1004', name: 'Defibrillator DEF-407', category: 'Emergency',
                manufacturer: 'Philips', model: 'HeartStart XL+', serialNumber: 'HSXL-2234',
                department: 'ER', location: 'ER-Triage', status: 'MAINTENANCE',
                criticality: 'HIGH', purchaseDate: '2021-04-18',
                lastMaintenanceDate: '2026-03-10', nextMaintenanceDate: '2026-08-25',
            },
            {
                equipmentId: 'EQ-1005', name: 'Patient Monitor PM-512', category: 'Monitoring',
                manufacturer: 'Mindray', model: 'BeneView T8', serialNumber: 'BVT8-1156',
                department: 'ICU', location: 'ICU-05', status: 'ACTIVE',
                criticality: 'HIGH', purchaseDate: '2018-09-22',
                lastMaintenanceDate: '2026-05-15', nextMaintenanceDate: '2026-09-15',
            },
            {
                equipmentId: 'EQ-1006', name: 'Ultrasound US-603', category: 'Imaging',
                manufacturer: 'Siemens', model: 'Acuson X700', serialNumber: 'AX7-8823',
                department: 'Radiology', location: 'RAD-03', status: 'ACTIVE',
                criticality: 'MEDIUM', purchaseDate: '2021-07-12',
                lastMaintenanceDate: '2026-06-20', nextMaintenanceDate: '2026-12-20',
            },
            {
                equipmentId: 'EQ-1007', name: 'X-Ray Machine XR-701', category: 'Imaging',
                manufacturer: 'Siemens', model: 'Multix Fusion', serialNumber: 'MFU-5501',
                department: 'Radiology', location: 'RAD-01', status: 'ACTIVE',
                criticality: 'HIGH', purchaseDate: '2019-01-08',
                lastMaintenanceDate: '2026-04-10', nextMaintenanceDate: '2026-10-10',
            },
            {
                equipmentId: 'EQ-1008', name: 'Anesthesia Machine AN-804', category: 'Anesthesia',
                manufacturer: 'Draeger', model: 'Fabius GS', serialNumber: 'FABGS-3321',
                department: 'OR', location: 'OR-02', status: 'ACTIVE',
                criticality: 'HIGH', purchaseDate: '2017-12-03',
                lastMaintenanceDate: '2026-02-15', nextMaintenanceDate: '2026-08-15',
            },
            {
                equipmentId: 'EQ-1009', name: 'Syringe Pump SP-915', category: 'Infusion',
                manufacturer: 'B. Braun', model: 'Perfusor Space', serialNumber: 'PSP-7789',
                department: 'ICU', location: 'ICU-02', status: 'ACTIVE',
                criticality: 'MEDIUM', purchaseDate: '2022-03-25',
                lastMaintenanceDate: '2026-07-05', nextMaintenanceDate: '2026-10-05',
            },
            {
                equipmentId: 'EQ-1010', name: 'Dialysis Machine DI-022', category: 'Dialysis',
                manufacturer: 'Fresenius', model: '5008 Cordiax', serialNumber: '5008C-2245',
                department: 'Dialysis', location: 'DIAL-05', status: 'ACTIVE',
                criticality: 'HIGH', purchaseDate: '2020-08-14',
                lastMaintenanceDate: '2026-06-28', nextMaintenanceDate: '2026-09-28',
            },
            {
                equipmentId: 'EQ-1011', name: 'CT Scanner CT-031', category: 'Imaging',
                manufacturer: 'GE Healthcare', model: 'Revolution EVO', serialNumber: 'REV-1110',
                department: 'Radiology', location: 'RAD-02', status: 'ACTIVE',
                criticality: 'HIGH', purchaseDate: '2020-11-30',
                lastMaintenanceDate: '2026-07-10', nextMaintenanceDate: '2027-01-10',
            },
            {
                equipmentId: 'EQ-1012', name: 'MRI Machine MRI-042', category: 'Imaging',
                manufacturer: 'Siemens', model: 'MAGNETOM Vida', serialNumber: 'MMV-0042',
                department: 'Radiology', location: 'RAD-MRI', status: 'INACTIVE',
                criticality: 'HIGH', purchaseDate: '2019-10-22',
                lastMaintenanceDate: '2026-01-20', nextMaintenanceDate: '2026-07-20',
            },
            {
                equipmentId: 'EQ-1013', name: 'Ventilator V-108', category: 'Respiratory',
                manufacturer: 'Hamilton', model: 'G5', serialNumber: 'HG5-0205',
                department: 'ICU', location: 'ICU-04', status: 'ACTIVE',
                criticality: 'HIGH', purchaseDate: '2021-05-12',
                lastMaintenanceDate: '2026-08-05', nextMaintenanceDate: '2026-11-05',
            },
            {
                equipmentId: 'EQ-1014', name: 'Pulse Oximeter PO-119', category: 'Monitoring',
                manufacturer: 'Masimo', model: 'Radical-7', serialNumber: 'RAD7-3344',
                department: 'ER', location: 'ER-Bed-03', status: 'ACTIVE',
                criticality: 'LOW', purchaseDate: '2023-01-18',
                lastMaintenanceDate: '2026-07-12', nextMaintenanceDate: '2027-01-12',
            },
            {
                equipmentId: 'EQ-1015', name: 'Blood Gas Analyzer BG-055', category: 'Laboratory',
                manufacturer: 'Radiometer', model: 'ABL90', serialNumber: 'ABL90-5555',
                department: 'ICU', location: 'ICU-Lab', status: 'ACTIVE',
                criticality: 'MEDIUM', purchaseDate: '2021-09-28',
                lastMaintenanceDate: '2026-06-05', nextMaintenanceDate: '2026-09-05',
            },
            {
                equipmentId: 'EQ-1016', name: 'IV Pump IV-188', category: 'Infusion',
                manufacturer: 'Medline', model: 'IV-Pump Pro', serialNumber: 'IVPP-0881',
                department: 'General Ward', location: 'WARD-A-12', status: 'ACTIVE',
                criticality: 'MEDIUM', purchaseDate: '2022-06-15',
                lastMaintenanceDate: '2026-05-22', nextMaintenanceDate: '2026-08-22',
            },
            {
                equipmentId: 'EQ-1017', name: 'Nebulizer NB-201', category: 'Respiratory',
                manufacturer: 'DeVilbiss', model: 'PulmoNeb', serialNumber: 'PNEB-2201',
                department: 'Pediatrics', location: 'PED-07', status: 'ACTIVE',
                criticality: 'LOW', purchaseDate: '2023-04-08',
                lastMaintenanceDate: '2026-06-30', nextMaintenanceDate: '2026-12-30',
            },
            {
                equipmentId: 'EQ-1018', name: 'Surgical Light SL-303', category: 'Surgical',
                manufacturer: 'Trumpf', model: 'iLED 7', serialNumber: 'ILED7-0108',
                department: 'OR', location: 'OR-01', status: 'ACTIVE',
                criticality: 'MEDIUM', purchaseDate: '2020-12-05',
                lastMaintenanceDate: '2026-04-18', nextMaintenanceDate: '2026-10-18',
            },
            {
                equipmentId: 'EQ-1019', name: 'Suction Pump SU-112', category: 'Surgical',
                manufacturer: 'Medela', model: 'Vario 18', serialNumber: 'MV18-0212',
                department: 'OR', location: 'OR-03', status: 'MAINTENANCE',
                criticality: 'MEDIUM', purchaseDate: '2021-11-22',
                lastMaintenanceDate: '2026-03-08', nextMaintenanceDate: '2026-09-08',
            },
            {
                equipmentId: 'EQ-1020', name: 'AED AED-050', category: 'Emergency',
                manufacturer: 'Zoll', model: 'AED Plus', serialNumber: 'AEDP-0500',
                department: 'ER', location: 'ER-Hallway', status: 'ACTIVE',
                criticality: 'HIGH', purchaseDate: '2022-08-14',
                lastMaintenanceDate: '2026-07-25', nextMaintenanceDate: '2027-01-25',
            },
        ];

        const equipment = await Equipment.create(equipmentData);
        console.log(`✅ ${equipment.length} equipment records created`);

        console.log('🌱 Seeding Maintenance Records...');
        const maintenanceData = [];
        const maintenanceTypes = ['PREVENTIVE', 'CORRECTIVE'];
        const maintenanceStatuses = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'];

        for (let i = 0; i < 30; i++) {
            const equip = equipment[i % equipment.length];
            const isPast = i < 22;
            const isFuture = !isPast;
            let baseDate;

            if (isPast) {
                baseDate = new Date(2026, 4 + Math.floor(i / 5), 1 + (i % 28) + 1);
            } else {
                baseDate = new Date(2026, 7, 20 + (i % 12) + 1);
            }

            let status;
            const now = new Date();
            if (isPast && i < 18) status = 'COMPLETED';
            else if (isPast && baseDate < now) status = Math.random() > 0.5 ? 'OVERDUE' : 'COMPLETED';
            else if (isFuture && (i % 3) === 0) status = 'IN_PROGRESS';
            else status = 'SCHEDULED';

            maintenanceData.push({
                equipment: equip._id,
                type: i % 4 === 0 ? 'CORRECTIVE' : 'PREVENTIVE',
                scheduledDate: baseDate,
                completedDate: status === 'COMPLETED'
                    ? new Date(baseDate.getTime() + (Math.random() * 2 + 1) * 24 * 60 * 60 * 1000)
                    : undefined,
                engineer: status !== 'SCHEDULED' && status !== 'OVERDUE'
                    ? (i % 2 === 0 ? users[1].name : users[2].name)
                    : undefined,
                status,
                notes: generateMaintenanceNote(equip.name, status, isPast ? 'CORRECTIVE' : 'PREVENTIVE'),
            });
        }

        const maintenance = await Maintenance.create(maintenanceData);
        console.log(`✅ ${maintenance.length} maintenance records created`);

        console.log('🌱 Seeding Breakdown Records...');
        const breakdownData = [];
        const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

        const breakdownTemplates = {
            'Ventilator': [
                { severity: 'HIGH', desc: 'Alarm system malfunction - high pressure alarms not triggering' },
                { severity: 'CRITICAL', desc: 'Repeated overheating during prolonged use - auto-shutdown at 6hrs' },
                { severity: 'MEDIUM', desc: 'Tidal volume delivery variance exceeding ±10% tolerance' },
                { severity: 'CRITICAL', desc: 'Oxygen sensor failure - readings inconsistent with analyzer' },
            ],
            'Infusion Pump': [
                { severity: 'HIGH', desc: 'Flow rate accuracy issue - delivering 8% below programmed rate' },
                { severity: 'MEDIUM', desc: 'Occlusion alarm not triggering at low pressure thresholds' },
                { severity: 'HIGH', desc: 'Intermittent power loss when running on battery' },
            ],
            'ECG': [
                { severity: 'MEDIUM', desc: 'Lead II waveform showing intermittent noise artifacts' },
            ],
            'Defibrillator': [
                { severity: 'CRITICAL', desc: 'Battery fails self-test - must be replaced' },
                { severity: 'HIGH', desc: 'Paddle connector corrosion detected - causing poor contact' },
            ],
            'Patient Monitor': [
                { severity: 'HIGH', desc: 'SpO2 readings dropping unexpectedly - suspect probe connector' },
                { severity: 'MEDIUM', desc: 'NIBP calibration off by ~10 mmHg - needs recalibration' },
                { severity: 'CRITICAL', desc: 'Monitor intermittently freezes - requires hard reboot' },
            ],
            'Anesthesia': [
                { severity: 'CRITICAL', desc: 'Vaporizer output inconsistent across concentrations' },
                { severity: 'HIGH', desc: 'CO2 absorber canister seal leaking slightly' },
                { severity: 'CRITICAL', desc: 'Ventilator mode not engaging - stuck in manual mode' },
                { severity: 'HIGH', desc: 'Gas analyzer drift detected in O2 readings' },
            ],
            'Dialysis': [
                { severity: 'HIGH', desc: 'Blood leak detector giving false positives' },
                { severity: 'CRITICAL', desc: 'UF (Ultrafiltration) control system miscalibrated' },
            ],
            'Ultrasound': [
                { severity: 'LOW', desc: 'Minor image artifacts with convex probe at depth >15cm' },
            ],
            'CT': [
                { severity: 'HIGH', desc: 'Tube arcing detected on high mAs protocols' },
            ],
            'Syringe Pump': [
                { severity: 'MEDIUM', desc: 'Near-empty alarm sounding prematurely (3-4 mL remaining)' },
            ],
            'Surgical Light': [
                { severity: 'MEDIUM', desc: 'Flickering noticed on lowest intensity setting' },
            ],
            'Suction Pump': [
                { severity: 'MEDIUM', desc: 'Vacuum pressure not reaching target - possible seal issue' },
            ],
            'Blood Gas': [
                { severity: 'HIGH', desc: 'pH sensor drift - QC results 0.03 pH low' },
            ],
        };

        let bid = 0;
        for (let i = 0; i < equipment.length && bid < 15; i++) {
            const equip = equipment[i];
            const key = Object.keys(breakdownTemplates).find(k => equip.name.includes(k));
            if (!key) continue;

            const templates = breakdownTemplates[key];
            const numBreakdowns = equip.name.includes('Ventilator V-102') ? 4
                : equip.name.includes('Anesthesia') ? 4
                : equip.name.includes('Patient Monitor PM-512') ? 3
                : equip.name.includes('Infusion Pump') ? 2
                : Math.max(1, Math.floor(Math.random() * templates.length));

            for (let j = 0; j < numBreakdowns && bid < 15; j++) {
                const template = templates[j % templates.length];
                const daysAgo = Math.floor(Math.random() * 120) + 1;
                const reportedDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

                let status;
                if (daysAgo > 60) status = 'RESOLVED';
                else if (daysAgo > 14) status = Math.random() > 0.4 ? 'RESOLVED' : 'IN_PROGRESS';
                else if (daysAgo > 7) status = Math.random() > 0.5 ? 'IN_PROGRESS' : 'OPEN';
                else status = Math.random() > 0.7 ? 'IN_PROGRESS' : 'OPEN';

                breakdownData.push({
                    equipment: equip._id,
                    severity: template.severity,
                    description: template.desc,
                    reportedDate,
                    status,
                    rootCause: status !== 'OPEN'
                        ? generateRootCause(template.desc)
                        : undefined,
                    resolution: status === 'RESOLVED'
                        ? generateResolution(template.desc, equip.name, users[j % 2 + 1].name)
                        : undefined,
                });
                bid++;
            }
        }

        const breakdowns = await Breakdown.create(breakdownData);
        console.log(`✅ ${breakdowns.length} breakdown records created`);

        console.log('\n🎉 SEEDING COMPLETE!');
        console.log('='.repeat(50));
        console.log('📊 Database summary:');
        console.log(`   👤 Users: ${users.length}`);
        console.log(`   🏥 Equipment: ${equipment.length}`);
        console.log(`   🔧 Maintenance: ${maintenance.length}`);
        console.log(`   ⚠️  Breakdowns: ${breakdowns.length}`);
        console.log('='.repeat(50));
        console.log('🔑 Default login:');
        console.log('   Email: admin@medequipai.com');
        console.log('   Password: admin123');
        console.log('='.repeat(50));

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

function generateMaintenanceNote(equipName, status, type) {
    if (type === 'PREVENTIVE') {
        if (status === 'COMPLETED') {
            return `Routine preventive maintenance completed. All systems checked and within specifications. Calibration verified. Filters cleaned.`;
        } else if (status === 'SCHEDULED') {
            return `Scheduled preventive maintenance. Includes: calibration check, filter replacement, safety verification.`;
        } else if (status === 'OVERDUE') {
            return `URGENT: Preventive maintenance is OVERDUE. Equipment may be at risk of failure.`;
        } else {
            return `In progress - performing standard preventive checks.`;
        }
    } else {
        if (status === 'COMPLETED') {
            return `Corrective maintenance completed. Root cause addressed and verified.`;
        } else if (status === 'SCHEDULED') {
            return `Corrective maintenance scheduled to address reported issue.`;
        } else if (status === 'OVERDUE') {
            return `URGENT: Corrective maintenance is OVERDUE. Equipment requires immediate attention.`;
        } else {
            return `Diagnosing reported issue. Parts ordered if needed.`;
        }
    }
}

function generateRootCause(description) {
    if (description.toLowerCase().includes('sensor')) return 'Sensor degradation due to normal wear and contamination buildup. Calibration drift identified.';
    if (description.toLowerCase().includes('overheat')) return 'Dust accumulation in cooling ducts restricting airflow. Thermal paste on CPU degraded causing poor heat transfer.';
    if (description.toLowerCase().includes('battery')) return 'Battery at end-of-life cycle (520 charge cycles). Failed capacity test at 62% of rated capacity.';
    if (description.toLowerCase().includes('alarm') || description.toLowerCase().includes('alarm system')) return 'Loose wiring connector on alarm PCB. Vibration induced intermittent contact.';
    if (description.toLowerCase().includes('flow') || description.toLowerCase().includes('pump')) return 'Pump mechanism calibration drift. Slight occlusion detected in outlet tubing assembly.';
    if (description.toLowerCase().includes('probe') || description.toLowerCase().includes('connector')) return 'Connector pins tarnished from repeated insertion cycles. Signal degradation at contact interface.';
    if (description.toLowerCase().includes('seal') || description.toLowerCase().includes('leak')) return 'Gasket seal compression set after prolonged use. Material fatigue.';
    if (description.toLowerCase().includes('vaporizer')) return 'Vaporizer concentration sensor requiring recalibration. Service interval exceeded.';
    if (description.toLowerCase().includes('freeze') || description.toLowerCase().includes('monitor')) return 'Software memory leak in monitoring module. Firmware update needed.';
    if (description.toLowerCase().includes('arc')) return 'Tube nearing end of useful life (35k exposures). Anode surface micro-cracks causing arcing.';
    return 'Component wear due to normal usage. Scheduled replacement recommended.';
}

function generateResolution(description, equipName, engineer) {
    const base = `Service performed by ${engineer}. `;
    if (description.toLowerCase().includes('sensor')) return base + 'Sensor replaced and recalibrated per manufacturer procedure. Post-service QC passed with ±1% accuracy.';
    if (description.toLowerCase().includes('overheat')) return base + 'Cooling system fully disassembled and cleaned. Thermal paste replaced. Stress test passed at 8 hours continuous use.';
    if (description.toLowerCase().includes('battery')) return base + 'New OEM replacement battery installed. Performed 3 full charge-discharge cycles. Capacity verified at 98% of specification.';
    if (description.toLowerCase().includes('alarm')) return base + 'Alarm circuit board reseated and connectors replaced. Full alarm functional test: all 12 alarm triggers verified.';
    if (description.toLowerCase().includes('pump') || description.toLowerCase().includes('flow')) return base + 'Pump head mechanism recalibrated using certified flow meter. Flow rate accuracy now within ±2% across all rates.';
    if (description.toLowerCase().includes('probe') || description.toLowerCase().includes('connector')) return base + 'Connector assembly replaced with new OEM part. Gold-plated pins now providing stable readings. Tested over 100 insertions.';
    if (description.toLowerCase().includes('seal') || description.toLowerCase().includes('leak')) return base + 'New gasket and seals installed. Pressure decay test passed: <0.1 mmHg leak over 5 minutes.';
    if (description.toLowerCase().includes('vaporizer')) return base + 'Vaporizer recalibrated at 1%, 2%, 3%, 5% concentrations. All readings within ±0.1%. Service sticker applied.';
    if (description.toLowerCase().includes('freeze')) return base + 'Firmware updated to latest manufacturer revision. Memory management patch applied. 48-hour burn-in test passed.';
    if (description.toLowerCase().includes('arc')) return base + 'Tube replaced with refurbished OEM unit. System recalibrated. HV generator tested at max output. All phantom images within tolerance.';
    return base + 'Component replaced and system tested. All post-service QC checks passed.';
}

seed();