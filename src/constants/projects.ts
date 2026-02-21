export interface ProjectHighlight {
    id: string;
    title: string;
    description: string;
    challenge: string;
    recipe?: string;
    images: string[];
}

export interface ProjectStat {
    label: string;
    value: string;
}

export interface LaunchVideo {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
    type: "Short" | "Product Hunt" | "Full";
}

export interface Project {
    id: string;
    title: string;
    client: string;
    sector: string;
    year: string;
    tags: string[];
    image: string;
    mood: string;
    pitch: string;
    editorial: {
        headline: string;
        subhead: string;
        copy: string;
        images: string[];
    };
    process: {
        title: string;
        copy: string;
        images: string[];
    };
    highlights: ProjectHighlight[];
    engineering: {
        title: string;
        copy: string;
        signals: string[];
        images: string[];
    };
    statistics: ProjectStat[];
    launchVideos: LaunchVideo[];
    contributors: Array<{ name: string; role: string }>;
    schematic: {
        stack: string[];
        grid: string;
        typography: string;
        colors: string[];
    };
}

export const PROJECTS: Project[] = [
    {
        id: "sift",
        title: "SIFT",
        client: "Personal",
        sector: "Mobile · AI",
        year: "2025",
        tags: ["Full Stack", "UX of AI", "Mobile"],
        image: "/images/sift-v2.jpg",
        mood: "#8b9e6b",
        pitch: "AI-powered content curation — paste any URL, get an instant summary.",
        editorial: {
            headline: "Save Anything, Understand Everything",
            subhead: "Content Intelligence",
            copy: "Sift transforms how you save content from the internet. Paste any URL — TikTok, Instagram, YouTube, or the open web — and Sift instantly scrapes, summarizes, and organizes it into a beautiful feed. Built with an optimistic-insert architecture that makes saving feel instant, even while the backend orchestrates scrapers and AI in the background.",
            images: ["/images/sift-v2.jpg", "/images/sift-v2.jpg", "/images/sift-v2.jpg"],
        },
        process: {
            title: "The Rough",
            copy: "The process focused on mapping the transition from a messy browser history to a refined knowledge graph. We prototyped the 'Sift Thread'—a continuous stream of summaries that allows for rapid scanning of saved data.",
            images: ["/placeholder-rough-1.png"]
        },
        highlights: [
            {
                id: "curation",
                title: "Optimistic Curation",
                description: "I designed SIFT to feel like a digital extension of your memory. The UI reacts instantly even when the AI analysis is still pending.",
                challenge: "How do you maintain perceived speed when the backend requires 3-5 seconds for LLM processing?",
                recipe: "React Query + Optimistic Updates + Supabase Realtime",
                images: ["/images/sift-v2.jpg"],
            }
        ],
        engineering: {
            title: "Engineering",
            copy: "Implemented a multi-stage scavenging pipeline using Apify for headless scraping and GPT-4o for document vectorization and summarization. The architecture ensures data sovereignty while providing high-speed retrieval.",
            signals: ["Vector Search", "Headless Scraping", "Real-time Sync"],
            images: ["/placeholder-eng-1.png"]
        },
        statistics: [
            { label: "Components Built", value: "40+" },
            { label: "Data Migrations", value: "2" },
        ],
        launchVideos: [],
        contributors: [{ name: "Ryan Jun", role: "Founder & Engineer" }],
        schematic: {
            stack: ["React Native", "Supabase", "Vercel", "OpenAI GPT-4o", "Apify"],
            grid: "iOS HIG · 8px Baseline",
            typography: "SF Pro / SF Mono",
            colors: ["#8b9e6b", "#0a0a0a", "#faf9f7"],
        },
    },
    {
        id: "verbaitim",
        title: "VerbAItim",
        client: "Linguistic Preservation Initiative",
        sector: "AI / SaaS",
        year: "2026",
        tags: ["Design System", "Full Stack", "Linguistics"],
        image: "/images/verbaitim-hero.png",
        mood: "#4169E1",
        pitch: "High-precision linguistic SaaS bridging field documentation with pedagogical output.",
        editorial: {
            headline: "The future of language is verifiable data.",
            subhead: "Scientific Naturalism meets Awwwards-level Motion.",
            copy: "VerbAItim bridges the gap between field linguistics and diverse pedagogical output. By leveraging Allosaurus for universal phonetic capture and ByT5 for byte-level preservation, we create a 'Pipeline of Preservation' that ensures indigenous data sovereignty through rigorous Chain of Custody verification. The interface balances archival warmth with industrial precision, creating a digital workbench that feels both organic and surgical.",
            images: [
                "/images/verbaitim-hero.png",
                "/images/verbaitim-interface.png",
                "/images/verbaitim-hero.png",
                "/images/verbaitim-interface.png",
            ],
        },
        process: {
            title: "The Rough",
            copy: "Researching universal phonetic scripts and testing Allosaurus inference latency on mobile CPU. Sketches explored the 'Pipeline' metaphor—moving from raw audio to verified phonetic data.",
            images: ["/placeholder-rough-2.png"]
        },
        highlights: [
            {
                id: "phonetic",
                title: "Phonetic Precision",
                description: "Using Allosaurus for universal phonetic transcription across 2000+ languages.",
                challenge: "How do you visualize raw phonetic data for researchers while maintaining a consumer-grade UI?",
                recipe: "Web Audio API + SVG Visualizers + Allosaurus SDK",
                images: ["/images/verbaitim-interface.png"],
            }
        ],
        engineering: {
            title: "Engineering",
            copy: "Bridging phonetics with pedagogical data required a custom byte-level encoder using ByT5. We optimized the transformer inference to run on serverless workers while maintaining sub-second latency for real-time transcription.",
            signals: ["ByT5 Byte-Level", "Transformer Inference", "Audio Buffer Processing"],
            images: ["/placeholder-eng-2.png"]
        },
        statistics: [
            { label: "Impression", value: "50k+" },
            { label: "Features", value: "12" },
        ],
        launchVideos: [],
        contributors: [{ name: "Ryan Jun", role: "Design Lead" }],
        schematic: {
            stack: ["Next.js", "Framer Motion", "Lovable", "Allosaurus", "ByT5"],
            grid: "4px Industrial Precision",
            typography: "Instrument Serif / Inter",
            colors: ["#FAFAFA", "#0A0A0A", "#4169E1"],
        },
    },
    {
        id: "caliper",
        title: "CALIPER",
        client: "Internal Tooling",
        sector: "Design Systems",
        year: "2026",
        tags: ["Tooling", "Canvas API", "Low-Latency"],
        image: "/images/caliper-main.png",
        mood: "#FF4400",
        pitch: "Real-time visual guidance for structured thinking inside text fields.",
        editorial: {
            headline: "Precision measurement for thought.",
            subhead: "Automotive-Grade Input",
            copy: "Caliper lives inside existing text fields, providing real-time visual guidance. Designed with the rigor of high-end automotive displays, it enforces structured thinking through live color coding and floating dial controls. A rejection of playfulness in favor of pure instrument precision.",
            images: ["/images/caliper-main.png", "/images/caliper-main.png", "/images/caliper-main.png"],
        },
        process: {
            title: "The Rough",
            copy: "Inspired by vernier calipers and automotive dashboards. The initial sketches focused on the 'dial' metaphor—how to quantify semantic weight within a standard text input.",
            images: ["/placeholder-rough-3.png"]
        },
        highlights: [
            {
                id: "instrument",
                title: "Thought Instrument",
                description: "The UI acts as a vernier caliper for text, measuring semantic density in real-time.",
                challenge: "How do you provide complex visual feedback without distracting the user from the writing process?",
                recipe: "Canvas API + Low-Latency Input Buffers",
                images: ["/images/caliper-main.png"],
            }
        ],
        engineering: {
            title: "Engineering",
            copy: "The core measurement engine uses a custom buffer that intercepts keystrokes before they hit the DOM, calculating semantic density and returning coordinate shifts for the floating UI dials with <2ms jitter.",
            signals: ["Input Buffer Interception", "Jitter <2ms", "Canvas Rendering"],
            images: ["/placeholder-eng-3.png"]
        },
        statistics: [
            { label: "Latency", value: "2ms" },
            { label: "Components", value: "8" },
        ],
        launchVideos: [],
        contributors: [{ name: "Ryan Jun", role: "Developer" }],
        schematic: {
            stack: ["React", "Canvas API", "Local-First"],
            grid: "Dense Monospace",
            typography: "JetBrains Mono / Inter",
            colors: ["#E5E5E5", "#FF4400", "#111111"],
        },
    },
];
