/**
 * Seed script — inserts teacher records into MongoDB via the live API.
 * Run from project root:  node backend/seed/seedTeachers.js
 *
 * The backend must be running on port 9000 first:
 *   cd backend && node index.js
 */

const http = require("http");

const BASE_URL = "http://localhost:9000/api/Teacher";

const TEACHERS = [
    {
        Logo: "JG",
        Name: "Johan Gao",
        Title: "Senior Python & Data Science Mentor",
        Discprition:
            "An industry veteran with over 8 years of Python backend and machine learning experience. Johan tutors students on building robust REST APIs with Flask, Pandas data models, automation scripts, and exam preparation for university-level Python courses. His live sessions are packed with real-world examples from production codebases.",
        Exprience: "8+ Years",
        Rating: 4.9,
        Status: "active",
        ID: "TEACH-001",
        Qualification: "MCA",
        JoinDate: "2022-06-15",
        Gender: "Male",
        PhoneNo: 9876543210,
        Email: "johan.gao@devcoaching.com",
    },
    {
        Logo: "AP",
        Name: "Aria Patel",
        Title: "Senior Frontend & React Specialist",
        Discprition:
            "Frontend enthusiast and UI/UX advocate with 6 years building production-grade React applications. Aria specialises in teaching JavaScript fundamentals, component architecture, hooks, state management with Redux, and single-page applications. She has helped 500+ students land frontend developer roles at top companies.",
        Exprience: "6+ Years",
        Rating: 4.8,
        Status: "active",
        ID: "TEACH-002",
        Qualification: "BCA",
        JoinDate: "2022-09-01",
        Gender: "Female",
        PhoneNo: 9876543211,
        Email: "aria.patel@devcoaching.com",
    },
    {
        Logo: "MV",
        Name: "Marcus Vance",
        Title: "Backend Architect & Database Lead",
        Discprition:
            "Database administrator and server-side expert with 10 years of industry experience. Marcus covers Node.js, Express REST APIs, MongoDB aggregation pipelines, authentication with JWT, and backend security practices required for enterprise-grade systems. His MERN stack curriculum is one of the most comprehensive in the industry.",
        Exprience: "10 Years",
        Rating: 4.7,
        Status: "active",
        ID: "TEACH-003",
        Qualification: "B.Tech CSE",
        JoinDate: "2023-01-10",
        Gender: "Male",
        PhoneNo: 9876543212,
        Email: "marcus.vance@devcoaching.com",
    },
    {
        Logo: "SP",
        Name: "Sneha Pillai",
        Title: "UI/UX Design & Figma Expert",
        Discprition:
            "Senior designer with 5 years of experience crafting digital products for startups and Fortune 500 companies. Sneha teaches user research, wireframing, high-fidelity prototyping in Figma, design systems, mobile-first layouts, and developer handoff. Her portfolio-driven approach ensures students graduate with real, hireable work.",
        Exprience: "5+ Years",
        Rating: 4.9,
        Status: "active",
        ID: "TEACH-004",
        Qualification: "BCA",
        JoinDate: "2023-03-20",
        Gender: "Female",
        PhoneNo: 9876543213,
        Email: "sneha.pillai@devcoaching.com",
    },
];

function postTeacher(teacher) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(teacher);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(body),
            },
        };

        const url = new URL(BASE_URL);
        options.hostname = url.hostname;
        options.port = url.port || 80;
        options.path = url.pathname;

        const req = http.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, body: parsed, name: teacher.Name });
                } catch {
                    resolve({ status: res.statusCode, body: data, name: teacher.Name });
                }
            });
        });

        req.on("error", reject);
        req.write(body);
        req.end();
    });
}

async function seed() {
    console.log("🌱  Seeding teachers into MongoDB via API...\n");

    for (const teacher of TEACHERS) {
        try {
            const result = await postTeacher(teacher);
            if (result.status === 201) {
                console.log(`  ✅  ${result.name} — inserted`);
            } else if (result.status === 200 && result.body?.message?.includes("Already")) {
                console.log(`  ℹ️   ${result.name} — already exists (skipped)`);
            } else {
                console.log(`  ⚠️   ${result.name} — HTTP ${result.status}:`, result.body);
            }
        } catch (err) {
            console.error(`  ❌  ${teacher.Name} — error:`, err.message);
        }
    }

    console.log("\n✨  Seeding complete!");
}

seed();
